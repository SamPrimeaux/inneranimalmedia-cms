import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const SplitMediaDiptych: React.FC = () => {
  const { SPLIT_COTTON_IMAGE, SPLIT_LEATHER_IMAGE } = useEditorialData();
  return (
    <section id="split-media" className="relative z-20 bg-[#0b0b0b] text-white">
      {/* 2-Column Split Diptych (stacks on mobile per spec: 1642px stacked) */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Panel A: Discover Cotton (maroon hoodie, dark mood) */}
        <div className="group relative min-h-[500px] md:min-h-[860px] overflow-hidden flex flex-col justify-end p-8 sm:p-14 border-b md:border-b-0 md:border-r border-white/10">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={SPLIT_COTTON_IMAGE}
              alt="Discover Cotton & Knitwear"
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>

          <div className="relative z-10 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#e2a8aa] font-bold">
              NATURAL FIBERS · 380GSM
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
              DISCOVER COTTON
            </h3>
            <p className="text-xs text-white/70 max-w-sm font-light leading-relaxed">
              Unbleached organic carded fleece and Scottish cashmere knitwear engineered for deep winter comfort.
            </p>
            <div className="pt-2">
              <a
                href="#collection-tab"
                className="cascade-link text-xs uppercase font-bold tracking-[0.2em] text-white hover:text-[#e2a8aa] inline-flex items-center gap-2 group/link"
              >
                <span>EXPLORE COTTON EDIT</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Panel B: Discover Leather (black leather jacket, oxblood glow) */}
        <div className="group relative min-h-[500px] md:min-h-[860px] overflow-hidden flex flex-col justify-end p-8 sm:p-14">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={SPLIT_LEATHER_IMAGE}
              alt="Discover Leather & Outerwear"
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>

          <div className="relative z-10 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#e2a8aa] font-bold">
              DRUM-DYED EUROPEAN SKINS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
              DISCOVER LEATHER
            </h3>
            <p className="text-xs text-white/70 max-w-sm font-light leading-relaxed">
              Full-grain vegetable-tanned calfskin jackets, gauntlets, and boots with custom oxidized black ruthenium hardware.
            </p>
            <div className="pt-2">
              <a
                href="#bundle"
                className="cascade-link text-xs uppercase font-bold tracking-[0.2em] text-white hover:text-[#e2a8aa] inline-flex items-center gap-2 group/link"
              >
                <span>EXPLORE LEATHER ARCHIVE</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
