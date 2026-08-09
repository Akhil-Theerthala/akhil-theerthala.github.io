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
  const references = html.matchAll(/\b(?:href|src)="([^"]+)"/g);
  for (const [, reference] of references) {
    if (
      reference.startsWith("#") ||
      reference.startsWith("data:") ||
      reference.startsWith("mailto:") ||
      reference.startsWith("https://") ||
      reference.startsWith("http://")
    ) {
      continue;
    }

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
}

const data = loadData();
const siteUrl = `https://${read("CNAME").trim()}`;
const slugs = new Set();

for (const article of data.writings) {
  report(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug),
    `Invalid writing slug: ${article.slug}`,
  );
  report(!slugs.has(article.slug), `Duplicate writing slug: ${article.slug}`);
  slugs.add(article.slug);
  report(
    exists(path.join("My writings", article.file)),
    `Missing Markdown source: ${article.file}`,
  );

  const route = path.join("writing", article.slug, "index.html");
  report(exists(route), `Missing generated article route: ${route}`);
  if (exists(route)) {
    const html = read(route);
    report(
      html.includes(`${siteUrl}/writing/${article.slug}/`),
      `${route}: canonical URL is missing`,
    );
    report(
      html.includes(`data-article-file="${article.file}"`),
      `${route}: data-article-file does not match`,
    );
    checkLocalReferences(route, html);
  }
}

for (const publication of data.publications) {
  report(Boolean(publication.arxiv), `${publication.title}: arXiv URL missing`);
  report(Boolean(publication.doi), `${publication.title}: DOI missing`);
  report(Boolean(publication.citation), `${publication.title}: citation missing`);
  report(Boolean(publication.bibtex), `${publication.title}: BibTeX missing`);
}

const productionFiles = [
  "index.html",
  "writing.html",
  "assets/js/portfolio.js",
  "assets/js/writing.js",
];
const production = productionFiles.map(read).join("\n");
report(
  !/babel|react\.development|react-dom\.development|fonts\.googleapis\.com/i.test(
    production,
  ),
  "Production output contains a browser-side development dependency",
);
report(
  !/tweaks-panel\.jsx|portfolio-reader\.jsx/.test(production),
  "Production output references a removed runtime file",
);

for (const file of ["index.html", "writing.html", "404.html"]) {
  checkLocalReferences(file, read(file));
}

const interfaceFiles = [
  "portfolio-app.jsx",
  "portfolio-sections.jsx",
  "writing-app.jsx",
  "index.html",
  "writing.html",
  "404.html",
];
for (const file of interfaceFiles) {
  const source = read(file);
  report(
    !/[—–]/.test(source),
    `${file} contains a forbidden visible dash character`,
  );
}

const sourceMarkup = `${read("portfolio-app.jsx")}\n${read("portfolio-sections.jsx")}`;
for (const id of [
  "top",
  "about",
  "research",
  "cv",
  "education",
  "work",
  "writings",
  "contact",
  "main-content",
]) {
  report(
    new RegExp(`id=[{]?["']${id}["']`).test(sourceMarkup),
    `Required section ID is missing: ${id}`,
  );
}

const indexHtml = read("index.html");
report(
  indexHtml.includes(`<link rel="canonical" href="${siteUrl}/"`),
  "Homepage canonical URL is missing",
);
report(
  indexHtml.includes('type="application/ld+json"'),
  "Homepage structured data is missing",
);

const socialCard = path.join(
  projectRoot,
  "assets/social/akhil-theerthala-og.png",
);
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
  report(
    sitemap.includes(`${siteUrl}/writing/${article.slug}/`),
    `Sitemap is missing ${article.slug}`,
  );
}
report(
  read("robots.txt").includes(`Sitemap: ${siteUrl}/sitemap.xml`),
  "robots.txt does not point to the sitemap",
);

if (violations.length > 0) {
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log(
    `Portfolio checks passed: ${data.writings.length} articles, ${data.publications.length} publications, and all local assets verified.`,
  );
}
