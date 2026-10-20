// A seeded force layout for the map of work in assets/data/map.json: the
// domain hubs stay where the build put them, and the works settle between the
// hubs they belong to. Pure, with no DOM, so src/map.js draws from it in the
// browser and scripts/render-social-card.mjs runs it in Node.

export function mulberry(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pushes hubs apart horizontally until no two name boxes overlap, then keeps
// every hub at least half its box inside the plot.
function nudgeApart(hubs, boxes, box) {
  for (let pass = 0; pass < 50; pass++) {
    let moved = false;
    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        const needX = (boxes[i].w + boxes[j].w) / 2 + 8;
        const needY = (boxes[i].h + boxes[j].h) / 2 + 8;
        const dx = hubs[j].x - hubs[i].x;
        const dy = hubs[j].y - hubs[i].y;
        if (Math.abs(dx) >= needX || Math.abs(dy) >= needY) continue;
        const push = (needX - Math.abs(dx)) / 2;
        const sign = dx >= 0 ? 1 : -1;
        hubs[i].x -= push * sign;
        hubs[j].x += push * sign;
        moved = true;
      }
    }
    if (!moved) break;
  }
  hubs.forEach((hub, i) => {
    hub.x = Math.min(box.x + box.w - boxes[i].w / 2, Math.max(box.x + boxes[i].w / 2, hub.x));
    hub.y = Math.min(box.y + box.h - boxes[i].h / 2, Math.max(box.y + boxes[i].h / 2, hub.y));
  });
}

export function createGraph(data, box, { seed = 7, hubBoxes = null } = {}) {
  const unit = Math.max(0.45, Math.min(1.25, Math.min(box.w, box.h) / 620));
  const random = mulberry(seed);
  const hubs = data.areas.map((area) => ({
    x: box.x + area.x * box.w,
    y: box.y + area.y * box.h,
    r: (6 + 1.2 * area.size) * Math.max(0.75, unit),
  }));
  if (hubBoxes) nudgeApart(hubs, hubBoxes, box);

  // Each work starts at the weighted middle of its homes, nudged by the seed
  // so works sharing the same homes do not sit on top of each other.
  const starts = data.works.map((work) => {
    const total = work.homes.reduce((sum, [, weight]) => sum + weight, 0);
    const x = work.homes.reduce((sum, [a, weight]) => sum + hubs[a].x * weight, 0) / total;
    const y = work.homes.reduce((sum, [a, weight]) => sum + hubs[a].y * weight, 0) / total;
    return [x + (random() - 0.5) * 60 * unit, y + (random() - 0.5) * 60 * unit];
  });
  const nodes = starts.map(([x, y]) => ({ x, y, vx: 0, vy: 0, pinned: false }));

  const springs = [];
  data.works.forEach((work, w) => {
    for (const [a, weight] of work.homes) {
      springs.push({ hub: a, node: w, rest: (84 + 70 * (1 - weight)) * unit, k: 0.03 });
    }
    for (const n of work.links) {
      if (n > w) springs.push({ a: w, b: n, rest: 170 * unit, k: 0.005 });
    }
  });

  const inset = 12 + 20 * unit;
  const centre = [box.x + box.w / 2, box.y + box.h / 2];
  const clamp = (node) => {
    node.x = Math.min(box.x + box.w - inset, Math.max(box.x + inset, node.x));
    node.y = Math.min(box.y + box.h - inset, Math.max(box.y + inset, node.y));
  };

  const graph = {
    hubs,
    nodes,
    heat: 0,
    start() {
      nodes.forEach((node, w) => {
        [node.x, node.y] = starts[w];
        node.vx = node.vy = 0;
      });
      graph.heat = 1;
      return nodes;
    },
    step() {
      if (graph.heat <= 0) return 0;
      const force = nodes.map(() => [0, 0]);
      const scale = unit * unit;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d2 = dx * dx + dy * dy + 60;
          const d = Math.sqrt(d2);
          const k = (9000 * scale) / d2;
          force[i][0] -= (dx / d) * k;
          force[i][1] -= (dy / d) * k;
          force[j][0] += (dx / d) * k;
          force[j][1] += (dy / d) * k;
        }
        for (const hub of hubs) {
          const dx = nodes[i].x - hub.x;
          const dy = nodes[i].y - hub.y;
          const d2 = dx * dx + dy * dy + 60;
          const d = Math.sqrt(d2);
          const k = (12000 * scale) / d2;
          force[i][0] += (dx / d) * k;
          force[i][1] += (dy / d) * k;
        }
        force[i][0] += (centre[0] - nodes[i].x) * 0.004;
        force[i][1] += (centre[1] - nodes[i].y) * 0.004;
      }
      for (const spring of springs) {
        const from = "hub" in spring ? hubs[spring.hub] : nodes[spring.a];
        const to = "hub" in spring ? nodes[spring.node] : nodes[spring.b];
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        const d = Math.hypot(dx, dy) || 1;
        const k = (d - spring.rest) * spring.k;
        const target = "hub" in spring ? spring.node : spring.b;
        force[target][0] += (dx / d) * k;
        force[target][1] += (dy / d) * k;
        if (!("hub" in spring)) {
          force[spring.a][0] -= (dx / d) * k;
          force[spring.a][1] -= (dy / d) * k;
        }
      }
      nodes.forEach((node, i) => {
        if (node.pinned) {
          node.vx = node.vy = 0;
          return;
        }
        node.vx = (node.vx + force[i][0] * 0.5 * graph.heat) * 0.6;
        node.vy = (node.vy + force[i][1] * 0.5 * graph.heat) * 0.6;
        node.x += node.vx;
        node.y += node.vy;
        clamp(node);
      });
      graph.heat = Math.max(0, graph.heat - 0.006);
      return graph.heat;
    },
    settle() {
      for (let steps = 0; graph.heat > 0 && steps < 600; steps++) graph.step();
      return nodes;
    },
    pin(w, x, y) {
      nodes[w].pinned = true;
      nodes[w].x = x;
      nodes[w].y = y;
      nodes[w].vx = nodes[w].vy = 0;
      graph.heat = Math.max(graph.heat, 0.5);
    },
    release(w) {
      nodes[w].pinned = false;
    },
    reheat(h = 0.5) {
      graph.heat = Math.max(graph.heat, h);
    },
  };
  graph.start();
  return graph;
}
