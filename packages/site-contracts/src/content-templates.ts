import type { SiteDocument, SitePage, SiteSection } from "./site-document.js";
import {
  assertRendererLock, bindSiteDocument, ContentContractError,
  type ContentDefinition, type ContentEntry, type EntryRef,
  type RendererLock, type SiteBindingPlan, type TypedSourceBinding,
} from "./content-bindings.js";

/**
 * Additive contract over SiteDocument v1 and content-bindings v1.
 * Templates are presentation, entries are independent content, assignments
 * pick a template/resource, and bindings project fields at render time.
 * This module does not introduce a new CMS database or editor.
 */
export const TEMPLATE_REGISTRY_SCHEMA = "iam.cms.template-registry.v1" as const;

export interface TemplateSourceBinding {
  sectionId: string;
  slot: string;
  field: string;
  project?: TypedSourceBinding["project"];
}
export interface CmsPageTemplate {
  id: string;
  version: number;
  sourceTheme: string;
  resourceType?: string;
  sections: SiteSection[];
  bindings: TemplateSourceBinding[];
  /** Existing SiteDocument global owners, not duplicate page sections. */
  globalGroups: Array<"announcement" | "header" | "footer">;
}
export interface CmsTemplateAssignment {
  pageId: string;
  templateId: string;
  templateVersion: number;
  resource?: EntryRef;
}
export interface CmsTemplateRegistry {
  schema: typeof TEMPLATE_REGISTRY_SCHEMA;
  siteId: string;
  templates: CmsPageTemplate[];
  assignments: CmsTemplateAssignment[];
}
const idPattern = /^[a-zA-Z][a-zA-Z0-9._:-]{0,127}$/;
const slotPattern = /^[a-z][a-zA-Z0-9_]*$/;
const globalGroups = new Set(["announcement", "header", "footer"]);
function fail(message: string): never { throw new ContentContractError(message); }
function unique<T>(values: readonly T[], key: (v:T) => string, what: string): void {
  const seen = new Set<string>();
  for (const item of values) {
    const id = key(item);
    if (seen.has(id)) fail("Duplicate " + what + ": " + id);
    seen.add(id);
  }
}
function verifyTemplate(template: CmsPageTemplate): void {
  if (!idPattern.test(template.id) || !Number.isSafeInteger(template.version) ||
      template.version < 1 || !template.sourceTheme?.trim() ||
      !Array.isArray(template.sections) || !Array.isArray(template.bindings) ||
      !Array.isArray(template.globalGroups)) fail("Malformed page template");
  unique(template.sections, s => s.id, "template section");
  for (const s of template.sections) {
    if (!idPattern.test(s.id) || !s.type || !s.preset ||
        !s.settings || !s.data || Array.isArray(s.data)) fail("Malformed section " + s.id);
    unique(s.blocks || [], b => b.id, "block");
    for (const block of s.blocks || []) {
      if (!idPattern.test(block.id) || !block.type || !block.data) fail("Malformed block");
    }
  }
  unique(template.globalGroups, g => g, "global group");
  for (const group of template.globalGroups) if (!globalGroups.has(group)) fail("Unknown global group");
  unique(template.bindings, b => b.sectionId + "/" + b.slot, "source slot");
  for (const b of template.bindings) {
    if (!template.sections.some(s => s.id === b.sectionId) ||
        !slotPattern.test(b.slot) || !slotPattern.test(b.field) ||
        (b.project && !["value", "asset-key", "entry-list"].includes(b.project))) {
      fail("Invalid template source binding");
    }
  }
  if (template.bindings.length && !template.resourceType) fail("Bound template must name a resource type");
}

/**
 * Compare page composition with assigned template. Fail closed on structural
 * drift. A content update may NOT replace/reorder its renderer/blocks.
 */
