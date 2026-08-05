# Calibration Topography Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the animated signal background with a static calibration-topography field and apply the approved targeted visual, accessibility, and performance upgrades across the portfolio and writing page.

**Architecture:** Add one shared presentational `CalibrationField` React component and implement its appearance entirely in CSS. Remove continuous animation and scroll-render loops from both pages, preserve the existing data and navigation structure, and verify the component with Node's test runner plus a separate source pre-flight and browser inspection.

**Tech Stack:** React 18 UMD, Babel Standalone, vanilla CSS, static HTML, Node.js built-ins for verification.

## Global Constraints

- Preserve all route names, anchor IDs, primary navigation labels, research content, and the existing profile photograph.
- Keep the current React plus Babel and vanilla CSS stack. Add no runtime dependency.
- Use one dark theme and one accent color: `#c8a66b`.
- Use 4px radii for interface surfaces and 8px only for media frames.
- Remove `SignalLayer`, continuous `requestAnimationFrame` loops, and continuous visual scroll calculations.
- Use no em dash or en dash in homepage and writing-page interface copy.
- Respect `prefers-reduced-motion`, forced colors, keyboard navigation, and mobile layouts down to 375px.
- Leave a localhost preview running when verification is complete.

## File structure

- Create `ambient-field.js`: shared decorative React component with no state or effects.
- Create `tests/calibration-field.test.mjs`: behavior test that renders the shared component through a small React-compatible harness.
- Create `scripts/verify-redesign.mjs`: source-level pre-flight for architecture, copy, metadata, and accessibility requirements. This is verification, not a behavioral test.
- Modify `portfolio-app.jsx`: remove signal math and scroll-frame state; use IntersectionObserver for active navigation and reveal state.
- Modify `writing-app.jsx`: remove duplicated signal math and scroll-frame state; use shared background and IntersectionObserver for the table of contents.
- Modify `portfolio-sections.jsx`: remove numbered section labels and refine semantic component markup.
- Modify `portfolio.css`: implement tokens, topography, consistent shapes, asymmetric layouts, focus states, and responsive/reduced-motion behavior.
- Modify `index.html`: add skip navigation, metadata, favicon, and shared background script.
- Modify `writing.html`: mirror shared metadata, skip navigation, favicon, and shared background script.

---

### Task 1: Add the background behavior test and redesign pre-flight

**Files:**
- Create: `tests/calibration-field.test.mjs`
- Create: `scripts/verify-redesign.mjs`

**Interfaces:**
- Consumes: repository source files as UTF-8 strings.
- Produces: a failing behavior test before the component exists and a separate source pre-flight for final verification.

- [ ] **Step 1: Write the failing component behavior test**

Use `node:test`, `node:assert/strict`, `node:fs`, and `node:vm`. Load `ambient-field.js` into a context containing a minimal `React.createElement` implementation and a `window` object. Assert that `window.CalibrationField()` returns a `div` with class `calibration-field` and boolean `aria-hidden`.

The production change that makes this pass is the addition of the real shared component. Removing its accessible decorative semantics makes the test fail.

- [ ] **Step 2: Run the behavior test and confirm it fails**

Run:

```bash
node --test tests/calibration-field.test.mjs
```

Expected: failure because `ambient-field.js` does not exist.

- [ ] **Step 3: Write the separate source pre-flight**

Create a Node script using `node:assert/strict` and `node:fs`. It must assert:

```js
assert.match(ambient, /function CalibrationField/);
assert.doesNotMatch(portfolioApp, /SignalLayer|requestAnimationFrame|addEventListener\(["']scroll/);
assert.doesNotMatch(writingApp, /SignalLayer|requestAnimationFrame|addEventListener\(["']scroll/);
assert.match(css, /\.calibration-field/);
assert.doesNotMatch(css, /\.signal-layer|\.signal-trail|\.signal-dot/);
assert.doesNotMatch(sections, /§\s*0[1-9]/);
assert.match(indexHtml, /class="skip-link"/);
assert.match(indexHtml, /property="og:title"/);
assert.match(writingHtml, /class="skip-link"/);
assert.equal((css.match(/@media \(prefers-reduced-motion: reduce\)/g) || []).length >= 1, true);
```

Also verify that local script, stylesheet, image, and resume references used by `index.html` exist. Treat this script as a delivery gate, not a behavior test.

- [ ] **Step 4: Run the pre-flight and confirm the current design fails**

Run:

```bash
node scripts/verify-redesign.mjs
```

Expected: failure on the missing `ambient-field.js` or the existing `SignalLayer` implementation.

- [ ] **Step 5: Keep both gates in the worktree**

Do not weaken assertions to match the old implementation. Subsequent tasks make the contract pass.

---

