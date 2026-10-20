# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "numpy",
#   "sentence-transformers",
#   "umap-learn",
# ]
# ///
"""Builds assets/data/map.json, the map of work on the homepage.

The map has two levels. Areas are fields of AI work, named in
data/map-areas.json. Works are the papers, projects and production systems
in each area, drawn around the area's name. Both are placed from the text:
every passage printed by scripts/map-corpus.mjs is embedded and projected to
2D with UMAP, and a work sits where its passages sit. Each work links to the
works in other areas whose passages read most alike. An area starts where its
works sit and is then drawn toward the areas its works link to, because UMAP
keeps neighbourhoods but not the distances between them.

Points are kept for search and the small decorative fields:
[x, y, source index, area index, passage text, anchor, work index], with -1
for passages that belong to no work (a role's summary line).

Run it after changing portfolio-data.js, an essay that is on the map,
data/map-areas.json or data/artifact-texts.json:

    uv run scripts/build-map.py
"""

import json
import math
import subprocess
from pathlib import Path

import numpy as np
import umap
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parent.parent
MODEL = "sentence-transformers/all-MiniLM-L6-v2"
NEAR = 2
# Centred cosine similarity a link needs; weaker pairs are left unlinked.
LINK_MIN = 0.15
# The hero plot is about this much wider than tall; spacing is measured on it.
ASPECT = 1.1
# Minimum distance between area centres, in plot heights.
AREA_GAP = 0.37
# How hard linked areas pull together, per iteration and per link (up to 4).
PULL = 0.1


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


def spread_areas(centres: np.ndarray, links: np.ndarray, sizes: list[int]) -> np.ndarray:
    """Draws linked areas together and pushes all areas apart, so linked
    areas end up side by side and no two are closer than AREA_GAP.

    links[a, b] counts the links between the works of areas a and b. An area
    with more works keeps further from the plot's edge, so the works on its
    outer side still have room for their names.
    """
    margin = np.array([0.1 + 0.025 * (size - 1) for size in sizes])[:, None]
    low, high = margin * [ASPECT, 1.0], (1 - margin) * [ASPECT, 1.0]

    def separate(points: np.ndarray) -> bool:
        moved = False
        for i in range(len(points)):
            for j in range(i + 1, len(points)):
                delta = points[i] - points[j]
                distance = float(np.hypot(*delta)) or 1e-6
                if distance < AREA_GAP:
                    push = (AREA_GAP - distance) / 2 * delta / distance
                    points[i] += push
                    points[j] -= push
                    moved = True
        np.clip(points, low, high, out=points)
        return moved

    points = centres * [ASPECT, 1.0]
    for _ in range(400):
        for i, j in zip(*np.nonzero(np.triu(links))):
            delta = points[j] - points[i]
            distance = float(np.hypot(*delta)) or 1e-6
            if distance > AREA_GAP:
                pull = PULL * min(links[i, j], 4) * (distance - AREA_GAP) / 2 * delta / distance
                points[i] += pull
                points[j] -= pull
        separate(points)
    for _ in range(400):
        if not separate(points):
            break
    return points / [ASPECT, 1.0]


