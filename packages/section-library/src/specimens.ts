/**
 * Customer-neutral component specimens: card treatment, motion, links, brand-book presentation.
 * Consume installed design tokens, fonts, content and routes. No AgentSam Brand pipeline coupling.
 * Source receipts: Theme Tools examples/meaux-donors/; candidates pending CMS install certification.
 */
import { escapeHtml } from "./context.js";

type Tokens = {
  background?: string; surface?: string; text?: string; muted?: string;
  accent?: string; accentSoft?: string; glow?: string; border?: string;
  fontFamily?: string; headingFontFamily?: string; radius?: string | number;
  buttonRadius?: string | number; spacing?: string | number;
};
export type SpecimenTokens = Tokens;
export type SpecimenCard = {
  id: string; title: string; description?: string; eyebrow?: string;
  href?: string; logo?: string; logoAlt?: string; tone?: string; target?: "_blank" | "_self";
};
export type SpecimenBrand = {
  id: string; name: string; tagline?: string; description?: string;
  tokens?: Tokens; palette?: Record<string, string>;
  typeSamples?: { role: string; family: string; sample?: string; weight?: number }[];
  variant?: "original" | "enhanced" | string;
};
export type SpecimenCardGrid = {
  title?: string; description?: string; cards: SpecimenCard[];
  tokens?: Tokens; columns?: number; entrance?: boolean; variant?: string;
};
export type SpecimenLink = { id: string; label: string; href: string };
export type SpecimenLinks = { title: string; accentTitle?: string; links: SpecimenLink[]; tokens?: Tokens };

const ORIGINAL: Required<Pick<Tokens, "background" | "surface" | "text" | "muted" | "accent" | "accentSoft" | "glow" | "border" | "fontFamily" | "headingFontFamily" | "radius" | "buttonRadius" | "spacing">> = {
  background: "#333333", surface: "#2a2a2a", text: "#ffffff", muted: "#c0c0c0",
  accent: "#1F97A9", accentSoft: "#FF7619", glow: "#1F97A944",
  border: "#1F97A966", fontFamily: "Inter, sans-serif",
  headingFontFamily: "Inter, sans-serif", radius: "20px", buttonRadius: "22px", spacing: "24px",
};
const ENHANCED = {
  ...ORIGINAL, background: "#051b1e", surface: "#0a2427", text: "#f0f9fa",
  muted: "#c8e1e6", border: "#4aabb844", glow: "#4aabb855",
};
export const MEAUX_ORIGINAL_DESIGN = Object.freeze({ ...ORIGINAL });
export const MEAUX_ENHANCED_DESIGN = Object.freeze({ ...ENHANCED });
export const MEAUX_SOURCE_SPECIMENS = Object.freeze([
  { id: "meaux.partner.glass-card", origin: "meaux-partners", type: "card", status: "candidate" },
  { id: "meaux.motion.card-lift-sheen", origin: "meaux-partners", type: "motion", status: "candidate" },
  { id: "meaux.motion.center-underline", origin: "meaux-partners", type: "motion", status: "candidate" },
  { id: "meaux.motion.scroll-reveal", origin: "meaux-partners", type: "motion", status: "candidate" },
  { id: "meaux.button.invert-link", origin: "meaux-help", type: "button", status: "candidate" },
  { id: "meaux.brand.original-book", origin: "meaux-brand", type: "presentation", status: "candidate" },
  { id: "meaux.brand.enhanced-book", origin: "meaux-brand", type: "presentation", status: "candidate" },
] as const);

