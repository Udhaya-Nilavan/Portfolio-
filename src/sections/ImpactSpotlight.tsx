import { useEffect, useInsertionEffect, useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { personalData } from '../data/personal';
import { certificationsData } from '../data/certifications';
import { projectsData } from '../data/projects';
import { achievementsData } from '../data/achievements';
import { skillsData } from '../data/skills';

/**
 * Lesmana-inspired Impact / At-a-Glance section
 * -------------------------------------------------
 * Single self-contained file replacing ImpactSpotlight.tsx.
 *
 * Integrates editorial dark portrait focal card with surrounding
 * grounded telemetry metrics:
 * - Credentials recorded (certificationsData.length)
 * - Projects built (projectsData.length)
 * - Verified platform achievements (achievementsData.length)
 * - Core AI & data domains (personalData.coreDomains.length)
 * - Unique skills in portfolio (computed set from skillsData)
 *
 * Performance:
 * - Scroll tracking via Framer Motion useScroll + useTransform (zero per-frame React state re-renders)
 * - Count-up animation executes once upon entering view; never counts down
 * - Full reduced-motion and screen-reader accessibility (aria-hidden on animated nodes + sr-only text)
 * - Fully transparent section background to allow global canvas backdrop and blueprint doodles to show through
 */

export type ImpactStat = {
  value: string;
  label: string;
  side: 'left' | 'right';
  position: 'top' | 'middle' | 'bottom';
};

export interface ImpactSpotlightProps {
  id?: string;
  stats?: ImpactStat[];
  eyebrow?: string;
  title?: string;
  body?: string;
  chips?: string[];
  name?: string;
  caption?: string;
}

const uniqueSkillsCount = new Set(
  skillsData.flatMap((c) => c.skills.map((s) => s.name.trim().toLowerCase()))
).size;

export function buildDefaultStats(): ImpactStat[] {
  return [
    {
      value: String(certificationsData.length),
      label: 'Credentials recorded',
      side: 'left',
      position: 'top',
    },
    {
      value: String(projectsData.length),
      label: 'Projects built',
      side: 'left',
      position: 'middle',
    },
    {
      value: String(achievementsData.length),
      label: 'Verified platform achievements',
      side: 'right',
      position: 'top',
    },
    {
      value: String(personalData.coreDomains.length),
      label: 'Core AI & data domains',
      side: 'right',
      position: 'middle',
    },
    {
      value: String(uniqueSkillsCount),
      label: 'Unique skills in portfolio',
      side: 'right',
      position: 'bottom',
    },
  ];
}

function parseStatValue(raw: string) {
  const match = raw.match(/^([^\d]*)([-+]?\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: '', num: null, suffix: raw };
  }
  return {
    prefix: match[1] || '',
    num: Number(match[2]),
    suffix: match[3] || '',
  };
}

interface CountUpProps {
  to: number;
  run: boolean;
  delay: number;
  instant: boolean;
}

function CountUp({ to, run, delay, instant }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (instant) {
      node.textContent = String(to);
      return;
    }
    if (!run) {
      node.textContent = '0';
      return;
    }

    let frame = 0;
    let startedAt = 0;
    const duration = 1350;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      node.textContent = String(Math.round(to * ease));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [to, run, delay, instant]);

  return (
    <span ref={ref} className="lesmana-stat__count">
      {instant ? to : 0}
    </span>
  );
}

