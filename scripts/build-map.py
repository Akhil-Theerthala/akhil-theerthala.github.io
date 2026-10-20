# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "numpy",
#   "sentence-transformers",
#   "umap-learn",
# ]
# ///
"""Builds assets/data/map.json, the map of work on the homepage.

The map is a graph. Areas are fields of AI work, named in data/map-areas.json
and drawn as hubs. Works are the papers, projects and production systems, each
joined to every area it belongs to (its homes: the weights of HOME_MIN or more
in the spec file) and to the works it is curated-linked to. Hubs are placed
from the text: every passage printed by scripts/map-corpus.mjs is embedded and
projected to 2D with UMAP, an area starts at the weighted mean of its works'
passages, and the areas are then spread apart, drawn together by the works
they share and the relations in the spec file. Once published, hubs stay put
between builds unless the set of areas changes. The works are placed around
the hubs at run time (src/graph-layout.js).

Points are kept for search and the small decorative fields:
[x, y, source index, area index, passage text, anchor, work index], with -1
for passages that belong to no work (a role's summary line).

Run it after changing portfolio-data.js, an essay that is on the map,
data/map-areas.json or data/artifact-texts.json:

    uv run scripts/build-map.py
"""

import json
import subprocess
from itertools import combinations
from pathlib import Path

import numpy as np
import umap
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parent.parent
MODEL = "sentence-transformers/all-MiniLM-L6-v2"
# A membership this heavy makes the area one of the work's homes.
HOME_MIN = 0.2
# The hero plot is about this much wider than tall; spacing is measured on it.
ASPECT = 1.1
# The gap two hubs keep, in plot heights: a base, more for every work the two
# share, and a little for every work of each.
GAP_BASE = 0.28
GAP_SHARED = 0.015
GAP_SIZE = 0.006
# How hard related hubs pull together on a fresh placement, per iteration and
# per unit of strength (shared weight plus relation, up to 4).
PULL = 0.02
RELATION_PULL = {"strong": 1.0, "medium": 0.5}


def align_to_published(coords: np.ndarray, texts: list[str]) -> np.ndarray:
    """Rotates or mirrors the new layout onto the published map.

    UMAP can flip or turn the whole layout after a small change to the text.
    Passages that are in both maps fix the orientation, so a rebuild keeps the
    map the reader already knows.
    """
    published = ROOT / "assets" / "data" / "map.json"
    if not published.exists():
        return coords
    old = {point[4]: point[:2] for point in json.loads(published.read_text(encoding="utf-8"))["points"]}
    shared = [i for i, text in enumerate(texts) if text in old]
    if len(shared) < 3:
        return coords
    new = coords[shared] - coords[shared].mean(axis=0)
    target = np.array([old[texts[i]] for i in shared])
    u, _, vt = np.linalg.svd(new.T @ (target - target.mean(axis=0)))
    aligned = coords @ (u @ vt)
    low, high = aligned.min(axis=0), aligned.max(axis=0)
    return (aligned - low) / (high - low)


def published_hubs(areas: list[str]) -> np.ndarray | None:
    """The hub positions of the published map, when it has the same areas."""
    published = ROOT / "assets" / "data" / "map.json"
    if not published.exists():
        return None
    old = json.loads(published.read_text(encoding="utf-8"))["areas"]
    if [area["name"] for area in old] != areas:
        return None
    return np.array([[area["x"], area["y"]] for area in old], dtype=float)


def hub_gaps(shared_count: np.ndarray, sizes: list[int]) -> np.ndarray:
    return GAP_BASE + GAP_SHARED * shared_count + GAP_SIZE * np.add.outer(sizes, sizes)


