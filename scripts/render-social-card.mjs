// Renders assets/social/akhil-theerthala-og.png (1200x630) from assets/data/map.json:
// the hero's embedding map in the carbon theme, drawn as static SVG and
// screenshotted with headless Chrome. Set CHROME_BIN to point at a Chrome binary.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { projectRoot } from "./lib/content.mjs";

const width = 1200;
const height = 630;
const output = path.join(projectRoot, "assets/social/akhil-theerthala-og.png");

// Dark theme tokens, read from the first :root block of assets/css/site.css.
const css = fs.readFileSync(path.join(projectRoot, "assets/css/site.css"), "utf8");
const rootBlock = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")));
const token = (name) => {
  const value = rootBlock.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
  if (!value) throw new Error(`No --${name} in the :root block of site.css.`);
  return value;
};
const bg = token("bg");
const ink = token("ink");
const ink2 = token("ink-2");
const gridX = token("grid-x");
const gridY = token("grid-y");
const tick = token("tick");
const glows = token("glows");
const areaColours = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => token(`a${i}`));

// Map box, matching the hero's text-left, map-right layout.
const box = { left: 600, top: 70, right: 50, bottom: 70 };
const map = JSON.parse(fs.readFileSync(path.join(projectRoot, "assets/data/map.json"), "utf8"));
const toScreen = (x, y) => [
  box.left + x * (width - box.left - box.right),
  box.top + y * (height - box.top - box.bottom),
];

const fontData = (file) =>
  fs.readFileSync(path.join(projectRoot, "assets/fonts", file)).toString("base64");