### Task 2: Replace continuous animation and scroll work

**Files:**
- Create: `ambient-field.js`
- Modify: `portfolio-app.jsx`
- Modify: `writing-app.jsx`
- Modify: `index.html`
- Modify: `writing.html`

**Interfaces:**
- Produces: global `window.CalibrationField` component.
- Consumes: `CalibrationField` from both page entry points.

- [ ] **Step 1: Add the shared static component**

Implement without JSX so the dependency-free behavior test executes the same production file:

```js
function CalibrationField() {
  return React.createElement("div", {
    className: "calibration-field",
    "aria-hidden": true,
  });
}

window.CalibrationField = CalibrationField;
```

- [ ] **Step 2: Load the component before both page applications**

Add `<script src="ambient-field.js"></script>` before `portfolio-app.jsx` and `writing-app.jsx` in their respective HTML files.

- [ ] **Step 3: Remove the signal implementations**

Delete `measureRoute`, `pointAtDistance`, `trailPoints`, `trailSegments`, and `SignalLayer` from `portfolio-app.jsx` and `writing-app.jsx`. Replace every `<SignalLayer />` with `<CalibrationField />`.

- [ ] **Step 4: Replace homepage scroll tracking**

Remove `scrollFx`, scroll-progress CSS variable writes, the `window` scroll listener, and resize scheduling. Track the active section with an `IntersectionObserver` over the existing section IDs. Keep the current reveal observer and mark elements once when they enter.

- [ ] **Step 5: Replace writing-page scroll tracking**

Remove JavaScript scroll progress and blur calculations. Use IntersectionObserver on generated `h2` and `h3` IDs to update `activeHeading`. Convert the visual reading progress bar to CSS scroll-driven animation with a static fallback.

- [ ] **Step 6: Run the behavior test and source pre-flight**

Run `node --test tests/calibration-field.test.mjs` and `node scripts/verify-redesign.mjs`.

Expected: remaining failures concern CSS, section labels, or metadata, not signal or frame-loop code.

- [ ] **Step 7: Commit the runtime cleanup**

```bash
git add ambient-field.js portfolio-app.jsx writing-app.jsx index.html writing.html tests/calibration-field.test.mjs scripts/verify-redesign.mjs
git commit -m "refactor: replace animated signal runtime"
```

---

### Task 3: Build the calibration-topography visual system

**Files:**
- Modify: `portfolio.css`
- Modify: `portfolio-app.jsx`
- Modify: `writing-app.jsx`

**Interfaces:**
- Consumes: `.calibration-field` from Task 2.
- Produces: the single dark token system and static background used by both pages.

- [ ] **Step 1: Replace the global tokens**

Set the approved carbon, surface, rule, ink, muted, and accent values. Remove scroll-effect variables and set the default tweak accent to `#c8a66b` on both pages.

- [ ] **Step 2: Implement the contour field**

Use fixed pseudo-elements with `repeating-radial-gradient` contours positioned outside the central content column. Use a mask or low opacity to keep the reading area quiet. Retain one fixed grain pseudo-element and remove all `.signal-*` selectors and glow filters.

- [ ] **Step 3: Simplify reveal motion**

Remove `filter: blur(...)` from all reveal states. Use only `opacity` and `translateY(8px)` with 350 to 450ms easing. Remove broad `transition: all` declarations from primary components.

- [ ] **Step 4: Normalize shape and interaction tokens**

Set buttons, tags, chips, panels, social links, and cards to 4px. Keep the portrait at 8px. Add `:active` translation and a global `:focus-visible` ring using the accent.

- [ ] **Step 5: Add accessibility media queries**

Under reduced motion, disable smooth scrolling, transforms, and transition delays. Under forced colors, hide the decorative field and allow system focus colors. Reduce contour contrast below 720px.

- [ ] **Step 6: Run CSS and source checks**

Run:

```bash
git diff --check
node scripts/verify-redesign.mjs
```

Expected: source contract failures only for unfinished section or metadata work.

---

### Task 4: Refine hierarchy and asymmetric layouts

**Files:**
- Modify: `portfolio-sections.jsx`
- Modify: `portfolio.css`

**Interfaces:**
- Consumes: existing `PORTFOLIO_DATA` structures unchanged.
- Produces: section headings without numbered labels and responsive artifact and writing layouts.

- [ ] **Step 1: Simplify section headings**

Remove each `label="§ NN"` prop. Change `SectionHead` to accept only `title` and `sub`, render a semantic heading followed by optional supporting text, and remove `.sec-label` layout dependencies.

- [ ] **Step 2: Simplify contact presentation**

Replace `§ 07 · Contact` with a plain `Contact` label or omit it. Keep the email as the footer's single contact action and preserve social destinations.

