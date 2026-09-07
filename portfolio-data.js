// Akhil Theerthala portfolio content
window.PORTFOLIO_DATA = {
  name: "Akhil Theerthala",
  role: "Applied Scientist",
  currentRole: "Senior Member Data Scientist, Perfios Software Solutions",
  location: "Bengaluru, India",
  email: "akhiltvsn@gmail.com",
  intro:
    "I build datasets and evaluations to understand where AI systems in finance work, and where they fail.",

  longIntro: [
    "At Perfios, I build and evaluate AI systems that read financial documents and work with financial language. I adapt vision-language models for dense documents, test their failure modes, and help bring them into production.",
    "My research asks how training data shapes model behavior, and whether our evaluations catch the errors that matter. I work on financial reasoning datasets, uncertainty in language models, and benchmarks for AI agents. I care about what these methods cost to run and whether we can understand their failures.",
  ],

  researchFocus: [
    {
      title: "Training data and model behavior",
      desc: "How dataset design affects model behavior, including synthetic data, question density versus image diversity, and training examples informed by behavioral research.",
    },
    {
      title: "Financial AI and agents",
      desc: "Testing financial agents on underwriting, personalized advice, and market intelligence.",
    },
    {
      title: "Reading financial documents",
      desc: "Adapting vision-language models to financial documents, recovering table structure, and detecting images that are too difficult to read.",
    },
    {
      title: "Evaluating and steering language models",
      desc: "Scoring outputs without reference answers, using panels of model judges, and testing how changes to internal activations affect behavior.",
    },
  ],

  stats: [],

  workExperience: [
    {
      date: "Apr 2025 - Present",
      title: "Senior Member Data Scientist",
      org: "Perfios Software Solutions",
      summary:
        "I lead research and evaluation for financial language models and document AI in production.",
      highlights: [
        "I lead research on uncertainty in financial language models. I am building a banking, financial services, and insurance benchmark to audit cultural and demographic bias and measure calibration as numerical precision changes. I also probe signals of miscalibration and test steering, context conditioning, and fine-tuning as possible remedies.",
        "I develop guardrails for banking applications that use language models and agents. This involves identifying vulnerabilities, designing adversarial tests, and testing output controls against RBI's FREE-AI recommendations.",
        "I built and now monitor a vision-transformer regression service that scores document image quality without a reference image. It identifies low-quality documents at 92% precision before they enter HDB's downstream applications.",
      ],
      emphasis: ["92% precision"],
      recognition:
        "Circle of Excellence award for research contributions to generative AI and financial document intelligence.",
      desc: [
        "I lead research on uncertainty in financial language models. I am building a banking, financial services, and insurance benchmark to audit cultural and demographic bias and measure calibration as numerical precision changes. I also probe signals of miscalibration and test steering, context conditioning, and fine-tuning as possible remedies.",
        "I develop guardrails for banking applications that use language models and agents. This involves identifying vulnerabilities, designing adversarial tests, and testing output controls against RBI's FREE-AI recommendations.",
        "I built and now monitor a vision-transformer regression service that scores document image quality without a reference image. It identifies low-quality documents at 92% precision before they enter HDB's downstream applications.",
      ],
    },
    {
      date: "Aug 2025 - Present",
      title: "Research Volunteer",
      org: "FSIL & HCAI Labs, Georgia Tech",
      summary:
        "I contribute to research on financial-agent evaluation and steering language-model behavior.",
      highlights: [
        "I co-authored FinForge, a pipeline for generating semi-synthetic financial benchmarks. The paper was accepted at the AAAI 2026 Agentic AI in Financial Services Workshop.",
        "I contributed to Role Steering of Language Models for Social Simulations, published in the Social Simulations Workshop at COLM 2026.",
      ],
      emphasis: [],
      desc: [
        "I co-authored FinForge, a pipeline for generating semi-synthetic financial benchmarks. The paper was accepted at the AAAI 2026 Agentic AI in Financial Services Workshop.",
        "I contributed to Role Steering of Language Models for Social Simulations, published in the Social Simulations Workshop at COLM 2026.",
      ],
    },
    {
      date: "Jun 2023 - Apr 2025",
      title: "Member Data Scientist",
      org: "Perfios Software Solutions",
      summary:
        "I built production systems to classify documents, detect tables, and recover their structure.",
      highlights: [
        "I distilled and quantized a multimodal document classifier into a smaller model. Latency fell from 8s to 200ms with F1 parity in production-scale evaluation.",
        "I improved generalized table detection accuracy by 27.6% through semi-synthetic data curation and evaluation of YOLOv8 variants. This also improved downstream table structure recognition.",
        "I added semantic row detection using fine-tuned text encoders to the production table structure recognition pipeline. It added under 40ms to processing time while preserving throughput.",
      ],
      emphasis: ["8s to 200ms", "27.6%", "under 40ms"],
      desc: [
        "I distilled and quantized a multimodal document classifier into a smaller model. Latency fell from 8s to 200ms with F1 parity in production-scale evaluation.",
        "I improved generalized table detection accuracy by 27.6% through semi-synthetic data curation and evaluation of YOLOv8 variants. This also improved downstream table structure recognition.",
        "I added semantic row detection using fine-tuned text encoders to the production table structure recognition pipeline. It added under 40ms to processing time while preserving throughput.",
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
    // {
    //   year: "2026",
    //   status: "Submitted",
    //   venue: "Mechanistic Interpretability Workshop, ICML 2026",
    //   title: "Stable Steering in Activation Space for Large Language Models",
    //   authors: [
    //     "Glenn Matlin",
    //     "Isaac Song",
    //     "Mohammed Rehan Parwani",
    //     "Akhil Theerthala",
    //     "Arjun Chatterjee",
    //     "Anthony Wen-Ming Zang",
    //     "Emile Timothy Anand",
    //     "Mark Riedl",
    //     "Sebastien Krier",
    //     "Yonadav G Shavit",
    //     "Maria Kostylew",
    //   ],
    //   abstract:
    //     "A large-scale study of activation steering across 275 occupational roles, 4 steering strengths, and 500K judged generations on Olmo-3-7B-Instruct. The work connects controllability to the geometry of role vectors, identifying mostly smooth, direction-specific steering, a 13% anti-controllable minority due to prior saturation, and a clear mismatch between representational and behavioral dimensionality.",
    //   tags: ["Activation Steering", "Interpretability", "LLMs"],
    // },
    {
      year: "2026",
      status: "Published workshop paper",
      venue: "Social Simulations Workshop, COLM 2026",
      title: "Role Steering of Language Models for Social Simulations",
      authors: [
        "Isaac Song",
        "Mohammed Rehan Parwani",
        "Glenn Matlin",
        "Emile Anand",
        "Akhil Theerthala",
        "Arjun Chatterjee",
        "Anthony Wen-Ming Zang",
        "Maria Kostylew",
        "Yonadav G. Shavit",
        "Sebastien Krier",
        "Mark Riedl",
      ],
      abstract:
        "We tested activation steering for language-model agents across 275 roles in social simulations. Role-specific directions improved judged role-profile alignment over an assistant-axis control while preserving lexical diversity. But 38 roles declined across every measured dimension, supporting per-role selection of steering strength.",
      tags: ["Activation Steering", "Social Simulation", "LLMs"],
      arxiv: "https://arxiv.org/abs/2608.00023",
      doi: "10.48550/arXiv.2608.00023",
      citation:
        "Song, I., Parwani, M. R., Matlin, G., Anand, E., Theerthala, A., Chatterjee, A., Zang, A. W.-M., Kostylew, M., Shavit, Y. G., Krier, S., & Riedl, M. (2026). Role Steering of Language Models for Social Simulations. arXiv:2608.00023. https://doi.org/10.48550/arXiv.2608.00023",
      bibtex: `@misc{song2026role,
  title={Role Steering of Language Models for Social Simulations},
  author={Isaac Song and Mohammed Rehan Parwani and Glenn Matlin and Emile Anand and Akhil Theerthala and Arjun Chatterjee and Anthony Wen-Ming Zang and Maria Kostylew and Yonadav G. Shavit and Sebastien Krier and Mark Riedl},
  year={2026},
  eprint={2608.00023},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  doi={10.48550/arXiv.2608.00023},
  url={https://arxiv.org/abs/2608.00023}
}`,
    },
    {
      year: "2026",
      status: "Accepted workshop paper",
      venue: "Agentic AI in Financial Services Workshop, AAAI 2026",
      title: "FinForge: Semi-Synthetic Financial Benchmark Generation",
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
        "FinForge combines expert curation of authoritative financial sources with controlled language-model generation to build benchmarks. FinForge-5k contains 5,000+ human-validated question-answer pairs across 11 finance subdomains. Leading models approach 80% accuracy, with substantial gaps in financial reasoning.",
      tags: ["Benchmarks", "Agentic AI", "Finance"],
      arxiv: "https://arxiv.org/abs/2601.06747",
      doi: "10.48550/arXiv.2601.06747",
      citation:
        "Matlin, G., Theerthala, A., Gupta, A., JM, A., Castilla, R., Ng, Y. M., & Chava, S. (2026). FinForge: Semi-Synthetic Financial Benchmark Generation. arXiv:2601.06747. https://doi.org/10.48550/arXiv.2601.06747",
      bibtex: `@misc{matlin2026finforge,
  title={FinForge: Semi-Synthetic Financial Benchmark Generation},
  author={Glenn Matlin and Akhil Theerthala and Anant Gupta and Anirudh JM and Rayan Castilla and Yi Mei Ng and Sudheer Chava},
  year={2026},
  eprint={2601.06747},
  archivePrefix={arXiv},
  primaryClass={cs.AI},
  doi={10.48550/arXiv.2601.06747},
  url={https://arxiv.org/abs/2601.06747}
}`,
    },
    {
      year: "2025",
      status: "Preprint",
      venue: "arXiv",
      title:
        "Synthesizing Behaviorally-Grounded Reasoning Chains: A Data-Generation Framework for Personal Finance LLMs",
      authors: ["Akhil Theerthala"],
      abstract:
        "I combined financial context with behavioral-finance studies to build a 19k-sample reasoning dataset for personal-finance models. In the reported evaluation, a fine-tuned Qwen-3-8B matched 14-32B baselines on factuality, fluency, and personalization at about 80% lower cost.",
      tags: ["Personal Finance", "Data-centric", "LLM Evaluation"],
      arxiv: "https://arxiv.org/abs/2509.14180",
      doi: "10.48550/arXiv.2509.14180",
      citation:
        "Theerthala, A. (2025). Synthesizing Behaviorally-Grounded Reasoning Chains: A Data-Generation Framework for Personal Finance LLMs. arXiv:2509.14180. https://doi.org/10.48550/arXiv.2509.14180",
      bibtex: `@misc{theerthala2025synthesizing,
  title={Synthesizing Behaviorally-Grounded Reasoning Chains: A Data-Generation Framework for Personal Finance LLMs},
  author={Akhil Theerthala},
  year={2025},
  eprint={2509.14180},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  doi={10.48550/arXiv.2509.14180},
  url={https://arxiv.org/abs/2509.14180}
}`,
    },
  ],

  projects: [
    {
      title: "Kuvera Personal Finance Datasets and LLMs",
      kicker: "Open source · Hugging Face",
      desc: "I built training data for Indian personal-finance reasoning using insights from behavioral finance. I fine-tuned 8B and 14B models and compared their personalization quality with larger baselines.",
      metric: "HuggingFace",
      stats: [
        { label: "Dataset rows", value: "18.8k" },
        { label: "Thematic categories", value: "8" },
        { label: "Fine-tuned model", value: "8B" },
        { label: "Lower operating cost", value: "80%" },
      ],
      year: "2025",
      href: "https://huggingface.co/datasets/Akhil-Theerthala/Kuvera-PersonalFinance-V2.1",
      links: [
        {
          label: "Dataset",
          href: "https://huggingface.co/datasets/Akhil-Theerthala/Kuvera-PersonalFinance-V2.1",
        },
        {
          label: "Paper",
          href: "https://arxiv.org/abs/2509.14180",
        },
        {
          label: "Model",
          href: "https://huggingface.co/Akhil-Theerthala/Kuvera-8B-qwen3-v0.2.1",
        },
      ],
      evidence: {
        kind: "dataset",
        label: "Dataset record",
        caption:
          "Kuvera PersonalFinance V2.1 includes a question, reasoning chain, and response for each record.",
        metrics: [
          { label: "Rows", value: "18.8k" },
          { label: "Categories", value: "8" },
          { label: "Model", value: "8B" },
          { label: "Lower cost", value: "80%" },
        ],
        schema: ["category", "query", "chain_of_thought", "response"],
      },
      tags: ["Dataset", "Fine-tuning", "Finance"],
    },
    {
      title: "Reasoning Dataset Challenge",
      kicker: "1st place, global competition",
      desc: "I built a synthetic reasoning dataset and trained a 7B model that outperformed larger baselines. The submission took first place among more than 150 teams.",
      metric: "1 / 150+ teams",
      year: "2025",
      href: "https://huggingface.co/Akhil-Theerthala",
      links: [
        {
          label: "Hugging Face",
          href: "https://huggingface.co/Akhil-Theerthala",
        },
      ],
      evidence: {
        kind: "result",
        label: "Competition result",
        caption:
          "First-place reasoning dataset submission in a field of more than 150 teams.",
        metrics: [
          { label: "Placement", value: "1st" },
          { label: "Teams", value: "150+" },
        ],
      },
      tags: ["Reasoning", "Synthetic data", "Evaluation"],
    },
    {
      title: "Themis Scales: Moral Dilemma Resolution",
      kicker: "Open source · AI ethics dataset",
      desc: "I created a seed dataset for analyzing moral dilemmas through Morality-as-Cooperation, deontological, and utilitarian perspectives. It is a starting point for further validation, with 567 examples.",
      metric: "567 dilemmas",
      year: "2025",
      href: "https://huggingface.co/datasets/Akhil-Theerthala/Themis_Scales",
      links: [
        {
          label: "Dataset",
          href: "https://huggingface.co/datasets/Akhil-Theerthala/Themis_Scales",
        },
        {
          label: "GitHub",
          href: "https://github.com/Akhil-Theerthala/moral-dilemma-reasoning",
        },
      ],
      evidence: {
        kind: "dataset",
        label: "Seed dataset record",
        caption:
          "Each dilemma includes a reasoning chain and response. The collection covers four categories and three ethical perspectives.",
        metrics: [
          { label: "Rows", value: "567" },
          { label: "Categories", value: "4" },
          { label: "Ethical lenses", value: "3" },
          { label: "DOI", value: "10.57967/hf/5177" },
        ],
        schema: ["category", "query", "chain_of_thought", "response"],
      },
      tags: ["AI ethics", "Moral reasoning", "Dataset curation"],
    },
  ],

  writings: [
    {
      file: "Density-Vs-Diversity.md",
      slug: "density-vs-diversity-in-data-selection",
      title: "Density vs. Diversity in Data Selection",
      date: "Jan 2026",
      year: "2026",
      category: "Research Notes",
      read: "12 min",
      featured: true,
      excerpt:
        "With limited domain data, should a vision-language model see more questions per image or a wider range of images? A controlled comparison of the two approaches.",
    },
    {
      file: "Creating-a-Reasoning-Dataset-with.md",
      slug: "creating-a-reasoning-dataset-with-no-budget",
      title: "Creating a Reasoning Dataset with No Budget",
      date: "Apr 2025",
      year: "2025",
      category: "Research Notes",
      read: "18 min",
      featured: true,
      excerpt:
        "How I built a personal-finance reasoning dataset with no budget and won a global reasoning-data challenge.",
    },
    {
      file: "LazyInfer-Design-Notes.md",
      slug: "lazyinfer-design-notes-for-reliable-llm-pipelines",
      title: "LazyInfer: Design Notes for Reliable LLM Pipelines",
      date: "Jan 2026",
      year: "2026",
      category: "Technical Essays",
      read: "7 min",
      excerpt:
        "How I designed an LLM inference pipeline with YAML configuration, retries, checkpoints, and schema validation.",
    },
    {
      file: "From-Training-Language-Models-to.md",
      slug: "from-training-language-models-to-deepseek-r1",
      title: "From Training Language Models to DeepSeek-R1",
      date: "Feb 2025",
      year: "2025",
      category: "Technical Essays",
      read: "14 min",
      excerpt:
        "How language-model training connects supervised learning with the methods behind reasoning models.",
    },
    {
      file: "7-Practical-PyTorch-Tips-for.md",
      slug: "7-practical-pytorch-tips",
      title: "7 Practical PyTorch Tips",
      date: "Feb 2025",
      year: "2025",
      category: "Technical Essays",
      read: "8 min",
      excerpt:
        "Notes on device placement, debugging, memory use, and iterating on PyTorch models.",
    },
    {
      file: "Building-Blocks-of-Transformers.md",
      slug: "building-blocks-of-transformers",
      title: "Building Blocks of Transformers",
      date: "Mar 2024",
      year: "2024",
      category: "Older Learning Notes",
      read: "11 min",
    },
    {
      file: "Making-Sense-of-PyTorch’s-to-and.md",
      slug: "making-sense-of-pytorch-to-and-device-management",
      title: "Making Sense of PyTorch's .to() and Device Management",
      date: "Aug 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "5 min",
    },
    {
      file: "De-mystifying-Regular-Expressions.md",
      slug: "de-mystifying-regular-expressions",
      title: "De-mystifying Regular Expressions",
      date: "Aug 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "15 min",
    },
    {
      file: "Data-Lifecycle-in-Production.md",
      slug: "data-lifecycle-in-production",
      title: "Data Lifecycle in Production",
      date: "Jun 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "12 min",
    },
    {
      file: "Data-Processing-in-Production.md",
      slug: "data-processing-in-production",
      title: "Data Processing in Production",
      date: "Feb 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "20 min",
    },
    {
      file: "Error-Analysis-for-Machine-learning.md",
      slug: "error-analysis-for-machine-learning",
      title: "Error Analysis for Machine Learning",
      date: "Jan 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "6 min",
    },
    {
      file: "An-Overview-of-Modeling-for-ML.md",
      slug: "an-overview-of-modeling-for-ml",
      title: "An Overview of Modeling for ML",
      date: "Jan 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "12 min",
    },
    {
      file: "MLOps-Notes-2-Model-Deployment.md",
      slug: "mlops-notes-2-model-deployment",
      title: "MLOps Notes 2: Model Deployment",
      date: "Jan 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "10 min",
    },
    {
      file: "MLOps-Notes-1-The-Machine-Learning.md",
      slug: "mlops-notes-1-the-machine-learning-lifecycle",
      title: "MLOps Notes 1: The Machine Learning Lifecycle",
      date: "Jan 2023",
      year: "2023",
      category: "Older Learning Notes",
      read: "10 min",
    },
  ],

  collaborationInterests: [
    "Training data and evaluation for financial AI",
    "Financial-agent benchmarks and tool use",
    "Document quality and vision-language models",
    "Behavioral finance in personal-finance models",
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