const STYLE_KEYS: Record<keyof Tokens, string> = {
  background: "--iam-sp-bg", surface: "--iam-sp-surface", text: "--iam-sp-text",
  muted: "--iam-sp-muted", accent: "--iam-sp-accent", accentSoft: "--iam-sp-accent-2",
  glow: "--iam-sp-glow", border: "--iam-sp-border",
  fontFamily: "--iam-sp-font", headingFontFamily: "--iam-sp-heading-font",
  radius: "--iam-sp-radius", buttonRadius: "--iam-sp-button-radius", spacing: "--iam-sp-spacing",
};
function safeStyleValue(value: string | number, kind: "color" | "length" | "font"): string {
  const text = String(value).trim();
  if (!text || text.length > 160 || /[;{}<>\\]/.test(text) ||
    /(?:url\s*\(|expression\s*\(|@import|!important)/i.test(text)) throw new TypeError("Unsafe design-token value");
  if (kind === "length" && !(typeof value === "number" && Number.isFinite(value)) &&
    !/^(?:0|-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|%|vw|vh|vmin|vmax|ch))$/.test(text)) {
    throw new TypeError("Radius/spacing must be a CSS length");
  }
  if (kind === "color" && !/^(?:#[0-9a-f]{3,8}|(?:rgba?|hsla?|oklch|oklab)\([a-z0-9.,%+\-\/ ]+\)|var\(--[a-z0-9-]+\))$/i.test(text)) {
    throw new TypeError("Color must be a CSS color or variable");
  }
  if (kind === "font" && !/^[\p{L}\p{N} .,'"\-]+$/u.test(text)) throw new TypeError("Invalid font-family list");
  return text;
}
function escapeAttr(value: unknown): string { return escapeHtml(value ?? ""); }
function cssTokens(options: Tokens = {}): string {
  const out: string[] = [];
  for (const [key, value] of Object.entries(options)) {
    if (value == null || !(key in STYLE_KEYS)) continue;
    const type = ["fontFamily", "headingFontFamily"].includes(key) ? "font" :
      ["radius", "buttonRadius", "spacing"].includes(key) ? "length" : "color";
    const formatted = safeStyleValue(value as string | number, type as "font" | "length" | "color");
    out.push(STYLE_KEYS[key as keyof Tokens] + ":" + (type === "length" && typeof value === "number" ? formatted + "px" : formatted));
  }
  return out.length ? ' style="' + escapeAttr(out.join(";")) + '"' : "";
}
function safeHref(href: string): string {
  if (typeof href !== "string" || href.length > 2048) throw new TypeError("Invalid href");
  const value = href.trim();
  if (/^(?:https:\/\/|mailto:|tel:)/i.test(value) || /^\/(?!\/)[^\u0000-\u001f]*$/.test(value) ||
      /^#[a-z0-9_-]+$/i.test(value)) return escapeAttr(value);
  throw new TypeError("Only HTTPS, route paths, mailto, tel or local anchors are accepted");
}
function safeId(value: string): string {
  if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,99}$/.test(value)) throw new TypeError("Invalid specimen id");
  return value;
}
function safeImage(url?: string): string | null {
  if (!url) return null;
  if (/^https:\/\/[^\s<>]+$/i.test(url) || /^\/(?!\/)[^\s<>]*$/.test(url)) return escapeAttr(url);
  throw new TypeError("Image URL must use HTTPS or local path");
}
function title(text: string, level: 2 | 3 = 2): string {
  return '<h' + level + ' class="iam-sp-title"><span>' + escapeHtml(text) + '</span></h' + level + '>';
}
export function renderSpecimenCards(input: SpecimenCardGrid): string {
  const all = input.cards ?? [];
  if (!Array.isArray(all) || all.length > 120) throw new TypeError("Invalid cards array");
  const cols = Number(input.columns ?? 3);
  if (!Number.isInteger(cols) || cols < 1 || cols > 6) throw new TypeError("Invalid columns");
  return '<section class="iam-specimens iam-sp-partners" data-sp-type="partner-cards"' +
    cssTokens(input.tokens) + '><div class="iam-sp-inner">' +
    (input.title ? title(input.title) : "") +
    (input.description ? '<p class="iam-sp-intro">' + escapeHtml(input.description) + '</p>' : "") +
    '<div class="iam-sp-grid" style="--iam-sp-columns:' + cols + '">' +
    all.map((card) => {
      const id = safeId(card.id);
      const media = safeImage(card.logo);
      const content = (media ? '<span class="iam-sp-logo"><img src="' + media + '" alt="' +
        escapeAttr(card.logoAlt || "") + '" loading="lazy"></span>' : "") +
        '<span class="iam-sp-card-copy"><span class="iam-sp-card-title">' + escapeHtml(card.title) + '</span>' +
        (card.eyebrow ? '<span class="iam-sp-card-eyebrow">' + escapeHtml(card.eyebrow) + '</span>' : "") +
        (card.description ? '<span class="iam-sp-card-description">' + escapeHtml(card.description) + '</span>' : "") +
        (card.href ? '<span class="iam-sp-more">Learn more <span aria-hidden="true">→</span></span>' : "") + '</span>';
      const opening = card.href ? '<a class="iam-sp-card-link" href="' + safeHref(card.href) + '"' +
        (card.target === "_blank" ? ' target="_blank" rel="noopener noreferrer"' : "") + '>' :
        '<div class="iam-sp-card-link">';
      const close = card.href ? "</a>" : "</div>";
      const tone = card.tone ? cssTokens({ accent: card.tone, border: card.tone }) : "";
      return '<article id="' + id + '" class="iam-sp-card"' + tone +
        (input.entrance ? ' data-meaux-reveal=""' : "") + '>' +
        opening + content + close + '</article>';
    }).join("") + '</div></div></section>';
}
export function renderSpecimenLinks(input: SpecimenLinks): string {
  return '<section class="iam-specimens iam-sp-help"' + cssTokens(input.tokens) + '>' +
    '<div class="iam-sp-help-inner"><h2 class="iam-sp-help-heading">' +
    escapeHtml(input.title) + (input.accentTitle ? ' <span>' + escapeHtml(input.accentTitle) + '</span>' : "") +
    '</h2><div class="iam-sp-help-links">' +
    input.links.map(l => '<a class="iam-sp-help-link" data-link-id="' + safeId(l.id) +
      '" href="' + safeHref(l.href) + '">' + escapeHtml(l.label) + '</a>').join("") +
    '</div></div></section>';
}
export function renderBrandSystemPresentation(input: SpecimenBrand): string {
  safeId(input.id);
  const enhanced = input.variant === "enhanced";
  const base = enhanced ? ENHANCED : ORIGINAL;
  const tokens = { ...base, ...input.tokens };
  const palette = input.palette ?? {
    Orange: "#FF7619", Teal: "#1F97A9", Green: "#21c48c",
    ...(enhanced ? { Deep: "#051b1e", Steel: "#1a4a52", Shine: "#3a8b98", Light: "#4aabb8" } : {}),
  };
  const samples = input.typeSamples ?? [
    { role: "Display", family: tokens.headingFontFamily, sample: "Make it meaningful", weight: 800 },
    { role: "Body", family: tokens.fontFamily, sample: "Crafted with intention.", weight: 400 },
  ];
  const swatches = Object.entries(palette).map(([label, color]) => {
    const colorValue = safeStyleValue(color, "color");
    return '<div class="iam-sp-swatch" style="--iam-sp-swatch:' + escapeAttr(colorValue) +
      '"><span class="iam-sp-swatch-color"></span><strong>' + escapeHtml(label) +
      '</strong><code>' + escapeHtml(color) + '</code></div>';
  }).join("");
  const fonts = samples.map(s => {
    const family = safeStyleValue(s.family, "font");
    const weight = Number(s.weight ?? 400);
    if (!Number.isInteger(weight) || weight < 100 || weight > 1000) throw new TypeError("Invalid font weight");
    return '<div class="iam-sp-font-row"><span>' + escapeHtml(s.role) + '</span>' +
      '<strong style="font-family:' + escapeAttr(family) + ';font-weight:' + weight + '">' +
      escapeHtml(s.sample || s.family) + '</strong><small>' + escapeHtml(s.family) + '</small></div>';
  }).join("");
  return '<div id="' + input.id + '" class="iam-specimens iam-sp-brand-book"' +
    ' data-sp-type="brand-presentation" data-variant="' + (enhanced ? "enhanced" : "original") + '"' +
    cssTokens(tokens) + '><div class="iam-sp-brand-hero">' +
    '<div class="iam-sp-brand-kicker">Brand system · ' + (enhanced ? "Enhanced" : "Original") + '</div>' +
    '<h1>' + escapeHtml(input.name) + '</h1><p>' + escapeHtml(input.tagline || "") + '</p></div>' +
    '<div class="iam-sp-brand-grid"><section><h2>Color system</h2>' +
    '<p>' + escapeHtml(input.description || "A living collection of color roles.") + '</p>' +
    '<div class="iam-sp-swatches">' + swatches + '</div></section>' +
    '<section><h2>Typography</h2><div class="iam-sp-font-list">' + fonts + '</div></section>' +
    '<section><h2>Interaction & motion</h2><div class="iam-sp-motion-demo">' +
    '<div class="iam-sp-card"><div class="iam-sp-card-link"><span class="iam-sp-card-title">Lift & sheen</span><span class="iam-sp-card-description">Hover or focus to preview</span></div></div>' +
    '<a class="iam-sp-help-link" href="#' + input.id + '">Button inversion</a></div></section>' +
    '</div></div>';
}
