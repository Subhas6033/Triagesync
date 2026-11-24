import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { parse } from "@babel/parser";

const root = resolve("src");
function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? filesIn(resolve(directory, entry.name))
      : [resolve(directory, entry.name)],
  );
}
const files = filesIn(root).filter((file) =>
  [".js", ".jsx"].includes(extname(file)),
);
const graph = new Map();
for (const file of files) {
  const source = readFileSync(file, "utf8");
  const ast = parse(source, { sourceType: "module", plugins: ["jsx"] });
  const imports = ast.program.body.filter(
    (node) =>
      node.type === "ImportDeclaration" && node.source.value.startsWith("."),
  );
  graph.set(
    file,
    imports.map((node) => {
      const target = resolve(dirname(file), node.source.value);
      return [
        target,
        `${target}.js`,
        `${target}.jsx`,
        `${target}/index.js`,
      ].find(existsSync);
    }),
  );
}
test("all source modules contain implementations and all relative imports resolve", () => {
  for (const file of files) {
    assert.ok(readFileSync(file, "utf8").trim(), `Empty source: ${file}`);
    assert.ok(graph.get(file).every(Boolean), `Broken import: ${file}`);
  }
});
test("source imports have no circular dependencies", () => {
  function visit(file, stack = [], visited = new Set()) {
    assert.ok(
      !stack.includes(file),
      `Circular imports: ${[...stack, file].join(" -> ")}`,
    );
    if (visited.has(file)) return;
    for (const dependency of graph.get(file) || [])
      visit(dependency, [...stack, file], visited);
    visited.add(file);
  }
  const visited = new Set();
  for (const file of files) visit(file, [], visited);
});
test("route pages do not import API services or query infrastructure", () => {
  for (const file of files.filter((file) =>
    file.startsWith(resolve(root, "pages")),
  )) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(
      source,
      /from\s+["'][^"']*(?:\.api|axios|@tanstack\/react-query)/,
      file,
    );
  }
});
