import { useEffect, useMemo, useState } from 'react';

/**
 * Promptfolio-style global typography motion system
 * =================================================
 *
 * 1) INTRO:
 *    Letters of the portfolio name rise from below one-by-one.
 *
 * 2) PAGE TEXT:
 *    Text blocks reveal upward smoothly when they enter the viewport.
 *    The effect is intentionally subtle.
 *
 * 3) PERFORMANCE:
 *    - IntersectionObserver is used instead of continuous scroll handlers.
 *    - No requestAnimationFrame scroll loop.
 *    - Only transform/opacity are animated.
 *
 * 4) SAFE BY DEFAULT:
 *    Navigation, buttons, forms, chatbot, floating assistant, flip cards, and fixed UI
 *    are strictly excluded.
 */

type PromptfolioMotionSystemProps = {
  name?: string;
  introDurationMs?: number;
  runIntroEveryLoad?: boolean;
};

const NAME_DEFAULT = 'Udhaya Nilavan';

const EXCLUDED_SELECTOR = [
  '[data-no-text-reveal]',
  '[data-static-ui]',
  'nav',
  'button',
  'input',
  'textarea',
  'select',
  'option',
  'script',
  'style',
  'noscript',
  '[aria-hidden="true"]',
  '.floating-nav',
  '.floating-nav__dock',
  '.floating-nav__sheet',
  '.floating-ai-container',
  '.fai-stage',
  '.ai-chatbot',
  '.ai-chatbot-drawer',
  '.chatbot',
  '.chatbot-drawer',
  '.portfolio-studio',
  '.certificate-modal',
  '.lightbox',
  '.cert-final-card',
  '.cert-final-actions',
  '.smooth-details',
  '.smooth-skill-card',
].join(',');

const REVEAL_SELECTOR = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'li',
  'dt',
  'dd',
  'blockquote',
  'figcaption',
  'small',
  'label',
].join(',');

function useIntroSequence(durationMs: number, enabled: boolean) {
  const [show, setShow] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setShow(false);
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      const timer = window.setTimeout(() => setShow(false), 300);
      return () => window.clearTimeout(timer);
    }

    const exitTimer = window.setTimeout(() => {
      setShow(false);
    }, durationMs + 450);

    return () => window.clearTimeout(exitTimer);
  }, [durationMs, enabled]);

  return show;
}

function IntroLoader({
  name,
  durationMs,
}: {
  name: string;
  durationMs: number;
}) {
  const letters = useMemo(() => Array.from(name), [name]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setProgress(100);
      const t = window.setTimeout(() => setExiting(true), 200);
      return () => window.clearTimeout(t);
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / durationMs) * 100);
      setProgress(pct);

      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    const exitTimer = window.setTimeout(
      () => setExiting(true),
      durationMs,
    );

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
    };
  }, [durationMs]);

  return (
    <>
      <style>{PROMPTFOLIO_MOTION_STYLES}</style>

      <div
        className={`promptfolio-loader ${exiting ? 'is-exiting' : ''}`}
        role="status"
        aria-label="Loading portfolio"
      >
        <div className="promptfolio-loader__center">
          <div className="promptfolio-loader__name" aria-label={name}>
            {letters.map((letter, index) => (
              <span
                className="promptfolio-loader__letter"
                key={`${letter}-${index}`}
                style={{
                  animationDelay: `${120 + index * 40}ms`,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>

          <span className="promptfolio-loader__sub">
            DATA · AI · IMPACT
          </span>
        </div>

        <div className="promptfolio-loader__progress">
          <div className="promptfolio-loader__progress-line">
            <span
              className="promptfolio-loader__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="promptfolio-loader__progress-value">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </>
  );
}

function applyRevealClasses(root: ParentNode) {
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
  );

  for (const element of elements) {
    if (element.matches(EXCLUDED_SELECTOR)) continue;
    if (element.closest(EXCLUDED_SELECTOR)) continue;
    if (element.dataset.noTextReveal === 'true') continue;

    if (!(element.textContent ?? '').trim()) continue;

    element.classList.add('promptfolio-text-reveal');
  }

  return elements.filter((element) => {
    if (!element.classList.contains('promptfolio-text-reveal')) return false;
    if (element.matches(EXCLUDED_SELECTOR)) return false;
    if (element.closest(EXCLUDED_SELECTOR)) return false;
    return true;
  });
}

function TextRevealObserver() {
  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = reducedQuery.matches;

    const revealElements = applyRevealClasses(document);

    if (!revealElements.length) return;

    if (reduced) {
      for (const element of revealElements) {
        element.classList.add('is-visible');
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            element.classList.add('is-visible');
            observer.unobserve(element);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
      },
    );

    for (const element of revealElements) {
      observer.observe(element);
    }

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;

      if (reduced) {
        for (const element of revealElements) {
          element.classList.add('is-visible');
          observer.unobserve(element);
        }
      }
    };

    reducedQuery.addEventListener('change', onMotionPreferenceChange);

    const mutationObserver = new MutationObserver((mutations) => {
      if (reduced) return;

      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue;

          const added = applyRevealClasses(node);

          for (const element of added) {
            if (!element.classList.contains('is-visible')) {
              observer.observe(element);
            }
          }
        }
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      reducedQuery.removeEventListener('change', onMotionPreferenceChange);
    };
  }, []);

  return null;
}

