import React from 'react';
import { Sparkles, Play } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const BrandFilm: React.FC = () => {
  const { HERO_IMAGE } = useEditorialData();
  return (
    <section className="relative z-20 h-[650px] md:h-[900px] w-full bg-black text-white flex items-center justify-center overflow-hidden border-t border-b border-white/10">
      {/* Background cinematic media with film grain & slow ambient pulse */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Brand Film Atmosphere"
          className="w-full h-full object-cover opacity-45 scale-110 animate-pulse [animation-duration:12s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,24,27,0.15),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase tracking-[0.3em] text-[#e2a8aa] font-semibold border border-white/15">
          <Sparkles className="w-3 h-3 text-[#8b181b]" />
          <span>CINEMA ARCHIVE · 35MM REEL</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.14em] text-white leading-tight">
          PREMIUM COTTON & LEATHER ESSENTIALS, <br className="hidden sm:inline" />
          MADE FOR A LIFETIME
        </h2>

        <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto font-light leading-relaxed">
          Documenting the master patternmakers of Tuscany and the historic weavers of West Yorkshire as they assemble the Autumn/Winter capsule.
        </p>

        <div className="pt-4">
          <button
            onClick={() => alert('Launching High-Fidelity 4K Brand Film (Autoplay / Muted Experience).')}
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black hover:bg-[#8b181b] hover:text-white text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300 rounded-full cursor-pointer shadow-2xl"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>WATCH THE 35MM FILM</span>
          </button>
        </div>
      </div>
    </section>
  );
};
