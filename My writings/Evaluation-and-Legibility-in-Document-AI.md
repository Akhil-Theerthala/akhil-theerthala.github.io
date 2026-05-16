## Evaluation and Legibility Gating for Document AI

In finance document pipelines, model quality is often discussed as if OCR, parsing, and reasoning all fail independently. In practice, they fail together. A blurry scan or low-contrast photocopy can corrupt token boundaries, table structure, and downstream entity extraction in one pass. If we only evaluate end-task accuracy after full inference, we spend compute on inputs that were never recoverable in the first place.

This note outlines a reliability-first view: separate *document legibility* evaluation from *task correctness* evaluation, and enforce a lightweight gate before expensive inference.

## 1. The problem: hidden quality debt at input time

Most production metrics start at the model output:

- F1 for key-value extraction
- TEDS or cell-level metrics for tables
- SLA metrics (latency, throughput, retries)

These are necessary but incomplete. They do not explain whether the model failed because:

- the document is unreadable,
- the model is underfit for the template,
- or the evaluation protocol is too narrow for field variation.

Without this decomposition, teams over-optimize model architecture while leaving input quality uncontrolled.

## 2. A practical gating setup

We introduced a reference-free legibility scorer before OCR/VLM inference. The scorer predicts whether an input is likely to cause structural extraction failure.

### Method

- Train a lightweight vision encoder on internal document-quality labels.
- Define labels around readability and structural recoverability, not aesthetics.
- Optimize for high precision on the "reject or reroute" class to avoid blocking valid documents.

### Decision policy

- **High legibility:** run full inference path.
- **Borderline legibility:** reroute to recovery stack (deskew, denoise, contrast correction).
- **Low legibility:** escalate with clear reason code for manual review or re-upload.

This creates deterministic behavior instead of silent quality collapse.

## 3. Evaluation design that reflects deployment reality

A robust evaluation stack should include:

- **Legibility classifier metrics:** precision/recall by channel (mobile scans, branch scans, PDFs).
- **Task metrics post-gating:** extraction quality on accepted documents.
- **Cost metrics:** avoided failed inferences and reduced retry loops.
- **Risk metrics:** false rejects on critical workflows.

The most useful analysis is *joint*: compare end-task quality and compute cost before vs after gating.

## 4. Why this matters for finance workflows

Financial operations care about traceability. When a document fails, teams need a reason they can act on. A legibility-aware system gives explicit diagnostics ("insufficient contrast", "table region unreadable") and prevents overconfident outputs on poor inputs.

In deployment, this improved three things:

- stability of extraction quality on accepted inputs,
- compute efficiency by filtering non-actionable inputs early,
- and analyst trust because failure states became legible.

## 5. Takeaway

For document AI, reliability is not just a better model. It is better decomposition: input quality, model behavior, and evaluation protocol must each be measured directly. A small legibility gate can create disproportionate gains in quality control, cost, and operational clarity.
