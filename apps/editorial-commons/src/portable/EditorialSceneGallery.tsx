import React, { useMemo, useState } from "react";
import { EDITORIAL_SCENES } from "./scene-manifest";

/** Catalogue of real mounted React scenes, not screenshots or mock panels. */
export function EditorialSceneGallery() {
  // Use the current Vite deployment base so the exact same preview also
  // runs embedded in CMS Design Atlas, not only at a separate localhost port.
  const entryPath = import.meta.env.BASE_URL + "index.html";
  const starting = new URLSearchParams(location.search).get("selected") ?? "curtain-hero";
  const [selected, setSelected] = useState(
    EDITORIAL_SCENES.some((item) => item.id === starting) ? starting : "curtain-hero"
  );
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const current = EDITORIAL_SCENES.find((item) => item.id === selected)!;
  const matches = useMemo(() => EDITORIAL_SCENES.filter((item) =>
    (filter === "all" || item.kind === filter) &&
    (item.title + item.id + item.act).toLowerCase().includes(query.toLowerCase())
  ), [filter, query]);
  function choose(id: string) {
    setSelected(id);
    history.replaceState(null, "", entryPath + "?gallery=1&selected=" + encodeURIComponent(id));
  }
  return <div className="min-h-screen bg-[#eae9e4] text-[#161a19] font-sans">
    <header className="bg-[#161917] text-[#f8f8f1] px-5 md:px-10 py-5 flex flex-wrap justify-between items-center gap-5">
      <a href={entryPath} className="no-underline text-2xl font-bold tracking-[-0.07em]">FORM / 26
        <span className="block text-[10px] tracking-[0.18em] text-white/50 uppercase mt-1">Editorial Commons · Scene Library</span>
      </a>
      <div className="flex items-center gap-7 text-xs uppercase tracking-[.1em]">
        <span>{EDITORIAL_SCENES.length} source components</span>
        <a href={entryPath} className="underline underline-offset-4">Full storefront ↗</a>
      </div>
    </header>
    <div className="grid lg:grid-cols-[350px_minmax(0,1fr)] min-h-[calc(100svh-90px)]">
      <aside className="border-r border-black/15 bg-[#faf9f5] lg:max-h-[calc(100svh-88px)] lg:sticky lg:top-0 overflow-auto">
        <div className="p-6 border-b border-black/10">
          <span className="text-[10px] font-bold uppercase tracking-[.17em] text-[#727b6f]">Source-backed scene catalog</span>
          <h1 className="text-[2.3rem] leading-none font-bold tracking-[-0.065em] mt-4 mb-3">
            One component at a time.
          </h1>
          <p className="text-sm leading-relaxed text-[#6b7169]">Inspect the real React implementation.
            Content, media, and commerce are host-supplied; legacy visuals need individual acceptance before promotion.</p>
          <label className="text-[11px] font-bold uppercase tracking-widest block mt-6 mb-2" htmlFor="scene-search">
            Find a section
          </label>
          <input id="scene-search" type="search" value={query}
            onChange={event=>setQuery(event.target.value)}
            placeholder="Search gallery, PDP, drawer…"
            className="w-full border border-black/20 rounded-md px-4 py-3 bg-white text-black text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#657c70]" />
          <div className="flex flex-wrap gap-1.5 mt-4" role="group" aria-label="Scene type">
            {["all", "section", "page", "overlay", "header", "footer", "product-page", "studio"].map(kind=>
              <button key={kind} type="button" aria-pressed={filter===kind} onClick={()=>setFilter(kind)}
                className={"px-3 min-h-10 rounded-full text-[11px] font-semibold border capitalize " +
                  (filter===kind ? "bg-[#191e19] text-white border-[#191e19]" : "border-black/20 hover:bg-black/5")}>
                {kind.replace("-", " ")}
              </button>)}
          </div>
        </div>
        <nav className="p-3" aria-label="Scene collection">
          {matches.map((item,index)=><button key={item.id} type="button"
            onClick={()=>choose(item.id)}
            aria-current={item.id===selected ? "true" : undefined}
            className={"w-full text-left p-4 rounded-md border-b border-black/[.06] flex gap-3 items-start hover:bg-[#e5e6dc] " +
              (item.id===selected ? "bg-[#dbe2d2]" : "")}>
            <span className="font-mono text-[11px] opacity-50 mt-1">{String(index+1).padStart(2,"0")}</span>
            <span className="flex-1">
              <span className="block text-sm font-bold leading-snug">{item.title}</span>
              <span className="text-[11px] text-[#71796d] block mt-1">{item.act} · {item.kind}</span>
            </span>
            <span aria-hidden="true" className="text-sm">↗</span>
          </button>)}
          {!matches.length && <p className="p-4 text-sm text-black/65">No matching scenes.</p>}
        </nav>
      </aside>
      <main className="p-4 md:p-8 min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-7">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#72786d]">
              {current.act} / {current.kind}
            </span>
            <h2 className="font-bold tracking-[-.065em] text-[clamp(2rem,4vw,4rem)] leading-none mt-2">
              {current.title}
            </h2>
            <p className="mt-2 text-sm text-[#6d756a]">Source: {current.source} · {current.status.replace("-", " ")}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-xs max-w-full min-w-0">
            <div className="p-1 rounded-full bg-black/10 flex">
              <button type="button" onClick={()=>setViewport("desktop")}
                aria-pressed={viewport==="desktop"} className={"px-4 py-2 rounded-full " +
                  (viewport==="desktop"?"bg-white shadow-sm":"")}>Desktop</button>
              <button type="button" onClick={()=>setViewport("mobile")}
                aria-pressed={viewport==="mobile"} className={"px-4 py-2 rounded-full " +
                  (viewport==="mobile"?"bg-white shadow-sm":"")}>Mobile</button>
            </div>
            {["curtain-hero", "wardrobe-gallery", "split-media", "editorial-statement",
              "collection-carousel", "lookbook-hotspots", "faq-trust"].includes(selected) &&
              <a href={entryPath+"?scene="+encodeURIComponent(selected)+"&fixture=fieldwork"}
              target="_blank" rel="noopener"
              className="px-4 py-3 rounded-full border border-[#161a18] text-[#161a18] no-underline font-semibold">
              Second brand ↗</a>}
            {["collection-carousel", "lookbook-hotspots", "faq-trust"].includes(selected) &&
              <a href={entryPath+"?scene="+encodeURIComponent(selected)+"&fixture=cove"}
                target="_blank" rel="noopener"
                className="px-4 py-3 rounded-full border border-[#41687d] text-[#284e65] no-underline font-semibold">
                Another customer ↗</a>}
            {["curtain-hero", "wardrobe-gallery", "split-media", "editorial-statement",
              "collection-carousel", "lookbook-hotspots", "faq-trust"].includes(selected) &&
              <a href={entryPath+"?workbench=1"} target="_blank" rel="noopener"
                className="px-4 py-3 rounded-full bg-[#d7fe83] text-black no-underline font-semibold">Edit sections ↗</a>}
            <a href={entryPath+"?scene="+encodeURIComponent(selected)} target="_blank" rel="noopener"
              className="px-4 py-3 rounded-full bg-[#161a18] text-white no-underline font-semibold">Open ↗</a>
          </div>
        </div>
        <div className="bg-[#c8cbc4] rounded-lg border border-black/10 p-2 md:p-5 flex justify-center min-w-0">
          <iframe title={current.title+" component preview"}
            key={selected} src={entryPath+"?scene="+encodeURIComponent(selected)}
            className={"bg-white rounded-sm block border-none transition-[width] duration-200 " +
              (viewport==="mobile" ? "w-full max-w-[390px]" : "w-full")}
            style={{ height:"min(76svh, 880px)", minHeight:470 }}
          />
        </div>
        <div className="mt-6 flex justify-between gap-5 flex-wrap text-[11px] leading-relaxed text-[#647064]">
          <p>Preview fixture · no customer commerce connection or guaranteed published content</p>
          <p>Legacy interactions require progressive QA · all sources remain independently addressable</p>
        </div>
      </main>
    </div>
  </div>;
}
