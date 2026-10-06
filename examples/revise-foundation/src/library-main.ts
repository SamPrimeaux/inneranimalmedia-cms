import "@inneranimalmedia/section-library/layout.css";
import "@inneranimalmedia/revise-theme/theme.css";
import "./demo.css";
import "./site.css";
import "./library.css";

import { renderSiteSection, presetLibraryFrom } from "@inneranimalmedia/section-library";
import { enhanceRevise, reviseShowcasePresets } from "@inneranimalmedia/revise-theme";
import { sectionCatalog, sectionFromCatalog, siteMedia } from "./site-data.js";
import catalog from "./design-atlas.json";
import { editorialAtlasItems } from "./editorial-atlas.js";

interface AtlasPage { name: string; path: string }
interface AtlasItem {
  id: string;
  kind: "theme" | "lab" | "palette" | "section" | "template" | "page";
  title: string;
  family: string;
  description: string;
  previewUrl: string;
  pages: AtlasPage[];
  sourceRepo: string;
  sourcePath: string;
  sourceCommit: string;
  maturity: string;
  importMethod: string;
}
const archived = catalog.items as AtlasItem[];
const candidates: AtlasItem[] = archived.flatMap((source) => source.kind !== "theme" ? [] :
  source.pages.map((page, i) => ({
    ...source,
    id: "page-" + source.id.replace(/^theme-/, "") + "-" + i,
    kind: "page" as const,
    title: page.name + " · " + source.title,
    family: source.title + " site",
    description: "Real HTML page preserved from the " + source.title + " package.",
    previewUrl: page.path,
    pages: [],
  })));
