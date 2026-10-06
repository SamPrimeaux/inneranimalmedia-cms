import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { editorialAtlasItems } from "../src/editorial-atlas.js";
import { EDITORIAL_SCENES } from "../../../apps/editorial-commons/src/portable/scene-manifest.js";

const root = resolve(import.meta.dirname, "../../..");
const output = resolve(root, "examples/revise-foundation/public/library/evidence/editorial-commons");

describe("merged Editorial Commons source-backed Design Atlas", () => {
  it("exposes all original sections, support modules, and multipage routes as distinct records", () => {
    expect(EDITORIAL_SCENES).toHaveLength(39);
    expect(editorialAtlasItems).toHaveLength(41);
    expect(new Set(editorialAtlasItems.map((item) => item.id)).size).toBe(41);
    expect(editorialAtlasItems.filter((item) => item.kind === "page").length).toBeGreaterThanOrEqual(5);
    expect(editorialAtlasItems.filter((item) => item.kind === "section").length).toBeGreaterThanOrEqual(20);
    expect(editorialAtlasItems.some((item) => item.id === "commons-gallery")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-fieldwork-hero")).toBe(true);
    expect(editorialAtlasItems.every((item) => item.sourcePath.startsWith("apps/editorial-commons/"))).toBe(true);
  });
  it("mounts actual built index and source-image assets instead of dead placeholder URLs", () => {
    const html = readFileSync(resolve(output, "index.html"), "utf8");
    expect(html).toContain("/library/evidence/editorial-commons/assets/");
    for (const item of editorialAtlasItems) {
      expect(item.previewUrl).toContain("/library/evidence/editorial-commons/index.html?");
      const source = resolve(root, item.sourcePath);
      expect(existsSync(source)).toBe(true);
    }
    expect(existsSync(resolve(output, "assets"))).toBe(true);
  });
});
