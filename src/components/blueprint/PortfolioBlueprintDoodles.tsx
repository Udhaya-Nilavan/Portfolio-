import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * PortfolioBlueprintDoodles.tsx
 * ============================================================
 * ONE-FILE DECORATIVE BLUEPRINT / DOODLE SYSTEM
 *
 * Purpose:
 * - Large, clearly visible technical doodles
 * - Occupies empty whitespace around the existing portfolio
 * - White/light editorial visual language
 * - Inspired by the supplied Phase 8 technical direction
 *
 * No external assets.
 * No external CSS.
 * No new dependency.
 *
 * Mount once near the top-level portfolio layout:
 *
 *   <PortfolioBlueprintDoodles />
 *
 * Keep it ABOVE the page background but BELOW content:
 *
 *   <main className="portfolio-shell">
 *     <PortfolioBlueprintDoodles />
 *     {children}
 *   </main>
 *
 * The component is pointer-events:none so it never blocks UI.
 */

type DoodleKind =
  | "neural"
  | "database"
  | "chart"
  | "code"
  | "model"
  | "cloud"
  | "matrix"
  | "architecture";

type DoodleSpec = {
  id: string;
  kind: DoodleKind;
  label: string;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
  delay: number;
  duration: number;
};

type PathSpec = {
  id: string;
  d: string;
  dash?: string;
  opacity: number;
  delay: number;
  duration: number;
};

const doodles: DoodleSpec[] = [
  {
    id: "neural",
    kind: "neural",
    label: "MODEL",
    x: 8,
    y: 17,
    scale: 1,
    rotate: -7,
    opacity: 0.72,
    delay: 0,
    duration: 7,
  },
  {
    id: "database",
    kind: "database",
    label: "DATA",
    x: 86,
    y: 23,
    scale: 1.05,
    rotate: 5,
    opacity: 0.66,
    delay: 0.8,
    duration: 8,
  },
  {
    id: "chart",
    kind: "chart",
    label: "INSIGHT",
    x: 13,
    y: 47,
    scale: 0.92,
    rotate: 4,
    opacity: 0.62,
    delay: 1.4,
    duration: 8.5,
  },
  {
    id: "code",
    kind: "code",
    label: "PYTHON",
    x: 88,
    y: 52,
    scale: 0.95,
    rotate: -5,
    opacity: 0.58,
    delay: 0.5,
    duration: 9,
  },
  {
    id: "model",
    kind: "model",
    label: "REASONING",
    x: 7,
    y: 72,
    scale: 1.02,
    rotate: 6,
    opacity: 0.68,
    delay: 1.8,
    duration: 8,
  },
  {
    id: "cloud",
    kind: "cloud",
    label: "DEPLOY",
    x: 91,
    y: 74,
    scale: 0.92,
    rotate: -4,
    opacity: 0.58,
    delay: 2,
    duration: 8.5,
  },
  {
    id: "matrix",
    kind: "matrix",
    label: "FEATURES",
    x: 17,
    y: 90,
    scale: 0.84,
    rotate: -3,
    opacity: 0.52,
    delay: 1.2,
    duration: 9,
  },
  {
    id: "architecture",
    kind: "architecture",
    label: "SYSTEM",
    x: 84,
    y: 91,
    scale: 0.86,
    rotate: 4,
    opacity: 0.55,
    delay: 2.4,
    duration: 9,
  },
];

const paths: PathSpec[] = [
  {
    id: "path-a",
    d: "M 30 150 C 160 15, 320 42, 445 155 S 650 315, 835 190",
    dash: "2 10",
    opacity: 0.34,
    delay: 0,
    duration: 17,
  },
  {
    id: "path-b",
    d: "M 115 510 C 250 390, 380 420, 490 525 S 730 675, 930 555",
    dash: "1 9",
    opacity: 0.27,
    delay: 1,
    duration: 20,
  },
  {
    id: "path-c",
    d: "M 970 75 C 815 205, 790 325, 650 355 S 410 355, 245 510",
    dash: "3 12",
    opacity: 0.22,
    delay: 2,
    duration: 23,
  },
  {
    id: "path-d",
    d: "M 80 785 C 260 655, 405 700, 535 790 S 760 925, 980 785",
    dash: "2 14",
    opacity: 0.25,
    delay: 0.7,
    duration: 22,
  },
  {
    id: "path-e",
    d: "M 520 80 C 465 205, 525 285, 610 325 S 715 445, 655 565",
    dash: "1 8",
    opacity: 0.19,
    delay: 1.7,
    duration: 25,
  },
];

