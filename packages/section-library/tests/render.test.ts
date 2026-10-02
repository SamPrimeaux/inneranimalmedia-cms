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
      "commerce-offers",
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

  it("renders normalized merchandising offers with optional economics", () => {
    const html = renderSection({
      type: "commerce-offers",
      variant: "revise/merch-lab",
      layout: {
        width: "max",
        bleed: "none",
        gutters: { mode: "fluid" },
        spacing: { block: "lg" },
      },
      data: {
        heading: "Offer lab",
        showEconomics: true,
        products: [
          {
            id: "core",
            title: "Core",
            role: "Hero SKU",
            fulfillmentCostCents: 1000,
            proposedRetailCents: 3000,
          },
          {
            id: "add",
            title: "Add-on",
            role: "Upsell",
            fulfillmentCostCents: 400,
            proposedRetailCents: 1600,
          },
        ],
        offers: [
          {
            id: "bundle",
            title: "Bundle",
            productIds: ["core", "add"],
            compareAtCents: 4600,
            offerPriceCents: 3900,
            fulfillmentCostCents: 1400,
          },
        ],
      },
    }, context);

    expect(html).toContain("Offer lab");
    expect(html).toContain("$39");
    expect(html).toContain("Est. gross margin 64%");
    expect(html).toContain("Hero SKU");
    expect(html).toContain('data-commerce-offer="bundle"');
  });


  it("renders resolved brand-film video media without provider assumptions", () => {
    const videoContext = {
      theme: "revise",
      resolveMedia: (key: string) =>
        key === "film.primary"
          ? "/media/film.mp4"
          : key === "film.poster"
            ? "/media/poster.webp"
            : null,
    };
    const html = renderSection({
      type: "brand-film",
      layout: { width: "full", bleed: "media" },
      data: {
        heading: "Brand film",
        mediaKey: "film.primary",
        posterKey: "film.poster",
      },
    }, videoContext);

    expect(html).toContain("<video");
    expect(html).toContain('src="/media/film.mp4"');
    expect(html).toContain('poster="/media/poster.webp"');
    expect(html).toContain("data-brand-film-toggle");
  });

  it("allows review anchors on reusable campaign and product sections", () => {
    const collection = renderSection({
      type: "collection-track",
      layout: { width: "full", bleed: "none" },
      data: {
        anchor: "products-review",
        heading: "Products",
        tabs: [{ id: "live", label: "Live", items: [] }],
      },
    }, context);
    const campaign = renderSection({
      type: "campaign-teaser",
      layout: { width: "full", bleed: "none" },
      data: {
        anchor: "campaign-review",
        heading: "Campaign",
      },
    }, context);

    expect(collection).toContain('id="products-review"');
    expect(campaign).toContain('id="campaign-review"');
  });

});
