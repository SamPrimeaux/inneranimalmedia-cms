import type { SectionInstance } from "@inneranimalmedia/site-contracts";
import { escapeHtml, type RenderContext } from "../context.js";
import { registerSection } from "../registry.js";

export interface MediaHeroData {
  eyebrow?: string;
  heading: string;
  body?: string;
  mediaKey?: string;
  mediaAlt?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

function actionMarkup(
  action: MediaHeroData["primaryAction"],
  className: string,
): string {
  if (!action) return "";
  return '<a class="' + className + '" href="' + escapeHtml(action.href) + '">' +
    escapeHtml(action.label) + "</a>";
}

export function renderMediaHero(
  instance: SectionInstance,
  context: RenderContext,
): string {
  const data = instance.data as unknown as MediaHeroData;
  if (!data.heading) throw new Error("media-hero.heading is required");

  const mediaUrl = data.mediaKey ? context.resolveMedia(data.mediaKey) : null;
  const media = mediaUrl
    ? '<figure class="iam-media-hero__media"><img src="' + escapeHtml(mediaUrl) +
      '" alt="' + escapeHtml(data.mediaAlt ?? "") + '"></figure>'
    : '<div class="iam-media-hero__media iam-media-hero__placeholder" aria-hidden="true"></div>';

  return [
    '<div class="iam-media-hero">',
    media,
    '<div class="iam-media-hero__scrim" aria-hidden="true"></div>',
    '<div class="iam-media-hero__copy">',
    data.eyebrow
      ? '<p class="iam-media-hero__eyebrow">' + escapeHtml(data.eyebrow) + "</p>"
      : "",
    '<h1 class="iam-media-hero__heading">' + escapeHtml(data.heading) + "</h1>",
    data.body
      ? '<p class="iam-media-hero__body">' + escapeHtml(data.body) + "</p>"
      : "",
    '<div class="iam-media-hero__actions">',
    actionMarkup(data.primaryAction, "iam-action iam-action--primary"),
    actionMarkup(data.secondaryAction, "iam-action iam-action--secondary"),
    "</div>",
    "</div>",
    "</div>",
  ].join("");
}

registerSection("media-hero", renderMediaHero);
