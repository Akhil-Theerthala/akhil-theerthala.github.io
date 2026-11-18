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
  plus: '<svg class="plus" viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M1 5.5h9"/><path d="M5.5 1v9"/></svg>',
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const shortMonths = monthNames.map((name) => name.slice(0, 3));

// "2026-11-18" becomes "18 November 2026".
function longDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

// "Jun 2023" becomes "June 2023".
const longMonth = (date) => {
  const [month, year] = date.split(" ");
  return `${monthNames[shortMonths.indexOf(month)]} ${year}`;
};

// "Jan 2026" becomes 202601, so dated rows can be sorted.
const monthOrder = (date) => {
  const [month, year] = date.split(" ");
  return Number(year) * 100 + shortMonths.indexOf(month) + 1;
};

/* ---------- Shell ---------- */

// Every page is one sheet: a top line, a woven border, the content, a foot.
export function layout({
  title,
  description,
  canonical,
  root,
  page,
  body,
  data,
  ogType = "website",
  structuredData,
  noindex = false,
  extraHead = "",
}) {
  const siteImage = "https://akhiltheerthala.com/assets/social/akhil-theerthala-og.png";
  const siteImageAlt =
    "The AT mark, the name Akhil Theerthala and the title Applied data scientist, beside a map of six areas of his work, such as document AI and data curation.";
  const home = page === "home";
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
    <meta name="theme-color" content="#000000" />
    <link rel="icon" href="${root}favicon.ico" sizes="48x48" />
    <link rel="icon" href="${root}favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${root}apple-touch-icon.png" />
    <link rel="preload" href="${root}assets/fonts/atkinson-next-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${root}assets/css/site.css" />
    <script>
      (function () {
        var d = document.documentElement, t;
        try { t = localStorage.getItem("theme"); } catch (_) {}
        // Dark is the site's own look; light is there for anyone who switches.
        d.dataset.theme = t === "light" ? "light" : "dark";
        d.classList.add("js");
        // If the site script never runs, show everything the script would have opened.
        setTimeout(function () { if (!window.__siteReady) d.classList.remove("js"); }, 2500);
      })();
    </script>
    ${extraHead}
    ${structuredData ? `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n    </script>` : ""}
    <script defer src="${root}assets/js/site.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div class="sheet" id="sheet"${home ? ' data-regions="off"' : ""}>
${topLine(root, page, data)}
      <div class="ribbon" aria-hidden="true"></div>
      <main id="main-content">
${body}
      </main>
${footer(root, page, data)}
      ${home ? '<div class="regions" aria-hidden="true"></div>' : ""}
    </div>
  </body>
</html>
`;
}

const themeToggle = `<button class="icon-btn theme-toggle" type="button" aria-label="Switch between light and dark theme">${icon.sun}${icon.moon}</button>`;

// The home page says what the document is. Inner pages say whose site this is
// and link to the two indexes.
function topLine(root, page, data) {
  if (page === "home") {
    return `      <header class="top" id="top" data-region="page-header">
        <p class="doc"><strong>Curriculum vitae</strong><span>Updated ${e(longDate(data.updated))}</span></p>
        <div class="controls">
          <button class="switch" type="button" role="switch" aria-checked="false" id="regions-switch"><span>Layout regions</span><i aria-hidden="true"></i></button>
          ${themeToggle}
        </div>
      </header>`;
  }
  const link = (href, label, current) =>
    `<a href="${root}${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
  return `      <header class="top" id="top">
        <nav class="doc" aria-label="Site">
          <a class="home-link" href="${root || "./"}">Akhil Theerthala</a>
          ${link("writing.html", "Writing", page === "writing" || page === "article")}
          ${link("map.html", "Map", page === "map")}
        </nav>
        <div class="controls">
          ${themeToggle}
        </div>
      </header>`;
}

function profileLinks(data) {
  return [...data.researchProfiles, ...data.contactLinks.filter((link) => link.label !== "Email")];
}