function StatBlock({
  stat,
  index,
  scrollYProgress,
  reducedMotion,
  hasEntered,
}: {
  stat: ImpactStat;
  index: number;
  scrollYProgress: MotionValue<number>;
  reducedMotion: boolean;
  hasEntered: boolean;
}) {
  const { prefix, num, suffix } = useMemo(() => parseStatValue(stat.value), [stat.value]);
  const direction = stat.side === 'left' ? -1 : 1;

  const yOffset =
    stat.position === 'top'
      ? -18
      : stat.position === 'middle'
        ? 6
        : 22;

  const rangeStart = Math.min(0.7, 0.05 + index * 0.06);
  const rangeEnd = Math.min(0.95, rangeStart + 0.35);

  const opacity = useTransform(scrollYProgress, [rangeStart, rangeEnd], [0.35, 1], { clamp: true });
  const x = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd],
    reducedMotion ? [0, 0] : [direction * 50, 0],
    { clamp: true }
  );
  const y = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd],
    reducedMotion ? [0, 0] : [yOffset, 0],
    { clamp: true }
  );

  return (
    <motion.div
      className={`lesmana-stat lesmana-stat--${stat.side} lesmana-stat--${stat.position}`}
      style={{
        opacity: reducedMotion ? 1 : opacity,
        x,
        y,
      }}
    >
      <div className="lesmana-stat__value">
        {num !== null ? (
          <>
            <span aria-hidden="true">
              {prefix}
              <CountUp
                to={num}
                run={hasEntered}
                delay={index * 110}
                instant={reducedMotion}
              />
              {suffix}
            </span>
            <span className="lesmana-sr-only">{stat.value}</span>
          </>
        ) : (
          <span>{stat.value}</span>
        )}
      </div>

      <div className="lesmana-stat__line" aria-hidden="true" />

      <div className="lesmana-stat__label">{stat.label}</div>
    </motion.div>
  );
}

export function ImpactSpotlight({
  id = 'impact',
  stats,
  eyebrow = 'AT A GLANCE',
  title = personalData.statusBadge.label,
  body = personalData.shortStatement,
  chips = personalData.secondaryRoles.slice(0, 6),
  name = personalData.name,
  caption = 'VERIFIED PORTFOLIO',
}: ImpactSpotlightProps) {
  useInjectStyles();

  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.12,
  });

  const resolvedStats = useMemo(() => stats ?? buildDefaultStats(), [stats]);

  const statGroups = useMemo(
    () => ({
      left: resolvedStats.filter((item) => item.side === 'left'),
      right: resolvedStats.filter((item) => item.side === 'right'),
    }),
    [resolvedStats]
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -40]);

  const cardY = useTransform(scrollYProgress, [0.06, 0.52], reducedMotion ? [0, 0] : [65, 0], {
    clamp: true,
  });
  const cardScale = useTransform(scrollYProgress, [0.06, 0.52], reducedMotion ? [1, 1] : [0.94, 1], {
    clamp: true,
  });
  const cardRotateX = useTransform(scrollYProgress, [0.06, 0.52], reducedMotion ? [0, 0] : [1.5, 0], {
    clamp: true,
  });
  const cardOpacity = useTransform(scrollYProgress, [0.06, 0.48], reducedMotion ? [1, 1] : [0.45, 1], {
    clamp: true,
  });

  const hintOpacity = useTransform(scrollYProgress, [0, 0.6, 0.72], [0.75, 0.75, 0], {
    clamp: true,
  });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`lesmana-impact ${isInView ? 'is-visible' : ''}`}
      aria-label="Impact and portfolio overview"
    >
      <motion.div
        className="lesmana-impact__technical-bg"
        aria-hidden="true"
        style={{
          y: backgroundY,
        }}
      >
        <span className="lesmana-node lesmana-node--a" />
        <span className="lesmana-node lesmana-node--b" />
        <span className="lesmana-node lesmana-node--c" />
        <span className="lesmana-node lesmana-node--d" />
        <span className="lesmana-line lesmana-line--a" />
        <span className="lesmana-line lesmana-line--b" />
        <span className="lesmana-line lesmana-line--c" />
        <span className="lesmana-code lesmana-code--a">INPUT / DATA</span>
        <span className="lesmana-code lesmana-code--b">MODEL / REASONING</span>
        <span className="lesmana-code lesmana-code--c">PIPELINE / CODE</span>
        <span className="lesmana-code lesmana-code--d">BUILD / DEPLOY</span>
      </motion.div>

      <div className="lesmana-impact__inner">
        <div className="lesmana-stats lesmana-stats--left">
          {statGroups.left.map((stat, index) => (
            <StatBlock
              key={`${stat.label}-${index}`}
              stat={stat}
              index={index}
              scrollYProgress={scrollYProgress}
              reducedMotion={reducedMotion}
              hasEntered={isInView}
            />
          ))}
        </div>

        <motion.div
          className="lesmana-impact__card"
          style={{
            opacity: cardOpacity,
            y: cardY,
            scale: cardScale,
            rotateX: cardRotateX,
          }}
        >
          <div className="lesmana-impact__card-glow" aria-hidden="true" />

          <div className="lesmana-impact__card-top">
            <div className="lesmana-impact__eyebrow">
              <span className="lesmana-impact__dot" aria-hidden="true" />
              {eyebrow}
            </div>

            <h2>{title}</h2>

            {chips.length > 0 && (
              <div className="lesmana-impact__chips" aria-label="Key areas of focus">
                {chips.map((chip) => (
                  <span key={chip}>{chip.toUpperCase()}</span>
                ))}
              </div>
            )}
          </div>

          <div className="lesmana-impact__footer">
            <div className="lesmana-impact__author">
              <strong>{name}</strong>
              <span>{caption}</span>
            </div>

            <p>{body}</p>
          </div>

          <div className="lesmana-impact__corner" aria-hidden="true">
            <ArrowDownRight size={17} />
          </div>
        </motion.div>

        <div className="lesmana-stats lesmana-stats--right">
          {statGroups.right.map((stat, index) => (
            <StatBlock
              key={`${stat.label}-${index}`}
              stat={stat}
              index={index + statGroups.left.length}
              scrollYProgress={scrollYProgress}
              reducedMotion={reducedMotion}
              hasEntered={isInView}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="lesmana-impact__scroll-hint"
        aria-hidden="true"
        style={{ opacity: reducedMotion ? 0.6 : hintOpacity }}
        animate={reducedMotion ? undefined : { y: [0, 5, 0] }}
        transition={
          reducedMotion
            ? undefined
            : {
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
        }
      >
        <ArrowUpRight size={14} />
        <span>SCROLL TO EXPLORE</span>
      </motion.div>
    </section>
  );
}

const STYLE_ID = 'lesmana-impact-styles';

function useInjectStyles(): void {
  useInsertionEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = LESMANA_IMPACT_STYLES;
    document.head.appendChild(el);
  }, []);
}

