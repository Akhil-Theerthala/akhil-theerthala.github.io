// Canvas renderer for the map of work in assets/data/map.json.
// Areas are fields of AI work, drawn as contoured islands around their names;
// works are the papers, projects and production systems placed around them.

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

    this.members = data.areas.map((_, a) =>
      data.works.map((work, w) => (work.area === a ? w : -1)).filter((w) => w >= 0),
    );
    this.links = [];
    const seen = new Set();
    data.works.forEach((work, w) =>
      work.near.forEach((n) => {
        const key = `${Math.min(w, n)}-${Math.max(w, n)}`;
        if (!seen.has(key)) {
          seen.add(key);
          this.links.push([w, n]);
        }
      }),
    );

    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
    // Orbits are sized from the names, so measure again once Plex Mono loads.
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

  toScreen(x, y) {
    return [this.box.x + x * this.box.w, this.box.y + y * this.box.h];
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

  // Resting positions: each work on an elliptical orbit that clears its
  // area's name, then nudged apart where neighbouring works would touch.
  layout() {
    const u = this.unit;
    const { ctx } = this;
    const size = this.nameSize();
    ctx.font = `500 ${size}px "IBM Plex Mono", monospace`;
    this.centres = this.data.areas.map((area) => this.toScreen(area.x, area.y));
    this.orbits = this.data.areas.map((area, a) => {
      const lines = this.nameLines(area);
      const width = Math.max(...lines.map((line) => spaced(ctx, line))) + 16;
      const height = lines.length * (size + 4) + 10;
      const extra = Math.max(0, this.members[a].length - 2) * 6 * u;
      return [Math.max(width / 2 + 24 * u, 56 * u) + extra, Math.max(height / 2 + 28 * u, 46 * u) + extra];
    });
    this.nodes = this.data.works.map((work) => {
      const [cx, cy] = this.centres[work.area];
      const [rx, ry] = this.orbits[work.area];
      return { x: cx + Math.cos(work.angle) * rx, y: cy + Math.sin(work.angle) * ry };
    });
    const gap = 30 * this.unit;
    for (let pass = 0; pass < 40; pass++) {
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const a = this.nodes[i];
          const b = this.nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy) || 0.01;
          if (d < gap) {
            const push = (gap - d) / 2;
            a.x += (dx / d) * push;
            a.y += (dy / d) * push;
            b.x -= (dx / d) * push;
            b.y -= (dy / d) * push;
          }
        }
      }
    }
    for (const node of this.nodes) {
      node.x = Math.max(12, Math.min(this.width - 12, node.x));
      node.y = Math.max(12, Math.min(this.height - 12, node.y));
    }
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

  // Works lit by the hovered work, the hovered area, a search or a focus;
  // everything else dims while anything is lit.
  litWorks() {
    if (this.hover >= 0) return new Set([this.hover, ...this.data.works[this.hover].near]);
    if (this.hoverArea >= 0) return new Set(this.members[this.hoverArea]);
    if (this.matches) return this.matches;
    if (this.highlight >= 0) return new Set([this.highlight, ...this.data.works[this.highlight].near]);
    return null;
  }

  // Returns true while something on screen is still moving.
  draw(now) {
    const { ctx, colours, data } = this;
    if (!this.box) return false;
    ctx.clearRect(0, 0, this.width, this.height);
    const elapsed = now - this.start;
    const settling = this.animating && elapsed < 2000;
    const idle = this.options.idle && !reducedMotion();
    const lit = this.litWorks();
    const u = this.unit;
    const t = (delay, length = 900) =>
      settling ? easeOut(Math.min(1, Math.max(0, (elapsed - delay) / length))) : 1;

    // Live positions: works leave their area's name and settle on its ring.
    const time = now * 0.0005;
    this.live = this.nodes.map((node, w) => {
      const work = data.works[w];
      const [cx, cy] = this.centres[work.area];
      const k = t(250 + work.area * 70 + w * 25);
      let x = cx + (node.x - cx) * k;
      let y = cy + (node.y - cy) * k;
      if (idle) {
        x += Math.sin(time * 1.3 + w) * 1.2;
        y += Math.cos(time + w * 1.7) * 1.2;
      }
      return { x, y };
    });

    if (this.options.frame) this.drawFrame(t(0, 600));
    this.drawIslands(t, lit);
    this.drawLinks(t(900, 700), lit);

    // Spokes from each name to its works.
    data.works.forEach((work, w) => {
      if (!this.shown(w)) return;
      const [cx, cy] = this.centres[work.area];
      const node = this.live[w];
      const d = Math.hypot(node.x - cx, node.y - cy) || 1;
      const [rx, ry] = this.orbits[work.area];
      const from = Math.min(d, d * 0.62, Math.hypot(rx - 24 * u, ry - 28 * u));
      ctx.strokeStyle = withAlpha(colours.area[work.area], lit && !lit.has(w) ? 0.12 : 0.4);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + ((node.x - cx) / d) * from, cy + ((node.y - cy) / d) * from);
      ctx.lineTo(node.x, node.y);
      ctx.stroke();
    });

    const labelAlpha = t(1100, 700);
    this.drawAreaNames(labelAlpha, lit);

    // Circles for papers, squares for projects, diamonds for production
    // systems, all in their area's colour.
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
    return settling || idle;
  }

  // Each area is an island: a soft fill and contour rings around its name.
  drawIslands(t, lit) {
    const { ctx, colours, data } = this;
    const u = this.unit;
    data.areas.forEach((_, a) => {
      const k = t(a * 70, 1000);
      if (!k) return;
      const [cx, cy] = this.centres[a];
      const colour = colours.area[a];
      const [rx, ry] = this.orbits[a];
      const dim = lit && !this.members[a].some((w) => lit.has(w)) ? 0.35 : 1;
      ctx.globalAlpha = k * dim;
      const reach = Math.max(rx, ry) + 60 * u;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach);
      glow.addColorStop(0, withAlpha(colour, 0.12));
      glow.addColorStop(1, withAlpha(colour, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, reach, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1;
      // The works ride the first ring; the outer rings fade like contours.
      [
        [0, 0.26],
        [20 * u, 0.17],
        [40 * u, 0.1],
        [60 * u, 0.05],
      ].forEach(([offset, alpha], ring) => {
        ctx.strokeStyle = withAlpha(colour, alpha);
        ctx.beginPath();
        for (let step = 0; step <= 96; step++) {
          const angle = (step / 96) * Math.PI * 2;
          // A little wobble, so the rings read as contour lines.
          const wobble = ring ? 1 + 0.03 * Math.sin(angle * 3 + a * 1.7 + ring) + 0.018 * Math.cos(angle * 5 + a) : 1;
          const grow = 0.85 + 0.15 * k;
          const x = cx + Math.cos(angle) * (rx + offset) * grow * wobble;
          const y = cy + Math.sin(angle) * (ry + offset) * grow * wobble;
          if (step) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
      });
    });
    ctx.globalAlpha = 1;
  }

  // Dashed arcs between works in different areas whose text reads alike.
  drawLinks(alpha, lit) {
    const { ctx, colours } = this;
    for (const [a, b] of this.links) {
      if (!this.shown(a) || !this.shown(b)) continue;
      const p = this.live[a];
      const q = this.live[b];
      const ends = [this.hover, this.highlight];
      const active = ends.includes(a) || ends.includes(b);
      const mx = (p.x + q.x) / 2;
      const my = (p.y + q.y) / 2;
      ctx.strokeStyle = active
        ? withAlpha(colours.accent, 0.85)
        : withAlpha(colours.ink, (lit ? 0.06 : 0.16) * alpha);
      ctx.lineWidth = active ? 1.5 : 1;
      ctx.setLineDash(active ? [] : [3, 4]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(mx - (q.y - p.y) * 0.18, my + (q.x - p.x) * 0.18, q.x, q.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
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

  // Area names in spaced capitals at each island's centre, on two lines
  // when long.
  drawAreaNames(alpha, lit) {
    const { ctx, colours, data } = this;
    this.areaRects = [];
    if (this.options.labels === "none" || !alpha) return;
    const size = this.nameSize();
    ctx.font = `500 ${size}px "IBM Plex Mono", monospace`;
    ctx.textBaseline = "middle";
    this.areaRects = data.areas.map((area, a) => {
      const lines = this.nameLines(area);
      const [cx, cy] = this.centres[a];
      const width = Math.max(...lines.map((line) => spaced(ctx, line))) + 16;
      const height = lines.length * (size + 4) + 10;
      const dim = lit && !this.members[a].some((w) => lit.has(w));
      ctx.globalAlpha = alpha * (dim ? 0.4 : 1);
      ctx.fillStyle = withAlpha(colours.bg, 0.82);
      roundRect(ctx, cx - width / 2, cy - height / 2, width, height, 6);
      ctx.fill();
      ctx.strokeStyle = withAlpha(colours.area[a], this.hoverArea === a ? 0.9 : 0.45);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = this.hoverArea === a ? colours.ink : colours.ink2;
      lines.forEach((line, i) => spaced(ctx, line, cx, cy + (i - (lines.length - 1) / 2) * (size + 4)));
      return [cx - width / 2, cy - height / 2, width, height];
    });
    ctx.globalAlpha = 1;
  }

  // Work names sit outside the orbit, on the side the work faces. Each
  // label tries eight spots, then four more two rows out, and slides sideways
  // to stay in the plot; the most hemmed-in labels are placed first, and none
  // covers a node or a name.
  drawWorkNames(alpha, lit) {
    const { ctx, colours, data } = this;
    if (!alpha) return;
    const full = this.options.labels !== "none" && this.box.w >= 420;
    const size = Math.round(12.5 * Math.max(0.9, this.unit));
    ctx.font = `600 ${size}px "IBM Plex Sans", sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    // Labels stay clear of the hero text to the plot's left.
    const left = Math.max(2, this.box.x - 20);
    const overlaps = ([x, y, w, h], [ox, oy, ow, oh]) =>
      !(x + w < ox - 2 || ox + ow < x - 2 || y + h < oy - 1 || oy + oh < y - 1);
    const nodeRects = this.live.map(({ x, y }) => [x - 9, y - 9, 18, 18]);
    const fixed = [...this.areaRects];

    const wanted = data.works
      .map((work, w) => ({ work, w, active: w === this.hover || w === this.highlight }))
      .filter(({ w, active }) => this.shown(w) && (full || active))
      .map((item) => {
        const { work, w } = item;
        const node = this.live[w];
        const [cx, cy] = this.centres[work.area];
        const width = ctx.measureText(work.short).width + 12;
        const height = size + 9;
        const gap = 12;
        const side = node.x - cx >= -4 ? 1 : -1;
        const below = node.y >= cy;
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
          .filter((rect) => nodeRects.every((other, n) => n === w || !overlaps(rect, other)));
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

  areaAt(x, y) {
    return this.areaRects.findIndex(([rx, ry, rw, rh]) => x >= rx && x <= rx + rw && y >= ry && y <= ry + rh);
  }

  bindEvents() {
    const canvas = this.canvas;
    const local = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    canvas.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const { x, y } = local(event);
      const work = this.nearest(x, y);
      this.hoverArea = work < 0 ? this.areaAt(x, y) : -1;
      canvas.style.cursor = work >= 0 ? "pointer" : "";
      this.setHover(work);
      this.requestDraw();
    });
    canvas.addEventListener("pointerleave", () => {
      this.hoverArea = -1;
      this.setHover(-1);
      this.requestDraw();
    });
    canvas.addEventListener("click", (event) => {
      const { x, y } = local(event);
      const work = this.nearest(x, y, event.pointerType === "touch" ? 26 : 18);
      if (work < 0) {
        this.setHover(-1);
        return;
      }
      // On touch, the first tap shows the work and the second opens it.
      if (event.pointerType === "touch" && this.hover !== work) {
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

export function showTooltip(tooltip, view, w, touch) {
  if (!tooltip) return;
  if (w < 0) {
    tooltip.classList.remove("on");
    return;
  }
  const work = view.data.works[w];
  const area = view.data.areas[work.area].name;
  tooltip.innerHTML = `<b><i style="background:${view.colours.area[work.area]}"></i>${escape(area)} · ${escape(kindLabel[work.kind])}</b><strong>${escape(work.title)}</strong><span>${escape(clip(work.summary, 150))}</span><small>${work.meta ? `${escape(work.meta)}. ` : ""}${touch ? "Tap again to open." : "Click to open."}</small>`;
  const parent = tooltip.offsetParent || tooltip.parentElement;
  const bounds = parent.getBoundingClientRect();
  const canvasBounds = view.canvas.getBoundingClientRect();
  const node = view.live[w];
  const x = node.x + canvasBounds.left - bounds.left;
  const y = node.y + canvasBounds.top - bounds.top;
  tooltip.classList.add("on");
  const width = tooltip.offsetWidth;
  const height = tooltip.offsetHeight;
  const left = x + 22 + width > bounds.width ? x - width - 22 : x + 22;
  const top = Math.min(Math.max(8, y - height / 2), bounds.height - height - 8);
  tooltip.style.transform = `translate3d(${Math.max(8, left)}px, ${top}px, 0)`;
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

export function mulberry(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
