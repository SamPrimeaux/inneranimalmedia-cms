import type { SectionInstance } from "@inneranimalmedia/site-contracts";
import type { RenderContext } from "../context.js";
import { escapeHtml } from "../context.js";
import { GALLERY_FILTERABLE_CSS, GALLERY_ORIGINAL_SOURCE_SHA256 } from "./gallery-filterable-style.js";
import { registerSection } from "../registry.js";

/** Data is supplied by the host (e.g. typed entries), not copied from the donor. */
export interface FilterableGalleryItem {
  id: string;
  title: string;
  caption?: string;
  category: string;
  mediaKey?: string;
  alt?: string;
}
export interface FilterableGalleryData {
  heading: string;
  intro?: string;
  items: FilterableGalleryItem[];
  categories?: Array<{ id: string; label: string }>;
}

const VALID_IMAGE = /^(https:\/\/[^\s"'<>]+|\/(?!\/)[^\s"'<>]+)$/i;
const VALID_CATEGORY = /^[a-z0-9][a-z0-9_-]*$/;

function asData(data: Record<string, unknown>): FilterableGalleryData {
  const entries = Array.isArray(data.items) ? data.items : [];
  const items: FilterableGalleryItem[] = entries.map((raw, index) => {
    const item = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
    const category = String(item.category ?? "uncategorized").toLowerCase();
    if (!VALID_CATEGORY.test(category)) throw new Error("Invalid gallery category: " + category);
    return {
      id: String(item.id ?? "item-" + index),
      title: String(item.title ?? ""),
      caption: String(item.caption ?? ""),
      category,
      mediaKey: typeof item.mediaKey === "string" ? item.mediaKey :
        (item.media && typeof item.media === "object" && (item.media as {key?: unknown}).key)
          ? String((item.media as {key: string}).key) : undefined,
      alt: String(item.alt ?? item.title ?? ""),
    };
  });
  const categoryList = Array.isArray(data.categories) ? data.categories : [];
  const categories = categoryList.length ?
    categoryList.map((x) => ({
      id: String((x as {id?: string}).id),
      label: String((x as {label?: string}).label),
    })) :
    [...new Set(items.map((x) => x.category))].map((id) => ({
      id, label: id.split("-").map((v) => v.charAt(0).toUpperCase() + v.slice(1)).join(" "),
    }));
  for (const c of categories) if (!VALID_CATEGORY.test(c.id)) throw new Error("Invalid category filter");
  return { heading: String(data.heading ?? ""), intro: String(data.intro ?? ""), items, categories };
}

export function renderFilterableGallery(instance: SectionInstance, context: RenderContext): string {
  const data = asData(instance.data);
  const buttons = [{ id: "all", label: "All" }, ...(data.categories ?? [])].map((c) =>
    '<button class="nav-btn' + (c.id === "all" ? " active" : "") +
    '" type="button" aria-pressed="' + (c.id === "all" ? "true" : "false") +
    '" data-filter="' + escapeHtml(c.id) + '">' + escapeHtml(c.label) + '</button>'
  ).join("");
  const items = data.items.map((item) => {
    const url = item.mediaKey ? context.resolveMedia(item.mediaKey) : null;
    // The consumer owns URL resolution. Never retain the imported Shopify URL.
    const media = url && VALID_IMAGE.test(url) ?
      '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(item.alt ?? item.title) +
      '" loading="lazy" decoding="async">' : "";
    return '<article class="gallery-item" data-category="' + escapeHtml(item.category) + '">' +
      '<div class="media-container">' + media + '</div>' +
      '<div class="item-info"><h3 class="item-title">' + escapeHtml(item.title) + '</h3>' +
      '<p class="item-desc">' + escapeHtml(item.caption ?? "") + '</p></div></article>';
  }).join("");
  const markup = '<div class="gallery-wrapper"><header class="gallery-header">' +
    '<h1>' + escapeHtml(data.heading) + '</h1><p>' + escapeHtml(data.intro ?? "") +
    '</p></header><nav class="gallery-nav" aria-label="Gallery filters">' + buttons +
    '</nav><div class="gallery-grid">' + items + '</div></div>';
  // Declarative Shadow DOM keeps the source geometry and responsive styles
  // isolated from consumer themes, while still producing SSR-visible HTML.
  return '<iam-filterable-gallery data-renderer="gallery.filterable-grid@1" data-source-sha256="' +
    GALLERY_ORIGINAL_SOURCE_SHA256 + '"><template shadowrootmode="open">' +
    '<style>' + GALLERY_FILTERABLE_CSS + '</style>' + markup +
    '</template></iam-filterable-gallery>';
}

export function defineFilterableGalleryElement(doc: Document): void {
  const realm = doc.defaultView;
  if (!realm || realm.customElements.get("iam-filterable-gallery")) return;
  const BaseElement = realm.HTMLElement;
  const TemplateElement = realm.HTMLTemplateElement;
  const ElementCtor = realm.Element;
  class FilterableGalleryElement extends BaseElement {
    connectedCallback(): void {
      // Fallback for browsers without declarative Shadow DOM support.
      if (!this.shadowRoot) {
        const template = this.querySelector('template[shadowrootmode="open"]');
        if (template instanceof TemplateElement) {
          this.attachShadow({ mode: "open" }).appendChild(template.content.cloneNode(true));
          template.remove();
        }
      }
      const shadow = this.shadowRoot;
      if (!shadow || this.hasAttribute("data-gallery-ready")) return;
      this.setAttribute("data-gallery-ready", "true");
      shadow.addEventListener("click", (event: Event) => {
        const target = event.target;
        if (!(target instanceof ElementCtor)) return;
        const button = target.closest<HTMLButtonElement>("button[data-filter]");
        if (!button) return;
        const filter = button.dataset.filter;
        shadow.querySelectorAll<HTMLButtonElement>("button[data-filter]").forEach((b) => {
          const active = b === button;
          b.classList.toggle("active", active);
          b.setAttribute("aria-pressed", String(active));
        });
        shadow.querySelectorAll<HTMLElement>(".gallery-item").forEach((item, index) => {
          const shown = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("hidden", !shown);
          if (shown) item.style.animationDelay = String(index * 50) + "ms";
        });
      });
    }
  }
  realm.customElements.define("iam-filterable-gallery", FilterableGalleryElement);
}

registerSection("gallery.filterable-grid", renderFilterableGallery);