const presetItems: AtlasItem[] = sectionCatalog.map((preset) => ({
  id: "preset-" + preset.id.replace("/", "-"),
  kind: "section",
  title: preset.title,
  family: "Revise · " + preset.type,
  description: "Live shared section renderer with the original Revise preset and sample content.",
  previewUrl: "/library/presets/" + preset.id.replace("/", "-") + "/embed/",
  pages: [],
  sourceRepo: "SamPrimeaux/inneranimalmedia-cms",
  sourcePath: "packages/revise-theme/src/presets/showcase.ts",
  sourceCommit: "main",
  maturity: "reusable preset",
  importMethod: "live package renderer",
}));
const items: AtlasItem[] = [...editorialAtlasItems, ...presetItems, ...archived, ...candidates];
const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Missing #app");
const escapeHtml = (input: unknown) => String(input ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const previewOrigin = location.hostname === "127.0.0.1"
  ? location.protocol + "//localhost:" + location.port
  : location.hostname === "localhost"
    ? location.protocol + "//127.0.0.1:" + location.port
    : null;
const path = location.pathname;
const embed = path.match(/^\/library\/presets\/(revise-[a-z0-9-]+)\/embed\/?$/);
if (embed) {
  const preset = embed[1].replace(/^revise-/, "revise/");
  const entry = presetItems.find((item) => item.previewUrl.includes("/" + embed[1] + "/embed/"));
  if (!entry) missing();
  else {
    const section = sectionFromCatalog(preset, "atlas");
    const extra: Array<[string, string]> = Array.from({ length: 24 }, (_, i) => [
      "showcase." + String(i + 1), "/visual-" + String(i + 1).padStart(2, "0") + ".svg",
    ]);
    const media = new Map([...extra, ...siteMedia]);
    const markup = renderSiteSection(section, {
      context: {
        theme: "revise",
        resolveMedia: (key) => media.get(key) ?? (key.startsWith("showcase.") ? "/visual-01.svg" : null),
      },
      presets: presetLibraryFrom(reviseShowcasePresets),
    });
    document.body.classList.add("atlas-embed");
    root.innerHTML = '<div data-theme="revise" class="revise-demo atlas-embed__surface">' + markup + "</div>";
    enhanceRevise(document);
  }
} else {
  const detailMatch = path.match(/^\/library\/(themes|pages|sections|palettes|labs|templates)\/([a-z0-9_-]+)\/?$/);
  if (detailMatch) {
    const group = detailMatch[1];
    const slug = detailMatch[2];
    const chosen = items.find((entry) => entry.kind === group.slice(0, -1) && entry.id.replace(/^(theme|page|preset|section|palette|lab|template)-/, "") === slug);
    if (chosen) detail(chosen);
    else missing();
  } else if (path === "/library" || path === "/library/") {
    index();
  } else {
    missing();
  }
}

function missing() {
  root.innerHTML = '<div class="atlas-blank"><a href="/library/">← Design library</a><h1>Not in this atlas.</h1><p>This route has no imported review snapshot.</p></div>';
}
function canonicalPath(item: AtlasItem): string {
  const plural: Record<string, string> = {
    theme: "themes", page: "pages", section: "sections",
    palette: "palettes", lab: "labs", template: "templates",
  };
  const slug = item.id.replace(/^(theme|page|preset|section|palette|lab|template)-/, "");
  return "/library/" + plural[item.kind] + "/" + slug + "/";
}
function cssClass(item: AtlasItem): string {
  return "atlas-kind--" + item.kind;
}
// The local preview uses another loopback hostname to isolate its origin from
// 127.0.0.1 site drafts. Production needs a separately hosted preview origin.

function frameSrc(path: string): string {
  return previewOrigin ? previewOrigin + path : path;
}
function frame(item: AtlasItem, card: boolean): string {
  // On loopback, isolated hostname allows site JS and localStorage while its
  // origin cannot access the parent editor. Remote hosts stay sandboxed/opaque.
  const sandbox = previewOrigin ? "allow-scripts allow-same-origin" : "allow-scripts";
  return '<iframe loading="lazy" title="' + escapeHtml(item.title) + ' design preview" sandbox="' + sandbox + '" ' +
    'referrerpolicy="no-referrer" src="' + escapeHtml(frameSrc(item.previewUrl)) + '"' +
    (card ? ' tabindex="-1" aria-hidden="true"' : "") + '></iframe>';
}
function nav(active: string) {
  const groups = [
    ["all", "All"],
    ["theme", "Theme sites"],
    ["page", "Pages"],
    ["section", "Sections"],
    ["palette", "Palettes"],
    ["lab", "UI labs"],
    ["template", "Templates"],
  ];
  return '<nav class="atlas-filters" aria-label="Design types">' + groups.map(([key, label]) => {
    const count = key === "all" ? items.length : items.filter((entry) => entry.kind === key).length;
    return '<button type="button" data-filter="' + key + '" aria-pressed="' + (active === key) + '"' +
      (active === key ? ' class="is-active"' : "") + '>' + label +
      ' <span>' + count + '</span></button>';
  }).join("") + '</nav>';
}
function galleryCard(item: AtlasItem): string {
  return '<article class="atlas-card ' + cssClass(item) + '" data-gallery-entry data-kind="' + item.kind +
    '" data-search="' + escapeHtml((item.title + " " + item.family + " " + item.description).toLowerCase()) + '">' +
    '<div class="atlas-card__visual">' + frame(item, true) +
    '<a href="' + canonicalPath(item) + '" class="atlas-card__cover" aria-label="Inspect ' + escapeHtml(item.title) +
    '"><span class="atlas-card__view">Inspect design ↗</span></a></div>' +
    '<div class="atlas-card__copy"><div class="atlas-card__meta"><span>' + escapeHtml(item.family) +
    '</span><small>' + escapeHtml(item.maturity) + '</small></div>' +
    '<h3><a href="' + canonicalPath(item) + '">' + escapeHtml(item.title) + '</a></h3>' +
    '<p>' + escapeHtml(item.description) + '</p></div></article>';
}
function mainShell(title: string, subtitle: string, inner: string, compact = false) {
  document.body.classList.add("atlas-body");
  document.title = title + " · Revise Design Atlas";
  root.innerHTML = '<div class="atlas-shell"><header class="atlas-topbar">' +
    '<a class="atlas-brand" href="/library/"><span class="atlas-mark">R<span>•</span></span><span>Revise <small>Design Atlas</small></span></a>' +
    '<nav aria-label="Studio"><a href="/">View FNF site</a><a href="/library/">Explore library</a>' +
    '<a href="https://github.com/SamPrimeaux/inneranimalmedia-cms">Repository ↗</a></nav></header>' +
    '<main>' + (compact ? '' : '<div class="atlas-header"><div class="atlas-eyebrow">Inner Animal Media / historical design systems</div>' +
      '<h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(subtitle) + '</p></div>') +
    inner + '</main><footer class="atlas-footer"><span>Revise / Design Atlas</span>' +
    '<p>Source-backed studies. A preview is not a production-readiness claim. Canonical originals remain in their source repositories.</p>' +
    '<a href="/">Return to FNF preview ↗</a></footer></div>';
}
function index() {
  const totals = [
    ["8", "Packaged websites"],
    [String(candidates.length), "Historical page mounts"],
    [String(items.filter((item) => item.kind === "section").length), "Section previews"],
    ["7", "CMS palettes"],
  ];
  const selected = new URLSearchParams(location.search).get("kind") ?? "all";
  const initial = ["theme", "page", "section", "palette", "lab", "template"].includes(selected) ? selected : "all";
  const inner = '<section class="atlas-stat-row">' + totals.map(([value, title]) =>
    '<div><strong>' + value + '</strong><span>' + title + '</span></div>').join("") + '</section>' +
    '<section class="atlas-library"><div class="atlas-library__head"><div><span class="atlas-eyebrow">Live previews + archived studies</span>' +
    '<h2>Everything worth reviewing.</h2><p>Preview what already exists. Select a direction, then refine without duplicating the original package.</p></div>' +
    '<label class="atlas-search"><span>Search by name, purpose, or style</span><input data-atlas-search type="search" placeholder="Try editorial, community, hero…" autocomplete="off"></label></div>' +
    nav(initial) + '<p class="atlas-results" data-atlas-results aria-live="polite"></p>' +
    '<div class="atlas-grid">' + items.map(galleryCard).join("") + '</div>' +
    '<div class="atlas-empty" hidden>No designs match. Try another search or category.</div></section>';
  mainShell("The design archive, made visible.", "Eight real packaged sites, their historic pages, legacy experiments, shared Revise sections and token systems — collected as an inspectable visual library.", inner);
  let active = initial;
  let query = "";
  const cards = [...root.querySelectorAll<HTMLElement>("[data-gallery-entry]")];
  function update() {
    let total = 0;
    for (const card of cards) {
      const matches = (active === "all" || card.dataset.kind === active) &&
        (!query || (card.dataset.search ?? "").includes(query));
      card.hidden = !matches;
      if (matches) total++;
    }
    root.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((button) => {
      const selected = button.dataset.filter === active;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const output = root.querySelector<HTMLElement>("[data-atlas-results]");
    if (output) output.textContent = total + " of " + items.length + " designs shown";
    const empty = root.querySelector<HTMLElement>(".atlas-empty");
    if (empty) empty.hidden = total !== 0;
  }
  root.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-filter]");
    if (!button) return;
    active = button.dataset.filter ?? "all";
    history.replaceState({}, "", active === "all" ? "/library/" : "/library/?kind=" + active);
    update();
  });
  root.querySelector<HTMLInputElement>("[data-atlas-search]")?.addEventListener("input", (event) => {
    query = (event.target as HTMLInputElement).value.toLowerCase().trim();
    update();
  });
  update();
}
function detail(item: AtlasItem) {
  const sourceUrl = "https://github.com/" + item.sourceRepo + "/tree/" +
    item.sourceCommit + "/" + item.sourcePath;
  const pages = item.pages.length > 0 ? '<section class="atlas-detail__pages"><h2>Real source pages</h2><p>Open a captured page directly or load it inside the preview.</p>' +
    '<div class="atlas-page-links">' + item.pages.map((page) => '<button type="button" data-select-page="' +
      escapeHtml(page.path) + '">' + escapeHtml(page.name) + ' ↗</button>').join("") + '</div></section>' : "";
  const detailBody = '<div class="atlas-detail"><a class="atlas-back" href="/library/">← Back to all designs</a>' +
    '<div class="atlas-detail__hero"><div><span class="atlas-eyebrow">' + escapeHtml(item.family) +
    ' / ' + escapeHtml(item.maturity) + '</span><h1>' + escapeHtml(item.title) + '</h1><p>' +
    escapeHtml(item.description) + '</p></div><div class="atlas-detail__actions">' +
    '<a href="' + escapeHtml(item.previewUrl) + '" target="_blank" rel="noopener">Open original snapshot ↗</a>' +
    '<a class="atlas-link-secondary" href="' + escapeHtml(sourceUrl) + '" target="_blank" rel="noopener">View source ↗</a></div></div>' +
    '<section class="atlas-detail__viewer"><div class="atlas-detail__toolbar"><div><b>Visual preview</b><span>Review-only captured build</span></div>' +
    '<div class="atlas-viewport-toggle"><button type="button" data-viewport="desktop" aria-pressed="true" class="is-active">Desktop</button>' +
    '<button type="button" data-viewport="mobile" aria-pressed="false">Mobile</button></div>' +
    '</div><div class="atlas-detail__frame">' + frame(item, false) + '</div></section>' +
    pages + '<section class="atlas-provenance"><div><h2>Original source</h2><p>The preview is an imported evidence snapshot, not a fork of the source package.</p></div>' +
    '<dl><dt>Repository</dt><dd>' + escapeHtml(item.sourceRepo) + '</dd>' +
    '<dt>Source path</dt><dd><code>' + escapeHtml(item.sourcePath) + '</code></dd>' +
    '<dt>Source commit</dt><dd><code>' + escapeHtml(item.sourceCommit.slice(0, 12)) + '</code></dd>' +
    '<dt>Preview method</dt><dd>' + escapeHtml(item.importMethod) + '</dd>' +
    '<dt>Readiness</dt><dd>' + escapeHtml(item.maturity) + '</dd></dl></section></div>';
  mainShell(item.title, item.description, detailBody, true);
  root.querySelectorAll<HTMLButtonElement>("[data-viewport]").forEach((button) => {
    button.addEventListener("click", () => {
      const mobile = button.dataset.viewport === "mobile";
      root.querySelector(".atlas-detail__frame")?.classList.toggle("is-mobile", mobile);
      root.querySelectorAll<HTMLButtonElement>("[data-viewport]").forEach((other) => {
        const on = other === button; other.classList.toggle("is-active", on); other.setAttribute("aria-pressed", String(on));
      });
    });
  });
  root.querySelectorAll<HTMLButtonElement>("[data-select-page]").forEach((button) =>
    button.addEventListener("click", () => {
      const selected = button.dataset.selectPage ?? item.previewUrl;
      const iframe = root.querySelector<HTMLIFrameElement>(".atlas-detail__frame iframe");
      const direct = root.querySelector<HTMLAnchorElement>(".atlas-detail__actions > a");
      if (iframe) iframe.src = frameSrc(selected);
      if (direct) direct.href = selected;
      root.querySelector(".atlas-detail__viewer")?.scrollIntoView({ behavior: "smooth" });
    }));
}
