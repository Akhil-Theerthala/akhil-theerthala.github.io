import { projectSlug, publicationSlug } from "./content.mjs";

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const e = escapeHtml;
const external = (href) => /^https?:/.test(href);
const newTab = (href) =>
  external(href) ? ' target="_blank" rel="noreferrer"' : "";
const newTabNote = (href) =>
  external(href) ? '<span class="sr-only"> (opens in a new tab)</span>' : "";

const icon = {
  sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/></svg>',
  menu: '<svg class="menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
  close: '<svg class="close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
};

/* ---------- Shell ---------- */

// The mark: a gold T (a surveyor's level bar and plumb stem) in front of the
// legs of an A. Drawn on a 23 by 22 pixel grid, so show it at exactly that size.
const mark = '<svg class="wordmark-mark" viewBox="0 0 23 22" width="23" height="22" aria-hidden="true"><path fill="currentColor" d="M10 5H13L22 20H18.5L11.5 8.33L4.5 20H1Z"/><path class="accent" d="M2 2H21V5H13V20H10V5H2Z"/></svg>';

export function layout({
  title,
  description,
  canonical,
  root,
  page,
  body,
  ogType = "website",
  structuredData,
  noindex = false,
  extraHead = "",
}) {
  const siteImage = "https://akhiltheerthala.com/assets/social/akhil-theerthala-og.png";
  const siteImageAlt =
    "The AT mark, the name Akhil Theerthala and the title Applied data scientist, beside a map of nine areas of his work, such as document AI and LLM evaluation.";
  return `<!doctype html>
<html lang="en" data-page="${page}" data-root="${root}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${e(title)}</title>
    <meta name="description" content="${e(description)}" />
    ${noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${canonical}" />`}
    <meta property="og:title" content="${e(title)}" />
    <meta property="og:description" content="${e(description)}" />
    <meta property="og:type" content="${ogType}" />
    ${canonical ? `<meta property="og:url" content="${canonical}" />` : ""}
    <meta property="og:site_name" content="Akhil Theerthala" />
    <meta property="og:image" content="${siteImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${siteImageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:creator" content="@thesilvervein" />
    <meta name="twitter:image" content="${siteImage}" />
    <meta name="twitter:image:alt" content="${siteImageAlt}" />
    <meta name="theme-color" content="#0c0f0d" />
    <link rel="icon" href="${root}favicon.ico" sizes="48x48" />
    <link rel="icon" href="${root}favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${root}apple-touch-icon.png" />
    <link rel="preload" href="${root}assets/fonts/plex-sans-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${root}assets/css/site.css" />
    <script>
      (function () {
        var d = document.documentElement, t;
        try { t = localStorage.getItem("theme"); } catch (_) {}
        // Dark is the site's own look; light is there for anyone who switches.
        d.dataset.theme = t === "light" ? "light" : "dark";
        d.classList.add("js");
        // If the site script never runs, show everything the reveal animation hides.
        setTimeout(function () { if (!window.__siteReady) d.classList.remove("js"); }, 2500);
      })();
    </script>
    ${extraHead}
    ${structuredData ? `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n    </script>` : ""}
    <script defer src="${root}assets/js/site.js"></script>
  </head>
  <body>
    <div class="ground" aria-hidden="true"><i class="ground-cols"></i><i class="ground-ticks"></i><i class="ground-spot"></i><i class="ground-contour"></i><i class="ground-contour"></i></div>
    <a class="skip-link" href="#main-content">Skip to main content</a>
${nav(root, page)}
    <main id="main-content">
${body}
    </main>
${footer(root)}
  </body>
