/*
  ProjectsStack.tsx — single-file Projects section replacement.

  1) Copy this file into: src/sections/ProjectsStack.tsx
  2) In the current portfolio, replace <Projects /> with:
       <ProjectsStack projects={projectsData} />
     and import ProjectsStack from './sections/ProjectsStack'; plus
     projectsData from './data/projects' if it is not already in that scope.
     (If your local array variable is named `projects`, use
       <ProjectsStack projects={projects} /> instead.)
  3) Expected existing imports/paths used by this file:
       ../types/portfolio              -> Project type
       ../data/projectImages           -> projectImages screenshot map
       ../components/ui/Reveal         -> existing section-header entrance reveal
       ../components/ui/Primitives     -> Lightbox + SectionHeader
       ../components/ui/TechIcons      -> TechBadge + techIcon
       ../components/ui/Icons          -> ArrowRight, ArrowUpRight, Eye, Github, Layers
       ../hooks                        -> useReducedMotion

  This file is intentionally self-contained for the Projects section. Its new
  layout CSS is scoped with the `pstack-` prefix and injected below; it does
  not require edits to the global stylesheet.
*/

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { Project } from '../types/portfolio';
import { projectImages } from '../data/projectImages';
import { Reveal } from '../components/ui/Reveal';
import { Lightbox, SectionHeader } from '../components/ui/Primitives';
import { TechBadge, techIcon } from '../components/ui/TechIcons';
import { ArrowRight, ArrowUpRight, Eye, Github, Layers } from '../components/ui/Icons';
import { useReducedMotion } from '../hooks';

export interface ProjectsStackProps {
  projects: Project[];
}

const STACK_BREAKPOINT = '(min-width: 960px) and (min-height: 640px)';
const PEEK_STEP_PX = 14;

function useStackMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();

    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, [query]);

  return matches;
}

