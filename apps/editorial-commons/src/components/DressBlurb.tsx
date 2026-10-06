import { BoundStatement } from "../portable/BoundStatement";
import React from "react";
import { ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEditorialData, useEditorialHost } from "../portable/EditorialHost";
import { sceneHref, sceneText } from "../portable/section-data";

/** A standalone editorial statement, with an optional host-owned navigation CTA. */
export const DressBlurb: React.FC = () => {
  const { section } = useEditorialHost();
  return section ? <BoundStatement /> : <LegacyDressBlurb />;
};

const LegacyDressBlurb: React.FC = () => {
  const { section } = useEditorialHost();
  const inverse = section?.settings.surface === "inverse" || section?.settings.surface === "image";
  const surface = !section ? undefined : inverse ? "#111111" :
    section.settings.surface === "canvas" ? "var(--editorial-canvas)" :
    section.settings.surface === "muted" ? "#e8e8e2" : "var(--editorial-paper)";
  const { PRODUCTS } = useEditorialData();
  const { setQuickViewProduct } = useCart();
  const matrixDress = PRODUCTS.find(product => product.id === "matrix-mini-dress");
  const body = sceneText(section?.data, "body",
    "Black leather cut close to the body and zipped from collar to hem — an unapologetic collision of razor tailoring and nocturnal ease.");
  const ctaLabel = sceneText(section?.data, "ctaLabel", "SHOP THE DRESS");
  const ctaHref = sceneHref(section?.data, "ctaHref", "#");
  return (
    <section id={section?.id} data-section-preset="commons/editorial-statement"
      style={surface ? { backgroundColor: surface } : undefined}
      className={"relative z-20 bg-white py-16 px-6 text-center border-b border-black/10 " +
        (inverse ? "text-white" : "text-[#111111]")}>
      <div className="max-w-2xl mx-auto space-y-4">
        <p className={"text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto " +
          (inverse ? "text-white/90" : "text-neutral-800")}>
          {section ? body : "“" + body + "”"}
        </p>
        <div>
          {section ? (ctaLabel && ctaHref !== "#" && <a href={ctaHref}
            className={"cascade-link text-xs uppercase font-bold tracking-[0.22em] inline-flex items-center gap-2 group " +
              (inverse ? "text-white hover:text-[var(--editorial-accent-soft)]" :
                "text-[#111111] hover:text-[var(--editorial-accent)]")}>
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform" />
          </a>) : <button type="button" disabled={!matrixDress}
            onClick={() => matrixDress && setQuickViewProduct(matrixDress)}
            className="cascade-link text-xs uppercase font-bold tracking-[0.22em] text-[#111111] hover:text-[var(--editorial-accent)] inline-flex items-center gap-2 group disabled:opacity-40">
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>}
        </div>
      </div>
    </section>
  );
};
