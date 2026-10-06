/**
 * A small, renderer-agnostic editing contract for section and item-block data.
 * Never exposes keys not deliberately allowed by this authoring surface.
 *
 * React, HTML and future host renderers can all consume SiteDocument v1.
 * This is an edit projection over that document, not a second section model.
 */
export type EditableFieldKind = "text" | "long-text" | "media" | "url" | "number" | "boolean";

export interface EditableSectionField {
  key: string;
  label: string;
  kind: EditableFieldKind;
  value: string | number | boolean;
}

const FIELD_KEYS = new Set([
  "eyebrow", "heading", "subheading", "body", "description", "text", "caption",
  "kicker", "title", "label", "subtitle", "note", "author", "role", "badge",
  "price", "compareAtPrice", "ctaLabel", "ctaHref", "secondaryCtaLabel",
  "secondaryCtaHref", "buttonLabel", "href", "mediaKey", "imageKey",
  "posterKey", "alt", "mediaAlt", "quote", "placeholder", "videoUrl", "alignment",
  "open", "enabled", "autoplay", "reverse", "speed", "count",
]);
const MEDIA_FIELDS = new Set(["mediaKey", "imageKey", "posterKey"]);
const URL_FIELDS = new Set(["href", "ctaHref", "secondaryCtaHref", "videoUrl"]);
const LONG_FIELDS = new Set(["body", "description", "text", "quote", "note"]);
const NUMBER_FIELDS = new Set(["speed", "count"]);
const BOOL_FIELDS = new Set(["open", "enabled", "autoplay", "reverse"]);
const ACTION_ROOTS = ["primaryAction", "secondaryAction", "action", "cta"] as const;
const ACTION_LEAVES = new Set(["label", "href"]);

const EDITABLE_ORDER = [
  "eyebrow", "heading", "subheading", "body", "description", "text",
  "mediaKey", "imageKey", "posterKey", "ctaLabel", "ctaHref",
];

function fieldKind(key: string, value: unknown): EditableFieldKind {
  if (MEDIA_FIELDS.has(key)) return "media";
  if (URL_FIELDS.has(key)) return "url";
  if (LONG_FIELDS.has(key)) return "long-text";
  if (BOOL_FIELDS.has(key) || typeof value === "boolean") return "boolean";
  if (NUMBER_FIELDS.has(key) || typeof value === "number") return "number";
  return "text";
}
function fieldLabel(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

/** Only first-level, known content keys are surfaced. Structured data stays intact. */
export function editableSectionFields(data: Record<string, unknown>): EditableSectionField[] {
  const scalar = Object.entries(data)
    .filter(([key, value]) =>
      FIELD_KEYS.has(key) && (typeof value === "string" || typeof value === "number" ||
        typeof value === "boolean"))
    .sort(([a], [b]) => {
      const ai = EDITABLE_ORDER.indexOf(a);
      const bi = EDITABLE_ORDER.indexOf(b);
      return (ai < 0 ? 100 : ai) - (bi < 0 ? 100 : bi);
    })
    .map(([key, value]) => ({
      key, label: fieldLabel(key), kind: fieldKind(key, value),
      value: value as string | number | boolean,
    }));
  // Existing action objects are a declared, two-level exception to the
  // first-level rule. Arbitrary nested objects and arrays remain private.
  const actions: EditableSectionField[] = ACTION_ROOTS.flatMap((parent) => {
    const value = data[parent];
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    return Object.entries(value)
      .filter(([leaf, content]) => ACTION_LEAVES.has(leaf) && typeof content === "string")
      .map(([leaf, content]) => ({
        key: parent + "." + leaf,
        label: fieldLabel(parent) + " " + fieldLabel(leaf),
        kind: fieldKind(leaf, content),
        value: content as string,
      }));
  });
  return [...scalar, ...actions];
}

export interface FieldEditResult {
  ok: boolean;
  reason?: "unknown-field" | "bad-url" | "bad-media-key" | "invalid-number";
}

/**
 * Apply one user edit only to an already-existing, whitelisted primitive.
 * The caller provides known media keys; it cannot silently insert a new URL,
 * a provider secret, an arbitrary nested property, or executable markup.
 */
export function applySectionFieldEdit(
  data: Record<string, unknown>,
  key: string,
  input: string | boolean,
  options: { mediaKeys?: ReadonlySet<string> } = {},
): FieldEditResult {
  const field = editableSectionFields(data).find((item) => item.key === key);
  if (!field) return { ok: false, reason: "unknown-field" };
  const raw = typeof input === "string" ? input : String(input);
  const path = key.split(".");
  let target = data;
  let targetKey = key;
  if (path.length === 2) {
    if (!ACTION_ROOTS.some((root) => root === path[0]) || !ACTION_LEAVES.has(path[1])) {
      return { ok: false, reason: "unknown-field" };
    }
    const nested = data[path[0]];
    if (!nested || typeof nested !== "object" || Array.isArray(nested)) {
      return { ok: false, reason: "unknown-field" };
    }
    target = nested as Record<string, unknown>;
    targetKey = path[1];
  }
  if (field.kind === "media") {
    if (raw && !options.mediaKeys?.has(raw) && raw !== field.value)
      return { ok: false, reason: "bad-media-key" };
  }
  if (field.kind === "url") {
    if (raw && !/^(\/(?!\/)|#[a-z0-9_-]+$|https:\/\/[^/\s]+(?:\/[^\s]*)?$|mailto:[^\s@]+@[^\s@]+$)/i.test(raw))
      return { ok: false, reason: "bad-url" };
  }
  if (field.kind === "number") {
    const value = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(value)) return { ok: false, reason: "invalid-number" };
    target[targetKey] = value;
  } else if (field.kind === "boolean") {
    target[targetKey] = typeof input === "boolean" ? input : raw === "true";
  } else {
    target[targetKey] = raw;
  }
  return { ok: true };
}
