// Canvas renderer for the map of work in assets/data/map.json.
// Areas are fields of AI work, drawn as hubs; works are the papers, projects
// and production systems, each joined to every area it belongs to and to the
// works it is linked with. src/graph-layout.js places them.

import { createGraph, mulberry } from "./graph-layout.js";

export { mulberry };

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

let mapPromise;
export function loadMap(root) {
  mapPromise ||= fetch(`${root}assets/data/map.json`).then((response) => {
    if (!response.ok) throw new Error(`map.json: ${response.status}`);
    return response.json();
  });
  return mapPromise;
}

export function cssColours() {
  const style = getComputedStyle(document.documentElement);
  const get = (name) => style.getPropertyValue(name).trim();
  return {
    area: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => get(`--a${i}`)),
    kind: { role: get("--k-role") },
    ink: get("--ink"),
    ink2: get("--ink-2"),
    accent: get("--accent"),
    muted: get("--muted"),
    bg: get("--bg"),
  };
}

export const sourceHref = (root, source, anchor = "") => {
  const href = source.href + anchor;
  if (href.startsWith("#") && document.documentElement.dataset.page === "home") return href;
  return root + href;
};

// The work a source belongs to: a paper, a project or its write-up.
export const workOf = (data, sourceId) => data.works.findIndex((work) => work.sources.includes(sourceId));

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const SEED = 7;
const DRAG_START = 4;