def spread_angles(angles: list[float]) -> list[float]:
    """Keeps the works around one area name from bunching on one side."""
    if len(angles) < 2:
        return angles
    gap = 2 * math.pi / len(angles) * 0.75
    order = sorted(range(len(angles)), key=lambda i: angles[i])
    values = [angles[i] for i in order]
    for _ in range(200):
        for k in range(len(values)):
            a, b = values[k], values[(k + 1) % len(values)]
            span = (b - a) % (2 * math.pi)
            if span < gap:
                shift = (gap - span) / 2
                values[k] -= shift
                values[(k + 1) % len(values)] += shift
    out = [0.0] * len(angles)
    for slot, i in enumerate(order):
        out[i] = values[slot] % (2 * math.pi)
    return out


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
        if entry["area"] not in areas:
            raise SystemExit(f"{entry['id']}: unknown area {entry['area']!r}")
        work_of[members] = w
        vector = embeddings[members].mean(axis=0)
        works.append({
            "id": entry["id"], "short": entry["short"], **info,
            "area": areas.index(entry["area"]), "size": len(members),
            "vector": vector / np.linalg.norm(vector),
            "position": coords[members].mean(axis=0),
        })
    unassigned = [texts[r][:60] for r in np.flatnonzero(work_of < 0)]
    print(f"{len(works)} works over {len(areas)} areas; {len(unassigned)} passages belong to no work")

    # Links join works in different areas. Centring the vectors first removes
    # what every work shares, so one generic work doesn't become everyone's
    # nearest neighbour.
    vectors = np.stack([w["vector"] for w in works])
    vectors -= vectors.mean(axis=0)
    vectors /= np.linalg.norm(vectors, axis=1, keepdims=True)
    similarity = vectors @ vectors.T
    same_area = np.array([[a["area"] == b["area"] for b in works] for a in works])
    similarity[same_area] = -1

    near = [[int(n) for n in similarity[w].argsort()[::-1][:NEAR] if similarity[w, n] >= LINK_MIN]
            for w in range(len(works))]
    links = np.zeros((len(areas), len(areas)))
    for w, targets in enumerate(near):
        for n in targets:
            links[works[w]["area"], works[n]["area"]] += 1
            links[works[n]["area"], works[w]["area"]] += 1

    raw = np.stack([np.mean([w["position"] for w in works if w["area"] == a], axis=0) for a in range(len(areas))])
    sizes = [sum(w["area"] == a for w in works) for a in range(len(areas))]
    centres = spread_areas(raw.copy(), links, sizes)
    middle = centres.mean(axis=0)
    for a, name in enumerate(areas):
        members = [w for w in works if w["area"] == a]
        angles = []
        for work in members:
            delta = (work["position"] - raw[a]) * [ASPECT, 1.0]
            if len(members) == 1 or np.hypot(*delta) < 1e-3:
                delta = (centres[a] - middle) * [ASPECT, 1.0]
            angles.append(math.atan2(delta[1], delta[0]))
        # A lone work facing a plot edge would push its name off the plot;
        # it sits below the area's name instead.
        if len(members) == 1:
            facing = math.cos(angles[0])
            if (facing > 0.5 and centres[a][0] > 0.75) or (facing < -0.5 and centres[a][0] < 0.25):
                angles[0] = math.pi / 2
        for work, angle in zip(members, spread_angles(angles)):
            work["angle"] = round(angle, 4)
        print(f"{name}: {', '.join(w['short'] for w in members)}")

    out_works = []
    for w, work in enumerate(works):
        out_works.append({
            key: work[key] for key in ("id", "kind", "title", "short", "meta", "summary", "href", "sources", "area", "angle", "size")
        } | {"near": near[w]})

    out_areas = [{"name": name, "x": round(float(x), 4), "y": round(float(y), 4)}
                 for name, (x, y) in zip(areas, centres)]
    out_sources = [{key: source[key] for key in ("id", "kind", "title", "meta", "href")} for source in sources]

    points = []
    for r, ((index, chunk), (x, y)) in enumerate(zip(rows, coords)):
        work = int(work_of[r])
        anchor = chunk["href"][len(sources[index]["href"]):]
        area = works[work]["area"] if work >= 0 else -1
        points.append([round(float(x), 4), round(float(y), 4), index, area, chunk["text"], anchor, work])

    target = ROOT / "assets" / "data" / "map.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        json.dumps({"model": MODEL, "areas": out_areas, "works": out_works, "sources": out_sources,
                    "points": points}, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"wrote {target.relative_to(ROOT)}: {len(points)} passages, {len(out_works)} works")


if __name__ == "__main__":
    main()