// The same drawing as src/map.js at card size: each area an island of
// contour rings around its name, its works on the innermost ring.
const nameLines = (name) => {
  const words = name.toUpperCase().split(" ");
  const half = Math.ceil(words.length / 2);
  return words.length > 1 && name.length > 12 ? [words.slice(0, half).join(" "), words.slice(half).join(" ")] : [words.join(" ")];
};
const shapes = [];
const names = [];
map.areas.forEach((area, a) => {
  const [cx, cy] = toScreen(area.x, area.y);
  const lines = nameLines(area.name);
  const members = map.works.filter((work) => work.area === a);
  const extra = Math.max(0, members.length - 2) * 4;
  // Plex Mono at 11px with 1.2px tracking is about 7.8px per character.
  const rx = Math.max((Math.max(...lines.map((line) => line.length)) * 7.8 + 16) / 2 + 16, 40) + extra;
  const ry = Math.max((lines.length * 15 + 10) / 2 + 20, 34) + extra;
  const colour = areaColours[a];
  [[0, 0.3], [14, 0.18], [28, 0.1], [44, 0.05]].forEach(([offset, alpha]) =>
    shapes.push(`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(rx + offset).toFixed(1)}" ry="${(ry + offset).toFixed(1)}" fill="none" stroke="${colour}" stroke-opacity="${alpha}"/>`),
  );
  for (const work of members) {
    const x = cx + Math.cos(work.angle) * rx;
    const y = cy + Math.sin(work.angle) * ry;
    const r = work.kind === "role" ? 5 : 6;
    const node = work.kind === "paper"
      ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`
      : work.kind === "role"
        ? `<path d="M${x} ${y - r * 1.15}L${x + r * 1.15} ${y}L${x} ${y + r * 1.15}L${x - r * 1.15} ${y}Z"/>`
        : `<rect x="${(x - r * 0.9).toFixed(1)}" y="${(y - r * 0.9).toFixed(1)}" width="${r * 1.8}" height="${r * 1.8}" rx="2"/>`;
    shapes.push(`<g fill="${colour}" stroke="${bg}" stroke-width="2">${node}</g>`);
  }
  names.push(`<span class="area" style="left:${cx.toFixed(1)}px;top:${cy.toFixed(1)}px;border-color:${colour}">${lines.join("<br />")}</span>`);
});
const circles = shapes.join("");
const labels = names.join("");

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
@font-face {
  font-family: "IBM Plex Sans";
  src: url(data:font/woff2;base64,${fontData("plex-sans-latin.woff2")}) format("woff2");
  font-weight: 100 700;
  font-stretch: 85% 100%;
  font-display: block;
}
@font-face {
  font-family: "IBM Plex Mono";
  src: url(data:font/woff2;base64,${fontData("plex-mono-latin-500.woff2")}) format("woff2");
  font-weight: 500;
  font-display: block;
}
html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
/* The site's ledger ground: 32px rules, column lines and plus marks. */
html {
  background:
    linear-gradient(to bottom, ${gridY} 1px, transparent 1px) 0 0 / 100% 32px,
    linear-gradient(to right, ${gridX} 1px, transparent 1px) 72px 0 / 88px 100%,
    ${glows},
    ${bg};
}
body::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, ${tick} 5px, transparent 5px 84px, ${tick} 84px) 72px 0 / 88px 100%;
  -webkit-mask: linear-gradient(to bottom, #000 1px, transparent 1px) 0 0 / 100% 128px;
}
body { position: relative; font-family: "IBM Plex Sans", sans-serif; -webkit-font-smoothing: antialiased; }
svg { position: absolute; inset: 0; }
.area {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 4px 8px;
  border: 1px solid;
  border-radius: 6px;
  background: color-mix(in srgb, ${bg} 84%, transparent);
  color: ${ink2};
  font: 500 11px/15px "IBM Plex Mono", monospace;
  letter-spacing: 1.2px;
  text-align: center;
  white-space: nowrap;
}
.intro { position: absolute; left: 72px; top: 50%; transform: translateY(-50%); }
.intro .mark { position: static; display: block; margin: 0 0 30px -3px; }
h1 {
  margin: 0;
  color: ${ink};
  font-size: 96px;
  font-weight: 620;
  font-stretch: 92%;
  line-height: 0.92;
  letter-spacing: -0.045em;
}
p { margin: 26px 0 0; color: ${ink2}; font-size: 30px; line-height: 1.3; }
</style>
</head>
<body>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${circles}</svg>
${labels}
<div class="intro">
  <svg class="mark" viewBox="0 0 23 22" width="69" height="66" aria-hidden="true"><path fill="${ink}" d="M10 5H13L22 20H18.5L11.5 8.33L4.5 20H1Z"/><path fill="${token("mark-gold")}" d="M2 2H21V5H13V20H10V5H2Z"/></svg>
  <h1>Akhil<br />Theerthala</h1>
  <p>Applied data scientist</p>
</div>
</body>
</html>
`;

const chrome =
  process.env.CHROME_BIN ||
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find((candidate) => fs.existsSync(candidate));
if (!chrome) throw new Error("No Chrome found; set CHROME_BIN.");

// Headless Chrome on macOS can stay alive after writing the screenshot, so stop
// it once it reports the file instead of waiting for it to exit.
function screenshot(page, shot) {
  return new Promise((resolve, reject) => {
    const child = spawn(chrome, [
      "--headless",
      "--disable-gpu",
      "--no-first-run",
      `--user-data-dir=${path.join(path.dirname(shot), "profile")}`,
      `--window-size=${width},${height}`,
      "--force-device-scale-factor=1",
      "--hide-scrollbars",
      "--virtual-time-budget=5000",
      `--screenshot=${shot}`,
      `file://${page}`,
    ]);
    let written = false;
    const timer = setTimeout(() => child.kill(), 60_000);
    const watch = (chunk) => {
      if (!written && /bytes written to file/.test(chunk)) {
        written = true;
        child.kill();
      }
    };
    child.stdout.on("data", watch);
    child.stderr.on("data", watch);
    child.on("error", reject);
    child.on("close", () => {
      clearTimeout(timer);
      written ? resolve() : reject(new Error("Chrome exited without writing a screenshot."));
    });
  });
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "social-card-"));
try {
  const page = path.join(temp, "card.html");
  const shot = path.join(temp, "card.png");
  fs.writeFileSync(page, html);
  await screenshot(page, shot);
  const png = fs.readFileSync(shot);
  if (png.readUInt32BE(16) !== width || png.readUInt32BE(20) !== height) {
    throw new Error(`Screenshot is ${png.readUInt32BE(16)}x${png.readUInt32BE(20)}, expected ${width}x${height}.`);
  }
  fs.writeFileSync(output, png);
  console.log(`Wrote ${path.relative(projectRoot, output)}`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
