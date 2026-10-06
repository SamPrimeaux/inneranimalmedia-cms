import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { createCmsEditorialInstall, defaultEditorialSection } from "../integration/host-adapters/cms-editorial-publisher.js";
export function installLocalEditorial({ root, pageId, preset, id }) {
  const dbFile = path.join(root, ".agentsam/cms.sqlite");
  if (!fs.existsSync(dbFile)) throw new Error("Initialize CMS runtime first");
  const section = defaultEditorialSection(preset, id ?? "editorial-" + randomUUID().slice(0, 8));
  const payload = createCmsEditorialInstall(pageId, section);
  const db = new DatabaseSync(dbFile);
  try {
    const page = db.prepare("SELECT id FROM cms_pages WHERE id=?").get(pageId);
    if (!page) throw new Error("CMS page not found: " + pageId);
    const last = db.prepare("SELECT MAX(sort_order) AS position FROM cms_sections WHERE page_id=?").get(pageId);
    const position = Number(last?.position ?? 0) + 10;
    db.prepare("INSERT INTO cms_sections(id,page_id,name,type,fields_json,sort_order) VALUES(?,?,?,?,?,?)")
      .run(section.id, pageId, payload.section_name, payload.section_type,
        JSON.stringify(payload.section_data), position);
    return { ok: true, pageId, sectionId: section.id, preset, sortOrder: position };
  } finally { db.close(); }
}
