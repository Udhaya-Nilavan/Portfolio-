export interface PersonalInfo {
  name: string;
  initials: string;
  primaryRole: string;
  secondaryRoles: string[];
  statusBadge: {
    active: boolean;
    label: string;
  };
  shortStatement: string;
  aboutIntro: string;
  aboutPhilosophy: string;
  location: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  resumeUrl: string;
  coreDomains: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: {
    name: string;
    proficiencyHint?: string;
    isPrimary?: boolean;
    related?: string[];
    usedFor?: string;
    context?: string;
    selfAssessedPct?: number;
  }[];
}

export interface Project {
  id: string;
  title: string;
  category: 'ai-llm' | 'machine-learning' | 'data-science' | 'software-engineering';
  categoryLabel: string;
  shortDescription: string;
  problem: string;
  solution: string;
  architectureFlow: {
    step: string;
    detail: string;
  }[];
  keyResults: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  duration: string;
  type: 'Full-time' | 'Internship' | 'Research' | 'Program' | 'Contract';
  description: string;
  responsibilities: string[];
  technologies: string[];
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  /** Distinguishes professional certifications from completion/merit certificates. */
  kind?: 'certification' | 'certificate';
  title: string;
  issuer: string;
  date: string;
  validUntil?: string;
  credentialId?: string;
  verificationUrl?: string;
  badgeImage?: string;
  certificateImage?: string;
  certificateFile?: string;
  companyIcon?: string;
  summary?: string;
  whatIlearned?: string[];
  howEarned?: string;
  topics: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  standing?: string;
  coursework: string[];
  highlights: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  category: string;
  link?: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  whatsapp?: string;
  phone?: string;
  kaggle?: string;
  huggingface?: string;
}
