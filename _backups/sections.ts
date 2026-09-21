/**
 * The sections that actually exist on this site, in document order.
 *
 * This is the single source of truth for: the floating navigation, the mobile
 * sheet, active-section detection, and the footer sitemap. Adding a section
 * means adding it here AND rendering it in App.tsx with a matching id.
 *
 * Nothing is listed here that the portfolio does not actually render.
 */
export interface SectionMeta {
  id: string;
  label: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'training', label: 'Training' },
  { id: 'contact', label: 'Contact' },
];
