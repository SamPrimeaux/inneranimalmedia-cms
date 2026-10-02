import {
  normalizeLayout,
  type SectionInstance,
} from "@inneranimalmedia/site-contracts";
import type { RenderContext } from "./context.js";
import { getSection } from "./registry.js";

const WIDTH_CLASS = {
  full: "iam-layout-full",
  max: "iam-layout-max",
  wide: "iam-layout-wide",
  content: "iam-layout-content",
  reading: "iam-layout-reading",
} as const;

const SPACING_CLASS = {
  none: "",
  sm: "iam-section-space-sm",
  md: "iam-section-space-md",
  lg: "iam-section-space-lg",
} as const;

export function renderSection(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const layout = normalizeLayout(instance.layout);
  const inner = getSection(instance.type)(instance, context);
  const container = WIDTH_CLASS[layout.width];
  const spacing = SPACING_CLASS[layout.spacing.block];
  const safe = instance.safeArea?.enabled === false ? "" : "iam-safe-inline";
  const attrs = [
    'data-section="' + instance.type + '"',
    'data-theme="' + context.theme + '"',
    instance.variant ? 'data-variant="' + instance.variant + '"' : "",
    'data-bleed="' + layout.bleed + '"',
  ].filter(Boolean).join(" ");

  const classes = [container, safe, spacing].filter(Boolean).join(" ");

  if (layout.bleed === "background" || layout.bleed === "media") {
    return '<section ' + attrs + ' class="iam-layout-full ' + spacing +
      '"><div class="' + [container, safe].filter(Boolean).join(" ") +
      '">' + inner + "</div></section>";
  }

  return '<section ' + attrs + ' class="' + classes + '">' + inner + "</section>";
}


export interface PresetLibrary {
  get(type: string, presetId: string): import("@inneranimalmedia/site-contracts").SectionPreset | undefined;
}

export function presetLibraryFrom(
  presets: import("@inneranimalmedia/site-contracts").SectionPreset[],
): PresetLibrary {
  const map = new Map(
    presets.map((preset) => [preset.type + ":" + preset.id, preset]),
  );
  return {
    get: (type, id) => map.get(type + ":" + id),
  };
}

export function renderPage(
  page: import("@inneranimalmedia/site-contracts").PagePreset,
  options: {
    context: RenderContext;
    presets: PresetLibrary;
  },
): string {
  return page.sections.map((entry) => {
    if (!entry.preset) {
      throw new Error("Page entry requires preset: " + entry.type);
    }
    const preset = options.presets.get(entry.type, entry.preset);
    if (!preset) {
      throw new Error("Unknown preset: " + entry.type + ":" + entry.preset);
    }

    return renderSection({
      ...preset,
      variant: entry.variant ?? preset.variant,
      data: {
        ...preset.data,
        ...(entry.data ?? {}),
      },
    }, options.context);
  }).join("\n");
}
