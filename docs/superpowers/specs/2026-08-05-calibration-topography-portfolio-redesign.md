# Calibration Topography Portfolio Redesign

## Summary

This is a targeted redesign of Akhil Theerthala's applied-ML research portfolio. It preserves the site's content, information architecture, anchor IDs, article reader, profile image, dark-mode identity, and React plus vanilla CSS stack. The redesign replaces the animated light-bar background with a quiet calibration-topography field and removes performance-heavy scroll effects.

The page should feel like a precise research instrument: calm, legible, technically grounded, and personal. It should not resemble a sci-fi dashboard, a generic AI landing page, or a theme-template portfolio.

## Design read

Reading this as: a targeted redesign of an applied-ML research portfolio for recruiters, collaborators, and technical peers, with a calm scientific-instrument language built in native CSS.

- `DESIGN_VARIANCE: 6` - offset and editorial, but easy to scan.
- `MOTION_INTENSITY: 3` - interaction feedback and short reveals only.
- `VISUAL_DENSITY: 4` - enough detail for research content without feeling crowded.
- Redesign mode: preserve and evolve.

## Current-state audit

### Preserve

- The single-page information architecture and existing anchor IDs.
- The left navigation rail and its active-section feedback.
- The split hero with a real profile photograph.
- Newsreader for publication-oriented display text, Geist for body copy, and JetBrains Mono for technical metadata.
- The dark visual identity and warm accent already associated with the site.
- The publication, experience, education, project, writing, and contact content.
- The standalone writing page and Markdown reader behavior.

### Retire or improve

- Four animated SVG trails with unrelated accent colors.
- React state updates driven by a continuous `requestAnimationFrame` loop.
- Scroll-reactive blur and opacity variables.
- The direct `window` scroll handler used for continuous visual calculations.
- Blur-heavy reveal transitions that make content feel less crisp.
- Numbered section labels such as `§ 01` and `§ 02`.
- Three equal artifact cards and three equal featured-writing cards.
- Decorative timeline dots and excessive pill-shaped controls.
- Mixed corner-radius rules.
- Missing global keyboard focus treatment and skip navigation.
- Missing favicon and incomplete social metadata.

## Visual direction

### Signature background: Calibration Topography

The moving light trails will be replaced by a fixed, static field made from native CSS gradients. The field suggests uncertainty contours and calibration surfaces without depicting a chart literally.

- Two large, offset contour basins sit near the outer edges of the viewport.
- The central reading column remains mostly clear.
- Contours use the single site accent at very low opacity.
- A subtle fixed grain layer prevents digital flatness.
- No glow, particle animation, parallax, pointer tracking, or frame loop.
- The field becomes quieter on small screens and in forced-colors environments.
- Reduced-motion users receive the same static composition with no reveal movement.

The background is implemented with CSS pseudo-elements and repeating radial gradients. No image asset, canvas, WebGL layer, decorative SVG, or new dependency is required.

### Palette

The redesign retains a dark theme and recalibrates the existing warm accent into a single consistent system.

- Carbon: `#0d0f0e`
- Deep surface: `#121513`
- Raised surface: `#181c19`
- Rule: `#2a302c`
- Primary ink: `#edf0eb`
- Secondary ink: `#c8cdc6`
- Muted ink: `#929a92`
- Accent: `#c8a66b`

The accent is used for active navigation, links, focus rings, restrained metadata, and background contours. No secondary accent colors are introduced.

### Typography

Newsreader remains justified because the portfolio is centered on publications, research notes, and long-form technical writing. Geist remains the body and interface face. JetBrains Mono is limited to dates, compact metadata, and numeric values.

Changes:

- Section titles use tighter tracking and balanced wrapping.
- Body paragraphs remain below approximately 65 characters per line.
- Metadata uses sentence case where possible instead of universal uppercase.
- Tabular numerals are enabled for dates and metrics.
- The page title and visible copy use regular hyphens instead of em or en dashes.

### Shape and surfaces

