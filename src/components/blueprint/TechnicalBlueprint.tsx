import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../hooks';

/**
 * SINGLE-FILE INTEGRATION
 * -----------------------
 * Replace:
 *   src/components/blueprint/TechnicalBlueprint.tsx
 *
 * Delete/ignore:
 *   src/components/blueprint/TechnicalBlueprint.css
 *
 * All blueprint/doodle CSS is embedded in this file.
 * Existing imports and exported component names are preserved.
 */
const BLUEPRINT_STYLES = "/* =========================================================================\n   Phase 8 — Technical Blueprint System Styles\n   Subtle architectural and engineering visual language:\n   - Faint hairlines and coordinate axes\n   - Curved dashed trajectory paths\n   - Authentic technical SVG symbols (Neural Lattice, Vector Cylinder, Logic Node)\n   - Monospace micro-badges ([DATA], [MODEL], [REASONING], [PIPELINE], [SYSTEM], [IMPACT])\n   - Restrained titanium-amber and slate accents\n   - Full reduced-motion and mobile safeguards\n   ========================================================================= */\n\n:root {\n  --bp-stroke: rgba(9, 13, 22, 0.22);\n  --bp-stroke-subtle: rgba(9, 13, 22, 0.14);\n  --bp-stroke-accent: rgba(196, 142, 82, 0.60);\n  --bp-stroke-hover: rgba(196, 142, 82, 0.90);\n  --bp-node-fill: #ffffff;\n  --bp-node-stroke: rgba(9, 13, 22, 0.40);\n  --bp-node-accent: #c48e52;\n  --bp-tag-bg: rgba(255, 255, 255, 0.95);\n  --bp-tag-border: rgba(9, 13, 22, 0.16);\n  --bp-tag-color: #344054;\n}\n\n/* -------------------------------------------------------------------------\n   1. Anchored Field (Two-Speed Visual Spine)\n   Fixed in viewport, drifts with subtle low-speed scroll parallax.\n------------------------------------------------------------------------- */\n.bp-anchored-field {\n  position: fixed;\n  inset: 0;\n  pointer-events: none;\n  z-index: 1;\n  overflow: hidden;\n}\n\n.bp-spine {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 32px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-around;\n  opacity: 0.75;\n  user-select: none;\n}\n\n.bp-spine--left {\n  left: clamp(8px, 2vw, 28px);\n  border-right: 1px dashed var(--bp-stroke-subtle);\n}\n\n.bp-spine--right {\n  right: clamp(8px, 2vw, 28px);\n  border-left: 1px dashed var(--bp-stroke-subtle);\n}\n\n.bp-spine__mark {\n  font-family: var(--font-mono);\n  font-size: 0.62rem;\n  letter-spacing: 0.1em;\n  color: var(--bp-stroke);\n  writing-mode: vertical-rl;\n  transform: rotate(180deg);\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.bp-spine__mark::before {\n  content: '';\n  display: inline-block;\n  width: 6px;\n  height: 1px;\n  background: var(--bp-stroke);\n}\n\n.bp-crosshair {\n  font-family: var(--font-mono);\n  font-size: 0.72rem;\n  color: var(--bp-stroke);\n  opacity: 0.75;\n}\n\n/* -------------------------------------------------------------------------\n   2. Section Blueprint Layer (Positioned inside respective sections)\n------------------------------------------------------------------------- */\n.bp-section-layer {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  overflow: hidden;\n  z-index: 0;\n}\n\n/* SVG Line & Path Styles */\n.bp-svg {\n  position: absolute;\n  overflow: visible;\n  pointer-events: none;\n}\n\n.bp-path {\n  fill: none;\n  stroke: var(--bp-stroke);\n  stroke-width: 1.5px;\n  stroke-dasharray: 4 4;\n  transition: stroke 0.3s ease, stroke-width 0.3s ease;\n}\n\n.bp-path--solid {\n  stroke-dasharray: none;\n  stroke: var(--bp-stroke-subtle);\n}\n\n.bp-path--animated {\n  animation: bpDashMarch 20s linear infinite;\n}\n\n.bp-path--accent {\n  stroke: var(--bp-stroke-accent);\n}\n\n.bp-arrow {\n  fill: var(--bp-stroke);\n  transition: fill 0.3s ease;\n}\n\n.bp-node {\n  fill: var(--bp-node-fill);\n  stroke: var(--bp-node-stroke);\n  stroke-width: 1.8px;\n  transition: stroke 0.3s ease, fill 0.3s ease, r 0.3s ease;\n}\n\n.bp-node--accent {\n  stroke: var(--bp-node-accent);\n  fill: var(--bp-node-fill);\n}\n\n/* -------------------------------------------------------------------------\n   3. Floating Technical Objects\n------------------------------------------------------------------------- */\n.bp-object {\n  position: absolute;\n  pointer-events: auto;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  cursor: pointer;\n  outline: none;\n  border-radius: var(--radius-sm);\n  padding: 4px;\n  background: transparent;\n  border: none;\n  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);\n  will-change: transform;\n}\n\n/* Gentle Idle Float */\n.bp-object--drift-a {\n  animation: bpDriftA 7s ease-in-out infinite alternate;\n}\n\n.bp-object--drift-b {\n  animation: bpDriftB 8.5s ease-in-out infinite alternate;\n}\n\n.bp-object--drift-c {\n  animation: bpDriftC 6.5s ease-in-out infinite alternate;\n}\n\n/* Hover & Focus States */\n.bp-object:hover,\n.bp-object:focus-visible {\n  transform: scale(1.08) translateY(-2px);\n}\n\n.bp-object:hover .bp-path,\n.bp-object:focus-visible .bp-path {\n  stroke: var(--bp-stroke-hover);\n}\n\n.bp-object:hover .bp-node,\n.bp-object:focus-visible .bp-node {\n  stroke: var(--bp-node-accent);\n  r: 3.5;\n}\n\n.bp-object:hover .bp-tag,\n.bp-object:focus-visible .bp-tag {\n  color: var(--fg);\n  border-color: rgba(196, 142, 82, 0.4);\n  background: #ffffff;\n  box-shadow: 0 2px 10px rgba(196, 142, 82, 0.12), var(--shadow-xs);\n  transform: translateY(-1px);\n}\n\n.bp-object:focus-visible {\n  box-shadow: 0 0 0 2px rgba(196, 142, 82, 0.4);\n}\n\n/* Monospace Micro-Badge */\n.bp-tag {\n  font-family: var(--font-mono);\n  font-size: 0.62rem;\n  letter-spacing: 0.09em;\n  text-transform: uppercase;\n  font-weight: 500;\n  color: var(--bp-tag-color);\n  background: var(--bp-tag-bg);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  border: 1px solid var(--bp-tag-border);\n  border-radius: var(--radius-pill);\n  padding: 2px 7px;\n  margin-top: 5px;\n  box-shadow: var(--shadow-xs);\n  transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;\n  white-space: nowrap;\n  user-select: none;\n}\n\n/* Subtle Technical Coordinate Badge */\n.bp-coord {\n  font-family: var(--font-mono);\n  font-size: 0.58rem;\n  letter-spacing: 0.08em;\n  color: var(--subtle-fg);\n  opacity: 0.65;\n  user-select: none;\n}\n\n/* -------------------------------------------------------------------------\n   4. Section-Specific Positioning & Alignments\n------------------------------------------------------------------------- */\n/* Hero Blueprint containers: legacy hero objects hidden cleanly */\n.bp-hero-container, .bp-hero-left-container {\n  display: none !important;\n}\n\n/* About Blueprint: right whitespace beside core domains */\n.bp-about-container {\n  position: absolute;\n  top: clamp(10%, 15%, 25%);\n  right: clamp(16px, 3.5vw, 64px);\n  width: 130px;\n  height: 200px;\n  pointer-events: none;\n}\n\n/* Skills Blueprint: hairline rails framing the top and bottom of .skills__rails */\n.bp-skills-bus {\n  position: relative;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 6px 0;\n  user-select: none;\n  pointer-events: none;\n}\n\n.bp-skills-bus--top {\n  margin-bottom: 8px;\n  border-bottom: 1px dashed var(--bp-stroke-subtle);\n}\n\n.bp-skills-bus--bottom {\n  margin-top: 8px;\n  border-top: 1px dashed var(--bp-stroke-subtle);\n}\n\n.bp-skills-bus__label {\n  font-family: var(--font-mono);\n  font-size: 0.60rem;\n  letter-spacing: 0.1em;\n  color: var(--subtle-fg);\n  opacity: 0.75;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n\n/* Projects Blueprint: outer margins */\n.bp-projects-container {\n  position: absolute;\n  top: 120px;\n  right: clamp(12px, 3vw, 56px);\n  width: 130px;\n  height: 180px;\n  pointer-events: none;\n}\n\n/* Training Blueprint: vertical circuit trace */\n.bp-training-container {\n  position: absolute;\n  top: 100px;\n  right: clamp(12px, 3vw, 56px);\n  width: 120px;\n  height: 180px;\n  pointer-events: none;\n}\n\n/* Contact Blueprint: terminal path leading near CTA */\n.bp-contact-container {\n  position: absolute;\n  bottom: clamp(24px, 6vh, 64px);\n  left: clamp(16px, 3.5vw, 64px);\n  width: 140px;\n  height: 160px;\n  pointer-events: none;\n}\n\n/* -------------------------------------------------------------------------\n   5. Keyframes & Animations\n------------------------------------------------------------------------- */\n@keyframes bpDriftA {\n  0% {\n    transform: translateY(0px) rotate(0deg);\n  }\n  100% {\n    transform: translateY(-4px) rotate(0.4deg);\n  }\n}\n\n@keyframes bpDriftB {\n  0% {\n    transform: translateY(0px) rotate(0deg);\n  }\n  100% {\n    transform: translateY(3.5px) rotate(-0.3deg);\n  }\n}\n\n@keyframes bpDriftC {\n  0% {\n    transform: translateY(0px);\n  }\n  100% {\n    transform: translateY(-3px);\n  }\n}\n\n@keyframes bpDashMarch {\n  to {\n    stroke-dashoffset: -32;\n  }\n}\n\n@keyframes bpPulseSubtle {\n  0%, 100% {\n    opacity: 0.5;\n  }\n  50% {\n    opacity: 0.9;\n  }\n}\n\n/* -------------------------------------------------------------------------\n   6. Responsive Layout Breakdowns\n------------------------------------------------------------------------- */\n@media (max-width: 1024px) {\n  .bp-spine--right {\n    display: none;\n  }\n  .bp-hero-container {\n    right: 12px;\n    transform: scale(0.9);\n    transform-origin: top right;\n  }\n  .bp-hero-left-container {\n    display: none; /* Hide left marker on tablet to keep room for content */\n  }\n  .bp-about-container {\n    right: 12px;\n    transform: scale(0.9);\n    transform-origin: top right;\n  }\n  .bp-projects-container,\n  .bp-training-container {\n    display: none; /* Keep page clean on tablet to prioritize content */\n  }\n}\n\n@media (max-width: 768px) {\n  /* Complete elimination of anchored spine on mobile to maximize viewport width */\n  .bp-anchored-field {\n    display: none;\n  }\n\n  /* Hide hero blueprint and other section objects on mobile to keep viewport clean & prevent overlap with 3D assistant */\n  .bp-hero-container,\n  .bp-hero-left-container,\n  .bp-about-container,\n  .bp-projects-container,\n  .bp-training-container,\n  .bp-contact-container {\n    display: none;\n  }\n\n  .bp-skills-bus {\n    padding: 3px 0;\n  }\n}\n\n/* -------------------------------------------------------------------------\n   7. Accessibility: Prefers-Reduced-Motion\n   Zero animations, zero transforms; linework remains as clean static schematic.\n------------------------------------------------------------------------- */\n@media (prefers-reduced-motion: reduce), (update: slow) {\n  .bp-object,\n  .bp-object--drift-a,\n  .bp-object--drift-b,\n  .bp-object--drift-c,\n  .bp-path--animated,\n  .bp-anchored-field {\n    animation: none !important;\n    transition: none !important;\n    transform: none !important;\n  }\n}\n\n.reduced-motion .bp-object,\n.reduced-motion .bp-object--drift-a,\n.reduced-motion .bp-object--drift-b,\n.reduced-motion .bp-object--drift-c,\n.reduced-motion .bp-path--animated,\n.reduced-motion .bp-anchored-field {\n  animation: none !important;\n  transition: none !important;\n  transform: none !important;\n}\n";

