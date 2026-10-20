import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const read = (file) => fs.readFileSync(file, "utf8");

function loadData() {
  const context = { window: {} };
  vm.runInNewContext(read("portfolio-data.js"), context, { filename: "portfolio-data.js" });
  return context.window.PORTFOLIO_DATA;
}

const data = loadData();
const pages = ["index.html", "writing.html", "404.html", "artifacts/localxiv/index.html"];
const css = read("assets/css/site.css");

// The first rule block written for a selector, on its own line.
function rule(selector) {
  const at = css.indexOf(`\n${selector} {`);
  assert.ok(at >= 0, `${selector} has no rule`);
  return css.slice(at, css.indexOf("}", at));
}

const property = (block, name) => new RegExp(`${name}:\\s*([^;]+);`).exec(block)?.[1].trim();
const toRem = (value) => {
  const match = /^([\d.]+)(rem|px|em)$/.exec(value);
  assert.ok(match, `${value} is not a plain length`);
  return match[2] === "px" ? Number(match[1]) / 16 : Number(match[1]);
};

const luminance = (hex) => {
  const channel = (c) => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("the header offers section navigation on small screens", () => {
  for (const file of pages) {
    const html = read(file);
    assert.match(html, /<button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu"/, file);
    assert.match(html, /<ul class="nav-links" id="site-menu">/, file);
  }
  const small = css.slice(css.indexOf("@media (max-width: 980px)"));
  assert.match(small, /\.nav-toggle \{[^}]*display: inline-grid/);
  assert.match(small, /\.site-nav\.menu-open nav \{/);
  assert.doesNotMatch(small, /\.nav-links \{\s*display: none;/);
  const script = read("src/site.js");
  assert.match(script, /nav-toggle/);
  assert.match(script, /menu-open/);
  assert.match(script, /"Escape"[\s\S]*menu-open|menu-open[\s\S]*"Escape"/);
});

test("the first screen shows one gold call to action", () => {
  const index = read("index.html");
  const header = index.slice(index.indexOf('<header class="site-nav">'), index.indexOf("</header>"));
  assert.match(header, /<a class="btn btn-small nav-cta" href="mailto:/);
  assert.doesNotMatch(header, /btn-primary/);
  const hero = index.slice(index.indexOf('<div class="hero-actions">'), index.indexOf('<div class="map-search">'));
  assert.equal((hero.match(/btn-primary/g) || []).length, 1);
  // Inner pages have no hero button, so their nav keeps the gold one.
  const writing = read("writing.html");
  const innerHeader = writing.slice(writing.indexOf('<header class="site-nav">'), writing.indexOf("</header>"));
  assert.match(innerHeader, /<a class="btn btn-primary btn-small nav-cta" href="mailto:/);
  assert.match(read("src/site.js"), /hero-actions/);
});

test("the site's own page is a project's primary button", () => {
  const index = read("index.html");
  for (const project of data.projects.filter((item) => item.story)) {
    const start = index.indexOf(`href="artifacts/${project.slug}/"`);
    assert.ok(start > 0, project.slug);
    const article = index.slice(index.lastIndexOf("<article", start), index.indexOf("</article>", start));
    const primary = /class="btn btn-primary" href="([^"]+)"/.exec(article);
    assert.equal(primary?.[1], `artifacts/${project.slug}/`, project.title);
    assert.equal((article.match(/btn-primary/g) || []).length, 1, project.title);
  }
  const achievement = index.slice(index.indexOf('id="achievement-reasoning-dataset-challenge"'), index.indexOf("</li>", index.indexOf('id="achievement-reasoning-dataset-challenge"')));
  const primary = /class="btn btn-small btn-primary" href="([^"]+)"/.exec(achievement);
  assert.equal(primary?.[1], "writing/creating-a-reasoning-dataset-with-no-budget/");
});

test("paper actions keep arXiv and the copy buttons but drop the DOI button", () => {
  const index = read("index.html");
  assert.doesNotMatch(index, /class="btn btn-small" href="https:\/\/doi\.org\//);
  for (const publication of data.publications.filter((item) => item.arxiv)) {
    assert.ok(index.includes(`class="btn btn-small btn-primary" href="${publication.arxiv}"`), publication.title);
    assert.ok(index.includes(`"sameAs": "https://doi.org/${publication.doi}"`), publication.title);
  }
  assert.equal((index.match(/data-copied-label="BibTeX copied"/g) || []).length, 3);
});

test("proof of the work sits under the hero lede", () => {
  const index = read("index.html");
  const lede = index.indexOf('<p class="hero-lede">');
  const proof = /<p class="hero-proof">([\s\S]*?)<\/p>/.exec(index.slice(lede));
  assert.ok(proof, "no hero-proof paragraph after the lede");
  assert.ok(index.indexOf('<p class="hero-proof">') < index.indexOf('<div class="hero-actions">'));
  const text = proof[1].replace(/<[^>]+>/g, "");
  for (const publication of data.publications) {
    assert.ok(text.includes(publication.venue.split(", ").pop()), publication.venue);
  }
  const [first] = data.achievements;
  assert.ok(text.includes(`${first.mark[0]} ${first.mark[1]}`), "first place is missing");
  assert.match(first.downloads, /^\d+k\+$/);
  assert.ok(text.includes(first.downloads), "downloads are missing");
  assert.ok(first.detail.includes(first.downloads.replace("+", "")), "detail and proof disagree on downloads");
  for (const href of ["#research", "#achievements"]) assert.ok(proof[1].includes(`href="${href}"`), href);
});

test("the Georgia Tech research role sits in the main timeline", () => {
  assert.ok(data.workExperience.every((role) => !role.other));
  const index = read("index.html");
  assert.doesNotMatch(index, /<details class="other-roles">/);
  const timeline = index.slice(index.indexOf('<ol class="timeline">'), index.indexOf("</ol>", index.indexOf('<ol class="timeline">')));
  assert.match(timeline, /Research Volunteer <span>FSIL &amp; HCAI Labs, Georgia Tech<\/span>/);
});

test("small labels are at least 13px and lightly tracked", () => {
  const labels = [
    ".kicker", ".now dt", ".role time", ".metrics dt", ".map-link", ".pub-venue", ".pub-group-head",
    ".drivers-title", ".window-bar", ".portrait figcaption", ".chip small", ".tags li", ".drivers-value",
    ".drivers-foot", ".drivers-notes", ".drivers-effect", ".drivers-meta", ".pub-role", ".map-search kbd",
  ];
  for (const selector of labels) {
    const block = rule(selector);
    const size = property(block, "font-size");
    if (size && !size.startsWith("var(")) assert.ok(toRem(size) >= 0.8125, `${selector} is ${size}`);
    const tracking = property(block, "letter-spacing");
    if (tracking) assert.ok(toRem(tracking) <= 0.04, `${selector} tracks ${tracking}`);
  }
  // Only the shortest labels stay in capitals.
  for (const selector of [".kicker", ".metrics dt", ".map-link", ".pub-venue", ".drivers-title"]) {
    assert.equal(property(rule(selector), "text-transform"), undefined, `${selector} is still uppercase`);
  }
  assert.ok(toRem(property(rule(".pub-authors"), "max-width").replace("ch", "em")) <= 72);
});

test("secondary buttons keep a visible ring in the light theme", () => {
  const light = css.slice(css.indexOf(':root[data-theme="light"] {'));
  const lightBlock = light.slice(0, light.indexOf("}"));
  const ring = property(lightBlock, "--ring");
  const bg = property(lightBlock, "--bg");
  assert.ok(ring, "the light theme has no --ring token");
  assert.match(ring, /^#[0-9a-f]{6}$/i);
  assert.ok(contrast(ring, bg) >= 3, `light ring contrast is ${contrast(ring, bg).toFixed(2)}`);
  assert.match(property(rule(":root"), "--ring"), /^var\(--line-2\)$|^#[0-9a-f]{6}$/i);
  assert.match(property(rule(".btn"), "--btn-ring"), /var\(--ring\)/);
  assert.match(rule(".chip"), /var\(--ring\)/);
});
