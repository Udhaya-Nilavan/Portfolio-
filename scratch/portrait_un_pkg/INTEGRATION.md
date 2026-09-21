# Portfolio portrait + UN logo integration

This folder is intentionally limited to the requested visual additions.

## Assets

- `assets/hero-portrait-blueprint.png`
  - The approved portrait + blueprint/doodle artwork supplied in the conversation.
- `assets/un-logo.png`
  - The supplied UN monogram.

## Files

- `HeroPortraitVisual.tsx`
  - Drop-in visual for the right side of the existing Hero section.
- `UNLogo.tsx`
  - Reusable UN logo component.
- `hero-portrait-visual.css`
  - Only styles for the new hero visual.
- `index.ts`
  - Exports both components.

## Minimal integration

1. Copy the folder contents into your original project's `src/components/portfolio-visual/`
   (or another component folder you already use).
2. Copy the two assets into the site's public assets folder so these paths work:

   `/assets/hero-portrait-blueprint.png`
   `/assets/un-logo.png`

3. In the existing Hero component, add:

   `import { HeroPortraitVisual } from '../components/portfolio-visual/HeroPortraitVisual';`

   Then place `<HeroPortraitVisual />` only in the existing RIGHT-SIDE portrait area.

4. Replace existing plain `UN` avatar/logo instances with:

   `import { UNLogo } from '../components/portfolio-visual/UNLogo';`

   and use:

   `<UNLogo size={38} />`

   Keep the surrounding container/classes so existing spacing/layout does not change.

## Critical scope rule

Do not replace the complete Hero component.

Do not change Hero text, CTA, navigation, chatbot, Floating 3D AI Assistant,
Skills, Certifications, Projects, or any other section.

The only visual additions are:

- the approved portrait + blueprint/doodles artwork on the existing Hero right side
- the supplied UN monogram wherever the current portfolio uses the existing UN mark

Do not stretch/crop the portrait artwork unexpectedly; preserve its aspect ratio.