function BlueprintStyles() {
  return <style data-technical-blueprint="true">{BLUEPRINT_STYLES}</style>;
}


/* =========================================================================
   AUTHENTIC TECHNICAL SVG SYMBOLS
   Clean vector schematics: no stock art, no fabricated metrics.
   ========================================================================= */

/**
 * 1. Neural Network Architecture Schematic
 * 3 layers: Input (3), Latent/Hidden (4), Output (2) with synaptic interconnects.
 */
export function NeuralLattice({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`bp-symbol ${className}`}
      width="64"
      height="54"
      viewBox="0 0 64 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Synaptic interconnect hairlines */}
      {/* Layer 1 -> Layer 2 */}
      <line x1="12" y1="12" x2="32" y2="8" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="12" y1="12" x2="32" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="12" y1="12" x2="32" y2="34" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <line x1="12" y1="27" x2="32" y2="8" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="12" y1="27" x2="32" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="12" y1="27" x2="32" y2="34" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="12" y1="27" x2="32" y2="46" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="12" y1="42" x2="32" y2="20" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      <line x1="12" y1="42" x2="32" y2="34" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="12" y1="42" x2="32" y2="46" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

      {/* Layer 2 -> Layer 3 */}
      <line x1="32" y1="8" x2="52" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="32" y1="20" x2="52" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="32" y1="20" x2="52" y2="36" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="32" y1="34" x2="52" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <line x1="32" y1="34" x2="52" y2="36" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <line x1="32" y1="46" x2="52" y2="36" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

      {/* Nodes - Input Layer */}
      <circle cx="12" cy="12" r="2.5" className="bp-node" />
      <circle cx="12" cy="27" r="2.5" className="bp-node bp-node--accent" />
      <circle cx="12" cy="42" r="2.5" className="bp-node" />

      {/* Nodes - Hidden Layer */}
      <circle cx="32" cy="8" r="2.5" className="bp-node" />
      <circle cx="32" cy="20" r="2.5" className="bp-node bp-node--accent" />
      <circle cx="32" cy="34" r="2.5" className="bp-node bp-node--accent" />
      <circle cx="32" cy="46" r="2.5" className="bp-node" />

      {/* Nodes - Output Layer */}
      <circle cx="52" cy="18" r="2.5" className="bp-node bp-node--accent" />
      <circle cx="52" cy="36" r="2.5" className="bp-node" />
    </svg>
  );
}

