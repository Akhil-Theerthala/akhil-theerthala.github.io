// Akhil Theerthala portfolio content
window.PORTFOLIO_DATA = {
  name: "Akhil Theerthala",
  role: "Applied Scientist",
  currentRole: "Senior Data Scientist, Perfios Software Solutions",
  location: "Bengaluru, India",
  email: "akhiltvsn@gmail.com",
  intro:
    "Studying data-centric and evaluation-centric methods for reliable AI systems in Finance.",

  longIntro: [
    "I am a Senior Data Scientist at Perfios Software Solutions, working on applied ML systems for financial document intelligence and finance-specific language models. My work sits between research and deployment: adapting VLMs for dense financial documents, building evaluation and quality gates, and translating prototypes into reliable systems for banks, lenders, insurers, and personal-finance workflows.",
    "My research focus is data-centric and evaluation-centric AI: synthetic and semi-synthetic data curation, behavior-aware personal-finance supervision, agentic finance benchmarks, slice-based evaluation, and lightweight interpretability or steering for language models. I care about methods that improve reliability under real constraints: latency, auditability, cost, and failure transparency.",
  ],

  researchFocus: [
    {
      title: "Data Curation for Reliable Models",
      desc: "Synthetic and semi-synthetic dataset design, density-versus-diversity studies, and behavior-grounded supervision for low-resource or high-stakes domains.",
    },
    {
      title: "Financial AI and Agentic Systems",
      desc: "Benchmarks and evaluation protocols for financial agents, underwriting workflows, personalization, and market-intelligence tasks.",
    },
    {
      title: "Document AI and VLM Adaptation",
      desc: "Vision-language adaptation, table-structure understanding, legibility gating, and deployment-aware evaluation for financial documents.",
    },
    {
      title: "LLM Evaluation and Interpretability",
      desc: "Reference-free quality scoring, LLM-jury evaluation, activation-space steering, and methods that make model behavior measurable and auditable.",
    },
  ],

  stats: [],

  workExperience: [
    {
      date: "Apr 2025 - Present",
      title: "Senior Data Scientist",
      org: "Perfios Software Solutions",
      desc: [
        "Awarded Circle of Excellence for GenAI research in financial document intelligence.",
        "Fine-tuned PaliGemma2 via LoRA on domain-specific financial data, achieving TEDS 0.85 on internal document benchmarks.",
        "Built a reference-free ViT legibility scorer at 92% precision to gate low-fidelity inputs before inference, preventing downstream hallucination and reducing wasted compute.",
        "Designed and validated multi-stage agentic reasoning workflows (Google ADK) for underwriting, claims, and retention-risk tasks.",
      ],
    },
    {
      date: "Aug 2025 - Present",
      title: "Research Volunteer",
      org: "FSIL & HCAI Labs, Georgia Tech",
      desc: [
        "Co-authored FinForge, a semi-synthetic benchmark generation pipeline for financial agentic systems, accepted at the AAAI 2026 Agentic AI in Financial Services Workshop.",
        "Contributed to 'Stable Steering in Activation Space for LLMs', submitted to the Mechanistic Interpretability Workshop at ICML 2026.",
      ],
    },
    {
      date: "Jun 2023 - Apr 2025",
      title: "Data Scientist",
      org: "Perfios Software Solutions",
      desc: [
        "Reduced document classification latency by 97.5% (8s → 200ms) via distillation and quantization, preserving F1 parity.",
        "Improved generalized table detection by 27.6% through semi-synthetic data curation and systematic evaluation of YOLOv8 variants.",
        "Integrated a fine-tuned semantic row-detection module into the production TSR pipeline at under 40ms overhead.",
      ],
    },
  ],

  education: [
    {
      date: "Apr 2026 - Present",
      title: "MSc, Data Science",
      org: "International Institute of Information Technology, Hyderabad",
    },
    {
      date: "Aug 2019 - May 2023",
      title: "B.Tech, Aerospace Engineering",
      org: "Indian Institute of Technology, Kharagpur",
    },
  ],

  publications: [
    {
      year: "2026",
      status: "Submitted",
      venue: "Mechanistic Interpretability Workshop, ICML 2026",
      title: "Stable Steering in Activation Space for Large Language Models",
      authors: [
        "Glenn Matlin",
        "Isaac Song",
        "Mohammed Rehan Parwani",
        "Akhil Theerthala",
        "Arjun Chatterjee",
        "Anthony Wen-Ming Zang",
        "Emile Timothy Anand",
        "Mark Riedl",
        "Sebastien Krier",
        "Yonadav G Shavit",
        "Maria Kostylew",
      ],
      abstract:
        "A large-scale study of activation steering across 275 occupational roles, 4 steering strengths, and 500K judged generations on Olmo-3-7B-Instruct. The work connects controllability to the geometry of role vectors, identifying mostly smooth, direction-specific steering, a 13% anti-controllable minority due to prior saturation, and a clear mismatch between representational and behavioral dimensionality.",
      tags: ["Activation Steering", "Interpretability", "LLMs"],
    },
    {
      year: "2026",
      status: "Accepted workshop paper",
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
        "A scalable semi-synthetic pipeline for building finance-specific LM benchmarks from authoritative sources using expert-guided curation and controlled LM synthesis. FinForge-5k contains 5,000+ human-validated question-answer pairs across 11 finance subdomains and reveals substantial gaps in financial reasoning, even as leading models approach 80% accuracy.",
      tags: ["Benchmarks", "Agentic AI", "Finance"],
      arxiv: "https://arxiv.org/abs/2601.06747",
    },
    {
      year: "2025",
      status: "Preprint / submission-stage work",
      venue: "FinNLP @ EMNLP 2025",
      title:
        "A Data-Centric Framework for Training Behaviour-Aware Personal Finance Language Models",
      authors: ["Akhil Theerthala"],
      abstract:
        "A reproducible data-centric framework that combines financial context with behavioral-finance studies to create supervision for end-to-end personal-finance advisors. Using a 19k-sample reasoning dataset, a fine-tuned Qwen-3-8B matches much larger 14-32B baselines on factuality, fluency, and personalization while reducing cost by about 80%.",
      tags: ["Personal Finance", "Data-centric", "LLM Evaluation"],
      arxiv: "https://arxiv.org/abs/2509.14180",
    },
  ],

  projects: [
    {
      title: "Kuvera Personal Finance Datasets and LLMs",
      kicker: "Open source · Hugging Face",
      desc: "Research contribution: curated behavior-aware supervision data for Indian personal-finance reasoning, fine-tuned 8B and 14B models, and evaluated personalization quality against larger baselines.",
      metric: "HuggingFace",
      stats: [
        { label: "Total downloads", value: "56,124" },
        { label: "Direct downloads", value: "10K" },
        { label: "Community GGUF downloads", value: "46,124" },
        { label: "Likes", value: "103" },
      ],
      year: "2025",
      href: "https://huggingface.co/datasets/Akhil-Theerthala/Kuvera-PersonalFinance-V2.1",
      tags: ["Dataset", "Fine-tuning", "Finance"],
    },
    {
      title: "Reasoning Dataset Challenge",
      kicker: "1st place, global competition",
      desc: "Research contribution: built a synthetic reasoning dataset and trained a 7B model that outperformed larger baselines through curation quality rather than model scale.",
      metric: "1 / 150+ teams",
      year: "2025",
      href: "https://huggingface.co/Akhil-Theerthala",
      tags: ["Reasoning", "Synthetic data", "Evaluation"],
    },
    {
      title: "LazyInfer",
      kicker: "Open source · Python framework",
      desc: "Research contribution: designed a YAML-driven execution layer for repeatable multi-stage LLM inference over JSONL datasets, with async execution, retries, checkpointing, and schema validation.",
      metric: "GitHub",
      year: "2025",
      href: "https://github.com/Akhil-Theerthala/LazyInfer",
      tags: ["Pipelines", "Structured outputs", "Reproducibility"],
    },
  ],

  writings: [
    {
      file: "Density-Vs-Diversity.md",
      title: "Density vs. Diversity in Data Selection",
      date: "Jan 2026",
      year: "2026",
      category: "Research Notes",
      read: "12 min",
      featured: true,
      excerpt:
        "A controlled VLM data-curation study comparing dense questioning against diverse visual sampling under domain-data constraints.",
    },
    {
      file: "Creating-a-Reasoning-Dataset-with.md",
      title: "Creating a Reasoning Dataset with No Budget",
      date: "Apr 2025",
      year: "2025",
      category: "Research Notes",
      read: "18 min",
      featured: true,
      excerpt:
        "A practical account of building a personal-finance reasoning dataset and winning a global reasoning-data challenge through curation.",
    },
    {
      file: "LazyInfer-Design-Notes.md",
      title: "LazyInfer: Design Notes for Reliable LLM Pipelines",
      date: "Jan 2026",
      year: "2026",
      category: "Technical Essays",
      read: "7 min",
      featured: true,
      excerpt:
        "Design notes for repeatable multi-stage LLM inference with YAML configuration, retries, checkpointing, and schema validation.",
    },
    {
      file: "From-Training-Language-Models-to.md",
      title: "From Training Language Models to DeepSeek-R1",
      date: "Feb 2025",
      year: "2025",
      category: "Technical Essays",
      read: "14 min",
      excerpt:
        "A guided overview of how training regimes evolved from supervised learning to modern reasoning models.",
    },
    {
      file: "7-Practical-PyTorch-Tips-for.md",
      title: "7 Practical PyTorch Tips",
      date: "Feb 2025",
      year: "2025",
      category: "Technical Essays",
      read: "8 min",
      excerpt:
        "Production PyTorch practices for device placement, debugging, memory behavior, and model iteration.",
    },
    {
      file: "Building-Blocks-of-Transformers.md",
      title: "Building Blocks of Transformers",
      date: "Mar 2024",
      year: "2024",
      category: "Older Learning Notes",
      read: "11 min",
    },
    {
      file: "Making-Sense-of-PyTorch’s-to-and.md",
      title: "Making Sense of PyTorch's .to() and Device Management",
      date: "Aug 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "5 min",
    },
    {
      file: "De-mystifying-Regular-Expressions.md",
      title: "De-mystifying Regular Expressions",
      date: "Aug 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "15 min",
    },
    {
      file: "Data-Lifecycle-in-Production.md",
      title: "Data Lifecycle in Production",
      date: "Jun 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "12 min",
    },
    {
      file: "Data-Processing-in-Production.md",
      title: "Data Processing in Production",
      date: "Feb 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "20 min",
    },
    {
      file: "Error-Analysis-for-Machine-learning.md",
      title: "Error Analysis for Machine Learning",
      date: "Jan 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "6 min",
    },
    {
      file: "An-Overview-of-Modeling-for-ML.md",
      title: "An Overview of Modeling for ML",
      date: "Jan 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "12 min",
    },
    {
      file: "MLOps-Notes-2-Model-Deployment.md",
      title: "MLOps Notes 2: Model Deployment",
      date: "Jan 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "10 min",
    },
    {
      file: "MLOps-Notes-1-The-Machine-Learning.md",
      title: "MLOps Notes 1: The Machine Learning Lifecycle",
      date: "Jan 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "10 min",
    },
  ],

  collaborationInterests: [
    "Data-centric and evaluation-centric AI for finance",
    "Agentic finance benchmarks and tool-use evaluation",
    "Document AI reliability, legibility, and VLM adaptation",
    "Behavior-aware personal-finance language models",
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

  researchProfiles: [
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=_H1O3ScAAAAJ&hl=en",
      handle: "Publications and citations",
    },
    {
      label: "GitHub",
      href: "https://github.com/Akhil-Theerthala",
      handle: "Code and tools",
    },
    {
      label: "Hugging Face",
      href: "https://huggingface.co/Akhil-Theerthala",
      handle: "Datasets and models",
    },
  ],

  contactLinks: [
    {
      label: "Email",
      href: "mailto:akhiltvsn@gmail.com",
      handle: "akhiltvsn@gmail.com",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/akhil-theerthala/",
      handle: "Professional profile",
    },
    {
      label: "X / Twitter",
      href: "https://x.com/thesilvervein",
      handle: "Research and build notes",
    },
  ],

  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/akhil-theerthala/",
      handle: "linkedin.com/in/akhil-theerthala",
    },
    {
      label: "X / Twitter",
      href: "https://x.com/thesilvervein",
      handle: "x.com/thesilvervein",
    },
    {
      label: "Email",
      href: "mailto:akhiltvsn@gmail.com",
      handle: "akhiltvsn@gmail.com",
    },
  ],
};
