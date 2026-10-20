import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const violations = [];
const read = (file) => fs.readFileSync(path.join(projectRoot, file), "utf8");
const exists = (file) => fs.existsSync(path.join(projectRoot, file));

function report(condition, message) {
  if (!condition) violations.push(message);
}

function loadData() {
  const context = { window: {} };
  vm.runInNewContext(read("portfolio-data.js"), context, {
    filename: "portfolio-data.js",
  });
  return context.window.PORTFOLIO_DATA;
}

function checkLocalReferences(file, html) {
  const directory = path.dirname(path.join(projectRoot, file));
  for (const [, reference] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(#|data:|mailto:|https?:)/.test(reference)) continue;
    const clean = reference.split(/[?#]/)[0];
    if (!clean) continue;
    let target = reference.startsWith("/")
      ? path.resolve(projectRoot, `.${clean}`)
      : path.resolve(directory, clean);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      target = path.join(target, "index.html");
    }
    report(
      target.startsWith(projectRoot) && fs.existsSync(target),
      `${file}: missing local reference ${reference}`,
    );
  }
  for (const [, srcset] of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const candidate of srcset.split(",")) {
      const source = candidate.trim().split(/\s+/)[0];
      report(
        fs.existsSync(path.resolve(directory, source)),
        `${file}: missing srcset image ${source}`,
      );
    }
  }
}

const data = loadData();
const siteUrl = `https://${read("CNAME").trim()}`;
const pages = ["index.html", "writing.html", "404.html"];
const slugs = new Set();

for (const article of data.writings) {
  report(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug), `Invalid writing slug: ${article.slug}`);
  report(!slugs.has(article.slug), `Duplicate writing slug: ${article.slug}`);
  slugs.add(article.slug);
  report(exists(path.join("My writings", article.file)), `Missing Markdown source: ${article.file}`);

  const route = path.join("writing", article.slug, "index.html");
  report(exists(route), `Missing generated article route: ${route}`);
  if (exists(route)) {
    const html = read(route);
    report(html.includes(`${siteUrl}/writing/${article.slug}/`), `${route}: canonical URL is missing`);
    report(html.includes(`data-article-file="${article.file}"`), `${route}: data-article-file does not match`);
    report(html.includes('<p id="p-0">'), `${route}: article body is not pre-rendered`);
    checkLocalReferences(route, html);
  }
}

for (const project of data.projects.filter((item) => item.story)) {
  const route = path.join("artifacts", project.slug, "index.html");
  report(exists(route), `Missing artifact page: ${route}`);
  if (exists(route)) checkLocalReferences(route, read(route));
}

for (const publication of data.publications) {
  if (!publication.arxiv) {
    report(Boolean(publication.slug), `${publication.title}: slug missing for a paper without arXiv`);
    continue;
  }
  report(Boolean(publication.doi), `${publication.title}: DOI missing`);
  report(Boolean(publication.citation), `${publication.title}: citation missing`);
  report(Boolean(publication.bibtex), `${publication.title}: BibTeX missing`);
}

const production = [...pages.map(read), read("assets/js/site.js")].join("\n");
report(
  !/babel|react\.development|react-dom|fonts\.googleapis\.com/i.test(production),
  "Production output contains a development dependency or remote font",
);

for (const file of pages) {
  const html = read(file);
  checkLocalReferences(file, html);
  // Visible interface copy uses plain hyphens. Quoted dataset rows keep their own text.
  const copy = html.replace(/<div class="window dataset" data-ui[^>]*>[\s\S]*?<\/div>\s*<\/div>/g, "");
  report(!/[—–]/.test(copy), `${file} contains a forbidden visible dash character`);
}

const indexHtml = read("index.html");
for (const id of ["top", "about", "research", "cv", "education", "work", "writings", "contact", "main-content"]) {
  report(indexHtml.includes(`id="${id}"`), `Required section ID is missing: ${id}`);
}
report(indexHtml.includes(`<link rel="canonical" href="${siteUrl}/"`), "Homepage canonical URL is missing");
report(indexHtml.includes('type="application/ld+json"'), "Homepage structured data is missing");

const map = JSON.parse(read("assets/data/map.json"));
report(map.points.length > 0, "The embedding map has no points");
const sourceIds = new Set(map.sources.map((source) => source.id));
for (const article of data.writings.filter((item) => item.onMap)) {
  report(sourceIds.has(`essay:${article.slug}`), `The map is missing ${article.slug}; run uv run scripts/build-map.py`);
}
for (const project of data.projects) {
  report(
    map.sources.some((source) => source.kind === "project" && source.title === project.title),
    `The map is missing ${project.title}; run uv run scripts/build-map.py`,
  );
}

const socialCard = path.join(projectRoot, "assets/social/akhil-theerthala-og.png");
report(fs.existsSync(socialCard), "Open Graph image is missing");
if (fs.existsSync(socialCard)) {
  const buffer = fs.readFileSync(socialCard);
  report(
    buffer.readUInt32BE(16) === 1200 && buffer.readUInt32BE(20) === 630,
    "Open Graph image must be exactly 1200 by 630 pixels",
  );
}

const sitemap = read("sitemap.xml");
report(sitemap.includes(`${siteUrl}/`), "Sitemap is missing the homepage");
for (const article of data.writings) {
  report(sitemap.includes(`${siteUrl}/writing/${article.slug}/`), `Sitemap is missing ${article.slug}`);
}
report(read("robots.txt").includes(`Sitemap: ${siteUrl}/sitemap.xml`), "robots.txt does not point to the sitemap");

if (violations.length > 0) {
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log(
    `Portfolio checks passed: ${data.writings.length} articles, ${data.publications.length} publications, ${map.points.length} map passages, and all local assets verified.`,
  );
}