/**
 * 2. Vector Database Cylinder Schematic
 * Layered isometric embeddings store with segmented partitions.
 */
export function DatabaseCylinder({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`bp-symbol ${className}`}
      width="54"
      height="58"
      viewBox="0 0 54 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top Cap */}
      <ellipse cx="27" cy="12" rx="20" ry="6" className="bp-node bp-node--accent" strokeWidth="1.2" />
      
      {/* Tier 1 Body */}
      <path d="M7 12V24C7 27.3 15.9 30 27 30C38.1 30 47 27.3 47 24V12" className="bp-path" strokeWidth="1.2" />
      {/* Tier 2 Body */}
      <path d="M7 24V36C7 39.3 15.9 42 27 42C38.1 42 47 39.3 47 36V24" className="bp-path" strokeWidth="1.2" />
      {/* Tier 3 Body */}
      <path d="M7 36V46C7 49.3 15.9 52 27 52C38.1 52 47 49.3 47 46V36" className="bp-path bp-path--solid" strokeWidth="1.2" />

      {/* Internal partition ticks */}
      <line x1="27" y1="18" x2="27" y2="24" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="27" y1="30" x2="27" y2="36" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <line x1="27" y1="42" x2="27" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

      {/* Small center coordinate dot */}
      <circle cx="27" cy="12" r="1.5" className="bp-node" />
    </svg>
  );
}

