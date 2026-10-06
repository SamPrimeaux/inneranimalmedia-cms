import { BoundWardrobe } from "../portable/BoundWardrobe";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useEditorialData, useEditorialHost } from "../portable/EditorialHost";
import { sceneBlocks, sceneHref, sceneMedia, sceneText } from "../portable/section-data";

/** One visual renderer; donor categories are only a standalone preview fixture. */
export const WardrobeGallery: React.FC = () => {
  const { section } = useEditorialHost();
  return section ? <BoundWardrobe /> : <LegacyWardrobeGallery />;
};

const LegacyWardrobeGallery: React.FC = () => {
  const { CATEGORIES_WARDROBE } = useEditorialData();
  const { section, resolveMedia } = useEditorialHost();
  const inverse = section?.settings.surface === "inverse" || section?.settings.surface === "image";
  const surface = !section ? undefined : inverse ? "#111111" :
    section.settings.surface === "canvas" ? "var(--editorial-canvas)" :
    section.settings.surface === "muted" ? "#e8e8e2" : "var(--editorial-paper)";
  const heading = sceneText(section?.data, "heading", "THE WARDROBE");
  const eyebrow = sceneText(section?.data, "eyebrow", "Core category architecture for Autumn / Winter 26");
  const categories = section ? sceneBlocks(section).map((block) => ({
    id: block.id,
    title: sceneText(block.data, "title", sceneText(block.data, "label", "Untitled")),
    caption: sceneText(block.data, "caption", sceneText(block.data, "description")),
    image: sceneMedia(block.data, resolveMedia),
    href: sceneHref(block.data, "href"),
    alt: sceneText(block.data, "alt", sceneText(block.data, "title", "Category image")),
  })) : CATEGORIES_WARDROBE.map((category) => ({
    id: category.id, title: category.name, caption: String(category.count),
    image: category.image, href: "#collection-tab", alt: category.name,
  }));

  return (
    <section id={section?.id ?? "wardrobe"}
      data-section-preset="commons/wardrobe-gallery"
      style={surface ? { backgroundColor: surface } : undefined}
      className={"relative z-20 bg-white py-20 px-6 sm:px-10 md:px-12 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] " +
        (inverse ? "text-white" : "text-[#111111]")}>
      <div className="max-w-[1440px] mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className={"text-3xl md:text-4xl font-bold tracking-[0.12em] uppercase " + (inverse ? "text-white" : "text-[#111111]")}>
            {heading}
          </h2>
          {eyebrow && <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-medium">{eyebrow}</p>}
        </div>
        {categories.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 pb-4">
            {categories.map((category) => (
              <a key={category.id} href={category.href !== "#" ? category.href : undefined}
                className="group relative min-w-0 bg-[#f5f5f5] rounded-sm overflow-hidden p-3 flex flex-col justify-between border border-black/5 hover:border-black/20 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[3/4] relative overflow-hidden bg-neutral-200/60 rounded-sm mb-3">
                  {category.image ? <img src={category.image} alt={category.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-500" />
                  : <div role="img" aria-label="Image not configured"
                    className="w-full h-full bg-neutral-200" />}
                  <div aria-hidden="true"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 gap-2">
                  <div className="min-w-0">
                    <h3 className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#111111] group-hover:text-[var(--editorial-accent)] transition-colors">{category.title}</h3>
                    {category.caption && <p className="text-[10px] text-neutral-500 font-medium tracking-wider mt-1">{category.caption}</p>}
                  </div>
                  <span aria-hidden="true" className="text-[11px] font-semibold text-neutral-500 group-hover:text-black transition-colors uppercase tracking-widest">↗</span>
                </div>
              </a>
            ))}
          </div>
        ) : <p role="status" className="text-center text-neutral-600">No categories configured for this section.</p>}
      </div>
    </section>
  );
};
