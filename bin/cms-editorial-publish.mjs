import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { extractCmsEditorialSection, renderCmsEditorialPage } from "../integration/host-adapters/cms-editorial-publisher.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "integration/host-adapters/editorial-assets");
const safeSlug = (value) => typeof value === "string" && /^[a-z0-9_-]{1,128}$/i.test(value);
function json(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { throw new Error("Invalid CMS JSON record"); }
}
function safeMediaAssets(db, siteId) {
  const media = {};
  const rows = db.prepare("SELECT url,metadata_json FROM cms_assets WHERE site_id=?").all(siteId);
  for (const row of rows) {
    const metadata = json(row.metadata_json, {});
    const key = metadata?.logical_key;
    if (typeof key === "string" && /^[a-z0-9_.-]+$/i.test(key) &&
      typeof row.url === "string" &&
      (row.url.startsWith("/") && !row.url.startsWith("//") || /^https:\/\//i.test(row.url))) {
      media[key] = row.url;
    }
  }
  return media;
}
/** Publishes actual cms_runtime tables to a local HTML + React runtime snapshot. */
export function publishLocalEditorial({ root, pageId }) {
  if (!safeSlug(pageId)) throw new Error("Valid --page ID required");
  const dbFile = path.join(root, ".agentsam/cms.sqlite");
  if (!fs.existsSync(dbFile)) throw new Error("Initialize CMS runtime first");
  const db = new DatabaseSync(dbFile);
  try {
    const page = db.prepare("SELECT * FROM cms_pages WHERE id=?").get(pageId);
    if (!page) throw new Error("CMS page not found: " + pageId);
    const site = db.prepare("SELECT * FROM cms_sites WHERE id=?").get(page.site_id);
    if (!site || !safeSlug(site.id)) throw new Error("CMS site identity missing or unsafe");
    if (!safeSlug(page.slug)) throw new Error("Unsafe CMS page slug");
    const rows = db.prepare("SELECT * FROM cms_sections WHERE page_id=? ORDER BY sort_order,id").all(pageId);
    if (!rows.length) throw new Error("Page has no sections");
    const sections = rows.map((row) => {
      const data = json(row.fields_json, {});
      const section = extractCmsEditorialSection({ section_data: data });
      return { section_data: data, is_visible: row.visible !== 0, section };
    });
    const theme = json(site.theme_json, {});
    const design = theme.design && typeof theme.design === "object" ? theme.design : undefined;
    const media = safeMediaAssets(db, site.id);
    const publicationRoot = path.join(root, ".agentsam/cms-content/publications");
    const base = "/" + site.id + "/assets/editorial";
    const html = renderCmsEditorialPage({
      page, sections, assetBaseUrl: base, brand: { name: site.name }, design, media,
    });
    const destination = path.join(publicationRoot, site.id, page.slug, "index.html");
    const assetDestination = path.join(publicationRoot, site.id, "assets/editorial");
    for (const file of ["editorial-runtime.js", "editorial-runtime.css"]) {
      if (!fs.existsSync(path.join(ASSETS, file))) throw new Error("Bundled editorial runtime missing: " + file);
    }
    fs.mkdirSync(assetDestination, { recursive: true });
    for (const file of ["editorial-runtime.js", "editorial-runtime.css"]) {
      fs.copyFileSync(path.join(ASSETS, file), path.join(assetDestination, file));
    }
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const temp = destination + "." + randomUUID() + ".tmp";
    fs.writeFileSync(temp, html);
    fs.renameSync(temp, destination);
    const previous = db.prepare("SELECT revision_num FROM cms_publications WHERE page_id=?").get(pageId);
    const revisionNum = (Number(previous?.revision_num) || 0) + 1;
    const publicationId = randomUUID();
    const now = new Date().toISOString();
    const route = "/" + page.slug + "/";
    const snapshot = JSON.stringify(sections.map((row) => row.section));
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare("INSERT INTO cms_revisions(id,page_id,kind,created_at,label,snapshot_json) VALUES(?,?,?,?,?,?)")
        .run(randomUUID(), pageId, "publication", now, "Editorial publication " + revisionNum, snapshot);
      db.prepare("INSERT INTO cms_publications (page_id,publication_id,route,revision_num,theme,sections_json,published_at,metadata_json) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(page_id) DO UPDATE SET publication_id=excluded.publication_id,route=excluded.route,revision_num=excluded.revision_num,theme=excluded.theme,sections_json=excluded.sections_json,published_at=excluded.published_at,metadata_json=excluded.metadata_json")
        .run(pageId, publicationId, route, revisionNum, "editorial-react", snapshot, now,
          JSON.stringify({ schema_id: "inneranimalmedia.cms-editorial-publication.v1",
            assetBaseUrl: base, output: site.id + "/" + page.slug + "/index.html" }));
      db.prepare("UPDATE cms_pages SET status='published' WHERE id=?").run(pageId);
      db.exec("COMMIT");
    } catch (error) { db.exec("ROLLBACK"); throw error; }
    return { ok: true, publicationId, revisionNum, pageId, route,
      output: path.relative(root, destination),
      serveRoot: path.relative(root, publicationRoot), assetBaseUrl: base,
      sectionCount: sections.length };
  } finally { db.close(); }
}
