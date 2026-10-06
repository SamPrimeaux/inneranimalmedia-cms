import { useEditorialBrand } from '../portable/EditorialHost';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const HeroCurtain: React.FC = () => {
  const brand = useEditorialBrand();
  const { HERO_IMAGE, PRODUCTS } = useEditorialData();
  const { addToCart, setQuickViewProduct, formatPrice, setIsBagOpen } = useCart();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sticky curtain reveal logic: as scrollY advances (0 -> 900px), hero scales down slightly and blurs
  const progress = Math.min(1, scrollY / 900);
  const scale = 1 - progress * 0.15;
  const blurPx = progress * 6;
  const opacity = 1 - progress * 0.35;

  const sableBlazer = PRODUCTS.find(p => p.id === 'sable-blazer')!;
  const merinoTurtleneck = PRODUCTS.find(p => p.id === 'merino-turtleneck')!;

  const handleAddAllToCart = (e: React.MouseEvent) => {
    addToCart(sableBlazer, { event: e });
    setTimeout(() => {
      addToCart(merinoTurtleneck);
      setIsBagOpen(true);
    }, 200);
  };

  return (
    <section className="sticky top-0 z-10 h-screen min-h-[640px] max-h-[950px] w-full overflow-hidden bg-[#0b0b0b] text-white">
      {/* Background Campaign Visual with Scroll-linked depth */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${scale})`,
          filter: `blur(${blurPx}px)`,
          opacity: opacity
        }}
      >
        <img
          src={HERO_IMAGE}
          alt={`${brand.name} ${brand.season} concept image`}
          className="w-full h-full object-cover object-[65%_center] sm:object-center"
          referrerPolicy="no-referrer"
        />
        {/* Editorial Vignette & Oxblood Rim-light grading overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent sm:from-black/85 sm:via-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-20 h-full max-w-[1440px] mx-auto px-5 sm:px-12 md:px-16 flex flex-col justify-end sm:justify-center pb-16 sm:pb-0">
        <div className="max-w-xl space-y-4 sm:space-y-6 pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#e2a8aa] font-semibold border border-white/10">
            <Sparkles className="w-3 h-3 text-[#8b181b]" />
            <span>AUTUMN / WINTER 26 CAMPAIGN</span>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight uppercase leading-[1.08] text-balance">
              EFFORTLESS <br />
              <span className="font-bold tracking-[0.08em] text-white">BY DESIGN</span>
            </h1>
            <p className="text-xs sm:text-base text-white/75 font-light leading-relaxed max-w-md pt-1 sm:pt-2">
              Considered silhouettes and quiet textures engineered from 380gsm English wool crepe and glove-grade calfskin.
            </p>
          </div>

          {/* Primary CTA and Look Bundle (fluid on mobile) */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={handleAddAllToCart}
              className="py-3.5 sm:py-4 px-6 sm:px-8 bg-white text-black hover:bg-[#8b181b] hover:text-white text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 group cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD ALL TO CART · {formatPrice(720)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#wardrobe"
              className="py-3.5 sm:py-4 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-[0.2em] transition-colors border border-white/15 text-center"
            >
              EXPLORE WARDROBE
            </a>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 pt-1 sm:pt-3 text-[10px] sm:text-[11px] text-white/50 tracking-wider uppercase">
            <span>Includes Sable Blazer & Merino Knit</span>
            <span>·</span>
            <span>Florence & Yorkshire</span>
          </div>
        </div>

        {/* Hotspot #1: Sable Blazer on Garment (Positioned accurately without clashing) */}
        <div className="absolute top-[38%] right-[16%] sm:top-[48%] sm:right-[30%] z-30">
          <button
            onClick={() => setActiveHotspot(activeHotspot === 'hotspot-blazer' ? null : 'hotspot-blazer')}
            className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer hotspot-pulse"
            aria-label="View Sable Blazer hotspot"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#8b181b]" />
          </button>

          {/* Hotspot Popover Card */}
          {activeHotspot === 'hotspot-blazer' && (
            <div className="absolute -left-48 sm:left-9 -top-12 w-56 sm:w-64 bg-[#121212]/95 backdrop-blur-md p-4 rounded-sm border border-white/20 shadow-2xl text-left animate-[themeReveal_0.3s_cubic-bezier(0.22,1,0.36,1)] z-40">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-widest text-[#8b181b] font-bold">LOOK PIECE 01</span>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-white/40 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mt-1 truncate">
                {sableBlazer.name}
              </h4>
              <div className="text-xs text-white/70 tabular-nums font-mono mt-0.5">
                {formatPrice(sableBlazer.price)}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={e => {
                    addToCart(sableBlazer, { event: e });
                    setActiveHotspot(null);
                  }}
                  className="flex-1 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-[#8b181b] hover:text-white transition-colors"
                >
                  QUICK ADD
                </button>
                <button
                  onClick={() => {
                    setQuickViewProduct(sableBlazer);
                    setActiveHotspot(null);
                  }}
                  className="px-2.5 py-1.5 bg-white/10 text-white text-[10px] uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  DETAILS
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hotspot #2: Merino Knit */}
        <div className="absolute top-[52%] right-[22%] sm:top-[68%] sm:right-[38%] z-30">
          <button
            onClick={() => setActiveHotspot(activeHotspot === 'hotspot-merino' ? null : 'hotspot-merino')}
            className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer hotspot-pulse"
            aria-label="View Merino Turtleneck hotspot"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#8b181b]" />
          </button>

          {activeHotspot === 'hotspot-merino' && (
            <div className="absolute -left-48 sm:left-9 -top-12 w-56 sm:w-64 bg-[#121212]/95 backdrop-blur-md p-4 rounded-sm border border-white/20 shadow-2xl text-left animate-[themeReveal_0.3s_cubic-bezier(0.22,1,0.36,1)] z-40">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-widest text-[#8b181b] font-bold">LOOK PIECE 02</span>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-white/40 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mt-1 truncate">
                {merinoTurtleneck.name}
              </h4>
              <div className="text-xs text-white/70 tabular-nums font-mono mt-0.5">
                {formatPrice(merinoTurtleneck.price)}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={e => {
                    addToCart(merinoTurtleneck, { event: e });
                    setActiveHotspot(null);
                  }}
                  className="flex-1 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-[#8b181b] hover:text-white transition-colors"
                >
                  QUICK ADD
                </button>
                <button
                  onClick={() => {
                    setQuickViewProduct(merinoTurtleneck);
                    setActiveHotspot(null);
                  }}
                  className="px-2.5 py-1.5 bg-white/10 text-white text-[10px] uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  DETAILS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
