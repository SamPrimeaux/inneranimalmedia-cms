import { describe, expect, it } from "vitest";
import { validateSiteDocument } from "@inneranimalmedia/site-contracts";
import { initialSite, sectionCatalog, siteMedia } from "../src/site-data.js";
import { renderSiteSection, presetLibraryFrom } from "@inneranimalmedia/section-library";
import { reviseShowcasePresets } from "@inneranimalmedia/revise-theme";

describe("FNF Revise multipage fixture", () => {
  it("builds five distinct navigable pages with valid portable sections", () => {
    expect(validateSiteDocument(initialSite)).toEqual([]);
    expect(initialSite.pages.map((page) => page.path)).toEqual([
      "/", "/products/", "/stories/", "/campaigns/", "/ideas/",
    ]);
    const presets = new Set(sectionCatalog.map((entry) => entry.id));
    for (const page of initialSite.pages) {
      expect(page.sections.length).toBeGreaterThan(0);
      expect(page.sections.every((section) => presets.has(section.preset))).toBe(true);
    }
  });
  it("renders every page's real sections without a runtime exception", () => {
    const presets = presetLibraryFrom(reviseShowcasePresets);
    for (const page of initialSite.pages) {
      const markup = page.sections.map((section) => renderSiteSection(section, {
        context: { theme: initialSite.theme, resolveMedia: (key) => siteMedia.get(key) ?? null },
        presets,
      })).join("");
      expect(markup).toContain('class="iam-site-section"');
      expect(markup).toContain('data-theme="revise"');
      expect(markup).not.toContain("undefined");
    }
  });
  it("does not preserve one-page product anchors in the reusable page data", () => {
    const raw = JSON.stringify(initialSite.pages);
    expect(raw).not.toContain('"href":"#fnf-products"');
    expect(raw).not.toContain('"href":"#fnf-stories"');
  });
});
