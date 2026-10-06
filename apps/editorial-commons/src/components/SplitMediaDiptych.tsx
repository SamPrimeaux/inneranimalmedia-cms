import React from "react";
import { ArrowRight } from "lucide-react";
import { useEditorialData, useEditorialHost } from "../portable/EditorialHost";
import { sceneBlocks, sceneHref, sceneMedia, sceneText } from "../portable/section-data";

/** Panel content is a SiteContentBlock: copy, media and link are host-owned. */
export const SplitMediaDiptych: React.FC = () => {
  const { SPLIT_COTTON_IMAGE, SPLIT_LEATHER_IMAGE } = useEditorialData();
  const { section, resolveMedia } = useEditorialHost();
  const panels = section ? sceneBlocks(section).map((block) => ({
    id: block.id,
    eyebrow: sceneText(block.data, "eyebrow", sceneText(block.data, "label")),
    title: sceneText(block.data, "title", "Untitled panel"),
    body: sceneText(block.data, "body"),
    alt: sceneText(block.data, "alt", sceneText(block.data, "title", "Panel image")),
    image: sceneMedia(block.data, resolveMedia),
    action: sceneText(block.data, "ctaLabel", "Explore"),
    href: sceneHref(block.data, "href"),
  })) : [
    {
      id: "cotton", eyebrow: "NATURAL FIBERS · 380GSM", title: "DISCOVER COTTON",
      body: "Unbleached organic carded fleece and Scottish cashmere knitwear engineered for deep winter comfort.",
      alt: "Discover Cotton & Knitwear", image: SPLIT_COTTON_IMAGE,
      action: "EXPLORE COTTON EDIT", href: "#collection-tab",
    },
    {
      id: "leather", eyebrow: "DRUM-DYED EUROPEAN SKINS", title: "DISCOVER LEATHER",
      body: "Full-grain vegetable-tanned calfskin jackets, gauntlets, and boots with custom oxidized black ruthenium hardware.",
      alt: "Discover Leather & Outerwear", image: SPLIT_LEATHER_IMAGE,
      action: "EXPLORE LEATHER ARCHIVE", href: "#bundle",
    },
  ];

  return <section id={section?.id ?? "split-media"}
      data-section-preset="commons/split-media"
      style={section ? { backgroundColor: section.settings.surface === "canvas" ?
        "var(--editorial-canvas)" : section.settings.surface === "paper" ? "var(--editorial-paper)" : "#0b0b0b" } : undefined}
      className="relative z-20 bg-[#0b0b0b] text-white">
    <div className="grid grid-cols-1 md:grid-cols-2">
      {panels.map((panel) => <article key={panel.id}
        className="group relative min-h-[500px] md:min-h-[860px] overflow-hidden flex flex-col justify-end p-8 sm:p-14 border-b border-r border-white/10">
        <div className="absolute inset-0 overflow-hidden">
          {panel.image ? <img src={panel.image} alt={panel.alt} loading="lazy"
            className="w-full h-full object-cover scale-105 group-hover:scale-110 motion-reduce:group-hover:scale-105 transition-transform duration-700" />
          : <div role="img" aria-label="Panel media not configured" className="w-full h-full bg-neutral-800" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 space-y-3">
          {panel.eyebrow && <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--editorial-accent-soft)] font-bold">{panel.eyebrow}</span>}
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">{panel.title}</h3>
          {panel.body && <p className="text-xs text-white/80 max-w-sm font-light leading-relaxed">{panel.body}</p>}
          <div className="pt-2">
            <a href={panel.href !== "#" ? panel.href : undefined}
              className="cascade-link text-xs uppercase font-bold tracking-[0.2em] text-white hover:text-[var(--editorial-accent-soft)] inline-flex items-center gap-2 group/link">
              <span>{panel.action}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 motion-reduce:group-hover/link:translate-x-0 transition-transform" />
            </a>
          </div>
        </div>
      </article>)}
    </div>
    {panels.length === 0 && <p role="status" className="p-10 text-center">No panels configured for this section.</p>}
  </section>;
};
