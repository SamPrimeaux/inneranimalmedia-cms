import React from "react";
import { ArrowRight } from "lucide-react";
import { useBoundSection } from "./BoundSectionContext";
import { sceneBlocks, sceneHref, sceneMedia, sceneText } from "./section-data";

export function BoundDiptych() {
  const { section, resolveMedia } = useBoundSection();
  const panels = sceneBlocks(section);
  return <section id={section?.id} data-section-preset="commons/split-media"
    className="relative z-20 bg-[#0b0b0b] text-white">
    {panels.length ? <div className="grid grid-cols-1 md:grid-cols-2">
      {panels.map((panel) => {
        const title = sceneText(panel.data, "title", "Untitled panel");
        const media = sceneMedia(panel.data, resolveMedia);
        const href = sceneHref(panel.data, "href");
        return <article key={panel.id}
          className="group relative min-h-[440px] md:min-h-[680px] overflow-hidden flex flex-col justify-end p-8 sm:p-14 border border-white/10">
          <div className="absolute inset-0">
            {media ? <img src={media} alt={sceneText(panel.data, "alt", title)}
              loading="lazy" className="w-full h-full object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-700"/> :
              <div role="img" aria-label="Panel media not configured" className="w-full h-full bg-neutral-800"/>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"/>
          </div>
          <div className="relative z-10 space-y-3">
            {sceneText(panel.data, "eyebrow") && <p className="text-[10px] uppercase tracking-[.3em] text-[var(--editorial-accent-soft)] font-bold">
              {sceneText(panel.data, "eyebrow")}
            </p>}
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider">{title}</h3>
            {sceneText(panel.data, "body") && <p className="text-sm text-white/80 max-w-sm leading-relaxed">
              {sceneText(panel.data, "body")}
            </p>}
            {href !== "#" && <a href={href} className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest underline underline-offset-4">
              {sceneText(panel.data, "ctaLabel", "Explore")}<ArrowRight size={14}/>
            </a>}
          </div>
        </article>;
      })}
    </div> : <p role="status" className="px-8 py-20 text-center">No panels configured.</p>}
  </section>;
}
