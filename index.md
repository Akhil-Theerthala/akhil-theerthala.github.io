---
layout: default
title: Home
---

<section class="hero">
  <div class="container hero-container">
    <div class="hero-intro">
      <div class="hero-header">
        <figure class="hero-photo">
          <img src="{{ "/profile_photo.png" | relative_url }}" alt="Portrait of Akhil Theerthala">
        </figure>
        <h1 class="hero-name">Akhil Theerthala</h1>
      </div>
      <p class="hero-eyebrow">Financial AI · Reasoning Systems · Human-first design</p>
      <p class="hero-description">
        Senior Data Scientist at Perfios, building domain-specific reasoning models for finance.
        I care about reliable datasets, single-GPU deployment, and making complex decisions feel approachable.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="{{ "/projects" | relative_url }}">See recent work</a>
        <a class="button ghost" href="{{ "/contact" | relative_url }}">Let's collaborate</a>
      </div>
      <div class="pill-group">
        <span class="pill">Reasoning Dataset Competition 2025 — 1st place</span>
        <span class="pill">FinNLP @ EMNLP 2025 — Solo author</span>
        <span class="pill">Volunteer — Georgia Tech Financial Services Innovation Lab</span>
      </div>
    </div>

    <div class="hero-card">
      <div class="hero-card-content">
        <div class="stat-block">
          <div>
            <div class="stat-number">Perfios</div>
            <div class="stat-label">Senior Data Scientist building production reasoning systems</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">1st</div>
            <div class="stat-label">Bespoke Labs × HuggingFace × Together.ai dataset competition</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">FinNLP</div>
            <div class="stat-label">EMNLP 2025 solo-author publication</div>
          </div>
        </div>
        <p class="hero-description">
          My projects span reasoning datasets, finance-focused model families, and knowledge sharing for the ML community.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">What I focus on</span>
      <h2 class="section-title">Pragmatic systems that stay trustworthy.</h2>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="card-icon">🤖</div>
        <h3 class="card-title">Domain reasoning models</h3>
        <p>Designing and deploying compact models tuned for personal finance conversations and decision support.</p>
        <ul class="list list-check">
          <li>Single-GPU friendly model families</li>
          <li>Evaluation pipelines that balance accuracy with tone</li>
          <li>Documentation that makes hand-offs painless</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-icon">📊</div>
        <h3 class="card-title">Responsible financial AI</h3>
        <p>Grounding models in curated datasets and transparent reasoning workflows.</p>
        <ul class="list list-check">
          <li>Competition-winning PersonalFinance_v2 dataset</li>
          <li>Research into crowdfunding behaviour and financial NLP</li>
          <li>Cross-functional collaboration with compliance and CX teams</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-icon">📝</div>
        <h3 class="card-title">Sharing the journey</h3>
        <p>Translating lessons into talks, internal playbooks, and practical resources for builders.</p>
        <ul class="list list-check">
          <li>Workshops at Perfios and community AMAs</li>
          <li>Writing about reasoning data and MLOps</li>
          <li>Mentoring peers entering applied AI</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section section-open-source">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Open-source contributions</span>
      <h2 class="section-title">Models and datasets others rely on.</h2>
      <p class="section-description">Snapshots from Hugging Face showing how self-released work and community GGUF ports are being used.</p>
    </div>
    <div class="open-source-summary">
      <div class="summary-card">
        <span class="summary-label">Total artefact downloads on HuggingFace</span>
        <span class="summary-value">5,047</span>
        <span class="summary-sub">Across various models & datasets</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Total artefact likes on HuggingFace</span>
        <span class="summary-value">86</span>
        <span class="summary-sub">Across various models & datasets</span>
      </div>
    </div>
    <div class="open-source-grid">
      <article class="card open-source-card">
        <div class="card-meta">
          <span class="tag">Self models</span>
        </div>
        <h3 class="card-title">Finance Reasoning Model Series</h3>
        <p>Compact models tuned for personal finance conversations with grounded reasoning steps.</p>
        <dl class="stat-pairs">
          <div>
            <dt>Downloads</dt>
            <dd>604</dd>
          </div>
          <div>
            <dt>Likes</dt>
            <dd>41</dd>
          </div>
        </dl>
        <a href="https://huggingface.co/akhil-theerthala" target="_blank" rel="noopener">Explore models →</a>
      </article>
      <article class="card open-source-card">
        <div class="card-meta">
          <span class="tag">Community GGUF</span>
        </div>
        <h3 class="card-title">Community GGUF Ports</h3>
        <p>Optimised community releases making single-device deployments effortless. Developed by bartwoski, mradermacher</p>
        <dl class="stat-pairs">
          <div>
            <dt>Downloads</dt>
            <dd>28,162</dd>
          </div>
          <div>
            <dt>Likes</dt>
            <dd>9</dd>
          </div>
        </dl>
        <a href="https://huggingface.co/models?author=akhil-theerthala&search=gguf" target="_blank" rel="noopener">View GGUF builds →</a>
      </article>
      <article class="card open-source-card">
        <div class="card-meta">
          <span class="tag">Datasets</span>
        </div>
        <h3 class="card-title">PersonalFinance_v2 & more</h3>
        <p>Reasoning-first datasets with annotated deliberation and evaluator splits.</p>
        <dl class="stat-pairs">
          <div>
            <dt>Downloads</dt>
            <dd>4,443</dd>
          </div>
          <div>
            <dt>Likes</dt>
            <dd>45</dd>
          </div>
        </dl>
        <a href="https://huggingface.co/datasets/akhil-theerthala" target="_blank" rel="noopener">Browse datasets →</a>
      </article>
      <article class="card open-source-card">
        <div class="card-meta">
          <span class="tag">Applied research</span>
        </div>
        <h3 class="card-title">HuggingScience · AI for Food Allergies</h3>
        <p>Project focused on monitoring allergens in food conversations and surfacing safe recommendations.</p>
        <a href="https://huggingface.co/akhil-theerthala/HuggingScience-Ai-for-food-allergies" target="_blank" rel="noopener">Follow the project →</a>
      </article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Recent highlights</span>
      <h2 class="section-title">A snapshot of work I'm proud of.</h2>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="card-meta">
          <span class="tag">Dataset</span>
          <span class="tag">Competition winner</span>
        </div>
        <h3 class="card-title">PersonalFinance_v2</h3>
        <p>Open-source reasoning dataset with explicit chain-of-thought guidance for personal finance LLMs.</p>
        <a href="https://huggingface.co/datasets/akhil-theerthala/PersonalFinance_v2" target="_blank" rel="noopener">View the dataset →</a>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Research</span>
          <span class="tag">FinNLP 2025</span>
        </div>
        <h3 class="card-title">Synthesizing Behaviourally-Grounded Reasoning Chains</h3>
        <p>Solo-author paper accepted to the FinNLP Workshop at EMNLP 2025, documenting my dataset methodology.</p>
        <a href="{{ "/publications" | relative_url }}">Read the abstract →</a>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Product impact</span>
        </div>
        <h3 class="card-title">Perfios IdeaFest finalist</h3>
        <p>Prototype storytelling interfaces that translate financial statements into conversations for CX teams.</p>
        <a href="{{ "/projects" | relative_url }}">See the process →</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Professional timeline</span>
      <h2 class="section-title">Moments that shaped my path.</h2>
    </div>
    <div class="journey">
      <div class="journey-year">
        <h3>2025</h3>
        <div class="journey-events">
          <span>Promoted to Senior Data Scientist at Perfios, leading reasoning-first initiatives.</span>
          <span>Volunteer researcher at the Georgia Tech Financial Services Innovation Lab.</span>
          <span>Published my first solo-author paper at FinNLP, EMNLP 2025.</span>
          <span>Won the Bespoke Labs × HuggingFace × Together.ai reasoning dataset competition.</span>
        </div>
      </div>
      <div class="journey-year">
        <h3>2023</h3>
        <div class="journey-events">
          <span>Graduated from IIT Kharagpur (B.Tech, Aerospace Engineering).</span>
          <span>Joined Perfios as an Applied Scientist-I focused on production fintech models.</span>
          <span>Began documenting ML learnings through writing and talks.</span>
        </div>
      </div>
      <div class="journey-year">
        <h3>2022</h3>
        <div class="journey-events">
          <span>Data Science Intern at Perfios — first experience shipping ML to real users.</span>
          <span>Undergraduate researcher at VGSOM exploring crowdfunding analytics.</span>
          <span>Recipient of the Udacity × AWS Machine Learning Scholarship.</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section-resource-directory">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Explore the directory</span>
      <h2 class="section-title">Every public artefact in one place.</h2>
      <p class="section-description">Pulled straight from my working sheet so you can dive into code, datasets, models, or writing without hunting around.</p>
    </div>
    <div class="resource-panels">
      {% for collection in site.data.external_resources.collections %}
        <details class="resource-panel"{% if forloop.first %} open{% endif %}>
          <summary>
            <span class="resource-panel-title">{{ collection.title }}</span>
            <span class="resource-panel-count">{{ collection.items | size }} items</span>
          </summary>
          {% if collection.blurb %}
            <p class="resource-panel-blurb">{{ collection.blurb }}</p>
          {% endif %}
          <ul class="resource-list">
            {% for item in collection.items %}
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
      {% endfor %}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="cta">
      <div class="cta-text">
        <h3>Working on finance AI or reasoning data?</h3>
        <p>I'm always happy to exchange notes or explore collaborations.</p>
      </div>
      <a class="button primary" href="{{ "/contact" | relative_url }}">Get in touch</a>
    </div>
  </div>
</section>
