# Themis Artifact Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace LazyInfer with a verified Themis Scales dataset artifact while keeping Density vs. Diversity exclusively in Writings.

**Architecture:** Keep the existing data-driven project renderer and dataset evidence component unchanged. Update the portfolio content contract and its Node test, rebuild the static output, visually inspect the affected sections, then merge the verified feature branch into the repository's primary `master` branch and push it.

**Tech Stack:** JavaScript data module, React 18 UMD components, Node.js test runner, esbuild static build, native CSS.

## Global Constraints

- Use only facts verified by the public Themis Scales Hugging Face dataset card and viewer.
- Describe Themis as a seed or proof-of-concept dataset; do not imply expert ethical validation, production readiness, or general moral authority.
- Keep `Density vs. Diversity in Data Selection` featured in Writings and absent from Research Artifacts.
- Keep the LazyInfer design note in the writing archive.
- Reuse the existing supporting-artifact and dataset-evidence presentation; add no component, dependency, animation, color, or background change.
- The primary repository branch is named `master`; treat it as the user's requested mainline branch.

---

### Task 1: Replace the flagship artifact through the content contract

**Files:**
- Modify: `tests/site-content.test.mjs:39-57`
- Modify: `portfolio-data.js:293-319`

**Interfaces:**
- Consumes: `window.PORTFOLIO_DATA.projects`, rendered by `Projects` and `ArtifactEvidence` in `portfolio-sections.jsx`.
- Produces: a third project record with `evidence.kind === "dataset"`, literal metrics, record schema, and two external links.

- [ ] **Step 1: Write the failing content test**

Replace the LazyInfer assertions with a project-selection and evidence contract:

```js
  assert.deepEqual(
    Array.from(data.projects, (project) => project.title),
    [
      "Kuvera Personal Finance Datasets and LLMs",
      "Reasoning Dataset Challenge",
      "Themis Scales: Moral Dilemma Resolution",
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
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run: `node --test --test-name-pattern="artifact evidence" tests/site-content.test.mjs`

Expected: FAIL because the third title is still `LazyInfer` and no Themis record exists.

- [ ] **Step 3: Replace the LazyInfer data record**

Use this content shape in `portfolio-data.js`:

```js
    {
      title: "Themis Scales: Moral Dilemma Resolution",
      kicker: "Open source · AI ethics dataset",
      desc: "Research contribution: created a 567-example seed dataset that structures moral-dilemma analysis through Morality-as-Cooperation, deontological, and utilitarian perspectives, with explicit limitations for further validation.",
      metric: "567 dilemmas",
      year: "2025",
      href: "https://huggingface.co/datasets/Akhil-Theerthala/Themis_Scales",
      links: [
        {
          label: "Dataset",
          href: "https://huggingface.co/datasets/Akhil-Theerthala/Themis_Scales",
        },
        {
          label: "GitHub",
          href: "https://github.com/Akhil-Theerthala/moral-dilemma-reasoning",
        },
      ],
      evidence: {
        kind: "dataset",
        label: "Seed dataset record",
        caption:
          "A proof-of-concept collection of 567 dilemmas across four categories, structured through three complementary ethical lenses.",
        metrics: [
          { label: "Rows", value: "567" },
          { label: "Categories", value: "4" },
          { label: "Ethical lenses", value: "3" },
          { label: "DOI", value: "10.57967/hf/5177" },
        ],
        schema: ["category", "query", "chain_of_thought", "response"],
      },
      tags: ["AI ethics", "Moral reasoning", "Dataset curation"],
    },
```

- [ ] **Step 4: Run the focused test and the full content suite**

Run: `node --test --test-name-pattern="artifact evidence" tests/site-content.test.mjs`

Expected: PASS.

Run: `npm test`

Expected: all tests pass with zero failures.

- [ ] **Step 5: Commit the content replacement**

```bash
git add portfolio-data.js tests/site-content.test.mjs
git commit -m "content: feature Themis moral reasoning dataset"
```

### Task 2: Build and inspect the affected portfolio surfaces

**Files:**
- Generated by build: `index.html`, `assets/site.js`, `writing/**/index.html`, `sitemap.xml`, `robots.txt`, `404.html`
- Verify: `scripts/check-site.mjs`
- Verify: `scripts/verify-redesign.mjs`

**Interfaces:**
- Consumes: the updated project data through the existing build and React renderer.
- Produces: generated production pages in which Themis appears once under Research Artifacts and Density vs. Diversity remains featured under Writings.

- [ ] **Step 1: Build the production site**

Run: `npm run build`

Expected: exit 0 and refreshed generated output.

- [ ] **Step 2: Run automated production checks**

Run: `npm run check`

Expected: exit 0.

Run: `node scripts/verify-redesign.mjs`

Expected: verification succeeds with no missing selectors, content, or assets.

- [ ] **Step 3: Run the complete verification set**

Run: `npm test && npm run build && npm run check && node scripts/verify-redesign.mjs && git diff --check`

Expected: every command exits 0 with no test failure or whitespace error.

- [ ] **Step 4: Inspect desktop and mobile behavior locally**

Start or reuse `npm run serve`, then inspect `http://127.0.0.1:4173/#work` at 1280px and 375px widths. Confirm:

- Themis replaces LazyInfer under Research Artifacts.
- The Themis DOI wraps inside its evidence panel.
- The Dataset and GitHub links are present and keyboard-focusable.
- Density vs. Diversity still appears once as the first featured Writing.
- No horizontal overflow or browser-console error occurs.

- [ ] **Step 5: Commit generated production output if the build changed tracked files**

```bash
git add index.html assets/site.js writing sitemap.xml robots.txt 404.html
git commit -m "build: publish Themis artifact content"
```

Skip this commit only if `git status --short` confirms the build produced no tracked change.

### Task 3: Integrate the verified feature branch into the primary branch

**Files:**
- Git refs only; no additional source edits.

**Interfaces:**
- Consumes: the verified `akhil/research-signal-background` branch.
- Produces: updated `master` and `origin/master` refs containing the same tested commits.

- [ ] **Step 1: Confirm the integration target and clean state**

Run: `git status --short --branch && git branch -vv && git log --oneline --decorate -8`

Expected: current branch is `akhil/research-signal-background`, the worktree is clean, and `master` tracks `origin/master`.

- [ ] **Step 2: Refresh the remote state without changing files**

Run: `git fetch origin master`

Expected: exit 0.

- [ ] **Step 3: Confirm a safe fast-forward relationship**

Run: `git merge-base --is-ancestor origin/master akhil/research-signal-background`

Expected: exit 0. If it does not, stop and inspect the divergence instead of forcing the merge.

- [ ] **Step 4: Fast-forward the primary branch**

Run: `git switch master`

Run: `git merge --ff-only akhil/research-signal-background`

Expected: `master` advances without a merge commit or conflict.

- [ ] **Step 5: Verify the exact integrated commit before pushing**

Run: `npm test && npm run build && npm run check && node scripts/verify-redesign.mjs && git diff --check && git status --short`

Expected: all commands exit 0 and the worktree is clean.

- [ ] **Step 6: Push the primary branch**

Run: `git push origin master`

Expected: GitHub accepts the update without a force push.

- [ ] **Step 7: Confirm the local and remote refs match**

Run: `git fetch origin master && test "$(git rev-parse master)" = "$(git rev-parse origin/master)"`

Expected: exit 0.

