import { useCallback, useRef, useState } from 'react';
import { projectsData } from '../data/projects';
import { projectImages } from '../data/projectImages';
import type { Project } from '../types/portfolio';
import { Reveal } from '../components/ui/Reveal';
import { Lightbox, SectionHeader } from '../components/ui/Primitives';
import { TechBadge, techIcon } from '../components/ui/TechIcons';
import { useReducedMotion } from '../hooks';
import { ArrowRight, ArrowUpRight, Eye, Github, Layers } from '../components/ui/Icons';
import { ProjectsBlueprint } from '../components/blueprint/TechnicalBlueprint';

/* -------------------------------------------------------------------------
   Detail modal — shows only what already exists in projects.ts.
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
   Media frame with pointer-tracked parallax.

   The drift is deliberately tiny (10px either way) and applied with `translate`
   on a pre-scaled image, so it never exposes an edge and never triggers layout.
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
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || !imgRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      imgRef.current.style.translate = `${(-dx * 20).toFixed(1)}px ${(-dy * 20).toFixed(1)}px`;
    },
    [reducedMotion],
  );

  const resetParallax = useCallback(() => {
    if (imgRef.current) imgRef.current.style.translate = '0px 0px';
  }, []);

  return (
    <div className="project__media" onPointerMove={onPointerMove} onPointerLeave={resetParallax}>
      <span className="project__index" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>

      {image ? (
        <>
          <img
            ref={imgRef}
            className="project__shot"
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
          />
          <button
            type="button"
            className="project__zoom"
            onClick={onZoom}
            aria-label={`Enlarge the ${project.title} screenshot`}
          >
            <span className="project__zoom-chip">
              <Eye size={15} />
              Enlarge
            </span>
          </button>
        </>
      ) : (
        /* No screenshot supplied for this project — a typographic cover,
           never a fabricated screenshot. */
        <div className="project__cover">
          <span className="project__cover-mark" aria-hidden="true">
            <Layers size={26} />
          </span>
          <p className="project__cover-label">{project.categoryLabel}</p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Projects
------------------------------------------------------------------------- */
export function Projects() {
  const [detail, setDetail] = useState<Project | null>(null);
  const [zoomed, setZoomed] = useState<{ id: string; title: string } | null>(null);

  const zoomImage = zoomed ? projectImages[zoomed.id] : null;

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="shell">
        <SectionHeader
          id="projects-title"
          index="04"
          kicker="Projects"
          title="Things I have built"
          subtitle="Each project links to its source. Screenshots are from the running applications."
        />

        <div className="projects__list">
          {projectsData.map((project, i) => {
            // Media enters from the side it sits on, so each pair reads as one
            // composition rather than two unrelated animations.
            const mediaMotion = i % 2 === 0 ? 'slide-left' : 'slide-right';
            const bodyMotion = i % 2 === 0 ? 'slide-right' : 'slide-left';
            const CategoryIcon = techIcon(project.technologies[0] ?? '');

            return (
              <article className="project" key={project.id}>
                <Reveal motion={mediaMotion} className="project__media-wrap">
                  <ProjectMedia
                    project={project}
                    index={i}
                    onZoom={() => setZoomed({ id: project.id, title: project.title })}
                  />
                </Reveal>

                <Reveal motion={bodyMotion} delay={80} className="project__body-wrap">
                  <div className="project__body">
                    <div className="project__meta">
                      <span className="tag tag--accent">
                        <CategoryIcon size={13} />
                        {project.categoryLabel}
                      </span>
                      {project.featured && <span className="tag">Featured</span>}
                    </div>

                    <h3 className="project__title">{project.title}</h3>
                    <p className="project__desc">{project.shortDescription}</p>

                    <div className="project__tech">
                      {project.technologies.map(tech => (
                        <TechBadge key={tech} name={tech} />
                      ))}
                    </div>

                    <div className="project__actions">
                      <button className="btn btn--primary" onClick={() => setDetail(project)}>
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
                </Reveal>
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
      <ProjectsBlueprint />
    </section>
  );
}
