import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const read = (file) => fs.readFileSync(file, "utf8");
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

function loadData() {
  const context = { window: {} };
  vm.runInNewContext(read("portfolio-data.js"), context, {
    filename: "portfolio-data.js",
  });
  return context.window.PORTFOLIO_DATA;
}

const data = loadData();
const pages = ["index.html", "writing.html", "404.html"];

test("pages are static HTML with one local script and no React runtime", () => {
  for (const file of pages) {
    const html = read(file);
    assert.match(html, /assets\/js\/site\.js/);
    assert.doesNotMatch(html, /babel|\breact(?:-dom)?\b|<div id="root"><\/div>/i);
  }
  const script = read("assets/js/site.js");
  assert.doesNotMatch(script, /react|babel/i);
  for (const removed of ["portfolio-app.jsx", "portfolio-sections.jsx", "writing-app.jsx", "portfolio.css"]) {
    assert.equal(fs.existsSync(removed), false, `${removed} should be gone`);
  }
});

test("the homepage ships its content in the HTML, not only via JavaScript", () => {
  const index = read("index.html");
  for (const text of [
    "Akhil Theerthala",
    "I build AI that finance can rely on",
    "Senior Member Data Scientist",
    "Projects",
    "LocalXiv",
    "Papers",
    "Get in touch",
  ]) {
    assert.ok(index.includes(text), `homepage HTML is missing "${text}"`);
  }
  assert.match(index, /<noscript>/);
  // Content hidden for the reveal animation comes back if the script never runs.
  assert.match(index, /classList\.add\("js"\)/);
  assert.match(index, /if \(!window\.__siteReady\) d\.classList\.remove\("js"\)/);
  assert.match(read("src/site.js"), /window\.__siteReady = true/);
  assert.match(read("assets/css/site.css"), /prefers-reduced-motion: reduce[\s\S]*\.js \.reveal/);
});

