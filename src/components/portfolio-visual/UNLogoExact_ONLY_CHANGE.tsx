type UNLogoExactProps = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * Udhaya Nilavan — Exact UN Navigation Mark
 *
 * PURPOSE:
 * Replace ONLY the existing blue circular "UN" avatar/mark.
 *
 * IMPORTANT:
 * - Transparent background
 * - Black monogram
 * - Vector SVG for crisp rendering at any size
 * - No external image / no blur
 * - No change to navigation behavior
 */
export function UNLogoExact({
  size = 42,
  className = '',
  title = 'UN',
}: UNLogoExactProps) {
  return (
    <span
      className={`un-logo-exact ${className}`}
      style={{
        width: size,
        height: size,
      }}
      role="img"
      aria-label={title}
    >
      <svg
        viewBox="0 0 58 58"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* U — left monogram */}
        <path
          d="M5.5 10.5V31.5C5.5 40.4 11.8 46 20.3 46C28.8 46 35.1 40.4 35.1 31.5V14.2"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* N — diagonal + right stem */}
        <path
          d="M29.5 13.5V46"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="round"
        />

        <path
          d="M29.5 13.5L48.7 38.7V9.5"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Small upper terminal that creates the same visual character */}
        <path
          d="M42.8 8.6H48.7"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="round"
        />
      </svg>

      <style>{`
        .un-logo-exact {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: #111111;
          line-height: 0;
          background: transparent;
          border: 0;
          padding: 0;
          margin: 0;
          overflow: visible;
        }

        .un-logo-exact svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
          shape-rendering: geometricPrecision;
        }

        @media (prefers-reduced-motion: reduce) {
          .un-logo-exact,
          .un-logo-exact svg {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}

export default UNLogoExact;
