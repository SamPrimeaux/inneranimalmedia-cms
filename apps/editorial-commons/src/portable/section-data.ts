import type { SiteSection, SiteContentBlock } from "../../../../packages/site-contracts/src/site-document.js";

/** The CMS SiteDocument contract is the single data model for every scene. */
export function sceneText(data: Record<string, unknown> | undefined, key: string, fallback = ""): string {
  const value = data?.[key];
  return typeof value === "string" ? value : fallback;
}
export function sceneHref(data: Record<string, unknown> | undefined, key: string, fallback = "#"): string {
  const candidate = sceneText(data, key, fallback).trim();
  // Renderers must not trust imported SiteDocuments; reject executable and
  // protocol-relative links even when a document bypassed the editor.
  return /^(\/(?!\/)|#[a-z0-9_-]+$|https:\/\/[a-z0-9.-]+(?::[0-9]+)?(?:[/?#][^\s]*)?$|mailto:[^\s@]+@[^\s@]+$)/i.test(candidate)
    ? candidate : fallback;
}
export function sceneBlocks(section: SiteSection | undefined): readonly SiteContentBlock[] {
  if (!section) return [];
  // No implicit fallback to any donor inventory when customer blocks are empty.
  return section.blocks ?? [];
}
export function sceneMedia(
  data: Record<string, unknown> | undefined,
  resolveMedia: ((key: string) => string | null) | undefined,
  fallbackKey = "",
): string | null {
  const key = sceneText(data, "mediaKey", fallbackKey);
  return key ? resolveMedia?.(key) ?? null : null;
}
export const SCENE_PRESETS = Object.freeze({
  hero: "commons/curtain-hero",
  wardrobe: "commons/wardrobe-gallery",
  diptych: "commons/split-media",
  statement: "commons/editorial-statement",
} as const);
