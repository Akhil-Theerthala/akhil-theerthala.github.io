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
  assert.ok(role.highlights.length >= 3);
  assert.equal(typeof role.recognition, "string");
  assert.match(role.highlights.join(" "), /92% precision/);
});

test("publications carry verified citation metadata", () => {
  assert.equal(data.publications.length, 4);
  for (const publication of data.publications.filter((entry) => entry.arxiv)) {
    assert.match(publication.doi, /^10\.48550\/arXiv\./);
    assert.match(publication.citation, /Theerthala/);
    assert.match(publication.bibtex, /^@misc\{/);
    assert.match(publication.arxiv, /^https:\/\/arxiv\.org\/abs\//);
  }

  assert.ok(data.publications.every((publication) => !("status" in publication)));

  const roleSteering = data.publications.find((publication) =>
    publication.title.startsWith("Role Steering"),
  );
  assert.ok(roleSteering.authors.includes("Anthony Wen-Ming Zang"));

  const attribution = data.publications[0];
  assert.equal(attribution.title, "Data Attribution Should Guide Pretraining");
  assert.equal(attribution.venue, "ATTRIB Workshop, NeurIPS 2026");
  assert.equal(attribution.year, "2026");
  assert.equal(attribution.authors.length, 11);
  assert.equal(attribution.authors[5], "Akhil Theerthala");
  assert.equal(attribution.slug, "data-attribution-should-guide-pretraining");
  assert.ok(!attribution.arxiv && !attribution.doi);

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
      "Themis Scales: Moral Dilemma Resolution",
      "Social Media Signals and Crowdfunding Success",
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

  assert.equal(kuvera.slug, "kuvera");
  assert.equal(kuvera.status, "Maintained");
  for (const part of ["what", "why", "built", "achieved", "status"]) {
    assert.ok(kuvera.story[part]?.length > 0, `Kuvera story is missing "${part}"`);
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

test("writing slugs are unique and the project write-ups are on the map", () => {
  const slugs = data.writings.map((item) => item.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)));
  assert.deepEqual(
    Array.from(
      data.writings
        .filter((item) => item.onMap)
        .map((item) => item.file),
    ),
    ["Density-Vs-Diversity.md", "Creating-a-Reasoning-Dataset-with.md", "LazyInfer-Design-Notes.md"],
  );
});

const index = fs.readFileSync("index.html", "utf8");

test("the homepage leads with applied work, then research", () => {
  const order = ["top", "cv", "work", "achievements", "research", "writings", "education", "contact"];
  const ids = [...index.matchAll(/<section class="[^"]*" id="([a-z]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, order);

  const navIds = [...index.matchAll(/data-section="([a-z]+)"/g)].map((match) => match[1]);
  assert.deepEqual(navIds, ["about", "cv", "work", "research", "writings", "contact"]);

  assert.match(index, /<title>Akhil Theerthala - Applied Data Scientist<\/title>/);
  assert.doesNotMatch(index, /Applied AI Researcher/);
  assert.equal(data.role, "Applied Data Scientist");
  assert.equal(data.researchProfiles[0].label, "GitHub");
  assert.match(
    index.replace(/\s+/g, " "),
    /Open to applied ML work, research collaborations, and fellowships in financial AI and document AI\./,
  );
  assert.ok(index.includes(data.location));
  assert.doesNotMatch(index, />Hyderabad, India</);
});

test("links carry no arrow glyphs and external links announce new tabs", () => {
  for (const link of index.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) {
    assert.doesNotMatch(link[1], /[↗→↑←]/, `link text still has an arrow: ${link[1]}`);
  }
  assert.match(index, /\(opens in a new tab\)/);
  assert.doesNotMatch(fs.readFileSync("404.html", "utf8"), /[↗→↑←]/);
});

test("every role highlight, publication and project is on the page", () => {
  for (const role of data.workExperience) {
    for (const highlight of role.highlights) {
      const words = highlight.split(" ").slice(0, 6).join(" ");
      assert.ok(index.includes(words), `missing highlight: ${words}`);
    }
  }
  for (const publication of data.publications) {
    assert.match(index, new RegExp(`id="paper-[a-z0-9-]+"[\\s\\S]*?${publication.venue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    if (publication.bibtex) assert.ok(index.includes("Copy BibTeX"));
  }
  for (const project of data.projects) {
    assert.ok(index.includes(`>${project.title.replaceAll("&", "&amp;")}</h3>`), project.title);
  }
  assert.match(index, /<details><summary>Abstract<\/summary>/);
});
