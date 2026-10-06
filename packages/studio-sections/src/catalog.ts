import type { SiteSection } from "../../site-contracts/src/site-document";

export const catalog = [
  { preset: "studio/editorial-hero", type: "media-hero", title: "Editorial hero", description: "Oversized introduction with optional brand-owned media.", origin: "hero", capabilities: ["media-resolver"] },
  { preset: "studio/capability-grid", type: "showcase", title: "Capability grid", description: "Ordered cards for services, collections or ways to help.", origin: "features", capabilities: [] },
  { preset: "studio/impact-strip", type: "statement", title: "Impact strip", description: "Ordered facts, highlights and customer-supplied outcomes.", origin: "metrics", capabilities: [] },
  { preset: "studio/media-diptych", type: "showcase", title: "Media diptych", description: "Two independent editorial panels with media and links.", origin: "new canonical composition", capabilities: ["media-resolver"] },
  { preset: "studio/editorial-statement", type: "statement", title: "Editorial statement", description: "A quiet typographic story and destination link.", origin: "hero typography", capabilities: [] },
  { preset: "studio/inquiry", type: "form", title: "Project inquiry", description: "A form surface requiring an authorized inquiry provider.", origin: "form", capabilities: ["inquiry-provider"] },
] as const;

export function createSection(preset: string, id: string): SiteSection {
  const item = catalog.find(entry => entry.preset === preset);
  if (!item) throw new Error("Preset is not installed");
  return {
    id, type: item.type, preset, settings: { surface: "paper", spacing: "lg", minHeight: "auto", backgroundMediaKey: "" },
    data: { eyebrow: "", heading: "", body: "", ctaLabel: "", ctaHref: "", mediaKey: "", alt: "" },
    blocks: [],
  };
}
export function moveItem<T>(items: T[], index: number, delta: number) {
  const next = [...items], target = index + delta;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