function footer(root, page, data) {
  // The home page already lists the profiles beside the name.
  const line = page === "home"
    ? `<div class="foot-line"><p>© 2026 Akhil Theerthala, Bengaluru</p></div>`
    : `<div class="foot-line">
          <p>© 2026 Akhil Theerthala, Bengaluru</p>
          <nav aria-label="Profiles">
            ${profileLinks(data).map((link) => `<a href="${e(link.href)}" target="_blank" rel="noreferrer">${e(link.label)}<span class="sr-only"> (opens in a new tab)</span></a>`).join("\n            ")}
            <a href="${root}writing.html">All writing</a>
          </nav>
        </div>`;
  if (page !== "home") {
    return `      <footer class="foot">
        <div class="ribbon" aria-hidden="true"></div>
        ${line}
      </footer>`;
  }
  return `      <footer class="foot" id="contact" data-region="page-footer">
        <div class="ribbon" aria-hidden="true"></div>
        <div class="foot-grid">
          <p class="foot-pitch">Open to applied ML work, research collaborations, and fellowships in financial AI and document AI.</p>
          <div class="actions">
            <a class="btn btn-primary" href="mailto:${e(data.email)}">Email me</a>
            <button class="btn copy-btn" type="button" data-copy="${e(data.email)}" data-copied-label="Address copied">Copy address</button>
            <span class="sr-only" role="status"></span>
            <a class="btn" href="data/Akhil_Theerthala_Resume.pdf" target="_blank" rel="noreferrer">Download résumé<span class="sr-only"> (PDF, opens in a new tab)</span></a>
          </div>
          <p class="small">The layout regions are drawn from this page's own structure, the way a document-layout model labels a page. No model runs here.</p>
        </div>
        ${line}
      </footer>`;
}

// "of" names the work that a generic label such as "Dataset" belongs to.
const linkButton = (link, cls = "btn", of = "") =>
  `<a class="${cls}" href="${e(link.href)}"${newTab(link.href)}>${e(link.label)}${of ? `<span class="sr-only">: ${e(of)}</span>` : ""}${newTabNote(link.href)}</a>`;

/* ---------- Tables ---------- */

// One table: a labelled section, a head strip, banded rows and an optional closing row.
function table({ id, title, columns, rows, total = "", two = false, regions = true }) {
  const region = (name) => (regions ? ` data-region="${name}"` : "");
  const heads = columns
    .map((column, index) => `<span role="columnheader"${index === 2 ? ' class="num"' : ""}>${column}</span>`)
    .join("");
  return `        <section id="${id}" aria-labelledby="${id}-h">
          <h2 class="sec-h" id="${id}-h"${region("section-header")}>${title}</h2>
          <div class="tbl${two ? " two" : ""}" role="table" aria-labelledby="${id}-h"${region("table")}>
            <div class="tr th" role="row">${heads}</div>
${rows.join("\n")}
${total}
          </div>
        </section>`;
}

const row = ({ id = "", when, what, fig }) =>
  `            <div class="tr" role="row" data-row${id ? ` id="${id}"` : ""}>
              <span class="when" role="cell">${when}</span>
              <div class="what" role="cell">${what}</div>
              ${fig === undefined ? "" : `<span class="fig" role="cell">${fig}</span>`}
            </div>`;

const totalRow = (what, fig) =>
  `            <div class="tr total" role="row">
              <span class="when" role="cell">Total</span>
              <span class="what" role="cell"><span>${what}</span></span>
              ${fig === undefined ? "" : `<span class="fig" role="cell"><span class="amt"><b>${fig}</b></span></span>`}
            </div>`;

// A number in gold with what it counts, or a plain note when there is no number.
const figures = (results = [], note = "") =>
  results.length
    ? results.map((item) => `<span class="amt"${item.id ? ` id="${e(item.id)}"` : ""}><b>${e(item.value)}</b> ${e(item.label)}</span>`).join(" ")
    : `<span class="plain">${e(note)}</span>`;

/* ---------- Homepage ---------- */

function emphasise(text, phrases = []) {
  let html = e(text);
  for (const phrase of phrases) {
    html = html.replace(e(phrase), `<strong>${e(phrase)}</strong>`);
  }
  return html;
}

function formatMonth(released) {
  const [year, month] = released.split("-").map(Number);
  return `${shortMonths[month - 1]} ${year}`;
}

// "Apr 2025 - Present" becomes two lines: "Apr 2025", "to now".
function period(date) {
  const [from, to] = date.split(" - ");
  return `<span>${e(from)}</span> <span>${to === "Present" ? "to now" : `to ${e(to)}`}</span>`;
}

// "Aug 2019 - May 2023" becomes "2019 to 2023".
function years(date) {
  const [from, to] = date.split(" - ").map((part) => part.split(" ").pop());
  return `${from} to ${to === "Present" ? "now" : to}`;
}

