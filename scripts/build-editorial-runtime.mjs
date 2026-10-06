import { copyFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
execFileSync(resolve(root, "apps/editorial-commons/node_modules/.bin/vite"),
  ["build", "--config", "vite.publish.config.ts"],
  { cwd: resolve(root, "apps/editorial-commons"), stdio: "inherit" });
for (const target of [
  "studio/public/cms/editorial",
  "examples/revise-foundation/public/cms/editorial",
]) {
  mkdirSync(resolve(root, target), { recursive: true });
  for (const name of ["editorial-runtime.js", "editorial-runtime.css"]) {
    copyFileSync(resolve(root, "integration/host-adapters/editorial-assets", name),
      resolve(root, target, name));
  }
}
console.log("Editorial runtime assets installed into studio and CMS example public roots.");
