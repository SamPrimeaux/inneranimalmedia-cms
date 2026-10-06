import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useEditorialData } from '../../portable/EditorialHost';

interface LookbookChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  hotspots: {
    x: number;
    y: number;
    productId: string;
    label: string;
    sublabel: string;
    price: number;
  }[];
}

export const LookbookPage: React.FC = () => {
  const { HERO_IMAGE, LOOKBOOK_IMAGE, SPLIT_COTTON_IMAGE, SPLIT_LEATHER_IMAGE, PDP_LEATHER_TEE_IMAGE, PRODUCTS } = useEditorialData();
  const CHAPTERS: LookbookChapter[] = [
  {
    id: 'ch-1',
    number: 'CHAPTER 01',
    title: 'THE ARCHITECTURE OF NOIR',
    subtitle: 'Sculpted shoulders, 380gsm English wool crepe & deep double-pleated culottes.',
    description: 'A study in stark monochrome contrast. Heavy tailored structures designed to command the space while fluid drape moves seamlessly with the human gait.',
    image: HERO_IMAGE,
    hotspots: [
      {
        x: 48,
        y: 28,
        productId: 'sable-blazer',
        label: 'Sable Wool Blazer',
        sublabel: 'English Virgin Wool Crepe',
        price: 480
      },
      {
        x: 52,
        y: 68,
        productId: 'slouchy-culottes',
        label: 'Slouchy Tailored Culottes',
        sublabel: 'Double Front Pleat Twill',
        price: 385
      }
    ]
  },
  {
    id: 'ch-2',
    number: 'CHAPTER 02',
    title: 'DISTRESSED NAPPA & RAW TWILL',
    subtitle: 'Full-grain vegetable-tanned Italian leather meeting organic carded cashmere.',
    description: 'Tactile dualism. Untreated drum-dyed skins that evolve and patina with every exposure, grounded by heavy cotton twill textures.',
    image: SPLIT_LEATHER_IMAGE,
    hotspots: [
      {
        x: 42,
        y: 35,
        productId: 'kuro-jacket',
        label: 'Kuro Lambskin Jacket',
        sublabel: 'Drum-Dyed Washed Nappa',
        price: 520
      },
      {
        x: 55,
        y: 75,
        productId: 'ink-boots',
        label: 'Ink Platform Boots',
        sublabel: 'Goodyear Welted Bovine',
        price: 495
      }
    ]
  },
  {
    id: 'ch-3',
    number: 'CHAPTER 03',
    title: 'MIDNIGHT IN MARAIS',
    subtitle: 'Bias-cut sheer column slips layered with floor-skimming trench coats.',
    description: 'Captured under the sodium-vapor rim lighting of nocturnal Paris. The interplay of luminous silk satin reflections against matte oxidized black hardware.',
    image: LOOKBOOK_IMAGE,
    hotspots: [
      {
        x: 50,
        y: 32,
        productId: 'matrix-mini-dress',
        label: 'Matrix Lambskin Dress',
        sublabel: 'Bonded European Lambskin',
        price: 185
      },
      {
        x: 46,
        y: 80,
        productId: 'sharp-leather-trench',
        label: 'Sharp Leather Trench',
        sublabel: 'Hand-Waxed Nappa Coat',
        price: 720
      }
    ]
  }
];

  const { navigateTo, addToCart, formatPrice, setQuickViewProduct } = useCart();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<{
    productId: string;
    label: string;
    sublabel: string;
    price: number;
  } | null>(null);

  const currentChapter = CHAPTERS[activeChapterIndex];

  const handleHotspotBuy = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const prod = PRODUCTS.find(p => p.id === productId);
    if (prod) {
      addToCart(prod, { event: e });
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-28">
      {/* Editorial Header */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#e2a8aa] uppercase font-mono">
              <span className="text-[#8b181b]">◆</span>
              <span>AUTUMN / WINTER 26 CAMPAIGN</span>
              <span>/</span>
              <span>PARIS RUNWAY ARCHIVE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white uppercase">
              EDITORIAL LOOKBOOK
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
              Explore the seasonal narrative in high-resolution campaign frames. Hover over interactive garment coordinates to inspect atelier fabrications and shop the runway ensemble directly.
            </p>
          </div>

          {/* Chapter Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapterIndex(idx);
                  setActiveHotspot(null);
                }}
                className={`px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-wider font-medium transition-all cursor-pointer ${
                  activeChapterIndex === idx
                    ? 'bg-white text-black shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {ch.number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT: Full-Bleed Shoppable Campaign Visual with Pulsing Hotspots (7 Columns) */}
          <div className="lg:col-span-7 relative aspect-[3/4] sm:aspect-[4/5] rounded-sm overflow-hidden bg-neutral-900 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
            <img
              src={currentChapter.image}
              alt={currentChapter.title}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-102"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

            {/* Interactive Hotspot Pins */}
            {currentChapter.hotspots.map((spot, idx) => (
              <div
                key={idx}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onMouseEnter={() => setActiveHotspot(spot)}
                onClick={() => {
                  const prod = PRODUCTS.find(p => p.id === spot.productId);
                  if (prod) navigateTo('pdp', { productId: prod.id });
                }}
              >
                {/* Pulsing ring indicator */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#8b181b] opacity-60" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-white text-black text-[9px] font-bold items-center justify-center shadow-lg border border-black/20">
                    +
                  </span>
                </div>

                {/* Floating garment card popover on hover */}
                {activeHotspot?.productId === spot.productId && (
                  <div
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-56 p-3 bg-black/90 backdrop-blur-md rounded-sm border border-white/20 text-white shadow-2xl z-30 space-y-2 pointer-events-auto animate-[fadeIn_0.2s_ease-out]"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-[#e2a8aa] uppercase tracking-widest font-mono">
                        {spot.sublabel}
                      </p>
                      <h4 className="text-xs font-semibold tracking-wide uppercase">
                        {spot.label}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="text-xs font-bold font-mono">
                        {formatPrice(spot.price)}
                      </span>
                      <button
                        onClick={e => handleHotspotBuy(spot.productId, e)}
                        className="px-2.5 py-1 bg-white text-black hover:bg-[#8b181b] hover:text-white rounded text-[9px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-2.5 h-2.5" />
                        <span>QUICK BUY</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Bottom Chapter Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-[#e2a8aa] border border-white/15 text-[10px] tracking-[0.2em] font-mono uppercase">
                {currentChapter.number} · {currentChapter.title}
              </span>
            </div>
          </div>

          {/* RIGHT: Editorial Narrative & Ensemble Breakdown (5 Columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8b181b]">
                {currentChapter.number} NARRATIVE
              </span>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white uppercase">
                {currentChapter.title}
              </h2>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                {currentChapter.description}
              </p>
            </div>

            {/* Shoppable Looks In This Frame */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 font-mono">
                ENSEMBLE PIECES
              </h3>

              <div className="space-y-3">
                {currentChapter.hotspots.map((spot, idx) => {
                  const prod = PRODUCTS.find(p => p.id === spot.productId);
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-all flex items-center justify-between gap-4 group cursor-pointer"
                      onClick={() => prod && navigateTo('pdp', { productId: prod.id })}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/10 text-white text-[11px] font-mono flex items-center justify-center font-bold">
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-white group-hover:text-[#e2a8aa] transition-colors">
                            {spot.label}
                          </h4>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            {spot.sublabel} · {formatPrice(spot.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => handleHotspotBuy(spot.productId, e)}
                          className="px-3 py-1.5 bg-white text-black hover:bg-[#8b181b] hover:text-white rounded text-[10px] uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>ADD</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Steppers */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                disabled={activeChapterIndex === 0}
                onClick={() => {
                  setActiveChapterIndex(prev => Math.max(0, prev - 1));
                  setActiveHotspot(null);
                }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS CHAPTER</span>
              </button>

              <button
                disabled={activeChapterIndex === CHAPTERS.length - 1}
                onClick={() => {
                  setActiveChapterIndex(prev => Math.min(CHAPTERS.length - 1, prev + 1));
                  setActiveHotspot(null);
                }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <span>NEXT CHAPTER</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
