import { describe, expect, it } from "vitest";
import { renderSiteSection, presetLibraryFrom } from "../src/index.js";

const presets = presetLibraryFrom([{
  id: "revise/gallery",
  type: "media-gallery",
  layout: { width: "max", bleed: "background" as const },
  data: {},
}]);
const context = { theme: "revise", resolveMedia: (key: string) => key === "hero" ? "/hero.webp" : null };

describe("portable site sections", () => {
  it("renders a standalone section with scoped background and editable blocks", () => {
    const html = renderSiteSection({
      id: "gallery", preset: "revise/gallery", type: "media-gallery",
      settings: { surface: "paper", backgroundMediaKey: "hero" },
      data: { heading: "Work worth showing", items: [] },
      blocks: [{ id: "one", type: "item", data: { title: "A story", mediaKey: "hero", href: "/stories/" } }],
    }, { context, presets });
    expect(html).toContain('id="gallery" data-surface="paper"');
    expect(html).toContain('class="iam-site-section__background" src="/hero.webp"');
    expect(html).toContain("Work worth showing");
    expect(html).toContain("A story");
    expect(html).toContain('href="/stories/"');
  });
  it("escapes document-supplied identifiers and isolates a missing image", () => {
    const html = renderSiteSection({
      id: 'gallery"><script', preset: "revise/gallery", type: "media-gallery",
      settings: { surface: "canvas", backgroundMediaKey: "missing" }, data: { items: [] },
    }, { context, presets });
    expect(html).not.toContain("<script");
    expect(html).not.toContain('class="iam-site-section__background"');
  });
});
