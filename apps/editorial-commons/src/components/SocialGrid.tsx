import { useEditorialBrand } from '../portable/EditorialHost';
import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const SocialGrid: React.FC = () => {
  const brand = useEditorialBrand();
  const { HERO_IMAGE, LOOKBOOK_IMAGE, SPLIT_COTTON_IMAGE, SPLIT_LEATHER_IMAGE, PDP_LEATHER_TEE_IMAGE } = useEditorialData();
  const tiles = [
    { src: HERO_IMAGE, tag: `${brand.socialHandle} · Sable Wool Crepe`, likes: '1.4k' },
    { src: LOOKBOOK_IMAGE, tag: `${brand.socialHandle} · Evening Vignette AW26`, likes: '2.8k' },
    { src: SPLIT_COTTON_IMAGE, tag: `${brand.socialHandle} · 380gsm Carded Fleece`, likes: '920' },
    { src: SPLIT_LEATHER_IMAGE, tag: `${brand.socialHandle} · Drum-Dyed Kuro Biker`, likes: '3.1k' },
    { src: PDP_LEATHER_TEE_IMAGE, tag: `${brand.socialHandle} · 0.6mm Calfskin Tee`, likes: '1.8k' },
    { src: HERO_IMAGE, tag: `${brand.socialHandle} · Florence Workshop Archive`, likes: '4.2k' }
  ];

  return (
    <section className="relative z-20 bg-white text-[#111111] pt-20 pb-16">
      <div className="max-w-[1440px] mx-auto px-6 mb-8 flex flex-col sm:flex-row items-baseline justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8b181b] font-bold block mb-1">
            COMMUNITY & DISPATCH
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.14em] text-black">
            {brand.socialHandle} · FOLLOW US
          </h2>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="cascade-link text-xs font-bold uppercase tracking-[0.2em] text-neutral-800 hover:text-black inline-flex items-center gap-1.5"
        >
          <span>VISIT INSTAGRAM ARCHIVE</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 3x2 Full Bleed Square Grid (476x476 tiles) */}
      <div className="grid grid-cols-2 md:grid-cols-3 w-full">
        {tiles.map((tile, idx) => (
          <a
            key={idx}
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden bg-neutral-900 border-r border-b border-black/10"
          >
            <img
              src={tile.src}
              alt={tile.tag}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            />
            {/* Hover overlay with Instagram icon & tag */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white">
              <div className="flex justify-end">
                <Instagram className="w-5 h-5 text-white/80" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold tracking-wider">{tile.tag}</div>
                <div className="text-[10px] text-white/60 tracking-widest uppercase">{tile.likes} LIKES</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
