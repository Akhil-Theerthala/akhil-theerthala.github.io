# Portfolio Credibility and Production Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved portfolio into an evidence-led, production-built research site with tighter professional content, citation tools, clean article routes, optimized assets, complete metadata, and a verified local preview.

**Architecture:** Preserve the current static-page and CSS architecture. Add an esbuild pipeline that bundles the existing React components into one homepage bundle and one article bundle, then generates static article shells and discovery files from the existing portfolio data. Keep content facts in `portfolio-data.js`, add focused UI components for artifact evidence and citation behavior, and commit all generated static assets for direct GitHub Pages hosting.

**Tech Stack:** React 18, ReactDOM 18, esbuild, marked, Node.js built-in test runner, native CSS, cwebp, static HTML, GitHub Pages.

## Global Constraints

- Preserve the current page order, primary navigation labels, section anchor IDs, resume URL, split hero, portrait, and article source files.
- Preserve the off-black Calibration Topography identity, translucent reading plane, faint grid, `#c8a66b` accent, 4px interface radii, and 8px media radii.
- Do not add pure black, a light-mode toggle, a second accent, glow, fake dashboard imagery, stock imagery, or continuous animation.
- Use real project evidence and verified values only. Omit unavailable media rather than fabricating it.
- Keep motion at intensity 2 and honor reduced motion, reduced transparency, and forced colors.
- Use regular hyphens in visible interface strings. Do not add em or en dashes.
- Keep legacy `writing.html?file=<filename>` URLs functional while adding canonical `/writing/<slug>/` routes.
- Commit generated JavaScript, article pages, media derivatives, fonts, sitemap, robots rules, 404 page, and Open Graph image so hosting remains static.

---

## File Structure

### Create

- `package.json`: dependencies and build, check, test, and serve commands.
- `package-lock.json`: locked dependency graph.
- `build/react-inject.js`: exposes bundled React and `createRoot` to existing source identifiers.
- `build/portfolio-entry.jsx`: homepage bundle entry in source execution order.
- `build/writing-entry.jsx`: article bundle entry with marked.
- `scripts/build-site.mjs`: bundle creation, article page generation, sitemap, robots, 404, and metadata generation.
- `scripts/check-site.mjs`: generated-output, link, slug, metadata, and forbidden-character checks.
- `scripts/serve.mjs`: static localhost server with clean-route fallback and explicit port output.
- `tests/site-content.test.mjs`: content fidelity and data-shape tests.
- `tests/site-build.test.mjs`: production-output and generated-route tests.
- `assets/media/profile-480.webp`: optimized portrait.
- `assets/media/profile-960.webp`: optimized portrait.
- `assets/social/akhil-theerthala-og.png`: dedicated social preview.
- `assets/fonts/`: selected Newsreader, Geist, and JetBrains Mono WOFF2 files.
- `assets/js/portfolio.js`: generated production homepage bundle.
- `assets/js/writing.js`: generated production article bundle.
- `writing/<slug>/index.html`: one generated page per writing record.
- `404.html`, `robots.txt`, `sitemap.xml`: static discovery and failure pages.

### Modify

- `portfolio-data.js`: accurate publication records, citations, experience summaries, artifact evidence, article slugs, and two featured writings.
- `portfolio-sections.jsx`: artifact evidence, selected-impact experience, citation controls, simplified writing archive, and footer location.
- `portfolio-app.jsx`: remove runtime tweaks and use fixed approved design tokens.
- `writing-app.jsx`: clean-route article resolution, content-prefix handling, and compact article index.
- `index.html`: production bundle, canonical metadata, structured data, optimized portrait preload, and local fonts.
- `writing.html`: compatibility entry using the production bundle and generic fallback metadata.
- `portfolio.css`: credibility layouts, contrast fix, evidence plates, citations, compact article index, local fonts, and responsive behavior.
- `scripts/verify-redesign.mjs`: replace development-runtime assumptions with production-output assertions.
- `tests/calibration-field.test.mjs`: adapt loading to bundled-source boundaries without changing its visual invariant.

---

### Task 1: Production build foundation

**Files:**
- Create: `package.json`
- Create: `build/react-inject.js`
- Create: `build/portfolio-entry.jsx`
- Create: `build/writing-entry.jsx`
- Create: `scripts/build-site.mjs`
- Create: `tests/site-build.test.mjs`
- Modify: `index.html`
- Modify: `writing.html`

