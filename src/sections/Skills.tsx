import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
} from 'react';

import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Grid,
} from 'lucide-react';

import { skillsData } from '../data/skills';
import { projectsData } from '../data/projects';
import { techIcon } from '../components/ui/TechIcons';
import {
  BarChart,
  Brain,
  Code,
  Cpu,
  Database,
  Sparkles,
  Wrench,
} from '../components/ui/Icons';

type EvidenceLevel = 'Core' | 'Applied';

type Skill = (typeof skillsData)[number]['skills'][number] & {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  evidenceLevel?: EvidenceLevel | null;
};

const ALL = 'all';

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function flattenCategory(category: (typeof skillsData)[number]): Skill[] {
  return category.skills.map((skill) => ({
    ...skill,
    categoryId: category.id,
    categoryName: category.name,
    categoryDescription: category.description,
  }));
}

function uniqueAllSkills(): Skill[] {
  const seen = new Set<string>();
  const list: Skill[] = [];

  for (const category of skillsData) {
    for (const skill of category.skills) {
      const key = normalize(skill.name);
      if (!seen.has(key)) {
        seen.add(key);
        list.push({
          ...skill,
          categoryId: category.id,
          categoryName: category.name,
          categoryDescription: category.description,
        });
      }
    }
  }

  return list;
}

function evidenceLevel(skill: Skill): EvidenceLevel | null {
  if (skill.evidenceLevel === 'Core' || skill.evidenceLevel === 'Applied') {
    return skill.evidenceLevel;
  }
  if (skill.isPrimary) return 'Core';
  return 'Applied';
}

function projectMatches(skill: Skill) {
  const skillKey = normalize(skill.name);

  return projectsData.filter((project) => {
    const inTech = project.technologies.some(
      (tech) => normalize(tech) === skillKey || skillKey.includes(normalize(tech)),
    );
    const inResults = project.keyResults?.some((item: string) =>
      normalize(item).includes(skillKey),
    );
    return Boolean(inTech || inResults);
  });
}

const GROUP_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  'data-science': Database,
  'machine-learning': Brain,
  'generative-ai': Sparkles,
  'agentic-ai': Cpu,
  programming: Code,
  'tools-technologies': Wrench,
  visualization: BarChart,
};

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);

    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

/* ================================================================
   ONE-GESTURE / ONE-SLIDE NAVIGATION
   ================================================================ */

