import React, { useEffect, useState } from "react";
import type { SiteContentBlock, SiteDocument, SiteSection, SectionSurface } from "../../../../packages/site-contracts/src/site-document.js";
import { validateSiteDocument } from "../../../../packages/site-contracts/src/site-document.js";
import { editableSectionFields, applySectionFieldEdit, type EditableSectionField } from "../../../../packages/site-contracts/src/section-fields.js";
import { EditorialScene } from "./EditorialScene";
import { fieldworkSite, fieldworkMedia } from "./fieldwork-site";
import { SCENE_PRESETS } from "./section-data";

const KEY = "editorial-commons.site-document.draft.v1";
const SELECTED_PAGE_KEY = KEY + ".page";
const SELECTED_SECTION_KEY = KEY + ".section";
const kinds = [
  ["curtain-hero", SCENE_PRESETS.hero, "Curtain hero"],
  ["wardrobe-gallery", SCENE_PRESETS.wardrobe, "Category wardrobe"],
  ["split-media", SCENE_PRESETS.diptych, "Media diptych"],
  ["editorial-statement", SCENE_PRESETS.statement, "Editorial statement"],
] as const;
const mediaKeys = new Set(fieldworkMedia.keys());
const mediaOptions = [...fieldworkMedia.keys()];

function sceneId(preset: string): string | null {
  return kinds.find((item) => item[1] === preset)?.[0] ?? null;
}
function safeDocument(document: unknown): document is SiteDocument {
  if (validateSiteDocument(document).length) return false;
  const doc = document as SiteDocument;
  if (doc.pages.length === 0 || doc.pages.length > 12) return false;
  for (const page of doc.pages) {
    if (!Array.isArray(page.sections) || page.sections.length > 40) return false;
    for (const section of page.sections) {
      if (!section || typeof section.id !== "string" || !section.data ||
        typeof section.data !== "object" || Array.isArray(section.data)) return false;
      if (section.blocks && (!Array.isArray(section.blocks) || section.blocks.length > 50)) return false;
      for (const block of section.blocks ?? []) {
        if (!block || typeof block.id !== "string" || !block.data ||
          typeof block.data !== "object" || Array.isArray(block.data)) return false;
      }
    }
  }
  return true;
}
function initialDraft(): SiteDocument {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (safeDocument(parsed)) return parsed;
    }
  } catch { /* Malformed local drafts never interrupt the editor. */ }
  return structuredClone(fieldworkSite);
}
function newSection(id: string): SiteSection {
  const suffix = Date.now().toString(36);
  const shared = { surface: "paper" as SectionSurface, minHeight: "auto" as const, spacing: "md" as const };
  if (id === "curtain-hero") return {
    id: "scene-hero-" + suffix, type: "media-hero", preset: SCENE_PRESETS.hero,
    settings: { ...shared, surface: "image", minHeight: "screen" },
    data: { eyebrow: "NEW STORY", heading: "Make this your own.", body: "Introduce the story behind your brand.",
      mediaKey: "fieldwork.hero", ctaLabel: "Explore", ctaHref: "/stories/" },
  };
  if (id === "editorial-statement") return {
    id: "scene-statement-" + suffix, type: "statement", preset: SCENE_PRESETS.statement,
    settings: shared,
    data: { body: "A meaningful sentence about what matters.", ctaLabel: "Read the journal", ctaHref: "/journal/" },
  };
  return {
    id: "scene-" + id + "-" + suffix, type: "showcase",
    preset: id === "wardrobe-gallery" ? SCENE_PRESETS.wardrobe : SCENE_PRESETS.diptych,
    settings: { ...shared, surface: id === "split-media" ? "inverse" : "paper" },
    data: { eyebrow: "COLLECTION", heading: "Explore the edit" },
    blocks: [{
      id: "item-" + suffix, type: "item",
      data: id === "wardrobe-gallery"
        ? { title: "New collection", caption: "Selected objects", mediaKey: "fieldwork.journeys",
            href: "/stories/", alt: "Collection image" }
        : { eyebrow: "SCENE 01", title: "A new perspective", body: "Add your own editorial copy.",
            mediaKey: "fieldwork.evening", href: "/stories/", ctaLabel: "Explore", alt: "Panel image" },
    }],
  };
}
function nextBlock(section: SiteSection): SiteContentBlock {
  const sample = structuredClone(section.blocks?.at(-1)?.data ?? (
    section.preset === SCENE_PRESETS.diptych
      ? { eyebrow: "NEW PANEL", title: "New direction", body: "Describe this direction.",
          mediaKey: "", href: "/stories/", ctaLabel: "Explore", alt: "New panel" }
      : { title: "New category", caption: "Description", mediaKey: "", href: "/stories/", alt: "Category" }
  ));
  return { id: "block-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6),
    type: "item", data: sample };
}
function download(document: SiteDocument) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(document, null, 2) + "\n"],
    { type: "application/json" }));
  const a = window.document.createElement("a");
  a.href = url; a.download = "site-document.json";
  window.document.body.appendChild(a);
  a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function SectionWorkbench() {
  const [draft, setDraft] = useState<SiteDocument>(initialDraft);
  const [pageId, setPageId] = useState(() => {
    const remembered = localStorage.getItem(SELECTED_PAGE_KEY);
    return draft.pages.find((page) => page.id === remembered)?.id ?? draft.pages[0]?.id ?? "";
  });
  const currentPage = draft.pages.find((page) => page.id === pageId) ?? draft.pages[0];
  const [selected, setSelected] = useState(() => {
    const remembered = localStorage.getItem(SELECTED_SECTION_KEY);
    return currentPage?.sections.find((item) => item.id === remembered)?.id ??
      currentPage?.sections[0]?.id ?? "";
  });
  const [fullPage, setFullPage] = useState(false);
  const [status, setStatus] = useState("Locally saved preview · no backend writes");
  const sections = currentPage?.sections ?? [];
  const active = sections.find((section) => section.id === selected) ?? sections[0];
  const editPage = (next: SiteDocument) =>
    next.pages.find((page) => page.id === currentPage?.id) ?? next.pages[0];
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(draft)); }
    catch { setStatus("Browser storage unavailable. Export your JSON to save."); }
  }, [draft]);
  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_PAGE_KEY, currentPage?.id ?? "");
      localStorage.setItem(SELECTED_SECTION_KEY, selected);
    } catch { /* Optional selection preferences. */ }
  }, [currentPage?.id, selected]);
  useEffect(() => {
    if (sections.length > 0 && !sections.some((item) => item.id === selected))
      setSelected(sections[0].id);
  }, [sections, selected]);
  const modify = (fn: (next: SiteDocument) => void) => {
    setDraft((current) => {
      const next = structuredClone(current);
      fn(next);
      return next;
    });
    setStatus("Updated local draft · export JSON to use elsewhere");
  };
  const updateField = (sectionId: string, key: string, value: string | boolean, blockId?: string) => {
    const next = structuredClone(draft);
    const section = editPage(next)?.sections.find((item) => item.id === sectionId);
    const record = blockId ? section?.blocks?.find((item) => item.id === blockId)?.data : section?.data;
    if (!record) { setStatus("Content record no longer exists"); return; }
    const outcome = applySectionFieldEdit(record, key, value, { mediaKeys });
    if (!outcome.ok) { setStatus("Invalid " + key + ": " + outcome.reason); return; }
    setDraft(next);
    setStatus("Updated local draft · export JSON to use elsewhere");
  };
  function input(section: SiteSection, definition: EditableSectionField, blockId?: string) {
    const identity = section.id + "-" + (blockId ?? "section") + "-" +
      definition.key + "-" + String(definition.value);
    const label = <span className="text-[11px] uppercase font-semibold tracking-[.1em] text-neutral-500">{definition.label}</span>;
    if (definition.kind === "boolean") return <label key={identity} className="flex items-center gap-3 text-sm">
      <input type="checkbox" defaultChecked={Boolean(definition.value)} key={identity}
        onChange={(event) => updateField(section.id, definition.key, event.target.checked, blockId)} />{label}
    </label>;
    if (definition.kind === "media") return <label key={identity} className="grid gap-1.5">
      {label}<select key={identity} defaultValue={String(definition.value)}
        onChange={(event) => updateField(section.id, definition.key, event.target.value, blockId)}
        className="w-full min-h-11 border border-neutral-300 bg-white rounded-lg px-3 text-sm">
        <option value="">No image</option>
        {String(definition.value) && !mediaKeys.has(String(definition.value)) &&
          <option value={String(definition.value)}>Unresolved: {definition.value}</option>}
        {mediaOptions.map((key) => <option key={key} value={key}>{key}</option>)}
      </select>
    </label>;
    const textInput = definition.kind === "long-text"
      ? <textarea rows={3} defaultValue={String(definition.value)} key={identity}
          onBlur={(event) => updateField(section.id, definition.key, event.target.value, blockId)}
          className="w-full border border-neutral-300 rounded-lg p-3 text-sm resize-y" />
      : <input type={definition.kind === "number" ? "number" : "text"}
          defaultValue={String(definition.value)} key={identity}
          onBlur={(event) => updateField(section.id, definition.key, event.target.value, blockId)}
          className="w-full min-h-11 border border-neutral-300 rounded-lg px-3 text-sm" />;
    return <label key={identity} className="grid gap-1.5">{label}{textInput}</label>;
  }
  const move = (index: number, delta: number) => modify((next) => {
    const items = editPage(next).sections;
    const other = index + delta;
    if (other < 0 || other >= items.length) return;
    [items[index], items[other]] = [items[other], items[index]];
  });
  const moveBlock = (sectionId: string, index: number, delta: number) => modify((next) => {
    const items = editPage(next).sections.find((item) => item.id === sectionId)?.blocks;
    if (!items || index + delta < 0 || index + delta >= items.length) return;
    [items[index], items[index + delta]] = [items[index + delta], items[index]];
  });
  const scene = (section: SiteSection) => {
    const id = sceneId(section.preset);
    return id ? <EditorialScene key={section.id} id={id} section={section}
      brand={{ name: draft.brand.name, season: "CORE COLLECTION" }}
      tokens={draft.design}
      resolveMedia={(key) => fieldworkMedia.get(key) ?? null}
      showSupportOverlays={false} /> : <div key={section.id}
        className="p-12 bg-white text-neutral-800">Unsupported renderer: {section.preset}</div>;
  };
  const button = "min-h-10 rounded-lg px-3 text-xs font-semibold border border-neutral-300 hover:bg-neutral-100";
  return <div className="min-h-screen bg-[#eeeee8] text-[#1a1c1a]">
    <header className="bg-[#161916] text-white px-5 md:px-8 py-4 flex items-center flex-wrap justify-between gap-3">
      <div><strong className="text-xl tracking-tight">Editorial Commons</strong>
        <span className="block text-[10px] tracking-widest uppercase text-white/60">SiteDocument / Editable section study</span></div>
      <div className="flex items-center gap-3 text-xs">
        <a href={import.meta.env.BASE_URL + "index.html?gallery=1"} className="underline underline-offset-4">Scene gallery</a>
        <button type="button" className="min-h-10 bg-white text-black px-4 rounded-lg font-semibold" onClick={() => download(draft)}>Export SiteDocument ↗</button>
      </div>
    </header>
    <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="bg-[#fafaf7] lg:sticky lg:top-0 lg:h-[calc(100dvh-76px)] overflow-y-auto border-r border-black/10">
        <div className="p-5 space-y-4">
          <p className="text-xs leading-relaxed text-neutral-600">Edit the same content model used by the CMS. This is a local draft; nothing is published or sent to a commerce provider.</p>
          <label className="grid gap-1.5"><span className="text-xs font-semibold">Site / Brand name</span>
            <input aria-label="Site brand name" className="min-h-11 border border-neutral-300 rounded-lg px-3"
              value={draft.brand.name} onChange={(event) => modify((next) => { next.brand.name = event.target.value; })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["accent", "accentSoft"] as const).map((token) => <label key={token} className="grid gap-1">
              <span className="text-xs font-semibold">{token === "accent" ? "Brand accent" : "Accent highlight"}</span>
              <input aria-label={token === "accent" ? "Brand accent" : "Accent highlight"}
                type="color" value={draft.design?.[token] ?? (token === "accent" ? "#8b181b" : "#e2a8aa")}
                className="w-full h-11 border border-neutral-300 bg-white rounded-lg"
                onChange={(event) => modify((next) => { (next.design ??= {})[token] = event.target.value; })} />
            </label>)}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={button} aria-pressed={fullPage} onClick={() => setFullPage(true)}>Full page</button>
            <button type="button" className={button} aria-pressed={!fullPage} onClick={() => setFullPage(false)}>Selected section</button>
            <button type="button" className={button} onClick={() => {
              if (!window.confirm("Reset local edits to the original Fieldwork fixture?")) return;
              localStorage.removeItem(KEY); const fresh = structuredClone(fieldworkSite);
              setDraft(fresh); setPageId(fresh.pages[0].id);
              setSelected(fresh.pages[0].sections[0].id); setStatus("Demo restored");
            }}>Reset</button>
          </div>
          <section aria-label="Page sections" className="border-t border-black/10 pt-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-xs uppercase tracking-widest font-bold">Pages · {draft.pages.length}</h2>
              <button type="button" className={button} onClick={() => {
                const id = "page-" + Date.now().toString(36);
                modify((next) => next.pages.push({
                  id, path: "/" + id + "/", title: "New page",
                  description: "Independent page template", sections: [],
                }));
                setPageId(id); setSelected(""); setFullPage(false);
              }}>+ Add page</button>
            </div>
            <label className="grid gap-1.5 mb-3">
              <span className="text-[11px] font-semibold">Select page</span>
              <select aria-label="Select page" value={currentPage?.id ?? ""}
                className="min-h-11 border border-neutral-300 rounded-lg bg-white px-3"
                onChange={(event) => {
                  setPageId(event.target.value);
                  const page = draft.pages.find((item) => item.id === event.target.value);
                  setSelected(page?.sections[0]?.id ?? ""); setFullPage(false);
                }}>
                {draft.pages.map((page) => <option key={page.id} value={page.id}>
                  {page.title} · {page.path}
                </option>)}
              </select>
            </label>
            {currentPage && <div className="grid gap-3 mb-4">
              <label className="grid gap-1">
                <span className="text-[11px] font-semibold">Page title</span>
                <input aria-label="Page title" value={currentPage.title}
                  className="min-h-11 border border-neutral-300 rounded-lg bg-white px-3"
                  onChange={(event) => modify((next) => {
                    editPage(next).title = event.target.value;
                  })} />
              </label>
              <label className="grid gap-1">
                <span className="text-[11px] font-semibold">Page path</span>
                <input aria-label="Page path" key={currentPage.id + currentPage.path}
                  defaultValue={currentPage.path}
                  className="min-h-11 border border-neutral-300 rounded-lg bg-white px-3"
                  onBlur={(event) => {
                    const path = event.target.value.trim();
                    if (!/^\/(?!\/)[a-z0-9/_-]*\/?$/i.test(path) ||
                        draft.pages.some((other) => other.id !== currentPage.id && other.path === path)) {
                      setStatus("Page path must be a unique local path beginning with /"); return;
                    }
                    modify((next) => { editPage(next).path = path; });
                  }} />
              </label>
              {draft.pages.length > 1 && <button type="button" className={button}
                onClick={() => {
                  if (!window.confirm("Remove this page and its draft sections?")) return;
                  const next = structuredClone(draft);
                  next.pages = next.pages.filter((item) => item.id !== currentPage.id);
                  setDraft(next); setPageId(next.pages[0].id);
                  setSelected(next.pages[0].sections[0]?.id ?? "");
                  setStatus("Page removed from local draft");
                }}>Remove current page</button>}
            </div>}
            <h2 className="text-xs uppercase tracking-widest font-bold mb-3">Page template · {sections.length} sections</h2>
            <div className="grid gap-2">
              {sections.map((section, index) => <div key={section.id}
                className={"flex items-center gap-1 rounded-lg border p-1 " + (active?.id === section.id ? "border-black bg-[#e0e6d9]" : "border-neutral-200 bg-white")}>
                <button type="button" aria-current={active?.id === section.id ? "true" : undefined}
                  onClick={() => { setSelected(section.id); setFullPage(false); }}
                  className="flex-1 min-w-0 px-3 py-2 text-left text-sm font-semibold truncate">
                  {sceneId(section.preset)?.replaceAll("-", " ") ?? section.preset}
                </button>
                <button type="button" aria-label={"Move section " + (index+1) + " up"} disabled={index===0}
                  className="min-w-9 min-h-10 disabled:opacity-25" onClick={() => move(index,-1)}>↑</button>
                <button type="button" aria-label={"Move section " + (index+1) + " down"} disabled={index===sections.length-1}
                  className="min-w-9 min-h-10 disabled:opacity-25" onClick={() => move(index,1)}>↓</button>
                <button type="button" aria-label={"Remove section " + (index+1)}
                  className="min-w-9 min-h-10" onClick={() => modify((next) => {
                    editPage(next).sections.splice(index, 1);
                  })}>×</button>
              </div>)}
            </div>
            <label className="grid gap-1.5 mt-4"><span className="text-[11px] font-bold uppercase tracking-wider">Add section from shared catalog</span>
              <select aria-label="Add a section" defaultValue="" className="min-h-11 bg-white border border-neutral-300 rounded-lg px-3 text-sm"
                onChange={(event) => {
                  if (!event.target.value) return;
                  const added = newSection(event.target.value);
                  modify((next) => { editPage(next).sections.push(added); });
                  setSelected(added.id); setFullPage(false); event.target.value = "";
                }}><option value="">Choose a section…</option>
                {kinds.map(([id, , title]) => <option value={id} key={id}>{title}</option>)}
              </select>
            </label>
          </section>
          {active && <section aria-label="Section content" className="border-t border-black/10 pt-4 space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-bold">Section settings & content</h2>
            <label className="grid gap-1"><span className="text-xs font-semibold">Section surface</span>
              <select aria-label="Section background" value={active.settings.surface ?? "paper"}
                className="min-h-11 border border-neutral-300 rounded-lg bg-white px-3"
                onChange={(event) => modify((next) => {
                  const target = editPage(next).sections.find((item) => item.id === active.id);
                  if (target) target.settings.surface = event.target.value as SectionSurface;
                })}>
                {["canvas","paper","muted","inverse","image"].map((value) => <option value={value} key={value}>{value}</option>)}
              </select>
            </label>
            {editableSectionFields(active.data).map((item) => input(active, item))}
            {active.blocks && <div className="space-y-4">
              <h3 className="text-sm font-bold">Content blocks ({active.blocks.length})</h3>
              {active.blocks.map((block, index) => <div key={block.id} className="border border-black/10 bg-[#f0f0ed] rounded-lg p-3 space-y-3">
                <div className="flex gap-2 items-center justify-between">
                  <strong className="text-xs">Block {index+1}</strong>
                  <div className="flex gap-1">
                    <button aria-label={"Move block " + (index+1) + " up"} disabled={index===0} className={button} onClick={() => moveBlock(active.id,index,-1)}>↑</button>
                    <button aria-label={"Move block " + (index+1) + " down"} disabled={index===active.blocks!.length-1} className={button} onClick={() => moveBlock(active.id,index,1)}>↓</button>
                    <button aria-label={"Remove block " + (index+1)} className={button}
                      onClick={() => modify((next) => { editPage(next).sections.find((item) => item.id === active.id)?.blocks?.splice(index,1); })}>×</button>
                  </div>
                </div>
                {editableSectionFields(block.data).map((item) => input(active,item,block.id))}
              </div>)}
              <button type="button" className={button} onClick={() => modify((next) => {
                const target = editPage(next).sections.find((item) => item.id === active.id);
                if (target) (target.blocks ??= []).push(nextBlock(target));
              })}>+ Add content block</button>
            </div>}
          </section>}
          <p role="status" className="border-t border-black/10 py-3 text-xs text-neutral-600">{status}</p>
          <label className="grid gap-2 text-xs"><span className="font-bold">Import a SiteDocument JSON file</span>
            <input aria-label="Import SiteDocument" type="file" accept=".json,application/json" onChange={async (event) => {
              const file = event.target.files?.[0]; if (!file) return;
              if (file.size > 1024*1024) { setStatus("File too large"); return; }
              try {
                const parsed: unknown = JSON.parse(await file.text());
                if (!safeDocument(parsed)) throw new Error("Not a valid SiteDocument v1");
                const candidate = parsed as SiteDocument;
                setDraft(candidate); setPageId(candidate.pages[0]?.id ?? "");
                setSelected(candidate.pages[0]?.sections[0]?.id ?? "");
                setStatus("Document loaded locally. Unknown media keys remain unresolved.");
              } catch (error) { setStatus(error instanceof Error ? error.message : "Invalid JSON"); }
              event.target.value = "";
            }} />
          </label>
        </div>
      </aside>
      <main className="min-w-0 p-3 md:p-7">
        <div className="flex items-end justify-between gap-3 flex-wrap pb-5">
          <div><p className="text-[11px] uppercase tracking-widest text-neutral-600">Live preview · {fullPage ? "full page" : "isolated scene"}</p>
            <h2 className="text-2xl font-semibold tracking-tight mt-1">{draft.brand.name || "Untitled site"}</h2>
          </div>
          <span className="text-xs text-neutral-500">Data and layout only · no publishing or orders</span>
        </div>
        <div className="bg-white border border-black/10 rounded-lg overflow-hidden shadow-sm" data-workbench-preview>
          {fullPage ? sections.map(scene) : active ? scene(active) :
            <p className="p-10 text-neutral-500">Add a section to begin.</p>}
        </div>
      </main>
    </div>
  </div>;
}
