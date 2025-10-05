---
layout: default
title: Home
---

<section class="home-hero">
  <div class="hero-text">
    <span class="hero-kicker">Financial AI | Reasoning Systems | Production ML</span>
    <h1>Designing trustworthy AI for the finance edge</h1>
    <p class="hero-lead">
      I am Akhil Theerthala, a Senior Data Scientist at Perfios. I build domain-specific reasoning models,
      craft evaluation datasets, and ship production workflows that help financial institutions make faster,
      safer decisions.
    </p>
    <div class="hero-actions">
      <a class="btn-primary" href="{{ '/contact' | relative_url }}">Let's collaborate</a>
      <a class="btn-ghost" href="{{ '/Akhil_Theerthala_Resume.pdf' | relative_url }}" target="_blank" rel="noopener">Download resume</a>
    </div>
    <div class="hero-tags">
      <span class="tag">Perfios IdeaFest finalist</span>
      <span class="tag">FinNLP 2025 author</span>
      <span class="tag">Udacity x AWS ML scholar</span>
    </div>
  </div>
  <div class="hero-panel">
    <div class="hero-photo">
      <img src="{{ site.logo | relative_url }}" alt="Akhil Theerthala">
    </div>
    <div class="hero-panel-body">
      <h3>Currently exploring</h3>
      <ul>
        <li>Financial reasoning benchmarks with explicit chain of thought</li>
        <li>Latency-aware single GPU deployment patterns for enterprise LLMs</li>
        <li>Data generation loops that blend expert priors with self training</li>
      </ul>
      <a class="panel-link" href="{{ '/projects' | relative_url }}">See recent launches -></a>
    </div>
  </div>
</section>

<section class="home-metrics">
  <article class="metric-card">
    <span class="metric-label">HuggingFace reach</span>
    <span class="metric-value">4,369</span>
    <span class="metric-detail">All time downloads across my financial AI releases</span>
  </article>
  <article class="metric-card">
    <span class="metric-label">Model adoption</span>
    <span class="metric-value">552</span>
    <span class="metric-detail">Direct installs of the Kuvera financial reasoning models</span>
  </article>
  <article class="metric-card">
    <span class="metric-label">Community downloads</span>
    <span class="metric-value">21.5k+</span>
    <span class="metric-detail">Additional usage through trusted third party quantized ports</span>
  </article>
  <article class="metric-card">
    <span class="metric-label">Writing community</span>
    <span class="metric-value">212</span>
    <span class="metric-detail">Readers following applied AI writing on Medium and Towards AI</span>
  </article>
</section>

<section class="home-section">
  <div class="section-heading">
    <h2>Signature work</h2>
    <p>Competition wins and productized systems drawn directly from my day to day practice.</p>
  </div>
  <div class="card-grid">
    <article class="feature-card">
      <div class="feature-card-header">
        <span class="badge badge-primary">Dataset | 2025 winner</span>
        <h3>PersonalFinance_v2</h3>
      </div>
      <p>
        First prize reasoning dataset in the Bespoke Labs, HuggingFace, and Together.ai competition.
        More than 7,000 annotated financial questions with chain of thought supervision powering
        high accuracy advisors.
      </p>
      <ul class="feature-list">
        <li>88 community endorsements and 1,413 direct downloads</li>
        <li>Scenario taxonomy spanning salary, taxes, investments, and risk</li>
        <li>Licensed for open experimentation under Apache 2.0</li>
      </ul>
      <a class="text-link" href="https://huggingface.co/datasets/akhil-theerthala/PersonalFinance_v2" target="_blank" rel="noopener">View on HuggingFace -></a>
    </article>
    <article class="feature-card">
      <div class="feature-card-header">
        <span class="badge badge-secondary">Model series</span>
        <h3>Kuvera financial LLMs</h3>
      </div>
      <p>
        Family of single GPU optimized LLMs ranging from 4B to 14B parameters, specializing in fiscal
        planning and policy analysis. Deployed inside Perfios workflows to surface compliant, audit
        traceable recommendations.
      </p>
      <ul class="feature-list">
        <li>552 tracked downloads across five production aligned checkpoints</li>
        <li>Instruction tuned on curated tax, compliance, and investment memos</li>
        <li>Structured chain of thought outputs aligned with downstream verification tools</li>
      </ul>
      <a class="text-link" href="https://huggingface.co/akhil-theerthala" target="_blank" rel="noopener">Browse the models -></a>
    </article>
    <article class="feature-card">
      <div class="feature-card-header">
        <span class="badge">Research | Georgia Tech lab</span>
        <h3>Crowdfunding signal engine</h3>
      </div>
      <p>
        Nine month investigative study at IIT Kharagpur quantifying how social media patterns influence
        crowdfunding success, guided by Dr. Swagato Chatterjee at VGSOM.
      </p>
      <ul class="feature-list">
        <li>Modeling campaign performance using engagement and sentiment signals</li>
        <li>Research grounded in sustained data collection and statistical analysis</li>
        <li>Published artifacts documented for academic reproducibility</li>
      </ul>
      <a class="text-link" href="https://github.com/Akhil-Theerthala/Crowdfunding-Social-Media-Drivers" target="_blank" rel="noopener">Read the code -></a>
    </article>
  </div>
</section>

