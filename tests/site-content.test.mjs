import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

function loadData() {
  const source = fs.readFileSync("portfolio-data.js", "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: "portfolio-data.js" });
  return context.window.PORTFOLIO_DATA;
}

const data = loadData();

test("the current role is a selected-impact record", () => {
  const role = data.workExperience[0];
  assert.equal(typeof role.summary, "string");
  assert.ok(role.summary.length > 30);
  assert.equal(role.highlights.length, 3);
  assert.equal(typeof role.recognition, "string");
  assert.match(role.highlights.join(" "), /92% precision/);
});

test("publications carry verified citation metadata", () => {
  assert.equal(data.publications.length, 3);
  for (const publication of data.publications) {
    assert.match(publication.doi, /^10\.48550\/arXiv\./);
    assert.match(publication.citation, /Theerthala/);
    assert.match(publication.bibtex, /^@misc\{/);
    assert.match(publication.arxiv, /^https:\/\/arxiv\.org\/abs\//);
  }

  assert.ok(data.publications.every((publication) => !("status" in publication)));
  const sections = fs.readFileSync("portfolio-sections.jsx", "utf8");
  assert.doesNotMatch(sections, /\.status\b/);
  assert.match(sections, /formatVenue\(p\.venue\)/);

  const roleSteering = data.publications.find((publication) =>
    publication.title.startsWith("Role Steering"),
  );
  assert.ok(roleSteering.authors.includes("Anthony Wen-Ming Zang"));

  const reasoningChains = data.publications.find((publication) =>
    publication.title.startsWith("Synthesizing Behaviorally-Grounded"),
  );
  assert.equal(reasoningChains.venue, "FinNLP Workshop, EMNLP 2025");
});

test("artifact evidence contains only approved verified values", () => {
  const kuvera = data.projects.find((project) =>
    project.title.startsWith("Kuvera"),
  );
  assert.deepEqual(
    Array.from(kuvera.evidence.metrics, (metric) => metric.value),
    ["18.8k", "8", "8B", "80%"],
  );

  assert.deepEqual(
    Array.from(data.projects, (project) => project.title),
    [
      "LocalXiv",
      "Density vs. Diversity: VLM Curation Datasets",
      "Kuvera Personal Finance Datasets and LLMs",
      "Reasoning Dataset Challenge",
      "Themis Scales: Moral Dilemma Resolution",
    ],
  );

  assert.ok(
    data.projects.every((project) => !/^Research contribution/.test(project.desc)),
  );

  const released = Array.from(data.projects, (project) => project.released);
  assert.ok(released.every((month) => /^\d{4}-(0[1-9]|1[0-2])$/.test(month)));
  assert.deepEqual(released, [...released].sort().reverse());

  const localxiv = data.projects.find((project) => project.title === "LocalXiv");
  assert.deepEqual(
    Array.from(localxiv.links, (link) => link.href),
    [
      "https://github.com/Akhil-Theerthala/LocalXiv",
      "https://www.producthunt.com/products/localxiv",
      "https://github.com/Akhil-Theerthala/LocalXiv/releases/latest",
    ],
  );

  assert.equal(localxiv.slug, "localxiv");
  assert.equal(localxiv.status, "Active");
  for (const part of ["what", "why", "built", "achieved", "status"]) {
    assert.ok(localxiv.story[part]?.length > 0, `LocalXiv story is missing "${part}"`);
  }

  const density = data.projects.find((project) =>
    project.title.startsWith("Density vs. Diversity"),
  );
  assert.equal(density.evidence.kind, "dataset");
  assert.deepEqual(
    Array.from(density.evidence.metrics, (metric) => metric.value),
    ["15k", "750", "7.5k", "6"],
  );
  assert.deepEqual(
    Array.from(density.links, (link) => link.href),
    [
      "https://huggingface.co/datasets/Akhil-Theerthala/DesnityVsDiversity",
      "https://huggingface.co/blog/Akhil-Theerthala/diversity-density-for-vision-language-models",
    ],
  );

  const themis = data.projects.find((project) =>
    project.title.startsWith("Themis Scales"),
  );
  assert.equal(themis.evidence.kind, "dataset");
  assert.deepEqual(
    Array.from(themis.evidence.metrics, (metric) => metric.value),
    ["567", "4", "3", "10.57967/hf/5177"],
  );
  assert.deepEqual(Array.from(themis.evidence.schema), [
    "category",
    "query",
    "chain_of_thought",
    "response",
  ]);
  assert.deepEqual(
    Array.from(themis.links, (link) => link.href),
    [
      "https://huggingface.co/datasets/Akhil-Theerthala/Themis_Scales",
      "https://github.com/Akhil-Theerthala/moral-dilemma-reasoning",
    ],
  );
});

test("writing slugs are unique and exactly two records are featured", () => {
  const slugs = data.writings.map((item) => item.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)));
  assert.deepEqual(
    Array.from(
      data.writings
        .filter((item) => item.featured)
        .map((item) => item.file),
    ),
    ["Density-Vs-Diversity.md", "Creating-a-Reasoning-Dataset-with.md"],
  );
});

test("credibility components expose accessible, non-duplicative contracts", () => {
  const sections = fs.readFileSync("portfolio-sections.jsx", "utf8");

  assert.doesNotMatch(sections, /PublicationCitation|className="citation/);
  assert.match(sections, /<ul className="tag-list" aria-label="Topics">/);
  assert.doesNotMatch(sections, /className="tag"/);
  assert.match(sections, /function ArtifactEvidence\(/);
  assert.match(sections, /title="Public Artifacts"/);
  assert.match(sections, /<dialog/);
  assert.match(sections, /\.showModal\(\)/);
  assert.match(sections, /aria-haspopup="dialog"/);
  assert.doesNotMatch(sections, /className="artifact-trigger"/);
  assert.match(sections, /function ExperienceEntry\(/);
  assert.match(sections, /experience\.highlights/);
  assert.match(sections, /filter\(\(item\) => !item\.featured\)/);
  assert.match(sections, /<details className="older-writing-archive"/);
  assert.match(sections, /\{data\.location\}/);
  assert.doesNotMatch(sections, />Hyderabad, India</);
});

test("the production app uses the fixed approved visual tokens", () => {
  const app = fs.readFileSync("portfolio-app.jsx", "utf8");

  assert.doesNotMatch(app, /TweaksPanel|useTweaks|TWEAK_DEFAULTS/);
  assert.match(app, /const APPROVED_ACCENT = "#c8a66b"/);
});

test("links carry no arrow glyphs; destinations are buttons", () => {
  for (const file of ["portfolio-sections.jsx", "writing-app.jsx", "404.html"]) {
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(source, /[↗→↑←]/, `${file} still renders an arrow`);
    assert.doesNotMatch(source, /link-arrow|item-arrow|social-arrow|profile-link-arrow|className="arrow"/);
  }
  const sections = fs.readFileSync("portfolio-sections.jsx", "utf8");
  assert.match(sections, /\(opens in a new tab\)/);
});

test("the page leads with applied work, then research", () => {
  const app = fs.readFileSync("portfolio-app.jsx", "utf8");
  const sections = fs.readFileSync("portfolio-sections.jsx", "utf8");
  const index = fs.readFileSync("index.html", "utf8");
  const order = ["About", "Experience", "Projects", "Publications", "Writings", "Education"];

  const rendered = [...app.matchAll(/<(About|Experience|Projects|Publications|Writings|Education) data=/g)]
    .map((match) => match[1]);
  assert.deepEqual(rendered, order);

  const navIds = [...app.matchAll(/\{ id: "([a-z]+)", label:/g)].map((match) => match[1]);
  assert.deepEqual(navIds, ["about", "cv", "work", "research", "writings", "education", "contact"]);

  assert.match(index, /<title>Akhil Theerthala - Applied Data Scientist<\/title>/);
  assert.doesNotMatch(index, /Applied AI Researcher/);
  assert.equal(data.role, "Applied Data Scientist");
  assert.doesNotMatch(sections, /Research interests|researchFocus/);
  assert.equal(data.researchProfiles[0].label, "GitHub");
  assert.match(
    sections.replace(/\s+/g, " "),
    /Open to applied ML work, research collaborations, and fellowship conversations about reliable AI systems in finance and document intelligence\./,
  );
});
