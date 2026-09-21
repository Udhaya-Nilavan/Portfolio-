import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * TechnicalDoodle.tsx
 * ------------------------------------------------------------
 * SINGLE-FILE PORTFOLIO DOODLE
 *
 * Replace the old green/blueprint floating doodle with this component.
 *
 * Visual direction:
 * - low-poly faceted 3D object
 * - dark graphite / warm champagne accent
 * - thin orbital rings
 * - soft floating shadow
 * - transparent background
 * - subtle motion only
 * - designed for a white/light editorial portfolio
 *
 * Dependency:
 * - three (already used by the portfolio)
 *
 * Usage:
 *   <TechnicalDoodle />
 *
 * If the old component accepts a wrapper, you can also place:
 *   <div className="technical-doodle-slot">
 *     <TechnicalDoodle />
 *   </div>
 *
 * No external images, models, textures, fonts, CSS files, or URLs.
 */

type TechnicalDoodleProps = {
  className?: string;
  size?: number;
};

const TechnicalDoodle: React.FC<TechnicalDoodleProps> = ({
  className = "",
  size = 112,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return () => {
        mediaQuery.removeEventListener("change", handleMotionChange);
      };
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0, 0.15, 5.4);

    // ---------------------------------------------------------
    // LIGHTING
    // Soft editorial lighting rather than a neon/cyber look.
    // ---------------------------------------------------------
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
    keyLight.position.set(2.8, 3.2, 4.5);
    scene.add(keyLight);

    const warmLight = new THREE.DirectionalLight(0xd7a86e, 1.15);
    warmLight.position.set(-3.2, 0.8, 3.2);
    scene.add(warmLight);

    const fillLight = new THREE.DirectionalLight(0x9ba4b2, 1.1);
    fillLight.position.set(2.5, -2.5, 2);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.48);
    scene.add(ambientLight);

    // ---------------------------------------------------------
    // MAIN FACETED "DOODLE"
    // Icosahedron gives the same visual language as the reference:
    // small geometric faces, dark core, warm inner highlights.
    // ---------------------------------------------------------
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    const gemGeometry = new THREE.IcosahedronGeometry(0.92, 1);

    const gemMaterial = new THREE.MeshStandardMaterial({
      color: 0x20242a,
      roughness: 0.34,
      metalness: 0.42,
      flatShading: true,
    });

    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    gem.rotation.set(0.18, -0.28, 0.1);
    objectGroup.add(gem);

    // Smaller warm center creates the subtle champagne/gold
    // triangular flashes visible between the dark facets.
    const innerGeometry = new THREE.IcosahedronGeometry(0.39, 1);

    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0xc18a4b,
      roughness: 0.28,
      metalness: 0.55,
      flatShading: true,
      transparent: true,
      opacity: 0.78,
    });

    const innerGem = new THREE.Mesh(innerGeometry, innerMaterial);
    innerGem.scale.setScalar(0.72);
    innerGem.rotation.set(0.42, 0.18, -0.28);
    objectGroup.add(innerGem);

    // Very thin internal wire adds the "technical" feel without
    // turning the object into a glowing sci-fi orb.
    const wireGeometry = new THREE.IcosahedronGeometry(0.965, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4d7da,
      transparent: true,
      opacity: 0.22,
      wireframe: true,
    });

    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    objectGroup.add(wire);

    // ---------------------------------------------------------
    // ORBIT RINGS
    // Two elliptical rings reproduce the physical doodle/orbit
    // around the reference object.
    // ---------------------------------------------------------
    const orbitGroup = new THREE.Group();
    objectGroup.add(orbitGroup);

    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x34383d,
      transparent: true,
      opacity: 0.72,
    });

    const orbitMaterialWarm = new THREE.MeshBasicMaterial({
      color: 0xb88a59,
      transparent: true,
      opacity: 0.58,
    });

    const orbit1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.12, 0.018, 8, 96),
      orbitMaterial,
    );

    orbit1.rotation.set(Math.PI * 0.34, Math.PI * 0.06, Math.PI * 0.12);
    orbit1.scale.set(1, 0.43, 1);
    orbitGroup.add(orbit1);

    const orbit2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.18, 0.012, 8, 96),
      orbitMaterialWarm,
    );

    orbit2.rotation.set(
      Math.PI * 0.78,
      Math.PI * 0.14,
      -Math.PI * 0.22,
    );
    orbit2.scale.set(0.92, 0.34, 1);
    orbitGroup.add(orbit2);

    // Small technical nodes on the orbit.
    const nodeGeometry = new THREE.SphereGeometry(0.035, 10, 10);

    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xd7b27a,
      transparent: true,
      opacity: 0.86,
    });

    const nodeA = new THREE.Mesh(nodeGeometry, nodeMaterial);
    nodeA.position.set(0.86, 0.27, 0.48);
    orbitGroup.add(nodeA);

    const nodeB = new THREE.Mesh(
      nodeGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x5f6871,
        transparent: true,
        opacity: 0.72,
      }),
    );

    nodeB.position.set(-0.84, -0.2, 0.32);
    orbitGroup.add(nodeB);

    // ---------------------------------------------------------
    // SOFT SHADOW
    // Transparent radial canvas texture is generated locally;
    // no image asset is needed.
    // ---------------------------------------------------------
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 64;

    const shadowContext = shadowCanvas.getContext("2d");

    if (shadowContext) {
      const gradient = shadowContext.createRadialGradient(
        64,
        30,
        2,
        64,
        30,
        58,
      );

      gradient.addColorStop(0, "rgba(35, 39, 43, 0.28)");
      gradient.addColorStop(0.45, "rgba(35, 39, 43, 0.10)");
      gradient.addColorStop(1, "rgba(35, 39, 43, 0)");

      shadowContext.fillStyle = gradient;
      shadowContext.fillRect(0, 0, 128, 64);
    }

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.SpriteMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });

    const shadow = new THREE.Sprite(shadowMaterial);
    shadow.scale.set(2.05, 0.74, 1);
    shadow.position.set(0, -1.14, -0.5);
    scene.add(shadow);

    // ---------------------------------------------------------
    // POINTER TILT
    // Small interaction only; no aggressive cursor-following.
    // ---------------------------------------------------------
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      targetX = THREE.MathUtils.clamp(x, -0.5, 0.5);
      targetY = THREE.MathUtils.clamp(y, -0.5, 0.5);
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    canvas.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    canvas.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });

    // ---------------------------------------------------------
    // RESIZE
    // ---------------------------------------------------------
    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);

      renderer.setSize(width, height, false);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    // ---------------------------------------------------------
    // ANIMATION
    // restrained, slow and editorial.
    // ---------------------------------------------------------
    let animationFrame = 0;
    let previousTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;

      if (!reducedMotionRef.current) {
        const elapsed = time * 0.001;

        gem.rotation.y += delta * 0.22;
        gem.rotation.x += delta * 0.035;

        innerGem.rotation.y -= delta * 0.15;
        innerGem.rotation.z += delta * 0.05;

        wire.rotation.y -= delta * 0.055;

        orbitGroup.rotation.z += delta * 0.075;
        orbitGroup.rotation.y += delta * 0.025;

        objectGroup.position.y = Math.sin(elapsed * 0.85) * 0.055;
      }

      objectGroup.rotation.x += (currentY * 0.22 - objectGroup.rotation.x) * 0.045;
      objectGroup.rotation.z += (-currentX * 0.18 - objectGroup.rotation.z) * 0.045;

      renderer.render(scene, camera);

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);

      resizeObserver.disconnect();

      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);

      mediaQuery.removeEventListener("change", handleMotionChange);

      gemGeometry.dispose();
      gemMaterial.dispose();

      innerGeometry.dispose();
      innerMaterial.dispose();

      wireGeometry.dispose();
      wireMaterial.dispose();

      orbit1.geometry.dispose();
      orbit2.geometry.dispose();
      orbitMaterial.dispose();
      orbitMaterialWarm.dispose();

      nodeGeometry.dispose();
      nodeMaterial.dispose();

      if (nodeB.material instanceof THREE.Material) {
        nodeB.material.dispose();
      }

      shadowTexture.dispose();
      shadowMaterial.dispose();

      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      className={`technical-doodle ${className}`.trim()}
      style={
        {
          "--technical-doodle-size": `${size}px`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="technical-doodle__canvas"
        width={224}
        height={224}
      />

      <style>{`
        .technical-doodle {
          --technical-doodle-size: 112px;

          position: relative;
          width: var(--technical-doodle-size);
          height: var(--technical-doodle-size);

          display: block;
          flex: 0 0 auto;

          pointer-events: auto;

          isolation: isolate;
        }

        .technical-doodle__canvas {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          display: block;

          background: transparent;

          overflow: visible;

          filter:
            drop-shadow(0 9px 7px rgba(28, 31, 34, 0.07))
            drop-shadow(0 2px 2px rgba(28, 31, 34, 0.08));

          transition:
            transform 360ms cubic-bezier(.22,.61,.36,1),
            filter 360ms cubic-bezier(.22,.61,.36,1);
        }

        .technical-doodle:hover .technical-doodle__canvas {
          transform: scale(1.055) translateY(-1px);

          filter:
            drop-shadow(0 12px 9px rgba(28, 31, 34, 0.10))
            drop-shadow(0 3px 3px rgba(28, 31, 34, 0.09));
        }

        @media (max-width: 768px) {
          .technical-doodle {
            --technical-doodle-size: 88px;
          }

          .technical-doodle__canvas {
            filter:
              drop-shadow(0 7px 6px rgba(28, 31, 34, 0.07));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .technical-doodle__canvas {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TechnicalDoodle;