**Interfaces:**
- Consumes: existing `portfolio-data.js`, `ambient-field.js`, JSX component files, and both HTML entry pages.
- Produces: `buildSite(): Promise<void>`, `assets/js/portfolio.js`, `assets/js/writing.js`, and HTML pages that load only those production bundles.

- [ ] **Step 1: Add a failing production-runtime test**

```js
test("pages load local production bundles without Babel or development React", () => {
  const index = read("index.html");
  const writing = read("writing.html");
  for (const html of [index, writing]) {
    assert.doesNotMatch(html, /babel|react\.development|react-dom\.development/);
  }
  assert.match(index, /assets\/js\/portfolio\.js/);
  assert.match(writing, /assets\/js\/writing\.js/);
});
```

- [ ] **Step 2: Run the test and confirm the existing development delivery fails**

Run: `node --test tests/site-build.test.mjs`

Expected: FAIL because both pages still reference Babel Standalone and development UMD files.

- [ ] **Step 3: Add the exact package scripts and dependency set**

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node scripts/build-site.mjs",
    "check": "node scripts/check-site.mjs",
    "test": "node --test tests/*.test.mjs",
    "serve": "node scripts/serve.mjs"
  },
  "dependencies": {
    "marked": "^16.2.1",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "esbuild": "^0.25.9"
  }
}
```

- [ ] **Step 4: Add the two entry points and React injection module**

```js
// build/react-inject.js
import * as ReactNamespace from "react";
import { createRoot } from "react-dom/client";
export const React = ReactNamespace;
export const ReactDOM = { createRoot };
```

```js
// build/portfolio-entry.jsx
import "../portfolio-data.js";
import "../ambient-field.js";
import "../portfolio-sections.jsx";
import "../portfolio-app.jsx";
```

```js
// build/writing-entry.jsx
import { marked } from "marked";
window.marked = marked;
import "../portfolio-data.js";
import "../ambient-field.js";
import "../writing-app.jsx";
```

- [ ] **Step 5: Implement deterministic esbuild output**

Use `esbuild.build()` twice with `bundle: true`, `format: "iife"`, `minify: true`, `target: ["es2020"]`, the React injection module, and exact output paths under `assets/js`.

- [ ] **Step 6: Replace development scripts in both HTML pages**

`index.html` loads `assets/js/portfolio.js` with `defer`. `writing.html` loads `assets/js/writing.js` with `defer`. Delete Babel, React UMD, ReactDOM UMD, marked CDN, the data script, ambient script, tweak panel script, and JSX script tags from production markup.

- [ ] **Step 7: Install, build, and rerun the test**

Run: `npm install`

Run: `npm run build`

Run: `node --test tests/site-build.test.mjs`

Expected: PASS with both generated bundles present and no development-runtime references.

- [ ] **Step 8: Commit the build foundation**

```bash
git add package.json package-lock.json build scripts/build-site.mjs tests/site-build.test.mjs index.html writing.html assets/js
git commit -m "build: precompile portfolio runtime"
```

### Task 2: Verified content model and selected impact

**Files:**
- Modify: `portfolio-data.js`
- Create: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: verified portfolio claims, resume-derived experience, arXiv metadata, and public project metadata.
- Produces: `workExperience[].summary`, `workExperience[].highlights`, optional `recognition`, `publications[].citation`, `publications[].bibtex`, `publications[].doi`, `projects[].evidence`, and `writings[].slug`.

- [ ] **Step 1: Add failing content-shape tests**

```js
test("current role is a selected-impact record", () => {
  const role = data.workExperience[0];
  assert.equal(typeof role.summary, "string");
  assert.equal(role.highlights.length, 3);
  assert.equal(typeof role.recognition, "string");
});

