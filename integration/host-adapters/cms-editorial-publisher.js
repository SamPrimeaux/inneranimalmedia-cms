/**
 * Host-neutral CMS section installer and publication adapter.
 * No auth, database, tenant or R2 authority is assumed: the host must enforce
 * permissions and supply its own trusted site, media and bucket bindings.
 */
export const EDITORIAL_SECTION_SCHEMA = "inneranimalmedia.cms-editorial-section.v1";
export const EDITORIAL_PUBLICATION_SCHEMA = "inneranimalmedia.cms-editorial-publication.v1";
export const EDITORIAL_PRESETS = Object.freeze([
  ["commons/curtain-hero", "Curtain hero"],
  ["commons/wardrobe-gallery", "Category wardrobe"],
  ["commons/split-media", "Media diptych"],
  ["commons/editorial-statement", "Editorial statement"],
  ["commons/collection-carousel", "Collection carousel"],
  ["commons/lookbook-hotspots", "Interactive lookbook"],
  ["commons/faq-trust", "FAQ and answers"],
].map(([preset, title]) => Object.freeze({ preset, title })));
const KNOWN = new Set(EDITORIAL_PRESETS.map((item) => item.preset));
const TEXT = (value) => typeof value === "string" ? value : "";
const safeId = (value) => typeof value === "string" && /^[a-z0-9][a-z0-9_-]{0,127}$/i.test(value);
function safeHref(value) {
  return /^(\/(?!\/)|#[a-z0-9_-]+$|https:\/\/[a-z0-9.-]+(?::[0-9]+)?(?:[/?#][^\s]*)?$|mailto:[^\s@]+@[^\s@]+$)/i.test(value);
}
function validateData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Section data must be an object");
  for (const [key, value] of Object.entries(data)) {
    if (["href", "ctaHref"].includes(key) && typeof value === "string" && value && !safeHref(value))
      throw new Error("Unsafe editorial link: " + key);
    if (["hotspotX", "hotspotY"].includes(key) &&
      (typeof value !== "number" || !Number.isFinite(value) || value < 5 || value > 95))
      throw new Error("Hotspot coordinate must be between 5 and 95");
  }
}
export function validateEditorialSection(section) {
  if (!section || typeof section !== "object" || !safeId(section.id) ||
    section.type !== "showcase" || !KNOWN.has(section.preset)) throw new Error("Unknown or invalid editorial section");
  if (!section.settings || typeof section.settings !== "object") throw new Error("Section settings required");
  validateData(section.data ?? {});
  if (!Array.isArray(section.blocks ?? [])) throw new Error("Section blocks must be an array");
  const ids = new Set();
  for (const block of section.blocks ?? []) {
    if (!block || !safeId(block.id) || ids.has(block.id)) throw new Error("Duplicate or invalid editorial block id");
    ids.add(block.id);
    validateData(block.data ?? {});
  }
  return section;
}
export function defaultEditorialSection(preset, id = "editorial-" + preset.split("/").at(-1)) {
  if (!KNOWN.has(preset) || !safeId(id)) throw new Error("Unknown editorial preset or invalid id");
  const common = { id, type: "showcase", preset,
    settings: { surface: preset === "commons/lookbook-hotspots" ? "inverse" : "paper",
      spacing: "lg", minHeight: "auto" } };
  if (preset === "commons/curtain-hero") return { ...common,
    data: { eyebrow: "YOUR STORY", heading: "A new chapter", body: "Write your brand story.",
      mediaKey: "", ctaLabel: "Explore", ctaHref: "/" } };
  if (preset === "commons/editorial-statement") return { ...common,
    data: { body: "Add your own editorial statement.", ctaLabel: "Learn more", ctaHref: "/" } };
  const data = {
    "commons/wardrobe-gallery": { heading: "Our collections", eyebrow: "Discover" },
    "commons/split-media": { heading: "Explore the story" },
    "commons/collection-carousel": { heading: "Explore our edit", eyebrow: "Collections" },
    "commons/lookbook-hotspots": { heading: "Inside the story", mediaKey: "", body: "Explore the details." },
    "commons/faq-trust": { heading: "Questions and answers", ctaLabel: "Contact us", ctaHref: "/contact/" },
  }[preset];
  const block = {
    "commons/wardrobe-gallery": { title: "Collection", caption: "Add a description", mediaKey: "", href: "/" },
    "commons/split-media": { title: "Story panel", body: "Add a description", mediaKey: "", href: "/" },
    "commons/collection-carousel": { title: "Collection card", group: "Featured", mediaKey: "", href: "/" },
    "commons/lookbook-hotspots": { title: "Detail", body: "Add a description", hotspotX: 45, hotspotY: 50, href: "/" },
    "commons/faq-trust": { title: "Your question", body: "Add an accurate answer." },
  }[preset];
  return { ...common, data, blocks: [{ id: id + "-item", type: preset === "commons/faq-trust" ? "text" : "item", data: block }] };
}
export function createCmsEditorialInstall(pageId, section) {
  if (!safeId(pageId)) throw new Error("A valid CMS page ID is required");
  validateEditorialSection(section);
  return {
    page_id: pageId,
    section_type: "editorial-react",
    section_name: EDITORIAL_PRESETS.find((item) => item.preset === section.preset).title,
    section_data: { schema_id: EDITORIAL_SECTION_SCHEMA, renderer: "editorial-react", section },
    sort_order: 100,
  };
}
export function extractCmsEditorialSection(row) {
  const data = typeof row?.section_data === "string" ? JSON.parse(row.section_data) :
    row?.section_data ?? (typeof row?.fields_json === "string" ? JSON.parse(row.fields_json) : row?.fields_json);
  if (!data || data.schema_id !== EDITORIAL_SECTION_SCHEMA || data.renderer !== "editorial-react")
    throw new Error("CMS row is not an installed editorial React section");
  return validateEditorialSection(data.section);
}
function safeAssetBase(url) {
  if (typeof url !== "string" || !url) throw new Error("Editorial runtime asset URL required");
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("..") && !url.includes("?")) return url.replace(/\/$/, "");
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash)
    throw new Error("Editorial runtime assets must use HTTPS");
  return parsed.href.replace(/\/$/, "");
}
function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function validMediaMap(media) {
  const result = {};
  for (const [key, url] of Object.entries(media ?? {})) {
    if (!safeId(key.replace(/\./g, "-"))) throw new Error("Invalid logical media key");
    if (typeof url !== "string") throw new Error("Media URL must be a string");
    if (url.startsWith("/") && !url.startsWith("//")) result[key] = url;
    else {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" || parsed.username || parsed.password) throw new Error("Unsafe media URL");
      result[key] = parsed.href;
    }
  }
  return result;
}
/** Embed inside an existing CMS page. Does not overwrite non-editorial sections. */
export function renderCmsEditorialSection(row, { assetBaseUrl, brand, design, media = {} }) {
  const section = extractCmsEditorialSection(row);
  const base = safeAssetBase(assetBaseUrl);
  if (!brand?.name) throw new Error("Customer brand is required for publication");
  const payload = { schema_id: EDITORIAL_PUBLICATION_SCHEMA, section,
    brand: { name: String(brand.name) }, design, media: validMediaMap(media) };
  return '<div data-cms-editorial-root data-cms-editorial-css="' +
    escapeAttr(base + "/editorial-runtime.css") + '">' +
    '<script type="application/json" data-cms-editorial-payload>' +
    safeJson(payload) + '</script></div>';
}
/** Mount once per page, after all section roots. */
export function cmsEditorialRuntimeScript(assetBaseUrl) {
  return '<script type="module" src="' + escapeAttr(safeAssetBase(assetBaseUrl) +
    "/editorial-runtime.js") + '"></script>';
}
/** Full HTML is intentionally restricted to editorial-only pages. */
export function renderCmsEditorialPage({ page, sections, assetBaseUrl, brand, design, media = {} }) {
  if (!page?.title || !Array.isArray(sections) || !sections.length) throw new Error("Page and sections required");
  const markup = sections.filter((row) => row.is_visible !== false && row.is_visible !== 0 &&
    row.visible !== false && row.visible !== 0).map((row) =>
    renderCmsEditorialSection(row, { assetBaseUrl, brand, design, media })).join("\n");
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + escapeAttr(page.title) + '</title></head><body>' + markup +
    cmsEditorialRuntimeScript(assetBaseUrl) + '</body></html>';
}
/**
 * Production R2 publisher: host authenticates request, chooses scoped object key,
 * installs the version-matched runtime assets first and controls routing.
 * This adapter does not infer credentials, bucket or tenant.
 */
