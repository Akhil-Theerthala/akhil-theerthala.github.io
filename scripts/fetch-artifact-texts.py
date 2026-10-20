# /// script
# requires-python = ">=3.11"
# dependencies = ["beautifulsoup4"]
# ///
"""Fetches the public text of each artifact into data/artifact-texts.json.

The map is built from the work itself: the main body of each paper's arXiv
HTML, the Hugging Face dataset and model cards, and the LocalXiv README.
scripts/map-corpus.mjs reads the saved file, so the map can be rebuilt
offline. Run this when a paper or card changes, then scripts/build-map.py:

    uv run scripts/fetch-artifact-texts.py
"""

import json
import re
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent

PAPERS = {
    "paper:synthesizing-behaviorally-grounded-reasoning-chains-a": "2509.14180",
    "paper:finforge-semi-synthetic-financial-benchmark-generation": "2601.06747",
    "paper:role-steering-of-language-models-for": "2608.00023",
}
# Main-body sections only: related work, appendices and statements are left out.
SKIP_SECTION = re.compile(
    r"related work|acknowledg|availability|reproducib|ethic|disclosure|references|appendix",
    re.IGNORECASE,
)

CARDS = {
    "project:kuvera": [
        "https://huggingface.co/datasets/Akhil-Theerthala/Kuvera-PersonalFinance-V2.1/raw/main/README.md",
        "https://huggingface.co/Akhil-Theerthala/Kuvera-8B-qwen3-v0.2.1/raw/main/README.md",
    ],
    "project:themis-scales-moral-dilemma": [
        "https://huggingface.co/datasets/Akhil-Theerthala/Themis_Scales/raw/main/README.md",
    ],
    "project:localxiv": [
        "https://raw.githubusercontent.com/Akhil-Theerthala/LocalXiv/main/README.md",
    ],
    "project:crowdfunding-social-signals": [
        "https://raw.githubusercontent.com/Akhil-Theerthala/Crowdfunding-Social-Media-Drivers/main/readme.md",
    ],
}
# Card sections that are boilerplate rather than a description of the work.
SKIP_CARD_SECTION = re.compile(
    r"citation|licen[cs]e|install|download|usage|how to use|contact|acknowledg|build from source|requirements"
    r"|start reading|read on kindle|your library|development",
    re.IGNORECASE,
)


def get(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "akhiltheerthala.com map builder"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8")


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


GREEK = {
    "alpha": "α", "beta": "β", "gamma": "γ", "delta": "δ", "epsilon": "ε", "theta": "θ",
    "lambda": "λ", "mu": "μ", "rho": "ρ", "sigma": "σ", "tau": "τ", "pm": "±", "times": "×",
    "approx": "≈", "leq": "≤", "geq": "≥", "sim": "~", "to": "→", "in": "∈", "cdot": "·",
    "leftarrow": "←", "gets": "←", "mapsto": "↦", "prime": "′", "%": "%",
}


def plain_math(latex: str) -> str:
    """Short LaTeX as readable text: \\alpha=4 becomes α=4."""
    text = re.sub(r"\\[,;:! ]", " ", latex)
    text = re.sub(r"\\(?:text|mathrm|mathbf|mathit|operatorname)\{([^}]*)\}", r"\1", text)
    text = re.sub(r"\\([a-zA-Z]+|%)", lambda m: GREEK.get(m.group(1), ""), text)
    text = re.sub(r"[{}$\\]", "", text).replace("^", "").replace("_", "")
    return f" {clean(text)} "


def paper_passages(arxiv_id: str) -> list[dict]:
    soup = BeautifulSoup(get(f"https://arxiv.org/html/{arxiv_id}"), "html.parser")
    passages = []
    for section in soup.select("section.ltx_section"):
        heading = section.find("h2")
        title = clean(heading.get_text(" ")) if heading else ""
        if SKIP_SECTION.search(title):
            continue
        title = re.sub(r"^\d+\s*", "", title)
        for paragraph in section.select("p.ltx_p"):
            for note in paragraph.select(".ltx_note"):
                note.decompose()
            for formula in paragraph.select("math"):
                formula.replace_with(plain_math(formula.get("alttext", "")))
            text = clean(paragraph.get_text(" "))
            text = re.sub(r"\s+([,.;:)%])", r"\1", text).replace("( ", "(")
            if len(text) >= 70:
                passages.append({"section": title, "text": text})
    return passages


def card_passages(markdown: str) -> list[dict]:
    markdown = re.sub(r"\A---\n.*?\n---\n", "", markdown, flags=re.DOTALL)
    markdown = re.sub(r"```.*?```", "", markdown, flags=re.DOTALL)
    markdown = re.sub(r"<[^>]+>", " ", markdown)
    passages, section, skipping = [], "", False
    for block in re.split(r"\n\s*\n", markdown):
        lines = [line for line in block.strip().splitlines() if not line.lstrip().startswith("|")]
        if not lines:
            continue
        if lines[0].startswith("#"):
            section = clean(lines[0].lstrip("#"))
            skipping = bool(SKIP_CARD_SECTION.search(section))
            lines = lines[1:]
        if skipping:
            continue
        for item in re.split(r"\n(?=\s*(?:[-*+]|\d+\.)\s)", "\n".join(lines)):
            text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", item)
            text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
            text = re.sub(r"^\s*(?:[-*+]|\d+\.)\s+", "", text)
            text = clean(re.sub(r"[*_`>#]+", "", text))
            if len(text) >= 70:
                passages.append({"section": section, "text": text})
    return passages


def main() -> None:
    texts = {}
    for source, arxiv_id in PAPERS.items():
        texts[source] = {"url": f"https://arxiv.org/html/{arxiv_id}", "passages": paper_passages(arxiv_id)}
    for source, urls in CARDS.items():
        texts[source] = {"url": urls[0], "passages": [p for url in urls for p in card_passages(get(url))]}
    for source, entry in texts.items():
        print(f"{source}: {len(entry['passages'])} passages")
    target = ROOT / "data" / "artifact-texts.json"
    target.write_text(json.dumps(texts, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
