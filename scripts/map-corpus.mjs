// Prints the map corpus as JSON: the papers, projects, achievements and roles, with the
// essays that write up a project or experiment (`onMap` in portfolio-data.js),
// each passage linked back to where it lives. Paper bodies and dataset cards
// come from data/artifact-texts.json (scripts/fetch-artifact-texts.py).
// scripts/build-map.py embeds this output; run that script, not this one.
import fs from "node:fs/promises";
import path from "node:path";
import {
  articleTokens,
  loadPortfolioData,
  plainText,
  projectRoot,
  projectSlug,
  publicationSlug,
  readArticle,
} from "./lib/content.mjs";

const MIN_CHARS = 70;
// No single artifact should crowd out the rest of the map.
const MAX_CHUNKS = 60;
const data = await loadPortfolioData();
const artifactTexts = JSON.parse(
  await fs.readFile(path.join(projectRoot, "data/artifact-texts.json"), "utf8"),
);
const fetched = (id) =>
  (artifactTexts[id]?.passages || []).flatMap((passage) => sentences(passage.text));
const sources = [];

// Keeps an even spread of passages when a source has more than the cap.
function capped(chunks) {
  if (chunks.length <= MAX_CHUNKS) return chunks;
  const step = chunks.length / MAX_CHUNKS;
  return Array.from({ length: MAX_CHUNKS }, (_, i) => chunks[Math.floor(i * step)]);
}

const ABBREVIATION = /\b(e\.g|i\.e|etc|vs|Fig|Dr|Mr|Ms|al)\./gi;

function sentences(text, perChunk = 2) {
  const guarded = text.replace(ABBREVIATION, (match) => match.replace(/\./g, "\u2024"));
  const parts = guarded.match(/[^.!?]+(?:[.!?]+|$)(?:\s|$)/g) || [guarded];
  const chunks = [];
  for (let i = 0; i < parts.length; i += perChunk) {
    chunks.push(parts.slice(i, i + perChunk).join("").trim().replace(/\u2024/g, "."));
  }
  return chunks.filter((chunk) => chunk.length >= MIN_CHARS);
}

const chunk = (text, href) => ({ text, href });

for (const article of data.writings.filter((item) => item.onMap)) {
  const href = `writing/${article.slug}/`;
  const chunks = [];
  let anchor = "";
  for (const token of articleTokens(await readArticle(article))) {
    if (token.type === "heading") anchor = token.hid;
    if (token.type === "paragraph") {
      anchor = token.pid;
      for (const text of sentences(plainText(token.text))) {
        chunks.push(chunk(text, `${href}#${anchor}`));
      }
    } else if (token.type === "list") {
      // List items link to the paragraph or heading that introduces them.
      for (const item of token.items) {
        for (const text of sentences(plainText(item.text))) {
          chunks.push(chunk(text, `${href}#${anchor}`));
        }
      }
    }
  }
  sources.push({
    id: `essay:${article.slug}`,
    kind: "essay",
    title: article.title,
    meta: `${article.category}, ${article.date}`,
    summary: article.excerpt || "",
    href,
    chunks: capped(chunks),
  });
}

for (const publication of data.publications) {
  const slug = publicationSlug(publication);
  const href = `#paper-${slug}`;
  sources.push({
    id: `paper:${slug}`,
    kind: "paper",
    title: publication.title,
    meta: publication.venue,
    summary: sentences(publication.abstract, 1)[0] || publication.abstract,
    href,
    chunks: capped([
      ...new Set([publication.title, ...sentences(publication.abstract), ...fetched(`paper:${slug}`)]),
    ]).map((text) => chunk(text, href)),
  });
}

for (const project of data.projects) {
  const slug = projectSlug(project);
  const href = project.story ? `artifacts/${project.slug}/` : `#project-${slug}`;
  const story = project.story
    ? Object.values(project.story).flat()
    : [];
  const texts = [project.desc, project.summary, project.evidence?.caption, ...story]
    .filter(Boolean)
    .map(plainText)
    .filter((text) => text.length >= MIN_CHARS)
    .concat(fetched(`project:${slug}`));
  sources.push({
    id: `project:${slug}`,
    kind: "project",
    title: project.title,
    meta: project.kicker,
    summary: project.summary || project.desc,
    href,
    chunks: capped([...new Set(texts)]).map((text) => chunk(text, href)),
  });
}

// An achievement with an id is a work on the map too (the challenge entry).
for (const item of data.achievements.filter((entry) => entry.id)) {
  const href = `#achievement-${item.id}`;
  sources.push({
    id: `project:${item.id}`,
    kind: "project",
    title: item.title,
    meta: [item.date, item.org].filter(Boolean).join(", "),
    summary: item.detail,
    href,
    chunks: sentences(item.detail).map((text) => chunk(text, href)),
  });
}

data.workExperience.forEach((role, index) => {
  const texts = role.highlights;
  sources.push({
    id: `role:${index}`,
    kind: "role",
    title: `${role.title}, ${role.org}`,
    meta: role.date,
    summary: role.highlights[0],
    href: "#cv",
    chunks: texts.map((text) => chunk(plainText(text), "#cv")),
  });
});

process.stdout.write(JSON.stringify({ sources }, null, 2));
