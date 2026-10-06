import type { SiteDocument, SitePage, SiteSection, SectionSurface } from "@inneranimalmedia/site-contracts";
import { reviseShowcaseHome, reviseShowcasePresets } from "@inneranimalmedia/revise-theme";
import { buildFnfConceptPage, fnfConceptMedia } from "./fixtures/fnf-concept.js";
import { completefulMedia } from "./fixtures/completeful-merch.js";

export const siteMedia = new Map<string, string>([...fnfConceptMedia, ...completefulMedia]);
const legacyPage = buildFnfConceptPage();
const legacyRoutes: Record<string, string> = {
  "#fnf-products": "/products/",
  "#fnf-campaigns": "/campaigns/",
  "#fnf-merch-lab": "/ideas/",
  "#fnf-stories": "/stories/",
  "#fnf-high-octane": "/campaigns/",
  "#fnf-masters": "/campaigns/",
};
function portableData<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => portableData(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, portableData(item)]),
    ) as T;
  }
  if (typeof value === "string" && legacyRoutes[value]) return legacyRoutes[value] as T;
  return value;
}

const tone: Record<string, SectionSurface> = {
  "revise/sticky-curtain": "image",
  "revise/wardrobe-rail": "paper",
  "revise/dark-promo-grid": "inverse",
  "revise/editorial-statement": "canvas",
  "revise/story-rings": "paper",
  "revise/tabbed-products": "paper",
  "revise/scroll-text-reveal": "image",
  "revise/parallax-diptych": "image",
  "revise/hotspot-lookbook": "muted",
  "revise/pinned-pdp": "paper",
  "revise/merch-lab": "paper",
  "revise/sticky-summary": "muted",
  "revise/commerce-marquee": "inverse",
  "revise/pinned-media-grid": "inverse",
  "revise/brand-film": "inverse",
  "revise/campaign-teaser": "image",
  "revise/logo-track": "canvas",
  "revise/before-after": "paper",
  "revise/testimonials": "muted",
  "revise/sticky-card-deck": "paper",
  "revise/newsletter": "inverse",
  "revise/full-bleed-grid": "paper",
  "revise/faq": "paper",
  "revise/trust-row": "canvas",
};

function createSection(preset: string, slug: string, ordinal = 0): SiteSection {
  const record = legacyPage.sections.find((entry) => entry.preset === preset) ??
    reviseShowcaseHome.sections.find((entry) => entry.preset === preset);
  const definition = reviseShowcasePresets.find((entry) => entry.id === preset);
  if (!record || !definition) throw new Error("Missing catalog preset " + preset);
  const data = portableData(structuredClone(record.data ?? {})) as Record<string, unknown>;
  const items = Array.isArray(data.items) ? data.items as Array<Record<string, unknown>> : null;
  const blocks = items?.map((item, index) => ({ id: slug + "-block-" + index, type: "item" as const, data: item }));
  return {
    id: slug + "-" + preset.split("/")[1] + (ordinal ? "-" + ordinal : ""),
    type: record.type,
    preset,
    settings: { surface: tone[preset] ?? "canvas" },
    ...(blocks ? { blocks } : {}),
    data,
  };
}
export const sectionCatalog = reviseShowcasePresets.map((preset) => ({
  id: preset.id,
  title: preset.id.split("/")[1].replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
  type: preset.type,
}));

export function sectionFromCatalog(preset: string, pageId: string): SiteSection {
  return createSection(preset, pageId + "-" + Date.now(), 0);
}

function page(id: string, path: string, title: string, description: string, presets: string[]): SitePage {
  return {
    id, path, title, description,
    sections: presets.map((preset, ordinal) => createSection(preset, id, ordinal + 1)),
  };
}

/** Customer-specific content fixture. No credentials, CMS writes, or provider SDK. */
export const initialSite: SiteDocument = {
  schemaVersion: 1,
  id: "fnf-revise-site",
  theme: "revise",
  brand: {
    name: "Fuel & Free Time",
    home: "/",
    description: "Time is the real horsepower.",
  },
  header: {
    settings: { sticky: true, pill: true },
    announcement: {
      enabled: true,
      messages: ["Built in Lafayette", "Earned Hours", "Existing assets + new directions"],
    },
    blocks: [
      { id: "menu", type: "action", label: "Menu", action: "menu" },
      { id: "products", type: "link", label: "Products", href: "/products/" },
      { id: "stories", type: "link", label: "Stories", href: "/stories/" },
      { id: "ideas", type: "link", label: "Product Ideas", href: "/ideas/" },
      { id: "brand", type: "brand", label: "Fuel & Free Time", href: "/" },
      { id: "search", type: "action", label: "Search", action: "search" },
      { id: "discover", type: "action", label: "Discover", action: "discover" },
      { id: "bag", type: "action", label: "Bag", action: "bag" },
    ],
  },
  footer: {
    settings: { background: "inverse", copyright: "Fuel & Free Time. Built for the hours that matter." },
    blocks: [
      { id: "explore", type: "menu", title: "Explore", links: [
        { id: "products", label: "Products", href: "/products/" },
        { id: "stories", label: "Project Stories", href: "/stories/" },
        { id: "campaigns", label: "Campaigns", href: "/campaigns/" },
      ] },
      { id: "studio", type: "menu", title: "Studio", links: [
        { id: "ideas", label: "Product Ideas", href: "/ideas/" },
        { id: "home", label: "Earned Hours", href: "/" },
      ] },
      { id: "newsletter", type: "newsletter", title: "The Dispatch",
        description: "Notes on new ideas and existing projects. Subscription integration pending." },
      { id: "legal", type: "legal", title: "Information", links: [
        { id: "contact", label: "Contact", href: "mailto:hello@fuelnfreetime.com" },
      ] },
    ],
  },
  pages: [
    page("home", "/", "Earned Hours", "A place for the gear, builds and experiences that earn our time.", [
      "revise/sticky-curtain", "revise/wardrobe-rail", "revise/editorial-statement",
      "revise/campaign-teaser", "revise/brand-film", "revise/newsletter",
    ]),
    page("products", "/products/", "Live Products", "The actual pieces and the stories behind them.", [
      "revise/tabbed-products", "revise/pinned-pdp", "revise/hotspot-lookbook",
      "revise/sticky-summary", "revise/trust-row",
    ]),
    page("stories", "/stories/", "Project Stories", "Real builders, machines and works in progress.", [
      "revise/campaign-teaser", "revise/sticky-card-deck", "revise/full-bleed-grid",
      "revise/brand-film",
    ]),
    page("campaigns", "/campaigns/", "Campaign Directions", "Earned Hours, High Octane and Masters.", [
      "revise/dark-promo-grid", "revise/pinned-media-grid",
      "revise/before-after", "revise/testimonials",
    ]),
    page("ideas", "/ideas/", "Product Ideas", "Candidate products — not yet published.", [
      "revise/merch-lab", "revise/commerce-marquee",
      "revise/faq", "revise/newsletter",
    ]),
  ],
};