/**
 * 3. AI Reasoning / Logic Gate Node
 * Hexagonal decision node with vector branches.
 */
export function ReasoningNode({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`bp-symbol ${className}`}
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Input vector paths */}
      <path d="M12 8L28 20" className="bp-path" strokeWidth="1" />
      <path d="M44 8L28 20" className="bp-path" strokeWidth="1" />
      
      {/* Outer Hexagon */}
      <polygon
        points="28,14 42,22 42,38 28,46 14,38 14,22"
        className="bp-node bp-node--accent"
        strokeWidth="1.2"
      />

      {/* Inner Core Diamond */}
      <polygon
        points="28,24 34,28 28,34 22,28"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="28" cy="28" r="1.8" className="bp-node" />

      {/* Output branch */}
      <path d="M28 46V54" className="bp-path bp-path--solid" strokeWidth="1.2" />
      <circle cx="28" cy="54" r="2" className="bp-node bp-node--accent" />
    </svg>
  );
}

/**
 * 4. Pipeline Junction & System Flow Valve
 * Orthogonal flow conduits with direction chevrons.
 */
export function PipelineJunction({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`bp-symbol ${className}`}
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Horizontal conduit */}
      <line x1="4" y1="28" x2="52" y2="28" className="bp-path" strokeWidth="1.2" />
      {/* Vertical branch */}
      <line x1="28" y1="4" x2="28" y2="52" className="bp-path bp-path--solid" strokeWidth="1.2" />

      {/* Center node ring */}
      <circle cx="28" cy="28" r="7" className="bp-node" strokeWidth="1.2" />
      <circle cx="28" cy="28" r="2.5" className="bp-node bp-node--accent" />

      {/* Direction chevrons */}
      <path d="M42 25L45 28L42 31" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M25 42L28 45L31 42" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

