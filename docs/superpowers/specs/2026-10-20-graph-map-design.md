# The homepage map as a graph of domains and works

Design for replacing the islands-and-orbits hero map with an Obsidian-style
graph. Decided with Akhil on 2026-10-20 from the throwaway mockup
`.directions/k-graph-with-domains.html` (generator: `.directions/make-map-options.mjs`).

## Intent

The hero of akhiltheerthala.com is a map of everything Akhil has made: papers,
datasets and models, apps, tools, and the production systems from his roles. The
taxonomy in `data/map-areas.json` (approved the same day) says every work is a
crossing of a field and a method, so a work can belong to several areas with
weights, works are joined by curated links, and areas touch through relations.

The islands design gave every work one home, so FinForge sat only in
"Evaluation" although it is as much financial reasoning. Under the approved
taxonomy two areas, Data curation and Evaluation & interpretability, have no work
that is theirs alone: islands with empty orbits make no sense. A graph has no
such problem. A hub with spokes is never empty, a two-home work has two spokes,
and a link is an edge.

What "properly useful" means here: in ten seconds a visitor sees the six areas
Akhil works in, that Data curation is the hub his other work hangs off, which
works bridge which areas, and can open any of them.

## Goals

- Every work is drawn once, with a spoke to every area it belongs to at weight
  0.2 or more. Spoke thickness and opacity follow the weight.
- Curated links from `data/map-areas.json` are drawn between works as a second
  edge style (gold, dashed), lit when either end is hovered.
- Each area is a hub node a visitor cannot miss: a soft halo, a solid core sized
  by how many works belong to it, and its name in the boxed spaced capitals the
  site already uses.
- The graph settles live when the page opens. Dragging a work makes the rest
  react. Hovering a work lights it, its homes and its linked works and dims the
  rest. Hovering a hub lights its works. Clicking a work opens it.
- The same picture on every load for the same data and viewport. Domains are
  pinned; works settle deterministically.
- With reduced motion, the settled state is drawn at once and nothing moves.
- On touch, the page scrolls over the map. A tap shows a work, a second tap
  opens it, and nothing can be dragged.
- Everything wired to the map today keeps working: the search box lighting
  matches, the three legend chips hiding a kind, the "Show on map" buttons on
  the papers and projects, the mini map and "Related work" list on essay and
  artifact pages, the ambient dot field and the essay constellations.
- The social preview card (`assets/social/akhil-theerthala-og.png`, drawn by
  `scripts/render-social-card.mjs`) shows the same graph as the hero, so a link
  preview matches the page.

## Non-goals

- Pan and wheel zoom. The hero is a page, not an app, and twenty-one nodes fit.
- A click mode that shows a local graph. Hover does that.
- Floating domain nodes. They are more Obsidian but reshuffle the hero.
- Drawing the area relations as edges, including the field-level tie between
  Financial reasoning and Document AI. The data stays in the spec file for later.
- Any change to the taxonomy, the corpus, the search or the passage points.

## Anti-goals

- A tag-cloud look: thin lines, generic circles, names in small grey type. The
  hubs must read as places, in the site's carbon and gold with the grid ground.
- A layout that changes shape when a work is added. Adding a work may move its
  neighbours a little, never the domains.
- Labels crossing a node, a hub or another label. The current label placer
  already avoids this and is to be kept.
- A hero that captures the wheel or breaks scrolling on a phone.
- Physics that never rests, or that burns the battery in a background tab.

## Constraints

- Vanilla JavaScript and canvas, bundled by esbuild from `src/site.js` into
  `assets/js/site.js`; no new dependency.
- The map data is `assets/data/map.json`, written by `uv run scripts/build-map.py`,
  which embeds the passages printed by `scripts/map-corpus.mjs` and reads
  `data/map-areas.json`. `scripts/build-site.mjs` prerenders the homepage from
  `map.json`, and `npm test` checks the data in `tests/site-build.test.mjs`.
- Palette and type stay: `--a0` to `--a5` for the six areas in spec order,
  `--accent` gold for links and highlights, Plex Mono spaced capitals for area
  names, Plex Sans for work labels, circle/square/diamond markers for
  paper/project/production system. Light theme works through the same variables.
- On wide screens the plot occupies the right part of the hero (the inset in
  `home()` in `src/site.js`); the hero text sits on the left and labels may use the
  gutter but never run into the text. On narrow screens the map is a block under
  the intro.
- Sizes scale with the plot through `unit` as they do now, so the mini map and
  the hero share one renderer.

## The data (`assets/data/map.json`)

Produced by `scripts/build-map.py` from the spec file and the embeddings.

