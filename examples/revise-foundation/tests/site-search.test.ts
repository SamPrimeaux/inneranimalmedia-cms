import { describe, expect, it } from "vitest";
import { initialSite, refineFnfCopy } from "../src/site-data.js";
import { buildSiteSearchIndex, searchSite } from "../src/site-search.js";

describe("Revise site search", () => {
  const entries = buildSiteSearchIndex(initialSite);

  it("only indexes real pages, sections, and their documented collection items", () => {
    expect(entries.filter((entry) => entry.kind === "Page").map((entry) => entry.href)).toEqual([
      "/", "/products/", "/stories/", "/campaigns/", "/ideas/",
    ]);
    expect(entries.every((entry) => entry.href.startsWith("/"))).toBe(true);
    expect(entries.every((entry) => !entry.href.startsWith("//"))).toBe(true);
  });

  it("shows useful destinations before the visitor types", () => {
    expect(searchSite(entries, "").map((entry) => entry.href)).toEqual([
      "/products/", "/campaigns/", "/stories/", "/ideas/",
    ]);
  });

  it("returns a unique relevant campaign section, without spurious merchandise matches", () => {
    const matches = searchSite(entries, "High Octane");
    expect(matches[0].title).toBe("High Octane");
    expect(matches[0].kind).toBe("Section");
    expect(matches[0].href).toContain("/campaigns/#");
    expect(matches.filter((entry) => entry.title.toLowerCase() === "high octane")).toHaveLength(1);
    expect(matches.some((entry) => entry.title === "Heavyweight Tee")).toBe(false);
  });

  it("matches case-independent phrases and handles the empty-results state", () => {
    expect(searchSite(entries, "PROJECT STORIES").length).toBeGreaterThan(0);
    expect(searchSite(entries, "termthatdoesnotexist")).toEqual([]);
  });

  it("only refines untouched scaffolding copy, preserving user-written drafts", () => {
    const saved = structuredClone(initialSite);
    const section = saved.pages.find((page) => page.id === "campaigns")!.sections[0];
    section.data.heading = "My edited campaign headline";
    section.blocks![0].data.body = "My own campaign text";
    saved.pages.find((page) => page.id === "products")!.title = "My Custom Store";
    saved.header.announcement.messages = ["Existing assets + new directions", "My announcement"];
    refineFnfCopy(saved);
    expect(section.data.heading).toBe("My edited campaign headline");
    expect(section.blocks![0].data.body).toBe("My own campaign text");
    expect(saved.pages.find((page) => page.id === "products")!.title).toBe("My Custom Store");
    expect(saved.header.announcement.messages).toEqual(["Fuel hard. Live free.", "My announcement"]);
  });
});
