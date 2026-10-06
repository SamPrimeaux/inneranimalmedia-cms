import type { SiteDocument } from "../../../../packages/site-contracts/src/site-document.js";
import { SPLIT_COTTON_IMAGE, SPLIT_LEATHER_IMAGE, HERO_IMAGE } from "../data/catalog";

/**
 * An independent SiteDocument fixture, not a copy of the Fieldwork data.
 * Used to catch accidental hardcoded content and media-key assumptions.
 */
export const coveSite: SiteDocument = {
  schemaVersion: 1,
  id: "cove-paper-design-fixture",
  theme: "cove-editorial",
  design: { accent: "#25516A", accentSoft: "#9BD6D5", canvas: "#E8F1F1",
    paper: "#FFFFFF", ink: "#153144" },
  brand: { name: "COVE / PAPER", home: "/", description: "Illustrative paper and design studio" },
  header: {
    settings: { sticky: false, pill: false },
    announcement: { enabled: false, messages: [] },
    blocks: [{ id: "logo", type: "brand", label: "COVE / PAPER", href: "/" }],
  },
  footer: { settings: { background: "inverse", copyright: "COVE / PAPER / Concept study" }, blocks: [] },
  pages: [{
    id: "home",
    path: "/",
    title: "Cove Paper / Editorial",
    description: "Another independent customer-content fixture",
    sections: [{
      id: "cove-collection",
      type: "showcase",
      preset: "commons/collection-carousel",
      settings: { surface: "canvas", spacing: "lg", minHeight: "auto" },
      data: { eyebrow: "ISSUE 01", heading: "A quieter collection",
        body: "Editorial objects for a different imaginary studio." },
      blocks: [{
        id: "cove-paper",
        type: "item",
        data: { title: "Collected paper", group: "Objects", label: "New edition",
          badge: "Selected", mediaKey: "cove.paper", alt: "Paper textile study",
          href: "/editions/paper/" },
      }, {
        id: "cove-print",
        type: "item",
        data: { title: "The print journal", group: "Journal",
          label: "From the studio", mediaKey: "cove.print", alt: "Editorial print composition",
          href: "/journal/print/" },
      }],
    }, {
      id: "cove-lookbook",
      type: "showcase",
      preset: "commons/lookbook-hotspots",
      settings: { surface: "paper", spacing: "lg", minHeight: "auto" },
      data: { eyebrow: "STUDIO NOTES", heading: "A study in composition",
        body: "Select a marker to learn about the process.",
        mediaKey: "cove.editorial", alt: "Illustrative materials editorial" },
      blocks: [{
        id: "cove-process",
        type: "item",
        data: { title: "The making process", body: "The studio's illustrative process narrative.",
          badge: "PROCESS", hotspotX: 62, hotspotY: 31,
          ctaLabel: "Read the process", href: "/process/" },
      }, {
        id: "cove-detail",
        type: "item",
        data: { title: "Material details", body: "Close-up notes for another imaginary brand.",
          badge: "DETAILS", hotspotX: 25, hotspotY: 69,
          ctaLabel: "Inspect materials", href: "/materials/" },
      }],
    }, {
      id: "cove-faq",
      type: "showcase",
      preset: "commons/faq-trust",
      settings: { surface: "muted", spacing: "md", minHeight: "auto" },
      data: { eyebrow: "HELP / STUDIO", heading: "A few useful answers",
        body: "Sample content only, without service promises.",
        ctaLabel: "Find out more", ctaHref: "/about/" },
      blocks: [{
        id: "cove-question-one", type: "text",
        data: { title: "Can sections be reused?", body: "Yes, when they implement the same data contract." },
      }, {
        id: "cove-question-two", type: "text",
        data: { title: "Is this storefront live?", body: "No. This is an independent content fixture for testing." },
      }],
    }],
  }],
};

export const coveMedia: ReadonlyMap<string, string> = new Map([
  ["cove.paper", SPLIT_COTTON_IMAGE],
  ["cove.print", HERO_IMAGE],
  ["cove.editorial", SPLIT_LEATHER_IMAGE],
]);
