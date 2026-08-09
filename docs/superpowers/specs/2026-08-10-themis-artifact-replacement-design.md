# Themis Artifact Replacement Design

## Objective

Replace the `LazyInfer` entry in Research Artifacts with `Themis Scales: Moral Dilemma Resolution`. Keep the Density vs. Diversity VLM study exclusively in Writings so the two sections communicate breadth instead of repeating the same project.

## Content architecture

The three Research Artifacts will represent distinct research signals:

1. Kuvera — behavior-aware personal-finance data and models.
2. Reasoning Dataset Challenge — competitive synthetic-data performance.
3. Themis Scales — structured moral-reasoning data for AI ethics research.

Density vs. Diversity remains the first featured Writing. It will not also appear as a Research Artifact.

## Themis artifact

The replacement card uses only claims verified by the public Hugging Face dataset card and viewer.

- Title: `Themis Scales: Moral Dilemma Resolution`
- Kicker: `Open source · AI ethics dataset`
- Year: `2025`
- Contribution: a seed dataset that applies Morality-as-Cooperation, deontological, and utilitarian perspectives to structured analysis and resolution of moral dilemmas.
- Primary destination: the Hugging Face dataset.
- Secondary destinations: the Hugging Face dataset and the public GitHub repository.
- Tags: `AI ethics`, `Moral reasoning`, and `Dataset curation`.

The evidence region is a compact dataset record rather than an execution model. It presents:

- `567` rows
- `4` categories
- `3` ethical lenses
- DOI `10.57967/hf/5177`
- Dataset fields: `category`, `query`, `chain_of_thought`, and `response`

The description and caption must make clear that this is a seed or proof-of-concept dataset. They must not imply expert ethical validation, production readiness, or general moral authority.

## Visual behavior

Reuse the existing supporting-artifact card and dataset-evidence treatment. Do not introduce a new component, diagram, background treatment, animation, or color. The change should feel native to the approved editorial research design.

On smaller screens, the existing artifact grid and evidence metrics continue to stack. Long DOI text must wrap without introducing horizontal overflow.

## Writing-section boundary

Keep `Density vs. Diversity in Data Selection` featured in Writings. Keep the existing LazyInfer design note in the writing archive because the request removes LazyInfer from the flagship artifact selection, not from the historical writing record.

## Verification

- Add a content test that fails if LazyInfer remains in `projects`.
- Assert the verified Themis evidence values and external destinations.
- Run the complete test, build, and site-check commands.
- Inspect the Research Artifacts and Writings sections locally at desktop and mobile widths.
- Confirm there is no horizontal overflow and no browser-console error.

