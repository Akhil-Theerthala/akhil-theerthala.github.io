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

test("a hub can be dragged with the mouse and comes back when let go", () => {
  const view = new MapView(canvas(800, 600), data, { animateIn: false, onOpen: () => true });
  const a = 3;
  const home = { x: view.hubs[a].x, y: view.hubs[a].y };
  view.canvas.fire("pointerdown", { clientX: home.x, clientY: home.y });
  view.canvas.fire("pointermove", { clientX: home.x + 90, clientY: home.y + 60 });
  assert.equal(view.dragHub, a);
  assert.deepEqual({ x: view.hubs[a].x, y: view.hubs[a].y }, { x: home.x + 90, y: home.y + 60 });
  view.canvas.fire("pointerup");
  assert.equal(view.dragHub, -1);
  view.graph.settle();
  assert.equal(view.graph.heat, 0);
  assert.deepEqual({ x: view.hubs[a].x, y: view.hubs[a].y }, home);
});

test("a finger drags a work, and taps preview it and then open it", () => {
  const opened = [];
  const hovered = [];
  const view = new MapView(canvas(800, 600), data, {
    animateIn: false,
    onOpen: (work) => (opened.push(work.short), true),
    onHover: (work, touch) => hovered.push([work, touch]),
  });
  const w = 9;
  const touch = { pointerType: "touch" };
  // A finger that lands on a work claims the gesture; one on empty map does not.
  let claimed = 0;
  const start = (x, y) => view.canvas.fire("touchstart", { touches: [{ clientX: x, clientY: y }], cancelable: true, preventDefault: () => (claimed += 1) });
  start(view.live[w].x, view.live[w].y);
  assert.equal(claimed, 1);
  start(4, 4);
  assert.equal(claimed, 1);
  // A hub's disc is claimed; its name under it is not, so a swipe that starts
  // on a name still scrolls the page.
  view.draw(0);
  const a = 3;
  start(view.hubs[a].x, view.hubs[a].y);
  assert.equal(claimed, 2);
  const [nx, ny, nw, nh] = view.areaRects[a];
  start(nx + nw / 2, ny + nh - 3);
  assert.equal(claimed, 2);

  // First tap shows the work, second opens it.
  view.canvas.fire("pointerdown", { ...at(view, w), ...touch });
  view.canvas.fire("pointerup", touch);
  assert.deepEqual(hovered.at(-1), [w, true]);
  assert.deepEqual(opened, []);
  view.canvas.fire("pointerdown", { ...at(view, w), ...touch });
  view.canvas.fire("pointerup", touch);
  assert.deepEqual(opened, [data.works[w].short]);

  // A drag moves it and opens nothing.
  const from = at(view, w);
  view.canvas.fire("pointerdown", { ...from, ...touch });
  view.canvas.fire("pointermove", { clientX: from.clientX + 60, clientY: from.clientY + 40, ...touch });
  assert.equal(view.dragging, w);
  assert.deepEqual([view.graph.nodes[w].x, view.graph.nodes[w].y], [from.clientX + 60, from.clientY + 40]);
  view.canvas.fire("pointerup", touch);
  assert.equal(view.dragging, -1);
  assert.equal(opened.length, 1);
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
