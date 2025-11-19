---
layout: default
title: Home
---

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <span class="hero-eyebrow">Finance AI · Reasoning Systems · Applied Research</span>
      <h1 class="hero-title">
        Building <span class="text-gradient">dependable</span><br>
        AI systems for finance.
      </h1>
      <p class="hero-description">
        I'm Akhil Theerthala, a Senior Data Scientist at Perfios. I focus on transparent reasoning, calm interfaces, and reproducible evaluation for financial ML.
      </p>
      <div class="hero-actions">
        <a href="#projects" class="btn btn-primary">View Projects</a>
        <a href="{{ "/Akhil_Theerthala_Resume.pdf" | relative_url }}" class="btn btn-ghost">Download CV</a>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">5k+</span>
        <span class="stat-label">HF Downloads</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">80+</span>
        <span class="stat-label">Community Likes</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">15+</span>
        <span class="stat-label">Open Projects</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">1st</span>
        <span class="stat-label">Reasoning Challenge</span>
      </div>
    </div>
  </div>
</section>

<section id="work" class="section">
  <div class="container">
    <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">Experience</h2>
    
    <div class="timeline">
      <div class="timeline-item">
        <div class="timeline-year">2025 — Present</div>
        <div class="timeline-content">
          <h3>Senior Data Scientist @ Perfios</h3>
          <p>Leading finance-focused reasoning workflows and deployment reviews. Designing evaluation loops for lending and advisory workflows.</p>
        </div>
      </div>
      
      <div class="timeline-item">
        <div class="timeline-year">2023 — 2025</div>
        <div class="timeline-content">
          <h3>Applied Scientist I @ Perfios</h3>
          <p>Supported production fintech models. Began sharing applied ML notes through writing and talks.</p>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-year">2019 — 2023</div>
        <div class="timeline-content">
          <h3>IIT Kharagpur</h3>
          <p>B.Tech in Aerospace Engineering. Graduated with research in crowdfunding analytics and applied ML foundations.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="projects" class="section">
  <div class="container">
    <h2 class="hero-title" style="font-size: 2.5rem; margin-bottom: var(--spacing-lg);">Selected Work</h2>
    
    <div class="card-grid">
      <!-- Flagship Items -->
      <div class="card">
        <div class="card-meta">
          <span class="tag">Dataset</span>
          <span class="tag">Winner</span>
        </div>
        <h3 class="card-title">PersonalFinance_v2</h3>
        <p class="card-desc">A curated reasoning dataset for personal finance assistants, combining chain-of-thought traces with reviewer guidelines. Winner of the 2025 Bespoke Labs × HuggingFace × Together.ai competition.</p>
        <a href="https://huggingface.co/datasets/akhil-theerthala/PersonalFinance_v2" target="_blank" class="card-link">View on Hugging Face →</a>
      </div>

      <div class="card">
        <div class="card-meta">
          <span class="tag">Model Family</span>
        </div>
        <h3 class="card-title">Kuvera Series</h3>
        <p class="card-desc">Finance-focused checkpoints (4B–14B) and GGUF ports released on Hugging Face. Designed for single-GPU deployment with quantised variants.</p>
        <a href="https://huggingface.co/akhil-theerthala" target="_blank" class="card-link">Browse Models →</a>
      </div>

      <div class="card">
        <div class="card-meta">
          <span class="tag">Research</span>
        </div>
        <h3 class="card-title">Behaviourally-Grounded Reasoning</h3>
        <p class="card-desc">Solo paper exploring how qualitative interviews inform dataset design and evaluation for finance reasoning models. Published at FinNLP @ EMNLP 2025.</p>
        <a href="{{ "/publications" | relative_url }}" class="card-link">Read Abstract →</a>
      </div>

      <!-- Dynamic Content from Data Files -->
      {% assign github_projects = site.data.external_resources.collections | where: "key", "github_projects" | first %}
      {% for item in github_projects.items limit:3 %}
      <div class="card">
        <div class="card-meta">
          <span class="tag">Open Source</span>
        </div>
        <h3 class="card-title">{{ item.title }}</h3>
        <p class="card-desc">{{ item.description }}</p>
        <a href="{{ item.link }}" target="_blank" class="card-link">View Code →</a>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<section id="contact" class="section">
  <div class="container">
    <div style="background: var(--bg-card); padding: var(--spacing-lg); border-radius: 16px; text-align: center; border: 1px solid var(--border-color);">
      <h2 class="hero-title" style="font-size: 2.5rem;">Let's Collaborate</h2>
      <p class="hero-description" style="margin: 0 auto var(--spacing-md); max-width: 500px;">
        Whether it's a new dataset, model iteration, or evaluation loop, I'm ready to help build dependable AI systems.
      </p>
      <a href="mailto:{{ site.author.email }}" class="btn btn-primary">Get in Touch</a>
    </div>
  </div>
</section>