function NeuralDoodle() {
  return (
    <svg viewBox="0 0 180 130" className="pbd-svg" aria-hidden="true">
      <g className="pbd-line">
        <path d="M28 38 L74 25 L118 44 L153 30" />
        <path d="M28 38 L61 82 L118 44 L132 96" />
        <path d="M74 25 L61 82 L132 96 L153 30" />
        <path d="M61 82 L118 44" />
      </g>
      <g className="pbd-node">
        <circle cx="28" cy="38" r="5" />
        <circle cx="74" cy="25" r="5" />
        <circle cx="118" cy="44" r="6" />
        <circle cx="153" cy="30" r="4" />
        <circle cx="61" cy="82" r="5" />
        <circle cx="132" cy="96" r="5" />
      </g>
      <path className="pbd-accent-line" d="M40 106 C73 119 116 115 145 101" />
      <text x="47" y="121" className="pbd-mini-label">MODEL GRAPH</text>
    </svg>
  );
}

function DatabaseDoodle() {
  return (
    <svg viewBox="0 0 170 150" className="pbd-svg" aria-hidden="true">
      <g className="pbd-line">
        <ellipse cx="84" cy="31" rx="43" ry="14" />
        <path d="M41 31 V88 C41 104 127 104 127 88 V31" />
        <ellipse cx="84" cy="88" rx="43" ry="14" />
        <path d="M41 57 C41 73 127 73 127 57" />
      </g>
      <path className="pbd-accent-line" d="M84 14 V4" />
      <circle className="pbd-node-fill" cx="84" cy="4" r="3" />
      <text x="56" y="128" className="pbd-mini-label">DATA STORE</text>
    </svg>
  );
}

function ChartDoodle() {
  return (
    <svg viewBox="0 0 180 140" className="pbd-svg" aria-hidden="true">
      <g className="pbd-line">
        <path d="M25 112 H157" />
        <path d="M30 112 V28" />
        <path d="M43 94 L68 76 L88 87 L115 47 L145 60" />
      </g>
      <g className="pbd-bars">
        <rect x="48" y="87" width="11" height="25" rx="2" />
        <rect x="72" y="69" width="11" height="43" rx="2" />
        <rect x="96" y="79" width="11" height="33" rx="2" />
        <rect x="120" y="54" width="11" height="58" rx="2" />
      </g>
      <circle className="pbd-node-fill" cx="145" cy="60" r="4" />
      <text x="61" y="130" className="pbd-mini-label">INSIGHT / EDA</text>
    </svg>
  );
}

function CodeDoodle() {
  return (
    <svg viewBox="0 0 180 130" className="pbd-svg" aria-hidden="true">
      <rect x="25" y="24" width="130" height="76" rx="9" className="pbd-panel" />
      <path className="pbd-line" d="M48 52 L65 62 L48 72" />
      <path className="pbd-accent-line" d="M78 74 H116" />
      <path className="pbd-line" d="M78 51 H135" />
      <circle className="pbd-node-fill" cx="42" cy="39" r="3" />
      <circle className="pbd-node-fill muted" cx="52" cy="39" r="3" />
      <circle className="pbd-node-fill soft" cx="62" cy="39" r="3" />
      <text x="64" y="116" className="pbd-mini-label">PIPELINE / CODE</text>
    </svg>
  );
}

function ModelDoodle() {
  return (
    <svg viewBox="0 0 190 145" className="pbd-svg" aria-hidden="true">
      <g className="pbd-line">
        <rect x="23" y="51" width="33" height="33" rx="6" />
        <rect x="78" y="25" width="38" height="38" rx="7" />
        <rect x="78" y="82" width="38" height="38" rx="7" />
        <rect x="137" y="51" width="33" height="33" rx="6" />
        <path d="M56 67 H78" />
        <path d="M116 44 L137 67" />
        <path d="M116 101 L137 77" />
      </g>
      <g className="pbd-node">
        <circle cx="39" cy="67" r="4" />
        <circle cx="97" cy="44" r="4" />
        <circle cx="97" cy="101" r="4" />
        <circle cx="153" cy="67" r="4" />
      </g>
      <path className="pbd-accent-line" d="M42 18 C77 3 119 7 151 24" />
      <text x="70" y="137" className="pbd-mini-label">REASONING</text>
    </svg>
  );
}

