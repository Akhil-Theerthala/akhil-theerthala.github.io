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

test("hub name boxes are nudged apart on a narrow plot", () => {
  const narrow = { x: 0, y: 0, w: 300, h: 300 };
  const close = { ...data, areas: [{ x: 0.45, y: 0.5, size: 1 }, { x: 0.55, y: 0.5, size: 1 }, { x: 0.5, y: 0.1, size: 1 }] };
  const graph = createGraph(close, narrow, { hubBoxes: [{ w: 120, h: 24 }, { w: 120, h: 24 }, { w: 80, h: 24 }] });
  assert.ok(Math.abs(graph.hubs[0].x - graph.hubs[1].x) >= 120 + 8);
});
