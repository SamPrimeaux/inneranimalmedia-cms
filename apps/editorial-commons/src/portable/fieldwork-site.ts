import type { SiteDocument } from "../../../../packages/site-contracts/src/site-document.js";
import { LOOKBOOK_IMAGE } from "../data/catalog";

/**
 * A second, unrelated brand proving the same React scene consumes the
 * canonical CMS SiteDocument structure. These values are fixture-only.
 */
export const fieldworkSite: SiteDocument = {
  schemaVersion: 1,
  id: "fieldwork-demonstration",
  theme: "fieldwork",
  brand: {
    name: "FIELDWORK / STUDIO",
    home: "/",
    description: "The long way around is usually the good one.",
  },
  header: {
    settings: { sticky: true, pill: true },
    announcement: { enabled: false, messages: [] },
    blocks: [{ id: "brand", type: "brand", label: "FIELDWORK / STUDIO", href: "/" }],
  },
  footer: {
    settings: { background: "inverse", copyright: "Illustrative brand fixture" },
    blocks: [],
  },
  pages: [{
    id: "home",
    path: "/",
    title: "The road ahead",
    description: "Illustrative content from another customer identity",
    sections: [{
      id: "fieldwork-curtain-hero",
      type: "media-hero",
      preset: "commons/curtain-hero",
      settings: {
        surface: "image",
        minHeight: "screen",
        spacing: "lg",
        backgroundMediaKey: "fieldwork.hero",
      },
      data: {
        eyebrow: "FIELDWORK / THE OPEN ROAD",
        heading: "THE LONG WAY IS THE GOOD WAY.",
        body: "Out there is where the best stories begin. Make time for every turn, stop, and detour.",
        mediaKey: "fieldwork.hero",
        ctaLabel: "Explore the stories",
        ctaHref: "/stories/",
      },
    }],
  }],
};

export const fieldworkMedia: ReadonlyMap<string, string> = new Map([
  ["fieldwork.hero", LOOKBOOK_IMAGE],
]);
