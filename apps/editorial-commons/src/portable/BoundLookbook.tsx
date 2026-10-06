import React, { useState } from "react";
import { ArrowRight, MapPin, X } from "lucide-react";
import { useBoundSection } from "./BoundSectionContext";
import { sceneBlocks, sceneHref, sceneMedia, sceneText, sceneSurface } from "./section-data";

function percent(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(5, Math.min(95, value));
}

/**
 * Source-backed interactive lookbook with typed hotspot blocks. Never inherits
 * donor products, discounts or commerce events when supplied customer content.
 */
export function BoundLookbook() {
  const { section, resolveMedia } = useBoundSection();
  const surface = sceneSurface(section, "inverse");
  const [openId, setOpenId] = useState<string | null>(null);
  const hotspots = sceneBlocks(section).map((block, i) => ({
    id: block.id,
    title: sceneText(block.data, "title", "Untitled detail"),
    body: sceneText(block.data, "body"),
    badge: sceneText(block.data, "badge"),
    priceLabel: sceneText(block.data, "priceLabel"),
    linkText: sceneText(block.data, "ctaLabel", "Explore"),
    href: sceneHref(block.data, "href"),
    x: percent(block.data.hotspotX, 24 + (i % 3) * 23),
    y: percent(block.data.hotspotY, 34 + (i % 2) * 27),
  }));
  const active = hotspots.find((spot) => spot.id === openId);
  const image = sceneMedia(section?.data, resolveMedia, section?.settings.backgroundMediaKey);
  const heading = sceneText(section?.data, "heading", "Inside the story");
  const body = sceneText(section?.data, "body");

  return <section id={section?.id} data-section-preset="commons/lookbook-hotspots"
    style={{ backgroundColor: surface.background }}
    className={"relative z-20 py-16 md:py-20 px-5 sm:px-10 " +
      (surface.dark ? "text-white" : "text-[var(--editorial-ink)]")}>
    <div className="max-w-[1440px] mx-auto space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          {sceneText(section?.data, "eyebrow") && <span
            className="text-[11px] uppercase tracking-[.25em] font-semibold text-[var(--editorial-accent-soft)]">
            {sceneText(section?.data, "eyebrow")}
          </span>}
          <h2 className="font-bold text-2xl sm:text-4xl uppercase tracking-[.1em]">{heading}</h2>
        </div>
        {body && <p className={"text-sm leading-relaxed max-w-sm " +
          (surface.dark ? "text-white/70" : "text-neutral-700")}>{body}</p>}
      </div>
      <div className="relative h-[420px] sm:h-[580px] lg:h-[760px] overflow-hidden bg-neutral-800 border border-white/10 rounded-sm">
        {image ? <img src={image}
          alt={sceneText(section?.data, "alt", heading)}
          className="absolute inset-0 w-full h-full object-cover" loading="lazy"/> :
          <div role="img" aria-label="Editorial image not configured"
            className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950"/>}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
        {hotspots.map((spot, i) => <button key={spot.id} type="button"
          aria-label={"View " + spot.title}
          aria-pressed={spot.id === active?.id}
          onClick={() => setOpenId((id) => id === spot.id ? null : spot.id)}
          className="absolute z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white text-black shadow-lg border-[3px] border-black/25 hover:scale-110 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--editorial-accent-soft)] transition-transform motion-reduce:transition-none"
          style={{ top: spot.y + "%", left: spot.x + "%", transform: "translate(-50%, -50%)" }}>
          <span aria-hidden="true" className="w-4 h-4 flex items-center justify-center rounded-full bg-[var(--editorial-accent)] text-white">
            <MapPin size={11}/>
          </span>
          <span className="sr-only">{i + 1} of {hotspots.length}</span>
        </button>)}
      </div>
      <div aria-live="polite" className="min-h-16 border-t border-white/20 pt-5">
        {active ? <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            {active.badge && <p className="text-[10px] text-[var(--editorial-accent-soft)] tracking-widest uppercase">{active.badge}</p>}
            <h3 className="text-xl font-bold uppercase tracking-[.08em]">{active.title}</h3>
            {active.body && <p className={"text-sm leading-relaxed " +
              (surface.dark ? "text-white/75" : "text-neutral-700")}>{active.body}</p>}
            {active.priceLabel && <p className={"text-xs " +
              (surface.dark ? "text-white/70" : "text-neutral-600")}>{active.priceLabel}</p>}
            {active.href !== "#" && <a href={active.href}
              className="inline-flex items-center gap-2 py-2 text-xs uppercase font-semibold tracking-wider underline underline-offset-4">
              {active.linkText} <ArrowRight size={15}/>
            </a>}
          </div>
          <button aria-label="Close hotspot details" type="button" onClick={() => setOpenId(null)}
            className="min-h-11 min-w-11 border border-current/30 rounded-full flex items-center justify-center">
            <X size={16}/>
          </button>
        </div> : <p className={"text-xs uppercase tracking-[.17em] " +
          (surface.dark ? "text-white/60" : "text-neutral-600")}>
          {hotspots.length ? "Select a marker to discover the story" : "No hotspots configured"}
        </p>}
      </div>
    </div>
  </section>;
}