- [ ] **Step 3: Remove decorative timeline dots**

Remove `.cv-marker` markup and inline accent styling. Use spacing, date alignment, and sparse rules to establish experience hierarchy.

- [ ] **Step 4: Recompose research artifacts**

Use a two-column asymmetric grid where the first artifact spans two rows on desktop and the supporting artifacts occupy the second column. Collapse to one column below 980px.

- [ ] **Step 5: Recompose featured writing**

Use a 12-column layout: the first article spans seven columns, the second spans five, and the third sits in a narrower offset position without creating an empty interactive cell. Collapse to one column below 768px.

- [ ] **Step 6: Refine controls and metadata**

Use sentence case for filter controls and venue labels where CSS currently forces uppercase. Add `aria-pressed` to writing filters. Keep numeric metadata tabular.

- [ ] **Step 7: Run the source contract and JSX parse checks**

Run:

```bash
node scripts/verify-redesign.mjs
node --check portfolio-data.js
git diff --check
```

Expected: all source-level redesign assertions pass except any metadata still covered by Task 5.

- [ ] **Step 8: Commit the visual redesign**

```bash
git add portfolio-sections.jsx portfolio.css portfolio-app.jsx writing-app.jsx
git commit -m "feat: apply calibration topography redesign"
```

---

### Task 5: Add accessibility and metadata foundations

**Files:**
- Modify: `index.html`
- Modify: `writing.html`
- Modify: `portfolio-app.jsx`
- Modify: `writing-app.jsx`
- Modify: `portfolio.css`

**Interfaces:**
- Produces: `#main-content` skip targets and complete core social metadata.

- [ ] **Step 1: Add skip navigation**

Place `<a class="skip-link" href="#main-content">Skip to content</a>` before each root. Add `id="main-content"` to each page's main content container.

- [ ] **Step 2: Add document metadata**

Add favicon references to `profile_photo.png`. Add `og:title`, `og:description`, `og:type`, and `og:image` to both HTML heads. Replace em and en dashes in page titles and interface strings with regular hyphens or rewritten sentences.

- [ ] **Step 3: Style the skip link**

Keep it visually hidden until keyboard focus, then reveal it at the top-left with a high-contrast surface and accent outline.

- [ ] **Step 4: Validate navigation and assets**

Use the verification script to assert every homepage `href="#..."` target exists and every local script, stylesheet, image, and resume reference resolves.

- [ ] **Step 5: Run full source verification**

Run:

```bash
node scripts/verify-redesign.mjs
git diff --check
```

Expected: both commands exit 0.

- [ ] **Step 6: Commit accessibility and metadata**

```bash
git add index.html writing.html portfolio-app.jsx writing-app.jsx portfolio.css scripts/verify-redesign.mjs
git commit -m "feat: strengthen portfolio accessibility"
```

---

### Task 6: Render, audit, and host the result

**Files:**
- Modify as needed from audit findings: `portfolio.css`, `portfolio-app.jsx`, `portfolio-sections.jsx`, `writing-app.jsx`, `index.html`, `writing.html`

**Interfaces:**
- Produces: verified local portfolio at `http://127.0.0.1:4173/`.

- [ ] **Step 1: Run static checks**

Run `node scripts/verify-redesign.mjs`, `node --check portfolio-data.js`, and `git diff --check`.

- [ ] **Step 2: Start a temporary server for browser QA**

Run:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

- [ ] **Step 3: Inspect responsive layouts**

Capture or inspect the homepage at 375x812, 768x1024, 1024x768, and 1440x900. Verify no horizontal overflow, rail overlap, clipped type, wrapped desktop CTA, unreadable field contours, or empty grid cells.

- [ ] **Step 4: Inspect interactions and accessibility**

Verify keyboard focus order, skip link, active navigation, writing filters, article links, reduced motion, and article loading/error behavior. Confirm text contrast and touch target size.

- [ ] **Step 5: Run the anti-template pre-flight**

Confirm one accent, one dark theme, zero homepage em/en dashes, zero numbered section labels, no animated background, no three-equal-card feature row, no decorative dots, motivated motion only, and no new dependency.

- [ ] **Step 6: Fix findings and re-run all checks**

Repeat Steps 1 through 5 until no required check fails.

- [ ] **Step 7: Commit final polish**

```bash
git add portfolio.css portfolio-app.jsx portfolio-sections.jsx writing-app.jsx index.html writing.html ambient-field.js tests/calibration-field.test.mjs scripts/verify-redesign.mjs
git commit -m "fix: polish responsive portfolio redesign"
```

- [ ] **Step 8: Leave the localhost preview running**

Restart the server at `http://127.0.0.1:4173/` and keep the process alive for user exploration.
