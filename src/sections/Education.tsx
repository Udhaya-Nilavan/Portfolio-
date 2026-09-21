import { educationData } from '../data/education';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeader } from '../components/ui/Primitives';
import { Calendar, GraduationCap, MapPin } from '../components/ui/Icons';

export function Education() {
  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="shell">
        <SectionHeader
          id="education-title"
          index="06"
          kicker="Education"
          title="Academic background"
        />

        <div className="timeline">
          {educationData.map((item, i) => (
            <Reveal key={item.id} delay={i * 70} className="timeline__item" motion="slide-right">
              <span className="timeline__dot" aria-hidden="true" />

              <article className="record">
                <div className="record__head">
                  <div>
                    <h3 className="record__title">{item.degree}</h3>
                    <p className="record__org">
                      <GraduationCap size={17} aria-hidden="true" />
                      {item.institution}
                    </p>
                    <p className="record__sub">
                      <MapPin
                        size={13}
                        aria-hidden="true"
                        style={{ display: 'inline', verticalAlign: '-2px' }}
                      />{' '}
                      {item.location}
                    </p>
                  </div>

                  <div className="record__chips">
                    <span className="tag tag--cyan">
                      <Calendar size={13} aria-hidden="true" />
                      {item.duration}
                    </span>
                    {item.standing && <span className="tag tag--accent mono">{item.standing}</span>}
                  </div>
                </div>

                <div className="record__grid">
                  {item.coursework.length > 0 && (
                    <div>
                      <p className="record__block-label">Relevant coursework</p>
                      <div className="tag-row">
                        {item.coursework.map(course => (
                          <span key={course} className="tag">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.highlights.length > 0 && (
                    <div>
                      <p className="record__block-label">Focus while studying</p>
                      <ul className="record__bullets">
                        {item.highlights.map(highlight => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
