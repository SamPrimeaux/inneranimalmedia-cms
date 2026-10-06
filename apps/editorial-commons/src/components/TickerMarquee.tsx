import React from 'react';

export const TickerMarquee: React.FC = () => {
  return (
    <section className="relative z-20 bg-black text-white h-[110px] md:h-[142px] border-t border-b border-white/10 flex items-center overflow-hidden select-none">
      <div className="animate-marquee flex items-center whitespace-nowrap text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.16em] uppercase">
        <span className="mx-8 flex items-center gap-6">
          <span>MEMBERS SAVE 20% ON THEIR FIRST ORDER</span>
          <span className="text-[#8b181b] text-3xl">✦</span>
        </span>
        <span className="mx-8 flex items-center gap-6">
          <span>FREE SHIPPING OVER $150</span>
          <span className="text-[#8b181b] text-3xl">✦</span>
        </span>
        <span className="mx-8 flex items-center gap-6">
          <span>VEGETABLE TANNED EUROPEAN CALFSKIN</span>
          <span className="text-[#8b181b] text-3xl">✦</span>
        </span>
        <span className="mx-8 flex items-center gap-6">
          <span>BESPOKE CONCIERGE PACKAGING</span>
          <span className="text-[#8b181b] text-3xl">✦</span>
        </span>

        {/* Duplicate track for continuous loop */}
        <span className="mx-8 flex items-center gap-6">
          <span>MEMBERS SAVE 20% ON THEIR FIRST ORDER</span>
          <span className="text-[#8b181b] text-3xl">✦</span>
        </span>
        <span className="mx-8 flex items-center gap-6">
          <span>FREE SHIPPING OVER $150</span>
          <span className="text-[#8b181b] text-3xl">✦</span>
        </span>
        <span className="mx-8 flex items-center gap-6">
          <span>VEGETABLE TANNED EUROPEAN CALFSKIN</span>
          <span className="text-[#8b181b] text-3xl">✦</span>
        </span>
        <span className="mx-8 flex items-center gap-6">
          <span>BESPOKE CONCIERGE PACKAGING</span>
          <span className="text-[#8b181b] text-3xl">✦</span>
        </span>
      </div>
    </section>
  );
};