test("every publication has verified citation data", () => {
  for (const publication of data.publications) {
    assert.match(publication.doi, /^10\.48550\/arXiv\./);
    assert.match(publication.citation, /Akhil Theerthala/);
    assert.match(publication.bibtex, /^@misc\{/);
  }
});

test("writing slugs are unique and exactly two records are featured", () => {
  assert.equal(new Set(data.writings.map((item) => item.slug)).size, data.writings.length);
  assert.deepEqual(
    data.writings.filter((item) => item.featured).map((item) => item.file),
    ["Density-Vs-Diversity.md", "Creating-a-Reasoning-Dataset-with.md"],
  );
});
```

- [ ] **Step 2: Run the tests and confirm missing fields fail**

Run: `node --test tests/site-content.test.mjs`

Expected: FAIL because the current data uses `desc`, lacks citation records and slugs, and has three featured writings.

- [ ] **Step 3: Correct publication metadata from primary sources**

Add Anthony Wen-Ming Zang to the Role Steering author list. Use the official arXiv titles for arXiv `2601.06747` and `2509.14180`. Add DOI, citation, and complete BibTeX strings with primary classes `cs.CL`, `cs.AI`, and `cs.CL` respectively.

- [ ] **Step 4: Convert work experience to selected-impact fields**

The current role receives one summary, three highlights covering uncertainty research, banking-agent guardrails, and the shipped 92% precision document-quality system, plus the Circle of Excellence recognition. Older roles keep three or fewer highlights and receive concise summaries based on existing content.

- [ ] **Step 5: Add verified artifact evidence and stable writing slugs**

Kuvera evidence uses `18.8k rows`, `8 categories`, `8B model`, and `80% lower cost`, supported by the public dataset card and paper. LazyInfer evidence uses the real `JSONL -> YAML stages -> schema validation -> checkpointed outputs` architecture. The competition entry retains the existing resume-supported `1st place` and `150+ teams` claim without inventing additional metrics.

- [ ] **Step 6: Rerun content tests**

Run: `node --test tests/site-content.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit the content model**

```bash
git add portfolio-data.js tests/site-content.test.mjs
git commit -m "content: strengthen portfolio evidence model"
```

### Task 3: Credibility components and writing archive

**Files:**
- Modify: `portfolio-sections.jsx`
- Modify: `portfolio-app.jsx`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: data fields from Task 2.
- Produces: `ArtifactEvidence`, `ExperienceEntry`, `PublicationCitation`, and a non-duplicative `WritingArchive` rendering contract.

- [ ] **Step 1: Add failing source-contract tests**

Assert that `PublicationCitation` exists, copy status uses `aria-live="polite"`, the archive excludes featured records, older notes render in a native `details`, `ExperienceEntry` uses `highlights`, and the footer renders `data.location` instead of a hard-coded city.

- [ ] **Step 2: Run tests and confirm the current components fail**

Run: `node --test tests/site-content.test.mjs`

Expected: FAIL on missing component and rendering contracts.

- [ ] **Step 3: Implement accessible citation copying**

```jsx
function PublicationCitation({ publication }) {
  const [status, setStatus] = useState("");
  const copy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied`);
    } catch {
      setStatus(`Copy failed. Select the ${label.toLowerCase()} text below.`);
    }
  };
  return publication.citation && publication.bibtex ? (
    <details className="citation">
      <summary>Citation</summary>
      <div className="citation-actions">
        <button type="button" onClick={() => copy(publication.citation, "Citation")}>Copy citation</button>
        <button type="button" onClick={() => copy(publication.bibtex, "BibTeX")}>Copy BibTeX</button>
      </div>
      <pre className="citation-text">{publication.citation}</pre>
      <pre className="citation-text">{publication.bibtex}</pre>
      <p className="sr-only" aria-live="polite">{status}</p>
    </details>
  ) : null;
}
```

Copy controls are normal buttons, leave citation text selectable, and reset success text only after sufficient time for announcement.

- [ ] **Step 4: Implement evidence-led artifacts**

The featured Kuvera record uses a narrative region and an `ArtifactEvidence` region showing verified values and dataset schema. LazyInfer renders its real four-stage flow. Supporting records remain compact and use explicit links when more than one destination is present.

- [ ] **Step 5: Implement selected-impact experience**

Render summary, at most three highlights, and optional recognition. Highlight verified metric substrings with `<strong>` through explicit data tokens, not regular-expression rewriting of arbitrary prose.

- [ ] **Step 6: Simplify writings and remove runtime tweaks**

Render the two featured items once, filter them out of the visible current archive, and place older learning notes inside a collapsed `details`. Remove the category filter state and the production TweaksPanel. Apply the fixed approved accent, density, and headline family directly.

- [ ] **Step 7: Rerun tests and build**

Run: `npm test`

Run: `npm run build`

Expected: PASS.

- [ ] **Step 8: Commit credibility components**

```bash
git add portfolio-sections.jsx portfolio-app.jsx tests/site-content.test.mjs assets/js
git commit -m "feat: present research evidence and selected impact"
```

### Task 4: Visual system, accessibility, and optimized portrait

**Files:**
- Modify: `portfolio.css`
- Modify: `portfolio-sections.jsx`
- Create: `assets/media/profile-480.webp`
- Create: `assets/media/profile-960.webp`
- Modify: `tests/site-build.test.mjs`

**Interfaces:**
- Consumes: credibility components from Task 3 and original `profile_photo.png`.
- Produces: responsive evidence layout, accessible controls, corrected contrast, reserved portrait dimensions, and responsive image selection.

- [ ] **Step 1: Add failing CSS and media assertions**

Check `--dim: #788179`, local `@font-face` declarations, article-index breakpoints at 1280px and 720px, citation focus styles, and existence of both portrait derivatives.