<section class="home-section">
  <div class="section-heading">
    <h2>Experience snapshot</h2>
    <p>I bridge applied research and production delivery inside fast moving fintech teams.</p>
  </div>
  <div class="experience-grid">
    <article class="experience-card">
      <header>
        <span class="badge badge-primary">2025 - present</span>
        <h3>Senior Data Scientist | Perfios</h3>
      </header>
      <p>
        Leading reasoning first AI initiatives across lending and wealth workflows. Building evaluation
        sandboxes, orchestrating cross functional pilots, and mentoring applied scientists.
      </p>
      <ul>
        <li>Steering domain specific reasoning models for lending and wealth workflows</li>
        <li>Pairing evaluation sandboxes with human feedback loops for trustworthy roll outs</li>
        <li>Finalist in Perfios IdeaFest innovation challenge</li>
      </ul>
    </article>
    <article class="experience-card">
      <header>
        <span class="badge badge-secondary">2023 - 2025</span>
        <h3>Applied Scientist I | Perfios</h3>
      </header>
      <p>
        Owned end to end ML systems spanning document intelligence, credit risk scoring, and proactive
        fraud detection for enterprise clients across APAC.
      </p>
      <ul>
        <li>Rolled out production LLM systems for financial document intelligence</li>
        <li>Optimized inference pipelines to improve end user responsiveness</li>
        <li>Launched ML blogging streams to demystify the Perfios AI stack</li>
      </ul>
    </article>
    <article class="experience-card">
      <header>
        <span class="badge">2022</span>
        <h3>Data Science Intern | Perfios</h3>
      </header>
      <p>
        Built the foundation for Perfios financial document parsers while interning during undergrad.
      </p>
      <ul>
        <li>Introduced templating heuristics that seeded current production pipelines</li>
        <li>Prototyped classification models supporting enterprise onboarding</li>
      </ul>
    </article>
  </div>
</section>

<section class="home-section">
  <div class="section-heading">
    <h2>Research and writing</h2>
    <p>Blending academic rigor with practical experimentation in financial NLP.</p>
  </div>
  <div class="research-grid">
    <article class="research-card">
      <h3>FinNLP at EMNLP 2025</h3>
      <p>
        "Synthesizing Behaviorally Grounded Reasoning Chains" introduces a framework for generating
        finance specific thinking traces with calibrated difficulty bands.
      </p>
      <span class="meta">Paper acceptance | 2025</span>
    </article>
    <article class="research-card">
      <h3>Georgia Tech Financial Services Innovation Lab</h3>
      <p>
        Volunteer researcher building generalized financial reasoning models with extensive ablations across
        model families, learning curricula, and supervision signals.
      </p>
      <span class="meta">Research collaborator | Aug 2025 - present</span>
    </article>
    <article class="research-card">
      <h3>Medium and Towards AI</h3>
      <p>
        Publishing deep dives on dataset engineering, evaluation frameworks, and the future of responsible
        financial AI to an audience of more than 200 practitioners.
      </p>
      <span class="meta">Technical writing | 2023 - present</span>
    </article>
  </div>
</section>

<section class="home-section">
  <div class="section-heading">
    <h2>Career timeline</h2>
    <p>Milestones that shaped my path from aerospace engineering to financial AI.</p>
  </div>
  <div class="timeline-modern">
    <div class="timeline-row">
      <div class="timeline-year">2025</div>
      <div class="timeline-content">
        <p><strong>Promoted</strong> to Senior Data Scientist at Perfios</p>
        <p>First place in the Bespoke Labs, HuggingFace, Together.ai reasoning dataset competition</p>
        <p>Finalist in the Perfios IdeaFest innovation challenge</p>
        <p>FinNLP Workshop at EMNLP 2025 paper acceptance</p>
        <p>Volunteer research work at Georgia Tech Financial Services Innovation Lab</p>
      </div>
    </div>
    <div class="timeline-row">
      <div class="timeline-year">2023</div>
      <div class="timeline-content">
        <p><strong>Graduated</strong> from IIT Kharagpur in Aerospace Engineering</p>
        <p>Joined Perfios as an Applied Scientist building production LLM workflows</p>
        <p>Started sharing ML learnings through blogging and community talks</p>
      </div>
    </div>
    <div class="timeline-row">
      <div class="timeline-year">2022</div>
      <div class="timeline-content">
        <p>Data Science internship at Perfios working on financial document intelligence</p>
        <p>Undergraduate researcher at VGSOM with Dr. Swagato Chatterjee</p>
        <p>Recipient of the Udacity and AWS ML scholarship first cohort</p>
      </div>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="section-heading">
    <h2>Toolbox</h2>
    <p>Technologies and methods I reach for when solving financial AI problems.</p>
  </div>
  <div class="toolbox">
    <div class="tool-column">
      <h3>Stack</h3>
      <ul>
        <li>PyTorch, HuggingFace Transformers, TRL</li>
        <li>TensorFlow, ONNX Runtime, Docker</li>
        <li>Weights and Biases, MLflow, Prefect</li>
      </ul>
    </div>
    <div class="tool-column">
      <h3>Specialties</h3>
      <ul>
        <li>Financial reasoning datasets and evaluations</li>
        <li>Chain of thought supervision and distillation</li>
        <li>Single GPU optimization and productization</li>
      </ul>
    </div>
    <div class="tool-column">
      <h3>Domains</h3>
      <ul>
        <li>Document intelligence and underwriting copilots</li>
        <li>Enterprise AI deployment and compliance</li>
        <li>LLM data curation and reinforcement loops</li>
      </ul>
    </div>
  </div>
</section>

<section class="callout">
  <div class="callout-body">
    <h2>Bring thoughtful AI to finance</h2>
    <p>
      Whether you are exploring new reasoning datasets, evaluating LLM copilots, or validating responsible
      AI roll outs, I am always excited to collaborate.
    </p>
    <a class="btn-primary" href="mailto:{{ site.email }}">Start a conversation</a>
  </div>
</section>
