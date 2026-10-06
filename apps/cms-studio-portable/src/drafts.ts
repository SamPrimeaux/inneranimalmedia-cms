import type { SiteDocument } from "../../../packages/site-contracts/src/site-document";
import { parseDocument } from "../../../packages/studio-sections/src/validation";
export type DraftRevision = { id: string; createdAt: string; document: SiteDocument };
const key = "inneranimal.studio.canonical.v1";
export function loadRevisions(): DraftRevision[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const values = JSON.parse(raw);
  if (!Array.isArray(values)) throw new Error("Saved draft history is invalid");
  return values.map(v => {
    if (typeof v.id !== "string" || typeof v.createdAt !== "string") throw new Error("Saved revision is invalid");
    return {id:v.id,createdAt:v.createdAt,document:parseDocument(JSON.stringify(v.document))};
  });
}
export function saveRevision(document: SiteDocument): DraftRevision {
  const snapshot = parseDocument(JSON.stringify(document));
  const revision = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), document:snapshot };
  const revisions = [...loadRevisions(),revision].slice(-40);
  localStorage.setItem(key, JSON.stringify(revisions));
  return revision;
}
