import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import atlas from "../src/design-atlas.json";
import { sectionCatalog } from "../src/site-data.js";

const publicDir = resolve(import.meta.dirname, "../public");
const items = atlas.items;

describe("Design Atlas evidence mounts", () => {
  it("indexes the source-backed design families without pretending legacy snippets are packages", () => {
    const counts = Object.fromEntries(["theme", "section", "palette", "lab", "template"].map((kind) =>
      [kind, items.filter((item) => item.kind === kind).length]));
    expect(counts).toMatchObject({ theme: 8, section: 5, palette: 7, lab: 5, template: 2 });
    expect(items.filter((item) => item.kind === "section").every(
      (item) => item.maturity === "needs normalization",
    )).toBe(true);
    expect(sectionCatalog.length).toBeGreaterThanOrEqual(24);
  });
  it("has unique paths with a real, locally mounted index file for each visual record", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    for (const item of items) {
      expect(item.previewUrl).toMatch(/^\/library\/evidence\/[a-z0-9_/-]+\/index\.html$/);
      expect(existsSync(resolve(publicDir, "." + item.previewUrl))).toBe(true);
      expect(item.sourceRepo).toMatch(/^SamPrimeaux\//);
      expect(item.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
      expect(item.sourcePath).not.toContain("..");
    }
  });
  it("exposes actual standalone HTML pages, not invented route names", () => {
    const pages = items.filter((item) => item.kind === "theme").flatMap((item) => item.pages);
    expect(pages.length).toBeGreaterThanOrEqual(30);
    for (const page of pages) {
      expect(page.path).toMatch(/^\/library\/evidence\/themes\/[a-z0-9-]+\/.+\.html$/);
      expect(existsSync(resolve(publicDir, "." + page.path))).toBe(true);
    }
  });
  it("preserves the independent current Revise catalog and donor provenance", () => {
    const sources = atlas.sourceCommits as Record<string, string>;
    expect(Object.keys(sources)).toEqual(expect.arrayContaining([
      "agentsam-sdk", "inneranimalmedia", "AgentSam-BrowserShell",
    ]));
    expect(items.filter((item) => item.kind === "theme").every(
      (item) => item.sourcePath.startsWith("packages/theme-")),
    ).toBe(true);
    expect(items.filter((item) => item.kind === "palette").every(
      (item) => item.importMethod === "tokens + comparison harness",
    )).toBe(true);
  });
});
