import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks';

/**
 * The motion vocabulary. Sections pick different patterns so the page does not
 * read as one animation repeated, while shared timing keeps it coherent.
 */
export type Motion = 'rise' | 'slide-left' | 'slide-right' | 'scale' | 'clip';

interface RevealProps {
  children: ReactNode;
  /** Stagger within a group, in ms. Kept small — content first, motion second. */
  delay?: number;
  motion?: Motion;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reveals its children once, the first time they scroll into view.
 *
 * Reveals once and never reverses: content that flickers back out as you
 * scroll up is distracting and makes the page feel unstable.
 */
export function Reveal({
  children,
  delay = 0,
  motion = 'rise',
  as: Tag = 'div',
  className = '',
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      data-motion={motion}
      style={
        {
          ...style,
          '--reveal-delay': `${reducedMotion ? 0 : delay}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