/* =========================================================================
   ANCHORED FIELD (TWO-SPEED VISUAL FIELD)
   Subtle reference spine along page margins drifting at 0.08x scroll rate.
   ========================================================================= */
export function BlueprintAnchoredField() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Slow 0.08x parallax translation: creates depth behind natural 1x page scroll
  const spineY = useTransform(scrollY, [0, 4000], ['0px', '-320px']);

  return (
    <>
      <BlueprintStyles />
      <div className="bp-anchored-field" aria-hidden="true">
      {/* Left Reference Spine */}
      <motion.div
        className="bp-spine bp-spine--left"
        style={reducedMotion ? undefined : { y: spineY }}
      >
        <span className="bp-crosshair">+</span>
        <span className="bp-spine__mark">SYS // RDY</span>
        <span className="bp-crosshair">+</span>
        <span className="bp-spine__mark">AXIS // α</span>
        <span className="bp-crosshair">+</span>
        <span className="bp-spine__mark">GRID // 64</span>
        <span className="bp-crosshair">+</span>
      </motion.div>

      {/* Right Reference Spine */}
      <motion.div
        className="bp-spine bp-spine--right"
        style={reducedMotion ? undefined : { y: spineY }}
      >
        <span className="bp-crosshair">+</span>
        <span className="bp-spine__mark">NODE // 01</span>
        <span className="bp-crosshair">+</span>
        <span className="bp-spine__mark">SPEC // 1.0</span>
        <span className="bp-crosshair">+</span>
        <span className="bp-spine__mark">FLOW // SEQ</span>
        <span className="bp-crosshair">+</span>
      </motion.div>
      </div>
    </>
  );
}

/* =========================================================================
   SECTION BLUEPRINT LAYERS
   Rendered inside each respective section, placed in natural whitespace.
   ========================================================================= */

/**
 * Hero Blueprint
 * Placed in the outer right whitespace of the Hero.
 * Trajectory: curved dashed path arcing down toward About section with [MODEL] node.
 */
export function HeroBlueprint() {
  // Legacy Hero Blueprint objects ([MODEL] NODE // 02) cleanly removed
  return null;
}

export function HeroBlueprintLeft() {
  // Legacy Hero Blueprint Left object ([BUILD // 00] SRC // ORIGIN) cleanly removed
  return null;
}


/**
 * About Blueprint
 * Placed beside the About domains in open whitespace.
 * Object: Vector Database Cylinder with [DATA] node.
 */
