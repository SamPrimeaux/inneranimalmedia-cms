import type { SiteDocument } from "../../../../packages/site-contracts/src/site-document.js";
import { LOOKBOOK_IMAGE, HERO_IMAGE, SPLIT_COTTON_IMAGE, SPLIT_LEATHER_IMAGE } from "../data/catalog";

/**
 * A second, unrelated brand proving the same React scene consumes the
 * canonical CMS SiteDocument structure. These values are fixture-only.
 */
export const fieldworkSite: SiteDocument = {
  schemaVersion: 1,
  id: "fieldwork-demonstration",
  theme: "fieldwork",
  design: { accent: "#4C6655", accentSoft: "#C0D3B2", canvas: "#F0EFE7",
    paper: "#FFFFFF", ink: "#19211C" },
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
    }, {
      id: "fieldwork-wardrobe",
      type: "showcase",
      preset: "commons/wardrobe-gallery",
      settings: { surface: "paper", spacing: "lg", minHeight: "auto" },
      data: { eyebrow: "A FEW WAYS TO GET LOST", heading: "Choose your own direction." },
      blocks: [
        { id: "fieldwork-journeys", type: "item",
          data: { title: "Journeys", caption: "Open roads", mediaKey: "fieldwork.journeys",
            href: "/stories/", alt: "Sunset on the open road" } },
        { id: "fieldwork-materials", type: "item",
          data: { title: "Materials", caption: "Wear and weather", mediaKey: "fieldwork.materials",
            href: "/materials/", alt: "Materials and textures" } },
        { id: "fieldwork-archive", type: "item",
          data: { title: "Archives", caption: "Objects that last", mediaKey: "fieldwork.archive",
            href: "/archive/", alt: "Editorial archive" } },
      ],
    }, {
      id: "fieldwork-diptych",
      type: "showcase",
      preset: "commons/split-media",
      settings: { surface: "inverse", spacing: "none", minHeight: "auto" },
      data: { heading: "Between departure and discovery" },
      blocks: [
        { id: "fieldwork-morning", type: "item",
          data: { eyebrow: "STUDY 01 · MORNING", title: "Go beyond the familiar.",
            body: "Leave the map open. Every little turn is part of the story.",
            mediaKey: "fieldwork.morning", href: "/stories/morning/",
            ctaLabel: "Explore morning", alt: "Morning road trip scene" } },
        { id: "fieldwork-evening", type: "item",
          data: { eyebrow: "STUDY 02 · EVENING", title: "Stay for the light.",
            body: "The best discoveries rarely have a strict arrival time.",
            mediaKey: "fieldwork.evening", href: "/stories/evening/",
            ctaLabel: "Explore evening", alt: "Evening landscape" } },
      ],
    }, {
      id: "fieldwork-statement",
      type: "statement",
      preset: "commons/editorial-statement",
      settings: { surface: "paper", spacing: "md", minHeight: "auto" },
      data: { body: "Take the route that leaves you with a better story.",
        ctaLabel: "Browse the journal", ctaHref: "/journal/" },
    }],
  }],
};

export const fieldworkMedia: ReadonlyMap<string, string> = new Map([
  ["fieldwork.hero", LOOKBOOK_IMAGE],
  ["fieldwork.journeys", HERO_IMAGE],
  ["fieldwork.materials", SPLIT_COTTON_IMAGE],
  ["fieldwork.archive", SPLIT_LEATHER_IMAGE],
  ["fieldwork.morning", LOOKBOOK_IMAGE],
  ["fieldwork.evening", HERO_IMAGE],
]);
