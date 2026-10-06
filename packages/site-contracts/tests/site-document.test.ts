import { describe, expect, it } from "vitest";
import { validateSiteDocument, type SiteDocument } from "../src/index.js";

const example: SiteDocument = {
  schemaVersion: 1, id: "demo", theme: "revise",
  brand: { name: "Neutral site", home: "/", description: "A portable brand" },
  header: {
    settings: { sticky: true, pill: true },
    announcement: { enabled: true, messages: ["New collection"] },
    blocks: [{ id: "brand", type: "brand", label: "Neutral site", href: "/" }],
  },
  footer: { settings: { background: "inverse", copyright: "Neutral site" }, blocks: [] },
  pages: [{ id: "home", path: "/", title: "Home", description: "Home page", sections: [] }],
};
describe("site document v1", () => {
  it("accepts a neutral, provider-independent website contract", () => {
    expect(validateSiteDocument(example)).toEqual([]);
  });
  it("accepts optional color tokens and rejects invalid CSS or unexpected design keys", () => {
    const doc = structuredClone(example);
    doc.design = { accent: "#4C6655", accentSoft: "#C0D3B2", canvas: "#F0EFE7" };
    expect(validateSiteDocument(doc)).toEqual([]);
    doc.design.accent = "url(javascript:alert(1))";
    expect(validateSiteDocument(doc)).toContain("Invalid site design token: accent");
    doc.design = { accent: "#123456", unknownToken: "#abcdef" } as typeof doc.design;
    expect(validateSiteDocument(doc)).toContain("Invalid site design token: unknownToken");
  });
  it("detects duplicate routes and duplicate section identifiers", () => {
    const broken = structuredClone(example);
    broken.pages[0].sections = [
      { id: "duplicate", type: "statement", preset: "revise/a", settings: {}, data: {} },
      { id: "duplicate", type: "statement", preset: "revise/a", settings: {}, data: {} },
    ];
    broken.pages.push({ ...structuredClone(broken.pages[0]), id: "second" });
    expect(validateSiteDocument(broken)).toEqual(expect.arrayContaining([
      expect.stringContaining("duplicate page path"),
      expect.stringContaining("duplicate section id"),
    ]));
  });
});
