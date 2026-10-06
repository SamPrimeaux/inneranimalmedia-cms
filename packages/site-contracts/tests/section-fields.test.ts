import { describe, expect, it } from "vitest";
import { applySectionFieldEdit, editableSectionFields } from "../src/section-fields.js";

describe("universal SiteDocument section content editing", () => {
  it("enumerates real content fields with type and stable order, without exposing arbitrary data", () => {
    const source = {
      tags: ["never flatten or discard"], heading: "A title", body: "A description",
      mediaKey: "photo.hero", ctaLabel: "Explore", ctaHref: "/stories/",
      count: 3, enabled: true, nested: { hidden: "not a field" },
      privateApiKey: "do-not-show",
    };
    const fields = editableSectionFields(source);
    expect(fields.map((item) => item.key)).toEqual([
      "heading", "body", "mediaKey", "ctaLabel", "ctaHref", "count", "enabled",
    ]);
    expect(fields.find((field) => field.key === "body")?.kind).toBe("long-text");
    expect(fields.find((field) => field.key === "mediaKey")?.kind).toBe("media");
    expect(fields.find((field) => field.key === "enabled")?.kind).toBe("boolean");
  });

  it("edits selected values in place and leaves the rest of the document unchanged", () => {
    const section = {
      heading: "Old heading", body: "Original copy", mediaKey: "existing.hero",
      ctaHref: "/original/", gallery: [{ id: "keep", title: "Untouched" }],
    };
    const before = structuredClone(section.gallery);
    expect(applySectionFieldEdit(section, "heading", "Interchangeable headline").ok).toBe(true);
    expect(applySectionFieldEdit(section, "body", "Edited customer copy").ok).toBe(true);
    expect(applySectionFieldEdit(section, "mediaKey", "new.hero", {
      mediaKeys: new Set(["existing.hero", "new.hero"]),
    }).ok).toBe(true);
    expect(section.heading).toBe("Interchangeable headline");
    expect(section.body).toBe("Edited customer copy");
    expect(section.mediaKey).toBe("new.hero");
    expect(section.gallery).toEqual(before);
    expect(section.ctaHref).toBe("/original/");
  });

  it("rejects nonexistent keys and unsafe destinations, including protocol-relative URLs", () => {
    const source = { href: "/stories/", mediaKey: "existing", heading: "Good" };
    for (const url of ["javascript:alert(1)", "//bad.invalid", "http://bad.invalid", "data:text/html,a"]) {
      expect(applySectionFieldEdit(source, "href", url)).toEqual({ ok: false, reason: "bad-url" });
    }
    expect(applySectionFieldEdit(source, "href", "/other/").ok).toBe(true);
    expect(applySectionFieldEdit(source, "href", "https://example.com/new").ok).toBe(true);
    expect(applySectionFieldEdit(source, "mediaKey", "unknown.asset", {
      mediaKeys: new Set(["existing"]),
    })).toEqual({ ok: false, reason: "bad-media-key" });
    expect(applySectionFieldEdit(source, "__proto__", "not allowed").ok).toBe(false);
    expect(applySectionFieldEdit(source, "hidden", "no").ok).toBe(false);
  });

  it("edits existing nested primary and secondary CTAs without allowing arbitrary paths", () => {
    const source = {
      heading: "Campaign",
      primaryAction: { label: "Preview", href: "/products/", style: "solid" },
      secondaryAction: { label: "Read more", href: "/stories/" },
      secretGroup: { label: "Must not be editable" },
    };
    const fields = editableSectionFields(source);
    expect(fields.map((field) => field.key)).toContain("primaryAction.href");
    expect(fields.map((field) => field.key)).toContain("secondaryAction.label");
    expect(fields.map((field) => field.key)).not.toContain("secretGroup.label");
    expect(applySectionFieldEdit(source, "primaryAction.label", "Explore collection").ok).toBe(true);
    expect(applySectionFieldEdit(source, "primaryAction.href", "/shop/").ok).toBe(true);
    expect(applySectionFieldEdit(source, "secondaryAction.href", "javascript:alert(1)").ok).toBe(false);
    expect(applySectionFieldEdit(source, "primaryAction.__proto__", "x").ok).toBe(false);
    expect(applySectionFieldEdit(source, "primaryAction.style", "malicious").ok).toBe(false);
    expect(source.primaryAction).toEqual({ label: "Explore collection", href: "/shop/", style: "solid" });
    expect(source.secondaryAction.href).toBe("/stories/");
  });

  it("preserves types and rejects invalid numeric input", () => {
    const source = { count: 3, speed: 1.5, autoplay: false };
    expect(applySectionFieldEdit(source, "count", "4").ok).toBe(true);
    expect(applySectionFieldEdit(source, "speed", "NaN").ok).toBe(false);
    expect(applySectionFieldEdit(source, "autoplay", true).ok).toBe(true);
    expect(source).toEqual({ count: 4, speed: 1.5, autoplay: true });
  });
});
