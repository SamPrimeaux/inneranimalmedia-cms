import type { SectionInstance } from "@inneranimalmedia/site-contracts";
import type { RenderContext } from "./context.js";

export type SectionRenderer = (
  instance: SectionInstance,
  context: RenderContext,
) => string;

const renderers = new Map<string, SectionRenderer>();

export function registerSection(type: string, renderer: SectionRenderer): void {
  renderers.set(type, renderer);
}

export function getSection(type: string): SectionRenderer {
  const renderer = renderers.get(type);
  if (!renderer) throw new Error("Unknown section type: " + type);
  return renderer;
}

export function registeredSectionTypes(): string[] {
  return [...renderers.keys()].sort();
}
