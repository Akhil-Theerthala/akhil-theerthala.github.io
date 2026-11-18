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
const innerPages = ["writing.html", "map.html", "404.html", "artifacts/localxiv/index.html", "writing/7-practical-pytorch-tips/index.html"];
const css = read("assets/css/site.css");
const script = read("src/site.js");

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

// The token block of one theme.
function tokens(theme) {
  const start = theme === "dark" ? css.indexOf("\n:root {") : css.indexOf('\n:root[data-theme="light"] {');
  const block = css.slice(start, css.indexOf("\n}", start));
  return (name) => property(block, `--${name}`);
}

test("the home page's top line names the document and holds its two controls", () => {
  const index = read("index.html");
  const header = index.slice(index.indexOf('<header class="top"'), index.indexOf("</header>"));
  assert.match(header, /<strong>Curriculum vitae<\/strong><span>Updated /);
  assert.match(header, /<button class="switch" type="button" role="switch" aria-checked="false" id="regions-switch">/);
  assert.match(header, /<button class="icon-btn theme-toggle" type="button" aria-label="Switch between light and dark theme">/);
  // No section menu: the page is short enough to scroll.
  assert.doesNotMatch(index, /nav-toggle|nav-links|site-menu/);
});

test("inner pages link home and to the two indexes", () => {
  for (const file of innerPages) {
    const html = read(file);
    const header = html.slice(html.indexOf('<header class="top"'), html.indexOf("</header>"));
    assert.match(header, /<nav class="doc" aria-label="Site">/, file);
    assert.match(header, /<a class="home-link" href="[^"]*">Akhil Theerthala<\/a>/, file);
    assert.match(header, /href="[^"]*writing\.html"/, file);
    assert.match(header, /href="[^"]*map\.html"/, file);
    // The regions layer belongs to the home page alone.
    assert.doesNotMatch(html, /regions-switch|data-region=/, file);
  }
  assert.match(read("writing.html"), /writing\.html" aria-current="page">Writing/);
  assert.match(read("map.html"), /map\.html" aria-current="page">Map/);
});

test("the home page has one filled button, and it is the email", () => {
  const index = read("index.html");
  assert.equal((index.match(/btn-primary/g) || []).length, 1);
  assert.ok(index.includes(`<a class="btn btn-primary" href="mailto:${data.email}">Email me</a>`));
  // The foot has two actions: write, or take the résumé. Nothing copies.
  const actions = index.slice(index.indexOf('<div class="actions">'), index.indexOf('<p class="small">'));
  assert.equal((actions.match(/class="btn/g) || []).length, 2);
  assert.match(actions, /Download résumé<span class="sr-only"> \(PDF, opens in a new tab\)<\/span>/);
  assert.doesNotMatch(index, /Copy address|data-copy/);
  assert.doesNotMatch(script, /clipboard|execCommand/);
  assert.doesNotMatch(css, /copy-btn/);
  // The résumé's link beside the name says what the file is.
  assert.ok(index.includes(`>PDF, ${data.resumePages} pages<span class="sr-only"> (opens in a new tab)</span></a>`));
  assert.doesNotMatch(index, /Download the PDF/);
});

test("roles are buttons that open their own detail", () => {
  const index = read("index.html");
  data.workExperience.forEach((role, i) => {
    assert.ok(index.includes(`<button type="button" aria-expanded="false" aria-controls="role-${i}">${role.title.replaceAll("&", "&amp;")}`), role.title);
    assert.ok(index.includes(`<ul class="more" id="role-${i}">`), `role-${i}`);
  });
  assert.match(script, /aria-expanded/);
  // The whole row is the target.
  assert.match(css, /\.what > a::after,\s*\.what > button::after \{[^}]*inset: 0;/);
});

test("tables keep their semantics and stack on a phone", () => {
  const index = read("index.html");
  const tables = index.match(/<div class="tbl[^"]*"(?: id="work-table")? role="table" aria-labelledby="[a-z]+-h" data-region="table">/g) || [];
  assert.equal(tables.length, 5);
  assert.ok((index.match(/role="columnheader"/g) || []).length >= 14);
  assert.equal((index.match(/class="tr total" role="row"/g) || []).length, 4);
  const phone = css.slice(css.indexOf("@media (max-width: 640px)"));
  assert.match(phone, /\.tr \{\s*grid-template-columns: minmax\(0, 1fr\);/);
  // The head strip leaves the layout but stays for screen readers.
  assert.match(phone, /\.th \{[^}]*clip-path: inset\(50%\);/);
  assert.doesNotMatch(phone, /\.th \{[^}]*display: none/);
});

test("the layout regions are drawn from the page and stay still for reduced motion", () => {
  const index = read("index.html");
  assert.match(index, /<div class="sheet" id="sheet" data-regions="off">/);
  assert.match(index, /<div class="regions" aria-hidden="true"><\/div>/);
  for (const region of ["page-header", "title", "text", "key-value", "section-header", "figure", "caption", "table", "page-footer"]) {
    assert.ok(index.includes(`data-region="${region}"`), region);
  }
  // A closed table has no box, so it is left out until it opens.
  assert.match(script, /if \(!rect\.width && !rect\.height\) return;/);
  assert.match(index, /No model runs here\./);
  // The intro plays once per visit, and not at all for reduced motion.
  assert.match(script, /sessionStorage\.getItem\("regions-intro"\)/);
  assert.match(script, /if \(seen \|\| reducedMotion\(\)\) return;/);
  assert.match(script, /new ResizeObserver\(build\)\.observe\(sheet\)/);
  // The drawn-in reveal exists only inside the motion query.
  const base = rule(".rg");
  assert.doesNotMatch(base, /clip-path/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.rg \{\s*clip-path: inset\(0 100% 100% 0\);/);
});

test("the theme follows the system setting, and light is the fallback", () => {
  for (const file of ["index.html", ...innerPages]) {
    const html = read(file);
    // With no script the attribute stands, so the page is light.
    assert.match(html, /<html lang="en" data-page="[a-z]+" data-root="[^"]*" data-theme="light">/, file);
    assert.match(html, /matchMedia\("\(prefers-color-scheme: dark\)"\)\.matches/, file);
    assert.match(html, /d\.dataset\.theme = t === "light" \|\| t === "dark" \? t : dark \? "dark" : "light";/, file);
    // The old key pinned a theme for good; it is read by nothing now.
    assert.match(html, /localStorage\.removeItem\("theme"\)/, file);
    assert.doesNotMatch(html, /localStorage\.getItem\("theme"\)/, file);
  }
  // A change of the system setting reaches an open page, and the switch's
  // override is dropped once the system agrees with it.
  assert.match(script, /scheme\.addEventListener\("change"/);
  assert.match(script, /if \(theme === systemTheme\(\)\) localStorage\.removeItem\(OVERRIDE\);/);
  assert.match(script, /dispatchEvent\(new Event\("themechange"\)\)/);
});

test("map areas hold 3:1 on the page and keep clear of rose and gold", () => {
  const hue = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const [max, min] = [Math.max(r, g, b), Math.min(r, g, b)];
    const d = max - min || 1;
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (h * 60 + 360) % 360;
  };
  const apart = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
  for (const theme of ["dark", "light"]) {
    const token = tokens(theme);
    for (let i = 0; i < 9; i++) {
      const colour = token(`a${i}`);
      // The map is drawn on a sheet.
      for (const ground of ["bg", "surface", "card"]) {
        const ratio = contrast(colour, token(ground));
        assert.ok(ratio >= 3, `${theme}: --a${i} on --${ground} is ${ratio.toFixed(2)}`);
      }
      // Stone is a grey, so its hue carries nothing.
      if (i === 7) continue;
      assert.ok(apart(hue(colour), hue(token("region"))) >= 12, `${theme}: --a${i} reads as the region rose`);
      assert.ok(apart(hue(colour), hue(token("trim"))) >= 12, `${theme}: --a${i} reads as the gold`);
    }
    // The dashes between linked works are gold that holds on this ground.
    assert.ok(contrast(token("trim"), token("bg")) >= 3, `${theme}: link dashes`);
  }
  const renderer = read("src/map.js");
  assert.match(renderer, /link: get\("--trim"\)/);
  assert.doesNotMatch(renderer, /createRadialGradient/);
});

test("a change of theme cross-fades the whole page, and swaps at once for reduced motion", () => {
  assert.match(script, /if \(!document\.startViewTransition \|\| reducedMotion\(\)\) return applyTheme\(next\);/);
  assert.match(script, /document\.startViewTransition\(\(\) => applyTheme\(next\)\);/);
  // The system setting and the switch go through the same function.
  assert.equal((script.match(/setTheme\(/g) || []).length, 3);
  assert.match(
    css,
    /@media \(prefers-reduced-motion: no-preference\) \{\s*::view-transition-old\(root\),\s*::view-transition-new\(root\) \{\s*animation-duration: 320ms;/,
  );
});

test("the theme switch holds transitions for the swap", () => {
  assert.match(script, /classList\.add\("no-transitions"\)/);
  assert.match(script, /requestAnimationFrame\(\(\) => html\.classList\.remove\("no-transitions"\)\)/);
  assert.match(css, /\.no-transitions \*,[\s\S]*?transition: none !important;/);
  // Press feedback and hover fills are opt-in.
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.btn,\s*\.switch,\s*\.icon-btn \{/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
});

test("small labels are at least 13px", () => {
  const labels = [".th", ".when", ".sub", ".more", ".amt b", ".tr.total", ".small", ".foot-line", ".rt", ".chip small", ".map-search kbd", ".window-bar", ".dataset", ".crumbs", ".page-meta", ".toc"];
  for (const selector of labels) {
    const block = rule(selector);
    const size = property(block, "font-size");
    if (size && !size.startsWith("var(")) assert.ok(toRem(size) >= 0.8125, `${selector} is ${size}`);
    assert.equal(property(block, "text-transform"), undefined, `${selector} is uppercase`);
  }
  for (const step of ["--step-xs", "--step-s"]) {
    assert.ok(toRem(property(rule(":root"), step)) >= 0.8125, step);
  }
  assert.match(rule(".search-results"), /bottom: calc\(100% \+ 8px\)/);
});

test("text and figures hold their contrast in both themes", () => {
  for (const theme of ["dark", "light"]) {
    const token = tokens(theme);
    // The ground, its bands, and a sheet with its own bands.
    const grounds = ["bg", "surface", "surface-2", "card", "card-band"].map(token);
    for (const ground of grounds) {
      for (const name of ["ink", "muted", "accent-text"]) {
        const ratio = contrast(token(name), ground);
        assert.ok(ratio >= 4.5, `${theme}: --${name} on ${ground} is ${ratio.toFixed(2)}`);
      }
    }
    assert.ok(contrast(token("on-head"), token("head")) >= 4.5, `${theme}: table head`);
    assert.ok(contrast(token("on-solid"), token("solid")) >= 4.5, `${theme}: filled button`);
    assert.ok(contrast(token("on-region"), token("region")) >= 4.5, `${theme}: region tag`);
    assert.ok(contrast(token("region"), token("bg")) >= 3, `${theme}: region outline`);
    assert.ok(contrast(token("focus"), token("bg")) >= 3, `${theme}: focus ring`);
  }
  assert.equal(tokens("dark")("bg"), "#000000");
});

test("secondary buttons keep a visible ring in both themes", () => {
  for (const theme of ["dark", "light"]) {
    const token = tokens(theme);
    const ring = token("ring");
    assert.match(ring, /^#[0-9a-f]{6}$/i, `${theme} has no --ring colour`);
    assert.ok(contrast(ring, token("bg")) >= 3, `${theme} ring contrast is ${contrast(ring, token("bg")).toFixed(2)}`);
  }
  assert.match(property(rule(".btn"), "--btn-ring"), /var\(--ring\)/);
  assert.match(rule(".chip"), /var\(--ring\)/);
});
