# Translucent Reading Plane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved full-viewport translucent reading plane and faint grid between the static contour background and page content, while preventing the fixed navigation rail from overlapping the hero at medium desktop widths.

**Architecture:** Extend the existing shared CSS surface on `.root::before` and `.reader-page::before`; do not add DOM or runtime state. Move all rail-dependent responsive rules from 1100px to 1280px, then verify source invariants and real browser geometry.

**Tech Stack:** React 18 UMD, Babel Standalone, native CSS, Node.js built-ins, browser inspection.

## Global Constraints

- Preserve the existing portfolio content, anchors, typography, accent, and static calibration contours.
- Use one full-viewport reading plane, not per-section panels or cards.
- Add no dependencies, DOM elements, animation loops, scroll listeners, or runtime state.
- Keep the background off-black; do not use pure black.
- Keep the grid and blur subordinate to the typography.
- Apply the same treatment to the portfolio and article reader.
- Preserve reduced-motion, reduced-transparency, and forced-colors fallbacks.

---

### Task 1: Lock the surface and breakpoint requirements

**Files:**
- Modify: `scripts/verify-redesign.mjs`
- Modify: `portfolio.css`

**Interfaces:**
- Consumes: the existing CSS source pre-flight and shared surface selectors.
- Produces: source assertions for the reading-plane tokens, blur, grid, transparency fallback, and 1280px responsive threshold.

- [ ] **Step 1: Add failing source assertions**

Extend `scripts/verify-redesign.mjs` with these checks:

```js
assert.match(css, /--surface-fill:/);
assert.match(css, /--surface-grid-x:/);
assert.match(css, /--surface-grid-y:/);
assert.match(
  css,
  /\.root::before,[\s\S]*?\.reader-page::before[\s\S]*?backdrop-filter:\s*blur\(7px\)/,
);
assert.match(css, /@media\s*\(prefers-reduced-transparency:\s*reduce\)/);
assert.match(css, /@media\s*\(max-width:\s*1280px\)/);
assert.doesNotMatch(css, /@media\s*\(max-width:\s*1100px\)/);
```

- [ ] **Step 2: Run the pre-flight and confirm it fails**

Run:

```bash
node scripts/verify-redesign.mjs
```

Expected: failure because the surface tokens, 7px blur, reduced-transparency rule, and 1280px breakpoint do not exist yet.

- [ ] **Step 3: Add semantic surface tokens**

Add to `:root` in `portfolio.css`:

```css
--surface-fill: rgb(8 10 9 / 0.58);
--surface-grid-x: rgb(var(--accent-rgb) / 0.026);
--surface-grid-y: rgb(237 240 235 / 0.018);
```

- [ ] **Step 4: Implement the shared reading plane**

Replace the existing `.root::before, .reader-page::before` background with:

```css
background:
    linear-gradient(to right, var(--surface-grid-x) 1px, transparent 1px) 0 0 / 8.333% 100%,
    linear-gradient(to bottom, var(--surface-grid-y) 1px, transparent 1px) 0 0 / 100% 32px,
    radial-gradient(circle at 50% 12%, transparent 0, rgb(8 10 9 / 0.08) 34rem, rgb(8 10 9 / 0.28) 72rem),
    var(--surface-fill);
-webkit-backdrop-filter: blur(7px) saturate(112%);
backdrop-filter: blur(7px) saturate(112%);
```

Keep the pseudo-element fixed, pointer-inert, and below content. Do not add borders, rounded corners, or shadows.

- [ ] **Step 5: Add transparency and unsupported-filter fallbacks**

Add:

```css
@media (prefers-reduced-transparency: reduce) {
    .root::before,
    .reader-page::before {
        background: rgb(13 15 14 / 0.94);
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
    }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .root::before,
    .reader-page::before {
        background-color: rgb(13 15 14 / 0.9);
    }
}
```

- [ ] **Step 6: Move rail-dependent rules to 1280px**

Change every `@media (max-width: 1100px)` block in `portfolio.css` to `@media (max-width: 1280px)`. These blocks jointly control rail layout, main/footer offsets, and article navigation behavior.

- [ ] **Step 7: Run the automated gates**

Run:

```bash
node --test tests/calibration-field.test.mjs
node scripts/verify-redesign.mjs
node --check ambient-field.js
node --check portfolio-data.js
git diff --check
```

Expected: one component test passes, the redesign pre-flight prints its success message, both syntax checks exit zero, and the diff check reports no whitespace errors.

---

### Task 2: Verify the visual hierarchy and responsive fix

**Files:**
- Modify if required by inspection: `portfolio.css`

**Interfaces:**
- Consumes: the shared reading plane and 1280px navigation behavior from Task 1.
- Produces: a visually verified portfolio and article reader with no rail collision or page-level overflow.

- [ ] **Step 1: Reload the local portfolio at the reported width**

Use the running local preview at `http://127.0.0.1:4173/`. Inspect a viewport near 1111px and record the rail position, hero position, horizontal overlap, and page overflow.

Expected: the rail is in the horizontal flow, the hero starts below it, horizontal and vertical overlap do not occur together, and the body does not overflow the viewport.

- [ ] **Step 2: Inspect target portfolio widths**

Inspect 375px, 768px, 1111px, 1280px, and 1440px. Confirm:

- the fixed rail appears only above 1280px;
- the horizontal navigation scrolls internally when necessary;
- the reading plane covers the full viewport;
- the grid is faint and the contours remain visible as atmosphere;
- buttons and typography retain sufficient contrast;
- the body never overflows horizontally.

- [ ] **Step 3: Inspect the article reader**

Open one local writing entry at mobile and desktop widths. Confirm the reading plane matches the portfolio, the table of contents remains usable, the article loads, and the reading-progress treatment remains intact.

- [ ] **Step 4: Inspect browser diagnostics**

Confirm there are no application errors. The existing Babel development warning is allowed because it predates this change and does not affect runtime behavior.

- [ ] **Step 5: Re-run final verification**

Run:

```bash
node --test tests/calibration-field.test.mjs
node scripts/verify-redesign.mjs
git diff --check
git status --short
```

- [ ] **Step 6: Commit the implementation**

```bash
git add portfolio.css scripts/verify-redesign.mjs docs/superpowers/plans/2026-08-06-translucent-reading-plane.md
git commit -m "fix: restore translucent portfolio reading plane"
```

