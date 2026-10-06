import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const FullscreenEditorial: React.FC = () => {
  const { PRODUCTS, HERO_IMAGE } = useEditorialData();
  const { addToCart, setQuickViewProduct, formatPrice } = useCart();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);

  const calmPullover = PRODUCTS.find(p => p.id === 'calm-pullover')!;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Calculate how far section has scrolled through viewport
      const total = rect.height + windowHeight;
      const current = windowHeight - rect.top;
      const ratio = Math.max(0, Math.min(1, current / total));
      setScrollRatio(ratio);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const editorialCopy = "Garments cut with unyielding architectural integrity. We eliminate unnecessary trims and excess lining to let the weight and natural memory of British wool and French calfskin define the silhouette through seasons of continuous wear.";
  const words = editorialCopy.split(' ');

  return (
    <section
      ref={sectionRef}
      className="relative z-20 min-h-[900px] w-full bg-[#0e0708] text-white flex flex-col justify-between p-8 sm:p-14 md:p-20 overflow-hidden border-t border-white/10"
    >
      {/* Background full-bleed lifestyle media with red/oxblood grading */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Timeless Style Editorial"
          className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0708] via-[#1a0709]/70 to-[#0e0708]" />
      </div>

      {/* Top Tagline */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#e2a8aa] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#8b181b]" />
          <span>ACT III · THE BRAND WORLD</span>
        </div>
      </div>

      {/* Center/Sticky Content Slot: Word-by-Word Reveal */}
      <div className="relative z-10 max-w-2xl my-auto py-12 space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-[0.08em] uppercase text-white leading-[1.1]">
          TIMELESS STYLE <br />
          FOR EVERY MOMENT
        </h2>

        {/* Word-by-word scroll-linked text fade */}
        <p className="text-base sm:text-xl font-light leading-relaxed flex flex-wrap gap-x-2 gap-y-1">
          {words.map((word, idx) => {
            const wordThreshold = (idx + 1) / words.length;
            const isLit = scrollRatio >= wordThreshold * 0.85;
            return (
              <span
                key={idx}
                className={`transition-opacity duration-300 ${
                  isLit ? 'opacity-100 text-white font-normal' : 'opacity-25 text-white/40'
                }`}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>

      {/* White-Framed Product Card (Bottom-Right) */}
      <div className="relative z-10 self-end w-full max-w-[320px] bg-white text-black p-4 rounded-sm shadow-2xl border-4 border-white/90 space-y-3">
        <div className="flex gap-3">
          <img
            src={calmPullover.image}
            alt={calmPullover.name}
            className="w-20 h-24 object-cover bg-neutral-100 rounded-sm shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-widest text-[#8b181b] font-bold">
              {calmPullover.badge}
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-black truncate mt-0.5">
              {calmPullover.name}
            </h4>
            <div className="flex items-center gap-2 text-xs mt-1">
              <span className="font-bold tabular-nums text-black">
                {formatPrice(calmPullover.price)}
              </span>
              <span className="line-through text-neutral-400 tabular-nums">
                {formatPrice(calmPullover.originalPrice!)}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-1 line-clamp-2">
              Organic carded cashmere fisherman knit.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-1 border-t border-neutral-100">
          <button
            onClick={e => addToCart(calmPullover, { event: e })}
            className="flex-1 py-2 bg-black hover:bg-[#8b181b] text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>QUICK BUY</span>
          </button>
          <button
            onClick={() => setQuickViewProduct(calmPullover)}
            className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-[11px] uppercase tracking-wider font-semibold transition-colors"
          >
            VIEW
          </button>
        </div>
      </div>
    </section>
  );
};
