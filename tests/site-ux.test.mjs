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

// The hero intro between its opening tag and the map stage.
function heroIntro(index) {
  const start = index.indexOf('<div class="hero-intro">');
  assert.ok(start > 0, "no hero intro");
  return index.slice(start, index.indexOf('<div class="map-stage">', start));
}

// The About dialog, which sits inside the hero section.
function aboutDialog(index) {
  const start = index.indexOf('<dialog class="about-dialog" id="about" aria-labelledby="about-title">');
  assert.ok(start > 0, "no About dialog");
  const end = index.indexOf("</dialog>", start);
  const heroEnd = index.indexOf("</section>", index.indexOf('<section class="hero"'));
  assert.ok(end < heroEnd, "the About dialog is outside the hero section");
  return index.slice(start, end);
}

const firstWords = (text, n = 6) => text.split(" ").slice(0, n).join(" ");

test("the header carries the one gold email button on every page", () => {
  for (const file of ["index.html", "writing.html"]) {
    const html = read(file);
    const header = html.slice(html.indexOf('<header class="site-nav">'), html.indexOf("</header>"));
    assert.match(header, /<a class="btn btn-primary btn-small nav-cta" href="mailto:/, file);
  }
  const index = read("index.html");
  assert.doesNotMatch(heroIntro(index), /class="btn/);
  // The script dims the header button only while the contact block's is on screen.
  const script = read("src/site.js");
  assert.match(script, /\.contact-actions/);
  assert.doesNotMatch(script, /hero-actions/);
});

test("the hero intro is a kicker, the name, one lede and an About chip", () => {
  const index = read("index.html");
  const intro = heroIntro(index);
  const parts = [
    '<p class="hero-kicker">',
    '<h1><button class="hero-name" type="button" aria-expanded="false" aria-controls="about" data-open-about>Akhil Theerthala</button></h1>',
    '<p class="hero-lede">',
    '<button class="about-chip" type="button" aria-expanded="false" aria-controls="about" data-open-about>',
  ];
  let at = 0;
  for (const part of parts) {
    const next = intro.indexOf(part, at);
    assert.ok(next > at, `missing or out of order: ${part}`);
    at = next;
  }
  assert.match(intro, /<img src="assets\/media\/profile-480\.webp" alt="" width="30" height="30" \/>About me<\/button>/);
  for (const gone of ["hero-proof", "hero-actions", "Download CV", "downloads on Hugging Face", "map-search"]) {
    assert.ok(!intro.includes(gone), `${gone} is still in the hero intro`);
  }
  assert.doesNotMatch(index, /hero-proof|hero-actions/);
  // The search moved into the legend row under the map.
  const controls = index.indexOf('<div class="map-controls">');
  const search = index.indexOf('<div class="map-search">');
  assert.ok(controls > 0 && search > controls && search < index.indexOf("</section>", controls), "the search is not in the map controls");
  assert.match(rule(".search-results"), /bottom: calc\(100% \+ 8px\)/);
});

test("About is a dialog that the name, the chip and the nav open", () => {
  const index = read("index.html");
  assert.doesNotMatch(index, /<section class="section" id="about">/);
  const dialog = aboutDialog(index);
  // The close button comes first, so opening the dialog focuses it rather than a link.
  assert.match(dialog, /<div class="card-body">\s*<button class="icon-btn card-close" type="button" aria-label="Close" data-close-about autofocus>/);
  assert.match(dialog, /<h2 id="about-title">Akhil Theerthala<\/h2>/);
  assert.ok(dialog.includes(`${data.currentRole} · ${data.location}`), "the role line is missing");
  assert.match(dialog, /<img src="assets\/media\/profile-960\.webp" width="960" height="995" loading="lazy" decoding="async" alt="Akhil Theerthala" \/>/);
  assert.ok(dialog.includes(`<figcaption>${data.location}</figcaption>`));
  for (const paragraph of data.longIntro) assert.ok(dialog.includes(firstWords(paragraph, 8)), firstWords(paragraph, 8));
  for (const item of data.now) {
    assert.ok(dialog.includes(`<dt>${item.label}</dt>`), item.label);
    assert.ok(dialog.includes(firstWords(item.text, 4)), item.text);
  }
  assert.match(dialog, /<h3 class="card-sub">Research interests<\/h3>/);
  for (const focus of data.researchFocus) {
    assert.ok(dialog.includes(`<li>${focus.title}</li>`), focus.title);
    // Sentence case: only acronyms stay capitalised after the first word.
    const rest = focus.title.split(" ").slice(1);
    assert.ok(rest.every((word) => word === word.toLowerCase() || word === word.toUpperCase()), `${focus.title} is title case`);
  }
  const profiles = [...data.researchProfiles, ...data.contactLinks.filter((link) => link.label !== "Email")];
  for (const profile of profiles) assert.ok(dialog.includes(`href="${profile.href.replaceAll("&", "&amp;")}"`), profile.label);
  assert.equal((dialog.match(/btn-primary/g) || []).length, 1);
  assert.ok(dialog.includes(`<a class="btn btn-primary" href="mailto:${data.email}">Email me</a>`));
  // No CV, no proof lines: the papers and achievements sections carry those.
  for (const gone of ["Resume.pdf", "Download CV", "downloads", "Workshop papers", "1st of"]) {
    assert.ok(!dialog.includes(gone), `${gone} is in the dialog`);
  }
  const script = read("src/site.js");
  assert.match(script, /showModal\(\)/);
  assert.match(script, /data-open-about/);
  assert.match(script, /data-section="about"/);
  assert.match(script, /location\.hash === "#about"/);
  // A click on the dialog's own scrollbar also targets the dialog, so the
  // backdrop check must test the point against the dialog's box.
  const aboutBlock = script.slice(script.indexOf('$("dialog#about")'), script.indexOf("hashchange"));
  assert.match(aboutBlock, /about\.getBoundingClientRect\(\)/);
  // Styles: a dialog over a blurred map, still for reduced motion.
  assert.match(rule(".about-dialog::backdrop"), /backdrop-filter: blur/);
  assert.match(css, /prefers-reduced-motion: reduce[^}]*\{[^}]*\.about-dialog\[open\]/);
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

test("the Georgia Tech research role sits in the main timeline", () => {
  assert.ok(data.workExperience.every((role) => !role.other));
  const index = read("index.html");
  assert.doesNotMatch(index, /<details class="other-roles">/);
  const timeline = index.slice(index.indexOf('<ol class="timeline">'), index.indexOf("</ol>", index.indexOf('<ol class="timeline">')));
  assert.match(timeline, /Research Volunteer <span>FSIL &amp; HCAI Labs, Georgia Tech<\/span>/);
});

test("small labels are at least 13px and lightly tracked", () => {
  const labels = [
    ".kicker", ".hero-kicker", ".card-now dt", ".card-sub", ".role time", ".metrics dt", ".map-link", ".pub-venue",
    ".pub-group-head", ".drivers-title", ".window-bar", ".card-portrait figcaption", ".chip small", ".tags li",
    ".drivers-value", ".drivers-foot", ".drivers-notes", ".drivers-effect", ".drivers-meta", ".pub-role", ".map-search kbd",
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
