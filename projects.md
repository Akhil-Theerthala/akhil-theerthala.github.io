---
layout: default
title: Projects
description: Financial reasoning projects, open-source releases, and production systems by Akhil Theerthala
---

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <span class="hero-eyebrow">Projects</span>
      <h1 class="hero-title">Reasoning-first work that ships.</h1>
      <p class="hero-description">
        I'm a Senior Data Scientist at Perfios, designing finance-facing ML systems that teams can trust.
        This is a cross-section of the datasets, model families, and internal tooling I've delivered with product, compliance, and CX partners.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="https://huggingface.co/akhil-theerthala" target="_blank" rel="noopener">Hugging Face profile</a>
        <a class="btn btn-ghost" href="{{ "/contact" | relative_url }}">Collaborate on a project</a>
      </div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">Perfios</span>
        <span class="stat-label">Reasoning systems in production</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">Toolkit</span>
        <span class="stat-label">Reusable evaluation playbooks</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">Recognition</span>
        <span class="stat-label">Winner, Bespoke Labs Challenge</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">Flagship Releases</h2>
    <div class="card-grid">
      <div class="card">
        <div class="card-meta">
          <span class="tag">Dataset</span>
          <span class="tag">Competition winner</span>
        </div>
        <h3 class="card-title">PersonalFinance_v2</h3>
        <p class="card-desc">7k+ carefully curated conversations for personal finance reasoning with explicit chain-of-thought annotations.</p>
        <a href="https://huggingface.co/datasets/akhil-theerthala/PersonalFinance_v2" target="_blank" class="card-link">View the dataset →</a>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Model family</span>
          <span class="tag">Production</span>
        </div>
        <h3 class="card-title">Kuvera series</h3>
        <p class="card-desc">Finetuned 4B–14B parameter models focused on personal finance dialogue, document summarisation, and reasoning.</p>
        <a href="https://huggingface.co/akhil-theerthala" target="_blank" class="card-link">Browse the models →</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">In the Lab</h2>
    <div class="card-grid">
      <div class="card">
        <div class="card-meta">
          <span class="tag">Hackathon</span>
        </div>
        <h3 class="card-title">Perfios IdeaFest finalist</h3>
        <p class="card-desc">Co-created a storytelling interface that reimagines financial statements as conversational narratives for CX teams.</p>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Research volunteering</span>
        </div>
        <h3 class="card-title">Georgia Tech FSIL</h3>
        <p class="card-desc">Supporting investigations into trustworthy financial AI with data collection and evaluation design.</p>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Community</span>
        </div>
        <h3 class="card-title">Open-source models & datasets</h3>
        <p class="card-desc">Maintaining the Kuvera model family and PersonalFinance datasets on Hugging Face for community reuse.</p>
        <a href="https://huggingface.co/akhil-theerthala" target="_blank" class="card-link">See releases →</a>
      </div>
    </div>
  </div>
</section>

{% assign github_projects = site.data.external_resources.collections | where: "key", "github_projects" | first %}
{% assign huggingface_models = site.data.external_resources.collections | where: "key", "huggingface_models" | first %}

{% if github_projects or huggingface_models %}
  <section class="section">
    <div class="container">
      <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">Shipping Log</h2>
      
      {% if github_projects %}
        <h3 style="margin-bottom: 1rem; color: var(--accent-primary);">{{ github_projects.title }}</h3>
        <div class="card-grid" style="margin-bottom: var(--spacing-lg);">
          {% for item in github_projects.items %}
            <div class="card">
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              <a href="{{ item.link }}" target="_blank" class="card-link">View Code →</a>
            </div>
          {% endfor %}
        </div>
      {% endif %}

      {% if huggingface_models %}
        <h3 style="margin-bottom: 1rem; color: var(--accent-primary);">{{ huggingface_models.title }}</h3>
        <div class="card-grid">
          {% for item in huggingface_models.items %}
            <div class="card">
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              <a href="{{ item.link }}" target="_blank" class="card-link">View Model →</a>
            </div>
          {% endfor %}
        </div>
      {% endif %}
    </div>
  </section>
{% endif %}

<section class="section">
  <div class="container">
    <div style="background: var(--bg-card); padding: var(--spacing-lg); border-radius: 16px; text-align: center; border: 1px solid var(--border-color);">
      <h3 class="hero-title" style="font-size: 2rem;">Need a reasoning partner?</h3>
      <p class="hero-description" style="margin: 0 auto var(--spacing-md); max-width: 500px;">
        Whether it's a new dataset, model iteration, or evaluation loop, I'm ready to help.
      </p>
      <a class="btn btn-primary" href="{{ "/contact" | relative_url }}">Start a conversation</a>
    </div>
  </div>
</section>
