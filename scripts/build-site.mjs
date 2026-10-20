// Builds the static site from portfolio-data.js, the essays in "My writings",
// data/dataset-samples.json and assets/data/map.json (see scripts/build-map.py).
import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
import { Marked } from "marked";
import {
  articleTokens,
  loadPortfolioData,
  plainText,
  projectRoot,
  readArticle,
  siteUrl,
  slugify,
} from "./lib/content.mjs";
import {
  articleBody,
  artifactBody,
  escapeHtml,
  homeBody,
  layout,
  notFoundBody,
  writingIndexBody,
} from "./lib/templates.mjs";

const readJson = async (file) =>
  JSON.parse(await fs.readFile(path.join(projectRoot, file), "utf8"));
const write = async (file, contents) => {
  const target = path.join(projectRoot, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, contents, "utf8");
};

// "Jan 2026" becomes "2026-01", the ISO 8601 form that page metadata expects.
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const isoMonth = (date) => {
  const [month, year] = date.split(" ");
  return `${year}-${String(months.indexOf(month) + 1).padStart(2, "0")}`;
};

const personId = `${siteUrl}/#person`;
const authorRef = (data) => ({ "@type": "Person", "@id": personId, name: data.name, url: `${siteUrl}/` });

// Search results show this under the homepage link. The Person record reuses it.
const homeDescription =
  "Akhil Theerthala is an applied data scientist at Perfios, Bengaluru. He builds reliable AI for finance: calibrated LLM safeguards and market-intelligence agents.";

const markdown = new Marked({
  renderer: {
    paragraph(token) {
      const id = token.pid ? ` id="${token.pid}"` : "";
      return `<p${id}>${this.parser.parseInline(token.tokens)}</p>\n`;
    },
    heading(token) {
      const id = token.hid || slugify(plainText(token.text));
      return `<h${token.depth} id="${id}">${this.parser.parseInline(token.tokens)}</h${token.depth}>\n`;
    },
    image(token) {
      const alt = escapeHtml(token.text || "");
      return `<img src="${escapeHtml(token.href)}" alt="${alt}" loading="lazy" decoding="async" />`;
    },
    link(token) {
      const text = this.parser.parseInline(token.tokens);
      const outside = /^https?:/.test(token.href);
      return `<a href="${escapeHtml(token.href)}"${outside ? ' target="_blank" rel="noreferrer"' : ""}>${text}</a>`;
    },
  },
});

async function renderArticle(article) {
  const tokens = articleTokens(await readArticle(article));
  // The page sets its own title, so the essay's opening h1 is dropped.
  const firstContent = tokens.findIndex((token) => token.type !== "space");
  if (tokens[firstContent]?.type === "heading" && tokens[firstContent].depth === 1) {
    tokens.splice(firstContent, 1);
  }
  const toc = tokens
    .filter((token) => token.type === "heading" && token.depth <= 3)
    .map((token) => ({ id: token.hid, depth: token.depth, text: plainText(token.text) }));
  const html = markdown.parser(tokens).replace(/<img(?![^>]*loading=)/g, '<img loading="lazy"');
  return { html, toc };
}

function personData(data) {
  const sameAs = [
    ...data.researchProfiles.map((profile) => profile.href),
    ...data.contactLinks.map((link) => link.href).filter((href) => href.startsWith("https://")),
  ];
  const publicationId = (publication) =>
    publication.arxiv ? `${publication.arxiv}#article` : `${siteUrl}/#paper-${publication.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      // The WebSite record gives search engines the site name to show.
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: data.name, url: `${siteUrl}/` },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: `${siteUrl}/`,
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: data.name,
        url: `${siteUrl}/`,
        image: `${siteUrl}/assets/media/profile-960.webp`,
        // worksFor names the employer, so the job title is the role alone.
        jobTitle: data.currentRole.split(",")[0],
        description: homeDescription,
        email: `mailto:${data.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: data.location.split(",")[0],
          addressCountry: "India",
        },
        worksFor: { "@type": "Organization", name: "Perfios Software Solutions" },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Indian Institute of Technology, Kharagpur",
        },
        affiliation: [
          {
            "@type": "CollegeOrUniversity",
            name: "International Institute of Information Technology, Hyderabad",
          },
          { "@type": "ResearchOrganization", name: "FSIL and HCAI Labs, Georgia Tech" },
        ],
        knowsAbout: data.researchFocus.map((focus) => focus.title),
        sameAs: [...new Set(sameAs)],
      },
      ...data.publications.map((publication) => ({
        "@type": "ScholarlyArticle",
        "@id": publicationId(publication),
        headline: publication.title,
        name: publication.title,
        description: publication.abstract,
        // An unreleased paper has no publication date yet.
        ...(publication.arxiv && { datePublished: publication.year }),
        keywords: publication.tags,
        author: publication.authors.map((name) => ({
          "@type": "Person",
          ...(name === data.name ? { "@id": personId } : { name }),
        })),
        ...(publication.arxiv && { url: publication.arxiv }),
        ...(publication.doi && {
          sameAs: `https://doi.org/${publication.doi}`,
          identifier: publication.doi,
        }),
        isPartOf: { "@type": "CreativeWork", name: publication.venue },
      })),
    ],
  };
}