function CloudDoodle() {
  return (
    <svg viewBox="0 0 180 140" className="pbd-svg" aria-hidden="true">
      <g className="pbd-line">
        <path d="M45 91 H136 C150 91 158 82 158 70 C158 58 149 49 137 49 C133 32 120 22 103 22 C83 22 70 35 68 51 C52 49 39 60 39 73 C39 83 41 88 45 91Z" />
        <path d="M65 106 H125" />
        <path d="M78 116 H112" />
      </g>
      <path className="pbd-accent-line" d="M99 49 V74" />
      <path className="pbd-accent-line" d="M87 62 L99 74 L111 62" />
      <text x="65" y="133" className="pbd-mini-label">DEPLOY</text>
    </svg>
  );
}

function MatrixDoodle() {
  return (
    <svg viewBox="0 0 170 140" className="pbd-svg" aria-hidden="true">
      <g className="pbd-grid">
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((__, col) => (
            <rect
              key={`${row}-${col}`}
              x={35 + col * 21}
              y={25 + row * 18}
              width="10"
              height="10"
              rx="2"
            />
          )),
        )}
      </g>
      <path className="pbd-accent-line" d="M35 124 H137" />
      <text x="60" y="137" className="pbd-mini-label">FEATURES</text>
    </svg>
  );
}

function ArchitectureDoodle() {
  return (
    <svg viewBox="0 0 190 145" className="pbd-svg" aria-hidden="true">
      <g className="pbd-line">
        <rect x="22" y="54" width="40" height="30" rx="6" />
        <rect x="75" y="27" width="40" height="30" rx="6" />
        <rect x="75" y="84" width="40" height="30" rx="6" />
        <rect x="128" y="54" width="40" height="30" rx="6" />
        <path d="M62 69 H75" />
        <path d="M115 42 L128 69" />
        <path d="M115 99 L128 69" />
      </g>
      <circle className="pbd-node-fill" cx="42" cy="69" r="4" />
      <circle className="pbd-node-fill" cx="95" cy="42" r="4" />
      <circle className="pbd-node-fill" cx="95" cy="99" r="4" />
      <circle className="pbd-node-fill" cx="148" cy="69" r="4" />
      <path className="pbd-dashed" d="M41 22 C80 6 124 8 151 25" />
      <text x="67" y="136" className="pbd-mini-label">SYSTEM FLOW</text>
    </svg>
  );
}

function DoodleGraphic({ kind }: { kind: DoodleKind }) {
  switch (kind) {
    case "neural":
      return <NeuralDoodle />;
    case "database":
      return <DatabaseDoodle />;
    case "chart":
      return <ChartDoodle />;
    case "code":
      return <CodeDoodle />;
    case "model":
      return <ModelDoodle />;
    case "cloud":
      return <CloudDoodle />;
    case "matrix":
      return <MatrixDoodle />;
    case "architecture":
      return <ArchitectureDoodle />;
  }
}

