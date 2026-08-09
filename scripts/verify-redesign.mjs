import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

const ambient = read("ambient-field.js");
const portfolioApp = read("portfolio-app.jsx");
const writingApp = read("writing-app.jsx");
const sections = read("portfolio-sections.jsx");
const css = read("portfolio.css");
const data = read("portfolio-data.js");
const indexHtml = read("index.html");
const writingHtml = read("writing.html");

assert.match(ambient, /function CalibrationField/);
assert.match(portfolioApp, /<CalibrationField\s*\/>/);
assert.match(writingApp, /<CalibrationField\s*\/>/);
assert.doesNotMatch(
  portfolioApp,
  /SignalLayer|requestAnimationFrame|addEventListener\(["']scroll/,
);
assert.doesNotMatch(
  writingApp,
  /SignalLayer|requestAnimationFrame|addEventListener\(["']scroll/,
);

assert.match(css, /\.calibration-field/);
assert.doesNotMatch(css, /\.signal-layer|\.signal-trail|\.signal-dot/);
assert.doesNotMatch(css, /grid-template-columns:\s*repeat\(3,\s*1fr\)/);
assert.match(css, /:focus-visible/);
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
assert.match(css, /@media\s*\(forced-colors:\s*active\)/);
assert.match(css, /--surface-fill:/);
assert.match(css, /--surface-grid-x:/);
assert.match(css, /--surface-grid-y:/);
assert.match(css, /--dim:\s*#788179/);
assert.match(css, /\.artifact-evidence/);
assert.match(css, /\.citation/);
assert.match(
  css,
  /\.root::before,[\s\S]*?\.reader-page::before[\s\S]*?backdrop-filter:\s*blur\(7px\)/,
);
assert.match(css, /@media\s*\(prefers-reduced-transparency:\s*reduce\)/);
assert.match(css, /@media\s*\(max-width:\s*1280px\)/);
assert.doesNotMatch(css, /@media\s*\(max-width:\s*1100px\)/);
assert.doesNotMatch(css, /\.rail\s*\{\s*position:\s*static/);
assert.match(
  css,
  /@media\s*\(max-width:\s*1280px\)[\s\S]*?\.rail\s*\{[\s\S]*?position:\s*relative/,
);

assert.doesNotMatch(sections, /§\s*0[1-9]/);
assert.match(sections, /function PublicationCitation/);
assert.match(sections, /function ArtifactEvidence/);
assert.match(sections, /className="older-writing-archive"/);
assert.match(sections, /aria-live="polite"/);
assert.match(portfolioApp, /aria-current=/);
assert.match(writingApp, /aria-current=/);
assert.doesNotMatch(portfolioApp, /TweaksPanel|useTweaks/);

assert.match(data, /Senior Member Data Scientist/);
assert.match(data, /Research Volunteer/);
assert.match(data, /Member Data Scientist/);
assert.match(data, /https:\/\/arxiv\.org\/abs\/2608\.00023/);
assert.match(data, /Role Steering of Language Models for Social Simulations/);

for (const html of [indexHtml, writingHtml]) {
  assert.match(html, /href="portfolio\.css\?v=20260806-2"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:description"/);
  assert.match(html, /property="og:type"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /rel="icon"/);
  assert.doesNotMatch(html, /src="ambient-field\.js"/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com/);
}
assert.match(indexHtml, /src="assets\/js\/portfolio\.js"/);
assert.match(writingHtml, /src="assets\/js\/writing\.js"/);
assert.match(indexHtml, /type="application\/ld\+json"/);

for (const source of [indexHtml, writingHtml, portfolioApp, writingApp, sections]) {
  assert.doesNotMatch(source, /[—–]/);
}

const requiredFiles = [
  "portfolio.css",
  "portfolio-data.js",
  "profile_photo.png",
  "data/Akhil_Theerthala_Resume.pdf",
  "ambient-field.js",
  "portfolio-app.jsx",
  "portfolio-sections.jsx",
  "writing-app.jsx",
  "assets/js/portfolio.js",
  "assets/js/writing.js",
  "assets/media/profile-480.webp",
  "assets/media/profile-960.webp",
  "assets/social/akhil-theerthala-og.png",
  "robots.txt",
  "sitemap.xml",
  "404.html",
];

for (const file of requiredFiles) {
  assert.equal(fs.existsSync(file), true, `Missing local asset: ${file}`);
}

const sectionIds = [
  "top",
  "about",
  "research",
  "cv",
  "education",
  "work",
  "writings",
  "contact",
  "main-content",
];
const combinedMarkup = `${portfolioApp}\n${sections}`;
for (const id of sectionIds) {
  assert.match(combinedMarkup, new RegExp(`id=[{]?['\"]${id}['\"]`));
}

console.log(
  "Redesign pre-flight passed: calibrated field, evidence-led content, production runtime, and local assets verified.",
);
