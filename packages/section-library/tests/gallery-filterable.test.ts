import { describe, it, expect } from "vitest";
import { getSection, renderSection, renderFilterableGallery } from "../src/index.js";
import {
  GALLERY_ORIGINAL_CSS_SHA256, GALLERY_FILTERABLE_CSS,
} from "../src/sections/gallery-filterable-style.js";

const context = {
  theme: "consumer",
  resolveMedia: (key: string) => "/media/" + encodeURIComponent(key) + ".jpg",
};
const instance = {
  type: "gallery.filterable-grid",
  preset: "gallery.filterable-grid@1",
  layout: { width: "full" as const, bleed: "none" as const },
  data: {
    heading: "Independently owned gallery",
    intro: "Source records are not section defaults",
    items: [
      { id: "item-1", title: "Copper landscape", caption: "A separate resource", category: "landscapes", mediaKey: "photo/copper" },
      { id: "item-2", title: "Open field", caption: "An unrelated asset", category: "portraits", mediaKey: "photo/open-field" },
    ],
  },
};

describe("Portable gallery original design + independent content", () => {
  it("is registered in the existing section library, not a new CMS editor", () => {
    expect(getSection("gallery.filterable-grid")).toBe(renderFilterableGallery);
    expect(renderSection(instance, context)).toContain("iam-filterable-gallery");
  });
  it("retains authored class structure, breakpoints and isolated CSS identity", () => {
    const html = renderFilterableGallery(instance, context);
    expect(html).toContain('shadowrootmode="open"');
    expect(html).toContain('class="gallery-wrapper"');
    expect(html).toContain('class="gallery-grid"');
    expect(html).toContain('class="gallery-item"');
    expect(html).toContain("@media (max-width: 480px)");
    expect(GALLERY_ORIGINAL_CSS_SHA256).toMatch(/^[a-f0-9]{64}$/);
    expect(GALLERY_FILTERABLE_CSS).toContain(":host");
    expect(html).not.toContain('https://cdn.shopify.com/');
  });
  it("uses host-owned media and escapes untrusted content, without source defaults", () => {
    const html = renderFilterableGallery(instance, context);
    expect(html).toContain("/media/photo%2Fcopper.jpg");
    expect(html).toContain("Independently owned gallery");
    expect(html).not.toContain("Meauxbility");
    const unsafe = structuredClone(instance);
    unsafe.data.heading = '<img src=x onerror=alert(1)>';
    const escaped = renderFilterableGallery(unsafe, context);
    expect(escaped).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(escaped).not.toContain('<img src=x onerror=');
  });
  it("rejects invalid category IDs before they reach filter selectors", () => {
    const broken = structuredClone(instance);
    broken.data.items[0].category = "bad\" onclick";
    expect(() => renderFilterableGallery(broken, context)).toThrow("Invalid gallery category");
  });
  it("supports a new brand without changing the renderer or design fingerprint", () => {
    const second = structuredClone(instance);
    second.data.heading = "Independent consumer";
    second.data.items = [{ id:"another", title:"New place", category:"travel", mediaKey:"own/image" }];
    const result = renderFilterableGallery(second, context);
    expect(result).toContain("Independent consumer");
    expect(result).toContain("/media/own%2Fimage.jpg");
    expect(result).not.toContain("Copper landscape");
    expect(result).toContain('data-renderer="gallery.filterable-grid@1"');
  });
});
