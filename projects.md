---
layout: default
title: Projects
description: Financial reasoning projects, open-source releases, and production systems by Akhil Theerthala
---

<section class="hero">
  <div class="container">
    <div class="hero-copy">
      <p class="hero-eyebrow">Projects</p>
      <h1 class="hero-title">Reasoning-first work that ships.</h1>
      <p class="hero-description">
        A look at the datasets, model families, and internal tools I craft for finance teams.
        Everything here has been shaped by real-world constraints and a bias for clarity.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="https://huggingface.co/akhil-theerthala" target="_blank" rel="noopener">Hugging Face profile</a>
        <a class="button ghost" href="{{ "/contact" | relative_url }}">Collaborate on a project</a>
      </div>
    </div>
    <div class="hero-card">
      <div class="hero-card-content">
        <div class="stat-block">
          <div>
            <div class="stat-number">Perfios</div>
            <div class="stat-label">Reasoning systems in production for financial partners</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">Toolkit</div>
            <div class="stat-label">Reusable evaluation + deployment playbooks</div>
          </div>
        </div>
        <p class="hero-description">
          I prioritise transparent evaluation, thoughtful documentation, and developer experiences that feel friendly.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Flagship releases</span>
      <h2 class="section-title">Open work you can explore today.</h2>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="card-meta">
          <span class="tag">Dataset</span>
          <span class="tag">Competition winner</span>
        </div>
        <h3 class="card-title">PersonalFinance_v2</h3>
        <p>7k+ carefully curated conversations for personal finance reasoning with explicit chain-of-thought annotations.</p>
        <ul class="list list-check">
          <li>Winner of the 2025 Bespoke Labs × HuggingFace × Together.ai competition</li>
          <li>Behaviourally grounded prompts inspired by financial coaching</li>
          <li>Apache-2.0 licensed for easy adoption</li>
        </ul>
        <a href="https://huggingface.co/datasets/akhil-theerthala/PersonalFinance_v2" target="_blank" rel="noopener">View the dataset →</a>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Model family</span>
          <span class="tag">Production</span>
        </div>
        <h3 class="card-title">Kuvera series</h3>
        <p>Finetuned 4B–14B parameter models focused on personal finance dialogue, document summarisation, and reasoning.</p>
        <ul class="list list-check">
          <li>Designed for single-GPU deployment with quantised variants</li>
          <li>Evaluation harness covering factuality, tone, and compliance</li>
          <li>Documentation to help fintech teams integrate quickly</li>
        </ul>
        <a href="https://huggingface.co/akhil-theerthala" target="_blank" rel="noopener">Browse the models →</a>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Internal toolkit</span>
        </div>
        <h3 class="card-title">Financial reasoning playbook</h3>
        <p>Workflow I use with product and compliance partners to evaluate reasoning behaviour before rollout.</p>
        <ul class="list list-check">
          <li>Scenario banks for personal finance, SME lending, and wealth advisory</li>
          <li>Guardrail prompts for hallucination and regulation awareness</li>
          <li>Notion + dashboard templates for quick stakeholder updates</li>
        </ul>
        <a href="{{ "/research" | relative_url }}">Learn about the process →</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">In the lab</span>
      <h2 class="section-title">Experiments and collaborations.</h2>
      <p class="section-description">Ongoing work that keeps me curious and sharp.</p>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="card-meta">
          <span class="tag">Hackathon</span>
        </div>
        <h3 class="card-title">Perfios IdeaFest finalist</h3>
        <p>Co-created a storytelling interface that reimagines financial statements as conversational narratives for CX teams.</p>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Research volunteering</span>
        </div>
        <h3 class="card-title">Georgia Tech Financial Services Innovation Lab</h3>
        <p>Supporting investigations into trustworthy financial AI with data collection and evaluation design.</p>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Community</span>
        </div>
        <h3 class="card-title">AI for Food Allergies</h3>
        <p>Contributing prompts and evaluation recipes to improve safety-aware responses in public datasets.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cta">
      <div class="cta-text">
        <h3>Need a reasoning partner?</h3>
        <p>Whether it's a new dataset, model iteration, or evaluation loop, I'm ready to help.</p>
      </div>
      <a class="button primary" href="{{ "/contact" | relative_url }}">Start a conversation</a>
    </div>
  </div>
</section>
