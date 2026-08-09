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

test("pages load local production bundles without browser compilation", () => {
  const index = read("index.html");
  const writing = read("writing.html");

  for (const html of [index, writing]) {
    assert.doesNotMatch(
      html,
      /babel|react\.development|react-dom\.development/i,
    );
  }

  assert.match(index, /assets\/js\/portfolio\.js/);
  assert.match(writing, /assets\/js\/writing\.js/);
});

test("credibility layouts and responsive portrait assets are production-ready", () => {
  const css = read("portfolio.css");
  const sections = read("portfolio-sections.jsx");

  assert.match(css, /--dim:\s*#788179/);
  assert.match(css, /\.artifact-evidence\s*\{/);
  assert.match(css, /\.citation\s*\{/);
  assert.match(css, /\.citation-actions button:focus-visible/);
  assert.match(css, /\.older-writing-archive\s*\{/);
  assert.match(sections, /<picture>/);
  assert.match(sections, /profile-480\.webp 480w/);
  assert.match(sections, /profile-960\.webp 960w/);
  assert.match(sections, /width="960"/);
  assert.match(sections, /height="995"/);
  assert.equal(fs.existsSync("assets/media/profile-480.webp"), true);
  assert.equal(fs.existsSync("assets/media/profile-960.webp"), true);
});

test("every writing has a canonical generated route", () => {
  const data = loadData();
  const slugs = new Set();

  for (const article of data.writings) {
    assert.equal(slugs.has(article.slug), false);
    slugs.add(article.slug);
    assert.equal(
      fs.existsSync(path.join("My writings", article.file)),
      true,
      `${article.file} must exist`,
    );

    const route = path.join("writing", article.slug, "index.html");
    assert.equal(fs.existsSync(route), true, `${route} must be generated`);
    const html = read(route);
    assert.ok(
      html.includes(
        `<title>${escapeHtml(article.title)} - Akhil Theerthala</title>`,
      ),
    );
    assert.match(
      html,
      new RegExp(
        `https://akhiltheerthala\\.com/writing/${article.slug}/`,
      ),
    );
    assert.ok(html.includes(`data-article-file="${escapeHtml(article.file)}"`));
    assert.match(html, /data-content-prefix="\.\.\/\.\.\/"/);
    assert.match(html, /\.\.\/\.\.\/assets\/js\/writing\.js/);
  }
});

test("the article reader supports generated and legacy requests", () => {
  const app = read("writing-app.jsx");
  const css = read("portfolio.css");

  assert.match(app, /document\.documentElement\.dataset\.articleFile/);
  assert.match(app, /document\.documentElement\.dataset\.contentPrefix/);
  assert.match(app, /function ArticleIndex\(/);
  assert.match(app, /<details className="article-index"/);
  assert.match(css, /@media \(max-width: 1280px\)[\s\S]*\.article-index/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.article-index/);
});

test("the site ships local fonts and complete discovery metadata", () => {
  const data = loadData();
  const index = read("index.html");
  const writing = read("writing.html");
  const css = read("portfolio.css");

  assert.doesNotMatch(`${index}\n${writing}`, /fonts\.googleapis\.com/);
  for (const [family, file] of [
    ["Newsreader", "newsreader-latin.woff2"],
    ["Geist", "geist-latin.woff2"],
    ["JetBrains Mono", "jetbrains-mono-latin.woff2"],
  ]) {
    assert.match(css, new RegExp(`font-family:\\s*"${family}"`));
    assert.match(css, new RegExp(`assets/fonts/${file}`));
    assert.equal(fs.existsSync(path.join("assets", "fonts", file)), true);
  }

  assert.match(
    index,
    /<link rel="canonical" href="https:\/\/akhiltheerthala\.com\/"/,
  );
  assert.match(index, /<script type="application\/ld\+json">/);
  assert.match(index, /"@type":\s*"Person"/);
  assert.match(index, /"@type":\s*"ScholarlyArticle"/);
  for (const publication of data.publications) {
    assert.ok(index.includes(escapeHtml(publication.title)));
  }

  const socialCard = fs.readFileSync(
    "assets/social/akhil-theerthala-og.png",
  );
  assert.equal(socialCard.readUInt32BE(16), 1200);
  assert.equal(socialCard.readUInt32BE(20), 630);

  const sitemap = read("sitemap.xml");
  assert.match(sitemap, /https:\/\/akhiltheerthala\.com\//);
  for (const article of data.writings) {
    assert.match(
      sitemap,
      new RegExp(
        `https://akhiltheerthala\\.com/writing/${article.slug}/`,
      ),
    );
  }
  assert.match(
    read("robots.txt"),
    /Sitemap: https:\/\/akhiltheerthala\.com\/sitemap\.xml/,
  );
  const notFound = read("404.html");
  assert.match(notFound, /href="\/"/);
  assert.match(notFound, /href="\/#research"/);
  assert.match(notFound, /href="\/#writings"/);
  assert.match(notFound, /href="\/#contact"/);
});
