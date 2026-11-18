// A seeded force layout for the map of work in assets/data/map.json. The
// resting picture has the domain hubs where the build put them and the works
// settled between the hubs they belong to. Once a reader takes hold of a hub
// or a work the graph is live: every body moves, and all of them come back to
// the resting picture when let go. Pure, with no DOM, so src/map.js draws
// from it in the browser and scripts/render-social-card.mjs runs it in Node.

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

// Live motion. Once a reader takes hold of the graph, every body is sprung to
// its place in the settled picture and to the bodies it is joined to, so a
// pull on one carries its neighbours and letting go brings all of them home.
const KEEP = 0.76; // the share of its speed a body keeps each step
const HOME = 0.012; // a work's spring to its settled place
const HUB_HOME = 0.045; // a hub's spring to its place on the plot
const HUB_MASS = 3;
const JOIN = 0.05; // a work to its heaviest home; lighter homes pull less
const LINK = 0.012; // a work to a work it is linked with
const BUMP = 0.2; // how hard two bodies that touch push apart

export function createGraph(data, box, { seed = 7, hubBoxes = null } = {}) {
  const unit = Math.max(0.45, Math.min(1.25, Math.min(box.w, box.h) / 620));
  const random = mulberry(seed);
  const hubs = data.areas.map((area) => ({
    x: box.x + area.x * box.w,
    y: box.y + area.y * box.h,
    r: (6 + 1.2 * area.size) * Math.max(0.75, unit),
  }));
  if (hubBoxes) nudgeApart(hubs, hubBoxes, box);
  // Motion state lives beside the hubs, so a hub stays a plain { x, y, r }.
  const hubState = hubs.map((hub) => ({ ax: hub.x, ay: hub.y, vx: 0, vy: 0, pinned: false }));

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
  const clamp = (body, by = inset) => {
    body.x = Math.min(box.x + box.w - by, Math.max(box.x + by, body.x));
    body.y = Math.min(box.y + box.h - by, Math.max(box.y + by, body.y));
  };

  // The push and pull on every work while the picture settles.
  function forces() {
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
    return force;
  }

  // The settled picture, which live motion is measured against.
  let rest = null;
  let live = false;
  let calm = 0;
  let age = 0;
  // Every body: the works first, then the hubs.
  const bodies = [
    ...nodes.map((node) => ({ at: node, state: node, mass: 1, home: HOME, by: inset, reach: 15 * unit })),
    ...hubs.map((hub, h) => ({ at: hub, state: hubState[h], mass: HUB_MASS, home: HUB_HOME * HUB_MASS, by: hub.r, reach: hub.r + 14 * unit })),
  ];
  const joins = [];
  data.works.forEach((work, w) => {
    for (const [a, weight] of work.homes) joins.push([w, nodes.length + a, JOIN * (0.4 + 0.6 * weight)]);
    for (const n of work.links) if (n > w) joins.push([w, n, LINK]);
  });
  const remember = () => {
    rest = bodies.map(({ at }) => [at.x, at.y]);
    // Two bodies may sit closer in the settled picture than they would be
    // let to come; that distance is then the closest they are pushed to.
    rest.gap = bodies.map((a, i) =>
      bodies.map((b, j) => Math.min(a.reach + b.reach, Math.hypot(rest[i][0] - rest[j][0], rest[i][1] - rest[j][1]))),
    );
  };
  // Taking hold of anything makes the graph live. A graph caught while it is
  // still settling is settled first, so there is a picture to come back to.
  const wake = () => {
    if (!live) {
      for (let steps = 0; graph.heat > 0 && steps < 600; steps++) settleStep();
      remember();
      live = true;
    }
    graph.heat = 1;
    calm = 0;
    age = 0;
  };

  // Settling: the works find their places while the hubs hold still.
  function settleStep() {
    const force = forces();
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
  }

  // Live: everything moves, for as long as it takes. It ends once nothing is
  // held and nothing is moving, which is the settled picture again.
  function liveStep() {
    // How far each body is from its settled place.
    const off = bodies.map(({ at }, i) => [at.x - rest[i][0], at.y - rest[i][1]]);
    const pull = bodies.map((body, i) => [-off[i][0] * body.home, -off[i][1] * body.home]);
    for (const [i, j, k] of joins) {
      const dx = (off[j][0] - off[i][0]) * k;
      const dy = (off[j][1] - off[i][1]) * k;
      pull[i][0] += dx;
      pull[i][1] += dy;
      pull[j][0] -= dx;
      pull[j][1] -= dy;
    }
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const dx = bodies[j].at.x - bodies[i].at.x;
        const dy = bodies[j].at.y - bodies[i].at.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const short = rest.gap[i][j] - d;
        if (short <= 0) continue;
        pull[i][0] -= (dx / d) * short * BUMP;
        pull[i][1] -= (dy / d) * short * BUMP;
        pull[j][0] += (dx / d) * short * BUMP;
        pull[j][1] += (dy / d) * short * BUMP;
      }
    }
    const top = 18 * unit;
    let fastest = 0;
    let held = false;
    bodies.forEach(({ at, state, mass, by }, i) => {
      if (state.pinned) {
        state.vx = state.vy = 0;
        held = true;
        return;
      }
      state.vx = (state.vx + pull[i][0] / mass) * KEEP;
      state.vy = (state.vy + pull[i][1] / mass) * KEEP;
      const speed = Math.hypot(state.vx, state.vy);
      if (speed > top) {
        state.vx *= top / speed;
        state.vy *= top / speed;
      }
      at.x += state.vx;
      at.y += state.vy;
      clamp(at, by);
      fastest = Math.max(fastest, Math.min(speed, top));
    });
    age += 1;
    const home = bodies.every(({ at }, i) => Math.hypot(at.x - rest[i][0], at.y - rest[i][1]) < 0.4);
    calm = !held && fastest < 0.03 && home ? calm + 1 : 0;
    if (held || (calm < 6 && age < 1500)) return;
    // At rest: close the last fraction of a pixel.
    bodies.forEach(({ at, state }, i) => {
      [at.x, at.y] = rest[i];
      state.vx = state.vy = 0;
    });
    graph.heat = 0;
  }

  const hold = (body, state, x, y, by) => {
    wake();
    state.pinned = true;
    body.x = x;
    body.y = y;
    clamp(body, by);
    state.vx = state.vy = 0;
  };
  const letGo = (state) => {
    state.pinned = false;
    if (live) wake();
  };

  const graph = {
    hubs,
    nodes,
    heat: 0,
    // Whether a reader has taken hold of the graph since it last settled.
    get live() {
      return live;
    },
    start() {
      nodes.forEach((node, w) => {
        [node.x, node.y] = starts[w];
        node.vx = node.vy = 0;
        node.pinned = false;
      });
      hubs.forEach((hub, h) => {
        Object.assign(hubState[h], { vx: 0, vy: 0, pinned: false });
        [hub.x, hub.y] = [hubState[h].ax, hubState[h].ay];
      });
      live = false;
      graph.heat = 1;
      return nodes;
    },
    step() {
      if (graph.heat <= 0) return 0;
      if (live) liveStep();
      else settleStep();
      return graph.heat;
    },
    settle() {
      for (let steps = 0; graph.heat > 0 && steps < 2400; steps++) graph.step();
      return nodes;
    },
    pin(w, x, y) {
      hold(nodes[w], nodes[w], x, y, 4);
    },
    release(w) {
      letGo(nodes[w]);
    },
    pinHub(a, x, y) {
      hold(hubs[a], hubState[a], x, y, hubs[a].r);
    },
    releaseHub(a) {
      letGo(hubState[a]);
    },
    hubPinned: (a) => hubState[a].pinned,
  };
  graph.start();
  return graph;
}
