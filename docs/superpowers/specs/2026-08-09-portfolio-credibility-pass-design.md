# Portfolio Credibility and Production Pass

**Date:** 2026-08-09

**Status:** Approved direction, pending written-spec review

## Objective

Improve the portfolio's research credibility, recruiter scanability, accessibility, performance, and discoverability without introducing another visual redesign.

The approved Calibration Topography identity remains intact: off-black surfaces, one warm accent, Newsreader display type, Geist body type, JetBrains Mono metadata, the translucent reading plane, faint grid, split hero, and restrained motion. This pass changes how evidence is presented and how the site is delivered, not what the site visually wants to be.

The release has two stages:

1. **Credibility stage:** strengthen research artifacts, compress experience, improve publication tools, simplify writings, and fix remaining responsive and contrast issues.
2. **Production stage:** precompile the application, remove development-only runtime code, optimize assets and fonts, and add static metadata and discovery files.

Both stages belong to one implementation plan, but each must be independently testable and leave the site usable.

## Design read

Reading this as: a research portfolio for hiring managers, research collaborators, and technical peers, with a serious scientific-editorial language implemented as a small static site.

- Design variance: 6
- Motion intensity: 2
- Visual density: 4
- Redesign mode: targeted evolution
- Theme: locked dark mode using off-black, never pure black
- Accent: the existing warm neutral `#c8a66b`
- Shape system: 4px interface surfaces and 8px media frames

## Current-state audit

### Preserve

- The current page order, primary navigation labels, and anchor IDs.
- The split hero, portrait, two primary hero actions, and research positioning.
- The left navigation rail above 1280px and horizontal navigation below that threshold.
- The calibration contours, translucent reading plane, faint grid, and single-accent palette.
- The publication year grouping, standalone article reader, Markdown source files, and downloadable resume.
- Existing skip navigation, focus treatment, reduced-motion behavior, reduced-transparency fallback, and forced-colors handling.

### Improve

- Research artifacts currently read as large text containers and do not show enough direct evidence.
- The first current-role entry contains five dense bullets and exceeds one normal desktop viewport.
- Publications link outward but do not provide citation or BibTeX actions.
- Featured writings repeat in the archive, and the full writings section is unnecessarily long.
- The smallest metadata color has roughly 3.6:1 contrast against dark surfaces while appearing at small sizes.
- The article table of contents clips horizontally at medium and small widths.
- The footer hard-codes `Hyderabad, India` while the portfolio data identifies the current location as `Bengaluru, India`.
- The homepage downloads development React and Babel Standalone, then compiles JSX in the browser.
- The portrait is a 1.1MB PNG with no reserved dimensions or responsive source.
- Five font families are requested even though the approved design needs three.
- Article pages expose generic Open Graph metadata to non-JavaScript crawlers.
- Canonical links, structured data, a sitemap, robots rules, and a designed 404 page are absent.

## Design invariants

The following constraints apply to every change in this pass:

- Do not remove, replace, animate, brighten, or increase the density of the background grid or contours.
- Do not introduce a second accent, glow, gradient text, pill-heavy controls, stock imagery, fake dashboards, or decorative data visualizations.
- Use only real project evidence or charts derived from verified project values.
- Do not change professional claims, metrics, publication status, authorship, or dates without a verifiable source.
- Keep all existing primary section anchors so external links and navigation continue to work.
- Keep the resume PDF available at its current URL.
- Keep motion limited to one-time reveals and interaction feedback. No continuous loops or scroll listeners.
- Use regular hyphens in visible interface text. Do not add em or en dashes.

## Stage 1: Credibility and scanability

### Research artifacts

The artifacts section becomes an evidence-led editorial composition rather than a collection of text cards.

#### Featured artifact

The Kuvera artifact remains the visual anchor. Its surface is divided into two purposeful regions:

- A concise narrative region with title, one-sentence contribution, verified metrics, and direct project links.
- A media region containing one real project artifact: a repository or dataset image, a verified benchmark figure, or a chart generated from values that are already present in a source owned by Akhil.

The media must have a functional caption that states what it shows. No decorative photo credit, floating label, or fabricated product interface is allowed.

#### Supporting artifacts

The Reasoning Dataset Challenge and LazyInfer remain smaller supporting entries. Each gets one compact evidence element where a source is available, such as a verified result, model comparison, pipeline output, or repository image. If no defensible media asset exists, the entry stays typographic rather than using a placeholder or generated fiction.

All artifact surfaces remain keyboard-accessible. A card may be fully clickable only when it has one destination. When it has multiple destinations, the surface becomes a non-linking article with explicit text links.

### Experience

The site becomes a selected-impact view while the PDF remains the full employment record.

