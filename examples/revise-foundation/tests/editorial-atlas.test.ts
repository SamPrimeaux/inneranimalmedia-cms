import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { editorialAtlasItems } from "../src/editorial-atlas.js";
import { EDITORIAL_SCENES } from "../../../apps/editorial-commons/src/portable/scene-manifest.js";
import { fieldworkSite } from "../../../apps/editorial-commons/src/portable/fieldwork-site.js";
import { coveSite } from "../../../apps/editorial-commons/src/portable/cove-site.js";
import { validateSiteDocument } from "../../../packages/site-contracts/src/site-document.js";

const root = resolve(import.meta.dirname, "../../..");
const output = resolve(root, "examples/revise-foundation/public/library/evidence/editorial-commons");

describe("merged Editorial Commons source-backed Design Atlas", () => {
  it("validates genuinely separate customer content documents against one shared contract", () => {
    expect(validateSiteDocument(fieldworkSite)).toEqual([]);
    expect(validateSiteDocument(coveSite)).toEqual([]);
    expect(fieldworkSite.id).not.toBe(coveSite.id);
    expect(fieldworkSite.brand.name).not.toBe(coveSite.brand.name);
    expect(fieldworkSite.pages[0].sections.map((s) => s.preset))
      .toEqual(expect.arrayContaining(coveSite.pages[0].sections.map((s) => s.preset)));
    expect(fieldworkSite.design?.accent).not.toBe(coveSite.design?.accent);
  });

  it("exposes all original sections, support modules, and multipage routes as distinct records", () => {
    expect(EDITORIAL_SCENES).toHaveLength(39);
    expect(editorialAtlasItems).toHaveLength(51);
    expect(new Set(editorialAtlasItems.map((item) => item.id)).size).toBe(51);
    expect(editorialAtlasItems.filter((item) => item.kind === "page").length).toBeGreaterThanOrEqual(5);
    expect(editorialAtlasItems.filter((item) => item.kind === "section").length).toBeGreaterThanOrEqual(20);
    expect(editorialAtlasItems.some((item) => item.id === "commons-gallery")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-fieldwork-hero")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-fieldwork-wardrobe")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-fieldwork-diptych")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-fieldwork-statement")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-fieldwork-collection")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-fieldwork-lookbook")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-fieldwork-faq")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-cove-collection")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-cove-lookbook")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-cove-faq")).toBe(true);
    expect(editorialAtlasItems.some((item) => item.id === "commons-workbench")).toBe(true);
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