- Surfaces use a 4px radius.
- Portrait media may use an 8px radius because it is a media frame, not an interface surface.
- Buttons, chips, and tags no longer use full pills.
- Cards are used only where grouping benefits comprehension.
- Shadows are tinted toward the dark green-charcoal background.

## Layout changes

### Hero

The split hero remains. Spacing and type scale are tuned so the name, role, research statement, and both actions fit in the initial desktop viewport. The portrait keeps its real photographic role and receives a quieter frame treatment.

### Section headings

Section-number labels are removed. Each section begins with one clear title and, where useful, one short supporting sentence stacked below it.

### Publications

The year and publication content remain in a two-column editorial layout. Venue metadata is simplified, tags become compact rectangular labels, and link focus states are strengthened.

### Experience and education

Decorative timeline dots are removed. Dates remain in a stable left column while roles use spacing and a single dividing rule for hierarchy.

### Research artifacts

The three equal card columns become an asymmetric editorial composition. The first artifact receives more space because it carries real usage metrics. The remaining two artifacts are compact supporting entries. All three remain directly clickable and keyboard accessible.

### Writings

Featured writing uses one primary article and two smaller supporting articles instead of three equal cards. The archive keeps its grouped structure, with clearer hover, focus, and expanded states.

### Navigation and footer

The existing rail labels and anchor IDs remain unchanged. The active item retains a semantic tick. The footer keeps a single contact action and avoids duplicating the hero's contact-button treatment.

## Motion and interaction

- Remove the background animation loop entirely.
- Remove scroll-linked blur and frosting changes.
- Use IntersectionObserver for active-section tracking and one-time content reveals.
- Reveals animate only opacity and a small vertical translation for 350 to 450ms.
- Interactive controls receive hover, visible `:focus-visible`, and pressed feedback.
- `prefers-reduced-motion: reduce` removes reveal transforms and smooth scrolling.
- No new animation library is added.

Each remaining animation communicates hierarchy or interaction feedback. Nothing moves solely as decoration.

## Accessibility

- Add a skip-to-content link before the React root.
- Give the main content a stable `id` target.
- Provide a consistent, high-contrast focus ring.
- Preserve meaningful image alt text.
- Maintain logical keyboard order and visible active navigation.
- Verify text contrast against the recalibrated surfaces.
- Respect reduced motion, forced colors, and narrow viewports.
- Keep touch targets near 44px where controls are likely to be used on mobile.

## Performance

- Delete the frame-by-frame React render path.
- Delete continuous scroll calculations for visual effects.
- Keep the background CSS-only and fixed behind the isolated page layer.
- Animate only transform and opacity.
- Avoid new runtime dependencies.
- Retain reserved portrait dimensions to prevent layout shift.

## Metadata and site chrome

- Add a favicon based on the existing profile image.
- Add Open Graph title, description, type, and image metadata.
- Keep current URLs and page titles semantically equivalent.
- Do not add analytics, cookies, legal copy, routes, or forms as part of this visual redesign.

## Responsive behavior

- At 1440px, the rail and editorial content coexist without overlap.
- At 1024px, navigation becomes the existing horizontal header treatment.
- Below 768px, every asymmetric grid collapses to one column.
- At 375px, controls do not overflow, button labels stay on one line, and archive metadata simplifies.
- Background contours reduce in contrast and scale on mobile.

## Verification plan

1. Parse all JavaScript data files and compile the JSX through the same Babel-compatible path used by the site.
2. Run whitespace and syntax checks.
3. Search for removed signal-layer code, continuous frame loops, homepage em dashes, numbered section labels, and multi-accent trail colors.
4. Verify all navigation targets and local assets exist.
5. Test keyboard focus, reduced motion, and touch-sized controls.
6. Inspect rendered screenshots at 375px, 768px, 1024px, and 1440px.
7. Run an accessibility and performance smoke check where local browser tooling permits.
8. Start a localhost server and leave the preview running for user exploration.

## Out of scope

- Rewriting research content or changing claims.
- Changing route structure, anchor IDs, or primary navigation labels.
- Migrating away from the existing React plus Babel setup.
- Adding a CMS, build system, animation framework, analytics, or contact form.
- Replacing the profile photograph.