- [ ] **Step 2: Run the tests and confirm the old CSS and media fail**

Run: `node --test tests/site-build.test.mjs`

Expected: FAIL on the old dim token and missing media.

- [ ] **Step 3: Generate responsive WebP portraits**

Run: `mkdir -p assets/media`

Run: `cwebp -quiet -q 84 -resize 480 0 profile_photo.png -o assets/media/profile-480.webp`

Run: `cwebp -quiet -q 86 -resize 960 0 profile_photo.png -o assets/media/profile-960.webp`

- [ ] **Step 4: Replace the portrait with reserved responsive markup**

```html
<picture>
  <source
    type="image/webp"
    srcSet="assets/media/profile-480.webp 480w, assets/media/profile-960.webp 960w"
    sizes="(max-width: 720px) 0px, (max-width: 1280px) 348px, 420px"
  />
  <img src="profile_photo.png" width="960" height="995" decoding="async" fetchPriority="high" alt="Akhil Theerthala" />
</picture>
```

- [ ] **Step 5: Implement credibility layout CSS**

Create one featured artifact grid with unequal narrative and evidence columns, compact supporting artifacts, border-led citation disclosure, metric emphasis, selected-impact experience spacing, and a collapsed older-writing archive. Preserve the current reading plane, grid, palette, and section rhythm.

- [ ] **Step 6: Apply accessibility and responsive fixes**

Change `--dim` to `#788179`, set meaningful small text to at least 12px, add focus-visible styles, and implement compact article-index CSS at the specified breakpoints. Full-screen blur remains unchanged on desktop and becomes a solid fallback under reduced transparency.

- [ ] **Step 7: Build and run tests**

Run: `npm run build`

Run: `npm test`

Expected: PASS.

- [ ] **Step 8: Commit visual and media work**

```bash
git add portfolio.css portfolio-sections.jsx assets/media tests/site-build.test.mjs assets/js
git commit -m "feat: refine evidence layouts and responsive media"
```

### Task 5: Canonical article routes and compact article index

**Files:**
- Modify: `writing-app.jsx`
- Modify: `scripts/build-site.mjs`
- Modify: `writing.html`
- Create: generated `writing/<slug>/index.html` pages
- Modify: `tests/site-build.test.mjs`

**Interfaces:**
- Consumes: `writings[].slug`, `writings[].file`, and Markdown sources.
- Produces: `getRequestedArticle()`, `getContentUrl(article)`, generated article HTML, legacy compatibility behavior, and responsive `ArticleIndex`.

- [ ] **Step 1: Add failing route and metadata tests**

For every writing record, assert that `writing/<slug>/index.html` exists and contains its exact title, description, canonical URL, `data-article-file`, and `assets/js/writing.js`. Assert that each Markdown file exists and no duplicate slug is generated.

- [ ] **Step 2: Run the tests and confirm generated routes are missing**

Run: `node --test tests/site-build.test.mjs`

Expected: FAIL because only `writing.html?file=` exists.

- [ ] **Step 3: Generate article shells from portfolio data**