function useDeckNavigation(
  sectionRef: RefObject<HTMLElement | null>,
  count: number,
) {
  const [activeIndex, setActiveIndexState] = useState(0);

  const activeRef = useRef(0);
  const armedRef = useRef(true);
  const resetTimerRef = useRef<number | undefined>(undefined);
  const touchStartRef = useRef<number | null>(null);

  const setActive = useCallback(
    (next: number) => {
      const safe = Math.max(0, Math.min(next, Math.max(0, count - 1)));
      activeRef.current = safe;
      setActiveIndexState(safe);
    },
    [count],
  );

  const move = useCallback(
    (direction: -1 | 1) => {
      const next = activeRef.current + direction;
      if (next < 0 || next >= count) return false;

      activeRef.current = next;
      setActiveIndexState(next);
      return true;
    },
    [count],
  );

  const sectionIsDominantInViewport = useCallback(() => {
    const element = sectionRef.current;
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return (
      rect.top <= viewportHeight * 0.25 &&
      rect.bottom >= viewportHeight * 0.75
    );
  }, [sectionRef]);

  const armAfterGesture = useCallback(() => {
    window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => {
      armedRef.current = true;
    }, 165);
  }, []);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const onWheel = (event: globalThis.WheelEvent) => {
      if (Math.abs(event.deltaY) < 8) return;
      if (!sectionIsDominantInViewport()) return;

      const direction: -1 | 1 = event.deltaY > 0 ? 1 : -1;
      const current = activeRef.current;

      /*
        Release the document at the two ends. This is critical:
        the slideshow should never trap the user.
      */
      if (
        (direction === -1 && current === 0) ||
        (direction === 1 && current === count - 1)
      ) {
        return;
      }

      event.preventDefault();

      if (armedRef.current) {
        armedRef.current = false;
        move(direction);
      }

      armAfterGesture();
    };

    const onTouchStart = (event: globalThis.TouchEvent) => {
      if (!sectionIsDominantInViewport()) return;
      touchStartRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: globalThis.TouchEvent) => {
      const start = touchStartRef.current;
      if (start == null || !sectionIsDominantInViewport()) return;

      const currentY = event.touches[0]?.clientY ?? start;
      const delta = start - currentY;

      if (Math.abs(delta) < 35) return;

      const direction: -1 | 1 = delta > 0 ? 1 : -1;
      const current = activeRef.current;

      if (
        (direction === -1 && current === 0) ||
        (direction === 1 && current === count - 1)
      ) {
        touchStartRef.current = currentY;
        return;
      }

      event.preventDefault();

      if (armedRef.current) {
        armedRef.current = false;
        move(direction);
      }

      touchStartRef.current = currentY;
      armAfterGesture();
    };

    const onTouchEnd = () => {
      touchStartRef.current = null;
      armAfterGesture();
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: false });
    element.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('wheel', onWheel);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
      window.clearTimeout(resetTimerRef.current);
    };
  }, [armAfterGesture, count, move, sectionIsDominantInViewport, sectionRef]);

  return {
    activeIndex,
    setActive,
    previous: () => move(-1),
    next: () => move(1),
  };
}

/* ================================================================
   DECK POSITIONING
   ================================================================ */

function deckTransform(relative: number, reducedMotion: boolean) {
  if (relative === 0) {
    return {
      x: 0,
      scale: 1,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
      zIndex: 100,
    };
  }

  const direction = relative > 0 ? 1 : -1;
  const distance = Math.abs(relative);

  const spread = Math.min(distance, 6);
  const compressed = Math.max(0, distance - 6);

  const x = direction * (spread * 86 + compressed * 14);
  const scale = Math.max(0.64, 1 - Math.min(distance, 10) * 0.052);
  const opacity = Math.max(0.13, 1 - Math.min(distance, 11) * 0.085);
  const rotateY = reducedMotion ? 0 : (direction > 0 ? -9 : 9);
  const rotateZ = reducedMotion ? 0 : (direction * Math.min(3.1, distance * 0.5));

  return {
    x,
    scale,
    rotateY,
    rotateZ,
    opacity,
    zIndex: 100 - distance,
  };
}

/* ================================================================
   SKILL CARD
   ================================================================ */

function DeckSkillCard({
  skill,
  relative,
  index,
  active,
  reducedMotion,
  onClick,
}: {
  skill: Skill;
  relative: number;
  index: number;
  active: boolean;
  reducedMotion: boolean;
  onClick: () => void;
}) {
  const transform = deckTransform(relative, reducedMotion);
  const level = evidenceLevel(skill);
  const Icon = techIcon(skill.name);

  const style = {
    '--deck-x': `${transform.x}px`,
    '--deck-scale': transform.scale,
    '--deck-rotate-y': `${transform.rotateY}deg`,
    '--deck-rotate-z': `${transform.rotateZ}deg`,
    zIndex: transform.zIndex,
    opacity: transform.opacity,
    pointerEvents: Math.abs(relative) <= 7 ? 'auto' : 'none',
  } as CSSProperties;

  return (
    <button
      type="button"
      className={`smooth-skill-card ${active ? 'is-active' : ''} ${
        relative < 0 ? 'is-left' : relative > 0 ? 'is-right' : 'is-center'
      }`}
      style={style}
      aria-current={active ? 'true' : undefined}
      aria-label={`Select skill ${skill.name}`}
      onClick={onClick}
      tabIndex={Math.abs(relative) <= 7 ? 0 : -1}
    >
      <div className="smooth-card-inner">
        <div className="smooth-card-topline">
          <span>{active ? 'ACTIVE SKILL' : relative > 0 ? 'NEXT' : 'PREVIOUS'}</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className="smooth-card-icon">
          <Icon size={active ? 34 : 25} />
        </div>

        <div className="smooth-card-category">{skill.categoryName}</div>

        <h3>{skill.name}</h3>

        <p>
          {skill.proficiencyHint ||
            skill.usedFor ||
            'Technical capability represented in the portfolio.'}
        </p>

        <div className="smooth-card-tags">
          <span>{active ? 'CURRENT' : level ?? 'SKILL'}</span>
          {level && active ? <span>{level.toUpperCase()}</span> : null}
        </div>

        <div className="smooth-card-number">
          {String(index + 1).padStart(2, '0')} / DECK
        </div>
      </div>
    </button>
  );
}