</html>
`;
}

const sections = [
  ["about", "About"],
  ["cv", "Experience"],
  ["work", "Projects"],
  ["research", "Papers"],
  ["writings", "Writing"],
  ["contact", "Contact"],
];

// Inner pages mark the homepage section they belong to.
const pageSection = { article: "writings", writing: "writings", artifact: "work" };

function nav(root, page) {
  const home = page === "home" ? "" : root || "./";
  // The header's button is gold except while the contact block's own email
  // button is on screen (src/site.js).
  return `    <header class="site-nav">
      <div class="wrap">
        <a class="wordmark" href="${root || "./"}" aria-label="Akhil Theerthala, home">${mark}<span class="wordmark-text">Akhil Theerthala</span></a>
        <nav aria-label="Sections">
          <ul class="nav-links" id="site-menu">
            ${sections.map(([id, label]) => `<li><a href="${home}#${id}" data-section="${id}"${pageSection[page] === id ? ' aria-current="page"' : ""}>${label}</a></li>`).join("\n            ")}
          </ul>
        </nav>
        <div class="nav-actions">
          <button class="icon-btn theme-toggle" type="button" aria-label="Switch between light and dark theme">${icon.sun}${icon.moon}</button>
          <a class="btn btn-primary btn-small nav-cta" href="mailto:akhiltvsn@gmail.com">Email me</a>
          <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Menu">${icon.menu}${icon.close}</button>
        </div>
      </div>
    </header>`;
}

function footer(root) {
  return `    <footer class="site-footer">
      <div class="wrap">
        <p>© 2026 Akhil Theerthala, Bengaluru</p>
        <nav aria-label="Profiles">
          <a href="https://github.com/Akhil-Theerthala" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://huggingface.co/Akhil-Theerthala" target="_blank" rel="noreferrer">Hugging Face</a>
          <a href="https://scholar.google.com/citations?user=_H1O3ScAAAAJ&amp;hl=en" target="_blank" rel="noreferrer">Google Scholar</a>
          <a href="https://www.linkedin.com/in/akhil-theerthala/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://x.com/thesilvervein" target="_blank" rel="noreferrer">X</a>
          <a href="${root}writing.html">All writing</a>
        </nav>
      </div>
    </footer>`;
}

// "of" names the work that a generic label such as "Dataset" belongs to.
const linkButton = (link, cls = "btn", of = "") =>
  `<a class="${cls}" href="${e(link.href)}"${newTab(link.href)}>${e(link.label)}${of ? `<span class="sr-only">: ${e(of)}</span>` : ""}${newTabNote(link.href)}</a>`;

const mapButton = (source) =>
  `<button class="map-link" type="button" data-show-source="${e(source)}">${icon.target}Show on map</button>`;

/* ---------- Homepage ---------- */

function emphasise(text, phrases = []) {
  let html = e(text);
  for (const phrase of phrases) {
    html = html.replace(e(phrase), `<strong>${e(phrase)}</strong>`);
  }
  return html;
}

function authorsHtml(authors, me) {
  return authors
    .map((name) => (name === me ? `<strong>${e(name)}</strong>` : e(name)))
    .join(", ");
}

function formatMonth(released) {
  const [year, month] = released.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(year, month - 1));
}

function datasetViewer(sample, label) {
  return `<div class="window dataset" data-ui data-nosnippet>
            <div class="window-bar"><i></i><i></i><i></i><span>${e(label)}</span></div>
            <table>
              <thead><tr>${sample.columns.map((column, index) => `<th class="${index === 0 ? "col-cat" : index === 2 ? "col-resp" : ""}">${e(column)}</th>`).join("")}</tr></thead>
              <tbody>
                ${sample.rows.map((row) => `<tr>${sample.columns.map((column) => `<td>${e(row[column])}</td>`).join("")}</tr>`).join("\n                ")}
              </tbody>
            </table>
            <div class="dataset-foot"><a class="text-link" href="${e(sample.url)}" target="_blank" rel="noreferrer">Open on Hugging Face<span class="sr-only"> (opens in a new tab)</span></a></div>
          </div>`;
}

function metricsHtml(metrics) {
  return `<dl class="metrics">
            ${metrics.map((metric) => `<div><dt>${e(metric.label)}</dt><dd${metric.value.length > 8 ? ' class="long"' : ""}>${e(metric.value)}</dd></div>`).join("\n            ")}
          </dl>`;
}

function projectMedia(project, samples) {
  const slug = projectSlug(project);
  if (project.title === "LocalXiv") {
    return `<figure class="cover">
            <img src="assets/media/localxiv-cover.webp" width="1920" height="1200" loading="lazy" decoding="async" alt="LocalXiv on macOS: Attention Is All You Need open in the dark reader with its contents sidebar, and the paper's Overview figure in a second window." />
          </figure>`;
  }
  if (slug.startsWith("density")) {
    return `<figure class="dvd" data-dvd>
            <div class="dvd-head">
              <figcaption><b>Ten questions per image, or one</b><span>7,500 questions and 15k samples in each set</span></figcaption>
              <div class="segmented" role="group" aria-label="Curation strategy">
                <button type="button" aria-pressed="false" data-mode="dense">Dense</button>
                <button type="button" aria-pressed="true" data-mode="diverse">Diverse</button>
              </div>
            </div>
            <canvas aria-label="Each square stands for 25 images and each dot for 25 questions. Diverse mode spreads the questions over 300 squares, one dot each. Dense mode packs them into 30 squares, ten dots each."></canvas>
            <div class="dvd-readout"><span data-readout><b>7,500</b> images, <b>1</b> question each</span><span class="dvd-key"><i class="sq" aria-hidden="true"></i>25 images<i class="dot" aria-hidden="true"></i>25 questions</span></div>
            <dl class="dvd-findings">
              <div><dt>≥3.2%</dt><dd>Diverse beats dense on the in-domain test set</dd></div>
              <div><dt>&lt;5%</dt><dd>How far dense falls behind diverse, with a tenth of the images</dd></div>
              <div><dt>OOD</dt><dd>On the out-of-domain RealWorldQA benchmark, dense data hurt the reasoning model</dd></div>
            </dl>
          </figure>`;
  }
  if (slug.startsWith("kuvera")) {
    return datasetViewer(samples.kuvera, "Kuvera-PersonalFinance-V2.1 · train");
  }
  if (slug.startsWith("themis")) {
    return datasetViewer(samples.themis, "Themis_Scales · train");
  }
  if (project.evidence?.kind === "drivers") return driversFigure(project.evidence);
  return "";
}

// Ranked feature importances in panels, with flagged rows and a noise band.
function driversFigure({ label, caption, panels, notes }) {
  const row = (item) => `<li${item.flag ? ' class="flagged"' : ""} style="--v:${item.value}">
                    <span class="drivers-row">
                      <span class="drivers-label">${e(item.label)}${item.flag ? `<sup>${e(item.flag)}</sup>` : ""}</span>
                      ${item.effect ? `<span class="drivers-effect">${e(item.effect)}</span>` : ""}
                    </span>
                    <span class="drivers-track" aria-hidden="true"><i></i></span>
                    <span class="drivers-value">${item.value.toFixed(2)}</span>
                  </li>`;
  const panel = (p) => `<section class="drivers-panel">
                <p class="drivers-title">${e(p.title)}</p>
                <p class="drivers-meta">${e(p.meta)}</p>
                <ol class="drivers-bars${p.noise ? " has-noise" : ""}" aria-label="${e(p.title)}"${p.noise ? ` style="--noise:${p.noise}"` : ""}>
                  ${p.rows.map(row).join("\n                  ")}
                </ol>
                ${p.foot ? `<p class="drivers-foot">${e(p.foot)}</p>` : ""}
              </section>`;
  const mark = (m) => (m === "noise" ? '<i class="swatch" aria-hidden="true"></i>' : `<b>${e(m)}</b>`);
  return `<figure class="drivers">
            <figcaption><b>${e(label)}</b><span>${e(caption)}</span></figcaption>
            <div class="drivers-panels">
              ${panels.map(panel).join("\n              ")}
            </div>
            <ul class="drivers-notes">
              ${notes.map((note) => `<li>${mark(note.mark)}<span>${e(note.text)}</span></li>`).join("\n              ")}
            </ul>
          </figure>`;
}

function achievementHtml(item, index) {
  const mark = item.mark
    ? `<div class="big-result" data-sparkle><canvas aria-hidden="true"></canvas><div><b>${e(item.mark[0])}</b><span>${e(item.mark[1])}</span></div></div>`
    : `<div class="award-mark">${icon.award}</div>`;
  // The site's own page, when there is one, is the primary button.
  const ordered = [...(item.links || [])].sort((a, b) => Number(external(a.href)) - Number(external(b.href)));
  const links = ordered.map((link, i) => linkButton(link, i === 0 ? "btn btn-small btn-primary" : "btn btn-small")).join("");
  return `<li class="achievement${item.mark ? "" : " compact"} reveal"${item.id ? ` id="achievement-${e(item.id)}"` : ""} style="--i:${index}">
            ${mark}
            <div>
              <p class="kicker">${[item.date, item.org].filter(Boolean).map(e).join(" · ")}</p>
              <h3>${e(item.title)}</h3>
              <p>${e(item.detail)}</p>
              ${links ? `<div class="project-links">${links}</div>` : ""}
            </div>
          </li>`;
}

function projectHtml(project, samples, index) {
  const slug = projectSlug(project);
  const metrics = project.evidence?.metrics?.length ? metricsHtml(project.evidence.metrics) : "";
  // The site's own case study is the primary action; the project's links follow.
  const actions = [
    project.story && `<a class="btn btn-primary" href="artifacts/${project.slug}/">Case study<span class="sr-only">: ${e(project.title)}</span></a>`,
    ...(project.links || []).map((link, i) => linkButton(link, i === 0 && !project.story ? "btn btn-primary" : "btn", project.title)),
    mapButton(`project:${slug}`),
  ].filter(Boolean);
  return `        <article class="project reveal" id="project-${slug}" style="--i:${index % 2}">
          <div class="project-media">
          ${projectMedia(project, samples)}
          </div>
          <div class="project-text">
            <p class="kicker project-kicker"><i aria-hidden="true"></i>${e(project.kicker)} · ${e(formatMonth(project.released))}</p>
            <h3>${e(project.title)}</h3>
            <p class="project-desc">${e(project.summary || project.desc)}</p>
            ${metrics}
            <div class="project-links">
              ${actions.join("\n              ")}
            </div>
          </div>
        </article>`;
}

const paperImages = {
  "synthesizing-behaviorally-grounded-reasoning-chains-a": "paper-behaviorally-grounded.webp",
  "finforge-semi-synthetic-financial-benchmark-generation": "paper-finforge.webp",
  "role-steering-of-language-models-for": "paper-role-steering.webp",
};

// Author order understates shared work, so co-authored papers say what the
// contribution was. Unreleased papers have no final author list yet.
function authorship(publication, me) {
  if (!publication.arxiv) return "";
  return publication.authors[0] === me ? "First author" : "Major contribution";
}

// A typeset first page for a paper with no public PDF yet.
function draftThumb(publication) {
  const authors = publication.authors.length > 4
    ? `${publication.authors.slice(0, 4).join(", ")} et al.`
    : publication.authors.join(", ");
  return `<div class="pub-thumb draft" aria-hidden="true" data-nosnippet>
              <div class="draft-page">
                <p class="draft-title">${e(publication.title)}</p>
                <p class="draft-authors">${e(authors)}</p>
                <p class="draft-heading">Abstract</p>
                <span class="draft-lines"></span>
                <span class="draft-cols"><i></i><i></i></span>
              </div>
              <span class="draft-stamp">Unreleased</span>
            </div>`;
}

function publicationHtml(publication, me, index) {
  const slug = publicationSlug(publication);
  const image = paperImages[slug];
  const thumb = image
    ? `<div class="pub-thumb"><img src="assets/media/${image}" width="960" height="1242" loading="lazy" decoding="async" alt="First page of ${e(publication.title)}" /></div>`
    : draftThumb(publication);
  const title = publication.arxiv
    ? `<a href="${e(publication.arxiv)}" target="_blank" rel="noreferrer">${e(publication.title)}<span class="sr-only"> (opens in a new tab)</span></a>`
    : e(publication.title);
  const actions = [
    publication.arxiv && `<a class="btn btn-small btn-primary" href="${e(publication.arxiv)}" target="_blank" rel="noreferrer">arXiv<span class="sr-only"> (opens in a new tab)</span></a>`,
    publication.bibtex && `<button class="btn btn-small copy-btn" type="button" data-copy="${e(publication.bibtex)}" data-copied-label="BibTeX copied">Copy BibTeX</button>`,
    publication.citation && `<button class="btn btn-small copy-btn" type="button" data-copy="${e(publication.citation)}" data-copied-label="Citation copied">Copy citation</button>`,
    mapButton(`paper:${slug}`),
  ].filter(Boolean);
  return `          <li class="pub reveal" id="paper-${slug}" style="--i:${index}">
            ${thumb}
            <div>
              <p class="pub-venue"><i aria-hidden="true"></i>${e(publication.venue)}${authorship(publication, me) ? `<span class="pub-role">${e(authorship(publication, me))}</span>` : ""}</p>
              <h3>${title}</h3>
              <p class="pub-authors">${authorsHtml(publication.authors, me)}</p>
              <details><summary>Abstract</summary><p>${e(publication.abstract)}</p></details>
              <ul class="tags" aria-label="Topics">${publication.tags.map((tag) => `<li>${e(tag)}</li>`).join("")}</ul>
              <div class="pub-actions">${actions.join("")}</div>
            </div>
          </li>`;
}

function paperGroups(data) {
  const first = data.publications.filter((publication) => publication.authors[0] === data.name);
  const contributed = data.publications.filter((publication) => publication.authors[0] !== data.name);
  const group = (title, items, kind) => `<div class="pub-group ${kind}">
            <h3 class="pub-group-head reveal">${title}</h3>
            <ol class="pubs">
