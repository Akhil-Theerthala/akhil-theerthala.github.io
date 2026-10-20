import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const siteUrl = "https://akhiltheerthala.com";

export async function loadPortfolioData() {
  const source = await fs.readFile(
    path.join(projectRoot, "portfolio-data.js"),
    "utf8",
  );
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: "portfolio-data.js" });
  return context.window.PORTFOLIO_DATA;
}

export function slugify(text) {
  return (
    String(text)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export const publicationSlug = (publication) =>
  publication.slug || slugify(publication.title).split("-").slice(0, 6).join("-");

export const projectSlug = (project) =>
  project.slug || slugify(project.title).split("-").slice(0, 4).join("-");

// Strips markdown and inline HTML down to the words a reader sees.
export function plainText(markdown) {
  return String(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_~#>]+/g, "")
    .replace(/\$\$?[^$]*\$\$?/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Top-level paragraphs get stable ids (p-0, p-1, …) so the map can link
// straight to them. The corpus and the article renderer both use this walk.
export function articleTokens(markdown) {
  const tokens = marked.lexer(markdown);
  const seen = new Map();
  let index = 0;
  for (const token of tokens) {
    if (token.type === "paragraph") token.pid = `p-${index++}`;
    if (token.type === "heading") {
      const base = slugify(plainText(token.text));
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      token.hid = count ? `${base}-${count + 1}` : base;
    }
  }
  return tokens;
}

export async function readArticle(article) {
  return fs.readFile(
    path.join(projectRoot, "My writings", article.file),
    "utf8",
  );
}