export class MapView {
  constructor(canvas, data, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.data = data;
    this.options = {
      inset: () => ({ left: 12, top: 12, right: 12, bottom: 12 }),
      labels: "full",
      animateIn: true,
      idle: false,
      frame: false,
      focusWork: -1,
      drag: true,
      ...options,
    };
    this.root = document.documentElement.dataset.root || "";
    this.kinds = new Set(["paper", "project", "role"]);
    this.hover = -1;
    this.hoverArea = -1;
    this.matches = null;
    this.highlight = this.options.focusWork;
    this.colours = cssColours();
    this.start = performance.now();
    this.animating = this.options.animateIn && !reducedMotion();
    if (!this.animating) this.start = -1e6;
    this.press = null;
    this.dragging = -1;
    this.skipClick = false;

    // The works that call each area home, and the curated pairs.
    this.members = data.areas.map((_, a) =>
      data.works.map((work, w) => (work.homes.some(([home]) => home === a) ? w : -1)).filter((w) => w >= 0),
    );
    this.pairs = data.links.map(([a, b]) => [a, b]);

    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
    // Hub spacing is measured from the names, so measure again once Plex Mono loads.
    document.fonts?.ready.then(() => this.resize());
    this.bindEvents();
    addEventListener("themechange", () => {
      this.colours = cssColours();
      this.requestDraw();
    });
    this.visible = true;
    document.addEventListener("visibilitychange", () => this.requestDraw());
    new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.requestDraw();
    }).observe(canvas);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const inset = this.options.inset(rect.width, rect.height);
    this.box = {
      x: inset.left,
      y: inset.top,
      w: rect.width - inset.left - inset.right,
      h: rect.height - inset.top - inset.bottom,
    };
    // Sizes are designed for a 620px plot and scale with it.
    this.unit = Math.max(0.45, Math.min(1.25, Math.min(this.box.w, this.box.h) / 620));
    this.layout();
    this.requestDraw();
  }

  // The name's lines and box, shared by layout and drawing.
  nameLines(area) {
    const words = area.name.toUpperCase().split(" ");
    const half = Math.ceil(words.length / 2);
    return words.length > 1 && area.name.length > 12
      ? [words.slice(0, half).join(" "), words.slice(half).join(" ")]
      : [words.join(" ")];
  }

  nameSize() {
    return Math.round(11 * Math.max(0.85, this.unit));
  }

  nameBox(area) {
    const { ctx } = this;
    const size = this.nameSize();
    ctx.font = `500 ${size}px "IBM Plex Mono", monospace`;
    const lines = this.nameLines(area);
    const width = Math.max(...lines.map((line) => spaced(ctx, line))) + 16;
    const height = lines.length * (size + 4) + 10;
    return { lines, width, height };
  }

  // Where each hub's name box sits: under its core.
  nameOffset(a) {
    return this.hubs[a].r + 24 * this.unit;
  }

  // Resting positions come from the shared layout. While the map animates in,
  // the works are seen settling from the middle of their homes.
  layout() {
    const named = this.options.labels !== "none";
    const hubBoxes = named
      ? this.data.areas.map((area) => {
          const { width, height } = this.nameBox(area);
          return { w: width, h: height };
        })
      : null;
    if (this.dragging >= 0) {
      this.dragging = -1;
      this.press = null;
    }
    this.graph = createGraph(this.data, this.box, { seed: SEED, hubBoxes });
    this.hubs = this.graph.hubs;
    this.graph.settle();
    if (this.animating && performance.now() - this.start < 2000) this.graph.start();
    this.live = this.graph.nodes.map(({ x, y }) => ({ x, y }));
  }

  setKinds(kinds) {
    this.kinds = kinds;
    this.requestDraw();
  }

  setMatches(works) {
    this.matches = works ? new Set(works) : null;
    this.requestDraw();
  }

  focus(work) {
    this.highlight = work;
    this.requestDraw();
  }

  requestDraw() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      // Wall-clock time, so a throttled background tab still lands on the final layout.
      const busy = this.draw(performance.now());
      if (busy && this.visible && !document.hidden) this.requestDraw();
    });
  }

  shown(w) {
    return this.kinds.has(this.data.works[w].kind);
  }

  // Works lit by the hovered work, the hovered hub, a search or a focus;
  // everything else dims while anything is lit.
  litWorks() {
    const { works } = this.data;
    if (this.hover >= 0) return new Set([this.hover, ...works[this.hover].links]);
    if (this.hoverArea >= 0) return new Set(this.members[this.hoverArea]);
    if (this.matches) return this.matches;
    if (this.highlight >= 0) return new Set([this.highlight, ...works[this.highlight].links]);
    return null;
  }

  // Hubs lit alongside: the homes of the lit work, or the hovered hub.
  litAreas() {
    const { works } = this.data;
    if (this.hover >= 0) return new Set(works[this.hover].homes.map(([a]) => a));
    if (this.hoverArea >= 0) return new Set([this.hoverArea]);
    if (this.matches) return null;
    if (this.highlight >= 0) return new Set(works[this.highlight].homes.map(([a]) => a));
    return null;
  }

  // Returns true while something on screen is still moving.
  draw(now) {
    const { ctx, colours, data } = this;
    if (!this.box) return false;
    ctx.clearRect(0, 0, this.width, this.height);
    const elapsed = now - this.start;
    const settling = this.animating && elapsed < 2000;
    const motion = !reducedMotion();
    const idle = this.options.idle && motion;
    const lit = this.litWorks();
    const litAreas = this.litAreas();
    const u = this.unit;
    const t = (delay, length = 900) =>
      settling ? easeOut(Math.min(1, Math.max(0, (elapsed - delay) / length))) : 1;

    // Live physics: two steps a frame while the map animates in, so it settles
    // in about a second and a half, then one while anything reheats it.
    if (motion && this.graph.heat > 0) {
      this.graph.step();
      if (settling) this.graph.step();
    }
    const time = now * 0.0005;
    this.live = this.graph.nodes.map((node, w) => {
      let { x, y } = node;
      if (idle && node.pinned === false) {
        x += Math.sin(time * 1.3 + w) * 1.2;
        y += Math.cos(time + w * 1.7) * 1.2;
      }
      return { x, y };
    });

    if (this.options.frame) this.drawFrame(t(0, 600));
    this.drawEdges(t(300, 700), lit);
    const labelAlpha = t(1100, 700);
    this.drawHubs(labelAlpha, lit, litAreas);

    // Circles for papers, squares for projects, diamonds for production
    // systems, all in the colour of the work's area.
    data.works.forEach((work, w) => {
      if (!this.shown(w)) return;
      const node = this.live[w];
      const size = (work.kind === "role" ? 6 : 7.5) * Math.max(0.75, u);
      ctx.globalAlpha = !lit || lit.has(w) ? 1 : 0.3;
      ctx.fillStyle = colours.area[work.area];
      ctx.strokeStyle = colours.bg;
      ctx.lineWidth = 2.5;
      shape(ctx, work.kind, node.x, node.y, size);
      ctx.stroke();
      ctx.fill();
      if (w === this.hover || w === this.highlight || this.matches?.has(w)) {
        ctx.strokeStyle = colours.accent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;

    this.drawWorkNames(labelAlpha, lit);
    return settling || idle || (motion && this.graph.heat > 0);
  }

  // A spoke from each hub to every work that calls it home, thicker for the
  // heavier home, and a gold dash between curated-linked works.
  drawEdges(alpha, lit) {
    const { ctx, colours, data } = this;
    const dimmed = (a, b) => lit && !(lit.has(a) && lit.has(b) && (a === this.hover || b === this.hover || a === this.highlight || b === this.highlight || this.hoverArea >= 0));
    data.works.forEach((work, w) => {
      if (!this.shown(w)) return;
      const node = this.live[w];
      for (const [a, weight] of work.homes) {
        const hub = this.hubs[a];
        const d = Math.hypot(node.x - hub.x, node.y - hub.y) || 1;
        const dim = lit && !(lit.has(w) && (this.hover === w || this.highlight === w || this.hoverArea === a || this.matches));
        ctx.strokeStyle = withAlpha(colours.area[a], (dim ? 0.06 : 0.2 + 0.5 * weight) * alpha);
        ctx.lineWidth = 0.8 + 2.4 * weight;
        ctx.beginPath();
        ctx.moveTo(hub.x + ((node.x - hub.x) / d) * hub.r, hub.y + ((node.y - hub.y) / d) * hub.r);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      }
    });
    for (const [a, b] of this.pairs) {
      if (!this.shown(a) || !this.shown(b)) continue;
      const p = this.live[a];
      const q = this.live[b];
      const ends = [this.hover, this.highlight];
      const active = ends.includes(a) || ends.includes(b);
      ctx.strokeStyle = withAlpha(colours.accent, (active ? 0.85 : dimmed(a, b) ? 0.06 : 0.3) * alpha);
      ctx.lineWidth = active ? 1.5 : 1;
      ctx.setLineDash(active ? [] : [3, 4]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  // Each hub: a halo, a ring, a solid core sized by its works, and its name
  // in spaced capitals under the core.
  drawHubs(alpha, lit, litAreas) {
    const { ctx, colours, data } = this;
    const u = this.unit;
    const named = this.options.labels !== "none" && alpha > 0;
    this.areaRects = [];
    this.hubRects = [];
    data.areas.forEach((area, a) => {
      const hub = this.hubs[a];
      const colour = colours.area[a];
      const dim = (litAreas && !litAreas.has(a)) || (lit && !litAreas && !this.members[a].some((w) => lit.has(w)));
      ctx.globalAlpha = dim ? 0.35 : 1;
      const halo = ctx.createRadialGradient(hub.x, hub.y, 2, hub.x, hub.y, 46 * u);
      halo.addColorStop(0, withAlpha(colour, 0.28));
      halo.addColorStop(1, withAlpha(colour, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 46 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = withAlpha(colour, 0.35);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, 20 * u, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(hub.x, hub.y, hub.r, 0, Math.PI * 2);
      ctx.fill();
      this.hubRects.push([hub.x - hub.r - 4, hub.y - hub.r - 4, hub.r * 2 + 8, hub.r * 2 + 8]);
      if (!named) return;
      const { lines, width, height } = this.nameBox(area);
      const size = this.nameSize();
      const cy = hub.y + this.nameOffset(a);
      ctx.globalAlpha = alpha * (dim ? 0.4 : 1);
      ctx.fillStyle = withAlpha(colours.bg, 0.82);
      roundRect(ctx, hub.x - width / 2, cy - height / 2, width, height, 6);
      ctx.fill();
      ctx.strokeStyle = withAlpha(colour, this.hoverArea === a ? 0.9 : 0.45);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = `500 ${size}px "IBM Plex Mono", monospace`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = this.hoverArea === a ? colours.ink : colours.ink2;
      lines.forEach((line, i) => spaced(ctx, line, hub.x, cy + (i - (lines.length - 1) / 2) * (size + 4)));
      this.areaRects[a] = [hub.x - width / 2, cy - height / 2, width, height];
    });
    ctx.globalAlpha = 1;
  }

  // Registration marks at the plot's corners and its two axes.
  drawFrame(alpha) {
    const { ctx, colours, box } = this;
    const arm = 12;
    const [left, top, right, bottom] = [box.x - 8, box.y - 8, box.x + box.w + 8, box.y + box.h + 8];
    ctx.lineWidth = 1;
    ctx.strokeStyle = withAlpha(colours.muted, 0.55 * alpha);
    ctx.beginPath();
    for (const [x, y, dx, dy] of [
      [left, top, 1, 1],
      [right, top, -1, 1],
      [left, bottom, 1, -1],
      [right, bottom, -1, -1],
    ]) {
      ctx.moveTo(x + dx * arm, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * arm);
    }
    ctx.stroke();
    ctx.font = '500 10px "IBM Plex Mono", monospace';
    ctx.fillStyle = withAlpha(colours.muted, 0.8 * alpha);
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText("UMAP-1", left + arm + 6, bottom - 5);
    ctx.save();
    ctx.translate(left - 5, top + arm + 6);
    ctx.rotate(Math.PI / 2);
    ctx.fillText("UMAP-2", 0, -10);
    ctx.restore();
  }

  // Work names sit beside their node, on the side away from the work's hub.
  // Each label tries eight spots, then four more two rows out, and slides
  // sideways to stay in the plot; the most hemmed-in labels are placed first,
  // and none covers a node, a hub or a name.
  drawWorkNames(alpha, lit) {
    const { ctx, colours, data } = this;
    if (!alpha) return;
    const full = this.options.labels !== "none" && this.box.w >= 420;
    const size = Math.round(12.5 * Math.max(0.9, this.unit));
    ctx.font = `600 ${size}px "IBM Plex Sans", sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    // Labels may use the gutter left of the plot, but stay clear of the hero text.
    const left = Math.max(2, this.box.x - 56);
    const overlaps = ([x, y, w, h], [ox, oy, ow, oh]) =>
      !(x + w < ox - 2 || ox + ow < x - 2 || y + h < oy - 1 || oy + oh < y - 1);
    const nodeRects = this.live.map(({ x, y }) => [x - 9, y - 9, 18, 18]);
    const fixed = [...this.areaRects.filter(Boolean), ...this.hubRects];

    const wanted = data.works
      .map((work, w) => ({ work, w, active: w === this.hover || w === this.highlight }))
      .filter(({ w, active }) => this.shown(w) && (full || active))
      .map((item) => {
        const { work, w } = item;
        const node = this.live[w];
        const hub = this.hubs[work.area];
        const width = ctx.measureText(work.short).width + 12;
        const height = size + 9;
        const gap = 12;
        const side = node.x - hub.x >= -4 ? 1 : -1;
        const below = node.y >= hub.y;
        const beside = (s, dy = 0) => [s > 0 ? node.x + gap : node.x - gap - width, node.y - height / 2 + dy, width, height];
        const under = (flip) => [node.x - width / 2, below !== flip ? node.y + gap + 4 : node.y - gap - 4 - height, width, height];
        const fit = ([x, y, rw, rh]) => [Math.min(Math.max(x, left), this.width - rw - 2), y, rw, rh];
        const step = height + 6;
        const ring = (k) => [
          beside(side, k * (below ? step : -step)),
          beside(-side, k * (below ? step : -step)),
          beside(side, k * (below ? -step : step)),
          beside(-side, k * (below ? -step : step)),
        ];
        // The second ring, two rows out, is tried only when every near spot is taken.
        const options = [
          beside(side),
          under(false),
          beside(side, below ? step : -step),
          beside(-side),
          under(true),
          beside(-side, below ? step : -step),
          beside(side, below ? -step : step),
          beside(-side, below ? -step : step),
          ...ring(2),
        ]
          .map(fit)
          .filter((rect) => rect[1] > 2 && rect[1] + rect[3] < this.height - 2)
          .filter((rect) => !fixed.some((other) => overlaps(rect, other)))
          // A name never covers a node, its own included once it slides to stay in the plot.
          .filter((rect) => nodeRects.every((other, n) => !overlaps(rect, n === w ? [node.x - 6, node.y - 6, 12, 12] : other)));
        return { ...item, options, fallback: fit(beside(side)) };
      })
      .sort((a, b) => Number(b.active) - Number(a.active) || Number(Boolean(lit?.has(b.w))) - Number(Boolean(lit?.has(a.w))) || a.options.length - b.options.length);

    const placed = [];
    for (const { work, w, active, options, fallback } of wanted) {
      let spot = options.find((rect) => placed.every((other) => !overlaps(rect, other)));
      if (!spot) {
        if (!active) continue;
        spot = fallback;
      }
      placed.push(spot);
      const [x, y, width, height] = spot;
      ctx.globalAlpha = alpha * (!lit || lit.has(w) ? 1 : 0.35);
      ctx.fillStyle = withAlpha(colours.bg, active ? 0.94 : 0.74);
      roundRect(ctx, x, y, width, height, 6);
      ctx.fill();
      ctx.fillStyle = active ? colours.ink : withAlpha(colours.ink, 0.86);
      ctx.fillText(work.short, x + 6, y + height / 2 + 0.5);
    }
    ctx.globalAlpha = 1;
  }

  nearest(x, y, within = 18) {
    let best = -1;
    let distance = within;
    if (!this.live) return best;
    this.data.works.forEach((_, w) => {
      if (!this.shown(w)) return;
      const d = Math.hypot(this.live[w].x - x, this.live[w].y - y);
      if (d < distance) {
        best = w;
        distance = d;
      }
    });
    return best;
  }

  // The hub whose core or name box is under the point.
  areaAt(x, y) {
    const inside = ([rx, ry, rw, rh]) => x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
    const core = this.hubs.findIndex((hub) => Math.hypot(hub.x - x, hub.y - y) <= hub.r + 4);
    if (core >= 0) return core;
    return (this.areaRects || []).findIndex((rect) => rect && inside(rect));
  }

  bindEvents() {
    const canvas = this.canvas;
    const local = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    canvas.addEventListener("pointerdown", (event) => {
      this.skipClick = false;
      if (!this.options.drag || event.pointerType === "touch" || event.button !== 0) return;
      const { x, y } = local(event);
      const work = this.nearest(x, y);
      this.press = work >= 0 ? { work, x, y, id: event.pointerId } : null;
    });
    canvas.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const { x, y } = local(event);
      if (this.press && this.dragging < 0 && Math.hypot(x - this.press.x, y - this.press.y) > DRAG_START) {
        this.dragging = this.press.work;
        canvas.setPointerCapture?.(this.press.id);
        canvas.style.cursor = "grabbing";
      }
      if (this.dragging >= 0) {
        this.graph.pin(this.dragging, x, y);
        this.setHover(this.dragging);
        this.requestDraw();
        return;
      }
      const work = this.nearest(x, y);
      this.setHoverArea(work < 0 ? this.areaAt(x, y) : -1);
      canvas.style.cursor = work >= 0 ? "pointer" : "";
      this.setHover(work);
      this.requestDraw();
    });
    // Ends a drag; returns whether one was in progress. Only a pointerup is
    // followed by a click, so only that path swallows the click.
    const finish = () => {
      const dragged = this.dragging >= 0;
      if (dragged) {
        this.graph.release(this.dragging);
        if (reducedMotion()) this.graph.settle();
        this.dragging = -1;
        canvas.style.cursor = "pointer";
        this.requestDraw();
      }
      this.press = null;
      return dragged;
    };
    canvas.addEventListener("pointerup", () => {
      if (finish()) this.skipClick = true;
    });
    canvas.addEventListener("pointercancel", finish);
    canvas.addEventListener("pointerleave", () => {
      if (this.dragging >= 0) return;
      this.setHoverArea(-1);
      this.setHover(-1);
      this.requestDraw();
    });
    canvas.addEventListener("click", (event) => {
      if (this.skipClick) {
        this.skipClick = false;
        return;
      }
      const { x, y } = local(event);
      const touch = event.pointerType === "touch";
      const work = this.nearest(x, y, touch ? 26 : 18);
      if (work < 0) {
        this.setHover(-1);
        // On touch, a tap on a hub shows what it is.
        if (touch) this.setHoverArea(this.areaAt(x, y));
        this.requestDraw();
        return;
      }
      // On touch, the first tap shows the work and the second opens it.
      if (touch && this.hover !== work) {
        this.setHoverArea(-1);
        this.setHover(work, true);
        return;
      }
      this.open(work);
    });
  }

  setHover(work, touch = false) {
    if (work === this.hover) return;
    this.hover = work;
    this.options.onHover?.(work, touch);
    this.requestDraw();
  }

  setHoverArea(area) {
    if (area === this.hoverArea) return;
    this.hoverArea = area;
    this.options.onHoverArea?.(area);
    this.requestDraw();
  }

  open(w) {
    const work = this.data.works[w];
    if (this.options.onOpen?.(work)) return;
    const href = sourceHref(this.root, work);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
      history.replaceState(null, "", href);
    } else {
      location.href = href;
    }
  }
}

const kindLabel = { paper: "Paper", project: "Project", role: "Production system" };

function placeTooltip(tooltip, view, x, y) {
  const parent = tooltip.offsetParent || tooltip.parentElement;
  const bounds = parent.getBoundingClientRect();
  const canvasBounds = view.canvas.getBoundingClientRect();
  const px = x + canvasBounds.left - bounds.left;
  const py = y + canvasBounds.top - bounds.top;
  tooltip.classList.add("on");
  const width = tooltip.offsetWidth;
  const height = tooltip.offsetHeight;
  const left = px + 22 + width > bounds.width ? px - width - 22 : px + 22;
  const top = Math.min(Math.max(8, py - height / 2), bounds.height - height - 8);
  tooltip.style.transform = `translate3d(${Math.max(8, left)}px, ${top}px, 0)`;
}

// Both tooltips share one element, so hiding one kind leaves the other kind showing.
export function showTooltip(tooltip, view, w, touch) {
  if (!tooltip) return;
  if (w < 0) {
    if (view.hoverArea < 0) tooltip.classList.remove("on");
    return;
  }
  const { data } = view;
  const work = data.works[w];
  const homes = work.homes.map(([a, weight]) => `${escape(data.areas[a].name)} ${Math.round(weight * 100)}%`).join(" · ");
  const links = data.links
    .filter(([a, b]) => a === w || b === w)
    .map(([a, b, why]) => `<li>↔ ${escape(data.works[a === w ? b : a].short)}: ${escape(why)}</li>`)
    .join("");
  tooltip.innerHTML = `<b><i style="background:${view.colours.area[work.area]}"></i>${homes} · ${escape(kindLabel[work.kind])}</b><strong>${escape(work.title)}</strong><span>${escape(clip(work.summary, 150))}</span>${links ? `<ul class="map-tooltip-links">${links}</ul>` : ""}<small>${work.meta ? `${escape(work.meta)}. ` : ""}${touch ? "Tap again to open." : "Click to open."}</small>`;
  const node = view.live[w];
  placeTooltip(tooltip, view, node.x, node.y);
}

export function showAreaTooltip(tooltip, view, a) {
  if (!tooltip) return;
  if (a < 0) {
    if (view.hover < 0) tooltip.classList.remove("on");
    return;
  }
  const area = view.data.areas[a];
  const count = area.size === 1 ? "1 work" : `${area.size} works`;
  tooltip.innerHTML = `<b><i style="background:${view.colours.area[a]}"></i>${escape(area.name)}</b><strong>${escape(area.description || area.name)}</strong><span>${count}</span>`;
  const hub = view.hubs[a];
  placeTooltip(tooltip, view, hub.x, hub.y);
}

function shape(ctx, kind, x, y, r) {
  ctx.beginPath();
  if (kind === "project") {
    roundRect(ctx, x - r * 0.9, y - r * 0.9, r * 1.8, r * 1.8, r * 0.35);
  } else if (kind === "role") {
    ctx.moveTo(x, y - r * 1.15);
    ctx.lineTo(x + r * 1.15, y);
    ctx.lineTo(x, y + r * 1.15);
    ctx.lineTo(x - r * 1.15, y);
    ctx.closePath();
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }
}

// Letter-spaced text: returns its width, and draws it centred on x when given one.
function spaced(ctx, text, x, y) {
  const spacing = 1.2;
  const width = [...text].reduce((sum, ch) => sum + ctx.measureText(ch).width + spacing, -spacing);
  if (x === undefined) return width;
  const align = ctx.textAlign;
  ctx.textAlign = "left";
  let cursor = x - width / 2;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + spacing;
  }
  ctx.textAlign = align;
  return width;
}

export function clip(text, max = 170) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function escape(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

export function withAlpha(colour, alpha) {
  if (colour.startsWith("#")) {
    const hex = colour.length === 4
      ? colour.slice(1).split("").map((c) => c + c).join("")
      : colour.slice(1);
    const n = parseInt(hex, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }
  return colour;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
