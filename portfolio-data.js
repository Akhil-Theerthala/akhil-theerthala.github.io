// Akhil Theerthala — portfolio content
window.PORTFOLIO_DATA = {
  name: "Akhil Theerthala",
  role: "Applied Scientist",
  location: "Hyderabad, India",
  email: "akhiltvsn@gmail.com",
  intro:
    "Applied Scientist building production AI at the intersection of NLP, Vision-Language Models, and FinTech.",

  longIntro: [
    "I work at the intersection of applied machine learning, financial data, and research-grade evaluation.",
    "I’m an Applied Data Scientist building toward senior applied scientist and researcher roles.My work spans finance - specific data curation, validation frameworks, quality assessment models, and agentic systems for market intelligence and personalization.At Perfios, one of India’s leading B2B SaaS platforms for banks and financial institutions, I’ve contributed to ML systems designed for real - world reliability, domain precision, and measurable business value.",
    "I also publish personal ML artifacts on Hugging Face, including personal finance datasets and Kuvera-focused advisory models, which have collectively crossed 50K+ downloads through direct usage and community GGUF adaptations.",
  ],

  stats: [],

  workExperience: [
    {
      date: "Apr 2025 — Present",
      title: "Senior Data Scientist",
      org: "Perfios Software Solutions",
      desc: [
        "— Awarded Circle of Excellence for GenAI research in financial document intelligence.",
        "— Fine-tuned PaliGemma2 via LoRA on domain-specific financial data, achieving TEDS 0.85 on internal document benchmarks.",
        "— Built a reference-free ViT legibility scorer at 92% precision to gate low-fidelity inputs before inference, preventing downstream hallucination and reducing wasted compute.",
        "— Designed and validated multi-stage agentic reasoning workflows (Google ADK) for underwriting, claims, and retention-risk tasks.",
      ],
    },
    {
      date: "Aug 2025 — Present",
      title: "Research Volunteer",
      org: "FSIL & HCAI Labs, Georgia Tech",
      desc: [
        "— Co-authored FinForge, a semi-synthetic benchmark generation pipeline for financial agentic systems, accepted at the AAAI 2026 Agentic AI in Financial Services Workshop.",
        '— Contributed to "Stable Steering in Activation Space for LLMs", submitted to the Mechanistic Interpretability Workshop at ICML 2026.',
      ],
    },
    {
      date: "Jun 2023 — Apr 2025",
      title: "Data Scientist",
      org: "Perfios Software Solutions",
      desc: [
        "— Reduced document classification latency by 97.5% (8s \u2192 200ms) via distillation and quantization, preserving F1 parity.",
        "— Improved generalized table detection by 27.6% through semi-synthetic data curation and systematic evaluation of YOLOv8 variants.",
        "— Integrated a fine-tuned semantic row-detection module into the production TSR pipeline at under 40ms overhead.",
      ],
    },
  ],

  education: [
    {
      date: "Apr 2026 — Present",
      title: "MSc, Data Science",
      org: "International Institute of Information Technology, Hyderabad",
    },
    {
      date: "Aug 2019 — May 2023",
      title: "B.Tech, Aerospace Engineering",
      org: "Indian Institute of Technology, Kharagpur",
    },
  ],

  publications: [
    {
      year: "2026",
      venue: "Agentic AI in Financial Services Workshop, AAAI 2026",
      title:
        "FinForge: A Semi-Synthetic Benchmark Generation Framework for Finance",
      authors: [
        "Glenn Matlin",
        "Akhil Theerthala",
        "Anant Gupta",
        "Anirudh JM",
        "Rayan Castilla",
        "Yi Mei Ng",
        "Sudheer Chava",
      ],
      abstract:
        "A framework for generating semi-synthetic, programmatically-grounded benchmarks for evaluating agentic finance systems on tasks that real-world deployments actually care about.",
      tags: ["Benchmarks", "Agentic AI", "Workshop"],
      arxiv: "https://arxiv.org/abs/2601.06747",
    },
    {
      year: "2025",
      venue: "FinNLP @ EMNLP 2025",
      title:
        "A Data-Centric Framework for Training Behaviour-Aware Personal Finance Language Models",
      authors: ["A. Theerthala"],
      abstract:
        "Curating reasoning data that captures financial-behaviour patterns from Indian retail-investor cohorts; trained 8B / 14B variants downloaded 51,000+ times on Hugging Face.",
      tags: ["Personal Finance", "Data-centric", "LLM"],
      arxiv: "https://arxiv.org/abs/2509.14180",
    },
  ],

  projects: [
    {
      title: "Kuvera \u2014 Personal Finance LLMs",
      kicker: "Open source \u00b7 Hugging Face",
      desc: "An instruction-tuning dataset and fine-tuned 8B / 14B models for the Indian personal-finance context. 51,000+ cumulative downloads.",
      metric: "51K+ downloads",
      year: "2025",
      href: "https://huggingface.co/datasets/Akhil-Theerthala/Kuvera-PersonalFinance-V2.1",
      tags: ["Dataset", "Fine-tuning", "Finance"],
    },
    {
      title: "Reasoning Dataset Challenge",
      kicker: "1st place, globally",
      desc: "Built a synthetic reasoning dataset and trained a 7B model that beat 150+ teams from Bespoke Labs, Hugging Face and Together.ai. Zero budget, all curation.",
      metric: "1 / 150+ teams",
      year: "2025",
      href: "https://huggingface.co/Akhil-Theerthala",
      tags: ["Competition", "Reasoning", "Synthetic data"],
    },
    {
      title: "LazyInfer",
      kicker: "Open source · Python framework",
      desc: "A Python framework for YAML-driven multi-stage LLM pipelines over JSONL datasets, with async execution, retries, rate limiting, checkpointing, structured output validation, and optional Hugging Face dataset publishing.",
      metric: "GitHub",
      year: "2025",
      href: "https://github.com/Akhil-Theerthala/LazyInfer",
      tags: ["YAML", "AsyncIO", "Pydantic"],
    },
  ],

  writings: [
    {
      file: "Density-Vs-Diversity.md",
      title: "Density vs. Diversity in Data Selection",
      date: "Jan 2026",
      year: "2026",
      category: "Data & Evaluation",
      read: "12 min",
      featured: true,
      excerpt:
        "Comparing dense and diverse sampling strategies for VLM training on 15k-sample synthetic datasets \u2014 and what the curves actually say.",
    },
    {
      file: "Creating-a-Reasoning-Dataset-with.md",
      title: "Creating a Reasoning Dataset with No Budget",
      date: "Apr 2025",
      year: "2025",
      category: "LLMs & Reasoning",
      read: "18 min",
      featured: true,
      excerpt:
        "How I ranked 1st globally in the Reasoning Dataset Creation Challenge using nothing but synthetic data and a lot of late nights.",
    },
    {
      file: "From-Training-Language-Models-to.md",
      title: "From Training Language Models to DeepSeek-R1",
      date: "Feb 2025",
      year: "2025",
      category: "LLMs & Reasoning",
      read: "14 min",
      featured: true,
      excerpt:
        "How training regimes evolved from classic supervised approaches to today's reasoning models \u2014 a guided tour.",
    },
    {
      file: "7-Practical-PyTorch-Tips-for.md",
      title: "7 Practical PyTorch Tips",
      date: "Feb 2025",
      year: "2025",
      category: "Systems & Production",
      read: "8 min",
      excerpt:
        "Quiet wins from production PyTorch \u2014 the kind of thing nobody puts in tutorials.",
    },
    {
      file: "Arent-these-new-AI-features.md",
      title: "Aren't These New AI Features Just… Features?",
      date: "Aug 2024",
      year: "2024",
      category: "Career & Practice",
      read: "6 min",
    },
    {
      file: "Building-Blocks-of-Transformers.md",
      title: "Building Blocks of Transformers",
      date: "Mar 2024",
      year: "2024",
      category: "Fundamentals",
      read: "11 min",
    },
    {
      file: "Making-Sense-of-PyTorch’s-to-and.md",
      title: "Making Sense of PyTorch's .to() and Device Management",
      date: "Aug 2023",
      year: "2023",
      category: "Systems & Production",
      read: "5 min",
    },
    {
      file: "De-mystifying-Regular-Expressions.md",
      title: "De-mystifying Regular Expressions",
      date: "Aug 2023",
      year: "2023",
      category: "Fundamentals",
      read: "15 min",
    },
    {
      file: "Machine-Learning-Roadmap-Community.md",
      title: "Machine Learning Roadmap — Community Edition",
      date: "Jul 2023",
      year: "2023",
      category: "Career & Practice",
      read: "14 min",
    },
    {
      file: "Data-Lifecycle-in-Production.md",
      title: "Data Lifecycle in Production",
      date: "Jun 2023",
      year: "2023",
      category: "Systems & Production",
      read: "12 min",
    },
    {
      file: "Machine-Learning-Roadmap-—-Part-1.md",
      title: "Machine Learning Roadmap — Part 1",
      date: "Jun 2023",
      year: "2023",
      category: "Career & Practice",
      read: "15 min",
    },
    {
      file: "Generating-Adversaries-for-CNNs-My.md",
      title: "Generating Adversaries for CNNs",
      date: "Mar 2023",
      year: "2023",
      category: "Fundamentals",
      read: "9 min",
    },
    {
      file: "How-to-Maximize-ML-Project-Success.md",
      title: "How to Maximize ML Project Success",
      date: "Feb 2023",
      year: "2023",
      category: "Career & Practice",
      read: "10 min",
    },
    {
      file: "Data-Processing-in-Production.md",
      title: "Data Processing in Production",
      date: "Feb 2023",
      year: "2023",
      category: "Systems & Production",
      read: "20 min",
    },
    {
      file: "Data-centric-approach-for-Machine.md",
      title: "Data-centric Approach for Machine Learning",
      date: "Jan 2023",
      year: "2023",
      category: "Data & Evaluation",
      read: "11 min",
    },
    {
      file: "Error-Analysis-for-Machine-learning.md",
      title: "Error Analysis for Machine Learning",
      date: "Jan 2023",
      year: "2023",
      category: "Data & Evaluation",
      read: "6 min",
    },
    {
      file: "An-Overview-of-Modeling-for-ML.md",
      title: "An Overview of Modeling for ML",
      date: "Jan 2023",
      year: "2023",
      category: "Fundamentals",
      read: "12 min",
    },
    {
      file: "MLOps-Notes-2-Model-Deployment.md",
      title: "MLOps Notes 2: Model Deployment",
      date: "Jan 2023",
      year: "2023",
      category: "Systems & Production",
      read: "10 min",
    },
    {
      file: "Convolutional-NNs-17-The.md",
      title: "Convolutional Neural Networks: The Complete Guide",
      date: "Jan 2023",
      year: "2023",
      category: "Fundamentals",
      read: "7 min",
    },
    {
      file: "MLOps-Notes-1-The-Machine-Learning.md",
      title: "MLOps Notes 1: The Machine Learning Lifecycle",
      date: "Jan 2023",
      year: "2023",
      category: "Systems & Production",
      read: "10 min",
    },
    {
      file: "Investigating-the-Seattle-Airbnb.md",
      title: "Investigating the Seattle Airbnb Dataset",
      date: "Jul 2022",
      year: "2022",
      category: "Data & Evaluation",
      read: "9 min",
    },
    {
      file: "How-to-Start-Your-Data-Journey.md",
      title: "How to Start Your Data Journey",
      date: "2022",
      year: "2022",
      category: "Career & Practice",
      read: "7 min",
    },
  ],

  now: [
    {
      label: "Right now",
      text: "Senior Data Scientist @ Perfios, working on document quality assessment and personalization.",
    },
    {
      label: "Reading",
      text: "Interpretability and evals of LLMs / agentic systems.",
    },
    {
      label: "Research",
      text: "Working on uncertainty quantification in LLMs.",
    },
    {
      label: "Side quest",
      text: "MSc in Data Science @ IIIT Hyderabad.",
    },
  ],

  socials: [
    {
      label: "GitHub",
      href: "https://github.com/Akhil-Theerthala",
      handle: "github.com/Akhil-Theerthala",
    },
    {
      label: "Hugging Face",
      href: "https://huggingface.co/Akhil-Theerthala",
      handle: "huggingface.co/Akhil-Theerthala",
    },
    {
      label: "Medium",
      href: "https://medium.com/@akhiltvsn",
      handle: "medium.com/@akhiltvsn",
    },
    {
      label: "Email",
      href: "mailto:akhiltvsn@gmail.com",
      handle: "akhiltvsn@gmail.com",
    },
  ],
};
