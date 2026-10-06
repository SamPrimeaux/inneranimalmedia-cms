import { EDITORIAL_SCENES } from "../../../apps/editorial-commons/src/portable/scene-manifest.js";

export interface EditorialAtlasItem {
  id: string;
  kind: "section" | "page" | "lab";
  title: string;
  family: string;
  description: string;
  previewUrl: string;
  pages: Array<{ name: string; path: string }>;
  sourceRepo: string;
  sourcePath: string;
  sourceCommit: string;
  maturity: string;
  importMethod: string;
}

const root = "/library/evidence/editorial-commons/index.html";
const provenance = {
  sourceRepo: "SamPrimeaux/inneranimalmedia-cms",
  sourceCommit: "main",
  importMethod: "git subtree with preserved donor history; built source-backed React preview",
} as const;

export const editorialAtlasItems: EditorialAtlasItem[] = [
  {
    id: "commons-gallery",
    kind: "lab",
    title: "Editorial Commons / Complete visual library",
    family: "Editorial Commons · 39 React source components",
    description: "Full source-backed gallery of independent sections, page layouts, overlays and PDPs.",
    previewUrl: root + "?gallery=1",
    pages: [],
    ...provenance,
    sourcePath: "apps/editorial-commons/src/portable/EditorialSceneGallery.tsx",
    maturity: "integrated visual source / not yet a universal CMS package",
  },
  {
    id: "commons-workbench",
    kind: "lab",
    title: "Editable multipage section workbench",
    family: "Editorial Commons · Canonical SiteDocument editor",
    description: "Edit layouts and content blocks, design tokens, background surfaces and page paths. Export genuine SiteDocument JSON.",
    previewUrl: root + "?workbench=1",
    pages: [],
    ...provenance,
    sourcePath: "apps/editorial-commons/src/portable/SectionWorkbench.tsx",
    maturity: "Local authoring preview · no publishing integration",
  },
  ...([
    ["curtain-hero", "hero", "Curtain hero"],
    ["wardrobe-gallery", "wardrobe", "Category gallery"],
    ["split-media", "diptych", "Media diptych"],
    ["editorial-statement", "statement", "Editorial statement"],
  ] as const).map(([scene, id, title]): EditorialAtlasItem => ({
    id: "commons-fieldwork-" + id,
    kind: "section",
    title: title + " / Second-brand proof",
    family: "Editorial Commons · SiteDocument-bound React",
    description: "An existing React section renders FIELDWORK copy, CTAs, imagery and design tokens from the shared CMS document.",
    previewUrl: root + "?scene=" + scene + "&fixture=fieldwork",
    pages: [],
    ...provenance,
    sourcePath: "apps/editorial-commons/src/portable/fieldwork-site.ts",
    maturity: "SiteDocument-bound React scene · local authoring",
  })),
  ...EDITORIAL_SCENES.map((scene): EditorialAtlasItem => ({
    id: "commons-" + scene.id,
    kind: scene.kind === "section" ? "section" :
      scene.kind === "page" || scene.kind === "product-page" ? "page" : "lab",
    title: scene.title,
    family: "Editorial Commons · " + scene.act,
    description: "Real component preview. " +
      (scene.status === "adapted-catalog"
        ? "Content can be injected through the donor React host; section schema normalization is underway."
        : "Legacy interaction; review before promoting into a customer-facing CMS renderer."),
    previewUrl: root + "?scene=" + encodeURIComponent(scene.id),
    pages: [],
    ...provenance,
    sourcePath: "apps/editorial-commons/" + scene.source,
    maturity: "React component · " + scene.status,
  })),
];