- `areas[]`: `name`, `x`, `y` in plot units, `description` from the spec file,
  `size` = the number of works that have the area as a home.
- `works[]`: as today (`id`, `kind`, `title`, `short`, `meta`, `summary`,
  `href`, `sources`, `size`) plus
  - `homes`: `[[areaIndex, weight], ...]` for every weight of 0.2 or more. The
    weights come straight from the spec file. The work's `area` comes first,
    then the rest by weight.
  - `area`: the spec file's `area`, as today, which the build checks is one of
    the heaviest weights (a tie keeps the earlier placement, so FinForge stays
    in Evaluation & interpretability). It colours the work, leads the tooltip's
    homes line, counts in the legend, and is what the passage points carry.
  - `links`: indices of the works this one is curated-linked to, symmetric.
  - `angle` and `near` are dropped. Embedding-derived links are no longer drawn;
    the curated links replace them everywhere, including the "Related work" list.
- `links[]`: `[workIndex, workIndex, why]` from the spec file, for tooltips.
- `sources[]` and `points[]`: unchanged. A point's area is its work's heaviest home.

The build fails loudly, as it does today, when a work in the spec file names a
source the corpus lacks, when a link names an unknown work, or when a work's
weights do not sum to 1.

## Domain positions (build time)

Domains stay where the embeddings put them, so the "map" framing and the
registration marks stay honest. `build-map.py` keeps computing each area's raw
centre as the mean of its works' passage positions (a work with several homes
counts toward each, weighted), then spreads the centres with the existing
`spread_areas`, with two changes:

- The gap between two areas comes from the hubs and the room their works need
  between them, not from orbit sizes: a base gap, more for every work the two
  areas share and a little more per work of each area. The numbers are the
  builder's, with one check: the six hubs must fit the hero plot at its common
  aspects (about 0.9 to 1.1) without any two name boxes touching, with Data
  curation between the others and FinForge's two homes adjacent.
- The pull between two areas counts the works they share, weighted, plus 1 for
  a `strong` relation and 0.5 for `medium`. This is what sets Data curation in
  the middle of the others.

The result is six `x, y` pairs in plot units.

Hubs stay put between builds (my call, from the agreed "pinned domains"). When
the published `map.json` has the same set of area names, the build starts the
spreading from the published positions instead of the raw centres, so the
relaxation only moves a hub when a gap or pull rule is violated. An area that is
new, renamed or removed makes the build start from the raw centres for every
area, aligned to the published map as today so the picture does not flip. "Where
the embeddings put them" is therefore exactly true on the first build after a
change to the areas and approximately true afterwards, which is what the axis
labels claim.

## Work positions (run time)

Works are placed by a small force simulation in the renderer, because the
plot's aspect changes with the viewport and because dragging needs a live
model. It is deterministic: a seeded generator (the `mulberry` already in
`src/map.js`) gives the only randomness, and domains are fixed.

- Nodes: the six hubs at their plot positions (fixed) and the works.
- Forces: repulsion between every pair of nodes (stronger from hubs, so works
  keep clear of hub names); a spring from each work to each of its homes, whose
  rest length shortens with the weight so a work sits nearer its heavier home;
  a weak spring along each curated link; a weak pull toward the plot's centre;
  a clamp that keeps every work inside the plot with room for its label.
- Start: each work at the weighted middle of its homes, nudged by the seed.
- Rest: the renderer runs the simulation to rest synchronously at layout time
  (the cooling schedule from the mockup, a few hundred steps) to know the
  settled positions. These positions place labels, answer hit tests, and are
  what reduced motion draws.
- Settle animation: when motion is allowed, the picture starts with every work
  at its start position and the simulation runs live from there, so the graph
  is seen settling over roughly 1.5 seconds. Spokes and links fade in with it,
  labels after it, as the islands did.
- Drag: a pointer press on a work followed by movement of more than 4 px fixes
  the work to the pointer and reheats the simulation; the rest react. On
  release the work is free again and the graph relaxes where it is. A press
  without movement is a click. Dragging is pointer-type mouse and pen only.
- Idle: the slight drift the islands have today stays, at the same amplitude,
  when motion is allowed, so the hero never looks frozen.
- The simulation only runs while the canvas is visible and the tab is in the
  foreground, and stops when it has cooled; hover and drag reheat it.

The layout is recomputed on resize and when Plex Mono finishes loading, as now.

## Drawing

Back to front: the frame marks and axis labels (unchanged), then edges, then
hubs, then works, then labels.

