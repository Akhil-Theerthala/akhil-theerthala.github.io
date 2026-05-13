// Akhil Theerthala — portfolio content
window.PORTFOLIO_DATA = {
  name: "Akhil Theerthala",
  role: "Applied Scientist",
  location: "Hyderabad, India",
  email: "akhiltvsn@gmail.com",
  intro:
    "Applied Scientist building production AI at the intersection of NLP, Vision-Language Models, and FinTech.",

  longIntro: [
    "Applied Scientist with 2.5+ years of hands-on experience building production AI systems at the intersection of NLP, Vision-Language Models, and FinTech. I translate cutting-edge research into scalable, real-world systems \u2014 from fine-tuning large multimodal models to architecting multi-stage agentic reasoning workflows.",
    "At Perfios I currently lead efforts adapting open-weight VLMs (PaliGemma2 via LoRA) for complex financial document layouts, and building agentic pipelines (Google-ADK) for underwriting, claims, and retention risk. Beyond industry work I publish, contribute open-source, and volunteer with Georgia Tech's Financial Services Innovation Lab on financial LLM reasoning.",
  ],

  stats: [],

  experience: [
    {
      date: "Apr 2026 — Present",
      title: "MSc, Data Science",
      org: "International Institute of Information Technology, Hyderabad",
      desc: "Online MSc pursued alongside the Senior Data Scientist role at Perfios. Focused on representation learning, reasoning, and applied ML for finance.",
      tags: ["IIIT Hyderabad", "Online"],
    },
    {
      date: "Apr 2025 — Present",
      title: "Senior Data Scientist",
      org: "Perfios Software Solutions",
      desc: "Experimenting with VLMs (PaliGemma2, Qwen2-VL) for financial-document reasoning. Building synthetic-data and evaluation pipelines for behaviour-aware finance LLMs.",
      tags: ["VLM", "Reasoning", "Synthetic data"],
    },
    {
      date: "Jun 2023 — Apr 2025",
      title: "Data Scientist",
      org: "Perfios Software Solutions",
      desc: "Reduced inference latency 8s\u2009\u2192\u2009200ms via model distillation. Improved table detection by 27.6% and shipped a semantic row-detection algorithm for Table Structure Recognition.",
      tags: ["Distillation", "OCR/TSR", "Production"],
    },
    {
      date: "Aug 2019 — May 2023",
      title: "B.Tech, Aerospace Engineering",
      org: "Indian Institute of Technology, Kharagpur",
      desc: "Switched from rockets to representation learning along the way \u2014 stayed for the math.",
      tags: ["IIT KGP"],
    },
  ],

  publications: [
    {
      year: "2026",
      venue: "Agentic AI in Financial Services Workshop, AAAI 2026",
      title:
        "FinForge: A Semi-Synthetic Benchmark Generation Framework for Finance",
      authors: ["G. Matlin", "A. Theerthala", "S. Khare", "P. Kumar", "et al."],
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
      year: "2024 \u2014 ongoing",
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
      title: "PaperStack",
      kicker: "Research tool",
      desc: "A tiered, retrieval-aware reader for research papers \u2014 trades off speed and depth depending on how much of the paper you actually want to engage with.",
      metric: "Personal",
      year: "2024",
      href: "https://github.com/Akhil-Theerthala",
      tags: ["RAG", "Tooling"],
    },
  ],

  writings: [
    {
      file: "Density-Vs-Diversity.md",
      title: "Density vs. Diversity in Data Selection",
      date: "Jan 2026",
      year: "2026",
      category: "AI/ML",
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
      category: "AI/ML",
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
      category: "AI/ML",
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
      category: "PyTorch",
      read: "8 min",
      excerpt:
        "Quiet wins from production PyTorch \u2014 the kind of thing nobody puts in tutorials.",
    },
    {
      file: "Arent-these-new-AI-features.md",
      title: "Aren't These New AI Features Just\u2026 Features?",
      date: "Aug 2024",
      year: "2024",
      category: "Opinion",
      read: "6 min",
    },
    {
      file: "Building-Blocks-of-Transformers.md",
      title: "Building Blocks of Transformers",
      date: "Mar 2024",
      year: "2024",
      category: "AI/ML",
      read: "11 min",
    },
    {
      file: "Making-Sense-of-PyTorch’s-to-and.md",
      title: "Making Sense of PyTorch's .to() and Device Management",
      date: "Aug 2023",
      year: "2023",
      category: "PyTorch",
      read: "5 min",
    },
    {
      file: "De-mystifying-Regular-Expressions.md",
      title: "De-mystifying Regular Expressions",
      date: "Aug 2023",
      year: "2023",
      category: "Python",
      read: "15 min",
    },
    {
      file: "Machine-Learning-Roadmap-Community.md",
      title: "Machine Learning Roadmap \u2014 Community Edition",
      date: "Jul 2023",
      year: "2023",
      category: "Career",
      read: "14 min",
    },
    {
      file: "Data-Lifecycle-in-Production.md",
      title: "Data Lifecycle in Production",
      date: "Jun 2023",
      year: "2023",
      category: "MLOps",
      read: "12 min",
    },
    {
      file: "Machine-Learning-Roadmap-—-Part-1.md",
      title: "Machine Learning Roadmap \u2014 Part 1",
      date: "Jun 2023",
      year: "2023",
      category: "Career",
      read: "15 min",
    },
    {
      file: "Generating-Adversaries-for-CNNs-My.md",
      title: "Generating Adversaries for CNNs",
      date: "Mar 2023",
      year: "2023",
      category: "Deep Learning",
      read: "9 min",
    },
    {
      file: "How-to-Maximize-ML-Project-Success.md",
      title: "How to Maximize ML Project Success",
      date: "Feb 2023",
      year: "2023",
      category: "AI/ML",
      read: "10 min",
    },
    {
      file: "Data-Processing-in-Production.md",
      title: "Data Processing in Production",
      date: "Feb 2023",
      year: "2023",
      category: "MLOps",
      read: "20 min",
    },
    {
      file: "Data-centric-approach-for-Machine.md",
      title: "Data-centric Approach for Machine Learning",
      date: "Jan 2023",
      year: "2023",
      category: "AI/ML",
      read: "11 min",
    },
    {
      file: "Error-Analysis-for-Machine-learning.md",
      title: "Error Analysis for Machine Learning",
      date: "Jan 2023",
      year: "2023",
      category: "AI/ML",
      read: "6 min",
    },
    {
      file: "An-Overview-of-Modeling-for-ML.md",
      title: "An Overview of Modeling for ML",
      date: "Jan 2023",
      year: "2023",
      category: "AI/ML",
      read: "12 min",
    },
    {
      file: "MLOps-Notes-2-Model-Deployment.md",
      title: "MLOps Notes 2: Model Deployment",
      date: "Jan 2023",
      year: "2023",
      category: "MLOps",
      read: "10 min",
    },
    {
      file: "Convolutional-NNs-17-The.md",
      title: "Convolutional Neural Networks: The Complete Guide",
      date: "Jan 2023",
      year: "2023",
      category: "Deep Learning",
      read: "7 min",
    },
    {
      file: "MLOps-Notes-1-The-Machine-Learning.md",
      title: "MLOps Notes 1: The Machine Learning Lifecycle",
      date: "Jan 2023",
      year: "2023",
      category: "MLOps",
      read: "10 min",
    },
    {
      file: "Investigating-the-Seattle-Airbnb.md",
      title: "Investigating the Seattle Airbnb Dataset",
      date: "Jul 2022",
      year: "2022",
      category: "Data Science",
      read: "9 min",
    },
    {
      file: "How-to-Start-Your-Data-Journey.md",
      title: "How to Start Your Data Journey",
      date: "2022",
      year: "2022",
      category: "Career",
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
