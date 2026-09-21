import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks';

interface TypewriterTextProps {
  /** The text string to reveal letter-by-letter. */
  text: string;
  /** Delay in milliseconds before typing begins. Default: 550ms. */
  delay?: number;
  /** Optional custom class name. */
  className?: string;
}

/**
 * TypewriterText
 *
 * Types out text letter-by-letter with a natural human cadence.
 * Types exactly once, remains visible, and displays a subtle breathing editorial cursor.
 * When prefers-reduced-motion is active, displays the entire string immediately without cursor animation.
 */
export function TypewriterText({
  text,
  delay = 550,
  className = '',
}: TypewriterTextProps) {
  const reducedMotion = useReducedMotion();
  const [displayedCount, setDisplayedCount] = useState(() => (reducedMotion ? text.length : 0));
  const [isTypingComplete, setIsTypingComplete] = useState(() => reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedCount(text.length);
      setIsTypingComplete(true);
      return;
    }

    let timer: number | undefined;
    let currentIndex = 0;

    const typeNext = () => {
      if (currentIndex < text.length) {
        currentIndex++;
        setDisplayedCount(currentIndex);

        // Natural non-uniform cadence:
        // Letters: 36-44ms, Spaces: 55ms, Punctuation/Symbols: 85ms
        const char = text[currentIndex - 1];
        let charDelay = 38;
        if (char === ' ') {
          charDelay = 55;
        } else if (char === ',' || char === '&' || char === '.') {
          charDelay = 85;
        }

        // Subtle organic variation (+-5ms)
        const jitter = (Math.random() - 0.5) * 10;
        timer = window.setTimeout(typeNext, Math.max(20, charDelay + jitter));
      } else {
        setIsTypingComplete(true);
      }
    };

    const startTimer = window.setTimeout(typeNext, delay);

    return () => {
      window.clearTimeout(startTimer);
      if (timer) window.clearTimeout(timer);
    };
  }, [text, delay, reducedMotion]);

  const visibleText = reducedMotion ? text : text.slice(0, displayedCount);

  return (
    <span className={`hero__typewriter ${className}`.trim()} aria-label={text}>
      <span aria-hidden="true">{visibleText}</span>
      {!reducedMotion && (
        <span
          className={`hero__typewriter-cursor${isTypingComplete ? ' is-complete' : ''}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