Evaluate `portfolio-data.js` in a Node VM with a safe `{ window: {} }` context. Escape every injected title and description. Write nested article shells with `data-article-file`, `data-content-prefix="../../"`, article-specific canonical and social metadata, the shared CSS, and the writing bundle.

- [ ] **Step 4: Resolve generated and legacy article requests**

`getRequestedArticle()` first reads `document.documentElement.dataset.articleFile`, then falls back to the `file` query parameter. `getContentUrl()` prepends `document.documentElement.dataset.contentPrefix` before `My writings/<encoded file>`.

- [ ] **Step 5: Implement `ArticleIndex` variants**

Use the same `tocItems` for the fixed rail and a native disclosure. Render the disclosure only at 1280px and below through CSS, preserve `aria-current`, and close it after a heading link is selected without trapping focus.

- [ ] **Step 6: Preserve legacy compatibility**

The root `writing.html` remains a functioning reader and uses canonical-route links when it resolves a known `file`. Unknown files show the existing designed not-found state.

- [ ] **Step 7: Build and rerun route tests**

Run: `npm run build`

Run: `node --test tests/site-build.test.mjs`

Expected: PASS for all generated article routes.

- [ ] **Step 8: Commit article routing**

```bash
git add writing-app.jsx writing.html scripts/build-site.mjs tests/site-build.test.mjs writing assets/js
git commit -m "feat: generate canonical writing routes"
```

### Task 6: Local fonts, structured metadata, discovery, and social preview

**Files:**
- Modify: `package.json`
- Modify: `scripts/build-site.mjs`
- Modify: `index.html`
- Modify: `portfolio.css`
- Create: `assets/fonts/*`
- Create: `assets/social/akhil-theerthala-og.png`
- Create: `404.html`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Modify: `tests/site-build.test.mjs`

**Interfaces:**
- Consumes: verified portfolio data, `CNAME`, original portrait, and article slugs.
- Produces: local font assets, homepage Person and publication structured data, social preview, sitemap, robots rules, and a static 404 page.

- [ ] **Step 1: Add failing discovery tests**

Assert no `fonts.googleapis.com` request remains, the three local font families are declared, the homepage has a canonical link and `application/ld+json`, the Open Graph image is 1200 by 630, sitemap includes every canonical article, and robots points to the sitemap.

- [ ] **Step 2: Run tests and confirm missing production metadata fails**

Run: `node --test tests/site-build.test.mjs`

Expected: FAIL.

- [ ] **Step 3: Add self-hosted font packages and copy only used files**

Run: `npm install @fontsource-variable/newsreader @fontsource-variable/geist @fontsource-variable/jetbrains-mono`

Copy the Latin variable WOFF2 file from each package into `assets/fonts` as `newsreader-latin.woff2`, `geist-latin.woff2`, and `jetbrains-mono-latin.woff2`. Declare those exact files with `font-display: swap`, then delete Google Fonts links plus Instrument Serif and EB Garamond references.

- [ ] **Step 4: Add canonical and structured homepage metadata**

Use `https://akhiltheerthala.com/` from `CNAME`. Add one `Person` JSON-LD object with verified name, job title, URL, image, location, profile links, employer, and alumni affiliations. Represent each publication with complete verified metadata as a linked `ScholarlyArticle` JSON-LD object containing its exact title, authors, year, arXiv URL, and DOI. Omit any unavailable property instead of guessing it.

- [ ] **Step 5: Generate discovery files**

Create a sitemap containing the homepage and every article canonical URL, a robots file with `User-agent: *`, `Allow: /`, and the sitemap URL, plus a 404 page with links to `/`, `/#research`, `/#writings`, and `/#contact`.

- [ ] **Step 6: Render the social card**

Create a temporary local HTML composition using the original portrait, off-black surface, warm accent, name, and the existing research positioning. Open it at an exact 1200 by 630 viewport with the browser tooling and capture the page directly to `assets/social/akhil-theerthala-og.png`. Delete the temporary HTML after capture. Do not add a dashboard, decorative metrics, or a second accent.

- [ ] **Step 7: Build and rerun discovery tests**

Run: `npm run build`

Run: `npm test`

Expected: PASS.

- [ ] **Step 8: Commit production assets and metadata**

