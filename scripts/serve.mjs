import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const host = "127.0.0.1";
const port = Number.parseInt(process.env.PORTFOLIO_PORT || "4173", 10);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
  [".pdf", "application/pdf"],
]);

function isInsideRoot(target) {
  return target === projectRoot || target.startsWith(`${projectRoot}${path.sep}`);
}

async function resolveRequest(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://local").pathname);
  let target = path.resolve(projectRoot, `.${pathname}`);
  if (!isInsideRoot(target)) return null;

  try {
    const stats = await fs.stat(target);
    if (stats.isDirectory()) target = path.join(target, "index.html");
  } catch {
    target = path.join(projectRoot, "404.html");
  }
  return target;
}

const server = http.createServer(async (request, response) => {
  try {
    const target = await resolveRequest(request.url || "/");
    if (!target) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    const body = await fs.readFile(target);
    const isNotFound = path.basename(target) === "404.html";
    response.writeHead(isNotFound ? 404 : 200, {
      "Content-Type": contentTypes.get(path.extname(target)) || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    if (request.method === "HEAD") response.end();
    else response.end(body);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Local preview error");
  }
});

server.listen(port, host, () => {
  console.log(`Portfolio available at http://${host}:${port}/`);
});