export async function publishCmsEditorialPage({ bucket, key, page, sections, assetBaseUrl, brand, design, media }) {
  if (!bucket?.put) throw new Error("A host-authorized R2 bucket is required");
  if (typeof key !== "string" || !/^[a-z0-9_-]+(?:\/[a-z0-9_.-]+)*\/index\.html$/i.test(key) ||
    key.includes("..")) throw new Error("Publication key must be a scoped HTML route");
  const html = renderCmsEditorialPage({ page, sections, assetBaseUrl, brand, design, media });
  await bucket.put(key, html, { httpMetadata: { contentType: "text/html; charset=utf-8" } });
  return { ok: true, key, sections: sections.length, bytes: new TextEncoder().encode(html).byteLength };
}
export async function installCmsEditorialAssets({ bucket, prefix, assets }) {
  if (!bucket?.put || typeof prefix !== "string" || !/^[a-z0-9_-]+(?:\/[a-z0-9_-]+)*$/i.test(prefix))
    throw new Error("Authorized bucket and scoped asset prefix required");
  for (const [filename, contentType] of [
    ["editorial-runtime.js", "text/javascript; charset=utf-8"],
    ["editorial-runtime.css", "text/css; charset=utf-8"],
  ]) {
    if (!(assets?.[filename] instanceof Uint8Array)) throw new Error("Missing compiled asset: " + filename);
    await bucket.put(prefix + "/" + filename, assets[filename],
      { httpMetadata: { contentType, cacheControl: "public, max-age=31536000, immutable" } });
  }
  return { ok: true, prefix };
}