test("the map data is real, complete and linked to pages that exist", () => {
  const map = JSON.parse(read("assets/data/map.json"));
  const spec = JSON.parse(read("data/map-areas.json"));
  assert.match(map.model, /MiniLM/);
  assert.ok(map.points.length >= 400, "the map should rest on hundreds of passages");

  // Areas are fields of AI work, named in data/map-areas.json, never a project's name.
  assert.deepEqual(map.areas.map((area) => area.name), spec.areas);
  const titles = [...data.projects, ...data.publications].map((item) => item.title.toLowerCase());
  for (const area of map.areas) {
    assert.ok(!titles.some((title) => title.startsWith(area.name.toLowerCase())), area.name);
    assert.ok(area.x >= 0 && area.x <= 1 && area.y >= 0 && area.y <= 1);
  }

  // One node per work: every paper and project once, nothing twice.
  assert.equal(map.works.length, spec.works.length);
  assert.equal(new Set(map.works.map((work) => work.id)).size, map.works.length);
  // A paper is its own work, or rides on the project it describes as one of its sources.
  for (const publication of data.publications) {
    const own = map.works.some((work) => work.kind === "paper" && work.title === publication.title);
    const source = map.sources.findIndex((item) => item.kind === "paper" && item.title === publication.title);
    const carried = source >= 0 && map.works.some((work) => work.sources.includes(map.sources[source].id));
    assert.ok(own || carried, publication.title);
  }
  for (const project of data.projects) {
    assert.ok(map.works.some((work) => work.title === project.title), project.title);
  }
  const specWorks = Object.fromEntries(spec.works.map((work) => [work.id, work]));
  for (const work of map.works) {
    assert.ok(map.areas[work.area], `${work.id} has no area`);
    assert.ok(work.summary.length > 20, `${work.id} needs a summary`);
    assert.ok(!("angle" in work) && !("near" in work), `${work.id} still carries islands data`);
    assert.ok(work.homes.length >= 1, `${work.id} has no home`);
    assert.equal(work.homes[0][0], work.area, `${work.id}: area must lead its homes`);
    const weights = specWorks[work.id].weights;
    for (const [a, weight] of work.homes) {
      assert.ok(weight >= 0.2, `${work.id}: ${map.areas[a].name} is below the home threshold`);
      assert.equal(weight, weights[map.areas[a].name]);
    }
    assert.equal(Math.max(...Object.values(weights)), weights[map.areas[work.area].name], `${work.id}: area is not a heaviest weight`);
    assert.ok(work.links.every((n) => map.works[n] && map.works[n].links.includes(map.works.indexOf(work))), `${work.id} has a one-way link`);
    if (work.href.startsWith("#")) {
      assert.ok(read("index.html").includes(`id="${work.href.slice(1)}"`), `${work.href} missing on homepage`);
    } else {
      assert.equal(fs.existsSync(path.join(work.href, "index.html")), true, `${work.href} has no page`);
    }
  }
  assert.equal(map.links.length, spec.links.length);
  for (const [a, b, why] of map.links) {
    assert.ok(map.works[a] && map.works[b] && why.length > 10);
  }
  for (const area of map.areas) {
    assert.equal(area.description, spec.descriptions[area.name]);
    assert.equal(area.size, map.works.filter((work) => work.homes.some(([a]) => map.areas[a] === area)).length);
  }

  // Only essays that write up a project or experiment are on the map.
  const ids = new Set(map.sources.map((source) => source.id));
  for (const article of data.writings) {
    assert.equal(ids.has(`essay:${article.slug}`), Boolean(article.onMap), article.slug);
  }
  for (const [x, y, source, area, text, anchor, work] of map.points) {
    assert.ok(x >= 0 && x <= 1 && y >= 0 && y <= 1);
    assert.ok(map.sources[source], "point refers to a missing source");
    assert.ok(work === -1 ? area === -1 : map.works[work].area === area);
    assert.ok(text.length > 20);
    const owner = map.sources[source];
    if (owner.kind === "essay") {
      assert.match(anchor, /^#[a-z0-9-]+$/);
      const html = read(path.join(owner.href, "index.html"));
      assert.ok(html.includes(`id="${anchor.slice(1)}"`), `${owner.href}${anchor} has no target`);
    }
  }
});

test("every writing has a pre-rendered canonical route", () => {
  for (const article of data.writings) {
    assert.equal(fs.existsSync(path.join("My writings", article.file)), true, `${article.file} must exist`);
    const html = read(path.join("writing", article.slug, "index.html"));
    assert.ok(html.includes(`<title>${escapeHtml(article.title)} - Akhil Theerthala</title>`));
    assert.ok(html.includes(`https://akhiltheerthala.com/writing/${article.slug}/`));
    assert.ok(html.includes(`data-article-file="${escapeHtml(article.file)}"`));
    assert.match(html, /\.\.\/\.\.\/assets\/js\/site\.js/);
    assert.match(html, /<p id="p-0">/, `${article.slug} body is not pre-rendered`);
    if (article.onMap) assert.match(html, /data-map="mini"/);
    else assert.doesNotMatch(html, /data-map="mini"/);
  }
});

test("old writing.html?file= links still reach the essay", () => {
  const writing = read("writing.html");
  for (const article of data.writings) {
    assert.ok(writing.includes(JSON.stringify(article.file).slice(1, -1)));
    assert.ok(writing.includes(`writing/${article.slug}/`));
  }
  assert.match(writing, /URLSearchParams\(location\.search\)\.get\("file"\)/);
});

test("artifacts with a story get a static, crawlable page", () => {
  const page = read("artifacts/localxiv/index.html");
  const sitemap = read("sitemap.xml");
  assert.match(page, /<h1[^>]*>LocalXiv<\/h1>/);
  for (const heading of ["What it is", "Why it was needed", "What I built", "What it achieved", "Status", "Related"]) {
    assert.match(page, new RegExp(`<h2[^>]*>${heading}</h2>`), heading);
  }
  assert.match(page, /<link rel="canonical" href="https:\/\/akhiltheerthala\.com\/artifacts\/localxiv\/" \/>/);
  assert.match(page, /"@type": "SoftwareApplication"/);
  assert.match(page, /https:\/\/www\.producthunt\.com\/products\/localxiv/);
  assert.match(sitemap, /https:\/\/akhiltheerthala\.com\/artifacts\/localxiv\//);
  assert.match(read("index.html"), /href="artifacts\/localxiv\/"/);

  const kuvera = read("artifacts/kuvera/index.html");
  assert.match(kuvera, /<h1[^>]*>Kuvera Personal Finance Datasets and LLMs<\/h1>/);
  assert.match(kuvera, /"@type": "Dataset"/);
  assert.match(kuvera, /18,846/);
  assert.match(kuvera, /href="\.\.\/\.\.\/writing\/[a-z0-9-]+\/">/);
  assert.match(sitemap, /https:\/\/akhiltheerthala\.com\/artifacts\/kuvera\//);
});

test("the site ships local fonts and complete discovery metadata", () => {
  const css = read("assets/css/site.css");
  for (const file of pages) assert.doesNotMatch(read(file), /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  for (const [family, file] of [
    ["IBM Plex Sans", "plex-sans-latin.woff2"],
    ["IBM Plex Mono", "plex-mono-latin-400.woff2"],
    ["IBM Plex Serif", "plex-serif-latin-400.woff2"],
  ]) {
    assert.match(css, new RegExp(`font-family:\\s*"${family}"`));
    assert.match(css, new RegExp(`fonts/${file}`));
    assert.equal(fs.existsSync(path.join("assets", "fonts", file)), true, file);
  }

  const index = read("index.html");
  assert.match(index, /<link rel="canonical" href="https:\/\/akhiltheerthala\.com\/" \/>/);
  assert.match(index, /"@type": "Person"/);
  assert.match(index, /"@type": "ScholarlyArticle"/);
  for (const publication of data.publications) assert.ok(index.includes(escapeHtml(publication.title)));

  const socialCard = fs.readFileSync("assets/social/akhil-theerthala-og.png");
  assert.equal(socialCard.readUInt32BE(16), 1200);
  assert.equal(socialCard.readUInt32BE(20), 630);

  const sitemap = read("sitemap.xml");
  assert.match(sitemap, /https:\/\/akhiltheerthala\.com\//);
  for (const article of data.writings) assert.ok(sitemap.includes(`https://akhiltheerthala.com/writing/${article.slug}/`));
  assert.match(read("robots.txt"), /Sitemap: https:\/\/akhiltheerthala\.com\/sitemap\.xml/);

  const notFound = read("404.html");
  for (const href of ["/", "/#research", "/#writings", "/#contact"]) assert.ok(notFound.includes(`href="${href}"`), href);
  assert.match(notFound, /noindex/);
});

test("papers without an arXiv version still get honest structured data", () => {
  const index = read("index.html");
  assert.match(index, /"@id": "https:\/\/akhiltheerthala\.com\/#paper-data-attribution-should-guide-pretraining"/);
  assert.match(index, /id="paper-data-attribution-should-guide-pretraining"/);
  assert.match(index, /"name": "ATTRIB Workshop, NeurIPS 2026"/);
  assert.doesNotMatch(index, /"@id": "undefined#article"|"url": "undefined"|doi\.org\/undefined/);
});

test("production commands are unchanged and media is reserved", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.deepEqual(Object.keys(pkg.scripts).sort(), ["build", "check", "serve", "test"]);
  assert.equal(pkg.dependencies.react, undefined);
  const index = read("index.html");
  for (const image of index.matchAll(/<img\b[^>]*>/g)) {
    assert.match(image[0], /width="\d+"/, image[0]);
    assert.match(image[0], /height="\d+"/, image[0]);
    assert.match(image[0], /alt="/, image[0]);
  }
  assert.equal(fs.existsSync("assets/media/profile-480.webp"), true);
  assert.equal(fs.existsSync("assets/media/profile-960.webp"), true);
});

test("every page sits on the ground layer", () => {
  for (const file of [...pages, "writing/density-vs-diversity-in-data-selection/index.html", "artifacts/kuvera/index.html"]) {
    assert.match(read(file), /<div class="ground" aria-hidden="true">/, file);
  }
});

test("papers are split by authorship and unreleased ones get a typeset first page", () => {
  const index = read("index.html");
  const first = index.indexOf("First-author work");
  const major = index.indexOf("Major contributions");
  assert.ok(first > 0 && major > first, "first-author work comes before major contributions");
  for (const publication of data.publications) {
    const at = index.indexOf(`>${escapeHtml(publication.title)}`);
    const own = publication.authors[0] === data.name;
    assert.ok(own ? at > first && at < major : at > major, publication.title);
  }
  const unreleased = data.publications.filter((publication) => !publication.arxiv);
  assert.equal((index.match(/class="pub-thumb draft"/g) || []).length, unreleased.length);
  assert.match(index, /Unreleased/);

  // Released papers say what the contribution was, never an author position.
  const roles = [...index.matchAll(/class="pub-role">([^<]*)</g)].map((match) => match[1]);
  const released = data.publications.filter((publication) => publication.arxiv);
  assert.deepEqual(
    roles.sort(),
    Array.from(released, (publication) => (publication.authors[0] === data.name ? "First author" : "Major contribution")).sort(),
  );
  assert.doesNotMatch(index, /Sole author| of \d+ authors/);
});

test("LocalXiv is shown with its own cover image", () => {
  for (const file of ["index.html", "artifacts/localxiv/index.html"]) {
    assert.match(read(file), /localxiv-cover\.webp" width="1920" height="1200"/, file);
  }
  assert.equal(fs.existsSync("assets/media/localxiv-cover.webp"), true);
});

test("every page carries the mark and its icons", () => {
  for (const file of pages) {
    const html = read(file);
    assert.match(html, /<svg class="wordmark-mark" viewBox="0 0 23 22"/, file);
    assert.match(html, /rel="icon" href="[^"]*favicon\.svg" type="image\/svg\+xml"/, file);
    assert.match(html, /rel="apple-touch-icon" href="[^"]*apple-touch-icon\.png"/, file);
  }
  for (const icon of ["favicon.svg", "favicon.ico", "apple-touch-icon.png"]) {
    assert.equal(fs.existsSync(icon), true, icon);
  }
});

test("the map renderer draws the graph from the shared layout, not islands", () => {
  const renderer = read("src/map.js");
  assert.match(renderer, /from "\.\/graph-layout\.js"/);
  assert.doesNotMatch(renderer, /\.near\b|\.angle\b|drawIslands|orbits/);
  const site = read("src/site.js");
  assert.doesNotMatch(site, /\.near\b/);
  assert.match(site, /onHoverArea/);
  assert.match(read("assets/css/site.css"), /\.map-tooltip-links/);
});

test("the social card is drawn from the shared layout, not islands", () => {
  const card = read("scripts/render-social-card.mjs");
  assert.match(card, /from "\.\.\/src\/graph-layout\.js"/);
  assert.doesNotMatch(card, /\.angle\b|ellipse/);
});