/* ================================================================
   DETAILS
   ================================================================ */

function SkillDetails({
  skill,
  index,
  total,
}: {
  skill: Skill | undefined;
  index: number;
  total: number;
}) {
  if (!skill) return null;

  const level = evidenceLevel(skill);
  const projects = projectMatches(skill);
  const Icon = techIcon(skill.name);

  return (
    <aside className="smooth-details" aria-live="polite">
      <div className="smooth-details__top">
        <span>SELECTED SKILL</span>
        <span>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="smooth-details__identity">
        <div className="smooth-details__icon">
          <Icon size={28} />
        </div>
        <div>
          <h3>{skill.name}</h3>
          <p>{skill.categoryName}</p>
        </div>
      </div>

      <div className="smooth-details__block">
        <span>CAPABILITY</span>
        <p>
          {skill.proficiencyHint ||
            'Technical skill represented in the portfolio skill system.'}
        </p>
      </div>

      {level ? (
        <div className="smooth-details__block">
          <span>EVIDENCE LEVEL</span>
          <div className="smooth-level">
            <strong>{level}</strong>
            <i aria-hidden="true">
              <b />
            </i>
          </div>
          <small>
            Qualitative evidence derived from the portfolio source data.
          </small>
        </div>
      ) : null}

      {skill.usedFor ? (
        <div className="smooth-details__block">
          <span>WHAT I USE IT FOR</span>
          <p>{skill.usedFor}</p>
        </div>
      ) : null}

      {skill.context ? (
        <div className="smooth-details__block">
          <span>CONTEXT</span>
          <p>{skill.context}</p>
        </div>
      ) : null}

      {projects.length ? (
        <div className="smooth-details__block">
          <span>USED IN</span>
          <div className="smooth-details__projects">
            {projects.map((project) => (
              <a
                key={project.id}
                href="#projects"
                className="smooth-project-link"
              >
                <span>{project.title}</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

/* ================================================================
   SKILLS
   ================================================================ */

export function Skills() {
  const reducedMotion = useReducedMotionPreference();
  const sectionRef = useRef<HTMLElement | null>(null);

  const [activeCategory, setActiveCategory] = useState(ALL);

  const allSkills = useMemo(() => uniqueAllSkills(), []);

  const currentSkills = useMemo(() => {
    if (activeCategory === ALL) return allSkills;

    const category = skillsData.find((item) => item.id === activeCategory);
    return category ? flattenCategory(category) : [];
  }, [activeCategory, allSkills]);

  const deck = useDeckNavigation(sectionRef, currentSkills.length);

  useEffect(() => {
    deck.setActive(0);
  }, [activeCategory]);

  const activeIndex = Math.min(
    deck.activeIndex,
    Math.max(0, currentSkills.length - 1),
  );
  const selectedSkill = currentSkills[activeIndex];

  // Remove only the legacy Hero blueprint objects, preserving the rest of the blueprint system
  useEffect(() => {
    const legacyHeroObjects = document.querySelectorAll('.bp-hero-container, .bp-hero-left-container');
    legacyHeroObjects.forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
  }, []);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      deck.next();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      deck.previous();
    }
  };

  return (
    <>
      <style>{`${SMOOTH_SKILLS_STYLES}`}</style>

      <section
        id="skills"
        ref={sectionRef}
        className="smooth-skills-section"
        aria-labelledby="smooth-skills-title"
      >
        <div className="smooth-skills-shell" onKeyDown={handleKeyDown}>
          <header className="smooth-skills-header">
            <div>
              <span className="smooth-kicker">CHAPTER 02 / SKILLS</span>
              <h2 id="smooth-skills-title">SKILLS &amp; TECHNOLOGIES</h2>
            </div>

            <div className="smooth-header-copy">
              <p>
                Technical capabilities and tools represented by the portfolio's
                projects, coursework, certifications and current learning.
              </p>
              <span>ONE SCROLL = ONE SKILL</span>
            </div>
          </header>

          <div className="smooth-skills-layout">
            <nav className="smooth-categories" aria-label="Skill categories">
              <button
                type="button"
                className={`smooth-category ${activeCategory === ALL ? 'is-active' : ''}`}
                aria-pressed={activeCategory === ALL}
                onClick={() => setActiveCategory(ALL)}
              >
                <Grid size={16} />
                <span>All skills</span>
                <b>{allSkills.length}</b>
              </button>

              {skillsData.map((category) => {
                const Icon = GROUP_ICONS[category.id] ?? Code;

                return (
                  <button
                    key={category.id}
                    type="button"
                    className={`smooth-category ${
                      activeCategory === category.id ? 'is-active' : ''
                    }`}
                    aria-pressed={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon size={16} />
                    <span>{category.name}</span>
                    <b>{category.skills.length}</b>
                  </button>
                );
              })}
            </nav>

            <main className="smooth-deck-column">
              <div
                className="smooth-deck-controls"
                aria-label="Skill card navigation"
              >
                <button
                  type="button"
                  onClick={deck.previous}
                  disabled={activeIndex === 0}
                  aria-label="Previous skill card"
                >
                  <ArrowLeft size={16} />
                </button>

                <span>
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(currentSkills.length).padStart(2, '0')}
                </span>

                <button
                  type="button"
                  onClick={deck.next}
                  disabled={activeIndex === currentSkills.length - 1}
                  aria-label="Next skill card"
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              <div
                className="smooth-card-stage"
                role="region"
                aria-label="Skills card deck"
                tabIndex={0}
              >
                {currentSkills.map((skill, index) => (
                  <DeckSkillCard
                    key={skill.name}
                    skill={skill}
                    relative={index - activeIndex}
                    index={index}
                    active={index === activeIndex}
                    reducedMotion={reducedMotion}
                    onClick={() => deck.setActive(index)}
                  />
                ))}
              </div>

              <div
                className="smooth-deck-progress"
                aria-label="Skill deck progress"
              >
                <span>
                  CARD {activeIndex + 1} OF {currentSkills.length}
                </span>

                <i>
                  <b
                    style={{
                      width: `${
                        currentSkills.length > 1
                          ? (activeIndex / (currentSkills.length - 1)) * 100
                          : 100
                      }%`,
                    }}
                  />
                </i>

                <span>SCROLL ↑ / ↓</span>
              </div>
            </main>

            <SkillDetails
              skill={selectedSkill}
              index={activeIndex}
              total={currentSkills.length}
            />
          </div>

          <div className="smooth-skills-meta">
            <div>
              <strong>{allSkills.length}</strong>
              <span>UNIQUE SKILLS</span>
            </div>
            <div>
              <strong>{skillsData.length}</strong>
              <span>DOMAINS</span>
            </div>
            <div>
              <strong>{projectsData.length}</strong>
              <span>PROJECTS</span>
            </div>
            <div>
              <strong>
                {projectsData.filter((project) => project.technologies.length > 0)
                  .length}
              </strong>
              <span>TECH PROJECTS</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const SMOOTH_SKILLS_STYLES = `
.smooth-skills-section {
  --warm-border: rgba(184,154,104,.42);
  --warm-border-strong: rgba(184,154,104,.74);
  --warm-shadow: rgba(184,154,104,.18);
  --ink: #101722;
  --muted: #5d6674;
  position: relative;
  min-height: 100vh;
  overflow: clip;
  isolation: isolate;
  background:
    radial-gradient(circle at 50% 40%, rgba(255,255,255,.99),
      rgba(249,249,246,.96) 66%, rgba(245,246,247,.98));
  color: var(--ink);
}

.smooth-skills-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(to right, rgba(15,23,42,.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(15,23,42,.035) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: linear-gradient(to bottom, transparent, black 8%, black 92%, transparent);
  pointer-events: none;
}

.smooth-skills-shell {
  width: min(1500px, calc(100% - 40px));
  margin-inline: auto;
  padding: clamp(42px,6vw,78px) 0 34px;
}

.smooth-skills-header {
  display: grid;
  grid-template-columns: minmax(0,1fr) minmax(260px,400px);
  gap: 36px;
  align-items: end;
  margin-bottom: 27px;
}

.smooth-kicker,
.smooth-header-copy span,
.smooth-category,
.smooth-details__top,
.smooth-details__block > span,
.smooth-card-topline,
.smooth-card-category,
.smooth-card-tags,
.smooth-deck-progress,
.smooth-certificate-label,
.smooth-certifications__header > div > span {
  font-family: var(--font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);
}

.smooth-kicker,
.smooth-certifications__header > div > span {
  display: block;
  color: #8a775d;
  font-size: .67rem;
  font-weight: 700;
  letter-spacing: .17em;
  text-transform: uppercase;
}

.smooth-skills-header h2,
.smooth-certifications__header h2 {
  margin: 12px 0 0;
  font-size: clamp(2.65rem,6vw,5.6rem);
  line-height: .88;
  letter-spacing: -.06em;
}

.smooth-header-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 5px;
}

.smooth-header-copy p {
  margin: 0;
  color: var(--muted);
  font-size: .96rem;
  line-height: 1.6;
}

.smooth-header-copy span {
  color: #8a775d;
  font-size: .58rem;
  letter-spacing: .17em;
}

.smooth-skills-layout {
  display: grid;
  grid-template-columns: 190px minmax(500px,1fr) minmax(290px,350px);
  gap: 25px;
  align-items: center;
}

.smooth-categories {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.smooth-category {
  display: grid;
  grid-template-columns: 19px minmax(0,1fr) auto;
  gap: 10px;
  align-items: center;
  min-height: 48px;
  padding: 10px 11px;
  border: 1px solid rgba(17,24,39,.10);
  border-radius: 14px;
  background: rgba(255,255,255,.82);
  color: #4d5664;
  text-align: left;
  cursor: pointer;
  transition: border-color .2s ease, background-color .2s ease,
    color .2s ease, transform .2s ease, box-shadow .2s ease;
}

.smooth-category:hover,
.smooth-category:focus-visible {
  outline: none;
  color: var(--ink);
  border-color: var(--warm-border-strong);
  background: #fff;
  transform: translateX(2px);
}

.smooth-category.is-active {
  background: #101722;
  color: #fff;
  border-color: #101722;
  box-shadow: 0 13px 30px rgba(16,23,34,.14);
}

.smooth-category b {
  font-size: .62rem;
  opacity: .7;
}

.smooth-deck-column {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.smooth-deck-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  margin-bottom: 7px;
  color: #68717e;
  font: 700 .58rem/1 var(--font-mono,ui-monospace,monospace);
  letter-spacing: .12em;
}

.smooth-deck-controls button {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--warm-border);
  border-radius: 50%;
  background: rgba(255,255,255,.92);
  color: var(--ink);
  cursor: pointer;
  transition: background-color .18s ease, color .18s ease,
    box-shadow .18s ease, border-color .18s ease;
}

.smooth-deck-controls button:hover:not(:disabled),
.smooth-deck-controls button:focus-visible:not(:disabled) {
  outline: none;
  border-color: var(--warm-border-strong);
  box-shadow: 0 8px 20px var(--warm-shadow);
}

.smooth-deck-controls button:disabled {
  opacity: .38;
  cursor: not-allowed;
}

/* The only animated part is this finite card transform.
   No scroll-position animation loop exists. */
.smooth-card-stage {
  position: relative;
  min-height: 548px;
  display: grid;
  place-items: center;
  perspective: 1400px;
  overflow: visible;
  touch-action: pan-y;
}

.smooth-card-stage:focus-visible {
  outline: 2px solid rgba(184,154,104,.68);
  outline-offset: 8px;
  border-radius: 24px;
}

.smooth-skill-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(470px,72%);
  min-height: 430px;
  margin: 0;
  padding: 0;
  border: 1px solid var(--warm-border);
  border-radius: 28px;
  background: linear-gradient(145deg,rgba(255,255,255,.995),rgba(249,248,244,.99));
  color: var(--ink);
  box-shadow:
    0 26px 62px rgba(184,154,104,.15),
    0 9px 22px rgba(15,23,42,.075),
    inset 0 1px 0 rgba(255,255,255,1);
  transform:
    translate3d(calc(-50% + var(--deck-x)),-50%,0)
    scale(var(--deck-scale))
    rotateY(var(--deck-rotate-y))
    rotateZ(var(--deck-rotate-z));
  transform-style: preserve-3d;
  transform-origin: center;
  transition:
    transform .62s cubic-bezier(.22,1,.36,1),
    opacity .44s ease,
    box-shadow .44s ease,
    border-color .44s ease;
  will-change: transform, opacity;
  cursor: pointer;
  text-align: left;
  overflow: hidden;
}

.smooth-skill-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(135deg,rgba(184,154,104,.05),transparent 30%),
    radial-gradient(circle at 82% 18%,rgba(184,154,104,.08),transparent 27%);
}

.smooth-skill-card.is-active {
  border-color: var(--warm-border-strong);
  box-shadow:
    0 33px 76px rgba(184,154,104,.22),
    0 11px 30px rgba(15,23,42,.11),
    inset 0 1px 0 rgba(255,255,255,1);
}

.smooth-skill-card:hover {
  box-shadow:
    0 31px 68px rgba(184,154,104,.20),
    0 10px 28px rgba(15,23,42,.10),
    inset 0 1px 0 rgba(255,255,255,1);
}

.smooth-card-inner {
  position: relative;
  min-height: 430px;
  padding: 28px;
  display: flex;
  flex-direction: column;
}

.smooth-card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #988363;
  font-size: .57rem;
  font-weight: 700;
  letter-spacing: .17em;
}

.smooth-card-icon {
  display: grid;
  place-items: center;
  width: 70px;
  height: 70px;
  margin-top: 30px;
  border: 1px solid rgba(184,154,104,.40);
  border-radius: 20px;
  color: #18202c;
  background: #fff;
  box-shadow:
    0 10px 24px rgba(184,154,104,.11),
    inset 0 1px 0 rgba(255,255,255,1);
}

.smooth-card-category {
  margin-top: 28px;
  color: #8f7857;
  font-size: .61rem;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
}

.smooth-card-inner h3 {
  margin: 11px 0 0;
  color: #101722;
  font-size: clamp(2rem,4vw,3.35rem);
  line-height: .96;
  letter-spacing: -.055em;
}

.smooth-card-inner p {
  max-width: 34ch;
  margin: 15px 0 0;
  color: #4d5867;
  font-size: .93rem;
  line-height: 1.62;
}

.smooth-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 27px;
}

.smooth-card-tags span {
  padding: 8px 11px;
  border: 1px solid rgba(184,154,104,.38);
  border-radius: 999px;
  color: #69563b;
  background: rgba(184,154,104,.09);
  font-size: .57rem;
  font-weight: 700;
  letter-spacing: .11em;
}

.smooth-card-number {
  margin-top: 17px;
  color: #9299a2;
  font: 700 .58rem/1 var(--font-mono,ui-monospace,monospace);
  letter-spacing: .17em;
}

.smooth-details {
  position: relative;
  z-index: 220;
  min-width: 0;
  max-height: 520px;
  overflow: auto;
  padding: 20px 20px 18px;
  border: 1px solid rgba(184,154,104,.34);
  border-radius: 24px;
  background: #ffffff;
  box-shadow:
    0 18px 42px rgba(184,154,104,.12),
    0 6px 18px rgba(15,23,42,.07);
  scrollbar-width: thin;
}

.smooth-details__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #93866f;
  font-size: .55rem;
  font-weight: 700;
  letter-spacing: .15em;
}

.smooth-details__identity {
  display: flex;
  gap: 13px;
  align-items: center;
  padding: 23px 0 19px;
  border-bottom: 1px solid rgba(17,24,39,.08);
}

.smooth-details__icon {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  flex: none;
  border: 1px solid rgba(184,154,104,.40);
  border-radius: 16px;
  background: #fff;
  color: #101722;
  box-shadow: 0 9px 21px rgba(184,154,104,.10);
}

.smooth-details h3 {
  margin: 0;
  color: #101722;
  font-size: 1.35rem;
  line-height: 1.02;
  letter-spacing: -.04em;
}

.smooth-details__identity p {
  margin: 6px 0 0;
  color: #7b8490;
  font: 600 .61rem/1.2 var(--font-mono,ui-monospace,monospace);
}

.smooth-details__block {
  padding: 15px 0;
  border-bottom: 1px solid rgba(17,24,39,.08);
}

.smooth-details__block > span {
  color: #95805d;
  font-size: .53rem;
  font-weight: 700;
  letter-spacing: .15em;
}

.smooth-details__block p {
  margin: 9px 0 0;
  color: #525d6d;
  font-size: .79rem;
  line-height: 1.56;
}

.smooth-level {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 9px;
}

.smooth-level strong {
  color: #111824;
  font: 700 .76rem/1 var(--font-mono,ui-monospace,monospace);
}

.smooth-level i {
  display: block;
  flex: 1;
  height: 4px;
  overflow: hidden;
  border-radius: 99px;
  background: #e9e8e3;
}

.smooth-level i b {
  display: block;
  width: 64%;
  height: 100%;
  background: #101722;
}

.smooth-details__block small {
  display: block;
  margin-top: 8px;
  color: #8b939d;
  font-size: .58rem;
  line-height: 1.45;
}

.smooth-details__projects {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 9px;
}

.smooth-project-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 10px;
  border: 1px solid rgba(17,24,39,.09);
  border-radius: 11px;
  color: #2f3947;
  background: #fff;
  text-decoration: none;
  font-size: .68rem;
}

.smooth-project-link:hover,
.smooth-project-link:focus-visible {
  border-color: var(--warm-border-strong);
  box-shadow: 0 7px 18px rgba(184,154,104,.09);
  outline: none;
}

.smooth-deck-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 7px 0 0;
  color: #8a8f97;
  font-size: .53rem;
  font-weight: 700;
  letter-spacing: .13em;
}

.smooth-deck-progress i {
  position: relative;
  width: 135px;
  height: 2px;
  overflow: hidden;
  border-radius: 99px;
  background: #e4e5e8;
}

.smooth-deck-progress i b {
  position: absolute;
  inset: 0 auto 0 0;
  display: block;
  background: #101722;
  transition: width .42s cubic-bezier(.22,1,.36,1);
}

.smooth-skills-meta {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  margin-top: 19px;
  border-top: 1px solid rgba(17,24,39,.09);
  border-bottom: 1px solid rgba(17,24,39,.09);
}

.smooth-skills-meta > div {
  padding: 13px 12px;
  border-left: 1px solid rgba(17,24,39,.07);
}

.smooth-skills-meta > div:first-child {
  border-left: 0;
}

.smooth-skills-meta strong {
  display: block;
  color: #111824;
  font-size: 1.4rem;
  letter-spacing: -.045em;
}

.smooth-skills-meta span {
  display: block;
  margin-top: 3px;
  color: #8a9099;
  font: 700 .49rem/1.25 var(--font-mono,ui-monospace,monospace);
  letter-spacing: .13em;
}

@media (max-width:1180px) {
  .smooth-skills-layout {
    grid-template-columns: 175px minmax(450px,1fr);
  }
  .smooth-details {
    grid-column: 1 / -1;
    max-height: none;
  }
  .smooth-skill-card {
    width: min(455px,78%);
  }
}

@media (max-width:800px) {
  .smooth-skills-shell,
  .smooth-certifications__shell {
    width: min(100% - 24px,660px);
  }

  .smooth-skills-header,
  .smooth-certifications__header {
    display: block;
  }

  .smooth-header-copy,
  .smooth-certifications__header p {
    margin-top: 14px;
  }

  .smooth-skills-layout {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .smooth-categories {
    display: grid;
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .smooth-category {
    min-height: 45px;
    font-size: .61rem;
  }

  .smooth-deck-column,
  .smooth-details {
    width: 100%;
  }

  .smooth-card-stage {
    min-height: 500px;
  }

  .smooth-skill-card {
    width: min(430px,78%);
    min-height: 400px;
  }

  .smooth-card-inner {
    min-height: 400px;
    padding: 23px;
  }

  .smooth-card-inner h3 {
    font-size: clamp(2rem,9vw,3rem);
  }

  .smooth-certifications__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width:520px) {
  .smooth-skills-shell {
    padding-top: 34px;
  }

  .smooth-skills-header h2,
  .smooth-certifications__header h2 {
    font-size: 2.55rem;
  }

  .smooth-categories {
    grid-template-columns: 1fr 1fr;
  }

  .smooth-card-stage {
    min-height: 430px;
    perspective: 1000px;
  }

  .smooth-skill-card {
    width: min(340px,76%);
    min-height: 350px;
    border-radius: 22px;
  }

  .smooth-card-inner {
    min-height: 350px;
    padding: 19px;
  }

  .smooth-card-icon {
    width: 58px;
    height: 58px;
    border-radius: 16px;
    margin-top: 22px;
  }

  .smooth-card-category {
    margin-top: 20px;
  }

  .smooth-card-inner h3 {
    font-size: 2rem;
  }

  .smooth-card-inner p {
    font-size: .77rem;
  }

  .smooth-skills-meta {
    grid-template-columns: repeat(2,1fr);
  }

  .smooth-skills-meta > div:nth-child(3) {
    border-left: 0;
    border-top: 1px solid rgba(17,24,39,.07);
  }

  .smooth-skills-meta > div:nth-child(4) {
    border-top: 1px solid rgba(17,24,39,.07);
  }

  .smooth-certificate-image {
    height: 255px;
  }

  .smooth-certificate-actions {
    grid-template-columns: 1fr;
  }

  .certificate-modal__details {
    padding: 45px 23px 28px;
  }

  .certificate-modal__details dl > div {
    grid-template-columns: 1fr;
    gap: 7px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .smooth-skill-card,
  .smooth-deck-progress i b,
  .smooth-certificate-image img {
    transition: none !important;
  }
}
`;

export default Skills;
