import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");

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