export function PromptfolioMotionSystem({
  name = NAME_DEFAULT,
  introDurationMs = 1750,
  runIntroEveryLoad = true,
}: PromptfolioMotionSystemProps) {
  const shouldShowIntro = useMemo(() => {
    if (runIntroEveryLoad) return true;

    try {
      return sessionStorage.getItem('udhaya-promptfolio-intro-seen') !== '1';
    } catch {
      return true;
    }
  }, [runIntroEveryLoad]);

  const showIntro = useIntroSequence(
    introDurationMs,
    shouldShowIntro,
  );

  useEffect(() => {
    if (!showIntro && !runIntroEveryLoad) {
      try {
        sessionStorage.setItem('udhaya-promptfolio-intro-seen', '1');
      } catch {
        // Storage can be unavailable; animation still works.
      }
    }
  }, [showIntro, runIntroEveryLoad]);

  return (
    <>
      <TextRevealObserver />

      {showIntro ? (
        <IntroLoader name={name} durationMs={introDurationMs} />
      ) : null}
    </>
  );
}

export default PromptfolioMotionSystem;

const PROMPTFOLIO_MOTION_STYLES = `
/* ================================================================
   PROMPTFOLIO-STYLE GLOBAL MOTION
   ================================================================ */

.promptfolio-loader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 50% 44%,
      rgba(255,255,255,.995),
      rgba(250,249,246,.99) 62%,
      rgba(246,247,248,.995)
    );
  color: #101722;
  isolation: isolate;
  transition:
    opacity .52s cubic-bezier(.76,0,.24,1),
    visibility .52s;
}

.promptfolio-loader::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(15,23,42,.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(15,23,42,.025) 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image:
    linear-gradient(
      to bottom,
      transparent,
      black 12%,
      black 88%,
      transparent
    );
  pointer-events: none;
}

.promptfolio-loader::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(46vw, 620px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(184,154,104,.055);
  border-radius: 50%;
  box-shadow:
    0 0 0 70px rgba(184,154,104,.020),
    0 0 0 140px rgba(184,154,104,.012);
  pointer-events: none;
}

.promptfolio-loader__center {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: translateY(0);
  animation:
    promptfolio-loader-center-in .9s
    cubic-bezier(.16,1,.3,1) both;
}

.promptfolio-loader__name {
  display: flex;
  align-items: baseline;
  justify-content: center;
  overflow: hidden;
  font-family:
    var(--font-display,
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif);
  font-size: clamp(2.65rem, 6vw, 5.2rem);
  font-weight: 500;
  line-height: .95;
  letter-spacing: -.055em;
  color: #101722;
}

.promptfolio-loader__letter {
  display: inline-block;
  transform: translateY(115%);
  opacity: 0;
  filter: blur(6px);
  animation:
    promptfolio-letter-up .72s
    cubic-bezier(.16,1,.3,1) forwards;
  will-change: transform, opacity;
}

.promptfolio-loader__sub {
  margin-top: 18px;
  color: #9a8463;
  font-family:
    var(--font-mono,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace);
  font-size: .63rem;
  font-weight: 700;
  letter-spacing: .28em;
  opacity: 0;
  animation:
    promptfolio-sub-in .75s
    cubic-bezier(.16,1,.3,1) 680ms forwards;
}

.promptfolio-loader__progress {
  position: absolute;
  left: 50%;
  bottom: clamp(52px, 8.5vh, 92px);
  z-index: 3;
  display: grid;
  grid-template-columns: minmax(0, 330px) auto;
  gap: 12px;
  width: min(390px, calc(100% - 40px));
  align-items: center;
  transform: translateX(-50%);
  opacity: 0;
  animation:
    promptfolio-progress-in .65s
    cubic-bezier(.16,1,.3,1) 320ms forwards;
}

.promptfolio-loader__progress-line {
  position: relative;
  height: 2px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(16,23,34,.10);
}

.promptfolio-loader__progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  display: block;
  border-radius: inherit;
  background: #aa8a59;
  transition: width 40ms linear;
}

.promptfolio-loader__progress-value {
  color: #9b9386;
  font-family:
    var(--font-mono,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace);
  font-size: .57rem;
  font-weight: 700;
  letter-spacing: .08em;
}

.promptfolio-loader.is-exiting {
  opacity: 0;
  visibility: hidden;
}

.promptfolio-loader.is-exiting .promptfolio-loader__center {
  animation:
    promptfolio-loader-center-out .44s
    cubic-bezier(.76,0,.24,1) both;
}

.promptfolio-loader.is-exiting .promptfolio-loader__progress {
  animation:
    promptfolio-progress-out .32s ease both;
}

/* ================================================================
   PAGE TEXT REVEAL
   ================================================================ */

.promptfolio-text-reveal {
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  transition:
    opacity .78s cubic-bezier(.16,1,.3,1),
    transform .78s cubic-bezier(.16,1,.3,1);
  will-change: opacity, transform;
}

.promptfolio-text-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.promptfolio-text-reveal:nth-child(2) {
  transition-delay: 45ms;
}

.promptfolio-text-reveal:nth-child(3) {
  transition-delay: 90ms;
}

.promptfolio-text-reveal:nth-child(4) {
  transition-delay: 135ms;
}

.promptfolio-text-reveal:nth-child(5) {
  transition-delay: 180ms;
}

/* ================================================================
   EXCLUSIONS
   ================================================================ */

nav .promptfolio-text-reveal,
button .promptfolio-text-reveal,
.floating-nav .promptfolio-text-reveal,
.floating-ai-container .promptfolio-text-reveal,
.ai-chatbot .promptfolio-text-reveal,
.ai-chatbot-drawer .promptfolio-text-reveal,
.chatbot .promptfolio-text-reveal,
.portfolio-studio .promptfolio-text-reveal,
.certificate-modal .promptfolio-text-reveal,
.cert-final-card .promptfolio-text-reveal,
.smooth-details .promptfolio-text-reveal,
.smooth-skill-card .promptfolio-text-reveal {
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
}

/* ================================================================
   RESPONSIVE
   ================================================================ */

@media (max-width: 600px) {
  .promptfolio-loader__name {
    font-size: clamp(2.3rem, 11vw, 3.7rem);
  }

  .promptfolio-loader__sub {
    margin-top: 14px;
    font-size: .55rem;
    letter-spacing: .20em;
  }

  .promptfolio-loader__progress {
    bottom: 42px;
    width: min(330px, calc(100% - 32px));
    grid-template-columns: minmax(0,1fr) auto;
  }

  .promptfolio-text-reveal {
    transform: translate3d(0, 18px, 0);
    transition-duration: .68s;
  }
}

/* ================================================================
   ACCESSIBILITY
   ================================================================ */

@media (prefers-reduced-motion: reduce) {
  .promptfolio-loader__center,
  .promptfolio-loader__letter,
  .promptfolio-loader__sub,
  .promptfolio-loader__progress,
  .promptfolio-loader.is-exiting,
  .promptfolio-loader.is-exiting .promptfolio-loader__center,
  .promptfolio-loader.is-exiting .promptfolio-loader__progress {
    animation: none !important;
  }

  .promptfolio-loader__letter {
    transform: none;
    opacity: 1;
    filter: none;
  }

  .promptfolio-loader__sub,
  .promptfolio-loader__progress {
    opacity: 1;
  }

  .promptfolio-loader.is-exiting {
    opacity: 0;
    visibility: hidden;
    transition: opacity .25s ease, visibility .25s;
  }

  .promptfolio-text-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}

@keyframes promptfolio-letter-up {
  from {
    opacity: 0;
    transform: translateY(115%);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes promptfolio-sub-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes promptfolio-loader-center-in {
  from {
    opacity: .35;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes promptfolio-progress-in {
  from {
    opacity: 0;
    transform: translate(-50%, 14px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes promptfolio-loader-center-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-18px);
    filter: blur(3px);
  }
}

@keyframes promptfolio-progress-out {
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
}
`;
