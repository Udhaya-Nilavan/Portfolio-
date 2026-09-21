import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useRef } from 'react';
import { personalData } from '../data/personal';
import { useReducedMotion, useMediaQuery } from '../hooks';
import { ArrowRight, ArrowUpRight } from '../components/ui/Icons';
import { TypewriterText } from '../components/ui/TypewriterText';
import { HeroPortraitBlueprint, UNLogoMark } from '../components/portfolio-visual/HeroPortraitBlueprint';
// Legacy HeroBlueprint removed to eliminate unwanted [MODEL] NODE // 02 and [BUILD // 00] marks

/**
 * Editorial cubic-bezier easing for deliberate, restrained pacing.
 */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Scroll tracking from hero top-of-viewport to hero exit
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // 1. Top metadata bar: stays calm, moves slightly upward and fades
  const metaY = useTransform(scrollYProgress, [0, 0.7], ['0px', isMobile ? '-18px' : '-32px']);
  const metaOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // 2. Name & identity block: moves upward with subtle scale reduction
  const nameY = useTransform(scrollYProgress, [0, 1], ['0px', isMobile ? '-35px' : '-65px']);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.65, 0.15]);

  // 3. Large headline: moves slightly faster, physical depth, slight scale reduction
  const headlineY = useTransform(scrollYProgress, [0, 1], ['0px', isMobile ? '-55px' : '-105px']);
  const headlineScale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.72, 0.25]);

  // 4. Secondary supporting text: camera depth-of-field exit blur + parallax speed
  const supportingY = useTransform(scrollYProgress, [0, 1], ['0px', isMobile ? '-65px' : '-135px']);
  const supportingBlur = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 0, isMobile ? 1.6 : 2.6, isMobile ? 2.4 : 4.0],
  );
  const supportingFilter = useMotionTemplate`blur(${supportingBlur}px)`;
  const supportingOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.5, 0]);

  // 5. CTAs: recedes and gradually fades out
  const ctaY = useTransform(scrollYProgress, [0, 1], ['0px', isMobile ? '-50px' : '-115px']);
  const ctaScale = useTransform(scrollYProgress, [0, 0.85], [1, 0.92]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 0.4, 0]);

  // 5b. Right-side portrait visual parallax & fade
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0px', isMobile ? '-25px' : '-55px']);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.7, 0.15]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  // 6. Scroll cue: quickly dissolves as user begins scrolling
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const scrollCueY = useTransform(scrollYProgress, [0, 0.12], ['0px', '-8px']);

  // Initial Entrance Animation Variants (Step 1 -> Step 5 from Phase 1)
  const metaEntrance = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE, delay: 0.1 } },
  };

  const nameMaskEntrance = {
    hidden: { y: '105%', opacity: 0 },
    visible: { y: '0%', opacity: 1, transition: { duration: 0.85, ease: EASE, delay: 0.3 } },
  };

  const identityEntrance = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.45 } },
  };

  const line1Entrance = {
    hidden: { y: '108%', opacity: 0 },
    visible: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: EASE, delay: 0.65 } },
  };

  const line2Entrance = {
    hidden: { y: '108%', opacity: 0 },
    visible: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: EASE, delay: 0.8 } },
  };

  const line3Entrance = {
    hidden: { y: '108%', opacity: 0 },
    visible: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: EASE, delay: 0.95 } },
  };

  const supportingEntrance = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE, delay: 1.15 } },
  };

  const ctaEntrance = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE, delay: 1.35 } },
  };

  const portraitEntrance = {
    hidden: { opacity: 0, scale: 0.97, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay: 0.55 } },
  };

  const scrollCueEntrance = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.75, ease: EASE, delay: 1.55 } },
  };

  return (
    <section id="home" ref={heroRef} className="hero" aria-labelledby="hero-name">
      <div className="shell hero__shell">
        {/* STEP 1: Top metadata bar & reserved slots */}
        <motion.div
          className="hero__meta-scroll-wrap"
          style={reducedMotion ? undefined : { y: metaY, opacity: metaOpacity }}
        >
          <motion.div
            className="hero__meta-bar"
            variants={reducedMotion ? undefined : metaEntrance}
            initial={reducedMotion ? false : 'hidden'}
            animate="visible"
          >
            <div className="hero__meta-left">
              {/* Status indicator */}
              {personalData.statusBadge.active && (
                <div className="hero__status-pill">
                  <span className="hero__status-dot" aria-hidden="true" />
                  <span>{personalData.statusBadge.label}</span>
                </div>
              )}

              {/* Signature letter-by-letter typing reveal */}
              <div className="hero__typewriter-slot" data-slot="phase4-typewriter">
                <TypewriterText text="BUILDING WITH DATA, CODE & AI" delay={550} />
              </div>
            </div>

            <div className="hero__meta-right">
              <span className="hero__location-tag">{personalData.location}</span>

              {/* Section 6: Reserved visual space for circular photo / UN monogram */}
              <div
                className="hero__avatar-slot"
                title={`${personalData.name} — Profile space`}
                aria-label={`${personalData.name} profile space`}
              >
                <UNLogoMark size={28} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Editorial Core with Approved Right-Side Portrait Visual */}
        <div className="hero__stage">
          <div className="hero__core">
          {/* STEP 2: Name & Identity */}
          <motion.div
            className="hero__identity-scroll-wrap"
            style={reducedMotion ? undefined : { y: nameY, scale: nameScale, opacity: nameOpacity }}
          >
            <div className="hero__identity-block">
              <div className="hero__mask hero__mask--name">
                <motion.h1
                  id="hero-name"
                  className="hero__name"
                  variants={reducedMotion ? undefined : nameMaskEntrance}
                  initial={reducedMotion ? false : 'hidden'}
                  animate="visible"
                >
                  {personalData.name.toUpperCase()}
                </motion.h1>
              </div>

              <motion.div
                className="hero__identity-line"
                variants={reducedMotion ? undefined : identityEntrance}
                initial={reducedMotion ? false : 'hidden'}
                animate="visible"
              >
                <span className="hero__identity-title">CSE STUDENT</span>
                <span className="hero__identity-divider" aria-hidden="true">—</span>
                <span className="hero__identity-fields">DATA SCIENCE • MACHINE LEARNING • AI</span>
              </motion.div>
            </div>
          </motion.div>

          {/* STEP 3: Large Headline — Line by line reveal */}
          <motion.div
            className="hero__headline-scroll-wrap"
            style={
              reducedMotion
                ? undefined
                : { y: headlineY, scale: headlineScale, opacity: headlineOpacity }
            }
          >
            <div className="hero__headline-block">
              <div className="hero__mask hero__mask--headline">
                <motion.div
                  className="hero__headline-line"
                  variants={reducedMotion ? undefined : line1Entrance}
                  initial={reducedMotion ? false : 'hidden'}
                  animate="visible"
                >
                  I BUILD
                </motion.div>
              </div>
              <div className="hero__mask hero__mask--headline">
                <motion.div
                  className="hero__headline-line"
                  variants={reducedMotion ? undefined : line2Entrance}
                  initial={reducedMotion ? false : 'hidden'}
                  animate="visible"
                >
                  INTELLIGENT
                </motion.div>
              </div>
              <div className="hero__mask hero__mask--headline">
                <motion.div
                  className="hero__headline-line"
                  variants={reducedMotion ? undefined : line3Entrance}
                  initial={reducedMotion ? false : 'hidden'}
                  animate="visible"
                >
                  SYSTEMS.
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* STEP 4: Short Supporting Text with Camera Depth Blur */}
          <motion.div
            className="hero__supporting-scroll-wrap"
            style={
              reducedMotion
                ? undefined
                : { y: supportingY, filter: supportingFilter, opacity: supportingOpacity }
            }
          >
            <motion.p
              className="hero__supporting"
              variants={reducedMotion ? undefined : supportingEntrance}
              initial={reducedMotion ? false : 'hidden'}
              animate="visible"
            >
              Computer Science Engineering student at Lovely Professional University building
              intelligent, data-driven solutions with Python, Machine Learning, and Agentic AI.
            </motion.p>
          </motion.div>

          {/* STEP 5: Clear CTAs */}
          <motion.div
            className="hero__ctas-scroll-wrap"
            style={reducedMotion ? undefined : { y: ctaY, scale: ctaScale, opacity: ctaOpacity }}
          >
            <motion.div
              className="hero__ctas"
              variants={reducedMotion ? undefined : ctaEntrance}
              initial={reducedMotion ? false : 'hidden'}
              animate="visible"
            >
              <a className="hero__btn hero__btn--primary" href="#projects">
                <span>Explore Projects</span>
                <ArrowRight size={15} className="hero__btn-icon" />
              </a>
              <a className="hero__btn hero__btn--secondary" href="#contact">
                <span>Get in Touch</span>
              </a>
              {personalData.resumeUrl && (
                <a
                  className="hero__btn hero__btn--link"
                  href={personalData.resumeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span>View CV</span>
                  <ArrowUpRight size={14} />
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Approved Hero Portrait Visual Composition */}
        <motion.div
          className="hero__visual-slot"
          variants={reducedMotion ? undefined : portraitEntrance}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          style={
            reducedMotion
              ? undefined
              : { y: portraitY, opacity: portraitOpacity, scale: portraitScale }
          }
        >
          <HeroPortraitBlueprint />
        </motion.div>
      </div>

        {/* Section 9: Subtle Scroll Indicator */}
        <motion.div
          className="hero__scroll-cue-wrap"
          style={reducedMotion ? undefined : { opacity: scrollCueOpacity, y: scrollCueY }}
        >
          <motion.div
            className="hero__scroll-cue"
            variants={reducedMotion ? undefined : scrollCueEntrance}
            initial={reducedMotion ? false : 'hidden'}
            animate="visible"
            aria-hidden="true"
          >
            <span className="hero__scroll-label">SCROLL</span>
            <div className="hero__scroll-bar">
              <span className="hero__scroll-fill" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
