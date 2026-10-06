import { describe, expect, it } from "vitest";
import {
  assertRendererLock, bindSiteDocument, validateContentEntry,
  type ContentDefinition, type ContentEntry, type SiteBindingPlan, type SiteDocument,
} from "../src/index.js";

const definitions: ContentDefinition[] = [
  { id: "restoration-project", version: 1, fields: [
    { key: "title", type: "text", required: true },
    { key: "summary", type: "richtext", required: true },
    { key: "cover", type: "asset", required: true },
    { key: "milestones", type: "entry", referenceType: "milestone", list: true },
  ] },
  { id: "milestone", version: 1, fields: [{ key: "title", type: "text", required: true }] },
];
const original: ContentEntry = {
  id: "restoration:helicopter-01", definitionId: "restoration-project", definitionVersion: 1,
  fields: {
    title: "Helicopter restoration", summary: "Rebuilding a classic aircraft",
    cover: { kind: "asset", key: "aircraft/cover-original" },
    milestones: [{ kind: "entry", id: "milestone:one", type: "milestone" }],
  },
};
const milestone: ContentEntry = {
  id: "milestone:one", definitionId: "milestone", definitionVersion: 1,
  fields: { title: "First inspection" },
};
const site: SiteDocument = {
  schemaVersion: 1, id: "sample", theme: "revise",
  brand: { name: "Sample", home: "/", description: "Test" },
  header: { settings: { sticky: true, pill: false }, announcement: { enabled: false, messages: [] }, blocks: [] },
  footer: { settings: { background: "inverse", copyright: "Sample" }, blocks: [] },
  pages: [
    { id: "homepage", path: "/", title: "Home", description: "", sections: [
      { id: "teaser", type: "revise.featured-project", preset: "teaser", settings: {}, data: { title: "old default", mediaKey: "" } },
    ] },
    { id: "story", path: "/work/helicopter", title: "Project", description: "", sections: [
      { id: "hero", type: "revise.cinematic-hero", preset: "original", settings: {}, data: { title: "", summary: "", mediaKey: "" } },
      { id: "card-deck", type: "revise.sticky-story", preset: "original", settings: {}, data: { title: "" } },
    ] },
  ],
};
const plan: SiteBindingPlan = { schema: "iam.cms.bindings.v1", siteId: "sample", sections: [
  { pageId: "homepage", sectionId: "teaser", slots: [
    { slot: "title", entryId: original.id, field: "title" },
    { slot: "mediaKey", entryId: original.id, field: "cover", project: "asset-key" },
  ] },
  { pageId: "story", sectionId: "hero", slots: [
    { slot: "title", entryId: original.id, field: "title" },
    { slot: "summary", entryId: original.id, field: "summary" },
    { slot: "mediaKey", entryId: original.id, field: "cover", project: "asset-key" },
  ] },
  { pageId: "story", sectionId: "card-deck", slots: [
    { slot: "title", entryId: original.id, field: "title" },
  ] },
] };

describe("Shopify-like content / presentation independence", () => {
  it("binds one typed entry into three distinct designs without mutating source or geometry", () => {
    const bound = bindSiteDocument(site, plan, [original, milestone], definitions);
    expect(bound.pages[0].sections[0].data.title).toBe("Helicopter restoration");
    expect(bound.pages[1].sections[0].data.mediaKey).toBe("aircraft/cover-original");
    expect(bound.pages[1].sections[1].data.title).toBe("Helicopter restoration");
    expect(bound.pages[1].sections[1].type).toBe("revise.sticky-story");
    expect(site.pages[0].sections[0].data.title).toBe("old default");
    expect(site.pages[1].sections[0].data.title).toBe("");
  });
  it("updating content changes all views, not section defaults or design names", () => {
    const revised: ContentEntry = { ...original, fields: { ...original.fields, title: "Flight-ready restoration" } };
    const next = bindSiteDocument(site, plan, [revised, milestone], definitions);
    expect(next.pages.flatMap((p) => p.sections).map((s) => s.data.title)).toEqual([
      "Flight-ready restoration", "Flight-ready restoration", "Flight-ready restoration",
    ]);
    expect(site.pages[0].sections[0].type).toBe(next.pages[0].sections[0].type);
  });
  it("fails closed for invalid types, missing content, and incompatible media projections", () => {
    expect(() => validateContentEntry({ ...original, fields: { ...original.fields, title: 42 } }, definitions[0])).toThrow();
    expect(() => validateContentEntry({ ...original, fields: { ...original.fields, milestones: [{ kind: "entry", id: "x", type: "wrong" }] } }, definitions[0])).toThrow();
    expect(() => bindSiteDocument(site, plan, [milestone], definitions)).toThrow("Missing content entry");
    const broken = structuredClone(plan);
    broken.sections[0].slots[1].field = "title";
    expect(() => bindSiteDocument(site, broken, [original,milestone], definitions)).toThrow("Expected AssetRef");
  });
  it("requires exact pinned renderer integrity before publication", () => {
    const valid = { id: "revise.sticky-story", package: "@inneranimalmedia/revise-theme", version: "1.0.0",
      integrity: "sha256-" + "a".repeat(64), supportedOverrides: ["colorScheme"] };
    expect(() => assertRendererLock(valid)).not.toThrow();
    expect(() => assertRendererLock({ ...valid, version: "latest" })).toThrow();
    expect(() => assertRendererLock({ ...valid, integrity: "" })).toThrow();
  });
});
