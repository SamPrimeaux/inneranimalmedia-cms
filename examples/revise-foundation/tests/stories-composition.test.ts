import { describe, expect, it } from "vitest";
import { describePageComposition } from "@inneranimalmedia/site-contracts";
import { initialSite } from "../src/site-data.js";

describe("Project Stories composition integrity", () => {
  it("exposes all eight actual visual layers with correct ownership", () => {
    const layers = describePageComposition(initialSite, "stories");
    expect(layers.map((layer) => layer.kind)).toEqual([
      "announcement", "header", "page-masthead",
      "section", "section", "section", "section", "footer",
    ]);
    expect(layers.map((layer) => layer.owner)).toEqual([
      "site", "site", "page", "page", "page", "page", "page", "site",
    ]);
    expect(layers.filter((layer) => layer.renderer).map((layer) => layer.renderer)).toEqual([
      "revise/campaign-teaser",
      "revise/sticky-card-deck",
      "revise/full-bleed-grid",
      "revise/brand-film",
    ]);
    expect(layers.filter((layer) => !layer.independentlyEditable).map((layer) => layer.kind))
      .toEqual(["page-masthead"]);
  });
  it("preserves the actual source instance IDs and does not fabricate CMS rows", () => {
    const source = initialSite.pages.find((page) => page.id === "stories")!;
    const layers = describePageComposition(initialSite, "stories");
    expect(layers.filter((layer) => layer.sectionId).map((layer) => layer.sectionId))
      .toEqual(source.sections.map((section) => section.id));
    expect(layers.filter((layer) => layer.kind === "section").length)
      .toBe(source.sections.length);
    expect(describePageComposition(initialSite, "home").some((layer) =>
      layer.kind === "page-masthead")).toBe(false);
  });
  it("cannot claim a nonexistent page, and remains independent of the renderer DOM", () => {
    expect(() => describePageComposition(initialSite, "unknown")).toThrow("Unknown page");
    const layers = describePageComposition(initialSite, "stories");
    const hero = layers.find((layer) => layer.renderer === "revise/campaign-teaser");
    expect(hero?.source).toContain("stories");
    expect(hero?.id).toMatch(/^section:/);
  });
});