${items.map((publication, index) => publicationHtml(publication, data.name, index)).join("\n")}
            </ol>
          </div>`;
  return [
    first.length && group("First-author work", first, "first-author"),
    contributed.length && group("Major contributions", contributed, "contributed"),
  ].filter(Boolean).join("\n          ");
}

// Roles flagged "other" collapse under the main timeline. None are at present.
function otherRoles(roles) {
  const other = roles.filter((role) => role.other);
  if (!other.length) return "";
  return `<details class="other-roles">
            <summary>Other roles</summary>
            <ol class="timeline">
${other.map(roleHtml).join("\n")}
            </ol>
          </details>`;
}

function roleHtml(role) {
  const highlights = role.highlights
    .map((item) => `<li>${emphasise(item, role.emphasis)}</li>`)
    .join("\n              ");
  return `          <li class="role reveal${role.date.includes("Present") ? " current" : ""}">
            <time>${e(role.date)}</time>
            <div>
              <h3>${e(role.title)} <span>${e(role.org)}</span></h3>
              <ul>
              ${highlights}
              </ul>
            </div>
          </li>`;
}

// A section head: the title under a ruled line with a gold tick.
function sectionHead(title) {
  return `<div class="section-head reveal"><h2>${title}</h2></div>`;
}

function essayRow(article) {
  return `<li><a href="writing/${article.slug}/"><span>${e(article.title)}</span><span class="meta">${e(article.date)}</span><span class="meta read">${e(article.read)}</span></a></li>`;
}

// About lives in a dialog over the map, opened from the name, the chip and
// the nav. The close button comes first so opening it focuses that, not a link.
function aboutDialog(data, profiles) {
  return `<dialog class="about-dialog" id="about" aria-labelledby="about-title">
          <div class="card-body">
            <button class="icon-btn card-close" type="button" aria-label="Close" data-close-about autofocus>${icon.close}</button>
            <div class="card-side">
              <figure class="card-portrait">
                <picture>
                  <source type="image/webp" srcset="assets/media/profile-480.webp 480w, assets/media/profile-960.webp 960w" sizes="(max-width: 720px) 96px, 272px" />
                  <img src="assets/media/profile-960.webp" width="960" height="995" loading="lazy" decoding="async" alt="${e(data.name)}" />
                </picture>
                <figcaption>${e(data.location)}</figcaption>
              </figure>
              <dl class="card-now">
                ${data.now.map((item) => `<div><dt>${e(item.label)}</dt><dd>${e(item.text)}</dd></div>`).join("\n                ")}
              </dl>
            </div>
            <div class="card-main">
              <div class="card-head">
                <p class="kicker">About</p>
                <h2 id="about-title">${e(data.name)}</h2>
                <p class="card-role">${e(data.currentRole)} · ${e(data.location)}</p>
              </div>
              <div class="card-text">
                ${data.longIntro.map((paragraph) => `<p>${e(paragraph)}</p>`).join("\n                ")}
              </div>
              <h3 class="card-sub">Research interests</h3>
              <ul class="card-interests">
                ${data.researchFocus.map((focus) => `<li>${e(focus.title)}</li>`).join("\n                ")}
              </ul>
              <div class="card-actions">
                <a class="btn btn-primary" href="mailto:${e(data.email)}">Email me</a>
                ${profiles.map((profile) => linkButton(profile)).join("\n                ")}
              </div>
            </div>
          </div>
        </dialog>`;
}

export function homeBody(data, samples, map) {
  const workCounts = { paper: 0, project: 0, role: 0 };
  for (const work of map.works) workCounts[work.kind] += 1;
  const writeups = data.writings.filter((item) => item.onMap);
  const profiles = [...data.researchProfiles, ...data.contactLinks.filter((link) => link.label !== "Email")];

  return `      <section class="hero" id="top" aria-label="Introduction and map of work">
        <div class="hero-intro">
          <p class="hero-kicker">Applied data scientist · Perfios</p>
          <h1><button class="hero-name" type="button" aria-expanded="false" aria-controls="about" data-open-about>${e(data.name)}</button></h1>
          <p class="hero-lede">I build AI that finance can rely on: calibrated LLM safeguards, document intelligence, and the data that trains them.</p>
          <button class="about-chip" type="button" aria-expanded="false" aria-controls="about" data-open-about><img src="assets/media/profile-480.webp" alt="" width="30" height="30" />About me</button>
        </div>
        <div class="map-stage">
          <canvas class="map-canvas" data-map="hero" aria-label="A map of ${map.works.length} works in ${map.areas.length} areas of AI: ${e(map.areas.map((area) => area.name).join(", "))}."></canvas>
          <div class="map-tooltip" role="status" aria-live="polite"></div>
          <noscript><p>The map needs JavaScript. Everything on it is listed further down this page.</p></noscript>
        </div>
        <div class="map-controls">
          <div class="map-legend">
            ${[["paper", "Papers"], ["project", "Projects"], ["role", "Production systems"]].map(([kind, label]) => `<button class="chip" type="button" aria-pressed="true" data-kind="${kind}"><i data-shape="${kind}" aria-hidden="true"></i>${label} <small>${workCounts[kind]}</small></button>`).join("\n            ")}
          </div>
          <div class="map-search">
            <label class="sr-only" for="map-search-input">Search the papers, datasets and projects</label>
            <div class="map-search-field">
              ${icon.search}
              <input id="map-search-input" type="search" autocomplete="off" spellcheck="false" placeholder="Search the map" aria-controls="map-search-results" aria-autocomplete="list" />
              <kbd aria-hidden="true">/</kbd>
            </div>
            <ul class="search-results" id="map-search-results" role="listbox" hidden></ul>
          </div>
        </div>
        ${aboutDialog(data, profiles)}
      </section>

      <section class="section" id="cv">
        <div class="wrap">
          ${sectionHead("Experience")}
          <ol class="timeline">
