# Udhaya Nilavan — Personal Portfolio

The public-facing personal portfolio of **Udhaya Nilavan** (He/Him) — B.Tech Computer
Engineering student at Lovely Professional University, working in Data Science,
Machine Learning, Generative AI and Agentic AI.

This is a standalone project. **Portfolio Studio is a separate product** and ships in
its own repository (`UDHAYA-NILAVAN-PORTFOLIO-STUDIO`). Nothing in this project imports
from, links to, or depends on the Studio.

---

## Running it

```bash
npm install
npm run dev        # development server
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
npm run typecheck  # types only
```

Requires Node 18 or newer.

---

## Where your content lives

All personal content sits in `src/data/`. These files were carried over **byte-for-byte**
from the original project and are the single source of truth. Editing one of these files
updates the site everywhere that fact appears — no copy is kept anywhere else.

| File                   | Holds                                                    |
| ---------------------- | -------------------------------------------------------- |
| `personal.ts`          | Name, headline, About copy, status, location, contact, CV path, core domains |
| `projects.ts`          | All four projects, with problem / solution / flow / results |
| `skills.ts`            | Seven skill groups                                        |
| `certifications.ts`    | Four credentials, with dates, credential IDs and file paths |
| `education.ts`         | Lovely Professional University record                     |
| `industryTraining.ts`  | iHUB DivyaSampark, IIT Roorkee × Masai School program      |
| `socials.ts`           | GitHub, LinkedIn, email, WhatsApp, phone                  |
| `sections.ts`          | Which sections exist and their order (drives the navigation) |
| `projectImages.ts`     | Maps project screenshots to project ids                   |

### Adding your profile photo

Save your photo as:

```
public/profile/udhaya-nilavan.jpg
```

It is picked up automatically on the next load — no code change needed. Until that file
exists, the hero shows a neutral monogram placeholder (never a certificate image).

You can also click the photo frame on the live site to try a photo. That version is stored
in your browser only (localStorage) and is not committed — useful for previewing a shot
before you commit it.

### Adding a project screenshot

1. Drop the image in `public/projects/`.
2. Add one line to `src/data/projectImages.ts`, keyed by the project's existing `id`.

Projects with no screenshot get a typographic cover card rather than a placeholder that
pretends to be a screenshot. Portfolio Studio currently has no screenshot, so it uses that
cover.

### Replacing the CV

Overwrite `public/resume/Udhaya-Nilavan-CV3.pdf`, or change `resumeUrl` in
`src/data/personal.ts` if you rename the file.

---

## Adding or reordering sections

`src/data/sections.ts` is the single registry. It drives the floating navigation, the
mobile menu, active-section detection and the footer sitemap at once. To add a section:

1. Add an entry to `SECTIONS`.
2. Render the matching component in `src/App.tsx` with a `<section id="...">` whose id
   matches exactly.

Order in `SECTIONS` must match render order in `App.tsx`, since active-section detection
uses list position to break ties.

---

## Design system

### Colour

All colour lives in `src/styles/tokens.css` as semantic CSS custom properties, defined
twice — once under `[data-theme='light']`, once under `[data-theme='dark']`:

```
--bg  --bg-deep  --surface  --surface-elevated  --surface-sunken  --card-bg
--fg  --muted-fg  --subtle-fg  --on-accent
--accent-color  --accent-text  --accent-soft
--secondary-accent-color  --secondary-accent-text  --secondary-accent-soft
--violet  --violet-text  --violet-soft
--border-color  --border-strong
```

**The contrast rule:** never hard-code a text colour. Use one of the four foreground
tokens, and only on its matching surface. The distinction that prevents low-contrast
accent text:

- `--accent-color` is for **fills and strokes** (button backgrounds, borders, dots).
- `--accent-text` is for **accent-coloured text**. It is a darker value in the light theme
  and a lighter one in the dark theme, so accent text always clears AA.
- `--on-accent` is the only colour that goes **on top of** an accent fill.

Each foreground token in `tokens.css` carries its measured contrast ratio in a comment.

### Type

- **Sora** — display and headings.
- **Inter** — body.
- **JetBrains Mono** — restricted to genuine machine strings: credential IDs, CGPA,
  and counts. Not used decoratively.

### Motion language

Five related reveal patterns, so the page does not read as one animation repeated.
`<Reveal motion="...">` takes:

