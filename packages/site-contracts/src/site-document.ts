/**
 * Portable site document v1. Application owns content and persistence;
 * themes own presentation and section renderers own semantic markup.
 */
export const SITE_DOCUMENT_VERSION = 1 as const;
export type SectionSurface = "canvas" | "paper" | "muted" | "inverse" | "image";
export type SiteBlockKind = "item" | "text" | "media" | "product" | "link";

export interface SiteContentBlock {
  id: string;
  type: SiteBlockKind;
  data: Record<string, unknown>;
}
export interface SiteSectionSettings {
  surface?: SectionSurface;
  backgroundMediaKey?: string;
  minHeight?: "auto" | "screen";
  spacing?: "none" | "sm" | "md" | "lg";
}
export interface SiteSection {
  id: string;
  type: string;
  preset: string;
  settings: SiteSectionSettings;
  /** A list of blocks maps to data.items for compatible renderers. */
  blocks?: SiteContentBlock[];
  data: Record<string, unknown>;
}
export interface SitePage {
  id: string;
  path: string;
  title: string;
  description: string;
  sections: SiteSection[];
}
export interface SiteLink {
  id: string;
  label: string;
  href: string;
}
export interface SiteHeaderBlock {
  id: string;
  type: "link" | "brand" | "action";
  label: string;
  href?: string;
  action?: "menu" | "search" | "discover" | "bag";
}
export interface SiteFooterBlock {
  id: string;
  type: "menu" | "newsletter" | "social" | "legal";
  title: string;
  links?: SiteLink[];
  description?: string;
}
/** Optional visual identity variables; sections never own an immutable brand palette. */
export interface SiteDesignTokens {
  accent?: string;
  accentSoft?: string;
  canvas?: string;
  paper?: string;
  ink?: string;
}
export interface SiteDocument {
  schemaVersion: typeof SITE_DOCUMENT_VERSION;
  design?: SiteDesignTokens;
  id: string;
  theme: string;
  brand: { name: string; home: string; description: string };
  header: {
    settings: { sticky: boolean; pill: boolean };
    announcement: { enabled: boolean; messages: string[] };
    blocks: SiteHeaderBlock[];
  };
  footer: {
    settings: { background: SectionSurface; copyright: string };
    blocks: SiteFooterBlock[];
  };
  pages: SitePage[];
}

export function validateSiteDocument(value: unknown): string[] {
  if (!value || typeof value !== "object") return ["Site document must be an object"];
  const doc = value as Partial<SiteDocument>;
  const issues: string[] = [];
  if (doc.schemaVersion !== SITE_DOCUMENT_VERSION) issues.push("Unsupported site document version");
  if (!doc.id || !doc.brand?.name) issues.push("Site identity is required");
  if (doc.design) {
    for (const [token, value] of Object.entries(doc.design)) {
      if (!["accent", "accentSoft", "canvas", "paper", "ink"].includes(token) ||
          typeof value !== "string" || !/^#[0-9a-fA-F]{6}$/.test(value)) {
        issues.push("Invalid site design token: " + token);
      }
    }
  }
  if (!doc.header || !Array.isArray(doc.header.blocks)) issues.push("Header blocks are required");
  if (!doc.footer || !Array.isArray(doc.footer.blocks)) issues.push("Footer blocks are required");
  if (!Array.isArray(doc.pages) || !doc.pages.length) issues.push("At least one page is required");
  const seenPaths = new Set<string>();
  for (const page of doc.pages ?? []) {
    if (!page.path.startsWith("/") || seenPaths.has(page.path)) issues.push("Invalid or duplicate page path: " + page.path);
    seenPaths.add(page.path);
    const seen = new Set<string>();
    for (const section of page.sections ?? []) {
      if (!section.id || seen.has(section.id)) issues.push("Missing or duplicate section id on " + page.path);
      seen.add(section.id);
      if (!section.preset || !section.type) issues.push("Section needs a type and preset: " + section.id);
    }
  }
  return issues;
}