${data.workExperience.filter((role) => !role.other).map(roleHtml).join("\n")}
          </ol>
          ${otherRoles(data.workExperience)}
        </div>
      </section>

      <section class="section band" id="work">
        <div class="wrap">
          ${sectionHead("Projects")}
          <div class="projects">
${data.projects.map((project, index) => projectHtml(project, samples, index)).join("\n")}
          </div>
        </div>
      </section>

      <section class="section" id="achievements">
        <div class="wrap">
          ${sectionHead("Achievements")}
          <ul class="achievements">
          ${data.achievements.map(achievementHtml).join("\n          ")}
          </ul>
        </div>
      </section>

      <section class="section" id="research">
        <div class="wrap">
          ${sectionHead("Papers")}
          ${paperGroups(data)}
        </div>
      </section>

      <section class="section" id="writings">
        <div class="wrap">
          ${sectionHead("Writing")}
          <div class="featured">
            ${writeups.map((article, i) => `<a class="feature-card reveal" style="--i:${i}" href="writing/${article.slug}/"><canvas data-constellation="essay:${article.slug}" aria-hidden="true"></canvas><p class="kicker">${e(article.date)} · ${e(article.read)} read</p><h3>${e(article.title)}</h3><p>${e(article.excerpt)}</p></a>`).join("\n            ")}
          </div>
          <a class="more-writing reveal" href="writing.html"><span>Technical essays and learning notes</span><span class="meta">${data.writings.length - writeups.length} more on the writing page</span></a>
        </div>
      </section>

      <section class="section" id="education">
        <div class="wrap">
          ${sectionHead("Education")}
          <ul class="education">
            ${data.education.map((item, i) => `<li class="reveal" style="--i:${i}"><time class="kicker">${e(item.date)}</time><h3>${e(item.title)}</h3><p>${e(item.org)}</p></li>`).join("\n            ")}
          </ul>
        </div>
      </section>

      <section class="section" id="contact">
        <div class="wrap">
          <div class="contact reveal">
            <canvas data-map="ambient" aria-hidden="true"></canvas>
            <div class="contact-main">
              <h2>Get in touch</h2>
              <p>Open to applied ML work, research collaborations, and fellowship conversations about reliable AI systems in finance and document intelligence.</p>
              <a class="contact-email" href="mailto:${e(data.email)}">${e(data.email)}</a>
              <div class="contact-actions">
                <button class="btn btn-primary copy-btn" type="button" data-copy="${e(data.email)}" data-copied-label="Email copied">Copy email</button>
                <a class="btn" href="data/Akhil_Theerthala_Resume.pdf" target="_blank" rel="noreferrer">Download CV<span class="sr-only"> (PDF, opens in a new tab)</span></a>
                ${data.contactLinks.filter((link) => link.label !== "Email").map((link) => linkButton(link)).join("\n                ")}
              </div>
            </div>
            <div class="contact-side">
              <p class="kicker">Interested in</p>
              <ul class="interests" aria-label="Collaboration interests">
                ${data.collaborationInterests.map((interest) => `<li>${e(interest)}</li>`).join("\n                ")}
              </ul>
            </div>
          </div>
        </div>
      </section>`;
}

/* ---------- Article ---------- */

function sideMap(sourceId) {
  return `<aside class="side-map" aria-label="This page on the homepage map">
          <h2>On the homepage map</h2>
          <div class="mini-map"><canvas data-map="mini" data-source="${e(sourceId)}" aria-label="The homepage map, with this page's project highlighted"></canvas></div>
          <p class="mini-readout" aria-live="polite">Hover over or tap a point to see its title.</p>
          <div class="nearby" data-nearby="${e(sourceId)}"><h3>Related work</h3><ol></ol></div>
        </aside>`;
}

export function articleBody(article, html, toc) {
  const tocItems = toc
    .map((item) => `<li><a href="#${item.id}"${item.depth > 2 ? ' class="sub"' : ""}>${e(item.text)}</a></li>`)
    .join("");
  return `      <div class="wrap page-top">
        <p class="crumbs"><a href="../../#writings">Writing</a><span aria-hidden="true">/</span><span>${e(article.category)}</span></p>
        <h1 class="page-title">${e(article.title)}</h1>
        ${article.excerpt ? `<p class="page-lede">${e(article.excerpt)}</p>` : ""}
        <p class="page-meta"><span class="dot" aria-hidden="true"></span><span>Akhil Theerthala</span><span>${e(article.date)}</span><span>${e(article.read)} read</span></p>
        ${toc.length ? `<details class="toc-mobile"><summary>On this page</summary><ol>${tocItems}</ol></details>` : ""}
      </div>
      <div class="wrap reader${article.onMap ? "" : " no-aside"}">
        <nav class="toc" aria-label="On this page">${toc.length ? `<p>On this page</p><ol>${tocItems}</ol>` : ""}</nav>
        <article class="prose" data-article-file="${e(article.file)}">
