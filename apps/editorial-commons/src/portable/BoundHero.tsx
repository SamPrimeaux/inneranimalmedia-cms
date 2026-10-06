import React from "react";
import { ArrowRight } from "lucide-react";
import { useBoundSection } from "./BoundSectionContext";
import { sceneHref, sceneMedia, sceneText } from "./section-data";

/** Canonical hero layout; donor-only merchandising remains in legacy scene. */
export function BoundHero() {
  const { section, resolveMedia } = useBoundSection();
  const image = sceneMedia(section?.data, resolveMedia, section?.settings.backgroundMediaKey);
  const heading = sceneText(section?.data, "heading", "Editorial story");
  const cta = sceneText(section?.data, "ctaLabel");
  const href = sceneHref(section?.data, "ctaHref");
  return <section id={section?.id} data-section-preset="commons/curtain-hero"
    className="relative z-10 min-h-[min(850px,100dvh)] sm:min-h-[640px] w-full overflow-hidden bg-[#0b0b0b] text-white flex flex-col justify-center">
    <div className="absolute inset-0">
      {image ? <img src={image} alt={sceneText(section?.data, "alt", heading)}
        className="w-full h-full object-cover object-[65%_center] sm:object-center"/> :
        <div role="img" aria-label="Hero media not configured"
          className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-950"/>}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent"/>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"/>
    </div>
    <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-12 md:px-16 py-24 sm:py-32">
      <div className="max-w-xl space-y-5">
        {sceneText(section?.data, "eyebrow") && <p
          className="inline-flex px-3 py-1 bg-white/10 backdrop-blur rounded-full text-[11px] tracking-[.24em] uppercase text-[var(--editorial-accent-soft)] border border-white/10">
          {sceneText(section?.data, "eyebrow")}
        </p>}
        <h1 className="text-4xl sm:text-6xl font-light tracking-tight uppercase leading-[1.08] text-balance">{heading}</h1>
        {sceneText(section?.data, "body") && <p className="text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
          {sceneText(section?.data, "body")}
        </p>}
        {cta && href !== "#" && <a href={href}
          className="inline-flex min-h-11 items-center justify-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-xs uppercase tracking-[.18em] font-semibold">
          {cta}<ArrowRight size={16}/>
        </a>}
      </div>
    </div>
  </section>;
}
