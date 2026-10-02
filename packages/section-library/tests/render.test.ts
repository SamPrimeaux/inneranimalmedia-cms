import { describe, expect, it } from "vitest";
import { presetLibraryFrom, registeredSectionTypes, renderPage, renderSection } from "../src/index.js";

const context = {
  theme: "revise",
  resolveMedia: (key: string) => key === "home.hero.primary" ? "/hero.svg" : null,
};

describe("section library", () => {
  it("registers the shared semantic showcase vocabulary", () => {
    expect(registeredSectionTypes()).toEqual([
      "before-after",
      "brand-film",
      "bundle-builder",
      "campaign-teaser",
      "collection-split-media",
      "collection-track",
      "cta-band",
      "editorial-grid",
      "editorial-posts",
      "faq",
      "featured-product",
      "fullscreen-media-product",
      "logo-track",
      "marquee",
      "media-gallery",
      "media-hero",
      "shop-the-look",
      "social-gallery",
      "split-media",
      "statement",
      "stories",
      "testimonials",
      "trust-row",
    ]);
  });

  it("keeps full-bleed background separate from contained content", () => {
    const html = renderSection({
      type: "statement",
      variant: "revise/editorial-statement",
      layout: {
        width: "reading",
        bleed: "background",
        spacing: { block: "md" },
      },
      data: { heading: "Revise" },
    }, context);

    expect(html).toContain('class="iam-layout-full iam-section-space-md"');
    expect(html).toContain('class="iam-layout-reading iam-safe-inline"');
    expect(html).toContain('data-theme="revise"');
  });

  it("resolves logical media through the host", () => {
    const html = renderSection({
      type: "media-hero",
      layout: { width: "full", bleed: "none" },
      data: {
        heading: "A portable theme",
        mediaKey: "home.hero.primary",
        mediaAlt: "Abstract editorial geometry",
      },
    }, context);
    expect(html).toContain('src="/hero.svg"');
    expect(html).not.toContain("imagedelivery.net");
  });

  it("renders a page through section presets", () => {
    const presets = presetLibraryFrom([
      {
        id: "revise/editorial-statement",
        type: "statement",
        variant: "revise/editorial-statement",
        layout: {
          width: "reading",
          bleed: "none",
          spacing: { block: "lg" },
        },
        data: { heading: "Default" },
      },
    ]);

    const html = renderPage({
      id: "foundation",
      type: "page-preset",
      theme: "revise",
      sections: [{
        type: "statement",
        preset: "revise/editorial-statement",
        data: { heading: "From page" },
      }],
    }, { context, presets });

    expect(html).toContain("From page");
    expect(html).not.toContain(">Default<");
  });
});
