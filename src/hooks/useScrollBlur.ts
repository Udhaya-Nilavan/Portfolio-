import { useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useReducedMotion, useMediaQuery } from './index';

export interface ScrollBlurConfig {
  /** Viewport offset threshold where defocus begins. Default: 'start 0.28' */
  startOffset?: string;
  /** Viewport offset threshold where element has fully cleared the top edge. Default: 'end top' */
  endOffset?: string;
}

/**
 * Hook providing continuous, scroll-linked cinematic depth-of-field blur
 * and differential speed vertical displacement as section headings approach
 * and leave the top edge of the viewport.
 *
 * Fully reversible on upward scroll, lightened on mobile, and completely disabled
 * under prefers-reduced-motion.
 */
export function useScrollBlur(
  targetRef: React.RefObject<HTMLElement | null>,
  config?: ScrollBlurConfig,
) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const startOffset = config?.startOffset ?? 'start 0.28';
  // fixed: 'end top' is not a valid offset
  const endOffset = config?.endOffset ?? 'end start';

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: [startOffset as any, endOffset as any],
  });

  // 1. Section Index (e.g. "01", "02") — Slowest, calmest movement with subtle softening
  const indexY = useTransform(
    scrollYProgress,
    [0, 0.4, 0.75, 1],
    ['0px', '-3px', isMobile ? '-6px' : '-10px', isMobile ? '-8px' : '-16px'],
  );
  const indexBlur = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [0, isMobile ? 0.2 : 0.4, isMobile ? 0.9 : 1.6, isMobile ? 1.5 : 2.4],
  );
  const indexFilter = useMotionTemplate`blur(${indexBlur}px)`;
  const indexOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [1, 0.95, 0.65, 0]);
  const indexScale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.995, 0.98]);

  // 2. Kicker / Category Label (e.g. "About", "Skills") — Gentle drift
  const kickerY = useTransform(
    scrollYProgress,
    [0, 0.4, 0.75, 1],
    ['0px', '-5px', isMobile ? '-9px' : '-15px', isMobile ? '-12px' : '-22px'],
  );
  const kickerBlur = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [0, isMobile ? 0.3 : 0.5, isMobile ? 1.1 : 1.9, isMobile ? 1.7 : 2.8],
  );
  const kickerFilter = useMotionTemplate`blur(${kickerBlur}px)`;
  const kickerOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [1, 0.90, 0.58, 0]);

  // 3. Major Section Title — Normal movement with calibrated cinematic depth-of-field effect (max ~3.8px desktop / ~2.2px mobile)
  const titleY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    ['0px', isMobile ? '-6px' : '-12px', isMobile ? '-14px' : '-24px', isMobile ? '-20px' : '-36px'],
  );
  const titleBlur = useTransform(
    scrollYProgress,
    [0, 0.3, 0.65, 1],
    [0, isMobile ? 0.4 : 0.7, isMobile ? 1.4 : 2.4, isMobile ? 2.2 : 3.8],
  );
  const titleFilter = useMotionTemplate`blur(${titleBlur}px)`;
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.65, 1], [1, 0.85, 0.52, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.65, 1], [1, 0.992, 0.97]);

  // 4. Subtitle / Supporting description
  const subtitleY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    ['0px', isMobile ? '-4px' : '-8px', isMobile ? '-10px' : '-16px', isMobile ? '-15px' : '-25px'],
  );
  const subtitleBlur = useTransform(
    scrollYProgress,
    [0, 0.3, 0.65, 1],
    [0, isMobile ? 0.3 : 0.6, isMobile ? 1.2 : 2.0, isMobile ? 1.8 : 3.0],
  );
  const subtitleFilter = useMotionTemplate`blur(${subtitleBlur}px)`;
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.65, 1], [1, 0.86, 0.55, 0]);

  return {
    reducedMotion,
    isMobile,
    scrollYProgress,
    indexStyle: reducedMotion
      ? undefined
      : { y: indexY, filter: indexFilter, opacity: indexOpacity, scale: indexScale },
    kickerStyle: reducedMotion
      ? undefined
      : { y: kickerY, filter: kickerFilter, opacity: kickerOpacity },
    titleStyle: reducedMotion
      ? undefined
      : { y: titleY, filter: titleFilter, opacity: titleOpacity, scale: titleScale },
    subtitleStyle: reducedMotion
      ? undefined
      : { y: subtitleY, filter: subtitleFilter, opacity: subtitleOpacity },
  };
}
