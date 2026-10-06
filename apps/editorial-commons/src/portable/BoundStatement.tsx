import React from "react";
import { ArrowRight } from "lucide-react";
import { useBoundSection } from "./BoundSectionContext";
import { sceneHref, sceneSurface, sceneText } from "./section-data";

export function BoundStatement() {
  const { section } = useBoundSection();
  const surface = sceneSurface(section);
  const href = sceneHref(section?.data, "ctaHref");
  return <section id={section?.id} data-section-preset="commons/editorial-statement"
    style={{ backgroundColor: surface.background }}
    className={"relative z-20 py-16 px-6 text-center border-b border-black/10 " +
      (surface.dark ? "text-white" : "text-[var(--editorial-ink)]")}>
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
        {sceneText(section?.data, "body")}
      </p>
      {sceneText(section?.data, "ctaLabel") && href !== "#" && <a href={href}
        className="inline-flex min-h-11 items-center gap-2 text-xs uppercase font-bold tracking-[.22em] underline underline-offset-4 hover:text-[var(--editorial-accent)]">
        {sceneText(section?.data, "ctaLabel")}<ArrowRight size={14}/>
      </a>}
    </div>
  </section>;
}
