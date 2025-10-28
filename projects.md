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
        I'm a Senior Data Scientist at Perfios, designing finance-facing ML systems that teams can trust.
        This is a cross-section of the datasets, model families, and internal tooling I've delivered with product, compliance, and CX partners.
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
            <div class="stat-label">Reasoning systems in production for lending, wealth, and advisory teams</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">Toolkit</div>
            <div class="stat-label">Reusable evaluation + deployment playbooks</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">Recognition</div>
            <div class="stat-label">Winner, Bespoke Labs × HuggingFace × Together.ai dataset challenge</div>
          </div>
        </div>
        <p class="hero-description">
          Transparent evaluation, thoughtful documentation, and developer-friendly tooling anchor every project here.
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
        <h3 class="card-title">Open-source models & datasets</h3>
        <p>Maintaining the Kuvera model family and PersonalFinance datasets on Hugging Face for community reuse.</p>
        <a href="https://huggingface.co/akhil-theerthala" target="_blank" rel="noopener">See releases →</a>
      </div>
    </div>
  </div>
</section>

{% assign github_projects = site.data.external_resources.collections | where: "key", "github_projects" | first %}
{% assign huggingface_models = site.data.external_resources.collections | where: "key", "huggingface_models" | first %}

{% if github_projects or huggingface_models %}
  <section class="section section-resource-directory">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Shipping log</span>
        <h2 class="section-title">Recent builds pulled from my working sheet.</h2>
        <p class="section-description">A living index of the repos and models I'm actively maintaining. Updates the moment I refresh my project tracker.</p>
      </div>
      <div class="resource-panels">
        {% if github_projects %}
          <details class="resource-panel" open>
            <summary>
              <span class="resource-panel-title">{{ github_projects.title }}</span>
              <span class="resource-panel-count">{{ github_projects.items | size }} items</span>
            </summary>
            {% if github_projects.blurb %}
              <p class="resource-panel-blurb">{{ github_projects.blurb }}</p>
            {% endif %}
            <ul class="resource-list">
              {% for item in github_projects.items %}
                <li class="resource-list-item">
                  <div class="resource-item">
                    <div class="resource-item-heading">
                      <a href="{{ item.link }}" target="_blank" rel="noopener">
                        {{ item.title }}
                      </a>
                      {% if item.meta %}
                        <span class="resource-item-meta">{{ item.meta }}</span>
                      {% endif %}
                    </div>
                    {% if item.description %}
                      <p class="resource-item-description">{{ item.description }}</p>
                    {% endif %}
                  </div>
                </li>
              {% endfor %}
            </ul>
          </details>
        {% endif %}

        {% if huggingface_models %}
          <details class="resource-panel">
            <summary>
              <span class="resource-panel-title">{{ huggingface_models.title }}</span>
              <span class="resource-panel-count">{{ huggingface_models.items | size }} items</span>
            </summary>
            {% if huggingface_models.blurb %}
              <p class="resource-panel-blurb">{{ huggingface_models.blurb }}</p>
            {% endif %}
            <ul class="resource-list">
              {% for item in huggingface_models.items %}
                <li class="resource-list-item">
                  <div class="resource-item">
                    <div class="resource-item-heading">
                      <a href="{{ item.link }}" target="_blank" rel="noopener">
                        {{ item.title }}
                      </a>
                      {% if item.meta %}
                        <span class="resource-item-meta">{{ item.meta }}</span>
                      {% endif %}
                    </div>
                    {% if item.description %}
                      <p class="resource-item-description">{{ item.description }}</p>
                    {% endif %}
                  </div>
                </li>
              {% endfor %}
            </ul>
          </details>
        {% endif %}
      </div>
    </div>
  </section>
{% endif %}

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
