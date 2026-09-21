import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks';

/**
 * FloatingAIAssistant — ONE-FILE IMPLEMENTATION
 *
 * All CSS is embedded directly inside this single TSX file.
 * No separate CSS, shader, or helper files required.
 */

export interface FloatingAIAssistantProps {
  isOpen: boolean;
  onOpen: () => void;
}

function checkWebGLSupport(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) return false;
    const prec = gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);
    return Boolean(prec && typeof prec.precision === 'number' && prec.precision > 0);
  } catch {
    return false;
  }
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({
  isOpen,
  onOpen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOpenRef = useRef(isOpen);
  const onOpenRef = useRef(onOpen);

  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isHoveredRef = useRef(isHovered);

  const [use3D, setUse3D] = useState(checkWebGLSupport);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  /* ---------------------------------------------------------------------- */
  /* Three.js scene — initialized ONCE on mount, not rebuilt on hover       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!use3D) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setUse3D(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 4.15);

    /* Root group */
    const coreGroup = new THREE.Group();
    coreGroup.rotation.set(0.18, 0.55, 0.08);
    scene.add(coreGroup);

    /* Faceted graphite/obsidian core */
    const coreGeo = new THREE.IcosahedronGeometry(0.82, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a202a,
      emissive: 0x0c1118,
      roughness: 0.23,
      metalness: 0.72,
      clearcoat: 0.95,
      clearcoatRoughness: 0.18,
      flatShading: true,
      transparent: true,
      opacity: 0.96,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(core);

    /* Restrained technical wireframe */
    const wireGeo = new THREE.IcosahedronGeometry(0.842, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc48e52,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wire);

    /* Inner AI nucleus */
    const nucleusGeo = new THREE.SphereGeometry(0.26, 18, 18);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0xe7a65d,
      emissive: 0xa96524,
      emissiveIntensity: 1.0,
      roughness: 0.24,
      metalness: 0.12,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleus);

    /* Orbital gyro ring */
    const ringGeo = new THREE.TorusGeometry(1.18, 0.022, 12, 72);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x384352,
      roughness: 0.28,
      metalness: 0.9,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3.35;
    ring.rotation.z = -Math.PI / 8.5;
    coreGroup.add(ring);

    /* Orbital beacon */
    const beaconGeo = new THREE.SphereGeometry(0.052, 10, 10);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xf4c07f,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    ring.add(beacon);

    /* High-key editorial lighting */
    const ambient = new THREE.HemisphereLight(0xffffff, 0xb8c1cc, 1.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffe6c9, 2.5);
    keyLight.position.set(3.5, 3.8, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc8d3df, 1.15);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xf5b875, 2.1, 8);
    pointLight.position.set(2.5, 2.0, 2.5);
    scene.add(pointLight);

    /* Dynamic interaction state */
    const state = {
      targetTiltX: 0,
      targetTiltY: 0,
      currentTiltX: 0,
      currentTiltY: 0,
      targetScale: 1,
      currentScale: 1,
      targetRingScale: 1,
      currentRingScale: 1,
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(rect.width, 1);
      const h = Math.max(rect.height, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    /* Pointer proximity response */
    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotionRef.current) return;

      const host = containerRef.current;
      if (!host) return;

      const rect = host.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      const distance = Math.hypot(dx, dy);
      const radius = 300;
      const influence = Math.max(0, 1 - distance / radius);

      state.targetTiltY = THREE.MathUtils.clamp(
        (dx / radius) * 0.24 * influence,
        -0.24,
        0.24
      );
      state.targetTiltX = THREE.MathUtils.clamp(
        (-dy / radius) * 0.2 * influence,
        -0.2,
        0.2
      );
      state.targetScale = 1 + influence * 0.08;
    };

    const handlePointerLeave = () => {
      state.targetTiltX = 0;
      state.targetTiltY = 0;
      state.targetScale = 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    let rafId = 0;
    let disposed = false;
    let lastTime = performance.now();
    const clock = new THREE.Clock();

    const render = () => {
      if (disposed) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const elapsed = clock.getElapsedTime();

      if (!reducedMotionRef.current) {
        /* Organic floating */
        coreGroup.position.y = Math.sin(elapsed * 1.15) * 0.07;
        coreGroup.position.z = Math.cos(elapsed * 0.9) * 0.03;

        /* Smooth pointer response */
        state.currentTiltX += (state.targetTiltX - state.currentTiltX) * 0.08;
        state.currentTiltY += (state.targetTiltY - state.currentTiltY) * 0.08;
        state.currentScale += (state.targetScale - state.currentScale) * 0.1;
        state.currentRingScale += (state.targetRingScale - state.currentRingScale) * 0.1;

        coreGroup.rotation.x = state.currentTiltX + Math.sin(elapsed * 0.75) * 0.025;
        coreGroup.rotation.y += delta * 0.38;
        coreGroup.rotation.z = state.currentTiltY * 0.3;

        coreGroup.scale.setScalar(isOpenRef.current ? 0.66 : state.currentScale);

        state.targetRingScale = isHoveredRef.current ? 1.1 : 1;
        ring.scale.setScalar(state.currentRingScale);

        /* AI nucleus breathing */
        nucleus.scale.setScalar(1 + Math.sin(elapsed * 2.25) * 0.07);

        /* Beacon movement */
        const orbitAngle = elapsed * 0.72;
        beacon.position.set(
          Math.cos(orbitAngle) * 1.18,
          Math.sin(orbitAngle) * 1.18,
          0
        );

        /* Light glints toward pointer */
        pointLight.position.x = 2.45 + state.currentTiltY * 1.8;
        pointLight.position.y = 2.0 - state.currentTiltX * 1.8;
        pointLight.intensity = isHoveredRef.current ? 2.55 : 2.1;
      } else {
        /* Accessible static pose */
        coreGroup.position.set(0, 0, 0);
        coreGroup.rotation.set(0.16, 0.48, 0);
        coreGroup.scale.setScalar(isOpenRef.current ? 0.66 : 1);
        ring.scale.setScalar(1);
      }

      renderer.render(scene, camera);

      if (!document.hidden) {
        rafId = requestAnimationFrame(render);
      }
    };

    render();

    const handleVisibility = () => {
      cancelAnimationFrame(rafId);
      if (!document.hidden) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      resizeObserver.disconnect();

      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();

      renderer.dispose();
      renderer.forceContextLoss?.();
    };
  }, [use3D]); // Run ONCE on mount — NOT on every hover change!

  /* ---------------------------------------------------------------------- */
  /* Interaction                                                            */
  /* ---------------------------------------------------------------------- */

  const handleOpen = () => {
    if (isOpenRef.current || isPressed) return;
    setIsPressed(true);
    window.setTimeout(() => {
      setIsPressed(false);
      onOpenRef.current();
    }, 160);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <>
      <style>{FLOATING_AI_STYLES}</style>

      <div
        ref={containerRef}
        className={[
          'floating-ai-container',
          isOpen ? 'floating-ai-container--hidden' : '',
          isHovered ? 'floating-ai-container--hovered' : '',
          isPressed ? 'floating-ai-container--pressed' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="floating-ai-label" aria-hidden="true">
          <span className="floating-ai-label__dot" />
          ASK NILAVAN
        </span>

        <button
          ref={buttonRef}
          type="button"
          className="floating-ai-trigger"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          aria-label="Open Portfolio AI Assistant"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          tabIndex={isOpen ? -1 : 0}
        >
          {use3D ? (
            <canvas
              ref={canvasRef}
              className="floating-ai-canvas"
              width={160}
              height={160}
              aria-hidden="true"
            />
          ) : (
            <div className="floating-ai-canvas floating-ai-fallback" aria-hidden="true">
              <svg viewBox="0 0 100 100" width="82" height="82" className="floating-ai-svg">
                <defs>
                  <radialGradient id="ai-nuc" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f5b875" />
                    <stop offset="50%" stopColor="#c48e52" />
                    <stop offset="90%" stopColor="#1a202a" />
                  </radialGradient>
                </defs>
                <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="#384352" strokeWidth="2.4" transform="rotate(-22 50 50)" />
                <circle cx="82" cy="38" r="3" fill="#f4c07f" />
                <polygon points="50,18 68,34 50,50 32,34" fill="#242c38" stroke="#c48e52" strokeWidth="0.8" strokeOpacity="0.6" />
                <polygon points="50,50 68,34 78,54 59,68" fill="#1a202a" stroke="#c48e52" strokeWidth="0.8" strokeOpacity="0.4" />
                <polygon points="50,50 32,34 22,54 41,68" fill="#151b23" stroke="#c48e52" strokeWidth="0.8" strokeOpacity="0.4" />
                <polygon points="50,50 59,68 50,82 41,68" fill="#0d1218" stroke="#c48e52" strokeWidth="0.8" strokeOpacity="0.5" />
                <circle cx="50" cy="50" r="11" fill="url(#ai-nuc)" opacity="0.9" />
              </svg>
            </div>
          )}
          <span className="floating-ai-glow" aria-hidden="true" />
        </button>
      </div>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* All CSS is embedded here so this is genuinely ONE FILE.                   */
/* -------------------------------------------------------------------------- */

const FLOATING_AI_STYLES = `
.floating-ai-container {
  position: fixed;
  right: clamp(1.15rem, 3vw, 2rem);
  bottom: clamp(1.15rem, 3vw, 2rem);
  z-index: 190;

  display: flex;
  align-items: center;
  gap: 0.7rem;

  pointer-events: auto;
  transform: translateZ(0);

  transition:
    transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.28s ease;

  will-change: transform, opacity;
}

.floating-ai-container--hidden {
  transform: translateY(8px) scale(0.66);
  opacity: 0;
  pointer-events: none;
}

.floating-ai-container--pressed {
  transform: scale(0.92);
}

.floating-ai-trigger {
  position: relative;

  width: 82px;
  height: 82px;

  padding: 0;
  border: 0;
  border-radius: 50%;

  background: transparent;

  cursor: pointer;

  display: grid;
  place-items: center;

  outline: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.floating-ai-trigger:focus-visible {
  outline: 2px solid rgba(9, 13, 22, 0.7);
  outline-offset: 4px;
}

.floating-ai-canvas {
  position: relative;
  z-index: 2;

  width: 82px;
  height: 82px;

  display: block;
  pointer-events: none;

  filter:
    drop-shadow(0 15px 28px rgba(9, 13, 22, 0.16))
    drop-shadow(0 4px 10px rgba(9, 13, 22, 0.07));

  transition: filter 0.28s ease;
}

.floating-ai-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-ai-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.floating-ai-container--hovered .floating-ai-canvas,
.floating-ai-container:focus-within .floating-ai-canvas {
  filter:
    drop-shadow(0 18px 32px rgba(9, 13, 22, 0.19))
    drop-shadow(0 5px 13px rgba(196, 142, 82, 0.09));
}

.floating-ai-glow {
  position: absolute;
  z-index: 0;

  width: 46px;
  height: 12px;

  left: 50%;
  bottom: 2px;

  transform: translateX(-50%);

  border-radius: 50%;

  background: rgba(9, 13, 22, 0.15);
  filter: blur(8px);

  pointer-events: none;
}

.floating-ai-label {
  position: absolute;

  right: 72px;
  top: 50%;

  transform:
    translateY(-50%)
    translateX(10px);

  display: inline-flex;
  align-items: center;
  gap: 0.48rem;

  padding: 0.46rem 0.78rem;

  border-radius: 999px;

  border: 1px solid rgba(9, 13, 22, 0.08);

  background: rgba(255, 255, 255, 0.74);

  backdrop-filter:
    blur(14px)
    saturate(145%);

  -webkit-backdrop-filter:
    blur(14px)
    saturate(145%);

  box-shadow:
    0 10px 28px rgba(9, 13, 22, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);

  color: #1a2431;

  font-family:
    var(--font-mono,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace);

  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;

  opacity: 0;
  pointer-events: none;

  transition:
    opacity 0.24s ease,
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.floating-ai-container--hovered .floating-ai-label,
.floating-ai-container:focus-within .floating-ai-label {
  opacity: 1;

  transform:
    translateY(-50%)
    translateX(0);
}

.floating-ai-label__dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background: #c48e52;

  box-shadow:
    0 0 0 4px rgba(196, 142, 82, 0.1);
}

@media (max-width: 680px) {
  .floating-ai-container {
    right: max(1rem, env(safe-area-inset-right));
    bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .floating-ai-trigger,
  .floating-ai-canvas {
    width: 62px;
    height: 62px;
  }

  .floating-ai-label {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-ai-container,
  .floating-ai-canvas,
  .floating-ai-label {
    transition: none !important;
  }
}
`;
