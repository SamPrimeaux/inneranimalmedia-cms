import React, { useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEditorialHost } from "./EditorialHost";
import { sceneBlocks, sceneHref, sceneMedia, sceneText, sceneSurface } from "./section-data";

/**
 * Bound editorial collection cards are content links, not purchase operations.
 * A real host may later present merchant-specific product actions through a
 * separate authorized adapter; no donor cart/catalog data crosses this lane.
 */
export function BoundCollectionCarousel() {
  const { section, resolveMedia } = useEditorialHost();
  const surface = sceneSurface(section);
  const cards = useMemo(() => sceneBlocks(section).map((block) => ({
    id: block.id,
    title: sceneText(block.data, "title", "Untitled"),
    label: sceneText(block.data, "label", sceneText(block.data, "caption")),
    group: sceneText(block.data, "group", ""),
    badge: sceneText(block.data, "badge", ""),
    priceLabel: sceneText(block.data, "priceLabel", ""),
    href: sceneHref(block.data, "href"),
    image: sceneMedia(block.data, resolveMedia),
    alt: sceneText(block.data, "alt", sceneText(block.data, "title", "Collection image")),
  })), [section, resolveMedia]);
  const groups = useMemo(() => [...new Set(cards.map((card) => card.group).filter(Boolean))], [cards]);
  const [filter, setFilter] = useState("");
  const track = useRef<HTMLDivElement>(null);
  const selected = groups.includes(filter) ? filter : "";
  const visible = selected ? cards.filter((card) => card.group === selected) : cards;
  const shift = (amount: number) => {
    track.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return <section id={section?.id}
    data-section-preset="commons/collection-carousel"
    style={{ backgroundColor: surface.background }}
    className={"relative z-20 py-16 sm:py-20 px-5 sm:px-10 border-b border-black/10 " +
      (surface.dark ? "text-white" : "text-[var(--editorial-ink)]")}>
    <div className="max-w-[1440px] mx-auto space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          {sceneText(section?.data, "eyebrow") && <p className="text-xs font-bold tracking-[.23em] uppercase text-[var(--editorial-accent)]">
            {sceneText(section?.data, "eyebrow")}
          </p>}
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-[.09em]">
            {sceneText(section?.data, "heading", "The collection")}
          </h2>
          {sceneText(section?.data, "body") && <p className="text-sm max-w-2xl opacity-70">
            {sceneText(section?.data, "body")}
          </p>}
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Scroll collection left" onClick={() => shift(-360)}
            className="h-11 w-11 rounded-full border border-current/20 flex items-center justify-center hover:bg-black hover:text-white">
            <ChevronLeft size={18}/>
          </button>
          <button type="button" aria-label="Scroll collection right" onClick={() => shift(360)}
            className="h-11 w-11 rounded-full border border-current/20 flex items-center justify-center hover:bg-black hover:text-white">
            <ChevronRight size={18}/>
          </button>
        </div>
      </div>
      {groups.length > 0 && <div className="flex flex-wrap items-center gap-2" aria-label="Collection filters">
        {["", ...groups].map((group) => <button type="button" key={group || "all"}
          aria-pressed={selected === group}
          onClick={() => { setFilter(group); track.current?.scrollTo({ left: 0 }); }}
          className={"px-4 min-h-10 border text-xs uppercase font-semibold tracking-wider rounded-full " +
            (selected === group ? "bg-black text-white border-black" : "border-black/20 hover:border-black/60")}>
          {group || "All"}
        </button>)}
      </div>}
      {visible.length > 0 ? <div ref={track}
        aria-label="Collection cards"
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar"
        style={{ touchAction: "pan-x", overscrollBehaviorX: "contain" }}>
        {visible.map((card) => <article key={card.id}
          className="group shrink-0 w-[min(80vw,320px)] md:w-[360px] snap-start border border-black/10 bg-neutral-50 text-[#111111]">
          <div className="aspect-[3/4] bg-neutral-200 relative overflow-hidden">
            {card.image ? <img src={card.image} alt={card.alt} loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.035] motion-reduce:group-hover:scale-100 transition-transform duration-500"/>
            : <div role="img" aria-label="Media unavailable" className="w-full h-full bg-neutral-200"/>}
            {card.badge && <span className="absolute top-3 left-3 text-[10px] uppercase font-bold bg-black text-white px-3 py-1">{card.badge}</span>}
          </div>
          <div className="p-5 space-y-2">
            {card.label && <p className="text-[10px] tracking-[.2em] uppercase opacity-60">{card.label}</p>}
            <h3 className="text-sm sm:text-base uppercase font-bold tracking-[.08em]">{card.title}</h3>
            {card.priceLabel && <p className="text-xs font-semibold">{card.priceLabel}</p>}
            {card.href !== "#" && <a href={card.href}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider underline underline-offset-4 hover:text-[var(--editorial-accent)]">
              Explore <ArrowRight size={14}/>
            </a>}
          </div>
        </article>)}
      </div> : <p role="status" className="py-12 text-center text-sm opacity-70">
        No collection entries configured.
      </p>}
    </div>
  </section>;
}
