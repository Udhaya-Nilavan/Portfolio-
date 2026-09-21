import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useScrollLock, useScrollBlur } from '../../hooks';
import { X } from './Icons';

/* -------------------------------------------------------------------------
   SectionHeader / ScrollBlurHeader
   Cinematic scroll-linked depth-of-field blur and differential speed depth.
------------------------------------------------------------------------- */
export function SectionHeader({
  kicker,
  title,
  subtitle,
  id,
  index,
  className = '',
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  id?: string;
  /** Position in the page sequence, e.g. "03". Purely structural signposting. */
  index?: string;
  className?: string;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const { indexStyle, kickerStyle, titleStyle, subtitleStyle } = useScrollBlur(headerRef);

  return (
    <header ref={headerRef} className={`section-head ${className}`.trim()}>
      <div className="section-head__kicker-row">
        {index && (
          <motion.span
            className="section-head__index mono"
            aria-hidden="true"
            style={indexStyle}
          >
            {index}
          </motion.span>
        )}
        <motion.p className="section-head__kicker" style={kickerStyle}>
          {kicker}
        </motion.p>
      </div>
      <div className="section-head__title-wrap">
        <motion.h2 className="section-head__title" id={id} style={titleStyle}>
          {title}
        </motion.h2>
      </div>
      {subtitle && (
        <motion.p className="section-head__sub" style={subtitleStyle}>
          {subtitle}
        </motion.p>
      )}
    </header>
  );
}

export const ScrollBlurHeader = SectionHeader;


/* -------------------------------------------------------------------------
   Backdrop — the fixed atmospheric background with layered depth & texture
------------------------------------------------------------------------- */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__glow backdrop__glow--a" />
      <div className="backdrop__glow backdrop__glow--b" />
      <div className="backdrop__glow backdrop__glow--c" />
      <div className="backdrop__grid" />
      <div className="backdrop__vignette" />
      <div className="backdrop__grain" />
    </div>
  );
}

/* -------------------------------------------------------------------------
   Lightbox

   One modal used for both enlarged project screenshots and the certificate
   viewer. Handles Escape, backdrop click, scroll lock, focus return, and a
   simple focus trap.
------------------------------------------------------------------------- */
export function Lightbox({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);

    // Move focus into the dialog so keyboard users are not left behind it.
    const timer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>('button, a[href]')
        ?.focus({ preventScroll: true });
    }, 30);

    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.clearTimeout(timer);
      restoreFocusTo.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lightbox__panel" ref={panelRef}>
        <div className="lightbox__head">
          <div>
            <p className="lightbox__title">{title}</p>
            {subtitle && <p className="lightbox__sub">{subtitle}</p>}
          </div>
          <button className="lightbox__close" onClick={onClose} aria-label="Close">
            <X size={19} />
          </button>
        </div>

        <div className="lightbox__body">{children}</div>

        {footer && <div className="lightbox__foot">{footer}</div>}
      </div>
    </div>
  );
}
