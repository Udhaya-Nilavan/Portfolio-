/**
 * Project screenshots.
 *
 * Every entry here is a real screenshot supplied by Udhaya Nilavan and matched
 * to an existing project id from `projects.ts`. Nothing is generated, mocked up,
 * or stand-in. The current project set has a supplied screenshot for each
 * featured project, including Portfolio Studio.
 *
 * To add a screenshot later: drop the file in `public/projects/` and add one
 * line below, keyed by the project's existing `id`.
 */
export interface ProjectImage {
  src: string;
  /** Describes what is actually on screen — used as the alt text. */
  alt: string;
}

export const projectImages: Record<string, ProjectImage> = {
  'simple-image-filter': {
    src: '/projects/simple-image-filter.png',
    alt: 'The Interactive Image Filter App window, showing a photograph side by side with its filtered version above rows of filter buttons and brightness and blur sliders.',
  },
  'rainwater-harvesting-website': {
    src: '/projects/rainwater-harvesting-website.png',
    alt: 'The Rainwater Harvesting Project homepage, with a full-width photograph of dew on grass behind the heading "Conserve Water, Preserve the Planet".',
  },
  'wildlife-of-india': {
    src: '/projects/wildlife-of-india.png',
    alt: 'The Wildlife of India homepage, with a forest background, a search field, and a row of species cards showing a tiger, elephant, rhino and lion.',
  },
  'portfolio-studio-builder': {
    src: '/projects/portfolio-studio-builder.png',
    alt: 'Udhaya Nilavan personal portfolio website homepage showing the hero section with AI Assistant badge, name heading, and tagline.',
  },
};
