import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

// The browser globals MapView touches, just enough to run its layout and
// pointer logic in Node. Drawing calls are no-ops.
globalThis.matchMedia = () => ({ matches: false });
globalThis.getComputedStyle = () => ({ getPropertyValue: () => "#808080" });
globalThis.ResizeObserver = class { observe() {} };
globalThis.IntersectionObserver = class { observe() {} };
globalThis.addEventListener = () => {};
globalThis.requestAnimationFrame = () => 1;
globalThis.devicePixelRatio = 1;
globalThis.document = { documentElement: { dataset: { root: "", page: "home" } }, addEventListener() {} };

function canvas(width, height) {
  const listeners = {};
  const ctx = new Proxy(
    { textAlign: "left" },
    {
      get: (target, key) =>
        key === "measureText"
          ? (text) => ({ width: text.length * 7 })
          : key === "createRadialGradient"
            ? () => ({ addColorStop() {} })
            : key in target
              ? target[key]
              : () => {},
      set: (target, key, value) => {
        target[key] = value;
        return true;
      },
    },
  );
  return {
    width,
    height,
    style: {},
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height }),
    addEventListener: (type, fn) => (listeners[type] ||= []).push(fn),
    setPointerCapture() {},
    fire(type, init = {}) {
      for (const fn of listeners[type] || []) fn({ pointerType: "mouse", button: 0, buttons: 1, pointerId: 1, ...init });
    },
  };
}

const { MapView, showTooltip, showAreaTooltip } = await import("../src/map.js");
const data = JSON.parse(fs.readFileSync("assets/data/map.json", "utf8"));
const at = (view, w) => ({ clientX: view.live[w].x, clientY: view.live[w].y });

test("a cancelled drag does not swallow the next click", () => {
  const opened = [];
  const view = new MapView(canvas(800, 600), data, { animateIn: false, onOpen: (work) => (opened.push(work.short), true) });
  const [a, b] = [0, 1];
  view.canvas.fire("pointerdown", at(view, a));
  view.canvas.fire("pointermove", { clientX: view.live[a].x + 30, clientY: view.live[a].y + 30 });
  view.canvas.fire("pointercancel");
  view.canvas.fire("click", at(view, b));
  assert.deepEqual(opened, [data.works[b].short]);
});

test("a finished drag swallows only the click that ends it", () => {
  const opened = [];
  const view = new MapView(canvas(800, 600), data, { animateIn: false, onOpen: (work) => (opened.push(work.short), true) });
  const [a, b] = [0, 1];
  view.canvas.fire("pointerdown", at(view, a));
  view.canvas.fire("pointermove", { clientX: view.live[a].x + 30, clientY: view.live[a].y + 30 });
  view.canvas.fire("pointerup");
  view.canvas.fire("click", at(view, a));
  assert.deepEqual(opened, []);
  view.canvas.fire("click", at(view, b));
  assert.deepEqual(opened, [data.works[b].short]);
});

test("the mini map cannot be dragged", () => {
  const view = new MapView(canvas(300, 300), data, { animateIn: false, labels: "none", drag: false, onOpen: () => true });
  const w = 2;
  const before = { x: view.graph.nodes[w].x, y: view.graph.nodes[w].y };
  view.canvas.fire("pointerdown", at(view, w));
  view.canvas.fire("pointermove", { clientX: view.live[w].x + 40, clientY: view.live[w].y + 40 });
  view.canvas.fire("pointerup");
  assert.equal(view.graph.nodes[w].pinned, false);
  assert.deepEqual({ x: view.graph.nodes[w].x, y: view.graph.nodes[w].y }, before);
  assert.equal(view.dragging, -1);
});

const fakeTooltip = () => {
  const classes = new Set(["on"]);
  return { classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c), contains: (c) => classes.has(c) } };
};

test("hiding one kind of tooltip leaves the other kind showing", () => {
  let tooltip = fakeTooltip();
  showTooltip(tooltip, { hoverArea: 2 }, -1);
  assert.ok(tooltip.classList.contains("on"), "a hub tooltip survives the work tooltip's hide");
  tooltip = fakeTooltip();
  showTooltip(tooltip, { hoverArea: -1 }, -1);
  assert.ok(!tooltip.classList.contains("on"), "with no hub hovered the work tooltip hides");
  tooltip = fakeTooltip();
  showAreaTooltip(tooltip, { hover: 3 }, -1);
  assert.ok(tooltip.classList.contains("on"), "a work tooltip survives the hub tooltip's hide");
  tooltip = fakeTooltip();
  showAreaTooltip(tooltip, { hover: -1 }, -1);
  assert.ok(!tooltip.classList.contains("on"), "with no work hovered the hub tooltip hides");
});