- Add a one-sentence role mandate below each title and organization where the source content supports it.
- Show at most three contribution bullets for the current Perfios role.
- Prioritize one research contribution, one safety or evaluation contribution, and one shipped system with a verified metric.
- Move an award or recognition into a short metadata line instead of a fifth bullet.
- Keep older roles concise and preserve their existing chronology.
- Emphasize verified metrics through weight and color, not oversized metric cards.

The source data should distinguish `summary`, `highlights`, and optional `recognition` so presentation rules do not depend on parsing prose.

### Publications

Each publication keeps its current year-grouped editorial layout and gains an optional citation disclosure.

- Keep title, authors, abstract, tags, status, venue, and outbound publication links.
- Continue to emphasize Akhil's name in the author list, with enough contrast to remain visible without using a second accent.
- Add a compact `Citation` disclosure only when verified citation data exists.
- Inside the disclosure, provide `Copy citation` and `Copy BibTeX` controls.
- Store citation text and BibTeX explicitly in publication data. Do not synthesize incomplete citation records at click time.
- Use an `aria-live` status message for copy success or failure.
- If the Clipboard API is unavailable, reveal selectable citation text and instruct the visitor to copy it manually.

Publication controls remain rectangular and use the established 4px radius. They do not become a row of pills.

### Writings

The writing archive is reduced without deleting source material.

- Feature exactly two current research pieces: `Density vs. Diversity in Data Selection` and `Creating a Reasoning Dataset with No Budget`.
- Do not repeat featured pieces in the archive below.
- Keep current research notes and technical essays visible as grouped archive rows.
- Place `Older Learning Notes` inside a native disclosure that is collapsed by default.
- Keep category counts, but remove controls whose only effect is duplicating the grouped navigation already visible on the page.
- Retain all existing Markdown files and provide a reachable link for every listed article.

### Responsive navigation and article reader

The portfolio rail breakpoint remains unchanged. The article reader receives a more deliberate compact navigation treatment:

- Above 1280px, keep the full fixed article rail.
- From 721px through 1280px, keep the author link and expose the table of contents through an `Article index` disclosure in the horizontal header.
- At 720px and below, use the same disclosure in a compact sticky bar with a single-line article title context.
- Opening the index must not move the page horizontally or trap focus.
- The active heading remains exposed through `aria-current` inside the open index.

### Accessibility refinements

- Raise the `--dim` token from `#687069` to `#788179`, which provides approximately 4.8:1 contrast against the base surface.
- Do not use text below 12px for information that must be read.
- Preserve visible focus styling on every new disclosure, citation control, and artifact link.
- Give all evidence images descriptive alt text and explicit width and height.
- Decorative background layers remain hidden from assistive technology and forced-colors mode.
- Clipboard status updates must be announced without stealing focus.

## Stage 2: Production delivery and discoverability

### Build architecture

Keep the site deployable as static files from GitHub Pages while removing browser-side JSX compilation.

- Add a small local build pipeline using esbuild.
- Create two browser bundles: one for the portfolio and one for the article reader.
- Bundle production React and ReactDOM locally so the pages no longer depend on development UMD scripts.
- Include `marked` only in the article-reader bundle.
- Remove Babel Standalone, development React, development ReactDOM, and the production TweaksPanel from page markup.
- Keep the approved tweak values as normal design tokens rather than runtime configuration.
- Commit built browser assets so direct static hosting continues to work without requiring a server-side runtime.
- Provide `npm run build`, `npm run check`, and `npm run serve` commands.

The build migration must not rename section anchors or the resume URL. Source organization may change, but generated output remains static and portable.

### Fonts

- Self-host only Newsreader, Geist, and JetBrains Mono in WOFF2 format.
- Include only weights used by the final CSS.
- Use `font-display: swap` and durable fallback stacks.
- Remove Instrument Serif and EB Garamond after the tweak controls are deleted.
- Preload only the above-the-fold Newsreader and Geist files that materially affect the hero.

### Portrait and evidence media

- Keep the original PNG as the archival source.
- Produce 480px and 960px WebP derivatives for the portrait.
- Serve the portrait through `picture` or `srcset`, with the original PNG as fallback.
- Reserve the 960 by 995 intrinsic ratio, set `decoding="async"`, and set high fetch priority because the portrait is above the fold.
- Lazy-load evidence images below the hero and provide explicit dimensions.
- Keep media compression visually lossless at normal display sizes.

### Metadata and routes

The homepage keeps `/` as its canonical URL. Article discovery moves from query-only URLs to generated static routes while preserving legacy access.

