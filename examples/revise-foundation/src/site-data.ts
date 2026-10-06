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
      messages: ["Built in Lafayette", "Earned Hours", "Fuel hard. Live free."],
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
        description: "Stories, new releases, and the things worth making time for." },
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
    page("products", "/products/", "The Shop", "Well-made essentials with somewhere to go.", [
      "revise/tabbed-products", "revise/pinned-pdp", "revise/hotspot-lookbook",
      "revise/sticky-summary", "revise/trust-row",
    ]),
    page("stories", "/stories/", "Project Stories", "Real builders, machines and works in progress.", [
      "revise/campaign-teaser", "revise/sticky-card-deck", "revise/full-bleed-grid",
      "revise/brand-film",
    ]),
    page("campaigns", "/campaigns/", "Our Worlds", "Different ways of moving. One reason for making the time.", [
      "revise/dark-promo-grid", "revise/pinned-media-grid",
      "revise/before-after", "revise/testimonials",
    ]),
    page("ideas", "/ideas/", "What Comes Next", "Working ideas and proposed pieces. Nothing here is on sale yet.", [
      "revise/merch-lab", "revise/commerce-marquee",
      "revise/faq", "revise/newsletter",
    ]),
  ],
};

/**
 * Improves presentation copy only when it still equals the original concept
 * scaffolding. User-authored local drafts and edited section blocks win.
 * This is FNF-specific content migration, not a reusable package rule.
 */
export function refineFnfCopy(site: SiteDocument): SiteDocument {
  const replacements = new Map<string, string>([
    ["Existing brand worlds", "The worlds of F&FT"],
    ["The F&FT visual vocabulary is already here.", "Every hour has a story."],
    ["Campaign directions / existing source material", "Fuel & Free Time / Three worlds"],
    ["Three customer-facing worlds we can scaffold from what already exists.", "Three ways to make the time count."],
    ["Garage nights, motion, machines, redline energy, and performance-minded product drops.",
      "For the late nights in the garage and the roads that make them worth it."],
    ["Quiet confidence, black-on-black styling, premium staples, and products that feel earned rather than loud.",
      "Less noise. More purpose. Essentials that speak for themselves."],
    ["Turn real builds, machines, collaborators, and works-in-progress into campaign/editorial content instead of leaving them buried in the media library.",
      "The makers, machines, and places behind the things we love."],
    ["Product direction", "The Goods / Existing & Next"],
    ["Live pieces, existing graphics, and sourced next-product ideas.", "Built to wear. Made to go."],
    ["Campaign concept / real project imagery", "From the shop floor"],
    ["The media library already contains complete build sequences. Instead of treating them as loose uploads, we can scaffold them as editorial stories, collaborator profiles, launch teasers, and limited product capsules.",
      "Behind every finished machine are the people, long nights, setbacks, and small wins that brought it to life."],
    ["Build the story template", "See the stories"],
    ["Editorial pipeline / real media", "Work worth remembering"],
    ["Turn uploads into stories, not storage.", "Every machine has a story."],
    ["Existing asset library", "Out there / In the making"],
    ["Enough material to start publishing now.", "The moments in between."],
    ["Sourced product ideas / current Completeful mirror", "In development"],
    ["Use the catalog to extend the brand — not just fill a grid.", "Good ideas take time."],
    ["These are real currently available catalog families we can turn into F&FT products, add-ons, gifts, and campaign bundles. The retail and bundle prices remain concept pricing until product creation, artwork, shipping, and final margin validation are complete.",
      "Exploring new essentials, useful extras, and pieces for the road. These are concepts, not available F&FT products; prices and fulfillment are still under review."],
    ["The phrases worth building around.", "Words we live by."],
    ["Ready to scaffold", "In the works"],
    ["Approved concepts can become products + campaigns.", "New directions begin with real ideas."],
  ]);
  function refineValue(value: unknown): unknown {
    if (typeof value === "string") return replacements.get(value) ?? value;
    if (Array.isArray(value)) return value.map(refineValue);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(
      Object.entries(value).map(([key, part]) => [key, refineValue(part)]),
    );
  }
  const oldPages: Record<string, [string, string, string, string]> = {
    products: ["Live Products", "The Shop", "The actual pieces and the stories behind them.",
      "Well-made essentials with somewhere to go."],
    campaigns: ["Campaign Directions", "Our Worlds", "Earned Hours, High Octane and Masters.",
      "Different ways of moving. One reason for making the time."],
    ideas: ["Product Ideas", "What Comes Next", "Candidate products — not yet published.",
      "Working ideas and proposed pieces. Nothing here is on sale yet."],
  };
  for (const page of site.pages) {
    const previous = oldPages[page.id];
    if (previous) {
      if (page.title === previous[0]) page.title = previous[1];
      if (page.description === previous[2]) page.description = previous[3];
    }
    for (const section of page.sections) {
      section.data = refineValue(section.data) as Record<string, unknown>;
      if (section.blocks) {
        for (const block of section.blocks) {
          block.data = refineValue(block.data) as Record<string, unknown>;
        }
      }
      if (page.id === "campaigns" && section.preset === "revise/dark-promo-grid" && section.blocks) {
        const destinations = [
          "/campaigns/#campaigns-pinned-media-grid-2",
          "/campaigns/#campaigns-before-after-3",
          "/stories/",
        ];
        section.blocks.forEach((block, i) => {
          if (block.data.href === "/campaigns/" && i < 2) block.data.href = destinations[i];
        });
      }
    }
  }
  site.header.announcement.messages = site.header.announcement.messages.map((message) =>
    message === "Existing assets + new directions" ? "Fuel hard. Live free." : message);
  for (const block of site.footer.blocks) {
    if (block.type === "newsletter" &&
        block.description === "Notes on new ideas and existing projects. Subscription integration pending.") {
      block.description = "Stories, new releases, and the things worth making time for.";
    }
  }
  return site;
}
refineFnfCopy(initialSite);