```bash
git add package.json package-lock.json index.html portfolio.css scripts assets/fonts assets/social 404.html robots.txt sitemap.xml writing tests assets/js
git commit -m "feat: add portfolio discovery and social metadata"
```

### Task 7: Production checks and compatibility cleanup

**Files:**
- Create: `scripts/check-site.mjs`
- Create: `scripts/serve.mjs`
- Modify: `scripts/verify-redesign.mjs`
- Modify: `tests/calibration-field.test.mjs`
- Modify: `tests/site-build.test.mjs`
- Remove: `tweaks-panel.jsx`
- Remove: `portfolio-reader.jsx`

**Interfaces:**
- Consumes: all production source and generated output.
- Produces: `npm run check`, static local serving, and a clean repository without unused production runtime files.

- [ ] **Step 1: Add failing check-command coverage**

Test that package scripts expose build, test, check, and serve. Assert no production HTML or generated JS references `tweaks-panel.jsx`, `portfolio-reader.jsx`, Babel, development React, or a CDN font.

- [ ] **Step 2: Implement `scripts/check-site.mjs`**

Validate data evaluation, unique slugs, source Markdown existence, generated routes, local href/src targets, canonical metadata, OG assets, sitemap coverage, visible interface dash characters, required section IDs, and absence of browser-side development dependencies. Exit nonzero with one actionable message per violation.

- [ ] **Step 3: Implement a local static server**

Use Node `http`, default to `127.0.0.1:4173`, serve UTF-8 MIME types, map directory requests to `index.html`, prevent path traversal with `path.resolve`, and print the full local URL once listening.

- [ ] **Step 4: Remove dead runtime files and update legacy tests**

Delete the unused TweaksPanel and overlay reader after confirming no references remain. Update calibration and redesign verification to inspect source and generated output instead of assuming global script tags.

- [ ] **Step 5: Run the full command matrix**

Run: `npm run build`

Run: `npm test`

Run: `npm run check`

Run: `git diff --check`

Expected: all commands exit 0.

- [ ] **Step 6: Commit production checks**

```bash
git add package.json scripts tests assets/js
git add -u tweaks-panel.jsx portfolio-reader.jsx
git commit -m "test: verify production portfolio output"
```

### Task 8: Browser verification and local handoff

**Files:**
- Modify only if verification finds a reproducible defect.

**Interfaces:**
- Consumes: production build served by `npm run serve`.
- Produces: evidence that the requested site works and the final localhost URL.

- [ ] **Step 1: Start the production server**

Run: `npm run serve`

Expected: `Portfolio available at http://127.0.0.1:4173/` and a persistent process.

- [ ] **Step 2: Verify homepage responsiveness**

Inspect 375px, 768px, 1111px, 1280px, and 1440px widths. Confirm hero actions are visible at desktop, the rail never overlaps content, the artifact evidence remains legible, experience shows at most three current-role bullets, older writings are initially collapsed, and there is no horizontal overflow.

- [ ] **Step 3: Verify article responsiveness**

Open one generated long article at 375px, 768px, and 1280px. Confirm the compact Article index is reachable, heading links work, the full rail appears only above 1280px, and content loads from the correct Markdown path.

- [ ] **Step 4: Verify interaction and accessibility behavior**

Use keyboard navigation for hero actions, disclosures, citation copy controls, artifact links, writing links, and footer links. Confirm focus visibility, `aria-current`, copy status announcement, reduced-motion behavior, and no focus trap.

- [ ] **Step 5: Inspect runtime evidence**

Confirm zero application console errors, zero Babel or development-React warnings, no failed local asset requests, and article-specific title, canonical, Open Graph, and description metadata in generated HTML.

- [ ] **Step 6: Capture final desktop and mobile screenshots**

Capture the homepage hero plus research artifacts at desktop and the mobile homepage or article view. Use these screenshots as the final visual proof shown to the user.

- [ ] **Step 7: Run final completion audit**

Re-run `npm run build`, `npm test`, `npm run check`, and `git diff --check`. Compare every acceptance criterion in the approved design spec against source, generated output, command results, and browser evidence.

- [ ] **Step 8: Commit any verification-only fixes and leave the server running**

If verification required changes, commit them with a focused message. Otherwise leave the clean worktree and active localhost server unchanged.
