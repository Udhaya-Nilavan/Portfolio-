import React from 'react';
import {
  AppWindow,
  Atom,
  BarChart,
  Bot,
  Box3D,
  Brain,
  Code,
  Cpu,
  Database,
  Grid,
  Image,
  Layers,
  Link,
  Server,
  Shield,
  Sparkles,
  Workflow,
  Wrench,
} from './Icons';

type IconProps = { size?: number; className?: string };
type IconComponent = (p: IconProps) => React.JSX.Element;

/* -------------------------------------------------------------------------
   Recognizable Technology Vector SVG Logos
------------------------------------------------------------------------- */
const PythonLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M11.9 2c-5.2 0-4.8 2.2-4.8 2.2l.1 2.3h4.9v.7H5.2S2 6.8 2 12c0 5.2 2.8 5 2.8 5h1.7v-2.4s-.1-2.8 2.8-2.8h4.8s2.7 0 2.7-2.6V4.7S17.1 2 11.9 2zm-1.4 1.5a.9.9 0 110 1.8.9.9 0 010-1.8z"
      fill="currentColor"
    />
    <path
      d="M12.1 22c5.2 0 4.8-2.2 4.8-2.2l-.1-2.3h-4.9v-.7h6.9s3.2.4 3.2-4.8c0-5.2-2.8-5-2.8-5h-1.7v2.4s.1 2.8-2.8 2.8h-4.8s-2.7 0-2.7 2.6v4.5s-.3 2.7 4.9 2.7zm1.4-1.5a.9.9 0 110-1.8.9.9 0 010 1.8z"
      fill="currentColor"
      opacity="0.8"
    />
  </svg>
);

const JavaLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19c2 1 6 1 8 0s6 1 8 0" />
    <path d="M6 16c3 .8 7 .8 10 0" />
    <path d="M12 2v4c-1.5 1-2 2-2 4s1 2.5 2 3" />
    <path d="M16 5c-1 1-1.5 2-1.5 3.5s.8 2.5 1.5 3.5" />
    <path d="M8 8c-.5.8-.8 1.5-.8 2.3 0 1.5 1 2.2 1.8 2.7" />
  </svg>
);

const CLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M18.5 7.2A8 8 0 1018.5 16.8"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const CPPLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M11 6.5a6.5 6.5 0 100 11"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path d="M15 10v4M13 12h4M20 10v4M18 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const HTML5Logo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 3l1.8 17 6.2 1.8 6.2-1.8L20 3H4z" />
    <path d="M8 8h8M8 12h7l-.5 4.5-2.5.7-2.5-.7-.2-2" />
  </svg>
);

const CSS3Logo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 3l1.8 17 6.2 1.8 6.2-1.8L20 3H4z" />
    <path d="M16 8H8l.5 4h7l-.5 4.5-3 .8-3-.8-.2-2" />
  </svg>
);

const SQLLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
    <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
  </svg>
);

const NumPyLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 7l9-4 9 4-9 4-9-4z" />
    <path d="M3 7v10l9 4V11" />
    <path d="M21 7v10l-9 4" />
    <path d="M7 11.5l5 2 5-2" />
  </svg>
);

const ScikitLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="8" r="3.5" />
    <circle cx="16" cy="16" r="3.5" />
    <path d="M11 9.5l3.5 3.5M6 17l4-2M14 7l4 2" />
  </svg>
);

const OpenCVLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="7" r="4" />
    <circle cx="7" cy="16" r="4" />
    <circle cx="17" cy="16" r="4" />
  </svg>
);

const TableauLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="11" y="2" width="2" height="6" rx="1" />
    <rect x="9" y="4" width="6" height="2" rx="1" />
    <rect x="11" y="16" width="2" height="6" rx="1" />
    <rect x="9" y="18" width="6" height="2" rx="1" />
    <rect x="2" y="11" width="6" height="2" rx="1" />
    <rect x="4" y="9" width="2" height="6" rx="1" />
    <rect x="16" y="11" width="6" height="2" rx="1" />
    <rect x="18" y="9" width="2" height="6" rx="1" />
  </svg>
);

const PowerBILogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="4" y="12" width="3.5" height="9" rx="1.5" opacity="0.65" />
    <rect x="10.25" y="7" width="3.5" height="14" rx="1.5" opacity="0.85" />
    <rect x="16.5" y="3" width="3.5" height="18" rx="1.5" />
  </svg>
);

const DockerLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14c0 3.3 2.7 6 6 6h7c2.8 0 5-2.2 5-5 0-.5-.1-1-.2-1.5C21 12 19 12 18 13c-1.5-2-4-2-6-1v2H4z" />
    <rect x="6" y="10" width="2" height="2" />
    <rect x="9" y="10" width="2" height="2" />
    <rect x="12" y="10" width="2" height="2" />
    <rect x="9" y="7" width="2" height="2" />
  </svg>
);

const LangChainLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 17H7A5 5 0 017 7h2" />
    <path d="M15 7h2a5 5 0 010 10h-2" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const OllamaLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 3v4M16 3v4" />
    <rect x="6" y="7" width="12" height="13" rx="4" />
    <circle cx="9.5" cy="12.5" r="1" fill="currentColor" />
    <circle cx="14.5" cy="12.5" r="1" fill="currentColor" />
    <path d="M11 16h2" />
  </svg>
);

const GroqLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const N8nLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="12" cy="18" r="3" />
    <path d="M8.5 7.5L10 15M15.5 7.5L14 15M9 6h6" />
  </svg>
);

const CrewAILogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="6" r="3" />
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <path d="M12 9v4M6 14l4-2M18 14l-4-2" />
  </svg>
);

const AutoGenLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="7" height="7" rx="1.5" />
    <rect x="14" y="13" width="7" height="7" rx="1.5" />
    <path d="M10 7.5h7a2 2 0 012 2V13M14 16.5H7a2 2 0 01-2-2V11" />
  </svg>
);

const FlaskLogo: IconComponent = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 2v5L4.5 18A3 3 0 007 22h10a3 3 0 002.5-4L14 7V2h-4z" />
    <path d="M8.5 15h7" />
  </svg>
);

/**
 * Maps a technology name to an authentic, recognizable SVG vector mark.
 * Case-insensitively matched against the exact strings from projects.ts and skills.ts.
 */
const TECH_ICONS: Record<string, IconComponent> = {
  // Programming Languages
  python: PythonLogo,
  java: JavaLogo,
  c: CLogo,
  'c++': CPPLogo,
  typescript: Code,
  javascript: Code,
  html: HTML5Logo,
  html5: HTML5Logo,
  css: CSS3Logo,
  css3: CSS3Logo,

  // Databases & Numerical
  sql: SQLLogo,
  mysql: SQLLogo,
  'ms sql server': SQLLogo,
  postgresql: Database,
  pgvector: Database,
  numpy: NumPyLogo,
  'vector databases': Database,
  embeddings: Grid,

  // Data Science & Machine Learning
  'data science': Database,
  'data analysis': BarChart,
  'data modeling': Database,
  'machine learning': Brain,
  'scikit-learn': ScikitLogo,
  'model evaluation': Brain,

  // Generative AI & LLMs
  'generative ai': Sparkles,
  llms: Sparkles,
  'prompt engineering': Sparkles,
  rag: Layers,
  langchain: LangChainLogo,
  ollama: OllamaLogo,
  groq: GroqLogo,
  'ai apis': Sparkles,

  // Agentic AI & Orchestration
  'agentic ai': Cpu,
  'ai agents': Bot,
  'ai agent memory': Brain,
  'tool calling': Wrench,
  'agent evaluation': Shield,
  'api integration': Link,
  crewai: CrewAILogo,
  autogen: AutoGenLogo,
  'chatgpt agent architectures': Bot,

  // Automation & Workflows
  n8n: N8nLogo,
  'make.com': Workflow,

  // Imaging & UI
  opencv: OpenCVLogo,
  pillow: Image,
  tkinter: AppWindow,

  // BI & Visual Analytics
  tableau: TableauLogo,
  'power bi': PowerBILogo,
  'data visualization': BarChart,

  // Web, Runtime & Platform
  react: Atom,
  vite: Sparkles,
  express: Server,
  flask: FlaskLogo,
  docker: DockerLogo,
  'three.js': Box3D,
  'aos library': Sparkles,
  'ci/cd pipelines': Workflow,
  'github actions': Workflow,
  git: Code,
  algorithms: Code,
};

export function techIcon(name: string): IconComponent {
  return TECH_ICONS[name.trim().toLowerCase()] ?? Code;
}

/** A technology badge with its authentic logo mark. */
export function TechBadge({
  name,
  variant = 'default',
}: {
  name: string;
  variant?: 'default' | 'accent';
}) {
  const Icon = techIcon(name);
  return (
    <span className={variant === 'accent' ? 'tag tag--accent' : 'tag'}>
      <Icon size={14} className="tag__icon" />
      {name}
    </span>
  );
}
