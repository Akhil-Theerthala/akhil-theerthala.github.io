---
layout: default
title: Research
description: Research publications, competitions, and investigations led by Akhil Theerthala
---

<section class="hero">
  <div class="container">
    <div class="hero-copy">
      <p class="hero-eyebrow">Research</p>
      <h1 class="hero-title">Curiosity backed by evidence.</h1>
      <p class="hero-description">
        My research spans reasoning datasets, financial NLP, and how people interact with AI systems.
        I enjoy turning messy questions into reproducible studies and practical recommendations.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="{{ "/publications" | relative_url }}">See publications</a>
        <a class="button ghost" href="https://huggingface.co/datasets/akhil-theerthala" target="_blank" rel="noopener">Explore datasets</a>
      </div>
    </div>
    <div class="hero-card">
      <div class="hero-card-content">
        <div class="stat-block">
          <div>
            <div class="stat-number">1st place</div>
            <div class="stat-label">Reasoning Dataset Competition 2025</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">FinNLP</div>
            <div class="stat-label">EMNLP 2025 solo-author paper</div>
          </div>
        </div>
        <div class="stat-block">
          <div>
            <div class="stat-number">FSIL</div>
            <div class="stat-label">Volunteer researcher at Georgia Tech Financial Services Innovation Lab</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Competition recognition</span>
      <h2 class="section-title">PersonalFinance_v2</h2>
      <p class="section-description">Awarded first place in the Bespoke Labs × HuggingFace × Together.ai reasoning dataset competition.</p>
    </div>
    <div class="card">
      <div class="card-meta">
        <span class="tag">Dataset design</span>
        <span class="tag">Chain-of-thought</span>
      </div>
      <p>
        PersonalFinance_v2 captures 7k+ everyday finance conversations with explicit reasoning steps, grounded in behavioural research.
        It balances empathetic tone with verifiable facts and has become the backbone for my production model work.
      </p>
      <ul class="list list-check">
        <li>Scenario coverage for budgeting, credit, investing, and financial planning</li>
        <li>Quality control rubric inspired by financial advisory training</li>
        <li>Released under Apache-2.0 to encourage community use</li>
      </ul>
      <a class="button ghost" href="https://huggingface.co/datasets/akhil-theerthala/PersonalFinance_v2" target="_blank" rel="noopener">Review the dataset →</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Active investigations</span>
      <h2 class="section-title">Questions I'm exploring right now.</h2>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="card-meta">
          <span class="tag">Volunteer research</span>
        </div>
        <h3 class="card-title">Georgia Tech Financial Services Innovation Lab</h3>
        <p>Collaborating on evaluation frameworks for trustworthy financial AI.</p>
        <ul class="list list-check">
          <li>Designing data collection processes that reduce annotation fatigue</li>
          <li>Studying how domain experts audit reasoning traces</li>
          <li>Documenting best practices for interdisciplinary research teams</li>
        </ul>
      </div>
      <div class="card">
        <div class="card-meta">
          <span class="tag">Academic</span>
        </div>
        <h3 class="card-title">FinNLP 2025</h3>
        <p>Solo-author paper on synthesising behaviourally grounded reasoning chains for finance LLMs.</p>
        <ul class="list list-check">
          <li>Bridges qualitative interviews with synthetic data generation</li>
          <li>Shares evaluation heuristics for tone, empathy, and accuracy</li>
          <li>Includes ablation studies on prompt structure choices</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-eyebrow">Foundational work</span>
      <h2 class="section-title">Where it started.</h2>
    </div>
    <div class="journey">
      <div class="journey-year">
        <h3>IIT Kharagpur</h3>
        <div class="journey-events">
          <span>Undergraduate researcher at Vinod Gupta School of Management with Dr. Swagato Chatterjee.</span>
          <span>Studied how social media engagement reshapes crowdfunding success metrics.</span>
          <span>Laid the groundwork for my focus on finance data quality.</span>
        </div>
      </div>
      <div class="journey-year">
        <h3>Perfios</h3>
        <div class="journey-events">
          <span>Applied the research to production credit and wealth workflows.</span>
          <span>Built evaluation loops to keep reasoning transparent for business stakeholders.</span>
          <span>Shared findings through internal workshops and documentation.</span>
        </div>
      </div>
    </div>
  </div>
</section>

{% assign huggingface_datasets = site.data.external_resources.collections | where: "key", "huggingface_datasets" | first %}
{% assign medium_articles = site.data.external_resources.collections | where: "key", "medium_articles" | first %}

{% if huggingface_datasets or medium_articles %}
  <section class="section section-resource-directory">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Primary sources</span>
        <h2 class="section-title">The datasets and essays behind the work.</h2>
        <p class="section-description">These listings stay in sync with my research tracker so you can reference the same artefacts I'm using day-to-day.</p>
      </div>
      <div class="resource-panels">
        {% if huggingface_datasets %}
          <details class="resource-panel" open>
            <summary>
              <span class="resource-panel-title">{{ huggingface_datasets.title }}</span>
              <span class="resource-panel-count">{{ huggingface_datasets.items | size }} items</span>
            </summary>
            {% if huggingface_datasets.blurb %}
              <p class="resource-panel-blurb">{{ huggingface_datasets.blurb }}</p>
            {% endif %}
            <ul class="resource-list">
              {% for item in huggingface_datasets.items %}
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

        {% if medium_articles %}
          <details class="resource-panel">
            <summary>
              <span class="resource-panel-title">{{ medium_articles.title }}</span>
              <span class="resource-panel-count">{{ medium_articles.items | size }} items</span>
            </summary>
            {% if medium_articles.blurb %}
              <p class="resource-panel-blurb">{{ medium_articles.blurb }}</p>
            {% endif %}
            <ul class="resource-list">
              {% for item in medium_articles.items %}
                <li class="resource-list-item">
                  <div class="resource-item">
                    <div class="resource-item-heading">
                      <a href="{{ item.link }}" target="_blank" rel="noopener">
                        {{ item.title }}
                      </a>
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
        <h3>Have a research question in mind?</h3>
        <p>I'm open to collaborations, peer reviews, and speaking about responsible reasoning systems.</p>
      </div>
      <a class="button primary" href="{{ "/contact" | relative_url }}">Reach out</a>
    </div>
  </div>
</section>