const LESMANA_IMPACT_STYLES = `
.lesmana-impact {
  --lesmana-ink: #080b12;
  --lesmana-ink-2: #11151e;
  --lesmana-text: #f7f8fb;
  --lesmana-muted: #aab0bc;
  --lesmana-accent: #b8c7dc;
  --lesmana-grid: rgba(9, 13, 22, 0.045);

  position: relative;
  min-height: 110vh;
  isolation: isolate;
  background: transparent;
}

.lesmana-impact::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--lesmana-grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--lesmana-grid) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(ellipse 65% 55% at 50% 50%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 50%, #000 0%, transparent 75%);
  opacity: 0.65;
}

.lesmana-impact__inner {
  position: relative;
  width: min(1320px, calc(100% - 48px));
  min-height: 108vh;
  margin-inline: auto;
  display: grid;
  grid-template-columns: minmax(210px, 1fr) minmax(390px, 560px) minmax(210px, 1fr);
  align-items: center;
  gap: clamp(24px, 3.5vw, 64px);
  padding-block: 7rem;
}

.lesmana-impact__card {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 640px;
  padding: clamp(2rem, 3.8vw, 3rem);
  border-radius: 30px;
  overflow: hidden;
  color: var(--lesmana-text);
  background:
    radial-gradient(circle at 76% 18%, rgba(80, 98, 130, 0.2), transparent 30%),
    linear-gradient(145deg, var(--lesmana-ink-2), var(--lesmana-ink));
  box-shadow:
    0 35px 80px rgba(7, 11, 19, 0.22),
    0 12px 28px rgba(7, 11, 19, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transform-origin: center;
  will-change: transform, opacity;
}

.lesmana-impact__card::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: 29px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.lesmana-impact__card-glow {
  position: absolute;
  width: 260px;
  height: 260px;
  top: -110px;
  right: -90px;
  border-radius: 50%;
  background: rgba(153, 180, 220, 0.1);
  filter: blur(45px);
  pointer-events: none;
}

.lesmana-impact__card-top {
  position: relative;
  display: flex;
  flex-direction: column;
}

.lesmana-impact__eyebrow {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.8rem;
  color: #d9a54a;
  font: 600 0.72rem/1 var(--font-mono, ui-monospace, monospace);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.lesmana-impact__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d9a54a;
  box-shadow: 0 0 12px rgba(217, 165, 74, 0.6);
}

.lesmana-impact__card h2 {
  position: relative;
  max-width: 16ch;
  margin: 0;
  font-family: var(--font-display, Georgia, serif);
  font-weight: 600;
  font-size: clamp(2.1rem, 3.8vw, 3.4rem);
  line-height: 1.06;
  letter-spacing: -0.04em;
  color: #ffffff !important;
  text-wrap: balance;
}

.lesmana-impact__chips {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: clamp(1.75rem, 3vw, 2.75rem);
}

.lesmana-impact__chips span {
  padding: 8px 13px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.035);
  font: 600 0.66rem/1 var(--font-mono, ui-monospace, monospace);
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.lesmana-impact__footer {
  position: relative;
  margin-top: clamp(2.5rem, 4vw, 3.5rem);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.lesmana-impact__author {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.lesmana-impact__author strong {
  font-family: var(--font-display, Inter, sans-serif);
  font-weight: 650;
  font-size: 1.05rem;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #ffffff;
}

.lesmana-impact__author span {
  color: #9ba3b2;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-weight: 600;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.lesmana-impact__footer p {
  max-width: 27ch;
  margin: 0;
  color: #cbd5e1;
  font-family: var(--font-body, Inter, sans-serif);
  font-weight: 400;
  font-size: 0.86rem;
  line-height: 1.48;
  text-align: right;
}

.lesmana-impact__corner {
  position: absolute;
  top: 24px;
  right: 24px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  color: #aeb7c6;
  pointer-events: none;
}

.lesmana-stats {
  position: relative;
  z-index: 3;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  pointer-events: none;
}

.lesmana-stat {
  max-width: 265px;
}

.lesmana-stat--left {
  margin-left: auto;
  text-align: right;
}

.lesmana-stat--right {
  margin-right: auto;
  text-align: left;
}

.lesmana-stat__value {
  color: var(--fg, #090d16);
  font-family: var(--font-display, Georgia, serif);
  font-weight: 500;
  font-size: clamp(3.8rem, 6.5vw, 6.2rem);
  line-height: 0.88;
  letter-spacing: -0.055em;
  font-variant-numeric: tabular-nums;
}

.lesmana-stat__line {
  width: 32px;
  height: 2px;
  margin-block: 16px 12px;
  background: var(--secondary-accent-color, #2563eb);
}

.lesmana-stat--left .lesmana-stat__line {
  margin-left: auto;
}

.lesmana-stat__label {
  color: var(--subtle-fg, #475467);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-weight: 600;
  font-size: 0.71rem;
  line-height: 1.48;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.lesmana-impact__technical-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.58;
  overflow: hidden;
}

.lesmana-node {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #9aa4b2;
  border-radius: 50%;
  background: #ffffff;
}

.lesmana-node::after {
  content: "";
  position: absolute;
  inset: 2px;
  border-radius: 50%;
  background: #d9a54a;
}

.lesmana-node--a { top: 13%; left: 7%; }
.lesmana-node--b { top: 18%; right: 7%; }
.lesmana-node--c { bottom: 26%; left: 11%; }
.lesmana-node--d { bottom: 17%; right: 11%; }

.lesmana-line {
  position: absolute;
  height: 1px;
  transform-origin: left center;
  background: repeating-linear-gradient(
    90deg,
    rgba(110, 123, 140, 0.35) 0 4px,
    transparent 4px 11px
  );
}

.lesmana-line--a {
  top: 17%;
  left: 7%;
  width: 26%;
  transform: rotate(13deg);
}

.lesmana-line--b {
  top: 21%;
  right: 6%;
  width: 25%;
  transform: rotate(-14deg);
}

.lesmana-line--c {
  bottom: 24%;
  left: 11%;
  width: 24%;
  transform: rotate(-10deg);
}

.lesmana-code {
  position: absolute;
  color: rgba(73, 87, 106, 0.42);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-weight: 600;
  font-size: 0.56rem;
  letter-spacing: 0.2em;
}

.lesmana-code--a { top: 22%; left: 22%; }
.lesmana-code--b { top: 15%; right: 17%; }
.lesmana-code--c { bottom: 34%; right: 15%; }
.lesmana-code--d { bottom: 17%; left: 22%; }

.lesmana-impact__scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 2.2rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translateX(-50%);
  color: var(--subtle-fg, #64748b);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-weight: 600;
  font-size: 0.64rem;
  letter-spacing: 0.18em;
  pointer-events: none;
}

.lesmana-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1100px) {
  .lesmana-impact__inner {
    grid-template-columns: minmax(150px, 0.85fr) minmax(360px, 520px) minmax(150px, 0.85fr);
    gap: 24px;
    padding-block: 6rem;
  }

  .lesmana-impact__card {
    min-height: 590px;
  }

  .lesmana-stat__value {
    font-size: clamp(3.2rem, 5.5vw, 4.8rem);
  }
}

@media (max-width: 820px) {
  .lesmana-impact {
    min-height: auto;
  }

  .lesmana-impact__inner {
    min-height: auto;
    width: min(100% - 32px, 620px);
    display: flex;
    flex-direction: column;
    padding-block: 5rem 6rem;
    gap: 3.5rem;
  }

  .lesmana-impact__card {
    order: 1;
    width: 100%;
    min-height: 580px;
    transform: none !important;
    opacity: 1 !important;
  }

  .lesmana-stats--left {
    order: 2;
  }

  .lesmana-stats--right {
    order: 3;
  }

  .lesmana-stats {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 36px 24px;
  }

  .lesmana-stat {
    transform: none !important;
    opacity: 1 !important;
  }

  .lesmana-stat--left,
  .lesmana-stat--right {
    margin: 0;
    text-align: left;
  }

  .lesmana-stat--left .lesmana-stat__line {
    margin-left: 0;
  }

  .lesmana-stat__value {
    font-size: clamp(3rem, 12vw, 4.5rem);
  }

  .lesmana-impact__scroll-hint {
    display: none;
  }
}

@media (max-width: 560px) {
  .lesmana-impact__inner {
    width: min(100% - 24px, 500px);
    padding-block: 3.5rem 4.5rem;
    gap: 2.75rem;
  }

  .lesmana-impact__card {
    min-height: 520px;
    padding: 1.5rem;
    border-radius: 24px;
  }

  .lesmana-impact__card h2 {
    font-size: clamp(1.85rem, 8.5vw, 2.5rem);
    max-width: 100%;
  }

  .lesmana-impact__chips {
    gap: 6px;
    margin-top: 1.75rem;
  }

  .lesmana-impact__chips span {
    padding: 7px 10px;
    font-size: 0.6rem;
  }

  .lesmana-impact__footer {
    margin-top: 2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .lesmana-impact__footer p {
    text-align: left;
    max-width: 100%;
  }

  .lesmana-stats {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .lesmana-stat__value {
    font-size: 3.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lesmana-impact *,
  .lesmana-impact *::before,
  .lesmana-impact *::after {
    scroll-behavior: auto !important;
    transition: none !important;
    animation: none !important;
  }

  .lesmana-impact__card,
  .lesmana-stat {
    transform: none !important;
  }
}
`;

export default ImpactSpotlight;
