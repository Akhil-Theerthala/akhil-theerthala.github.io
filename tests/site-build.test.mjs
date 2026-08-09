import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");

test("pages load local production bundles without browser compilation", () => {
  const index = read("index.html");
  const writing = read("writing.html");

  for (const html of [index, writing]) {
    assert.doesNotMatch(
      html,
      /babel|react\.development|react-dom\.development/i,
    );
  }

  assert.match(index, /assets\/js\/portfolio\.js/);
  assert.match(writing, /assets\/js\/writing\.js/);
});