- Edges: a spoke from the hub's core edge to the work, in the hub's colour,
  width 0.8 to 3.2 px and opacity 0.2 to 0.7 by weight. A curated link as a
  1 px gold dash between the two works. When something is lit, edges not
  touching a lit node fall to 0.06 opacity; a lit link turns solid.
- Hub: a radial halo in the area colour fading to transparent over about 46 px
  at unit 1, a 1 px ring at 20 px, a solid core whose radius is 6 px plus
  1.2 px per work of the area, and the name box below the core, drawn with the
  existing `nameLines` and spaced capitals. The name box is a fixed obstacle
  for the label placer.
- Work: the existing markers and sizes, filled in the heaviest home's colour,
  stroked in the background colour; the gold ring on hover, focus and search
  match as today.
- Labels: the existing collision-aware placer in `drawWorkNames`, with hub
  name boxes and hub cores as fixed obstacles. Full labels only when the plot is
  at least 420 px wide, as now.
- Dimming: lit works at full opacity, the rest at 0.3; lit hubs at full, the
  rest at 0.35, as the islands dim today.

## Interaction

- Hover a work: light the work, its homes and its linked works; show the
  tooltip. The tooltip's first line lists the homes with their percentages
  ("Evaluation & interpretability 45% · Financial reasoning 45%") in place of the
  single area name, then the title and summary as today, then one line per
  curated link ("↔ Kuvera: synthetic finance data, one for training and one for
  benchmarks", from `links[].why`), then the meta and the click hint. This is the
  tooltip the approved mockup shows (my call to keep it).
- Hover a hub (its core or name box): light its works and the hub, and show a
  tooltip with the area's name, its `description` and its work count (my call;
  the description has no other place on the page).
- Click a work: open it, exactly as today (scroll to the homepage anchor, or go
  to the page). On touch the first tap shows, the second opens, as today.
- Click a hub: nothing. The hubs are places, not controls.
- Legend chips: hiding a kind hides those works and their edges; they stay in
  the simulation so nothing else moves.
- Search: matches lit as today. "Show on map": the work focused for six seconds
  as today.
- Keyboard: unchanged (the search box is the keyboard route; the hero lists
  everything below).

## Reduced motion and touch

- `prefers-reduced-motion: reduce`: no settle animation, no idle drift, no live
  physics; the rested layout is drawn at once; drag still works but the graph
  relaxes without animation (positions update on the next frame).
- Touch: `touch-action: pan-y` stays on the canvas; no drag; tap-to-show,
  tap-again-to-open, with the wider hit radius already used.

## Mini map and other readers of the data

- The essay and artifact pages' mini map uses the same renderer with
  `labels: "none"`, no animation, no drag, and the page's work focused; hubs are
  drawn smaller through `unit`.
- "Related work" on those pages lists the work's curated links first, then other
  works that share its heaviest home, four at most.
- The ambient dot field and the essay constellations read `points` and are
  unchanged.
- The social card script draws the graph instead of islands: the six hubs at
  their plot positions, the works at the rested positions of the same seeded
  simulation run to rest in Node for the card's 1200 by 630 plot, spokes, links,
  markers and labels in the carbon theme as static SVG, screenshotted as today.
  The simulation lives in one module that both the renderer and the card script
  import, so the two pictures cannot drift apart; the hub, marker and label
  drawing is duplicated in SVG as it is today for the islands. The card is
  regenerated whenever the map is rebuilt.
- The prerendered legend counts and the canvas `aria-label` keep working from
  `works[].kind` and `areas[]`.

## Tests

`tests/site-build.test.mjs` is updated to the new shape: every work has at least
one home, the heaviest home is its `area`, its homes' weights come from the spec
file, every link names two existing works, every area has a size and a
description, and a publication is on the map as its own node or as a source of
the work it describes (already so). The rule that a link may not join two works
of the same area is removed, since curated links may.

## What is left to the builder

- Exact force constants, cooling schedule and seed; the mockup's values are a
  starting point, not a requirement.
- The halo gradient stops, the hub ring, and how the core radius scales with
  `unit` below 1.
- Where label candidates go around a hub's name box, and the order they are tried.
- How the settle animation and the existing `t(delay)` fade schedule are merged.
- Where the shared simulation module lives and what it exports (a pure function
  from the map data, a plot box and a seed to rested positions is enough).
- Whether to reuse `MapView` by changing it in place or to write the graph as a
  new class with the same options and methods (`setKinds`, `setMatches`,
  `focus`, `onHover`, `onOpen`); the callers in `src/site.js` should not need to
  change beyond the tooltip's first line and the "Related work" list.
- The build script's exact gap and pull numbers, as long as Data curation lands
  between the others and no two hubs' name boxes can touch.
