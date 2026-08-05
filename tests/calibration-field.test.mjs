import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

test("CalibrationField renders one inert decorative layer", () => {
  const source = fs.readFileSync("ambient-field.js", "utf8");
  const context = {
    React: {
      createElement(type, props, ...children) {
        return { type, props: props || {}, children };
      },
    },
    window: {},
  };

  vm.runInNewContext(source, context, { filename: "ambient-field.js" });

  assert.equal(typeof context.window.CalibrationField, "function");
  const element = context.window.CalibrationField();
  assert.equal(element.type, "div");
  assert.equal(element.props.className, "calibration-field");
  assert.equal(element.props["aria-hidden"], true);
  assert.equal(element.children.length, 0);
});
