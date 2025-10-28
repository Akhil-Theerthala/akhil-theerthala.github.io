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
      <p class="hero-eyebrow">Finance AI · Reasoning systems · Applied research</p>
      <p class="hero-description">
        I build dependable machine learning systems for finance at Perfios, focusing on transparent reasoning, calm interfaces, and reproducible evaluation.
        Helping teams understand the models they rely on matters as much to me as shipping the models themselves.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="{{ "/projects" | relative_url }}">Browse projects</a>
        <a class="button ghost" href="{{ "/Akhil_Theerthala_Resume.pdf" | relative_url }}">Download CV</a>
      </div>
      <div class="pill-group">
        <span class="pill">Perfios · Senior Data Scientist</span>
        <span class="pill">FinNLP @ EMNLP 2025 · Solo author</span>
        <span class="pill">Reasoning Dataset Challenge 2025 · Winner</span>
      </div>
    </div>

    <div class="hero-card">
      <div class="hero-card-content">
        <div class="stat-block">
          <div>
            <div class="stat-number">Role</div>
            <div class="stat-label">Leading finance-focused reasoning workflows and deployment reviews at Perfios.</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">Research</div>
            <div class="stat-label">Investigating behaviour-grounded data for FinNLP, EMNLP 2025.</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">Community</div>
            <div class="stat-label">Maintaining open datasets and compact model ports for public use.</div>
          </div>
        </div>
        <p class="hero-description">
          I enjoy the moments where product decisions, research questions, and compliance reviews meet in one conversation.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Profile</span>
      <h2 class="section-title">Snapshot of the work I do.</h2>
      <p class="section-description">Key roles, recognition, and foundations so you can get the essentials at a glance.</p>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="card-meta">
          <span class="tag">Current</span>
        </div>
        <h3 class="card-title">Perfios · Senior Data Scientist (2025–present)</h3>
        <p>Bengaluru-based, partnering with product, compliance, and CX teams on finance-focused reasoning initiatives.</p>
        <ul class="list list-check">
          <li>Designing evaluation loops for lending and advisory workflows</li>
          <li>Launching single-GPU deployments for internal assistants</li>
          <li>Coaching teams on responsible launch reviews</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Recognition</span>
        </div>
        <h3 class="card-title">Reasoning dataset recognition</h3>
        <p>First place in the Bespoke Labs × HuggingFace × Together.ai 2025 reasoning dataset competition.</p>
        <ul class="list list-check">
          <li>Publishing PersonalFinance_v2 and follow-on dataset updates</li>
          <li>Documenting methodology through FinNLP, EMNLP 2025</li>
          <li>Open-sourcing GGUF ports for teams with smaller budgets</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Community</span>
        </div>
        <h3 class="card-title">Georgia Tech Financial Services Innovation Lab</h3>
        <p>Volunteer researcher at FSIL, helping shape trustworthy financial AI evaluations.</p>
        <ul class="list list-check">
          <li>Designing annotation tooling that reduces reviewer fatigue</li>
          <li>Testing rubric-driven audits for reasoning traces</li>
          <li>Sharing learnings with partner organisations</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Foundation</span>
        </div>
        <h3 class="card-title">IIT Kharagpur · B.Tech Aerospace (2019–2023)</h3>
        <p>Graduated with research in crowdfunding analytics and the foundations of applied ML.</p>
        <ul class="list list-check">
          <li>Explored social media drivers of crowdfunding success</li>
          <li>Bridged research with early Perfios internship projects</li>
          <li>Udacity × AWS ML Scholarship recipient</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Practice</span>
      <h2 class="section-title">Where I spend most of my time.</h2>
      <p class="section-description">Day to day I split work across production ML, dataset craft, and sharing the lessons that stick.</p>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="card-icon">🧭</div>
        <h3 class="card-title">Reasoning pipelines</h3>
        <p>Building measured workflows for conversational finance tools and decision support.</p>
        <ul class="list list-check">
          <li>Evaluation loops that combine qualitative and quantitative review</li>
          <li>Instrumentation for understanding intermediate steps and outcomes</li>
          <li>Rollout playbooks that keep product, compliance, and CX aligned</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-icon">📚</div>
        <h3 class="card-title">Responsible datasets</h3>
        <p>Curating, annotating, and stress-testing data that reflects real user language.</p>
        <ul class="list list-check">
          <li>PersonalFinance_v2 and follow-up variants for reasoning research</li>
          <li>Annotation guidance tuned for transparency and reviewer feedback</li>
          <li>Lightweight tooling for measuring drift over time</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-icon">🛠️</div>
        <h3 class="card-title">Shared knowledge</h3>
        <p>Documenting decisions and keeping teams comfortable with the systems they inherit.</p>
        <ul class="list list-check">
          <li>Internal workshops on evaluation, monitoring, and rollout checks</li>
          <li>Writing about dataset hygiene, reasoning traces, and MLOps ergonomics</li>
          <li>Mentoring peers transitioning into applied financial AI</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section section-open-source">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Selected work</span>
      <h2 class="section-title">Outputs that people keep coming back to.</h2>
      <p class="section-description">Snapshots from Hugging Face and recent collaborations. Numbers update automatically through the site data.</p>
    </div>
    <div class="open-source-summary">
      <div class="summary-card">
        <span class="summary-label">Hugging Face downloads</span>
        <span class="summary-value">5,047</span>
        <span class="summary-sub">Models and datasets released publicly</span>
      </div>
      <div class="summary-card">
        <span class="summary-label">Community likes</span>
        <span class="summary-value">86</span>
        <span class="summary-sub">Across open-source releases</span>
      </div>
    </div>
    <div class="open-source-grid">
      <article class="card open-source-card">
        <div class="card-meta">
          <span class="tag">Dataset</span>
          <span class="tag">Finance reasoning</span>
        </div>
        <h3 class="card-title">PersonalFinance_v2</h3>
        <p>A curated reasoning dataset for personal finance assistants, combining chain-of-thought traces with reviewer guidelines.</p>
        <a href="https://huggingface.co/datasets/akhil-theerthala/PersonalFinance_v2" target="_blank" rel="noopener">View on Hugging Face →</a>
      </article>
      <article class="card open-source-card">
        <div class="card-meta">
          <span class="tag">Research</span>
          <span class="tag">FinNLP 2025</span>
        </div>
        <h3 class="card-title">Behaviourally-Grounded Reasoning Chains</h3>
        <p>Solo paper exploring how qualitative interviews inform dataset design and evaluation for finance reasoning models.</p>
        <a href="{{ "/publications" | relative_url }}">Read the abstract →</a>
      </article>
      <article class="card open-source-card">
        <div class="card-meta">
          <span class="tag">Model family</span>
        </div>
        <h3 class="card-title">Kuvera models</h3>
        <p>Finance-focused checkpoints and GGUF ports released on Hugging Face with notes for single-GPU teams.</p>
        <a href="https://huggingface.co/akhil-theerthala" target="_blank" rel="noopener">Browse the hub →</a>
      </article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Right now</span>
      <h2 class="section-title">What I'm exploring in 2025.</h2>
    </div>
    <div class="card-grid">
      <div class="card">
        <h3 class="card-title">Evaluation as a shared practice</h3>
        <p>Designing review cadences that make sense for product managers, compliance partners, and engineers alike.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Annotated reasoning traces</h3>
        <p>Experimenting with annotation flows that capture intermediate model states without overwhelming reviewers.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Smaller models, careful tooling</h3>
        <p>Prototyping single-GPU setups so smaller teams can run finance assistants with predictable behaviour.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Timeline</span>
      <h2 class="section-title">Experiences that shaped my work.</h2>
    </div>
    <div class="journey">
      <div class="journey-year">
        <h3>2025</h3>
        <div class="journey-events">
          <span>Perfios — Senior Data Scientist building reasoning workflows for finance teams.</span>
          <span>Volunteer researcher at the Georgia Tech Financial Services Innovation Lab.</span>
          <span>FinNLP @ EMNLP 2025 — Solo author paper on behaviour-grounded datasets.</span>
          <span>Winner of the Bespoke Labs × HuggingFace × Together.ai reasoning dataset competition.</span>
        </div>
      </div>
      <div class="journey-year">
        <h3>2023</h3>
        <div class="journey-events">
          <span>Graduated from IIT Kharagpur (B.Tech, Aerospace Engineering).</span>
          <span>Joined Perfios as an Applied Scientist I supporting production fintech models.</span>
          <span>Began sharing applied ML notes through writing and talks.</span>
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
      <span class="section-eyebrow">Directory</span>
      <h2 class="section-title">Everything public in one place.</h2>
      <p class="section-description">Lists pull from the data files that power this site. Explore code, datasets, or talks without juggling multiple tabs.</p>
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
        <h3>Working on similar questions?</h3>
        <p>I'm glad to compare notes or hear how others approach finance reasoning systems.</p>
      </div>
      <a class="button primary" href="{{ "/contact" | relative_url }}">Send a message</a>
    </div>
  </div>
</section>
