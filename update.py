import os

with open('index.html', 'r') as f:
    text = f.read()

replaces = [
    (
        '<h1>Exploring the World of <span class="gradient-text">AI</span>, One Step at a Time</h1>\n                <p class="hero-subtitle">Applied Scientist with 2.5+ years specializing in NLP and Vision-Language\n                    Models for complex document intelligence and domain-specific reasoning.</p>',
        '<h1>Building with <span class="gradient-text">AI</span>, One Step at a Time</h1>\n                <p class="hero-subtitle">Data Scientist and MS student at IIIT Hyderabad, focusing on NLP and Vision-Language Models for document understanding and reasoning.</p>'
    ),
    (
        '<p>I am a <strong>Senior Member Data Scientist</strong> at Perfios Software Solutions with 2.5+\n                        years of hands-on experience in NLP and Vision-Language Models for document intelligence.</p>\n                    <p>I have proven technical ownership across the full ML lifecycle — translating cutting-edge\n                        research into scalable production systems. My open-source work on Kuvera personal finance LLMs\n                        has attracted <strong>35,000+ downloads</strong> on Hugging Face.</p>',
        '<p>I am a Data Scientist at Perfios Software Solutions and currently pursuing an MS in Data Science at IIIT Hyderabad. My work primarily involves using NLP and Vision-Language Models to help machines better understand documents.</p>\n                    <p>I enjoy working across the machine learning lifecycle, turning research ideas into practical applications. My open-source work on the Kuvera personal finance models has been downloaded over <strong>51,000 times</strong> on Hugging Face.</p>'
    ),
    (
        '<p class="timeline-desc">Pioneering VLMs (PaliGemma2) with LoRA for financial data; designing\n                            agentic reasoning workflows; developing reference-free document legibility algorithms.</p>',
        '<p class="timeline-desc">Experimenting with VLMs (like PaliGemma2) for financial data, building reasoning workflows, and developing algorithms for document readability.</p>'
    ),
    (
        '<p>Ranked 1st globally among 150+ teams (Bespoke Labs, HuggingFace, Together.ai). Demonstrated 7B\n                        model rivaling 14B–24B models.</p>',
        '<p>Ranked 1st globally among 150+ teams (Bespoke Labs, HuggingFace, Together.ai). Trained a 7B model that achieved strong reasoning capabilities.</p>'
    ),
    (
        '<p>Instruction-tuning dataset for Indian financial context. Fine-tuned 8B/14B models with 35,000+\n                        downloads.</p>',
        '<p>Instruction-tuning dataset for Indian financial context. Fine-tuned 8B/14B models with 51,000+ downloads.</p>'
    ),
    (
        '<p>Interactive research paper reading assistant with tiered inference (Fast Mode + Deep Analysis)\n                        for cost-performance optimization.</p>',
        '<p>An interactive tool for reading research papers, using a tiered approach to balance speed and depth when analyzing documents.</p>'
    ),
    (
        '<h3 class="card-title">Open Source Impact</h3>\n                    <p>Kuvera datasets and models with 35,000+ downloads. Active contributor to Hugging Science\n                        (AI-for-Food-Allergies).</p>',
        '<h3 class="card-title">Awards & Impact</h3>\n                    <p>Won the <strong>Circle of Excellence</strong> award at Perfios (2026). Creator of Kuvera datasets and models with 51,000+ downloads.</p>'
    )
]

for old, new in replaces:
    if old in text:
        text = text.replace(old, new)
    else:
        print(f"Warning: could not find {old[:30]}")

with open('index.html', 'w') as f:
    f.write(text)

with open('writings.html', 'r') as f:
    wtext = f.read()

old_w = '<p class="hero-subtitle">Exploring machine learning, reasoning systems, and applied AI research.</p>'
new_w = '<p class="hero-subtitle">Articles on machine learning, reasoning systems, and applied research.</p>'
wtext = wtext.replace(old_w, new_w)

with open('writings.html', 'w') as f:
    f.write(wtext)

