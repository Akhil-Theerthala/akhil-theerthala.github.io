import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const inject = path.join(projectRoot, "build/react-inject.js");

const common = {
  bundle: true,
  format: "iife",
  inject: [inject],
  minify: true,
  sourcemap: false,
  target: ["es2020"],
  logLevel: "info",
};

export async function buildSite() {
  await Promise.all([
    build({
      ...common,
      entryPoints: [path.join(projectRoot, "build/portfolio-entry.jsx")],
      outfile: path.join(projectRoot, "assets/js/portfolio.js"),
    }),
    build({
      ...common,
      entryPoints: [path.join(projectRoot, "build/writing-entry.jsx")],
      outfile: path.join(projectRoot, "assets/js/writing.js"),
    }),
  ]);
}

await buildSite();
