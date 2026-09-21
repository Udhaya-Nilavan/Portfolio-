import './hero-portrait-visual.css';

/**
 * Approved right-side portrait visual for the existing portfolio hero.
 *
 * This intentionally uses the supplied approved reference image as one visual
 * asset so the portrait, blueprint doodles, labels, arrow, and opportunity card
 * remain visually consistent.
 *
 * IMPORTANT:
 * This component is only the HERO PORTRAIT VISUAL.
 * It does not replace the existing Hero text, navigation, chatbot, etc.
 */
type HeroPortraitVisualProps = {
  className?: string;
  alt?: string;
};

export function HeroPortraitVisual({
  className = '',
  alt = 'Udhaya Nilavan professional portfolio portrait',
}: HeroPortraitVisualProps) {
  return (
    <figure className={`hero-portrait-visual ${className}`}>
      <img
        src="/assets/hero-portrait-blueprint.png"
        alt={alt}
        className="hero-portrait-visual__image"
        draggable={false}
      />
    </figure>
  );
}

export default HeroPortraitVisual;