function DoodleObject({
  item,
  active,
}: {
  item: DoodleSpec;
  active: boolean;
}) {
  return (
    <div
      className={`pbd-object pbd-object--${item.kind}${active ? " is-active" : ""}`}
      style={
        {
          left: `${item.x}%`,
          top: `${item.y}%`,
          "--pbd-scale": item.scale,
          "--pbd-rotate": `${item.rotate}deg`,
          "--pbd-opacity": item.opacity,
          "--pbd-delay": `${item.delay}s`,
          "--pbd-duration": `${item.duration}s`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="pbd-object__halo" />
      <div className="pbd-object__graphic">
        <DoodleGraphic kind={item.kind} />
      </div>
      <span className="pbd-object__label">{item.label}</span>
      <span className="pbd-object__cross pbd-object__cross--a" />
      <span className="pbd-object__cross pbd-object__cross--b" />
    </div>
  );
}

export default function PortfolioBlueprintDoodles() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onScroll = () => {
      if (media.matches) return;

      const y = window.scrollY;
      const viewport = window.innerHeight;

      // Keep the decorative system present, but gently fade it when
      // the browser is far away from the main portfolio content.
      const pageHeight = Math.max(
        document.documentElement.scrollHeight,
        viewport,
      );

      const progress = y / Math.max(pageHeight - viewport, 1);
      setVisible(progress < 0.98);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const move = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.025;
      currentY += (targetY - currentY) * 0.025;

      root.style.setProperty("--pbd-mx", `${currentX * 7}px`);
      root.style.setProperty("--pbd-my", `${currentY * 5}px`);

      frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", move, { passive: true });
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", move);
      window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`portfolio-blueprint-doodles${visible ? "" : " is-hidden"}`}
      aria-hidden="true"
    >
      <svg
        className="pbd-paths"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <marker
            id="pbd-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        {paths.map((path) => (
          <path
            key={path.id}
            className="pbd-path"
            d={path.d}
            strokeDasharray={path.dash}
            style={
              {
                "--pbd-path-opacity": path.opacity,
                "--pbd-path-delay": `${path.delay}s`,
                "--pbd-path-duration": `${path.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}

        <path
          className="pbd-arrow-path"
          d="M 215 270 C 330 210 405 240 505 310"
          markerEnd="url(#pbd-arrow)"
        />
        <path
          className="pbd-arrow-path pbd-arrow-path--warm"
          d="M 780 410 C 700 450 665 490 610 545"
          markerEnd="url(#pbd-arrow)"
        />
      </svg>

      <div className="pbd-grid-field" />

      <div className="pbd-corner pbd-corner--tl">
        <span>01</span>
        <i />
        <span>DATA / MODEL</span>
      </div>

      <div className="pbd-corner pbd-corner--tr">
        <span>02</span>
        <i />
        <span>REASONING / SYSTEM</span>
      </div>

      <div className="pbd-corner pbd-corner--bl">
        <span>03</span>
        <i />
        <span>BUILD / DEPLOY</span>
      </div>

      <div className="pbd-corner pbd-corner--br">
        <span>04</span>
        <i />
        <span>IMPACT</span>
      </div>

      {doodles.map((item) => (
        <button
          key={item.id}
          type="button"
          className="pbd-hit-target"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          onMouseEnter={() => setActiveId(item.id)}
          onMouseLeave={() => setActiveId(null)}
          tabIndex={-1}
          aria-hidden="true"
        >
          <DoodleObject item={item} active={activeId === item.id} />
        </button>
      ))}

      <div className="pbd-flow-label pbd-flow-label--one">
        <span>INPUT</span>
        <b>DATA</b>
      </div>

      <div className="pbd-flow-label pbd-flow-label--two">
        <span>PROCESS</span>
        <b>MODEL</b>
      </div>

      <div className="pbd-flow-label pbd-flow-label--three">
        <span>OUTPUT</span>
        <b>IMPACT</b>
      </div>

      <style>{`
        .portfolio-blueprint-doodles {
          --pbd-ink: #4b4f54;
          --pbd-soft: #7c838a;
          --pbd-faint: #aeb4b9;
          --pbd-paper: #f7f8f8;
          --pbd-warm: #ad7b45;
          --pbd-warm-soft: #c7a27c;

          position: fixed;
          inset: 0;

          width: 100vw;
          height: 100vh;

          z-index: 0;

          overflow: hidden;

          pointer-events: none;

          opacity: 1;

          transition: opacity 700ms ease;

          isolation: isolate;

          contain: layout paint style;

          --pbd-mx: 0px;
          --pbd-my: 0px;
        }

        .portfolio-blueprint-doodles.is-hidden {
          opacity: 0;
        }

        /*
         * The visual layer is intentionally large.
         * It occupies whitespace around the actual portfolio content
         * instead of sitting inside the content cards.
         */
        .pbd-paths {
          position: absolute;
          inset: -4vh -2vw;

          width: 104vw;
          height: 108vh;

          overflow: visible;

          transform:
            translate3d(
              calc(var(--pbd-mx) * -0.35),
              calc(var(--pbd-my) * -0.35),
              0
            );

          transition: transform 500ms ease-out;

          opacity: 0.9;
        }

        .pbd-path {
          fill: none;
          stroke: var(--pbd-soft);
          stroke-width: 1.15;
          vector-effect: non-scaling-stroke;

          opacity: var(--pbd-path-opacity);

          stroke-linecap: round;

          animation:
            pbd-dash-flow
            var(--pbd-path-duration)
            var(--pbd-path-delay)
            linear
            infinite;
        }

        .pbd-arrow-path {
          fill: none;
          stroke: var(--pbd-ink);
          stroke-width: 1.05;
          stroke-dasharray: 1 9;
          vector-effect: non-scaling-stroke;
          opacity: 0.24;

          animation: pbd-dash-flow 18s linear infinite;
        }

        .pbd-arrow-path--warm {
          stroke: var(--pbd-warm);
          opacity: 0.23;
          animation-duration: 21s;
        }

        .pbd-paths marker path {
          fill: var(--pbd-ink);
          opacity: 0.42;
        }

        .pbd-grid-field {
          position: absolute;
          inset: -20vh -10vw;

          background-image:
            linear-gradient(
              rgba(80, 85, 90, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(80, 85, 90, 0.035) 1px,
              transparent 1px
            );

          background-size: 52px 52px;

          mask-image:
            radial-gradient(
              ellipse at center,
              black 0%,
              rgba(0,0,0,.42) 38%,
              transparent 74%
            );

          opacity: 0.32;

          transform:
            translate3d(
              calc(var(--pbd-mx) * -0.12),
              calc(var(--pbd-my) * -0.12),
              0
            );
        }

        .pbd-hit-target {
          position: absolute;

          width: 190px;
          height: 150px;

          margin: -75px 0 0 -95px;

          padding: 0;

          border: 0;

          background: transparent;

          pointer-events: auto;

          cursor: default;
        }

        .pbd-object {
          position: absolute;

          width: 190px;
          height: 150px;

          transform:
            translate3d(-50%, -50%, 0)
            translate3d(
              calc(var(--pbd-mx) * 0.7),
              calc(var(--pbd-my) * 0.7),
              0
            )
            rotate(var(--pbd-rotate))
            scale(var(--pbd-scale));

          opacity: var(--pbd-opacity);

          animation:
            pbd-float
            var(--pbd-duration)
            var(--pbd-delay)
            ease-in-out
            infinite;

          transition:
            opacity 400ms ease,
            filter 400ms ease,
            transform 650ms cubic-bezier(.22,.61,.36,1);

          filter:
            drop-shadow(0 14px 16px rgba(42, 45, 48, 0.025));

          transform-origin: center;
        }

        .pbd-object.is-active {
          opacity: 0.96;

          filter:
            drop-shadow(0 18px 22px rgba(42, 45, 48, 0.055));
        }

        .pbd-object__graphic {
          position: absolute;
          inset: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          transform:
            translate3d(
              calc(var(--pbd-mx) * 0.2),
              calc(var(--pbd-my) * 0.2),
              0
            );

          transition: transform 600ms ease;
        }

        .pbd-object.is-active .pbd-object__graphic {
          transform: scale(1.045);
        }

        .pbd-svg {
          width: 190px;
          height: 150px;

          overflow: visible;
        }

        .pbd-line {
          fill: none;

          stroke: var(--pbd-ink);

          stroke-width: 1.25;

          vector-effect: non-scaling-stroke;

          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .pbd-accent-line {
          fill: none;

          stroke: var(--pbd-warm);

          stroke-width: 1.05;

          vector-effect: non-scaling-stroke;

          stroke-linecap: round;
        }

        .pbd-dashed {
          fill: none;

          stroke: var(--pbd-soft);

          stroke-width: 1;

          stroke-dasharray: 2 6;

          vector-effect: non-scaling-stroke;
        }

        .pbd-node {
          fill: #fafafa;

          stroke: var(--pbd-ink);

          stroke-width: 1.1;

          vector-effect: non-scaling-stroke;
        }

        .pbd-node-fill {
          fill: var(--pbd-warm);
          opacity: 0.72;
        }

        .pbd-node-fill.muted {
          fill: var(--pbd-soft);
        }

        .pbd-node-fill.soft {
          fill: var(--pbd-faint);
        }

        .pbd-bars {
          fill: rgba(76, 81, 86, 0.13);
          stroke: var(--pbd-ink);
          stroke-width: 0.8;
        }

        .pbd-grid {
          fill: rgba(77, 82, 87, 0.05);
          stroke: var(--pbd-soft);
          stroke-width: 0.8;
        }

        .pbd-panel {
          fill: rgba(250, 250, 249, 0.4);
          stroke: var(--pbd-ink);
          stroke-width: 1.2;
        }

        .pbd-mini-label {
          fill: var(--pbd-ink);

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          font-size: 7px;

          letter-spacing: 1.8px;

          text-anchor: middle;

          opacity: 0.66;
        }

        .pbd-object__label {
          position: absolute;

          left: 50%;
          bottom: -2px;

          transform: translateX(-50%);

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          font-size: 8px;

          line-height: 1;

          letter-spacing: 0.22em;

          white-space: nowrap;

          color: var(--pbd-ink);

          opacity: 0.42;

          transition:
            opacity 350ms ease,
            transform 350ms ease;
        }

        .pbd-object.is-active .pbd-object__label {
          opacity: 0.85;
          transform: translateX(-50%) translateY(-3px);
        }

        .pbd-object__halo {
          position: absolute;

          left: 50%;
          top: 50%;

          width: 112px;
          height: 76px;

          transform: translate(-50%, -50%);

          border-radius: 50%;

          background:
            radial-gradient(
              ellipse,
              rgba(180, 169, 155, 0.075),
              transparent 68%
            );

          opacity: 0.8;

          pointer-events: none;
        }

        .pbd-object__cross {
          position: absolute;

          width: 8px;
          height: 8px;

          opacity: 0.36;
        }

        .pbd-object__cross::before,
        .pbd-object__cross::after {
          content: "";

          position: absolute;

          left: 50%;
          top: 50%;

          background: var(--pbd-soft);

          transform: translate(-50%, -50%);
        }

        .pbd-object__cross::before {
          width: 8px;
          height: 1px;
        }

        .pbd-object__cross::after {
          width: 1px;
          height: 8px;
        }

        .pbd-object__cross--a {
          left: 12px;
          top: 28px;
        }

        .pbd-object__cross--b {
          right: 14px;
          bottom: 27px;
        }

        .pbd-corner {
          position: absolute;

          display: flex;
          align-items: center;
          gap: 8px;

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          font-size: 8px;

          letter-spacing: 0.16em;

          color: var(--pbd-ink);

          opacity: 0.28;

          white-space: nowrap;
        }

        .pbd-corner i {
          display: block;

          width: 18px;
          height: 1px;

          background: var(--pbd-soft);

          opacity: 0.7;
        }

        .pbd-corner--tl {
          left: 2.8vw;
          top: 13vh;
        }

        .pbd-corner--tr {
          right: 2.8vw;
          top: 15vh;
        }

        .pbd-corner--bl {
          left: 3.4vw;
          bottom: 9vh;
        }

        .pbd-corner--br {
          right: 3.4vw;
          bottom: 8vh;
        }

        .pbd-flow-label {
          position: absolute;

          display: flex;
          flex-direction: column;
          gap: 3px;

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          letter-spacing: 0.2em;

          color: var(--pbd-ink);

          opacity: 0.23;
        }

        .pbd-flow-label span {
          font-size: 7px;
        }

        .pbd-flow-label b {
          font-size: 10px;
          font-weight: 500;
        }

        .pbd-flow-label--one {
          left: 24%;
          top: 25%;
        }

        .pbd-flow-label--two {
          left: 61%;
          top: 43%;
        }

        .pbd-flow-label--three {
          left: 43%;
          bottom: 15%;
        }

        @keyframes pbd-dash-flow {
          to {
            stroke-dashoffset: -120;
          }
        }

        @keyframes pbd-float {
          0%,
          100% {
            translate: 0 0;
          }

          50% {
            translate: 0 -5px;
          }
        }

        @media (max-width: 1100px) {
          .pbd-object {
            transform:
              translate3d(-50%, -50%, 0)
              rotate(var(--pbd-rotate))
              scale(calc(var(--pbd-scale) * 0.86));
          }

          .pbd-corner {
            opacity: 0.2;
          }

          .pbd-flow-label {
            opacity: 0.16;
          }
        }

        @media (max-width: 768px) {
          .portfolio-blueprint-doodles {
            position: absolute;

            height: 100%;

            min-height: 100vh;
          }

          .pbd-grid-field {
            opacity: 0.45;
            background-size: 40px 40px;
          }

          .pbd-paths {
            opacity: 0.7;
          }

          .pbd-object {
            transform:
              translate3d(-50%, -50%, 0)
              rotate(var(--pbd-rotate))
              scale(calc(var(--pbd-scale) * 0.62));

            opacity: calc(var(--pbd-opacity) * 0.72);
          }

          .pbd-object:nth-of-type(n + 6) {
            display: none;
          }

          .pbd-corner {
            display: none;
          }

          .pbd-flow-label {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .portfolio-blueprint-doodles {
            position: absolute;
          }

          .pbd-path {
            animation: none;
          }

          .pbd-arrow-path {
            animation: none;
          }

          .pbd-object {
            animation: none;
            transition: none;
          }

          .pbd-paths,
          .pbd-grid-field {
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
