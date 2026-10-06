import type { SiteSection } from "@inneranimalmedia/site-contracts";
import { renderPage, type PresetLibrary } from "./render.js";
import type { RenderContext } from "./context.js";

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** A section is independently renderable; no neighboring page/hero state leaks in. */
export function renderSiteSection(
  section: SiteSection,
  options: { context: RenderContext; presets: PresetLibrary },
): string {
  const data = { ...section.data };
  if (section.blocks) data.items = section.blocks.map((block) => ({ ...block.data }));
  const page = {
    id: section.id,
    type: "page-preset" as const,
    theme: options.context.theme,
    sections: [{ type: section.type, preset: section.preset, data }],
  };
  const html = renderPage(page, options);
  const surface = section.settings.surface ?? "canvas";
  const media = section.settings.backgroundMediaKey
    ? options.context.resolveMedia(section.settings.backgroundMediaKey)
    : null;
  const image = media
    ? '<img class="iam-site-section__background" src="' + escapeAttribute(media) + '" alt="" loading="lazy">'
    : "";
  return '<div class="iam-site-section" id="' + escapeAttribute(section.id) +
    '" data-surface="' + escapeAttribute(surface) +
    '" data-site-preset="' + escapeAttribute(section.preset) + '">' +
    image + html + "</div>";
}