// Author order understates shared work, so co-authored papers say what the
// contribution was. Unreleased papers have no final author list yet.
function authorship(publication, me) {
  if (!publication.arxiv) return "";
  return publication.authors[0] === me ? "First author" : "Major contribution";
}

function roleRow(role, index) {
  const details = [
    ...role.highlights.map((item) => emphasise(item, role.emphasis)),
    ...(role.recognition ? [e(role.recognition)] : []),
  ];
  return row({
    when: period(role.date),
    what: `
                <button type="button" aria-expanded="false" aria-controls="role-${index}">${e(role.title)}${icon.plus}</button>
                <span class="sub">${e(role.org)}. ${e(role.summary)}</span>
                <ul class="more" id="role-${index}">
                  ${details.map((item) => `<li>${item}</li>`).join("\n                  ")}
                </ul>
              `,
    fig: figures(role.results),
  });
}

// A project's row opens its page on this site when it has one.
function projectHref(project) {
  if (project.story) return `artifacts/${project.slug}/`;
  return project.page || project.links[0].href;
}

function projectRow(project) {
  const href = projectHref(project);
  return row({
    id: `project-${projectSlug(project)}`,
    when: e(formatMonth(project.released)),
    what: `<a href="${e(href)}"${newTab(href)}>${e(project.short || project.title)}${newTabNote(href)}</a><span class="sub">${e(project.line)}</span>`,
    fig: figures(project.results, project.note),
  });
}

function paperRow(publication, me) {
  const name = e(publication.short || publication.title);
  const title = publication.arxiv
    ? `<a href="${e(publication.arxiv)}" target="_blank" rel="noreferrer">${name}<span class="sr-only"> (opens in a new tab)</span></a>`
    : `<strong>${name}</strong>`;
  const sub = [authorship(publication, me), publication.line].filter(Boolean).map((part) => part.replace(/\.$/, "")).join(". ");
  const reference = publication.arxiv ? `arXiv ${publication.arxiv.split("/abs/")[1]}` : "Unreleased";
  return row({
    id: `paper-${publicationSlug(publication)}`,
    when: e(publication.year),
    what: `${title}${sub ? `<span class="sub">${e(sub)}.</span>` : ""}`,
    fig: `<span class="plain">${e(publication.venue)}</span> <span class="ref">${e(reference)}</span>`,
  });
}

export function homeBody(data, map) {
  const roles = data.workExperience;
  const papers = data.publications;
  const essays = data.writings
    .filter((item) => item.onMap)
    .sort((a, b) => monthOrder(b.date) - monthOrder(a.date));
  const firstRole = roles.map((role) => role.date.split(" - ")[0]).sort((a, b) => monthOrder(a) - monthOrder(b))[0];
  const paperYears = papers.map((publication) => Number(publication.year));
  const essayYears = data.writings.map((item) => Number(item.date.split(" ")[1]));
  const studying = data.now.find((item) => item.label === "Studying");

  return `        <div class="head" id="about">
          <h1 data-region="title">${e(data.name)}</h1>
          <p class="lede" data-region="text">I build calibrated LLM safeguards and document-AI systems for finance, and the data that trains them.</p>
          <dl class="facts" data-region="key-value">
            <dt>Now</dt><dd>${e(data.currentRoleShort)}</dd>
            <dt>Based in</dt><dd>${e(data.location)}</dd>
            ${studying ? `<dt>Studying</dt><dd>${e(studying.text.replace(/\.$/, ""))}</dd>` : ""}
            <dt>Email</dt><dd><a href="mailto:${e(data.email)}">${e(data.email)}</a></dd>
            <dt>Résumé</dt><dd><a href="data/Akhil_Theerthala_Resume.pdf" target="_blank" rel="noreferrer">Download the PDF<span class="sr-only"> (opens in a new tab)</span></a></dd>
            <dt>Elsewhere</dt>
            <dd class="links">
              ${profileLinks(data).map((link) => `<a href="${e(link.href)}" target="_blank" rel="noreferrer">${e(link.label.replace("Google ", ""))}<span class="sr-only"> (opens in a new tab)</span></a>`).join("\n              ")}
            </dd>
          </dl>
        </div>

${table({
  id: "cv",
  title: "Experience",
  columns: ["Period", "Role", "Results"],
  rows: roles.map(roleRow),
  total: totalRow(`In applied ML since ${e(longMonth(firstRole))}`, `${roles.length} roles`),
})}

${table({
  id: "work",
  title: "Selected work",
  columns: ["Released", "Project", "Results"],
  rows: data.projects.map(projectRow),
  total: totalRow(
    `The other ${map.works.length - data.projects.length} are drawn on <a href="map.html">the map of all ${map.works.length} works</a>.`,
    `${data.projects.length} shown`,
  ),
})}

${table({
  id: "research",
  title: "Papers",
  columns: ["Year", "Paper", "Venue and reference"],
  rows: papers.map((publication) => paperRow(publication, data.name)),
  total: totalRow(
    `${papers.every((publication) => /workshop/i.test(publication.venue)) ? "Workshop papers" : "Papers"}, ${Math.min(...paperYears)} to ${Math.max(...paperYears)}`,
    `${papers.length} papers`,
  ),
})}

${table({
  id: "writings",
  title: "Writing",
  columns: ["Date", "Essay"],
  two: true,
  rows: essays.map((article) =>
    row({ when: e(article.date), what: `<a href="writing/${article.slug}/">${e(article.title)}</a>` }),
  ),
  total: totalRow(`${essays.length} of ${data.writings.length} shown. <a href="writing.html">All essays</a>, back to ${Math.min(...essayYears)}.`),
})}

${table({
  id: "education",
  title: "Education",
  columns: ["Years", "Degree", "Institute"],
  rows: data.education.map((item) =>
    row({ when: e(years(item.date)), what: `<strong>${e(item.title)}</strong>`, fig: `<span class="plain">${e(item.short || item.org)}</span>` }),
  ),
})}`;
}