| Pattern | Used by |
| --- | --- |
| `clip` | every section heading — wipes up from its own box |
| `slide-left` / `slide-right` | project media and body (each enters from the side it sits on), About body vs. domain cards, timeline records |
| `scale` | certificate cards, the contact panel |
| `rise` | default; skill tabs, legend |

Plus two one-off moments: the hero name rises out of a clipping mask per line, and the
headline staggers word by word. Both are deliberately used once. Ambient background glows
drift on a 38–52s cycle — slow enough to register as depth, not movement.

Everything reveals once and never reverses; content that flickers back out on scroll-up
makes a page feel unstable.

`prefers-reduced-motion: reduce` is honoured three ways: a global CSS override, a
`.reduced-motion` class set on `<html>` from JS, and `Reveal` rendering visible
immediately rather than waiting on an observer.

---

## How the floating navigation works

`src/components/layout/FloatingNav.tsx`.

- **Fixed, never in flow.** The dock is `position: fixed` and the page reserves no space
  for it, so content scrolls underneath and is never pushed around.
- **Expanded near the top**, showing every section.
- **Collapses on scroll** to the brand mark, the section you are currently reading, the
  theme toggle and a "Get in touch" button.
- **Width is measured, not hard-coded.** Both states stay in the layout (the inactive one
  is `visibility: hidden`, which keeps it measurable but out of the tab order), and the
  pill animates between their real widths. It re-measures once webfonts load, so the pill
  does not jump when Sora arrives.
- **Hysteresis:** collapses past 220px, expands again under 120px. A single threshold
  makes the nav shudder when you rest near the boundary.
- **Below 880px** it becomes a compact bar with a full-screen menu sheet.

### Active-section detection

`useActiveSection` in `src/hooks/index.ts`. Deliberately not scroll-percentage based:

- One `IntersectionObserver` with a ten-step threshold ladder tracks how much of each
  section is visible.
- The winner is the section with the **greatest visible ratio**, ties broken by document
  order — rather than "whichever entry fired last", which is what causes flicker.
- `rootMargin` lifts the top edge below the nav, so a section is not marked active while
  still hidden behind it.
- A bottom-of-page clamp makes the last section win at the end of the document, since a
  short trailing section can never win on ratio alone.

---

## Accessibility

- Semantic landmarks: `header`, `main`, `nav`, `section`, `footer`, `article`.
- Every section is labelled by its heading via `aria-labelledby`.
- Skip-to-content link, visible on focus.
- Visible focus rings on every interactive element (`:focus-visible`).
- Certificate cards flip on hover **and** on a real button, so the back is reachable by
  keyboard and touch — the interaction is never hover-only.
- Modals: focus moves in on open, is trapped while open, returns to the trigger on close;
  Escape closes; background scroll is locked without layout shift.
- Hidden nav layers are removed from the tab order rather than just visually hidden.
- Images carry descriptive alt text; decorative images are `aria-hidden`.
- Touch targets are at least 44px.
- `aria-live` announces the current section as you scroll.

---

## Project structure

```
public/
  certificates/   Certificate images, badges and original PDFs
  projects/       Project screenshots
  resume/         Udhaya-Nilavan-CV3.pdf
  profile/        Drop udhaya-nilavan.jpg here
src/
  App.tsx             Section order
  main.tsx            Entry point
  data/               Your content (source of truth)
  types/              Shape of the data files
  theme/              Light/dark provider
  hooks/              Reduced motion, active section, scroll state, scroll lock
  components/
    layout/           FloatingNav, Footer
    ui/               Icons, Reveal, ProfilePhoto, SectionHeader, Lightbox, Backdrop
  sections/           Hero, About, Skills, Projects, Certifications, Education,
                      Training, Contact
  styles/             tokens.css, base.css, sections.css
```

## Icons

`src/components/ui/Icons.tsx` holds 49 hand-written stroke icons at a consistent 1.75
weight. `src/components/ui/TechIcons.tsx` maps technology names to them — `techIcon('RAG')`
returns a layers glyph, `techIcon('Tableau')` a bar chart.

These are meaning-bearing category icons, not brand logos: one consistent stroke language
across the page, and no redrawn trademarks. An unrecognised technology falls back to a
generic code glyph rather than being dropped, so adding a technology to `projects.ts` or
`skills.ts` still renders correctly — add a key to `TECH_ICONS` if you want a specific one.

## Dependencies

React and React DOM at runtime — nothing else. Icons are hand-written inline SVG and
styling is plain CSS with custom properties, so there is no icon library or CSS framework
whose version could break an install.
