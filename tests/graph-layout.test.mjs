import test from "node:test";
import assert from "node:assert/strict";
import { createGraph } from "../src/graph-layout.js";

const data = {
  areas: [{ x: 0.2, y: 0.5, size: 2 }, { x: 0.8, y: 0.5, size: 2 }, { x: 0.5, y: 0.1, size: 1 }],
  works: [
    { homes: [[0, 1]], links: [] },
    { homes: [[0, 0.7], [1, 0.3]], links: [3] },
    { homes: [[1, 1]], links: [] },
    { homes: [[2, 1]], links: [1] },
  ],
};
const box = { x: 0, y: 0, w: 620, h: 620 };

test("the same data, box and seed settle to the same picture", () => {
  const a = createGraph(data, box).settle().map(({ x, y }) => [x, y]);
  const b = createGraph(data, box).settle().map(({ x, y }) => [x, y]);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, createGraph(data, box, { seed: 8 }).settle().map(({ x, y }) => [x, y]));
});

test("hubs sit at their plot positions and scale their core with size", () => {
  const graph = createGraph(data, box);
  assert.deepEqual(graph.hubs.map(({ x, y }) => [x, y]), [[124, 310], [496, 310], [310, 62]]);
  assert.equal(graph.hubs[0].r, 6 + 1.2 * 2);
});

test("a two-home work rests nearer its heavier home, and every node stays in the box", () => {
  const graph = createGraph(data, box);
  const nodes = graph.settle();
  assert.equal(graph.heat, 0);
  const d = (n, h) => Math.hypot(nodes[n].x - graph.hubs[h].x, nodes[n].y - graph.hubs[h].y);
  assert.ok(d(1, 0) < d(1, 1));
  for (const node of nodes) {
    assert.ok(node.x >= box.x + 12 && node.x <= box.x + box.w - 12);
    assert.ok(node.y >= box.y + 12 && node.y <= box.y + box.h - 12);
  }
});

test("a pinned node stays put while the rest move, and moves again once released", () => {
  const graph = createGraph(data, box);
  graph.settle();
  graph.pin(0, 300, 300);
  const before = graph.nodes[2].x;
  graph.step();
  assert.deepEqual([graph.nodes[0].x, graph.nodes[0].y], [300, 300]);
  assert.notEqual(graph.nodes[2].x, before);
  graph.release(0);
  graph.settle();
  assert.notDeepEqual([graph.nodes[0].x, graph.nodes[0].y], [300, 300]);
});

const picture = (graph) => [...graph.nodes, ...graph.hubs].map(({ x, y }) => [x, y]);
const rest = (graph) => {
  let steps = 0;
  while (graph.heat > 0 && steps < 3000) {
    graph.step();
    steps += 1;
  }
  return steps;
};

test("a work dragged far away carries its neighbours, and all of it comes home", () => {
  const graph = createGraph(data, box);
  graph.settle();
  const settled = picture(graph);
  for (let step = 0; step < 60; step++) {
    graph.pin(1, 80 + step * 8, 560);
    graph.step();
  }
  const pulled = picture(graph);
  // Work 3 is linked to it and hub 0 is its heavier home: both follow.
  const moved = (i) => Math.hypot(pulled[i][0] - settled[i][0], pulled[i][1] - settled[i][1]);
  assert.ok(moved(3) > 2, "a linked work did not follow");
  assert.ok(moved(4) > 2, "the work's home hub did not follow");
  graph.release(1);
  // The frame loop runs while heat is above zero, so it has to end.
  assert.ok(rest(graph) < 600, "the graph took too long to come to rest");
  assert.equal(graph.heat, 0);
  assert.deepEqual(picture(graph), settled);
});

test("a hub can be dragged, takes its works with it, and comes home", () => {
  const graph = createGraph(data, box);
  graph.settle();
  const settled = picture(graph);
  for (let step = 0; step < 60; step++) {
    graph.pinHub(0, 124 + step * 4, 310 - step * 3);
    graph.step();
  }
  assert.ok(graph.hubPinned(0));
  assert.deepEqual([graph.hubs[0].x, graph.hubs[0].y], [124 + 59 * 4, 310 - 59 * 3]);
  // Work 0 lives only in hub 0, so it goes most of the way with it.
  const carried = Math.hypot(graph.nodes[0].x - settled[0][0], graph.nodes[0].y - settled[0][1]);
  assert.ok(carried > 120, `work 0 moved only ${carried.toFixed(0)}px`);
  graph.releaseHub(0);
  assert.ok(rest(graph) < 600);
  assert.deepEqual(picture(graph), settled);
});

test("a graph caught while it settles is settled first, so there is a home to return to", () => {
  const graph = createGraph(data, box);
  const settled = picture(createGraphSettled());
  graph.step();
  graph.pin(2, 100, 100);
  graph.release(2);
  rest(graph);
  assert.deepEqual(picture(graph), settled);
});

function createGraphSettled() {
  const graph = createGraph(data, box);
  graph.settle();
  return graph;
}

test("hub name boxes are nudged apart on a narrow plot", () => {
  const narrow = { x: 0, y: 0, w: 300, h: 300 };
  const close = { ...data, areas: [{ x: 0.45, y: 0.5, size: 1 }, { x: 0.55, y: 0.5, size: 1 }, { x: 0.5, y: 0.1, size: 1 }] };
  const graph = createGraph(close, narrow, { hubBoxes: [{ w: 120, h: 24 }, { w: 120, h: 24 }, { w: 80, h: 24 }] });
  assert.ok(Math.abs(graph.hubs[0].x - graph.hubs[1].x) >= 120 + 8);
});
