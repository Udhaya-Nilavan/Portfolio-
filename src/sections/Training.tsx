import { industryTrainingData } from '../data/industryTraining';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/Primitives';
import { ArrowUpRight, Building, Calendar, Cpu, Shield } from '../components/ui/Icons';
import { TrainingBlueprint } from '../components/blueprint/TechnicalBlueprint';

export function Training() {
  return (
    <section id="training" className="section" aria-labelledby="training-title">
      <div className="shell">
        <SectionHeader
          id="training-title"
          index="07"
          kicker="Training"
          title="Industry program"
          subtitle="Specialised training running alongside my degree."
        />

        <div className="timeline">
          {industryTrainingData.map((item, i) => (
            <Reveal key={item.id} delay={i * 70} className="timeline__item" motion="slide-right">
              <span className="timeline__dot" aria-hidden="true" />

              <article className="record">
                <div className="record__head">
                  <div>
                    <h3 className="record__title">{item.title}</h3>
                    <p className="record__org">
                      <Building size={17} aria-hidden="true" />
                      {item.provider}
                    </p>
                    <p className="record__sub">{item.collaboration}</p>
                  </div>

                  <div className="record__chips">
                    <span className="tag tag--cyan">
                      <Calendar size={13} aria-hidden="true" />
                      {item.duration}
                    </span>
                    {item.status && <span className="tag tag--violet">{item.status}</span>}
                  </div>
                </div>

                <div className="record__block">
                  <p className="record__block-label">Core focus</p>
                  <p className="prose" style={{ fontSize: 'var(--step--1)' }}>
                    {item.coreFocus}
                  </p>
                </div>

                <div className="record__grid">
                  {item.highlights.length > 0 && (
                    <div>
                      <p className="record__block-label">What the program covers</p>
                      <ul className="record__bullets">
                        {item.highlights.map(highlight => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.toolsAndFrameworks.length > 0 && (
                    <div>
                      <p className="record__block-label">Tools and frameworks</p>
                      <div className="tag-row">
                        {item.toolsAndFrameworks.map(tool => (
                          <span key={tool} className="tag">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {item.capstoneProject && (
                  <div className="record__capstone">
                    <p className="record__capstone-label">
                      <Cpu
                        size={14}
                        aria-hidden="true"
                        style={{ display: 'inline', verticalAlign: '-2px' }}
                      />{' '}
                      Program project work
                    </p>
                    <p className="record__capstone-title">{item.capstoneProject.title}</p>
                    <p className="record__capstone-desc">{item.capstoneProject.description}</p>
                    <div className="tag-row">
                      {item.capstoneProject.tags.map(tag => (
                        <span key={tag} className="tag tag--violet">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className="record__block"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  {item.credentialId && (
                    <span className="cert__credential" style={{ marginTop: 0 }}>
                      <Shield size={14} aria-hidden="true" />
                      <span>
                        Credential ID <span className="mono">{item.credentialId}</span>
                      </span>
                    </span>
                  )}

                  {item.verificationUrl && (
                    <a
                      className="btn btn--ghost"
                      href={item.verificationUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Verify with provider
                      <ArrowUpRight size={15} className="btn__icon" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <TrainingBlueprint />
    </section>
  );
}