// sameAs lists other pages for this same work. A download, a paper and a model
// are different things, so each gets its own property or none.
function artifactData(project, data, canonical) {
  const type = { tool: "SoftwareApplication", dataset: "Dataset" }[project.evidence?.kind];
  const links = project.links || [];
  const href = (label) => links.find((link) => link.label === label)?.href;
  return {
    "@context": "https://schema.org",
    "@type": type || "CreativeWork",
    name: project.title,
    description: project.summary,
    url: canonical,
    datePublished: project.released,
    sameAs: links.filter((link) => !["Download", "Paper", "Model"].includes(link.label)).map((link) => link.href),
    author: authorRef(data),
    // Dataset search reads creator, not author.
    ...(type === "Dataset" && { creator: authorRef(data) }),
    ...(href("Download") && { downloadUrl: href("Download") }),
    ...(href("Paper") && { citation: href("Paper") }),
    ...project.structuredData,
  };
}

async function bundleScripts() {
  await build({
    entryPoints: [path.join(projectRoot, "src/site.js")],
    outfile: path.join(projectRoot, "assets/js/site.js"),
    bundle: true,
    format: "iife",
    minify: true,
    target: ["es2020"],
    logLevel: "warning",
  });
}

async function buildPages() {
  const data = await loadPortfolioData();
  const samples = await readJson("data/dataset-samples.json");
  const map = await readJson("assets/data/map.json");

  await write(
    "index.html",
    layout({
      title: "Akhil Theerthala - Applied Data Scientist",
      description: homeDescription,
      canonical: `${siteUrl}/`,
      root: "",
      page: "home",
      structuredData: personData(data),
      body: homeBody(data, samples, map),
    }),
  );

  for (const article of data.writings) {
    const { html, toc } = await renderArticle(article);
    const canonical = `${siteUrl}/writing/${article.slug}/`;
    // description is a search snippet for an essay with no excerpt. An excerpt is also the page lede.
    const description = article.description || article.excerpt || `${article.title}, written by ${data.name} in ${article.date}.`;
    const published = isoMonth(article.date);
    await write(
      `writing/${article.slug}/index.html`,
      layout({
        title: `${article.title} - Akhil Theerthala`,
        description,
        canonical,
        root: "../../",
        page: "article",
        ogType: "article",
        extraHead: `<meta property="article:published_time" content="${published}" />
    <meta property="article:author" content="${siteUrl}/" />`,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description,
          datePublished: published,
          url: canonical,
          mainEntityOfPage: canonical,
          image: `${siteUrl}/assets/social/akhil-theerthala-og.png`,
          author: authorRef(data),
        },
        body: articleBody(article, html, toc),
      }),
    );
  }

  for (const project of data.projects.filter((item) => item.story)) {
    const canonical = `${siteUrl}/artifacts/${project.slug}/`;
    await write(
      `artifacts/${project.slug}/index.html`,
      layout({
        title: `${project.title} - Akhil Theerthala`,
        description: project.summary,
        canonical,
        root: "../../",
        page: "artifact",
        structuredData: artifactData(project, data, canonical),
        body: artifactBody(project, samples, data),
      }),
    );
  }

  // Old links used writing.html?file=<markdown file>; send them to the new route.
  const legacy = Object.fromEntries(data.writings.map((article) => [article.file, article.slug]));
  await write(
    "writing.html",
    layout({
      title: "Machine Learning Essays and Notes - Akhil Theerthala",
      description:
        "Research notes, technical essays and learning notes by Akhil Theerthala on data curation, reasoning datasets, LLM pipelines, PyTorch and MLOps.",
      canonical: `${siteUrl}/writing.html`,
      root: "",
      page: "writing",
      extraHead: `<script>
      (function () {
        var slugs = ${JSON.stringify(legacy)};
        var file = new URLSearchParams(location.search).get("file");
        if (file && slugs[file]) location.replace("writing/" + slugs[file] + "/");
      })();
    </script>`,
      body: writingIndexBody(data),
    }),
  );

  await write(
    "404.html",
    layout({
      title: "Page not found - Akhil Theerthala",
      description: "This page could not be found.",
      root: "/",
      page: "missing",
      noindex: true,
      body: notFoundBody(),
    }),
  );

  const urls = [
    `${siteUrl}/`,
    `${siteUrl}/writing.html`,
    ...data.projects.filter((project) => project.story).map((project) => `${siteUrl}/artifacts/${project.slug}/`),
    ...data.writings.map((article) => `${siteUrl}/writing/${article.slug}/`),
  ];
  await write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`,
  );
  await write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
}

await bundleScripts();
await buildPages();
console.log("Site built.");