- Generate one static article page at `/writing/<slug>/index.html` for each listed Markdown article.
- Change internal writing links to the generated clean routes.
- Keep `writing.html?file=<filename>` working as a compatibility entry that redirects or resolves to the equivalent canonical article.
- Add article-specific title, description, canonical URL, Open Graph fields, and Twitter card fields to every generated page.
- Add homepage `Person` structured data using only verified portfolio data.
- Add `ScholarlyArticle` structured data only for publications with complete verified metadata.
- Generate `sitemap.xml` from the homepage and article route list.
- Add a permissive `robots.txt` that points to the sitemap.
- Add a useful static `404.html` with links to the homepage, publications, writings, and contact.

The clean article routes are an intentional URL addition. Existing query URLs remain functional so old links do not break.

### Social preview

Create a dedicated 1200 by 630 Open Graph image using the existing portrait, off-black surface, warm accent, name, and research positioning. It should read clearly at small preview sizes and must not imitate a dashboard. The homepage and article pages may share the image initially; article-specific preview images are out of scope for this pass.

## Data and component boundaries

Keep content facts separate from rendering behavior.

- `portfolioData` owns professional experience, publications, artifacts, writings, contact data, and verified citation records.
- Shared identity fields such as location render from `portfolioData`; components must not maintain stale hard-coded copies.
- `ArtifactMedia` renders an optional real image or verified chart with alt text and caption.
- `ExperienceEntry` renders the role mandate, selected highlights, and optional recognition.
- `PublicationCitation` owns disclosure state, clipboard behavior, and accessible status feedback.
- `WritingArchive` separates featured, current, technical, and older entries without duplicating records.
- `ArticleIndex` provides the fixed-rail and compact-disclosure variants from the same heading data.
- Build scripts own static article generation, metadata injection, sitemap generation, and bundle output.

The component names describe responsibilities rather than prescribing a framework-specific folder tree. The implementation plan may refine file boundaries while preserving these interfaces.

## Error and fallback behavior

- A missing artifact media file omits the media block and leaves a complete typographic entry. It never renders a broken placeholder.
- A failed citation copy leaves citation text visible, announces the failure, and preserves manual selection.
- A missing Markdown article builds a failure report and causes `npm run build` to exit nonzero instead of publishing an empty page.
- Incomplete publication metadata omits structured-data or citation features for that item rather than inventing values.
- Font loading failure falls back to Georgia for display and the system sans or monospace stack for body and metadata.
- Browsers without backdrop filtering keep the existing solid reading-plane fallback.
- Legacy writing URLs resolve to their canonical route. Unknown files render the designed not-found state.

## Verification and acceptance criteria

### Source and build

- `npm run build` completes from a clean checkout.
- `npm run check` validates JavaScript, local links, required assets, duplicate article slugs, and visible interface dash characters.
- No page loads Babel Standalone or a React development build.
- The browser console has no application errors or development-runtime warnings.
- Every listed article has a generated route, title, canonical link, and description.

### Visual and responsive

- Inspect the homepage at 375px, 768px, 1111px, 1280px, and 1440px.
- Inspect one long article at 375px, 768px, and 1280px.
- The hero and both actions remain visible in the initial desktop viewport.
- The left rail never overlaps the hero.
- No page has horizontal overflow.
- The article index remains reachable without clipped navigation text.
- Research evidence images remain subordinate to the content and do not resemble decorative dashboard previews.
- The current background, reading plane, grid density, palette, type hierarchy, and motion level remain recognizably unchanged.

### Content and interaction

- The current Perfios role displays no more than three contribution bullets.
- Featured writings appear once and older learning notes are collapsed initially.
- All publication, artifact, profile, resume, mail, and article links resolve.
- The hero, About section, metadata, and footer use one verified current location value.
- Citation copy success and failure work with keyboard input and assistive status output.
- Every metric shown on the site matches a cited portfolio, resume, paper, repository, dataset, or competition source.

### Accessibility and performance

- Small meaningful text meets WCAG AA contrast against its actual surface.
- Keyboard focus is visible and follows logical DOM order.
- Reduced-motion, reduced-transparency, and forced-colors behavior remain intact.
- The portrait reserves its layout space and produces no visible layout shift.
- Run Lighthouse against the production build and target LCP below 2.5 seconds, CLS below 0.1, and no critical accessibility failures.

### Local handoff

- Start the production build on localhost and leave the server running.
- Provide the final local URL for user exploration.

## Out of scope

- Another theme, background, hero, or navigation redesign
- Pure black surfaces or removal of the reading plane and grid
- A light-mode toggle
- A CMS, analytics platform, contact form, comments, or search service
- New professional claims, unverified metrics, or rewritten publication abstracts
- Generated fake project screenshots or decorative research charts
- Article-specific social preview images
- Deleting legacy article URLs or Markdown source files
- Deployment, pushing, or changing GitHub Pages settings
