import React, { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useEditorialHost } from "./EditorialHost";
import { sceneBlocks, sceneHref, sceneText, sceneSurface } from "./section-data";

/** Brand-neutral, block-backed FAQ. No unverified shipping or trust claims. */
export function BoundFAQ() {
  const { section } = useEditorialHost();
  const surface = sceneSurface(section);
  const id = useId().replaceAll(":", "-");
  const [openId, setOpenId] = useState<string | null>(null);
  const blocks = sceneBlocks(section);
  const faqs = blocks.map((block) => ({
    id: block.id,
    question: sceneText(block.data, "title", sceneText(block.data, "label", "Untitled question")),
    answer: sceneText(block.data, "body", sceneText(block.data, "description")),
  }));
  return <section id={section?.id} data-section-preset="commons/faq-trust"
    style={{ backgroundColor: surface.background }}
    className={"relative z-20 py-20 px-5 sm:px-10 border-y border-black/10 " +
      (surface.dark ? "text-white" : "text-[var(--editorial-ink)]")}>
    <div className="max-w-3xl mx-auto space-y-9">
      <header className="space-y-2 text-center">
        {sceneText(section?.data, "eyebrow") && <p
          className="text-[11px] tracking-[.25em] uppercase font-bold text-[var(--editorial-accent)]">
          {sceneText(section?.data, "eyebrow")}
        </p>}
        <h2 className="font-bold text-2xl sm:text-4xl tracking-[.06em] uppercase">
          {sceneText(section?.data, "heading", "Questions & answers")}
        </h2>
        {sceneText(section?.data, "body") && <p className="text-sm opacity-70 leading-relaxed">
          {sceneText(section?.data, "body")}
        </p>}
      </header>
      {faqs.length ? <div className="space-y-3">
        {faqs.map((faq) => {
          const open = openId === faq.id;
          const panelId = id + "-" + faq.id.replace(/[^a-z0-9_-]/gi, "-");
          return <div key={faq.id} className="border border-black/10 bg-white text-[#111111] rounded-sm overflow-hidden">
            <h3>
              <button type="button" onClick={() => setOpenId(open ? null : faq.id)}
                aria-expanded={open} aria-controls={panelId}
                className="w-full text-left min-h-14 px-5 py-4 flex justify-between items-center gap-4 text-sm font-bold uppercase tracking-wider hover:bg-neutral-50">
                {faq.question}
                {open ? <Minus size={18} className="shrink-0 text-[var(--editorial-accent)]"/> :
                  <Plus size={18} className="shrink-0 text-black/50"/>}
              </button>
            </h3>
            <div id={panelId} hidden={!open} className="px-5 py-5 border-t border-black/10 text-sm leading-relaxed text-neutral-600">
              {faq.answer || "No answer configured."}
            </div>
          </div>;
        })}
      </div> : <p role="status" className="text-center text-sm opacity-60">No questions configured.</p>}
      {sceneText(section?.data, "ctaLabel") &&
        sceneHref(section?.data, "ctaHref") !== "#" && <div className="text-center">
        <a href={sceneHref(section?.data, "ctaHref")}
          className="inline-flex min-h-11 items-center justify-center px-6 border border-current/30 text-xs uppercase tracking-widest font-semibold hover:text-[var(--editorial-accent)]">
          {sceneText(section?.data, "ctaLabel")}
        </a>
      </div>}
    </div>
  </section>;
}