/* ---------- Map ---------- */

export function mapBody(map) {
  const counts = { paper: 0, project: 0, role: 0 };
  for (const work of map.works) counts[work.kind] += 1;
  return `        <div class="page-top">
          <h1 class="page-title">Map of work</h1>
          <p class="page-lede">${map.works.length} papers, projects and production systems, each joined to the areas of AI it belongs to and to the works it is linked with. Hover over or tap a point to read about it.</p>
        </div>
        <section aria-label="Map of ${map.works.length} works in ${map.areas.length} areas">
          <div class="map-wrap">
            <div class="map-stage">
              <canvas class="map-canvas" data-map="page" aria-label="A map of ${map.works.length} works in ${map.areas.length} areas of AI: ${e(map.areas.map((area) => area.name).join(", "))}."></canvas>
              <div class="map-tooltip" role="status" aria-live="polite"></div>
              <noscript><p>The map needs JavaScript. Every work on it is also listed on the home page.</p></noscript>
            </div>
          </div>
          <div class="map-controls">
            <div class="map-legend">
              ${[["paper", "Papers"], ["project", "Projects"], ["role", "Production systems"]].map(([kind, label]) => `<button class="chip" type="button" aria-pressed="true" data-kind="${kind}"><i data-shape="${kind}" aria-hidden="true"></i>${label} <small>${counts[kind]}</small></button>`).join("\n              ")}
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
        </section>`;
}

/* ---------- Article ---------- */

export function articleBody(article, html, toc) {
  const tocItems = toc
    .map((item) => `<li><a href="#${item.id}"${item.depth > 2 ? ' class="sub"' : ""}>${e(item.text)}</a></li>`)
    .join("");
  return `        <div class="page-top">
          <p class="crumbs"><a href="../../#writings">Writing</a><span aria-hidden="true">/</span><span>${e(article.category)}</span></p>
          <h1 class="page-title">${e(article.title)}</h1>
          ${article.excerpt ? `<p class="page-lede">${e(article.excerpt)}</p>` : ""}
          <p class="page-meta"><span>Akhil Theerthala</span><span>${e(article.date)}</span><span>${e(article.read)} read</span></p>
          ${toc.length ? `<details class="toc-mobile"><summary>On this page</summary><ol>${tocItems}</ol></details>` : ""}
        </div>
        <div class="reader">
          <nav class="toc" aria-label="On this page">${toc.length ? `<p>On this page</p><ol>${tocItems}</ol>` : ""}</nav>
          <article class="prose" data-article-file="${e(article.file)}">
${html}
            <div class="article-foot">
              <p>Send questions or corrections to <a href="mailto:akhiltvsn@gmail.com">akhiltvsn@gmail.com</a>.</p>
              <p><a href="../../writing.html">All writing</a></p>
            </div>
          </article>
        </div>`;
}

