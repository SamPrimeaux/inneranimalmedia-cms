import type { SiteDocument, SiteSection } from "./site-document.js";

/**
 * Experimental content/binding proof. No database schema or published-site mutation.
 * Definitions and entries are content authority; templates and section packages are
 * presentation authority. A section's data is a projection, never a content store.
 */
export type ContentPrimitiveType = "text" | "richtext" | "number" | "boolean" | "asset" | "entry";
export type ContentValue = string | number | boolean | null | AssetRef | EntryRef | ContentValue[];
export type AssetRef = { kind: "asset"; key: string };
export type EntryRef = { kind: "entry"; id: string; type: string };

export interface ContentFieldDefinition {
  key: string;
  type: ContentPrimitiveType;
  required?: boolean;
  list?: boolean;
  /** Required for entry references; reject refs to other types. */
  referenceType?: string;
}

export interface ContentDefinition {
  id: string;
  version: number;
  fields: ContentFieldDefinition[];
}

export interface ContentEntry {
  id: string;
  /** Legacy fixtures can omit this; durable multi-tenant stores must supply it. */
  siteId?: string;
  definitionId: string;
  definitionVersion: number;
  fields: Record<string, ContentValue>;
}

export interface TypedSourceBinding {
  /** Section data property; not a field on the source content entry. */
  slot: string;
  entryId: string;
  field: string;
  /** Asset slots can expose the stable AssetRef key to existing renderers. */
  project?: "value" | "asset-key" | "entry-list";
}

export interface SiteSectionBindings {
  pageId: string;
  sectionId: string;
  slots: TypedSourceBinding[];
}

export interface SiteBindingPlan {
  schema: "iam.cms.bindings.v1";
  siteId: string;
  sections: SiteSectionBindings[];
}

export interface RendererLock {
  id: string;
  package: string;
  version: string;
  integrity: string;
  /** Explicitly approved overrides; no cross-theme geometry substitution. */
  supportedOverrides: string[];
}

export class ContentContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentContractError";
  }
}

const fail = (message: string): never => { throw new ContentContractError(message); };
const isAssetRef = (v: ContentValue): v is AssetRef =>
  !!v && typeof v === "object" && !Array.isArray(v) && v.kind === "asset" && typeof v.key === "string";
const isEntryRef = (v: ContentValue): v is EntryRef =>
  !!v && typeof v === "object" && !Array.isArray(v) && v.kind === "entry" &&
  typeof v.id === "string" && typeof v.type === "string";

function matchesType(v: ContentValue, f: ContentFieldDefinition): boolean {
  if (v === null) return !f.required;
  if (f.list) return Array.isArray(v) && v.every((item) => matchesType(item, { ...f, list: false }));
  if (Array.isArray(v)) return false;
  switch (f.type) {
    case "text": case "richtext": return typeof v === "string";
    case "number": return typeof v === "number" && Number.isFinite(v);
    case "boolean": return typeof v === "boolean";
    case "asset": return isAssetRef(v) && v.key.trim().length > 0;
    case "entry": return isEntryRef(v) && (!f.referenceType || v.type === f.referenceType);
  }
}

export function validateContentEntry(entry: ContentEntry, definition: ContentDefinition): void {
  if (entry.definitionId !== definition.id || entry.definitionVersion !== definition.version) {
    fail(`Content definition mismatch for ${entry.id}`);
  }
  const known = new Map(definition.fields.map((f) => [f.key, f]));
  if (known.size !== definition.fields.length) fail(`Duplicate fields in ${definition.id}`);
  for (const key of Object.keys(entry.fields)) {
    const field = known.get(key);
    if (!field) throw new ContentContractError(`Unknown content field ${definition.id}.${key}`);
    if (!matchesType(entry.fields[key], field)) fail(`Invalid value for ${entry.id}.${key}`);
  }
  for (const field of definition.fields) {
    if (field.required && (entry.fields[field.key] === undefined || entry.fields[field.key] === null)) {
      fail(`Missing required content field ${entry.id}.${field.key}`);
    }
  }
}

/**
 * Materialize an immutable view of a SiteDocument. No persisted section defaults
 * are changed, and no renderer/geometry/style package is reinterpreted.
 */
export function bindSiteDocument(
  site: SiteDocument,
  plan: SiteBindingPlan,
  entries: readonly ContentEntry[],
  definitions: readonly ContentDefinition[],
): SiteDocument {
  if (plan.schema !== "iam.cms.bindings.v1" || plan.siteId !== site.id) {
    fail("Binding plan does not match site");
  }
  const entryById = new Map(entries.map((entry) => [entry.id, entry]));
  const definitionById = new Map(definitions.map((d) => [d.id, d]));
  if (entryById.size !== entries.length) fail("Duplicate content entry IDs");
  if (definitionById.size !== definitions.length) fail("Duplicate content definition IDs");
  for (const entry of entries) {
    if (entry.siteId && entry.siteId !== site.id) fail("Cross-site content entry " + entry.id);
    const definition = definitionById.get(entry.definitionId);
    if (!definition) throw new ContentContractError(`Unknown definition for ${entry.id}`);
    validateContentEntry(entry, definition);
  }

  const resolved = structuredClone(site);
  const used = new Set<string>();
  for (const binding of plan.sections) {
    const page = resolved.pages.find((p) => p.id === binding.pageId);
    if (!page) throw new ContentContractError(`Unknown binding page ${binding.pageId}`);
    const section: SiteSection | undefined = page.sections.find((s) => s.id === binding.sectionId);
    if (!section) throw new ContentContractError(`Unknown binding section ${binding.sectionId}`);
    for (const slot of binding.slots) {
      if (!/^[a-z][a-zA-Z0-9_]*$/.test(slot.slot)) fail("Unsupported slot path");
      const unique = `${binding.pageId}/${binding.sectionId}/${slot.slot}`;
      if (used.has(unique)) fail(`Duplicate binding ${unique}`);
      used.add(unique);
      const entry = entryById.get(slot.entryId);
      if (!entry) throw new ContentContractError(`Missing content entry ${slot.entryId}`);
      const value = entry.fields[slot.field];
      if (value === undefined) throw new ContentContractError(`Missing binding source ${entry.id}.${slot.field}`);
      if (slot.project === "asset-key") {
        if (!isAssetRef(value)) throw new ContentContractError(`Expected AssetRef at ${entry.id}.${slot.field}`);
        section.data[slot.slot] = value.key;
      } else if (slot.project === "entry-list") {
        if (!Array.isArray(value) || !value.every(isEntryRef)) {
          throw new ContentContractError(`Expected entry-reference list at ${entry.id}.${slot.field}`);
        }
        section.data[slot.slot] = value.map((ref) => {
          const item = entryById.get(ref.id);
          if (!item || item.definitionId !== ref.type) {
            throw new ContentContractError(`Broken content reference ${ref.id}`);
          }
          return { id: item.id, ...structuredClone(item.fields) };
        });
      } else {
        section.data[slot.slot] = structuredClone(value);
      }
    }
  }
  return resolved;
}

export function assertRendererLock(lock: RendererLock): void {
  if (!lock.id || !lock.package || !/^\d+\.\d+\.\d+/.test(lock.version) ||
      !/^sha256-[a-f0-9]{64}$/.test(lock.integrity) || !Array.isArray(lock.supportedOverrides)) {
    fail("Renderer must pin an exact package/version/sha256 and supported overrides");
  }
}
