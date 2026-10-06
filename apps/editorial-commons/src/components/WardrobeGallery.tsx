import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const WardrobeGallery: React.FC = () => {
  const { CATEGORIES_WARDROBE } = useEditorialData();
  return (
    <section
      id="wardrobe"
      className="relative z-20 bg-white text-[#111111] py-20 px-6 sm:px-10 md:px-12 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] transition-all"
    >
      <div className="max-w-[1440px] mx-auto space-y-10">
        {/* Section Heading (36px/700/UPPER per spec) */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[0.12em] uppercase text-[#111111]">
            THE WARDROBE
          </h2>
          <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-medium">
            Core category architecture for Autumn / Winter 26
          </p>
        </div>

        {/* 5-tile 3:4 Cut-out Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 overflow-x-auto pb-4">
          {CATEGORIES_WARDROBE.map(cat => (
            <a
              key={cat.id}
              href="#collection-tab"
              className="group relative bg-[#f5f5f5] rounded-sm overflow-hidden p-3 flex flex-col justify-between border border-black/5 hover:border-black/20 hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-200/60 rounded-sm mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-[12px] font-bold tracking-[0.16em] uppercase text-[#111111] group-hover:text-[#8b181b] transition-colors">
                    {cat.name}
                  </h3>
                  <div className="text-[10px] text-neutral-400 font-medium tracking-wider">
                    {cat.count}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-neutral-400 group-hover:text-black transition-colors uppercase tracking-widest">
                  EXPLORE →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
