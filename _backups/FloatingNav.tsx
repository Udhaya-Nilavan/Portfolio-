import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SECTIONS } from '../../data/sections';
import { personalData } from '../../data/personal';
import { useActiveSection, useMediaQuery, useScrollLock, useScrollState } from '../../hooks';
import { Download, Menu, X } from '../ui/Icons';
import './FloatingNav.css';

const SECTION_IDS = SECTIONS.map(s => s.id);

/* -------------------------------------------------------------------------
   Scroll progress hairline
------------------------------------------------------------------------- */
function ScrollProgress({ progress }: { progress: number }) {
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

/* -------------------------------------------------------------------------
   FloatingNav
------------------------------------------------------------------------- */
export function FloatingNav() {
  const { collapsed, progress } = useScrollState(220, 120);
  const activeId = useActiveSection(SECTION_IDS, 96);
  const isCompact = useMediaQuery('(max-width: 880px)');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [pillWidth, setPillWidth] = useState<number | undefined>(undefined);

  const expandedRef = useRef<HTMLDivElement>(null);
  const collapsedRef = useRef<HTMLDivElement>(null);

  const activeSection = SECTIONS.find(s => s.id === activeId) ?? SECTIONS[0];

  /* --- Width morph -------------------------------------------------------
     Both layers stay in the layout (the inactive one is visibility:hidden),
     so we can measure the target width and animate the pill between the two.
     Measuring beats hard-coded widths: the label length changes per section
     and per font load. */
  useLayoutEffect(() => {
    if (isCompact) return;
    const measure = () => {
      const node = collapsed ? collapsedRef.current : expandedRef.current;
      if (node) setPillWidth(node.scrollWidth);
    };
    measure();

    // Re-measure once webfonts settle, otherwise the pill is sized to the
    // fallback face and jumps when Sora/Inter arrive.
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measure).catch(() => undefined);
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [collapsed, isCompact, activeId]);

  /* --- Mobile sheet: close on Escape, lock background scroll ------------ */
  useScrollLock(sheetOpen);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheetOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheetOpen]);

  useEffect(() => {
    if (!isCompact) setSheetOpen(false);
  }, [isCompact]);

  /* --- Compact / mobile -------------------------------------------------- */
  if (isCompact) {
    return (
      <>
        <ScrollProgress progress={progress} />

        <header className="nav-mobile">
          <a className="nav-brand" href="#home" aria-label={`${personalData.name} — back to top`}>
            {personalData.initials}
          </a>

          <div className="nav-mobile__current">
            <span className="nav-current__dot" aria-hidden="true" />
            <span key={activeSection.id} className="nav-current__label">
              {activeSection.label}
            </span>
          </div>

          <button
            className="nav-icon-btn"
            onClick={() => setSheetOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sheetOpen}
            aria-haspopup="dialog"
          >
            <Menu size={19} />
          </button>
        </header>

        {sheetOpen && (
          <div
            className="nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            onClick={e => {
              if (e.target === e.currentTarget) setSheetOpen(false);
            }}
          >
            <div className="nav-sheet__panel">
              <div className="nav-sheet__head">
                <span className="nav-sheet__title">{personalData.name}</span>
                <button
                  className="nav-icon-btn"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close navigation menu"
                  autoFocus
                >
                  <X size={19} />
                </button>
              </div>

              <nav aria-label="Sections">
                {SECTIONS.map((section, i) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="nav-sheet__link"
                    aria-current={section.id === activeId ? 'true' : undefined}
                    onClick={() => setSheetOpen(false)}
                  >
                    <span>{section.label}</span>
                    <span className="nav-sheet__index mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </a>
                ))}
              </nav>

              <div className="nav-sheet__foot">
                <a
                  className="btn btn--primary"
                  href={personalData.resumeUrl}
                  download
                  onClick={() => setSheetOpen(false)}
                >
                  <Download size={16} className="btn__icon" />
                  Download CV
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /* --- Desktop ----------------------------------------------------------- */
  return (
    <>
      <ScrollProgress progress={progress} />

      <div className="nav-dock">
        <nav className="nav-pill" aria-label="Primary" style={{ width: pillWidth }}>
          {/* Expanded state — full section list */}
          <div
            className="nav-layer nav-layer--expanded"
            data-active={!collapsed}
            ref={expandedRef}
            aria-hidden={collapsed}
          >
            <a
              className="nav-brand"
              href="#home"
              aria-label={`${personalData.name} — back to top`}
              tabIndex={collapsed ? -1 : 0}
            >
              {personalData.initials}
            </a>

            {SECTIONS.map(section => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="nav-link"
                aria-current={section.id === activeId ? 'true' : undefined}
                tabIndex={collapsed ? -1 : 0}
              >
                {section.label}
              </a>
            ))}

            <span className="nav-divider" aria-hidden="true" />

            <a
              className="nav-cta"
              href="#contact"
              tabIndex={collapsed ? -1 : 0}
            >
              Get in touch
            </a>
          </div>

          {/* Collapsed state — compact floating pill showing active section */}
          <div
            className="nav-layer nav-layer--collapsed"
            data-active={collapsed}
            ref={collapsedRef}
            aria-hidden={!collapsed}
          >
            <a
              className="nav-brand"
              href="#home"
              aria-label={`${personalData.name} — back to top`}
              tabIndex={collapsed ? 0 : -1}
            >
              {personalData.initials}
            </a>

            <span className="nav-current">
              <span className="nav-current__dot" aria-hidden="true" />
              <span key={activeSection.id} className="nav-current__label">
                {activeSection.label}
              </span>
            </span>

            <span className="nav-divider" aria-hidden="true" />

            <a
              className="nav-cta"
              href="#contact"
              tabIndex={collapsed ? 0 : -1}
            >
              Get in touch
            </a>
          </div>
        </nav>
      </div>

      {/* Announce the current section to assistive tech without shouting it
          on every pixel of scroll. */}
      <div className="visually-hidden" aria-live="polite">
        {`Current section: ${activeSection.label}`}
      </div>
    </>
  );
}
