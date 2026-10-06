import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const PromoGrid: React.FC = () => {
  const { HERO_IMAGE, LOOKBOOK_IMAGE, SPLIT_LEATHER_IMAGE } = useEditorialData();
  return (
    <section className="hidden md:block relative z-20 bg-[#0b0b0b] text-white py-20 px-8 lg:px-12 border-t border-b border-white/10">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Hand-drawn red scribble SVG accent */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-12 h-6 text-[#8b181b]"
              viewBox="0 0 100 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M5 20 Q 25 5, 45 25 T 85 15 Q 95 30, 80 35" />
            </svg>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#e2a8aa] font-semibold">
              CURATED EDITORIAL TILES
            </span>
          </div>
          <span className="text-xs text-white/40 uppercase tracking-widest">
            AW26 LIMITED SELECTION
          </span>
        </div>

        {/* 4-up Dark Promo Tiles Grid */}
        <div className="grid grid-cols-4 gap-6 items-stretch min-h-[580px]">
          {/* Tile 1: Street Photo Blazer */}
          <div className="group relative rounded-sm overflow-hidden bg-neutral-900 border border-white/10 flex flex-col justify-end p-6">
            <img
              src={HERO_IMAGE}
              alt="Tailored Blazer Edit"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#e2a8aa] font-bold">
                ICONIC CUTS
              </span>
              <h3 className="text-lg font-bold tracking-wider uppercase text-white">
                SABLE BLAZERS
              </h3>
              <a
                href="#featured-pdp"
                className="inline-block py-2.5 px-6 bg-white text-black hover:bg-[#8b181b] hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                BLAZER
              </a>
            </div>
          </div>

          {/* Tile 2: Dresses Promo */}
          <div className="group relative rounded-sm overflow-hidden bg-neutral-900 border border-white/10 flex flex-col justify-end p-6">
            <img
              src={LOOKBOOK_IMAGE}
              alt="Dresses Edit"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#e2a8aa] font-bold">
                EVENING FLUIDITY
              </span>
              <h3 className="text-lg font-bold tracking-wider uppercase text-white">
                MATRIX & SLIP SILHOUETTES
              </h3>
              <a
                href="#collection-tab"
                className="inline-block py-2.5 px-6 bg-white text-black hover:bg-[#8b181b] hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                DRESSES
              </a>
            </div>
          </div>

          {/* Tile 3: High-Impact Statement Text Block */}
          <div className="bg-[#141414] border border-white/10 p-8 flex flex-col justify-between rounded-sm">
            <div className="space-y-4">
              <div className="w-8 h-8 rounded-full bg-[#8b181b]/20 text-[#8b181b] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#e2a8aa] font-bold block">
                SPECIAL INVITATION
              </span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white leading-tight">
                10% OFF THIS EDIT
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Applied automatically at checkout on all tailored jackets and lambskin footwear when exploring the Autumn/Winter capsule today.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <a
                href="#collection-tab"
                className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-white hover:text-[#8b181b] transition-colors group"
              >
                <span>SHOP THE EDIT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Tile 4: Studio Leather Video / Still */}
          <div className="group relative rounded-sm overflow-hidden bg-neutral-900 border border-white/10 flex flex-col justify-end p-6">
            <img
              src={SPLIT_LEATHER_IMAGE}
              alt="Craftsmanship Leather"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#e2a8aa] font-bold">
                TANNED IN FLORENCE
              </span>
              <h3 className="text-lg font-bold tracking-wider uppercase text-white">
                THE LEATHER ATELIER
              </h3>
              <a
                href="#editorial"
                className="inline-block py-2.5 px-6 bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                READ MORE
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