export function assertTemplateAlignment(
  site: SiteDocument,
  registry: CmsTemplateRegistry,
  entries: readonly ContentEntry[] = [],
  definitions: readonly ContentDefinition[] = [],
): void {
  if (registry.schema !== TEMPLATE_REGISTRY_SCHEMA || registry.siteId !== site.id) {
    fail("Template registry site/schema mismatch");
  }
  unique(registry.templates, t => t.id + "@" + t.version, "template version");
  unique(registry.assignments, a => a.pageId, "page assignment");
  unique(entries, e => e.id, "content entry");
  unique(definitions, d => d.id, "content definition");
  const definitionsById = new Map(definitions.map(d => [d.id,d]));
  const entriesById = new Map(entries.map(e => [e.id,e]));
  for (const entry of entries) {
    if (entry.siteId && entry.siteId !== site.id) fail("Cross-site content entry");
    if (definitionsById.get(entry.definitionId)?.version !== entry.definitionVersion) {
      fail("Unknown content definition/version: " + entry.id);
    }
  }
  for (const template of registry.templates) verifyTemplate(template);
  for (const assigned of registry.assignments) {
    const page = site.pages.find(p=>p.id===assigned.pageId);
    if (!page) fail("Unknown assigned page " + assigned.pageId);
    const template = registry.templates.find(t =>
      t.id === assigned.templateId && t.version === assigned.templateVersion);
    if (!template) fail("Template/version not installed");
    if (page.sections.length !== template.sections.length) {
      fail("Template layout differs; explicit approved migration required");
    }
    for (let i=0;i<page.sections.length;i++) {
      const actual = page.sections[i], expected = template.sections[i];
      if (actual.id !== expected.id || actual.preset !== expected.preset || actual.type !== expected.type ||
          JSON.stringify((actual.blocks||[]).map(b=>[b.id,b.type])) !==
          JSON.stringify((expected.blocks||[]).map(b=>[b.id,b.type]))) {
        fail("Template changed section/order/block identity");
      }
    }
    if (template.bindings.length && !assigned.resource) fail("Typed resource assignment required");
    if (assigned.resource) {
      if (assigned.resource.type !== template.resourceType) fail("Resource type mismatch");
      const entry = entriesById.get(assigned.resource.id);
      if (!entry || entry.definitionId !== assigned.resource.type) fail("Missing assigned entry");
      if (entry.siteId && entry.siteId !== site.id) fail("Cross-site resource");
    }
  }
}
/** Pure view projection: site sections, source records and templates remain unchanged. */
export function bindAssignedTemplates(
  site: SiteDocument, registry: CmsTemplateRegistry,
  entries: readonly ContentEntry[], definitions: readonly ContentDefinition[],
): SiteDocument {
  assertTemplateAlignment(site,registry,entries,definitions);
  const sections: SiteBindingPlan["sections"] = [];
  for (const assigned of registry.assignments) {
    const t = registry.templates.find(x =>
      x.id === assigned.templateId && x.version === assigned.templateVersion)!;
    for (const section of t.sections) {
      const b = t.bindings.filter(x=>x.sectionId===section.id);
      if (!b.length) continue;
      sections.push({
        pageId:assigned.pageId,sectionId:section.id,
        slots:b.map(({slot,field,project})=>({slot,field,entryId:assigned.resource!.id,
          ...(project?{project}:{})})),
      });
    }
  }
  return bindSiteDocument(site,{schema:"iam.cms.bindings.v1",siteId:site.id,sections},entries,definitions);
}
/** Create a new page explicitly; never repurpose an existing published route. */
export function instantiatePageTemplate(
  site: SiteDocument, template: CmsPageTemplate,
  page: Pick<SitePage,"id"|"path"|"title"|"description">,
  crossThemeRendererLocks: readonly RendererLock[] = [],
): SiteDocument {
  verifyTemplate(template);
  if (!idPattern.test(page.id) || !/^\/(?!\/)[^?#\s\\]*$/.test(page.path) || !page.title.trim()) {
    fail("Invalid new page identity/path/title");
  }
  if (site.pages.some(p=>p.id===page.id || p.path===page.path)) fail("Page already exists");
  if (template.sourceTheme !== site.theme) {
    for (const s of template.sections) {
      const lock = crossThemeRendererLocks.find(lock=>lock.id===s.preset);
      if (!lock) fail("Cross-theme renderer not pinned: " + s.preset);
      assertRendererLock(lock);
    }
  }
  const next = structuredClone(site);
  next.pages.push({...structuredClone(page),sections:structuredClone(template.sections)});
  return next;
}
