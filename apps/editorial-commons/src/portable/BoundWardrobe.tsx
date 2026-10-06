import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useBoundSection } from "./BoundSectionContext";
import { sceneBlocks, sceneHref, sceneMedia, sceneSurface, sceneText } from "./section-data";

export function BoundWardrobe() {
  const { section, resolveMedia } = useBoundSection();
  const surface = sceneSurface(section);
  const blocks = sceneBlocks(section);
  return <section id={section?.id} data-section-preset="commons/wardrobe-gallery"
    style={{ backgroundColor: surface.background }}
    className={"relative z-20 py-20 px-5 sm:px-10 md:px-12 " +
      (surface.dark ? "text-white" : "text-[var(--editorial-ink)]")}>
    <div className="max-w-[1440px] mx-auto space-y-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-[.12em] uppercase">
          {sceneText(section?.data, "heading", "Collections")}
        </h2>
        {sceneText(section?.data, "eyebrow") && <p className="text-xs uppercase tracking-[.2em] opacity-65">
          {sceneText(section?.data, "eyebrow")}
        </p>}
      </div>
      {blocks.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {blocks.map((block) => {
          const title = sceneText(block.data, "title", "Untitled");
          const href = sceneHref(block.data, "href");
          const media = sceneMedia(block.data, resolveMedia);
          return <article key={block.id} className="group min-w-0">
            <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden">
              {media ? <img src={media} alt={sceneText(block.data, "alt", title)}
                loading="lazy" className="w-full h-full object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-700"/> :
                <div role="img" aria-label="Collection media not configured" className="w-full h-full bg-neutral-700"/>}
            </div>
            <div className="pt-5 flex justify-between items-start gap-4">
              <div><h3 className="text-sm font-bold tracking-[.12em] uppercase">{title}</h3>
                {sceneText(block.data, "caption") && <p className="text-xs opacity-65 mt-1">{sceneText(block.data, "caption")}</p>}
              </div>
              {href !== "#" && <a href={href} aria-label={"Explore " + title}
                className="p-2 border border-current/20 hover:text-[var(--editorial-accent)]"><ArrowUpRight size={16}/></a>}
            </div>
          </article>;
        })}
      </div> : <p role="status" className="text-center text-sm opacity-60">No collections configured.</p>}
    </div>
  </section>;
}