function appReducedMotionIsActive() {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.documentElement.classList.contains('reduced-motion') ||
      document.body.classList.contains('reduced-motion'),
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/* -------------------------------------------------------------------------
   Existing detail modal — unchanged data and behaviour, only rendered here.
------------------------------------------------------------------------- */
function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null;
  const image = projectImages[project.id];

  return (
    <Lightbox
      open
      title={project.title}
      subtitle={project.categoryLabel}
      onClose={onClose}
      footer={
        <>
          {project.githubUrl && (
            <a
              className="btn btn--secondary"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github size={16} className="btn__icon" />
              View code
            </a>
          )}
          {project.demoUrl && project.demoUrl !== project.githubUrl && (
            <a
              className="btn btn--primary"
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open live demo
              <ArrowUpRight size={16} className="btn__icon" />
            </a>
          )}
        </>
      }
    >
      <div className="detail">
        {image && <img src={image.src} alt={image.alt} className="detail__shot" loading="lazy" />}

        <div className="detail__block">
          <p className="cert__label">The problem</p>
          <p className="cert__text">{project.problem}</p>
        </div>

        <div className="detail__block">
          <p className="cert__label">The approach</p>
          <p className="cert__text">{project.solution}</p>
        </div>

        <div className="detail__block">
          <p className="cert__label">How it works</p>
          <ol className="detail__flow">
            {project.architectureFlow.map((stage, i) => (
              <li key={stage.step}>
                <span className="detail__flow-num mono">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <strong className="detail__flow-step">{stage.step}</strong>
                  <span className="cert__text"> {stage.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="detail__block">
          <p className="cert__label">What was built</p>
          <ul className="record__bullets">
            {project.keyResults.map(result => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        </div>

        <div className="detail__block">
          <p className="cert__label">Built with</p>
          <div className="tag-row">
            {project.technologies.map(tech => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        </div>
      </div>
    </Lightbox>
  );
}

/* -------------------------------------------------------------------------
   Project media — keeps the original screenshot map, zoom action and tiny
   pointer parallax. The marquee is decorative and never replaces the alt text.
------------------------------------------------------------------------- */
function ProjectMedia({
  project,
  index,
  onZoom,
}: {
  project: Project;
  index: number;
  onZoom: () => void;
}) {
  const image = projectImages[project.id];
  const imgRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || appReducedMotionIsActive() || !imgRef.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      imgRef.current.style.translate = `${(-dx * 16).toFixed(1)}px ${(-dy * 16).toFixed(1)}px`;
    },
    [reducedMotion],
  );

  const resetParallax = useCallback(() => {
    if (imgRef.current) imgRef.current.style.translate = '0px 0px';
  }, []);

  const marqueeText = `${project.title} ◆ ${project.categoryLabel} ◆ `;

  return (
    <div className="pstack-media" onPointerMove={onPointerMove} onPointerLeave={resetParallax}>
      <span className="pstack-index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      {image ? (
        <>
          <img
            ref={imgRef}
            className="pstack-shot"
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
          />
          <button
            type="button"
            className="pstack-zoom"
            onClick={onZoom}
            aria-label={`Enlarge the ${project.title} screenshot`}
          >
            <span className="pstack-zoom-chip">
              <Eye size={15} />
              Enlarge
            </span>
          </button>
        </>
      ) : (
        <div className="pstack-cover" aria-label={`${project.title} project cover`}>
          <span className="pstack-cover-mark" aria-hidden="true">
            <Layers size={26} />
          </span>
          <p className="pstack-cover-label">{project.categoryLabel}</p>
        </div>
      )}

      <div className="pstack-marquee" aria-hidden="true">
        <div className="pstack-marquee-track">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   ProjectsStack
------------------------------------------------------------------------- */
export default function ProjectsStack({ projects }: ProjectsStackProps) {
  const [detail, setDetail] = useState<Project | null>(null);
  const [zoomed, setZoomed] = useState<{ id: string; title: string } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stickyRefs = useRef<Array<HTMLElement | null>>([]);
  const innerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const stackEnabled = useStackMediaQuery(STACK_BREAKPOINT);

  const zoomImage = zoomed ? projectImages[zoomed.id] : null;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const resetTransforms = () => {
      for (const inner of innerRefs.current) {
        if (!inner) continue;
        inner.style.setProperty('--pstack-scale', '1');
        inner.style.setProperty('--pstack-scroll-y', '0px');
        inner.style.opacity = '1';
      }
    };

    if (!stackEnabled || reducedMotion || appReducedMotionIsActive()) {
      resetTransforms();
      return;
    }

    const schedule = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        if (reducedMotion || appReducedMotionIsActive()) {
          resetTransforms();
          return;
        }

        const scrollY = window.scrollY;
        const listRect = list.getBoundingClientRect();
        const listDocumentTop = listRect.top + scrollY;
        const stickyTopBase = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        ) || 56;
        const stickyBasePx = stickyTopBase + 24;

        const starts = stickyRefs.current.map((card, index) => {
          if (!card) return Number.POSITIVE_INFINITY;
          const stickyTop = stickyBasePx + index * PEEK_STEP_PX;
          return listDocumentTop + card.offsetTop - stickyTop;
        });

        stickyRefs.current.forEach((card, index) => {
          const inner = innerRefs.current[index];
          if (!card || !inner || starts[index] === Number.POSITIVE_INFINITY) return;

          const nextStart = starts[index + 1];
          const range = Number.isFinite(nextStart) ? Math.max(nextStart - starts[index], 1) : 1;
          const progress = Number.isFinite(nextStart)
            ? clamp((scrollY - starts[index]) / range, 0, 1)
            : 0;

          // The incoming card remains at scale 1. The previous card gradually
          // settles to a 0.97 scale and lower opacity as the next card takes over.
          const scale = 1 - progress * 0.03;
          const opacity = 1 - progress * 0.22;
          const translateY = -progress * 4;

          inner.style.setProperty('--pstack-scale', scale.toFixed(4));
          inner.style.setProperty('--pstack-scroll-y', `${translateY.toFixed(2)}px`);
          inner.style.opacity = opacity.toFixed(3);
        });
      });
    };

    const onScroll = () => schedule();
    const onResize = () => schedule();
    const onMotionClassChange = () => schedule();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pageshow', onMotionClassChange, { passive: true });

    schedule();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pageshow', onMotionClassChange);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [projects.length, reducedMotion, stackEnabled]);

  const setStickyRef = useCallback((index: number, node: HTMLElement | null) => {
    stickyRefs.current[index] = node;
  }, []);

  const setInnerRef = useCallback((index: number, node: HTMLDivElement | null) => {
    innerRefs.current[index] = node;
  }, []);

  return (
    <section id="projects" className="section pstack-section" aria-labelledby="projects-title">
      <style>{PROJECTS_STACK_STYLES}</style>

      <div className="shell">
        <Reveal motion="clip">
          <SectionHeader
            id="projects-title"
            index="04"
            kicker="Projects"
            title="Things I have built"
            subtitle="Each project links to its source. Screenshots are from the running applications."
          />
        </Reveal>

        <div className="pstack-list" ref={listRef}>
          {projects.map((project, index) => {
            const CategoryIcon = techIcon(project.technologies[0] ?? '');
            const stickyTop = `calc(var(--nav-h) + 1.5rem + ${index * PEEK_STEP_PX}px)`;

            return (
              <article
                key={project.id}
                ref={node => setStickyRef(index, node)}
                className="pstack-card-sticky"
                style={{ '--pstack-sticky-top': stickyTop } as CSSProperties}
              >
                <div ref={node => setInnerRef(index, node)} className="pstack-card">
                  <div className="pstack-content">
                    <div className="pstack-copy">
                      <h3 className="pstack-title">{project.title}</h3>
                      <p className="pstack-description">{project.shortDescription}</p>

                      <div className="pstack-tech" aria-label={`${project.title} technologies`}>
                        {project.technologies.map(technology => (
                          <TechBadge key={technology} name={technology} />
                        ))}
                      </div>

                      <div className="pstack-meta" aria-label={`${project.title} category and status`}>
                        <span className="pstack-pill">
                          <CategoryIcon size={13} />
                          {project.categoryLabel}
                        </span>
                        {project.featured && <span className="pstack-pill">Featured</span>}
                      </div>

                      <div className="pstack-actions">
                        <button
                          type="button"
                          className="btn btn--primary"
                          onClick={() => setDetail(project)}
                        >
                          Project details
                          <ArrowRight size={16} className="btn__icon btn__icon--shift" />
                        </button>

                        {project.githubUrl && (
                          <a
                            className="btn btn--secondary"
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <Github size={16} className="btn__icon" />
                            Code
                          </a>
                        )}

                        {project.demoUrl && project.demoUrl !== project.githubUrl && (
                          <a
                            className="btn btn--ghost"
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Live demo
                            <ArrowUpRight size={15} className="btn__icon btn__icon--lift" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pstack-visual">
                      <ProjectMedia
                        project={project}
                        index={index}
                        onZoom={() => setZoomed({ id: project.id, title: project.title })}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ProjectDetail project={detail} onClose={() => setDetail(null)} />

      {zoomed && zoomImage && (
        <Lightbox open title={zoomed.title} subtitle="Screenshot" onClose={() => setZoomed(null)}>
          <img className="lightbox__img" src={zoomImage.src} alt={zoomImage.alt} />
        </Lightbox>
      )}
    </section>
  );
}

const PROJECTS_STACK_STYLES = `
/* ========================================================================
   ProjectsStack — all new layout styles are pstack-scoped.
   ======================================================================== */
.pstack-section {
  position: relative;
}

.pstack-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: calc(100vh + 8rem);
}

.pstack-card-sticky {
  position: sticky;
  top: var(--pstack-sticky-top);
  min-width: 0;
  z-index: 1;
}

.pstack-card-sticky:nth-child(1) { z-index: 1; }
.pstack-card-sticky:nth-child(2) { z-index: 2; }
.pstack-card-sticky:nth-child(3) { z-index: 3; }
.pstack-card-sticky:nth-child(4) { z-index: 4; }

.pstack-card {
  min-height: clamp(540px, 68vh, 700px);
  padding: clamp(1.35rem, 3vw, 2.75rem);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  background: var(--card-bg);
  box-shadow: var(--shadow-lg);
  --pstack-scale: 1;
  --pstack-scroll-y: 0px;
  --pstack-hover-y: 0px;
  transform: translate3d(0, calc(var(--pstack-scroll-y) + var(--pstack-hover-y)), 0) scale(var(--pstack-scale));
  transform-origin: center top;
  will-change: transform, opacity;
  transition:
    transform var(--dur) var(--ease-out),
    box-shadow var(--dur) var(--ease-out),
    border-color var(--dur) var(--ease-out);
}

.pstack-card:hover {
  --pstack-hover-y: -4px;
  border-color: color-mix(in srgb, var(--accent-color) 34%, var(--border-color));
  box-shadow: var(--shadow-lg);
}

.pstack-content {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: stretch;
  min-height: 100%;
}

.pstack-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pstack-title {
  margin: 0;
  color: var(--fg);
  font-family: var(--font-display);
  font-size: var(--step-3);
  letter-spacing: -0.03em;
  line-height: 1.08;
  text-wrap: balance;
}

.pstack-description {
  max-width: 56ch;
  margin: 1rem 0 0;
  color: var(--muted-fg);
  font-size: var(--step-0);
  line-height: 1.72;
}

.pstack-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1.45rem;
}

.pstack-tech .tag {
  flex: 0 0 auto;
  max-width: 100%;
}

.pstack-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.35rem;
}

.pstack-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  max-width: 100%;
  padding: 0.46rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  background: var(--surface-sunken);
  color: var(--fg);
  font-size: var(--step--1);
  font-weight: 600;
  line-height: 1.2;
}

.pstack-pill svg {
  flex: 0 0 auto;
}

.pstack-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1.35rem;
}

.pstack-actions .btn:focus-visible,
.pstack-zoom:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 3px;
}

.pstack-visual {
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: stretch;
}

.pstack-media {
  position: relative;
  width: 100%;
  min-height: 0;
  aspect-ratio: 16 / 10;
  align-self: center;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--img-frame);
  box-shadow: var(--shadow-md);
  isolation: isolate;
  transition: border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
}

.pstack-media:hover {
  border-color: color-mix(in srgb, var(--accent-color) 38%, var(--border-color));
  box-shadow: var(--shadow-lg);
}

.pstack-shot {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  scale: 1.04;
  translate: 0 0;
  transition: scale var(--dur-slow) var(--ease-out), translate 500ms var(--ease-out);
  will-change: scale, translate;
}

.pstack-media:hover .pstack-shot {
  scale: 1.03;
}

.pstack-index {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  padding: 0.52rem 0.82rem;
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  border-radius: 0 0 var(--radius-md) 0;
  background: var(--surface-elevated);
  color: var(--subtle-fg);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
}

.pstack-zoom {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0.9rem;
  border: 0;
  background: linear-gradient(to top, var(--scrim) 0%, transparent 42%);
  opacity: 0;
  cursor: zoom-in;
  transition: opacity var(--dur) var(--ease-out);
}

.pstack-media:hover .pstack-zoom,
.pstack-zoom:focus-visible {
  opacity: 1;
}

.pstack-zoom-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-pill);
  background: var(--surface-elevated);
  color: var(--fg);
  font-size: var(--step--1);
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.pstack-cover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 2rem;
  text-align: center;
  background: var(--img-frame);
}

.pstack-cover-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-md);
  background: var(--surface-elevated);
  color: var(--accent-text);
}

.pstack-cover-label {
  max-width: 26ch;
  margin: 0;
  color: var(--muted-fg);
  font-size: var(--step--1);
  line-height: 1.55;
}

.pstack-marquee {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  overflow: hidden;
  background: var(--fg);
  color: var(--bg);
  border-top: 1px solid color-mix(in srgb, var(--bg) 24%, transparent);
  pointer-events: auto;
}

.pstack-marquee-track {
  display: flex;
  width: max-content;
  min-width: 200%;
  animation: pstack-marquee 20s linear infinite;
}

.pstack-marquee:hover .pstack-marquee-track {
  animation-play-state: paused;
}

.pstack-marquee-track span {
  flex: 0 0 auto;
  padding: 0.58rem 0;
  padding-right: 2rem;
  font-family: var(--font-mono);
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.045em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
}

@keyframes pstack-marquee {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}

@media (min-width: 960px) and (min-height: 640px) {
  .pstack-list {
    gap: 1rem;
    padding-bottom: calc(100vh + 10rem);
  }
}

/* Below the stacking breakpoint, return to a normal readable document flow. */
@media (max-width: 959px), (max-height: 639px) {
  .pstack-list {
    gap: 1.25rem;
    padding-bottom: 4rem;
  }

  .pstack-card-sticky {
    position: relative;
    top: auto;
  }

  .pstack-card {
    min-height: 0;
    padding: clamp(1.15rem, 4vw, 1.75rem);
    --pstack-scale: 1 !important;
    --pstack-scroll-y: 0px !important;
    --pstack-hover-y: 0px !important;
    transform: translate3d(0, 0, 0) scale(1) !important;
    opacity: 1 !important;
  }

  .pstack-card:hover {
    --pstack-hover-y: -2px !important;
    transform: translate3d(0, -2px, 0) scale(1) !important;
  }

  .pstack-content {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.35rem;
  }

  .pstack-copy {
    justify-content: flex-start;
  }

  .pstack-visual {
    order: 2;
  }

  .pstack-media {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 520px) {
  .pstack-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .pstack-tech {
    gap: 0.35rem;
  }

  .pstack-tech .tag {
    font-size: 0.72rem;
  }

  .pstack-pill {
    font-size: 0.76rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pstack-card,
  .pstack-media,
  .pstack-shot,
  .pstack-zoom {
    transition: none !important;
  }

  .pstack-card,
  .pstack-card:hover {
    --pstack-scale: 1 !important;
    --pstack-scroll-y: 0px !important;
    --pstack-hover-y: 0px !important;
    transform: translate3d(0, 0, 0) scale(1) !important;
  }

  .pstack-shot,
  .pstack-media:hover .pstack-shot {
    scale: 1 !important;
    translate: none !important;
  }

  .pstack-marquee-track {
    animation: none !important;
    transform: none !important;
  }

  .pstack-zoom {
    opacity: 1;
  }
}

.reduced-motion .pstack-marquee-track {
  animation: none !important;
  transform: none !important;
}

.reduced-motion .pstack-card,
.reduced-motion .pstack-card:hover {
  --pstack-scale: 1 !important;
  --pstack-scroll-y: 0px !important;
  --pstack-hover-y: 0px !important;
  transform: translate3d(0, 0, 0) scale(1) !important;
  opacity: 1 !important;
}

.reduced-motion .pstack-shot,
.reduced-motion .pstack-media:hover .pstack-shot {
  scale: 1 !important;
  translate: none !important;
}

.reduced-motion .pstack-zoom {
  opacity: 1;
}

@media (forced-colors: active) {
  .pstack-card,
  .pstack-media,
  .pstack-pill,
  .pstack-zoom-chip,
  .pstack-marquee {
    border: 1px solid CanvasText;
  }

  .pstack-marquee {
    background: CanvasText;
    color: Canvas;
  }
}
`;
