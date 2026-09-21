import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./FloatingAIAssistant.css";

export type FloatingAIAssistantProps = {
  onOpen: () => void;
  isOpen?: boolean;
  label?: string;
};

export default function FloatingAIAssistant({
  onOpen,
  isOpen = false,
  label = "Open Portfolio AI Assistant",
}: FloatingAIAssistantProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hoveredRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  const onOpenRef = useRef(onOpen);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.82, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x171b23,
        roughness: 0.24,
        metalness: 0.84,
        clearcoat: 0.9,
        clearcoatRoughness: 0.22,
        flatShading: true,
      })
    );

    const lattice = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.835, 0),
      new THREE.MeshBasicMaterial({
        color: 0xc48e52,
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      })
    );

    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 18, 18),
      new THREE.MeshStandardMaterial({
        color: 0xe4a45e,
        emissive: 0x9a5f20,
        emissiveIntensity: 0.85,
        roughness: 0.3,
        metalness: 0.15,
      })
    );

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.018, 12, 72),
      new THREE.MeshStandardMaterial({
        color: 0x2c3340,
        roughness: 0.4,
        metalness: 0.85,
      })
    );
    ring.rotation.x = Math.PI / 3.25;
    ring.rotation.z = -Math.PI / 9;

    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xf0b56d })
    );

    group.add(core, lattice, nucleus, ring, beacon);
    scene.add(group);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb6c0cd, 1.35));

    const warmKey = new THREE.PointLight(0xf2bc78, 2.1, 8);
    warmKey.position.set(2.2, 1.5, 2.8);
    scene.add(warmKey);

    const coolFill = new THREE.PointLight(0x94a3b8, 1.15, 7);
    coolFill.position.set(-2.2, -0.8, 2.2);
    scene.add(coolFill);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const w = Math.max(rect.width, 1);
      const h = Math.max(rect.height, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let raf = 0;
    let disposed = false;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let targetLift = 1;
    let pointerInfluence = 0;
    const clock = new THREE.Clock();

    const handlePointerMove = (event: PointerEvent) => {
      const button = buttonRef.current;
      if (!button) return;
      const r = button.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);
      const radius = 260;
      pointerInfluence = Math.max(0, 1 - distance / radius);
      targetTiltY = THREE.MathUtils.clamp((dx / radius) * 0.22, -0.22, 0.22);
      targetTiltX = THREE.MathUtils.clamp((-dy / radius) * 0.18, -0.18, 0.18);
      targetLift = 1 + pointerInfluence * 0.08;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const render = () => {
      if (disposed) return;
      raf = requestAnimationFrame(render);

      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        group.position.y = Math.sin(elapsed * 1.15) * 0.075;
        group.position.z = Math.cos(elapsed * 0.95) * 0.035;
        group.rotation.y += 0.0031;
        group.rotation.x = THREE.MathUtils.lerp(
          group.rotation.x,
          0.05 + targetTiltX * pointerInfluence,
          0.07
        );
        group.rotation.z = THREE.MathUtils.lerp(
          group.rotation.z,
          -0.035 + targetTiltY * pointerInfluence,
          0.07
        );

        nucleus.scale.setScalar(1 + Math.sin(elapsed * 2.4) * 0.08);

        const a = elapsed * 0.72;
        beacon.position.set(Math.cos(a) * 1.22, Math.sin(a) * 1.22, 0);

        const hoverRingScale = hoveredRef.current ? 1.08 : 1;
        ring.scale.lerp(
          new THREE.Vector3(hoverRingScale, hoverRingScale, hoverRingScale),
          0.08
        );

        const next = isOpenRef.current ? 0.62 : targetLift;
        group.scale.lerp(new THREE.Vector3(next, next, next), 0.1);

        warmKey.intensity = 2.1 + pointerInfluence * 0.5 + (hoveredRef.current ? 0.25 : 0);
      } else {
        group.rotation.set(0.15, 0.45, 0);
        group.scale.setScalar(isOpenRef.current ? 0.62 : 1);
      }

      renderer.render(scene, camera);
    };

    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);

      [core.geometry, lattice.geometry, nucleus.geometry, ring.geometry, beacon.geometry].forEach(
        (geometry) => geometry.dispose()
      );

      [core.material, lattice.material, nucleus.material, ring.material, beacon.material].forEach(
        (material) => material.dispose()
      );

      warmKey.dispose();
      coolFill.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`floating-ai-assistant ${hovered ? "is-hovered" : ""} ${isOpen ? "is-open" : ""}`}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      onClick={() => !isOpenRef.current && onOpenRef.current()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span ref={hostRef} className="floating-ai-assistant__canvas" aria-hidden="true" />
      {!isOpen && (
        <span className="floating-ai-assistant__label" aria-hidden="true">
          <span className="floating-ai-assistant__dot" />
          ASK NILAVAN
        </span>
      )}
    </button>
  );
}