export function AboutBlueprint() {
  return (
    <div className="bp-about-container" aria-hidden="false">
      <svg
        className="bp-svg"
        width="130"
        height="200"
        viewBox="0 0 130 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Downward curving guide */}
        <path
          d="M65 65 C65 110 30 140 30 185"
          className="bp-path"
          strokeWidth="1.2"
        />
        <polygon points="30,192 26,184 34,184" className="bp-arrow" />
        <circle cx="65" cy="65" r="2.5" className="bp-node" />
      </svg>

      <button
        type="button"
        className="bp-object bp-object--drift-b"
        style={{ top: '10px', left: '38px' }}
        aria-label="Technical blueprint diagram: Vector Data Store"
      >
        <DatabaseCylinder />
        <span className="bp-tag">[DATA]</span>
        <span className="bp-coord">NODE // 01</span>
      </button>
    </div>
  );
}

/**
 * Skills Blueprint
 * Framing hairline buses framing the continuous technology rails.
 */
export function SkillsBlueprint({ position }: { position: 'top' | 'bottom' }) {
  if (position === 'top') {
    return (
      <div className="bp-skills-bus bp-skills-bus--top" aria-hidden="true">
        <span className="bp-skills-bus__label">
          <span className="bp-node bp-node--accent" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%' }} />
          [PIPELINE // DATA_FLOW]
        </span>
        <span className="bp-coord">Continuous Ingestion &rarr;</span>
      </div>
    );
  }

  return (
    <div className="bp-skills-bus bp-skills-bus--bottom" aria-hidden="true">
      <span className="bp-coord">&larr; Continuous Reasoning</span>
      <span className="bp-skills-bus__label">
        [SYSTEM // STACK]
        <span className="bp-node" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%' }} />
      </span>
    </div>
  );
}

/**
 * Projects Blueprint
 * Placed in the outer whitespace margin near projects.
 * Object: AI Reasoning / Logic Gate with [REASONING] node.
 */
export function ProjectsBlueprint() {
  return (
    <div className="bp-projects-container" aria-hidden="false">
      <svg
        className="bp-svg"
        width="130"
        height="180"
        viewBox="0 0 130 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M65 65 C65 105 95 130 95 165"
          className="bp-path"
          strokeWidth="1.2"
        />
        <circle cx="65" cy="65" r="2.5" className="bp-node bp-node--accent" />
      </svg>

      <button
        type="button"
        className="bp-object bp-object--drift-c"
        style={{ top: '10px', left: '38px' }}
        aria-label="Technical blueprint diagram: AI Reasoning Engine"
      >
        <ReasoningNode />
        <span className="bp-tag">[REASONING]</span>
        <span className="bp-coord">NODE // 03</span>
      </button>
    </div>
  );
}

/**
 * Training Blueprint
 * Placed in the training section margin.
 * Object: System Pipeline Junction with [SYSTEM] node.
 */
export function TrainingBlueprint() {
  return (
    <div className="bp-training-container" aria-hidden="false">
      <svg
        className="bp-svg"
        width="120"
        height="180"
        viewBox="0 0 120 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M60 65 V165"
          className="bp-path"
          strokeWidth="1.2"
        />
        <circle cx="60" cy="65" r="2.5" className="bp-node" />
      </svg>

      <button
        type="button"
        className="bp-object bp-object--drift-b"
        style={{ top: '10px', left: '32px' }}
        aria-label="Technical blueprint diagram: System Pipeline"
      >
        <PipelineJunction />
        <span className="bp-tag">[SYSTEM]</span>
        <span className="bp-coord">NODE // 04</span>
      </button>
    </div>
  );
}

/**
 * Contact Blueprint
 * Clean terminal path in the contact section guiding towards the CTA panel with [IMPACT] node.
 */
export function ContactBlueprint() {
  return (
    <div className="bp-contact-container" aria-hidden="false">
      <svg
        className="bp-svg"
        width="140"
        height="160"
        viewBox="0 0 140 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M30 20 C30 70 85 90 85 140"
          className="bp-path bp-path--animated"
          strokeWidth="1.2"
        />
        <polygon points="85,146 81,138 89,138" className="bp-arrow" />
        <circle cx="30" cy="20" r="2.5" className="bp-node bp-node--accent" />
      </svg>

      <div
        className="bp-object bp-object--drift-a"
        style={{ top: '10px', left: '8px' }}
      >
        <span className="bp-tag" style={{ marginTop: 0 }}>[IMPACT]</span>
        <span className="bp-coord">NODE // 05</span>
      </div>
    </div>
  );
}