${html}
          <div class="article-foot">
            <p>Send questions or corrections to <a href="mailto:akhiltvsn@gmail.com">akhiltvsn@gmail.com</a>.</p>
            <p><a href="../../writing.html">All writing</a></p>
          </div>
        </article>
        ${article.onMap ? sideMap(`essay:${article.slug}`) : ""}
      </div>`;
}

/* ---------- Artifact ---------- */

export function artifactBody(project, samples, data) {
  const { story } = project;
  const related = (project.related || [])
    .map((link) =>
      external(link.href)
        ? `<li><a href="${e(link.href)}" target="_blank" rel="noreferrer">${e(link.label)}<span class="sr-only"> (opens in a new tab)</span></a></li>`
        : `<li><a href="../../${e(link.href)}">${e(link.label)}</a></li>`,
    )
    .join("\n            ");
  const media = project.slug === "localxiv"
    ? `<figure class="cover"><img src="../../assets/media/localxiv-cover.webp" width="1920" height="1200" decoding="async" alt="LocalXiv on macOS: Attention Is All You Need open in the dark reader with its contents sidebar, and the paper's Overview figure in a second window." /></figure>`
    : datasetViewer(samples.kuvera, "Kuvera-PersonalFinance-V2.1 · train");
  const list = (items) => `<ul>${items.map((item) => `<li>${e(item)}</li>`).join("")}</ul>`;
  const paragraphs = (items) => items.map((item) => `<p>${e(item)}</p>`).join("\n          ");
  return `      <div class="wrap page-top">
        <p class="crumbs"><a href="../../#work">Projects</a><span aria-hidden="true">/</span><span>${e(project.kicker)}</span></p>
        <h1 class="page-title">${e(project.title)}</h1>
        <p class="page-lede">${e(project.summary)}</p>
        <p class="page-meta"><span class="status"><i aria-hidden="true"></i><span class="sr-only">Status: </span>${e(project.status)}</span><span>Released ${e(formatMonth(project.released))}</span></p>
        <div class="project-links">
          ${(project.links || []).map((link, i) => linkButton(link, i === 0 ? "btn btn-primary" : "btn")).join("\n          ")}
        </div>
        <div class="artifact-media">${media}</div>
      </div>
      <div class="wrap reader">
        <nav class="toc" aria-label="On this page"><p>On this page</p><ol>${[["what", "What it is"], ["why", "Why it was needed"], ["built", "What I built"], ["achieved", "What it achieved"], ["status", "Status"], ["related", "Related"]].map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("")}</ol></nav>
        <article class="prose">
          <h2 id="what">What it is</h2>
          ${paragraphs(story.what)}
          <h2 id="why">Why it was needed</h2>
          ${paragraphs(story.why)}
          <h2 id="built">What I built</h2>
          ${list(story.built)}
          <h2 id="achieved">What it achieved</h2>
          ${list(story.achieved)}
          <h2 id="status">Status</h2>
          ${paragraphs(story.status)}
          <h2 id="related">Related</h2>
          <ul>
            ${related}
          </ul>
          <div class="article-foot"><p>Send questions or feedback to <a href="mailto:${e(data.email)}">${e(data.email)}</a>.</p></div>
        </article>
        ${sideMap(`project:${projectSlug(project)}`)}
      </div>`;
}

/* ---------- Writing index and 404 ---------- */

export function writingIndexBody(data) {
  const groups = new Map();
  for (const article of data.writings) {
    if (!groups.has(article.category)) groups.set(article.category, []);
    groups.get(article.category).push(article);
  }
  return `      <div class="wrap page-top">
        <p class="crumbs"><a href="./">Home</a><span aria-hidden="true">/</span><span>Writing</span></p>
        <h1 class="page-title">Writing</h1>
        <p class="page-lede">Essays and notes on machine learning, data curation, and production AI.</p>
      </div>
      <div class="wrap writing-index">
        ${[...groups].map(([category, items]) => `<div class="essay-group"><h2 class="kicker">${e(category)}</h2><ul class="essay-list">${items.map(essayRow).join("")}</ul></div>`).join("\n        ")}
      </div>`;
}

export function notFoundBody() {
  return `      <section class="not-found">
        <canvas data-map="ambient" aria-hidden="true"></canvas>
        <div>
          <h1>Page not found</h1>
          <p>The link may be out of date.</p>
          <nav aria-label="Useful destinations">
            <a class="btn btn-primary" href="/">Home</a>
            <a class="btn" href="/#research">Papers</a>
            <a class="btn" href="/#writings">Writing</a>
            <a class="btn" href="/#contact">Contact</a>
          </nav>
        </div>
      </section>`;
}
