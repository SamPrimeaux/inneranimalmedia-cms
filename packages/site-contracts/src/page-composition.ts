import type { SiteDocument } from "./site-document.js";

/**
 * Stable, read-only composition inventory for SiteDocument v1.
 *
 * A source page is NOT just page.sections: the announcement, header,
 * editorial masthead, and footer are real visible layers owned elsewhere.
 * This adapter never writes data or pretends they are first-class v2 records.
 */
export type SiteLayerKind =
  | "announcement"
  | "header"
  | "page-masthead"
  | "section"
  | "footer";

export interface SiteCompositionLayer {
  id: string;
  kind: SiteLayerKind;
  owner: "site" | "page";
  source: string;
  label: string;
  renderer?: string;
  sectionId?: string;
  visible: boolean;
  /** In v1, page masthead is rendered by host chrome, not a section. */
  independentlyEditable: boolean;
}

export function describePageComposition(
  site: SiteDocument,
  pageId: string,
): SiteCompositionLayer[] {
  const page = site.pages.find((candidate) => candidate.id === pageId);
  if (!page) throw new Error("Unknown page: " + pageId);
  const layers: SiteCompositionLayer[] = [
    {
      id: "global:announcement",
      kind: "announcement",
      owner: "site",
      source: "header.announcement",
      label: "Announcement bar",
      visible: site.header.announcement.enabled &&
        site.header.announcement.messages.length > 0,
      independentlyEditable: true,
    },
    {
      id: "global:header",
      kind: "header",
      owner: "site",
      source: "header",
      label: "Global header",
      visible: true,
      independentlyEditable: true,
    },
  ];
  if (page.path !== "/") {
    layers.push({
      id: "page:" + page.id + ":masthead",
      kind: "page-masthead",
      owner: "page",
      source: "pages." + page.id + ".title/description",
      label: page.title + " introduction",
      visible: true,
      independentlyEditable: false,
    });
  }
  for (const section of page.sections) {
    layers.push({
      id: "section:" + section.id,
      kind: "section",
      owner: "page",
      source: "pages." + page.id + ".sections." + section.id,
      sectionId: section.id,
      renderer: section.preset,
      label: section.preset.replace(/^.*\//, "").replace(/-/g, " "),
      visible: true,
      independentlyEditable: true,
    });
  }
  layers.push({
    id: "global:footer",
    kind: "footer",
    owner: "site",
    source: "footer",
    label: "Global footer",
    visible: true,
    independentlyEditable: true,
  });
  return layers;
}
