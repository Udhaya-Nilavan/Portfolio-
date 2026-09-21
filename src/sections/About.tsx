import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { personalData } from '../data/personal';
import { useReducedMotion, useMediaQuery, useScrollBlur } from '../hooks';
import { Brain, Cpu, Database, Sparkles } from '../components/ui/Icons';
import { AboutBlueprint } from '../components/blueprint/TechnicalBlueprint';

/** Maps the icon names already stored in personal.ts to real components. */
const DOMAIN_ICONS: Record<string, (p: { size?: number }) => React.JSX.Element> = {
  Database,
  Brain,
  Sparkles,
  Cpu,
};

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Phase 3: Exit scroll blur tracking when header approaches the top viewport edge
  const {
    indexStyle: exitIndexStyle,
    kickerStyle: exitKickerStyle,
    titleStyle: exitTitleStyle,
  } = useScrollBlur(headerRef);

  // Phase 2: Entrance scroll tracking from Hero bottom into viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.2'],
  });

  // 1. Section index "01": appears and rises first
  const indexY = useTransform(scrollYProgress, [0.04, 0.36], [isMobile ? '18px' : '36px', '0px']);
  const indexOpacity = useTransform(scrollYProgress, [0.04, 0.3], [0, 1]);
  const indexScale = useTransform(scrollYProgress, [0.04, 0.36], [0.88, 1]);

  // 2. Kicker "About": reveals smoothly following the index
  const kickerY = useTransform(scrollYProgress, [0.1, 0.44], [isMobile ? '16px' : '28px', '0px']);
  const kickerOpacity = useTransform(scrollYProgress, [0.1, 0.38], [0, 1]);

  // 3. Title: reveals upward through an overflow mask
  const titleY = useTransform(scrollYProgress, [0.18, 0.62], ['100%', '0%']);
  const titleOpacity = useTransform(scrollYProgress, [0.18, 0.5], [0, 1]);

  // 4. Content grid: rises and settles into place with natural vertical motion and depth
  const contentY = useTransform(scrollYProgress, [0.28, 0.85], [isMobile ? '28px' : '55px', '0px']);
  const contentOpacity = useTransform(scrollYProgress, [0.28, 0.76], [0, 1]);
  const contentScale = useTransform(scrollYProgress, [0.28, 0.88], [isMobile ? 0.98 : 0.965, 1]);

  return (
    <section id="about" ref={sectionRef} className="section" aria-labelledby="about-title">
      <div className="shell">
        <header ref={headerRef} className="section-head">
          <div className="section-head__kicker-row">
            <motion.div style={exitIndexStyle}>
              <motion.span
                className="section-head__index mono"
                aria-hidden="true"
                style={
                  reducedMotion ? undefined : { y: indexY, opacity: indexOpacity, scale: indexScale }
                }
              >
                01
              </motion.span>
            </motion.div>
            <motion.div style={exitKickerStyle}>
              <motion.p
                className="section-head__kicker"
                style={reducedMotion ? undefined : { y: kickerY, opacity: kickerOpacity }}
              >
                About
              </motion.p>
            </motion.div>
          </div>

          <motion.div style={exitTitleStyle}>
            <div className="section-head__title-mask">
              <motion.h2
                id="about-title"
                className="section-head__title"
                style={reducedMotion ? undefined : { y: titleY, opacity: titleOpacity }}
              >
                Building a career in data, machine learning and agentic AI
              </motion.h2>
            </div>
          </motion.div>
        </header>


        <motion.div
          className="about__unfold-wrap"
          style={
            reducedMotion
              ? undefined
              : {
                  y: contentY,
                  opacity: contentOpacity,
                  scale: contentScale,
                }
          }
        >
          <div className="about__grid">
            <div className="about__body">
              {/* Every paragraph below is Udhaya Nilavan's own copy, unedited. */}
              <p className="about__lead">{personalData.shortStatement}</p>
              <p className="prose" style={{ marginTop: '1.4rem' }}>
                {personalData.aboutIntro}
              </p>
              <p className="prose">{personalData.aboutPhilosophy}</p>
            </div>

            <div className="domains">
              {personalData.coreDomains.map(domain => {
                const Icon = DOMAIN_ICONS[domain.icon] ?? Sparkles;
                return (
                  <article className="domain" key={domain.title}>
                    <span className="domain__icon" aria-hidden="true">
                      <Icon size={19} />
                    </span>
                    <div>
                      <h3 className="domain__title">{domain.title}</h3>
                      <p className="domain__desc">{domain.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
      <AboutBlueprint />
    </section>
  );
}
