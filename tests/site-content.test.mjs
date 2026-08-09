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

  const roleSteering = data.publications.find((publication) =>
    publication.title.startsWith("Role Steering"),
  );
  assert.ok(roleSteering.authors.includes("Anthony Wen-Ming Zang"));
});

test("artifact evidence contains only approved verified values", () => {
  const kuvera = data.projects.find((project) =>
    project.title.startsWith("Kuvera"),
  );
  assert.deepEqual(
    Array.from(kuvera.evidence.metrics, (metric) => metric.value),
    ["18.8k", "8", "8B", "80%"],
  );

  const lazyInfer = data.projects.find(
    (project) => project.title === "LazyInfer",
  );
  assert.deepEqual(Array.from(lazyInfer.evidence.stages), [
    "JSONL input",
    "YAML stages",
    "Schema validation",
    "Checkpointed output",
  ]);
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
