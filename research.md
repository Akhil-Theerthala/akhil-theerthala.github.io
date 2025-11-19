---
layout: default
title: Research
description: Research publications, competitions, and investigations led by Akhil Theerthala
---

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <span class="hero-eyebrow">Research</span>
      <h1 class="hero-title">Curiosity backed by evidence.</h1>
      <p class="hero-description">
        I'm a Senior Data Scientist at Perfios and a volunteer researcher with Georgia Tech's Financial Services Innovation Lab.
        My investigations cover reasoning datasets, financial NLP, and the human experiences around applied AI.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="{{ "/publications" | relative_url }}">See publications</a>
        <a class="btn btn-ghost" href="https://huggingface.co/datasets/akhil-theerthala" target="_blank" rel="noopener">Explore datasets</a>
      </div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">1st</span>
        <span class="stat-label">Reasoning Dataset Competition</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">FinNLP</span>
        <span class="stat-label">EMNLP 2025 Solo Author</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">FSIL</span>
        <span class="stat-label">Volunteer Researcher</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">Competition Recognition</h2>
    <div class="card" style="border-color: var(--accent-primary);">
      <div class="card-meta">
        <span class="tag">Dataset Design</span>
        <span class="tag">Chain-of-Thought</span>
      </div>
      <h3 class="card-title">PersonalFinance_v2</h3>
      <p class="card-desc">
        PersonalFinance_v2 captures 7k+ everyday finance conversations with explicit reasoning steps, grounded in behavioural research.
        It balances empathetic tone with verifiable facts and has become the backbone for my production model work.
      </p>
      <ul style="margin-bottom: 1.5rem; color: var(--text-muted);">
        <li>• Scenario coverage for budgeting, credit, investing, and financial planning</li>
        <li>• Quality control rubric inspired by financial advisory training</li>
        <li>• Released under Apache-2.0 to encourage community use</li>
      </ul>
      <a class="btn btn-ghost" href="https://huggingface.co/datasets/akhil-theerthala/PersonalFinance_v2" target="_blank" rel="noopener">Review the dataset →</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">Active Investigations</h2>
    <div class="card-grid">
      <div class="card">
        <div class="card-meta">
          <span class="tag">Volunteer research</span>
        </div>
        <h3 class="card-title">Georgia Tech FSIL</h3>
        <p class="card-desc">Collaborating on evaluation frameworks for trustworthy financial AI.</p>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Academic</span>
        </div>
        <h3 class="card-title">FinNLP 2025</h3>
        <p class="card-desc">Solo-author paper on synthesising behaviourally grounded reasoning chains for finance LLMs.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">Foundational Work</h2>
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-year">IIT Kharagpur</div>
        <div class="timeline-content">
          <h3>Undergraduate Researcher</h3>
          <p>Studied how social media engagement reshapes crowdfunding success metrics. Laid the groundwork for my focus on finance data quality.</p>
        </div>
      </div>
      <div class="timeline-item">
        <div class="timeline-year">Perfios</div>
        <div class="timeline-content">
          <h3>Applied Scientist</h3>
          <p>Applied the research to production credit and wealth workflows. Built evaluation loops to keep reasoning transparent for business stakeholders.</p>
        </div>
      </div>
    </div>
  </div>
</section>

{% assign huggingface_datasets = site.data.external_resources.collections | where: "key", "huggingface_datasets" | first %}
{% assign medium_articles = site.data.external_resources.collections | where: "key", "medium_articles" | first %}

{% if huggingface_datasets or medium_articles %}
  <section class="section">
    <div class="container">
      <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">Primary Sources</h2>
      
      {% if huggingface_datasets %}
        <h3 style="margin-bottom: 1rem; color: var(--accent-primary);">{{ huggingface_datasets.title }}</h3>
        <div class="card-grid" style="margin-bottom: var(--spacing-lg);">
          {% for item in huggingface_datasets.items %}
            <div class="card">
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              <a href="{{ item.link }}" target="_blank" class="card-link">View Dataset →</a>
            </div>
          {% endfor %}
        </div>
      {% endif %}

      {% if medium_articles %}
        <h3 style="margin-bottom: 1rem; color: var(--accent-primary);">{{ medium_articles.title }}</h3>
        <div class="card-grid">
          {% for item in medium_articles.items %}
            <div class="card">
              <h3 class="card-title">{{ item.title }}</h3>
              <a href="{{ item.link }}" target="_blank" class="card-link">Read Article →</a>
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
      <h3 class="hero-title" style="font-size: 2rem;">Have a research question?</h3>
      <p class="hero-description" style="margin: 0 auto var(--spacing-md); max-width: 500px;">
        I'm open to collaborations, peer reviews, and speaking about responsible reasoning systems.
      </p>
      <a class="btn btn-primary" href="{{ "/contact" | relative_url }}">Reach out</a>
    </div>
  </div>
</section>
