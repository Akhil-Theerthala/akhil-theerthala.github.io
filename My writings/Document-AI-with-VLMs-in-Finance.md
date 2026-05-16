## Adapting Vision-Language Models for Financial Documents

General-purpose VLMs are strong at broad visual reasoning, but finance documents stress different failure modes: dense tabular regions, low-quality scans, template shifts across institutions, and strict correctness requirements. This note summarizes the adaptation strategy that worked best in production-like settings.

## 1. Problem framing

Financial document understanding is not just OCR with better prompts. We need consistent structural extraction across:

- multi-template statements,
- mixed digital and scanned inputs,
- and long-tail formatting noise from real customer uploads.

The target is not impressive examples. The target is reliable behavior at scale under latency constraints.

## 2. Data-centric adaptation workflow

The highest leverage came from data work before model tuning.

### a) Curate failure-focused slices

- low-resolution and skewed images,
- dense and irregular tables,
- cases with visually similar but semantically different fields.

### b) Build semi-synthetic variants

- controlled perturbations for blur, compression, and occlusion,
- layout-level perturbations for table boundary ambiguity,
- realistic template variation without destroying label fidelity.

### c) Keep evaluation slices explicit

Do not merge all samples into one global score. Track each stress slice separately.

## 3. Parameter-efficient tuning

LoRA-style adaptation offered a practical quality/latency balance for domain transfer:

- lower training cost than full fine-tuning,
- faster experimentation across slices,
- easier rollback and version control in deployment.

The key was not the adapter alone; it was pairing adapter updates with targeted curation and repeated slice-level evaluation.

## 4. Evaluation protocol

We used a two-layer protocol:

- **Structure metrics** for table fidelity (for example, cell/structure-sensitive scores).
- **Task metrics** for downstream extraction correctness.

This prevents false confidence where a model looks "accurate" on aggregate fields but silently breaks structure in rows and columns.

## 5. Deployment constraints that changed model decisions

Three constraints forced practical tradeoffs:

- **Latency ceilings:** required compact inference paths and selective recovery flows.
- **Reliability requirements:** favored predictable behavior over aggressive generation.
- **Auditability:** demanded traceable failure reasons and deterministic reroutes.

As a result, the system design prioritized guarded inference and measurable fallback states over single-model maximalism.

## 6. Takeaway

VLM adaptation for finance documents works when the process is data-first, evaluation-heavy, and deployment-aware. Better base models help, but robust performance came from disciplined curation, slice-level diagnostics, and explicit handling of document quality failure modes.
