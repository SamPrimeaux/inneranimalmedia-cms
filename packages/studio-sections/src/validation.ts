import type { SiteDocument } from "../../site-contracts/src/site-document";
import { catalog } from "./catalog";

const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown) => typeof v === "string";
export function safeUrl(value: unknown): string | undefined {
  if (!str(value) || !value || /[\s\\\u0000-\u001f]/.test(value)) return undefined;
  if (/^\/(?!\/)/.test(value) || /^#[a-z0-9_-]+$/i.test(value)) return value;
  try { const url = new URL(value); if (url.protocol === "https:" && !url.username && !url.password) return value; } catch {}
  if (/^mailto:[^\s@]+@[^\s@]+$/i.test(value)) return value;
  return undefined;
}
export function validateBoundary(value: unknown): string[] {
  const issues: string[] = [];
  const error = (text: string) => { if (issues.length < 60) issues.push(text); };
  if (!object(value)) return ["Document must be an object"];
  if (value.schemaVersion !== 1) error("Unsupported schema version");
  if (!str(value.id) || !value.id || !str(value.theme)) error("Site ID and theme are required");
  if (!object(value.brand) || !str(value.brand.name) || !value.brand.name || !str(value.brand.description) || !safeUrl(value.brand.home)) error("Brand identity and safe home URL are required");
  if (value.design !== undefined) {
    if (!object(value.design)) error("Design must be an object");
    else for (const [key, v] of Object.entries(value.design)) if (!["accent","accentSoft","canvas","paper","ink"].includes(key) || !str(v) || !/^#[0-9a-f]{6}$/i.test(v)) error("Invalid design token: " + key);
  }
  const unique = (items: unknown[], label: string) => {
    const ids = new Set();
    for (const item of items) { if (!object(item) || !str(item.id) || !item.id || ids.has(item.id)) error(label + ": missing or duplicate ID"); else ids.add(item.id); }
  };
  const blocks = (value: unknown, kinds: string[], label: string) => {
    if (!Array.isArray(value)) { error(label + ": blocks must be an array"); return []; }
    if (value.length > 300) error(label + ": too many blocks");
    unique(value, label);
    for (const block of value) if (!object(block) || !kinds.includes(String(block.type))) error(label + ": invalid block type");
    return value.filter(object);
  };
  if (!object(value.header) || !object(value.header.settings) || typeof value.header.settings.sticky !== "boolean" || typeof value.header.settings.pill !== "boolean" || !object(value.header.announcement) || typeof value.header.announcement.enabled !== "boolean" || !Array.isArray(value.header.announcement.messages) || !value.header.announcement.messages.every(str)) error("Header settings and announcement are required");
  if (!object(value.footer) || !object(value.footer.settings) || !["canvas","paper","muted","inverse","image"].includes(String(value.footer.settings.background)) || !str(value.footer.settings.copyright)) error("Footer settings are required");
  for (const block of blocks(object(value.header) ? value.header.blocks : null, ["link","brand","action"], "Header")) {
    if (!str(block.label)) error("Header labels must be text");
    if (block.type === "action" && !["menu","search","discover","bag"].includes(String(block.action))) error("Invalid header action");
    if (block.href && !safeUrl(block.href)) error("Unsafe header URL");
  }
  for (const block of blocks(object(value.footer) ? value.footer.blocks : null, ["menu","newsletter","social","legal"], "Footer")) {
    if (!str(block.title)) error("Footer titles must be text");
    if (block.links !== undefined) {
      if (!Array.isArray(block.links)) error("Footer links must be an array");
      else { unique(block.links, "Footer links"); for (const link of block.links) if (!object(link) || !str(link.label) || !safeUrl(link.href)) error("Unsafe footer link"); }
    }
  }
  if (!Array.isArray(value.pages) || !value.pages.length || value.pages.length > 100) return [...issues, "Provide 1–100 pages"];
  unique(value.pages, "Pages");
  const paths = new Set();
  for (const page of value.pages) {
    if (!object(page)) { error("Page must be an object"); continue; }
    if (!str(page.path) || !/^\/(?!\/)[^?#\s\\]*$/.test(page.path) || paths.has(page.path)) error("Invalid or duplicate page path");
    paths.add(page.path);
    if (!str(page.title) || !str(page.description)) error("Page title and description must be text");
    if (!Array.isArray(page.sections) || page.sections.length > 200) { error("Page needs a section array (maximum 200)"); continue; }
    unique(page.sections, String(page.path));
    for (const section of page.sections) {
      if (!object(section) || !str(section.type) || !str(section.preset) || !object(section.data) || !object(section.settings)) { error("Section needs type, preset, settings and data"); continue; }
      const s = section.settings;
      if (s.surface !== undefined && !["canvas","paper","muted","inverse","image"].includes(String(s.surface))) error("Invalid surface");
      if (s.spacing !== undefined && !["none","sm","md","lg"].includes(String(s.spacing))) error("Invalid spacing");
      if (s.minHeight !== undefined && !["auto","screen"].includes(String(s.minHeight))) error("Invalid height");
      if (s.backgroundMediaKey !== undefined && !str(s.backgroundMediaKey)) error("Background media key must be text");
      const known = catalog.find(item => item.preset === section.preset);
      if (known && known.type !== section.type) error("Preset and type do not match");
      const checkData = (data: Record<string, unknown>) => {
        for (const [key, v] of Object.entries(data)) {
          if (["eyebrow","heading","body","title","caption","alt","ctaLabel","ctaHref","href","mediaKey"].includes(key) && !str(v)) error("Expected text for " + key);
          if (/^(href|ctaHref|secondaryCtaHref|videoUrl)$/i.test(key) && v && !safeUrl(v)) error("Unsafe URL: " + key);
          if (["primaryAction","secondaryAction","action","cta"].includes(key) && object(v) && v.href && !safeUrl(v.href)) error("Unsafe nested action URL");
        }
      };
      checkData(section.data);
      if (section.blocks !== undefined) for (const block of blocks(section.blocks, ["item","text","media","product","link"], "Section")) {
        if (!object(block.data)) error("Block data must be an object"); else checkData(block.data);
      }
    }
  }
  return issues;
}
export function parseDocument(raw: string): SiteDocument {
  if (raw.length > 2_000_000) throw new Error("Document exceeds 2 MB");
  const value: unknown = JSON.parse(raw);
  const issues = validateBoundary(value);
  if (issues.length) throw new Error(issues.join("; "));
  return value as SiteDocument;
}
