import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const inject = path.join(projectRoot, "build/react-inject.js");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadPortfolioData() {
  const source = await fs.readFile(
    path.join(projectRoot, "portfolio-data.js"),
    "utf8",
  );
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: "portfolio-data.js" });
  return context.window.PORTFOLIO_DATA;
}

function articlePage(article, siteUrl) {
  const title = escapeHtml(article.title);
  const description = escapeHtml(
    article.excerpt ||
      `An essay by Akhil Theerthala on ${article.category.toLowerCase()}.`,
  );
  const canonical = `${siteUrl}/writing/${article.slug}/`;

  return `<!doctype html>
<html lang="en" data-article-file="${escapeHtml(article.file)}" data-content-prefix="../../" data-density="comfortable">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Akhil Theerthala</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title} - Akhil Theerthala" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${siteUrl}/assets/social/akhil-theerthala-og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#0d0f0e" />
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%230d0f0e'/%3E%3Cpath d='M15 49 29 14h7l14 35h-8l-3-9H25l-3 9h-7Zm12-16h10l-5-14-5 14Z' fill='%23c8a66b'/%3E%3C/svg%3E"
    />
    <link rel="stylesheet" href="../../portfolio.css" />
    <script defer src="../../assets/js/writing.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div id="root"></div>
  </body>
</html>
`;
}

async function generateArticlePages() {
  const data = await loadPortfolioData();
  const cname = (
    await fs.readFile(path.join(projectRoot, "CNAME"), "utf8")
  ).trim();
  const siteUrl = `https://${cname}`;

  await Promise.all(
    data.writings.map(async (article) => {
      const outputDirectory = path.join(
        projectRoot,
        "writing",
        article.slug,
      );
      await fs.mkdir(outputDirectory, { recursive: true });
      await fs.writeFile(
        path.join(outputDirectory, "index.html"),
        articlePage(article, siteUrl),
        "utf8",
      );
    }),
  );
}

const common = {
  bundle: true,
  format: "iife",
  inject: [inject],
  minify: true,
  sourcemap: false,
  target: ["es2020"],
  logLevel: "info",
};

export async function buildSite() {
  await Promise.all([
    build({
      ...common,
      entryPoints: [path.join(projectRoot, "build/portfolio-entry.jsx")],
      outfile: path.join(projectRoot, "assets/js/portfolio.js"),
    }),
    build({
      ...common,
      entryPoints: [path.join(projectRoot, "build/writing-entry.jsx")],
      outfile: path.join(projectRoot, "assets/js/writing.js"),
    }),
  ]);
  await generateArticlePages();
}

await buildSite();