/**
 * Drop-in host Worker route for POST /api/cms/editorial/publish.
 * The caller provides authorization, canonical page/section reads, media
 * resolution and R2 bindings. This code never looks up platform credentials.
 */
export async function handleCmsEditorialPublishRequest(request, {
  authorize, loadPage, bucket, runtimeAssets, assetOrigin, assetPrefix,
} = {}) {
  if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
  try {
    if (typeof authorize !== "function" || typeof loadPage !== "function" ||
      !bucket?.put || !runtimeAssets) throw new Error("CMS editorial host adapter is not configured");
    const actor = await authorize(request);
    if (!actor) return Response.json({ error: "Unauthorized" }, { status: 403 });
    const body = await request.json();
    const pageId = body?.page_id;
    const projectSlug = body?.project_slug;
    if (!safeId(pageId) || !safeId(projectSlug)) {
      return Response.json({ error: "Valid page and project required" }, { status: 400 });
    }
    // Host must enforce tenant membership for both page and project in loadPage.
    const source = await loadPage({ pageId, projectSlug, actor });
    if (!source?.page || !source?.brand?.name || !Array.isArray(source.sections)) {
      return Response.json({ error: "Page unavailable" }, { status: 404 });
    }
    if (!source.sections.length) return Response.json({ error: "Page has no sections" }, { status: 422 });
    const prefix = assetPrefix || "cms-editorial/v1";
    const origin = safeAssetBase(assetOrigin);
    // Preflight the whole page before any writes. Mixed pages require the host
    // to embed renderCmsEditorialSection into its existing page composer.
    renderCmsEditorialPage({
      page: source.page, sections: source.sections,
      assetBaseUrl: origin + "/" + prefix,
      brand: source.brand, design: source.design, media: source.media,
    });
    const key = projectSlug + "/" + pageId + "/index.html";
    await installCmsEditorialAssets({ bucket, prefix, assets: runtimeAssets });
    const receipt = await publishCmsEditorialPage({
      bucket, key, page: source.page, sections: source.sections,
      assetBaseUrl: origin + "/" + prefix,
      brand: source.brand, design: source.design, media: source.media,
    });
    // Publication success is reported only after the actual bucket write.
    return Response.json({ ...receipt, runtime: prefix });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const invalid = /invalid|unsafe|unknown|not an installed|mixed|section|unsupported|missing/i.test(message);
    return Response.json({ error: invalid ? message : "CMS editorial publication failed" },
      { status: invalid ? 422 : 500 });
  }
}