def spread_hubs(
    start: np.ndarray, strength: np.ndarray, gap: np.ndarray, sizes: list[int], pull: bool
) -> np.ndarray:
    """Pushes all hubs apart until every pair keeps its gap and, on a fresh
    placement, draws related hubs together first so they end up side by side.

    strength[a, b] is how hard a and b pull on each other. A hub with more
    works keeps further from the plot's edge, so its works have room for
    their names. With pull off, the hubs only move where a gap is violated,
    which is what keeps the published map stable.
    """
    margin = np.array([0.1 + 0.015 * (size - 1) for size in sizes])[:, None]
    low, high = margin * [ASPECT, 1.0], (1 - margin) * [ASPECT, 1.0]
    # Names cannot run left into the hero text, so the left edge keeps more room.
    low[:, 0] += 0.05 * ASPECT

    def separate(points: np.ndarray) -> bool:
        moved = False
        for i in range(len(points)):
            for j in range(i + 1, len(points)):
                delta = points[i] - points[j]
                distance = float(np.hypot(*delta)) or 1e-6
                if distance < gap[i, j]:
                    push = (gap[i, j] - distance) / 2 * delta / distance
                    points[i] += push
                    points[j] -= push
                    moved = True
        np.clip(points, low, high, out=points)
        return moved

    points = start * [ASPECT, 1.0]
    if pull:
        for _ in range(400):
            for i, j in zip(*np.nonzero(np.triu(strength))):
                delta = points[j] - points[i]
                distance = float(np.hypot(*delta)) or 1e-6
                if distance > gap[i, j]:
                    step = PULL * min(strength[i, j], 4) * (distance - gap[i, j]) / 2 * delta / distance
                    points[i] += step
                    points[j] -= step
            separate(points)
    for _ in range(400):
        if not separate(points):
            break
    return points / [ASPECT, 1.0]


