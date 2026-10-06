import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const app = resolve(root, "apps/editorial-commons");
const output = resolve(root, "examples/revise-foundation/public/library/evidence/editorial-commons");
if (!existsSync(resolve(app, "node_modules/.bin/vite"))) {
  throw new Error("Install the isolated editorial app dependencies first: npm ci --prefix apps/editorial-commons --ignore-scripts");
}
execFileSync("npm", [
  "run", "build",
  "--", "--base", "/library/evidence/editorial-commons/",
  "--outDir", output, "--emptyOutDir",
], { cwd: app, stdio: "inherit" });
const indexPath = resolve(output, "index.html");
const html = readFileSync(indexPath, "utf8").trimEnd() + "\n";
writeFileSync(indexPath, html);
if (!html.includes("/library/evidence/editorial-commons/assets/")) {
  throw new Error("Editorial built assets are not rooted at their CMS evidence URL.");
}
if (!readdirSync(resolve(output, "assets")).some((name) => name.endsWith(".js"))) {
  throw new Error("Editorial source build produced no executable preview.");
}
console.log("Editorial Commons source-backed snapshots updated: " + output);
