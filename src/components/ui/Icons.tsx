import type { SVGProps } from 'react';

/**
 * Hand-rolled icon set.
 *
 * Written inline rather than pulled from an icon package: it keeps the
 * portfolio's runtime dependencies to React alone, so `npm install` can never
 * break the build over an icon-library version, and it keeps stroke weight
 * consistent with the type.
 *
 * All icons are decorative — they sit next to a text label or inside a control
 * that carries its own accessible name — so they are aria-hidden by default.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Svg>
);

export const ArrowUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </Svg>
);

export const Download = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 21h16" />
  </Svg>
);

export const Eye = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const Github = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </Svg>
);

export const Linkedin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v1.8A6 6 0 0 1 16 8Z" />
    <rect x="2" y="9" width="4" height="12" rx="0.5" />
    <circle cx="4" cy="4" r="2" />
  </Svg>
);

export const Mail = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3.5 7 7.4 5.3a2 2 0 0 0 2.2 0L20.5 7" />
  </Svg>
);

export const Phone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.2 3.5h3l1.5 4-2 1.3a12 12 0 0 0 5.5 5.5l1.3-2 4 1.5v3a1.9 1.9 0 0 1-2.1 1.9A16.4 16.4 0 0 1 4.3 5.6 1.9 1.9 0 0 1 6.2 3.5Z" />
  </Svg>
);

export const WhatsApp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 20.5 4.9 16a8 8 0 1 1 3.1 3.1l-4.5 1.4Z" />
    <path d="M9 9.4c.2 1.6 2.2 4.2 4 4.7.8.2 1.4-.2 1.8-.8l-1.7-1.2-.9.7a5.6 5.6 0 0 1-1.9-2l.8-.8-1-1.8c-.7.3-1.2.9-1.1 1.2Z" />
  </Svg>
);

export const MapPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const FileText = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 2.5H7.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7l-4.5-4.5Z" />
    <path d="M14 2.5V7h4.5" />
    <path d="M9 13h6M9 16.5h4" />
  </Svg>
);

export const Award = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m8.5 13.8-1 7.2 4.5-2.4 4.5 2.4-1-7.2" />
  </Svg>
);

export const GraduationCap = (p: IconProps) => (
  <Svg {...p}>
    <path d="m2.5 8.5 9.5-4.3 9.5 4.3-9.5 4.3-9.5-4.3Z" />
    <path d="M6.5 10.5v4.8c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-4.8" />
    <path d="M21 9v5" />
  </Svg>
);

export const Sun = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </Svg>
);

export const Moon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Svg>
);

export const X = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);

export const Menu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const Camera = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 8.5h3l1.5-2.5h8l1.5 2.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Svg>
);

export const Copy = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
  </Svg>
);

export const Flip = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8.5A5.5 5.5 0 0 1 8.5 3H15" />
    <path d="m12.5 5.5 2.8 2.8-2.8 2.8" />
    <path d="M21 15.5a5.5 5.5 0 0 1-5.5 5.5H9" />
    <path d="m11.5 18.5-2.8-2.8 2.8-2.8" />
  </Svg>
);

export const Layers = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
    <path d="m3 12.5 9 4.5 9-4.5" />
    <path d="m3 16.8 9 4.5 9-4.5" />
  </Svg>
);

export const Cpu = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
    <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" />
    <path d="M10 3v3.5M14 3v3.5M10 17.5V21M14 17.5V21M3 10h3.5M3 14h3.5M17.5 10H21M17.5 14H21" />
  </Svg>
);

export const Database = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="12" cy="6" rx="7.5" ry="3" />
    <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
    <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
  </Svg>
);

export const Brain = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5.5a3 3 0 0 0-5.7-1.3A3 3 0 0 0 4 9.6a3.2 3.2 0 0 0 .6 5.2A3 3 0 0 0 9.4 19 2.7 2.7 0 0 0 12 20.5Z" />
    <path d="M12 5.5a3 3 0 0 1 5.7-1.3A3 3 0 0 1 20 9.6a3.2 3.2 0 0 1-.6 5.2A3 3 0 0 1 14.6 19 2.7 2.7 0 0 1 12 20.5Z" />
  </Svg>
);

export const Sparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 1.7 4.6L18 9.3l-4.3 1.7L12 15.6l-1.7-4.6L6 9.3l4.3-1.7L12 3Z" />
    <path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
  </Svg>
);

export const Code = (p: IconProps) => (
  <Svg {...p}>
    <path d="m8.5 8-4.5 4 4.5 4" />
    <path d="m15.5 8 4.5 4-4.5 4" />
    <path d="m13.5 4.5-3 15" />
  </Svg>
);

export const BarChart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h16" />
    <path d="M7 20v-6M12 20V6M17 20v-9" />
  </Svg>
);

export const Wrench = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15.5 3.5a5 5 0 0 0-5.9 6.4L3 16.6 6.4 20l6.7-6.6a5 5 0 0 0 6.4-5.9l-3 3-2.9-.8-.8-2.9 3-3Z" />
  </Svg>
);

export const Calendar = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Svg>
);

export const Building = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V21" />
    <path d="M14 10h4.5A1.5 1.5 0 0 1 20 11.5V21" />
    <path d="M2.5 21h19M7.5 8h3M7.5 12h3M7.5 16h3M17 14h0M17 17.5h0" />
  </Svg>
);

export const Shield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.8 20 6v6c0 4.6-3.3 8.2-8 9.3-4.7-1.1-8-4.7-8-9.3V6l8-3.2Z" />
    <path d="m8.8 12 2.2 2.2 4.2-4.4" />
  </Svg>
);

export const Upload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 21h16" />
  </Svg>
);

export const Trash = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6.5h16" />
    <path d="M9 6.5V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8v1.7" />
    <path d="M6 6.5 7 20a1.5 1.5 0 0 0 1.5 1.4h7A1.5 1.5 0 0 0 17 20l1-13.5" />
  </Svg>
);

export const Atom = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="2" />
    <ellipse cx="12" cy="12" rx="9.5" ry="4" />
    <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)" />
  </Svg>
);

export const Server = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path d="M7 7.5h0M7 16.5h0" />
  </Svg>
);

export const Palette = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-3.9-4-7.3-9-7.3Z" />
    <circle cx="7.8" cy="11.5" r="1" />
    <circle cx="10.2" cy="7.8" r="1" />
    <circle cx="15" cy="8.6" r="1" />
  </Svg>
);

export const AppWindow = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <path d="M3 9h18" />
    <path d="M6.5 6.7h0M9 6.7h0" />
  </Svg>
);

export const Grid = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Svg>
);

export const Link = (p: IconProps) => (
  <Svg {...p}>
    <path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5" />
    <path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5" />
  </Svg>
);

export const Box3D = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 2.8 8 4.3v9.8l-8 4.3-8-4.3V7.1l8-4.3Z" />
    <path d="m4 7.1 8 4.3 8-4.3" />
    <path d="M12 11.4V21" />
  </Svg>
);

export const Terminal = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
    <path d="m7 10 2.5 2.5L7 15" />
    <path d="M12.5 15.5H17" />
  </Svg>
);

export const Workflow = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3.5" width="6.5" height="6" rx="1.5" />
    <rect x="14.5" y="14.5" width="6.5" height="6" rx="1.5" />
    <path d="M6.25 9.5v5a3 3 0 0 0 3 3h5.25" />
  </Svg>
);

export const Bot = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 4.5V8" />
    <circle cx="12" cy="3.4" r="1.2" />
    <path d="M9 13h0M15 13h0" />
    <path d="M9.5 16.5h5" />
  </Svg>
);

export const Coffee = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8h13v6.5a4.5 4.5 0 0 1-4.5 4.5h-4A4.5 4.5 0 0 1 4 14.5V8Z" />
    <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M7 3.5v2M11 3.5v2" />
  </Svg>
);

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
);

export const Image = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L16 17" />
    <path d="m14 15 1.6-1.6a2 2 0 0 1 2.8 0L20.5 15" />
  </Svg>
);

export const ExternalLink = ArrowUpRight;

/**
 * HackerRank brand mark — the characteristic 'hk' enclosed letterform.
 * Rendered as a standalone SVG (not using the Svg wrapper since it uses
 * a non-24 viewBox and custom fill colors).
 */
export function HackerRankIcon({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="64" height="64" rx="8" fill="#2EC866" />
      <path
        d="M43.4 14H20.6C17 14 14 17 14 20.6v22.8C14 47 17 50 20.6 50h22.8C47 50 50 47 50 43.4V20.6C50 17 47 14 43.4 14z"
        fill="#2EC866"
      />
      <path
        d="M39.5 32L35 26.5V20h-6v6.5L24.5 32l4.5 5.5V44h6v-6.5L39.5 32z"
        fill="white"
      />
      <rect x="20" y="29.5" width="24" height="5" rx="2.5" fill="white" />
    </svg>
  );
}

/**
 * LeetCode brand mark — the characteristic bracket/puzzle shape.
 */
export function LeetCodeIcon({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="64" height="64" rx="8" fill="#FFA116" />
      <path
        d="M25 20L15 32l10 12h6l-9-12 9-12H25z"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M26 38h16"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M38 20l-7 12 7 12"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
