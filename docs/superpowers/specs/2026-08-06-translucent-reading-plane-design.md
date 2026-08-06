# Translucent Reading Plane Design

**Date:** 2026-08-06

**Status:** Approved direction

## Objective

Restore the depth hierarchy from the original portfolio template without restoring its animated signal runtime. The static calibration contours remain as the background. A full-viewport translucent reading plane and faint grid sit above the contours and below all navigation and content.

The same pass fixes the fixed navigation rail collision visible at medium desktop widths.

## Design read

This is a research portfolio for recruiters and collaborators. It keeps an editorial dark identity with restrained, static materiality.

- Design variance: 6
- Motion intensity: 2
- Visual density: 4
- Implementation system: the existing React UMD and native CSS stack
- Redesign mode: preserve the approved Calibration Topography identity

## Layer architecture

The page uses four intentional visual layers:

1. **Base:** the existing off-black body color and faint warm radial variation.
2. **Background:** the static calibration contour field.
3. **Reading plane:** one fixed, full-viewport translucent near-black film with a very faint modular grid, light grain, and restrained backdrop blur.
4. **Content:** navigation, hero, sections, cards, and article reader.

The reading plane is a single environmental surface. It must not become a card, acquire rounded corners, or restart for individual sections.

## Reading plane treatment

- Use the existing `.root::before` and `.reader-page::before` surface rather than adding another component.
- Apply a near-black translucent fill so text remains legible over every contour position.
- Add a faint grid using two CSS linear gradients. Grid lines use the existing warm-neutral palette at very low opacity.
- Use a small backdrop blur and restrained saturation. The effect should soften contours, not look like glassmorphism.
- Preserve the current fixed grain overlay at low opacity.
- Keep the center reading area quieter than the outer edges.
- Do not add glow, animated opacity, scroll coupling, or continuous JavaScript work.
- Provide a solid near-black fallback when reduced transparency is requested or backdrop filtering is unavailable.
- Hide the decorative field and reading-plane texture in forced-colors mode.

The grid is deliberate because the user requested the original template's spatial structure. It remains subordinate to the typography and should become noticeable only after looking at the background for a moment.

## Responsive navigation

- Keep the fixed left rail only when the viewport is wider than 1280px.
- At 1280px and below, switch to the existing horizontal navigation treatment.
- The horizontal list scrolls internally when needed and never increases page width.
- Preserve all navigation labels, anchors, active states, focus behavior, and mobile layout.

This threshold resolves the measured collision at an 1111px content viewport, where the 200px rail overlaps the hero by 93px.

## Shared behavior

The portfolio and article reader use the same surface treatment so moving between them does not feel like a theme change. The article reader retains its reading progress behavior and table of contents.

## Accessibility and performance

- Maintain the existing focus-visible styling and skip links.
- Maintain WCAG contrast through a stable translucent fill, not through text shadow.
- Keep all visual effects pointer-inert.
- Honor `prefers-reduced-motion`, `prefers-reduced-transparency`, and forced-colors behavior.
- Use only fixed pseudo-elements and CSS backgrounds. No new DOM, dependencies, event listeners, animation loops, or runtime state.

## Verification

- Add a source pre-flight assertion for the 1280px rail breakpoint and the translucent reading-plane selectors.
- Verify the sidebar and hero do not overlap at 1111px.
- Inspect the portfolio at 375px, 768px, 1111px, 1280px, and 1440px.
- Inspect one article at mobile and desktop widths.
- Confirm there is no page-level horizontal overflow or browser console error.
- Confirm the grid remains faint and text stays legible over both contour regions.

## Out of scope

- Removing the calibration contours
- Using pure black
- Restoring animated light bars
- Adding per-section glass cards
- Changing portfolio content, navigation labels, anchors, typography, or information architecture

