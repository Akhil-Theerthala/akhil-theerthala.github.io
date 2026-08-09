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
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="article:published_time" content="${escapeHtml(article.year)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${siteUrl}/assets/social/akhil-theerthala-og.png" />
    <meta name="theme-color" content="#0d0f0e" />
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%230d0f0e'/%3E%3Cpath d='M15 49 29 14h7l14 35h-8l-3-9H25l-3 9h-7Zm12-16h10l-5-14-5 14Z' fill='%23c8a66b'/%3E%3C/svg%3E"
    />
    <link rel="preload" href="../../assets/fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="../../assets/fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin />
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

async function generateArticlePages(data, siteUrl) {
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

function homepageStructuredData(data, siteUrl) {
  const personId = `${siteUrl}/#person`;
  const sameAs = [
    ...data.researchProfiles.map((profile) => profile.href),
    ...data.contactLinks
      .map((link) => link.href)
      .filter((href) => href.startsWith("https://")),
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: data.name,
        url: `${siteUrl}/`,
        image: `${siteUrl}/assets/media/profile-960.webp`,
        jobTitle: data.currentRole,
        email: `mailto:${data.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: data.location.split(",")[0],
          addressCountry: "India",
        },
        worksFor: {
          "@type": "Organization",
          name: "Perfios Software Solutions",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Indian Institute of Technology, Kharagpur",
        },
        affiliation: [
          {
            "@type": "CollegeOrUniversity",
            name: "International Institute of Information Technology, Hyderabad",
          },
          {
            "@type": "ResearchOrganization",
            name: "FSIL and HCAI Labs, Georgia Tech",
          },
        ],
        knowsAbout: data.researchFocus.map((focus) => focus.title),
        sameAs: [...new Set(sameAs)],
        subjectOf: data.publications.map((publication) => ({
          "@id": `${publication.arxiv}#article`,
        })),
      },
      ...data.publications.map((publication) => ({
        "@type": "ScholarlyArticle",
        "@id": `${publication.arxiv}#article`,
        headline: publication.title,
        name: publication.title,
        description: publication.abstract,
        datePublished: publication.year,
        author: publication.authors.map((name) => ({
          "@type": "Person",
          ...(name === data.name ? { "@id": personId } : { name }),
        })),
        url: publication.arxiv,
        sameAs: `https://doi.org/${publication.doi}`,
        identifier: publication.doi,
        isPartOf: {
          "@type": "CreativeWork",
          name: publication.venue,
        },
      })),
    ],
  };
}

async function updateHomepageStructuredData(data, siteUrl) {
  const indexPath = path.join(projectRoot, "index.html");
  const index = await fs.readFile(indexPath, "utf8");
  const block = `<!-- STRUCTURED-DATA:START -->
        <script type="application/ld+json">
${JSON.stringify(homepageStructuredData(data, siteUrl), null, 2)}
        </script>
        <!-- STRUCTURED-DATA:END -->`;
  const markerPattern =
    /<!-- STRUCTURED-DATA:START -->[\s\S]*?<!-- STRUCTURED-DATA:END -->/;
  if (!markerPattern.test(index)) {
    throw new Error("Homepage structured-data markers are missing");
  }
  const next = index.replace(markerPattern, block);
  await fs.writeFile(indexPath, next, "utf8");
}

function notFoundPage(siteUrl) {
  return `<!doctype html>
<html lang="en" data-density="comfortable">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page not found - Akhil Theerthala</title>
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="#0d0f0e" />
    <link rel="stylesheet" href="/portfolio.css" />
  </head>
  <body>
    <div class="reader-page">
      <div class="calibration-field" aria-hidden="true"></div>
      <main class="reader-page-main" id="main-content">
        <article class="reader-article" id="article-top">
          <p class="reader-eyebrow mono">404</p>
          <h1 class="reader-title">This page is outside the map.</h1>
          <div class="reader-divider"></div>
          <p class="reader-footer-text">Continue with the portfolio, publications, writing archive, or contact details.</p>
          <nav class="not-found-links" aria-label="Useful destinations">
            <a class="reader-link" href="/">Home</a>
            <a class="reader-link" href="/#research">Publications</a>
            <a class="reader-link" href="/#writings">Writings</a>
            <a class="reader-link" href="/#contact">Contact</a>
          </nav>
        </article>
      </main>
    </div>
  </body>
</html>
`;
}

async function generateDiscoveryFiles(data, siteUrl) {
  const urls = [
    `${siteUrl}/`,
    ...data.writings.map((article) =>
      `${siteUrl}/writing/${article.slug}/`,
    ),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;
  const robots = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;

  await Promise.all([
    fs.writeFile(path.join(projectRoot, "sitemap.xml"), sitemap, "utf8"),
    fs.writeFile(path.join(projectRoot, "robots.txt"), robots, "utf8"),
    fs.writeFile(
      path.join(projectRoot, "404.html"),
      notFoundPage(siteUrl),
      "utf8",
    ),
  ]);
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
  const data = await loadPortfolioData();
  const cname = (
    await fs.readFile(path.join(projectRoot, "CNAME"), "utf8")
  ).trim();
  const siteUrl = `https://${cname}`;
  await Promise.all([
    generateArticlePages(data, siteUrl),
    generateDiscoveryFiles(data, siteUrl),
    updateHomepageStructuredData(data, siteUrl),
  ]);
}

await buildSite();
