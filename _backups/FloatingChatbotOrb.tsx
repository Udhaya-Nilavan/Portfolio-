import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

type FloatingChatbotOrbProps = {
  isOpen: boolean;
  onOpen: () => void;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

const STYLE_ID = "fai-floating-chatbot-orb-styles";

function injectStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .fai-canvas-layer,
    .fai-fallback {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }

    .fai-canvas-layer {
      opacity: 0;
      transform: scale(.96);
      transition:
        opacity 320ms var(--ease-out, cubic-bezier(.22,1,.36,1)),
        transform 420ms var(--ease-out, cubic-bezier(.22,1,.36,1));
    }

    .fai-canvas-layer.fai-ready {
      opacity: 1;
      transform: scale(1);
    }

    .fai-fallback {
      opacity: 1;
      transition: opacity 280ms var(--ease-out, cubic-bezier(.22,1,.36,1));
    }

    .fai-fallback.fai-hidden {
      opacity: 0;
    }

    .fai-stage {
      position: relative;
      width: 76px;
      height: 76px;
      display: block;
      border-radius: 50%;
      isolation: isolate;
      filter:
        drop-shadow(0 12px 18px color-mix(in srgb, var(--fg, #0b1220) 15%, transparent))
        drop-shadow(0 2px 5px color-mix(in srgb, var(--ring, #6ee7b7) 22%, transparent));
      will-change: transform;
    }

    .fai-stage::before {
      content: "";
      position: absolute;
      inset: 7px;
      z-index: -1;
      border-radius: 50%;
      background:
        radial-gradient(
          circle at 38% 30%,
          color-mix(in srgb, var(--bg, #fff) 96%, transparent) 0%,
          color-mix(in srgb, var(--bg, #fff) 80%, transparent) 42%,
          transparent 72%
        );
      box-shadow:
        0 0 22px color-mix(in srgb, var(--ring, #6ee7b7) 30%, transparent),
        0 14px 30px color-mix(in srgb, var(--fg, #0b1220) 10%, transparent);
    }

    .fai-stage::after {
      content: "";
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: -3px;
      height: 10px;
      z-index: -2;
      border-radius: 50%;
      background: color-mix(in srgb, var(--fg, #0b1220) 18%, transparent);
      filter: blur(7px);
      transform: scaleX(.9);
    }

    .fai-fallback-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .fai-fallback-orb {
      fill: url(#faiOrbGradient);
      stroke: color-mix(in srgb, var(--fg, #0b1220) 86%, transparent);
      stroke-width: 1.25;
    }

    .fai-fallback-rim {
      fill: none;
      stroke: color-mix(in srgb, var(--ring, #6ee7b7) 78%, white);
      stroke-width: 1.4;
      opacity: .82;
    }

    .fai-fallback-face {
      fill: color-mix(in srgb, var(--fg, #0b1220) 94%, transparent);
      stroke: color-mix(in srgb, var(--border-color, #dbe2ea) 70%, transparent);
      stroke-width: .7;
    }

    .fai-fallback-eye {
      fill: color-mix(in srgb, var(--ring, #6ee7b7) 88%, white);
      filter: drop-shadow(0 0 2.5px color-mix(in srgb, var(--ring, #6ee7b7) 65%, transparent));
    }

    .fai-fallback-mouth {
      fill: none;
      stroke: color-mix(in srgb, var(--ring, #6ee7b7) 82%, white);
      stroke-width: 1.6;
      stroke-linecap: round;
    }

    .fai-fallback-highlight {
      fill: white;
      opacity: .78;
    }

    .fai-fallback-orbit {
      fill: none;
      stroke: color-mix(in srgb, var(--ring, #6ee7b7) 54%, white);
      stroke-width: 1.2;
      opacity: .7;
    }

    .floating-ai-trigger {
      position: relative;
      overflow: visible;
    }

    .floating-ai-trigger:focus-visible {
      outline: 2px solid var(--ring, #22c55e);
      outline-offset: 5px;
      border-radius: 50%;
    }

    .fai-stage.fai-hovered {
      filter:
        drop-shadow(0 15px 23px color-mix(in srgb, var(--fg, #0b1220) 17%, transparent))
        drop-shadow(0 2px 8px color-mix(in srgb, var(--ring, #6ee7b7) 35%, transparent));
    }

    .fai-stage.fai-pressed {
      filter:
        drop-shadow(0 7px 12px color-mix(in srgb, var(--fg, #0b1220) 13%, transparent))
        drop-shadow(0 1px 4px color-mix(in srgb, var(--ring, #6ee7b7) 22%, transparent));
    }

    @media (prefers-reduced-motion: reduce) {
      .fai-canvas-layer,
      .fai-fallback {
        transition: none;
      }

      .fai-stage::before,
      .fai-stage::after {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(style);
}

function createFallbackSvg(): SVGSVGElement {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");

  svg.setAttribute("viewBox", "0 0 76 76");
  svg.setAttribute("class", "fai-fallback-svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const defs = document.createElementNS(svgNS, "defs");

  const gradient = document.createElementNS(svgNS, "radialGradient");
  gradient.setAttribute("id", "faiOrbGradient");
  gradient.setAttribute("cx", "34%");
  gradient.setAttribute("cy", "24%");
  gradient.setAttribute("r", "74%");

  const stops: Array<[string, string, string]> = [
    ["0%", "color-mix(in srgb, var(--bg, #ffffff) 100%, transparent)", "1"],
    ["22%", "color-mix(in srgb, var(--border-color, #dbe2ea) 72%, white)", "1"],
    ["56%", "color-mix(in srgb, var(--fg, #0b1220) 78%, white)", "1"],
    ["100%", "color-mix(in srgb, var(--fg, #0b1220) 100%, black)", "1"],
  ];

  stops.forEach(([offset, color, opacity]) => {
    const stop = document.createElementNS(svgNS, "stop");
    stop.setAttribute("offset", offset);
    stop.setAttribute("stop-color", color);
    stop.setAttribute("stop-opacity", opacity);
    gradient.appendChild(stop);
  });

  defs.appendChild(gradient);
  svg.appendChild(defs);

  const orbit = document.createElementNS(svgNS, "ellipse");
  orbit.setAttribute("cx", "38");
  orbit.setAttribute("cy", "38");
  orbit.setAttribute("rx", "31");
  orbit.setAttribute("ry", "14");
  orbit.setAttribute("transform", "rotate(-22 38 38)");
  orbit.setAttribute("class", "fai-fallback-orbit");
  svg.appendChild(orbit);

  const orb = document.createElementNS(svgNS, "circle");
  orb.setAttribute("cx", "38");
  orb.setAttribute("cy", "38");
  orb.setAttribute("r", "26");
  orb.setAttribute("class", "fai-fallback-orb");
  svg.appendChild(orb);

  const rim = document.createElementNS(svgNS, "ellipse");
  rim.setAttribute("cx", "38");
  rim.setAttribute("cy", "38");
  rim.setAttribute("rx", "23");
  rim.setAttribute("ry", "25");
  rim.setAttribute("transform", "rotate(22 38 38)");
  rim.setAttribute("class", "fai-fallback-rim");
  svg.appendChild(rim);

  const face = document.createElementNS(svgNS, "rect");
  face.setAttribute("x", "24");
  face.setAttribute("y", "28");
  face.setAttribute("width", "28");
  face.setAttribute("height", "22");
  face.setAttribute("rx", "9");
  face.setAttribute("class", "fai-fallback-face");
  svg.appendChild(face);

  const leftEye = document.createElementNS(svgNS, "circle");
  leftEye.setAttribute("cx", "32");
  leftEye.setAttribute("cy", "37");
  leftEye.setAttribute("r", "2.35");
  leftEye.setAttribute("class", "fai-fallback-eye");
  svg.appendChild(leftEye);

  const rightEye = document.createElementNS(svgNS, "circle");
  rightEye.setAttribute("cx", "44");
  rightEye.setAttribute("cy", "37");
  rightEye.setAttribute("r", "2.35");
  rightEye.setAttribute("class", "fai-fallback-eye");
  svg.appendChild(rightEye);

  const mouth = document.createElementNS(svgNS, "path");
  mouth.setAttribute("d", "M32 43 Q38 47 44 43");
  mouth.setAttribute("class", "fai-fallback-mouth");
  svg.appendChild(mouth);

  const highlight = document.createElementNS(svgNS, "ellipse");
  highlight.setAttribute("cx", "28");
  highlight.setAttribute("cy", "23");
  highlight.setAttribute("rx", "7");
  highlight.setAttribute("ry", "4");
  highlight.setAttribute("transform", "rotate(-28 28 23)");
  highlight.setAttribute("class", "fai-fallback-highlight");
  svg.appendChild(highlight);

  return svg;
}

void createFallbackSvg;

function createScene(canvas: HTMLCanvasElement): {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  root: THREE.Group;
  animatedMaterials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
} | null {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(160, 160, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0, 5.6);
    camera.lookAt(0, 0, 0);

    const root = new THREE.Group();
    scene.add(root);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const animatedMaterials: THREE.Material[] = [];

    const ambient = new THREE.HemisphereLight(0xffffff, 0x0b1220, 2.3);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.5);
    keyLight.position.set(-3.5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x8fffd0, 4.2, 8, 2);
    rimLight.position.set(2.8, -1.2, 3.5);
    scene.add(rimLight);

    const coolLight = new THREE.PointLight(0x8fb7ff, 2.2, 7, 2);
    coolLight.position.set(-3, -2, 2);
    scene.add(coolLight);

    const shellGeometry = new THREE.IcosahedronGeometry(1.42, 3);
    geometries.push(shellGeometry);

    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x101722,
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      emissive: 0x07150f,
      emissiveIntensity: 0.32,
    });

    materials.push(shellMaterial);

    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    root.add(shell);

    const faceGeometry = new THREE.SphereGeometry(0.88, 48, 32);
    geometries.push(faceGeometry);

    const faceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x080d14,
      metalness: 0.42,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      emissive: 0x00160c,
      emissiveIntensity: 0.28,
      transparent: true,
      opacity: 0.96,
    });

    materials.push(faceMaterial);

    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.scale.set(1.02, 0.83, 0.66);
    face.position.set(0, -0.02, 0.68);
    root.add(face);

    const faceRingGeometry = new THREE.TorusGeometry(
      0.91,
      0.035,
      8,
      64,
      Math.PI * 1.8,
    );
    geometries.push(faceRingGeometry);

    const faceRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x75ffc7,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    materials.push(faceRingMaterial);
    animatedMaterials.push(faceRingMaterial);

    const faceRing = new THREE.Mesh(faceRingGeometry, faceRingMaterial);
    faceRing.rotation.set(0.12, 0, -0.22);
    faceRing.position.set(0, -0.02, 0.78);
    root.add(faceRing);

    const eyeGeometry = new THREE.SphereGeometry(0.095, 20, 16);
    geometries.push(eyeGeometry);

    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0x9dffd9,
      transparent: true,
      opacity: 1,
    });

    materials.push(eyeMaterial);
    animatedMaterials.push(eyeMaterial);

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.35, 0.16, 1.19);
    root.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.35, 0.16, 1.19);
    root.add(rightEye);

    const mouthCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.36, -0.27, 1.18),
      new THREE.Vector3(0, -0.46, 1.28),
      new THREE.Vector3(0.36, -0.27, 1.18),
    );

    const mouthGeometry = new THREE.TubeGeometry(
      mouthCurve,
      16,
      0.035,
      8,
      false,
    );
    geometries.push(mouthGeometry);

    const mouthMaterial = new THREE.MeshBasicMaterial({
      color: 0x8effcf,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    materials.push(mouthMaterial);
    animatedMaterials.push(mouthMaterial);

    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    root.add(mouth);

    const antennaGeometry = new THREE.CylinderGeometry(
      0.025,
      0.025,
      0.28,
      12,
    );
    geometries.push(antennaGeometry);

    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: 0x8995a7,
      metalness: 0.9,
      roughness: 0.2,
    });

    materials.push(antennaMaterial);

    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.set(0, 1.5, 0.1);
    root.add(antenna);

    const antennaBallGeometry = new THREE.SphereGeometry(0.075, 18, 12);
    geometries.push(antennaBallGeometry);

    const antennaBallMaterial = new THREE.MeshBasicMaterial({
      color: 0x84ffd0,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    materials.push(antennaBallMaterial);
    animatedMaterials.push(antennaBallMaterial);

    const antennaBall = new THREE.Mesh(
      antennaBallGeometry,
      antennaBallMaterial,
    );
    antennaBall.position.set(0, 1.68, 0.1);
    root.add(antennaBall);

    const orbitGeometry = new THREE.TorusGeometry(
      1.67,
      0.025,
      8,
      96,
    );
    geometries.push(orbitGeometry);

    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x79ffc9,
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    materials.push(orbitMaterial);
    animatedMaterials.push(orbitMaterial);

    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.set(Math.PI * 0.43, Math.PI * 0.16, Math.PI * 0.16);
    root.add(orbit);

    const orbitDotGeometry = new THREE.SphereGeometry(0.075, 16, 12);
    geometries.push(orbitDotGeometry);

    const orbitDotMaterial = new THREE.MeshBasicMaterial({
      color: 0xb9ffe5,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    materials.push(orbitDotMaterial);
    animatedMaterials.push(orbitDotMaterial);

    const orbitDot = new THREE.Mesh(orbitDotGeometry, orbitDotMaterial);
    orbitDot.position.set(1.52, 0.18, 0.68);
    root.add(orbitDot);

    const haloGeometry = new THREE.SphereGeometry(1.82, 32, 20);
    geometries.push(haloGeometry);

    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x78ffca,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    materials.push(haloMaterial);
    animatedMaterials.push(haloMaterial);

    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    root.add(halo);

    root.rotation.set(-0.05, 0.18, 0.02);
    root.scale.setScalar(0.83);

    return {
      renderer,
      scene,
      camera,
      root,
      animatedMaterials,
      geometries,
      materials,
    };
  } catch {
    return null;
  }
}

const FloatingChatbotOrb: React.FC<FloatingChatbotOrbProps> = ({
  isOpen,
  onOpen,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLSpanElement | null>(null);
  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    active: false,
  });

  const animationFrameRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneBundleRef = useRef<ReturnType<typeof createScene> | null>(null);
  const destroyedRef = useRef(false);
  const documentHiddenRef = useRef(
    typeof document !== "undefined" ? document.hidden : false,
  );
  const reducedMotionRef = useRef(false);
  const contextLostRef = useRef(false);
  const lastTimeRef = useRef(0);

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);

  const reducedMotionMediaRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    injectStyles();

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionMediaRef.current = media;
    reducedMotionRef.current = media.matches;

    const handleMotionChange = (event: MediaQueryListEvent): void => {
      reducedMotionRef.current = event.matches;
    };

    media.addEventListener("change", handleMotionChange);

    return () => {
      media.removeEventListener("change", handleMotionChange);
      reducedMotionMediaRef.current = null;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    destroyedRef.current = false;
    contextLostRef.current = false;

    const fallback = stage.querySelector<SVGSVGElement>(".fai-fallback");
    if (fallback) {
      fallback.classList.remove("fai-hidden");
    }

    const bundle = createScene(canvas);

    if (!bundle) {
      setWebglAvailable(false);
      setCanvasReady(false);
      return;
    }

    setWebglAvailable(true);
    sceneBundleRef.current = bundle;
    rendererRef.current = bundle.renderer;

    const renderer = bundle.renderer;
    const { scene, camera, root } = bundle;

    const resizeRenderer = (): void => {
      if (destroyedRef.current) return;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(160, 160, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    resizeRenderer();

    const handleContextLost = (event: Event): void => {
      event.preventDefault();
      contextLostRef.current = true;
      setWebglAvailable(false);
      setCanvasReady(false);

      if (fallback) {
        fallback.classList.remove("fai-hidden");
      }

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const handleContextRestored = (): void => {
      if (destroyedRef.current) return;

      contextLostRef.current = false;
      setWebglAvailable(true);

      if (fallback) {
        fallback.classList.remove("fai-hidden");
      }

      setCanvasReady(false);

      window.setTimeout(() => {
        if (!destroyedRef.current && !contextLostRef.current) {
          setCanvasReady(true);
          if (fallback) {
            fallback.classList.add("fai-hidden");
          }
        }
      }, 40);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener(
      "webglcontextrestored",
      handleContextRestored,
      false,
    );

    const pointer = pointerRef.current;

    const updatePointer = (event: PointerEvent): void => {
      if (reducedMotionRef.current) return;

      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= 320) {
        pointer.x = Math.max(-1, Math.min(1, dx / 320));
        pointer.y = Math.max(-1, Math.min(1, dy / 320));
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    };

    window.addEventListener("pointermove", updatePointer, {
      passive: true,
    });

    const handleVisibilityChange = (): void => {
      documentHiddenRef.current = document.hidden;

      if (
        document.hidden &&
        animationFrameRef.current !== null
      ) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (
        !document.hidden &&
        !isOpen &&
        !reducedMotionRef.current &&
        !contextLostRef.current
      ) {
        lastTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    const renderFrame = (time: number): void => {
      if (destroyedRef.current) return;
      if (documentHiddenRef.current) return;
      if (isOpen) return;
      if (contextLostRef.current) return;

      const delta = Math.min(
        0.05,
        Math.max(0.001, (time - lastTimeRef.current) / 1000),
      );

      lastTimeRef.current = time;

      if (reducedMotionRef.current) {
        root.rotation.x = -0.05;
        root.rotation.y = 0.18;
        root.rotation.z = 0.02;
      } else {
        const pointerX = pointer.active ? pointer.x : 0;
        const pointerY = pointer.active ? pointer.y : 0;

        const targetRotationY = 0.18 + pointerX * 0.38;
        const targetRotationX = -0.05 + pointerY * -0.28;

        root.rotation.y +=
          (targetRotationY - root.rotation.y) *
          Math.min(1, delta * 7);

        root.rotation.x +=
          (targetRotationX - root.rotation.x) *
          Math.min(1, delta * 7);

        root.rotation.z +=
          (0.02 + pointerX * -0.07 - root.rotation.z) *
          Math.min(1, delta * 5);

        const idleTime = time * 0.001;

        root.position.y =
          Math.sin(idleTime * 1.35) * 0.055;

        root.position.x =
          Math.cos(idleTime * 0.7) * 0.018;

        root.scale.setScalar(
          0.83 +
            Math.sin(idleTime * 1.1) * 0.008 +
            (pointer.active ? 0.018 : 0),
        );

        const orbitObject = root.children.find(
          (child) => (child as THREE.Mesh).geometry === bundle.geometries[7],
        );

        if (orbitObject) {
          orbitObject.rotation.z += delta * 0.42;
        }

        const orbitDotObject = root.children.find(
          (child) => (child as THREE.Mesh).geometry === bundle.geometries[8],
        );

        if (orbitDotObject) {
          const angle = idleTime * 0.8;
          orbitDotObject.position.set(
            Math.cos(angle) * 1.52,
            Math.sin(angle * 1.3) * 0.35,
            0.68 + Math.sin(angle) * 0.32,
          );
        }

        bundle.animatedMaterials.forEach((material, index) => {
          if (
            material instanceof THREE.MeshBasicMaterial
          ) {
            const base =
              index === 0
                ? 0.76
                : index === 1
                  ? 0.9
                  : 0.8;

            material.opacity =
              base +
              Math.sin(idleTime * 2 + index) * 0.08;
          }
        });
      }

      renderer.render(scene, camera);

      if (!canvasReady) {
        setCanvasReady(true);
        if (fallback) {
          fallback.classList.add("fai-hidden");
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    if (
      !isOpen &&
      !documentHiddenRef.current &&
      !reducedMotionRef.current
    ) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    } else if (
      !isOpen &&
      !documentHiddenRef.current &&
      reducedMotionRef.current
    ) {
      renderer.render(scene, camera);
      setCanvasReady(true);
      if (fallback) {
        fallback.classList.add("fai-hidden");
      }
    }

    return () => {
      destroyedRef.current = true;

      window.removeEventListener("pointermove", updatePointer);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      canvas.removeEventListener(
        "webglcontextlost",
        handleContextLost,
      );
      canvas.removeEventListener(
        "webglcontextrestored",
        handleContextRestored,
      );

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      bundle.geometries.forEach((geometry) => {
        geometry.dispose();
      });

      bundle.materials.forEach((material) => {
        material.dispose();
      });

      renderer.dispose();
      renderer.forceContextLoss();

      rendererRef.current = null;
      sceneBundleRef.current = null;
    };
  }, [canvasReady, isOpen]);

  useEffect(() => {
    if (isOpen && animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [isOpen]);

  const handlePointerEnter = useCallback((): void => {
    setHovered(true);
  }, []);

  const handlePointerLeave = useCallback((): void => {
    setHovered(false);
    pointerRef.current.active = false;
  }, []);

  const handlePointerDown = useCallback((): void => {
    setPressed(true);
  }, []);

  const handlePointerUp = useCallback((): void => {
    setPressed(false);
  }, []);

  const handleClick = useCallback((): void => {
    onOpen();
  }, [onOpen]);

  const stageClassName = [
    "fai-stage",
    hovered ? "fai-hovered" : "",
    pressed ? "fai-pressed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>{`
        .floating-ai-container .floating-ai-trigger {
          position: relative;
        }

        .floating-ai-container .fai-stage {
          transform-origin: 50% 50%;
          transition:
            transform var(--dur, 240ms) var(--ease-out, cubic-bezier(.22,1,.36,1)),
            filter var(--dur, 240ms) var(--ease-out, cubic-bezier(.22,1,.36,1));
        }

        .floating-ai-container--hovered .fai-stage {
          transform: scale(1.045);
        }

        .floating-ai-container--pressed .fai-stage {
          transform: scale(.965);
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-ai-container .fai-stage {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className={[
          "floating-ai-container",
          isOpen ? "floating-ai-container--hidden" : "",
          hovered ? "floating-ai-container--hovered" : "",
          pressed ? "floating-ai-container--pressed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={isOpen}
      >
        <span className="floating-ai-label">
          <span aria-hidden="true">●</span>
          ASK NILAVAN
        </span>

        <button
          type="button"
          className="floating-ai-trigger"
          aria-label="Open Portfolio AI Assistant"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          tabIndex={isOpen ? -1 : 0}
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span
            ref={stageRef}
            className={stageClassName}
            aria-hidden="true"
          >
            <svg
              className={[
                "fai-fallback",
                canvasReady && webglAvailable
                  ? "fai-hidden"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              viewBox="0 0 76 76"
              focusable="false"
              aria-hidden="true"
            >
              <defs>
                <radialGradient
                  id="faiInlineOrbGradient"
                  cx="32%"
                  cy="24%"
                  r="78%"
                >
                  <stop
                    offset="0%"
                    stopColor="white"
                    stopOpacity="1"
                  />
                  <stop
                    offset="24%"
                    stopColor="var(--border-color, #dbe2ea)"
                    stopOpacity=".94"
                  />
                  <stop
                    offset="58%"
                    stopColor="var(--fg, #0b1220)"
                    stopOpacity=".9"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--fg, #0b1220)"
                    stopOpacity="1"
                  />
                </radialGradient>
              </defs>

              <ellipse
                cx="38"
                cy="38"
                rx="31"
                ry="14"
                transform="rotate(-22 38 38)"
                fill="none"
                stroke="var(--ring, #6ee7b7)"
                strokeOpacity=".58"
                strokeWidth="1.2"
              />

              <circle
                cx="38"
                cy="38"
                r="26"
                fill="url(#faiInlineOrbGradient)"
                stroke="var(--fg, #0b1220)"
                strokeOpacity=".9"
                strokeWidth="1.25"
              />

              <ellipse
                cx="38"
                cy="38"
                rx="23"
                ry="25"
                transform="rotate(22 38 38)"
                fill="none"
                stroke="var(--ring, #6ee7b7)"
                strokeOpacity=".72"
                strokeWidth="1.4"
              />

              <rect
                x="24"
                y="28"
                width="28"
                height="22"
                rx="9"
                fill="var(--fg, #0b1220)"
                stroke="var(--border-color, #dbe2ea)"
                strokeOpacity=".72"
                strokeWidth=".7"
              />

              <circle
                cx="32"
                cy="37"
                r="2.35"
                fill="var(--ring, #6ee7b7)"
              />

              <circle
                cx="44"
                cy="37"
                r="2.35"
                fill="var(--ring, #6ee7b7)"
              />

              <path
                d="M32 43 Q38 47 44 43"
                fill="none"
                stroke="var(--ring, #6ee7b7)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />

              <ellipse
                cx="28"
                cy="23"
                rx="7"
                ry="4"
                transform="rotate(-28 28 23)"
                fill="white"
                fillOpacity=".78"
              />

              <path
                d="M38 12 L38 7"
                stroke="var(--fg, #0b1220)"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <circle
                cx="38"
                cy="6.5"
                r="2.1"
                fill="var(--ring, #6ee7b7)"
              />
            </svg>

            <canvas
              ref={canvasRef}
              className={[
                "floating-ai-canvas",
                "fai-canvas-layer",
                canvasReady && webglAvailable
                  ? "fai-ready"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              width={160}
              height={160}
              aria-hidden="true"
            />
          </span>
        </button>
      </div>
    </>
  );
};

export default FloatingChatbotOrb;