def main() -> None:
    corpus = json.loads(
        subprocess.run(
            ["node", "scripts/map-corpus.mjs"],
            cwd=ROOT, check=True, capture_output=True, text=True,
        ).stdout
    )
    spec = json.loads((ROOT / "data" / "map-areas.json").read_text(encoding="utf-8"))
    sources = corpus["sources"]
    by_id = {source["id"]: index for index, source in enumerate(sources)}
    rows = [(index, chunk) for index, source in enumerate(sources) for chunk in source["chunks"]]
    texts = [chunk["text"] for _, chunk in rows]

    model = SentenceTransformer(MODEL)
    embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
    coords = umap.UMAP(
        n_neighbors=12, min_dist=0.18, metric="cosine", random_state=42
    ).fit_transform(embeddings)
    low, high = coords.min(axis=0), coords.max(axis=0)
    coords = (coords - low) / (high - low)
    coords = align_to_published(coords, texts)

    def highlight_rows(role: int, start: str) -> list[int]:
        found = [r for r, (index, chunk) in enumerate(rows)
                 if sources[index]["id"] == f"role:{role}" and chunk["text"].startswith(start)]
        if not found:
            raise SystemExit(f"No highlight of role {role} starts with {start!r}")
        return found

    areas = spec["areas"]
    descriptions = spec.get("descriptions", {})
    work_of = np.full(len(rows), -1)
    works = []
    for w, entry in enumerate(spec["works"]):
        if "role" in entry:
            role, start = entry["role"]
            members = highlight_rows(role, start)
            source = sources[by_id[f"role:{role}"]]
            info = {"kind": "role", "title": entry["title"], "meta": source["title"],
                    "summary": rows[members[0]][1]["text"], "href": source["href"], "sources": [source["id"]]}
        else:
            ids = [entry["id"], *entry.get("writeups", [])]
            missing = [i for i in ids if i not in by_id]
            if missing:
                raise SystemExit(f"map-areas.json names sources the corpus lacks: {missing}")
            members = [r for r, (index, _) in enumerate(rows) if sources[index]["id"] in ids]
            source = sources[by_id[entry["id"]]]
            info = {"kind": entry.get("kind", source["kind"]), "title": source["title"],
                    "meta": source["meta"], "summary": source["summary"], "href": source["href"], "sources": ids}
        if info["kind"] not in ("paper", "project", "role"):
            raise SystemExit(f"{entry['id']}: kind {info['kind']!r} has no legend chip; "
                             'give it "kind": "project" in data/map-areas.json')
        for role, start in entry.get("roleHighlights", []):
            members += highlight_rows(role, start)

        weights = entry["weights"]
        unknown = [name for name in weights if name not in areas]
        if unknown or entry["area"] not in areas:
            raise SystemExit(f"{entry['id']}: unknown area {unknown or [entry['area']]}")
        if abs(sum(weights.values()) - 1) > 1e-6:
            raise SystemExit(f"{entry['id']}: weights sum to {sum(weights.values())}, not 1")
        if weights.get(entry["area"], 0) < max(weights.values()):
            raise SystemExit(f"{entry['id']}: area {entry['area']!r} is not a heaviest weight")
        area = areas.index(entry["area"])
        homes = [(areas.index(name), weight) for name, weight in weights.items() if weight >= HOME_MIN]
        if not homes:
            raise SystemExit(f"{entry['id']}: no membership reaches {HOME_MIN}")
        homes.sort(key=lambda home: (home[0] != area, -home[1]))

        work_of[members] = w
        works.append({
            "id": entry["id"], "short": entry["short"], **info,
            "area": area, "homes": homes, "size": len(members),
            "position": coords[members].mean(axis=0),
        })
    unassigned = [texts[r][:60] for r in np.flatnonzero(work_of < 0)]
    print(f"{len(works)} works over {len(areas)} areas; {len(unassigned)} passages belong to no work")

    index = {work["id"]: w for w, work in enumerate(works)}
    links = []
    for link in spec.get("links", []):
        missing = [i for i in link["works"] if i not in index]
        if missing:
            raise SystemExit(f"map-areas.json links name works it lacks: {missing}")
        a, b = (index[i] for i in link["works"])
        links.append([a, b, link["why"]])
    work_links: list[list[int]] = [[] for _ in works]
    for a, b, _ in links:
        work_links[a].append(b)
        work_links[b].append(a)

    sizes = [sum(any(h == a for h, _ in work["homes"]) for work in works) for a in range(len(areas))]
    shared = np.zeros((len(areas), len(areas)))
    shared_count = np.zeros((len(areas), len(areas)))
    for work in works:
        for (a, wa), (b, wb) in combinations(work["homes"], 2):
            shared[a, b] = shared[b, a] = shared[a, b] + min(wa, wb)
            shared_count[a, b] = shared_count[b, a] = shared_count[a, b] + 1
    relations = np.zeros((len(areas), len(areas)))
    for relation in spec.get("relations", []):
        a, b = (areas.index(name) for name in relation["areas"])
        relations[a, b] = relations[b, a] = RELATION_PULL.get(relation["strength"], 0)

    # An area starts at the weighted mean of its works' passages.
    raw = np.full((len(areas), 2), 0.5)
    for a in range(len(areas)):
        pairs = [(work["position"], weight) for work in works for home, weight in work["homes"] if home == a]
        if pairs:
            raw[a] = sum(position * weight for position, weight in pairs) / sum(weight for _, weight in pairs)
    gap = hub_gaps(shared_count, sizes)
    start = published_hubs(areas)
    centres = spread_hubs(raw if start is None else start, shared + relations, gap, sizes, pull=start is None)
    print("hubs kept from the published map" if start is not None else "hubs placed afresh")
    tightest = min(
        (round(float(np.hypot(*((centres[i] - centres[j]) * [ASPECT, 1.0]))) / gap[i, j], 2), areas[i], areas[j])
        for i in range(len(areas)) for j in range(i + 1, len(areas))
    )
    print("tightest pair:", tightest)
    for a, name in enumerate(areas):
        print(f"{name}: {', '.join(w['short'] for w in works if any(h == a for h, _ in w['homes']))}")

    out_works = [
        {key: work[key] for key in ("id", "kind", "title", "short", "meta", "summary", "href", "sources", "area", "homes", "size")}
        | {"links": work_links[w]}
        for w, work in enumerate(works)
    ]
    out_areas = [{"name": name, "x": round(float(x), 4), "y": round(float(y), 4),
                  "description": descriptions.get(name, ""), "size": size}
                 for name, (x, y), size in zip(areas, centres, sizes)]
    out_sources = [{key: source[key] for key in ("id", "kind", "title", "meta", "href")} for source in sources]

    points = []
    for r, ((index_, chunk), (x, y)) in enumerate(zip(rows, coords)):
        work = int(work_of[r])
        anchor = chunk["href"][len(sources[index_]["href"]):]
        area = works[work]["area"] if work >= 0 else -1
        points.append([round(float(x), 4), round(float(y), 4), index_, area, chunk["text"], anchor, work])

    target = ROOT / "assets" / "data" / "map.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        json.dumps({"model": MODEL, "areas": out_areas, "works": out_works, "links": links,
                    "sources": out_sources, "points": points},
                   ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"wrote {target.relative_to(ROOT)}: {len(points)} passages, {len(out_works)} works, {len(links)} links")


if __name__ == "__main__":
    main()