/* ---------- Artifact ---------- */

function datasetViewer(sample, label) {
  return `<div class="window dataset" data-ui data-nosnippet>
            <div class="window-bar"><span>${e(label)}</span></div>
            <table>
              <thead><tr>${sample.columns.map((column, index) => `<th class="${index === 0 ? "col-cat" : index === 2 ? "col-resp" : ""}">${e(column)}</th>`).join("")}</tr></thead>
              <tbody>
                ${sample.rows.map((item) => `<tr>${sample.columns.map((column) => `<td>${e(item[column])}</td>`).join("")}</tr>`).join("\n                ")}
              </tbody>
            </table>
            <div class="dataset-foot"><a class="text-link" href="${e(sample.url)}" target="_blank" rel="noreferrer">Open on Hugging Face<span class="sr-only"> (opens in a new tab)</span></a></div>
          </div>`;
}

export function artifactBody(project, samples, data) {
  const { story } = project;
  const related = (project.related || [])
    .map((link) =>
      external(link.href)
        ? `<li><a href="${e(link.href)}" target="_blank" rel="noreferrer">${e(link.label)}<span class="sr-only"> (opens in a new tab)</span></a></li>`
        : `<li><a href="../../${e(link.href)}">${e(link.label)}</a></li>`,
    )
    .join("\n              ");
  const media = project.slug === "localxiv"
    ? `<figure class="cover"><img src="../../assets/media/localxiv-cover.webp" width="1920" height="1200" decoding="async" alt="LocalXiv on macOS: Attention Is All You Need open in the dark reader with its contents sidebar, and the paper's Overview figure in a second window." /></figure>`
    : datasetViewer(samples.kuvera, "Kuvera-PersonalFinance-V2.1 · train");
  const list = (items) => `<ul>${items.map((item) => `<li>${e(item)}</li>`).join("")}</ul>`;
  const paragraphs = (items) => items.map((item) => `<p>${e(item)}</p>`).join("\n            ");
  return `        <div class="page-top">
          <p class="crumbs"><a href="../../#work">Projects</a><span aria-hidden="true">/</span><span>${e(project.kicker)}</span></p>
          <h1 class="page-title">${e(project.title)}</h1>
          <p class="page-lede">${e(project.summary)}</p>
          <p class="page-meta"><span class="status"><span class="sr-only">Status: </span>${e(project.status)}</span><span>Released ${e(formatMonth(project.released))}</span></p>
          <div class="project-links">
            ${(project.links || []).map((link, i) => linkButton(link, i === 0 ? "btn btn-primary" : "btn")).join("\n            ")}
          </div>
          <div class="artifact-media">${media}</div>
        </div>
        <div class="reader">
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
        </div>`;
}

/* ---------- Writing index and 404 ---------- */

export function writingIndexBody(data) {
  const groups = new Map();
  for (const article of data.writings) {
    if (!groups.has(article.category)) groups.set(article.category, []);
    groups.get(article.category).push(article);
  }
  return `        <div class="page-top">
          <h1 class="page-title">Writing</h1>
          <p class="page-lede">Essays and notes on machine learning, data curation, and production AI.</p>
        </div>
        <div class="writing-index">
${[...groups]
  .map(([category, items], index) =>
    table({
      id: `essays-${index}`,
      title: e(category),
      columns: ["Date", "Essay", "Reading time"],
      // The layout-region layer belongs to the home page alone.
      regions: false,
      rows: items.map((article) =>
        row({
          when: e(article.date),
          what: `<a href="writing/${article.slug}/">${e(article.title)}</a>`,
          fig: `<span class="plain">${e(article.read)}</span>`,
        }),
      ),
    }),
  )
  .join("\n")}
        </div>`;
}

export function notFoundBody() {
  return `        <section class="not-found">
          <h1>Page not found</h1>
          <p>The link may be out of date.</p>
          <nav aria-label="Useful destinations">
            <a class="btn btn-primary" href="/">Home</a>
            <a class="btn" href="/#research">Papers</a>
            <a class="btn" href="/#writings">Writing</a>
            <a class="btn" href="/#contact">Contact</a>
          </nav>
        </section>`;
}
