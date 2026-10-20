// Akhil Theerthala portfolio content
window.PORTFOLIO_DATA = {
  name: "Akhil Theerthala",
  role: "Applied Data Scientist",
  currentRole: "Senior Member Data Scientist, Perfios Software Solutions",
  location: "Bengaluru, India",
  email: "akhiltvsn@gmail.com",
  longIntro: [
    "I am a Senior Member Data Scientist at Perfios Software Solutions in Bengaluru. I also build document-AI systems for banks, lenders, and insurers, such as document classifiers, table detection, and VLMs adapted to dense financial documents.",
    "My research is on data curation and LLM evaluation. I build synthetic training data, such as personal-finance data grounded in behavioral finance. I also work on benchmarks for financial agents and on steering for language models. I look for methods that still work under real limits on latency, cost, and auditability.",
  ],

  researchFocus: [
    {
      title: "Data Curation for Reliable Models",
    },
    {
      title: "Financial AI and Agentic Systems",
    },
    {
      title: "Document AI and VLM Adaptation",
    },
    {
      title: "LLM Evaluation and Interpretability",
    },
  ],

  workExperience: [
    {
      date: "Apr 2025 - Present",
      title: "Senior Member Data Scientist",
      org: "Perfios Software Solutions",
      highlights: [
        "Leading uncertainty-quantification research for financial LLMs. I am building a BFSI-specific benchmark to audit cultural and demographic bias and to measure calibration under different levels of numerical precision. I also probe the cues behind miscalibration and test steering, context conditioning, and fine-tuning as mitigations.",
        "Developing guardrails for LLM and agent applications in banking. I map where these applications are vulnerable and build adversarial and failure-mode evaluations. I also test output controls against the Reserve Bank of India's FREE-AI recommendations for safe, fair, explainable, and robust AI.",
        "Built an agentic market-intelligence workflow for consumer banking products. It analyzes customer needs and competitive positioning to find gaps in the product line.",
        "Developed and now monitor a reference-free document image-quality service built on ViT regression. In production, it flags low-quality documents at 92% precision before they reach HDB's downstream applications.",
        "Adapted PaliGemma2 with LoRA for financial documents and reached a 0.85 TEDS score on internal benchmarks for structured document understanding.",
      ],
      emphasis: ["92% precision", "0.85 TEDS"],
      recognition:
        "Circle of Excellence award for research and contributions to generative AI and financial document intelligence.",
    },
    {
      date: "Aug 2025 - Present",
      title: "Research Volunteer",
      org: "FSIL & HCAI Labs, Georgia Tech",
      highlights: [
        "Co-authored FinForge, a pipeline that generates semi-synthetic benchmarks for financial tasks. The paper was accepted at the AAAI 2026 Workshop on Agentic AI in Financial Services.",
        "Contributed to the Role Steering of Language Models for Social Simulations paper at the COLM 2026 Social Simulations Workshop. I also contributed to the Data Attribution Should Guide Pretraining paper at the NeurIPS 2026 ATTRIB Workshop.",
        "Contributing to Capabilibarav2, an HCAI Lab project on training-data attribution that traces which source documents influence a language model's outputs.",
      ],
      emphasis: [],
    },
    {
      date: "Jun 2023 - Apr 2025",
      title: "Member Data Scientist",
      org: "Perfios Software Solutions",
      highlights: [
        "Distilled and quantized a multimodal document classifier into a small student model. Latency fell from 8s to 200ms with F1 unchanged in production-scale evaluation.",
        "Improved generalized table detection accuracy by 27.6% with semi-synthetic data curation and a systematic study of YOLOv8 variants. The gain carried through to the downstream table-structure recognition (TSR) module.",
        "Integrated a semantic row-detection module, built on fine-tuned text encoders, into the production TSR pipeline. It adds under 40ms of turnaround time and keeps throughput unchanged.",
      ],
      emphasis: ["8s to 200ms", "27.6%", "under 40ms"],
    },
  ],

  education: [
    {
      date: "Apr 2026 - Present",
      title: "MS, Data Science",
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
      venue: "ATTRIB Workshop, NeurIPS 2026",
      slug: "data-attribution-should-guide-pretraining",
      title: "Data Attribution Should Guide Pretraining",
      authors: [
        "Glenn Matlin",
        "Chandreyi Chakraborty",
        "Mohammed Rehan Parwani",
        "Saehee Eom",
        "Anthony Wen-Ming Zang",
        "Akhil Theerthala",
        "Arjun Chatterjee",
        "Tejas Khandwekar",
        "Brandon Michaels",
        "Alvin Deng",
        "Mark Riedl",
      ],
      abstract:
        "Pretraining data curation decides what a model learns from, yet the properties that make a document worth learning from depend on what the model already knows. We argue that training-data attribution should steer pretraining. Influence-driven selectors already act on attribution to improve a run; we argue that the field should ask more of that attribution. A ranking of documents serves the run it was computed for, whereas a data property that explains a gain can be tested on new data and, where it holds, written into a curation criterion, including where familiar quality signals are known to diverge from measured usefulness. We specify a feedback loop that interprets attributed sources, tests the data changes they suggest, and folds the outcomes back into the next run and its curation criteria, and we state what evidence each step requires and what none of them establishes. Historical contribution, an understandable explanation, and future data value are distinct claims that require distinct evidence. We set out a research agenda for establishing when attribution improves curation decisions over existing methods at matched cost.",
      tags: ["Training Data Attribution", "Data Curation", "Pretraining"],
    },
    {
      year: "2026",
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
        "An activation-steering screening workflow for role-conditioned language-model agents in social simulations. Across 275 roles, role-specific directions improve judged role-profile alignment over an assistant-axis control while preserving lexical diversity; 38 roles decline across every measured dimension, showing why steering strength should be selected per role rather than applied uniformly.",
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
        "A scalable semi-synthetic pipeline for building finance-specific LM benchmarks from authoritative sources using expert-guided curation and controlled LM synthesis. FinForge-5k contains 5,000+ human-validated question-answer pairs across 11 finance subdomains and reveals substantial gaps in financial reasoning, even as leading models approach 80% accuracy.",
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
      venue: "FinNLP Workshop, EMNLP 2025",
      title:
        "Synthesizing Behaviorally-Grounded Reasoning Chains: A Data-Generation Framework for Personal Finance LLMs",
      authors: ["Akhil Theerthala"],
      abstract:
        "A reproducible data-centric framework that combines financial context with behavioral-finance studies to create supervision for end-to-end personal-finance advisors. Using a 19k-sample reasoning dataset, a fine-tuned Qwen-3-8B matches much larger 14-32B baselines on factuality, fluency, and personalization while reducing cost by about 80%.",
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
      title: "LocalXiv",
      slug: "localxiv",
      status: "Active",
      summary:
        "A free, open-source Mac app for reading arXiv and alphaXiv papers, with a local library, adjustable layouts, optional AI explanations, and EPUB export for Kindle.",
      story: {
        what: [
          "LocalXiv is a Mac app for reading research papers. When you paste an arXiv or alphaXiv link, the app saves the paper to a library on your machine. The reader renders the equations and lets you set the font, text size, and margins. You can export a paper as an EPUB and send it to a Kindle.",
          "The AI features are optional. An Overview explains the paper's contribution visually, and a Blog gives a longer explanation that cites the source. You can also ask questions in a chat. These features use your own AI provider and API key. You can import, read, and export papers without an AI account.",
        ],
        why: [
          "An AI explanation of a paper is useful only if you can check it. LocalXiv keeps the original paper beside every explanation, so you can check each claim against the source.",
        ],
        built: [
          "The app has three parts: a Swift and AppKit launcher, a WebKit reader, and a local Python service. SQLite stores the library and the job records.",
          "Paper conversion and AI generation run as separate jobs, so a failed explanation does not affect a saved paper. If EPUB conversion fails, the app uses the saved original instead.",
          "The model does not draw the Overview figures. It writes a digest and a scene tree of cards, groups, steps, and bars. The app then places those parts and routes the arrows. If a figure still fails after a limited number of correction attempts, the app leaves it out.",
          "I developed LocalXiv mostly with GPT-6 Astra in Codex. Each user picks the model that runs inside the app.",
        ],
        achieved: [
          "I shipped twelve public preview releases, v0.0.1 to v0.0.14, between 6 and 18 September 2026.",
          "LocalXiv launched on Product Hunt as an entry in the GPT-6 Astra Challenge.",
          "The app ships its own conversion tools, so you can import and read papers without Homebrew or Python.",
        ],
        status: [
          "LocalXiv is in early preview and runs on Apple Silicon Macs with macOS 26 or newer. Releases are ad hoc signed, and Apple has not notarized them yet. Conversion can be imperfect for unusual equations, tables, and layouts. AI explanations can contain mistakes.",
        ],
      },
      related: [
        {
          label: "Verification notes: SVG figure reliability",
          href: "https://github.com/Akhil-Theerthala/LocalXiv/blob/main/docs/verification/2026-09-16-svg-reliability.md",
        },
        {
          label: "Xiv2Pub: arXiv papers to EPUB",
          href: "https://github.com/Akhil-Theerthala/Xiv2Pub",
        },
        {
          label: "VisLearn-Paper: a visual paper interpreter",
          href: "https://github.com/Akhil-Theerthala/VisLearn-Paper",
        },
      ],
      kicker: "Open source · Mac app",
      released: "2026-09",
      // Extra structured data for the artifact page, from evidence.caption.
      structuredData: {
        operatingSystem: "macOS 26 or newer",
        processorRequirements: "Apple Silicon",
        license: "https://www.gnu.org/licenses/agpl-3.0.html",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Akhil-Theerthala/LocalXiv",
        },
        {
          label: "Product Hunt",
          href: "https://www.producthunt.com/products/localxiv",
        },
        {
          label: "Download",
          href: "https://github.com/Akhil-Theerthala/LocalXiv/releases/latest",
        },
      ],
      evidence: {
        kind: "tool",
        caption:
          "LocalXiv is free under the AGPL-3.0 license and runs on Apple Silicon Macs with macOS 26 or newer. You can import, read, and export papers without an AI account.",
      },
    },
    {
      title: "Density vs. Diversity: VLM Curation Datasets",
      kicker: "Open source · Hugging Face",
      desc: "Two synthetic spatial-reasoning training sets built from GQA images. One set has ten questions per image, and the other has one. I used them to fine-tune six Qwen3-VL models for a controlled comparison.",
      released: "2026-01",
      links: [
        {
          label: "Dataset",
          href: "https://huggingface.co/datasets/Akhil-Theerthala/DesnityVsDiversity",
        },
        {
          label: "Blog",
          href: "https://huggingface.co/blog/Akhil-Theerthala/diversity-density-for-vision-language-models",
        },
      ],
      evidence: {
        kind: "dataset",
        caption:
          "Train and validation sets for the density-versus-diversity study. The two sets have the same question budget. The dense set spends it on 750 images, and the diverse set spends it on 7,500.",
        metrics: [
          { label: "Samples per set", value: "15k" },
          { label: "Dense images", value: "750" },
          { label: "Diverse images", value: "7.5k" },
          { label: "Fine-tuned VLMs", value: "6" },
        ],
      },
    },
    {
      title: "Kuvera Personal Finance Datasets and LLMs",
      slug: "kuvera",
      status: "Maintained",
      summary:
        "Open personal-finance reasoning datasets and the LLMs I fine-tuned on them. The models give advice that accounts for a person's financial situation and psychological state.",
      story: {
        what: [
          "Kuvera is my line of open datasets and models for personal-finance advice. The latest dataset, Kuvera PersonalFinance V2.1, has 18,846 records. Each record pairs a real personal-finance question with a reasoning chain and a response.",
          "I have fine-tuned five models on these datasets in two generations, from 4B to 14B parameters. I describe the method in my paper, Synthesizing Behaviorally-Grounded Reasoning Chains.",
        ],
        why: [
          "Most financial AI benchmarks cover corporate finance, trading, and general financial knowledge. Personal-finance planning gets little attention. So do behavioral biases such as loss aversion, overconfidence, and anchoring, which shape real decisions about money.",
          "Personal-finance questions also need reasoning, not retrieval. A useful answer weighs income, debt, risk tolerance, and time horizon against each other. It applies general principles to one person's situation instead of repeating generic advice.",
        ],
        built: [
          "I took real questions from r/personalfinance, using only posts made before Reddit changed its API and terms in mid-2023. An LLM jury of Gemini 2.0 Flash, Phi-4 14B, and Gemma-3-27B filtered the posts. The jury kept only the posts that pose a problem and need a reasoned answer.",
          "The multi-stage generation pipeline starts with query analysis and psychological-intent extraction, which run in parallel. The intent step identifies sentiment, emotions, communicative intent, and certainty. Next, the pipeline retrieves context from a curated finance knowledge base of about 800k tokens. Last, it generates a response and validates it.",
          "LLM juries check the critical steps: the relevance of the retrieved context and the completeness of the query analysis. For the final response, a jury of GPT-4o-mini, DeepSeek-V3, and Gemini 2.0 Flash makes a 5-shot comparative selection.",
          "For v0.1, in June 2025, I fine-tuned a 14B LoRA on DeepSeek-R1-Distill-Qwen-14B and an 8B model on PersonalFinance_v2. For v0.2, from July to August 2025, I fine-tuned Gemma 3 4B, Gemma 3 12B, and Qwen3-8B on the larger V2.1 dataset.",
        ],
        achieved: [
          "A fine-tuned Qwen3-8B matches 14B to 32B baselines on factuality, fluency, and personalization, at about 80% lower cost.",
          "The paper was published at the FinNLP Workshop, EMNLP 2025.",
          "I released Kuvera PersonalFinance V2.1 under Apache 2.0. It covers eight personal-finance domains, including debt, retirement, tax, and estate planning.",
        ],
        status: [
          "I update the datasets and models when the generation pipeline improves, not on a fixed schedule.",
        ],
      },
      related: [
        {
          label: "Kuvera PersonalFinance V3 collection: models and dataset",
          href: "https://huggingface.co/collections/Akhil-Theerthala/kuvera-personalfinance-v3-689bacddcb854cb523e3a450",
        },
        {
          label: "PersonalFinance_v2: the earlier dataset",
          href: "https://huggingface.co/datasets/Akhil-Theerthala/PersonalFinance_v2",
        },
        {
          label: "Kuvera 14B v0.1.0",
          href: "https://huggingface.co/Akhil-Theerthala/Kuvera-14B-v0.1.0",
        },
        {
          label: "Essay: Creating a Reasoning Dataset with No Budget",
          href: "writing/creating-a-reasoning-dataset-with-no-budget/",
        },
      ],
      kicker: "Open source · Hugging Face",
      released: "2025-09",
      // Extra structured data for the artifact page, from story.achieved.
      structuredData: {
        license: "https://www.apache.org/licenses/LICENSE-2.0",
        isAccessibleForFree: true,
      },
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
        caption:
          "Kuvera PersonalFinance V2.1 contains 18.8k reasoning records across eight thematic categories.",
        metrics: [
          { label: "Rows", value: "18.8k" },
          { label: "Categories", value: "8" },
          { label: "Fine-tuned model", value: "8B" },
          { label: "Lower cost than 14B to 32B models", value: "80%" },
        ],
        schema: ["category", "query", "chain_of_thought", "response"],
      },
    },
    {
      title: "Themis Scales: Moral Dilemma Resolution",
      kicker: "Open source · AI ethics dataset",
      desc: "A seed dataset of 567 moral dilemmas, analyzed from Morality-as-Cooperation, deontological, and utilitarian perspectives. It is a proof of concept that lists its limitations and needs further validation.",
      released: "2025-04",
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
        caption:
          "A proof-of-concept collection of 567 dilemmas in four categories, analyzed from three ethical perspectives.",
        metrics: [
          { label: "Rows", value: "567" },
          { label: "Categories", value: "4" },
          { label: "Ethical lenses", value: "3" },
          { label: "DOI", value: "10.57967/hf/5177" },
        ],
        schema: ["category", "query", "chain_of_thought", "response"],
      },
    },
    {
      title: "Social Media Signals and Crowdfunding Success",
      slug: "crowdfunding-social-signals",
      kicker: "Research · B.Tech project",
      desc: "My B.Tech research, which I extended after graduating, asked what drives engagement with crowdfunding posts on Facebook, and whether that engagement predicts a campaign's success. In the two models shown, the top feature can leak the outcome, and the text features were built with defects, so their low scores say little about text. A 2026 re-audit retired those methods, and I am rebuilding the study on archived Kickstarter pages.",
      released: "2024-03",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Akhil-Theerthala/Crowdfunding-Social-Media-Drivers",
        },
      ],
      // Permutation importances and partial-dependence directions from the
      // repository's Results folder, with the defects the 2026 audit found.
      evidence: {
        kind: "drivers",
        label: "What the original models ranked",
        caption:
          "Permutation importance, scaled so the top feature in each panel is 1. Effects come from the partial-dependence plots.",
        panels: [
          {
            title: "Engagement on a Facebook post",
            meta: "8,786 posts from the GoFundMe, Indiegogo and Kickstarter pages",
            rows: [
              { label: "Post views", value: 1, effect: "Strong rise", flag: "1" },
              { label: "Page that posted it", value: 0.51, effect: "GoFundMe highest" },
              { label: "Page likes at posting", value: 0.08, effect: "Small rise" },
              { label: "Post age", value: 0.08, effect: "More likes, fewer comments" },
              { label: "Video post", value: 0.06, effect: "Lower than links" },
              { label: "Names a person", value: 0.02, effect: "Flat", flag: "3" },
            ],
            foot: "No text feature stands out: all 38, from topics and emotions to readability, score 0.02 or less.",
          },
          {
            title: "Kickstarter campaign success",
            meta: "549 of the 1,023 campaigns Kickstarter promoted, 54 of which failed",
            noise: 0.29,
            rows: [
              { label: "Projects the creator backed", value: 1, effect: "Rises, then levels", flag: "2" },
              { label: "Shares of the post", value: 0.52, effect: "Peaks near 15" },
              { label: "Launch month", value: 0.47, effect: "October to December lower" },
              { label: "Runs 2 weeks to 1 month", value: 0.43 },
              { label: "Individual creator, not a team", value: 0.38 },
              { label: "Comments on the post", value: 0.34, effect: "Mixed" },
              { label: "Likes on the post", value: 0.32, effect: "Peaks near 50" },
            ],
            foot: "The notebook kept only campaigns its region map called North American, which left out Canada and nine US states. It then dropped the 80 campaigns that raised 10 times their goal or more, all of which had succeeded.",
          },
        ],
        notes: [
          { mark: "1", text: "Leak: post views is the largest of the post's view, reaction, comment and share counts, so it contains what the model predicts." },
          { mark: "2", text: "Timing: backing counts were read from creator profiles after the campaigns ended, so they can include later backing." },
          { mark: "3", text: "Text: zeros in the topic and emotion scores were replaced with small random values, entities were found in lowercased text, and the topic vocabulary was fitted on all posts before the split. With post views in the model, low text scores do not show that text is uninformative." },
          { mark: "noise", text: "Noise: shuffling one feature raised accuracy by 0.29 on this scale, so the faded start of each success bar is within noise. The success scores come from 110 campaigns: 11 failed, and 27 were also in the training data." },
          { mark: "", text: "The engagement scores compare log-scale predictions with raw counts, so the few posts with the largest counts drive them. Neither the bar sizes nor their order is exact." },
        ],
      },
    },
  ],

  achievements: [
    {
      title: "1st place, Reasoning Dataset Creation Challenge",
      date: "May 2025",
      org: "Bespoke Labs, Hugging Face and Together.ai",
      // The map lists the challenge entry as a work; this id ties the two.
      id: "reasoning-dataset-challenge",
      mark: ["1st", "of 150+ teams"],
      // All-time Hugging Face downloads of the Kuvera releases (scripts/hf-count.py).
      downloads: "56k+",
      detail:
        "I built synthetic data pipelines from real personal-finance questions and fine-tuned 8B and 14B models. I released the datasets, LoRA adapters, and quantized weights on Hugging Face. These releases have more than 56k downloads, counting community GGUF versions.",
      links: [
        {
          label: "Competition",
          href: "https://huggingface.co/spaces/relbert/reasoning-dataset-competition",
        },
        {
          label: "Write-up",
          href: "writing/creating-a-reasoning-dataset-with-no-budget/",
        },
      ],
    },
    {
      title: "Circle of Excellence award",
      org: "Perfios Software Solutions",
      detail: "For research and contributions to generative AI and financial document intelligence.",
    },
  ],

  writings: [
    {
      file: "Density-Vs-Diversity.md",
      slug: "density-vs-diversity-in-data-selection",
      // Writes up a project or experiment, so it is on the map.
      onMap: true,
      title: "Density vs. Diversity in Data Selection",
      date: "Jan 2026",
      category: "Research Notes",
      read: "12 min",
      excerpt:
        "A controlled study of data curation for fine-tuning vision-language models when domain images are scarce. It compares ten questions on each of 750 images with one question on each of 7,500.",
    },
    {
      file: "Creating-a-Reasoning-Dataset-with.md",
      slug: "creating-a-reasoning-dataset-with-no-budget",
      // Writes up a project or experiment, so it is on the map.
      onMap: true,
      title: "Creating a Reasoning Dataset with No Budget",
      date: "Apr 2025",
      category: "Research Notes",
      read: "18 min",
      excerpt:
        "How I chose a problem and built a personal-finance reasoning dataset. This work led to my first-place entry, out of more than 150 teams, in the Reasoning Dataset Creation Challenge.",
    },
    {
      file: "LazyInfer-Design-Notes.md",
      slug: "lazyinfer-design-notes-for-reliable-llm-pipelines",
      // Writes up a project or experiment, so it is on the map.
      onMap: true,
      title: "LazyInfer: Design Notes for Reliable LLM Pipelines",
      date: "Jan 2026",
      category: "Technical Essays",
      read: "7 min",
      excerpt:
        "How LazyInfer runs repeatable multi-stage LLM inference over JSONL records, with YAML configuration, retries, checkpoints, and schema validation.",
    },
    {
      file: "From-Training-Language-Models-to.md",
      slug: "from-training-language-models-to-deepseek-r1",
      title: "From Training Language Models to DeepSeek-R1",
      date: "Feb 2025",
      category: "Technical Essays",
      read: "14 min",
      excerpt:
        "An overview of how reasoning models are trained. It covers chain-of-thought prompting, supervised and transfer learning, RLHF, and the training steps for DeepSeek-R1-Zero and DeepSeek-R1.",
    },
    {
      file: "7-Practical-PyTorch-Tips-for.md",
      slug: "7-practical-pytorch-tips",
      title: "7 Practical PyTorch Tips",
      date: "Feb 2025",
      category: "Technical Essays",
      read: "8 min",
      excerpt:
        "Seven PyTorch lessons from two years of production work: module structure, experiment tracking, tensor shapes, .detach(), inference_mode(), device placement, and CPU-GPU syncs.",
    },
    {
      file: "Building-Blocks-of-Transformers.md",
      slug: "building-blocks-of-transformers",
      description:
        "How attention in a transformer works, explained with a story about a borrower and a lender, and where the query, key and value matrices come from.",
      title: "Building Blocks of Transformers",
      date: "Mar 2024",
      category: "Older Learning Notes",
      read: "11 min",
    },
    {
      file: "Making-Sense-of-PyTorch’s-to-and.md",
      slug: "making-sense-of-pytorch-to-and-device-management",
      description:
        "The difference between torch.load with map_location and .to(device) in PyTorch, why the difference matters, and when to use each one.",
      title: "Making Sense of PyTorch's .to() and Device Management",
      date: "Aug 2023",
      category: "Older Learning Notes",
      read: "5 min",
    },
    {
      file: "De-mystifying-Regular-Expressions.md",
      slug: "de-mystifying-regular-expressions",
      description:
        "Regular expressions taught through one date-matching example: direct search, disjunction, character sets, optional characters and position anchors.",
      title: "De-mystifying Regular Expressions",
      date: "Aug 2023",
      category: "Older Learning Notes",
      read: "15 min",
    },
    {
      file: "Data-Lifecycle-in-Production.md",
      slug: "data-lifecycle-in-production",
      description:
        "What makes data good and useful for a production ML project, where to get it, how much to collect, and how to avoid bias and privacy problems.",
      title: "Data Lifecycle in Production",
      date: "Jun 2023",
      category: "Older Learning Notes",
      read: "12 min",
    },
    {
      file: "Data-Processing-in-Production.md",
      slug: "data-processing-in-production",
      description:
        "Why data is hard to define and label, how to make labels consistent, how human-level performance sets a target, and how to track data pipelines and lineage.",
      title: "Data Processing in Production",
      date: "Feb 2023",
      category: "Older Learning Notes",
      read: "20 min",
    },
    {
      file: "Error-Analysis-for-Machine-learning.md",
      slug: "error-analysis-for-machine-learning",
      description:
        "How to work with skewed datasets, such as a factory where 0.3% of goods have defects, and how to audit a model before production.",
      title: "Error Analysis for Machine Learning",
      date: "Jan 2023",
      category: "Older Learning Notes",
      read: "6 min",
    },
    {
      file: "An-Overview-of-Modeling-for-ML.md",
      slug: "an-overview-of-modeling-for-ml",
      description:
        "Model-centric and data-centric AI development, why a low average test error is not enough, and how to set a baseline before you train a model.",
      title: "An Overview of Modeling for ML",
      date: "Jan 2023",
      category: "Older Learning Notes",
      read: "12 min",
    },
    {
      file: "MLOps-Notes-2-Model-Deployment.md",
      slug: "mlops-notes-2-model-deployment",
      description:
        "Deployment patterns for ML systems, such as shadow mode, canary and blue-green, and how to monitor a model and a production pipeline.",
      title: "MLOps Notes 2: Model Deployment",
      date: "Jan 2023",
      category: "Older Learning Notes",
      read: "10 min",
    },
    {
      file: "MLOps-Notes-1-The-Machine-Learning.md",
      slug: "mlops-notes-1-the-machine-learning-lifecycle",
      description:
        "Notes from the DeepLearning.AI MLOps course on the four phases of a production ML project: scoping, data, modelling and deployment.",
      title: "MLOps Notes 1: The Machine Learning Lifecycle",
      date: "Jan 2023",
      category: "Older Learning Notes",
      read: "10 min",
    },
  ],

  collaborationInterests: [
    "Data curation and LLM evaluation for finance",
    "Benchmarks and tool-use evaluation for financial agents",
    "Legibility checks and VLM adaptation for document AI",
    "Personal-finance LLMs that account for behavioral biases",
  ],

  now: [
    {
      label: "Now",
      text: "Calibrated LLM safeguards and agentic workflows for consumer-finance market intelligence at Perfios.",
    },
    {
      label: "Reading",
      text: "Interpretability and evaluation of LLMs and agentic systems.",
    },
    {
      label: "Research",
      text: "Training-data attribution, with Georgia Tech's HCAI Lab.",
    },
    {
      label: "Studying",
      text: "MS in Data Science, IIIT Hyderabad.",
    },
  ],

  researchProfiles: [
    {
      label: "GitHub",
      href: "https://github.com/Akhil-Theerthala",
    },
    {
      label: "Hugging Face",
      href: "https://huggingface.co/Akhil-Theerthala",
    },
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=_H1O3ScAAAAJ&hl=en",
    },
  ],

  contactLinks: [
    {
      label: "Email",
      href: "mailto:akhiltvsn@gmail.com",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/akhil-theerthala/",
    },
    {
      label: "X",
      href: "https://x.com/thesilvervein",
    },
  ],
};
