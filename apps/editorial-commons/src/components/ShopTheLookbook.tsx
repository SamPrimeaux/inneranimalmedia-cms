import React, { useState } from 'react';
import { ShoppingBag, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const ShopTheLookbook: React.FC = () => {
  const { LOOKBOOK_IMAGE, PRODUCTS } = useEditorialData();
  const { addToCart, setQuickViewProduct, formatPrice } = useCart();
  const [activeSpot, setActiveSpot] = useState<string | null>('spot-dress');

  const matrixDress = PRODUCTS.find(p => p.id === 'matrix-mini-dress')!;
  const sharpTrench = PRODUCTS.find(p => p.id === 'sharp-leather-trench')!;

  return (
    <section id="lookbook" className="relative z-20 bg-[#090909] text-white py-20 px-6 sm:px-10">
      <div className="max-w-[1440px] mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#e2a8aa] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-[#8b181b]" />
              <span>SHOP THE LOOKBOOK · EDITORIAL 04</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.1em] text-white">
              NOCTURNAL VIGNETTE
            </h2>
          </div>
          <p className="text-xs text-white/60 max-w-sm font-light">
            Interactive editorial looks. Tap any pulsing marker to inspect fabric composition and immediate purchase options.
          </p>
        </div>

        {/* Full-Width Look Image with Hotspots (850px desktop) */}
        <div className="relative w-full h-[520px] sm:h-[680px] md:h-[820px] rounded-sm overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
          <img
            src={LOOKBOOK_IMAGE}
            alt="Shoppable Lookbook Editorial"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Hotspot 1: Matrix Mini Dress */}
          <div className="absolute top-[38%] left-[28%] sm:left-[35%] z-20">
            <button
              onClick={() => setActiveSpot(activeSpot === 'spot-dress' ? null : 'spot-dress')}
              className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer hotspot-pulse"
              aria-label="View Matrix Mini Dress hotspot"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b181b]" />
            </button>

            {activeSpot === 'spot-dress' && (
              <div className="absolute left-10 -top-8 w-56 sm:w-64 bg-white text-black p-4 rounded-sm shadow-2xl z-30 animate-[themeReveal_0.25s_cubic-bezier(0.22,1,0.36,1)] border border-black/10">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase tracking-widest text-[#8b181b] font-bold">HOTSPOT 01</span>
                  <button onClick={() => setActiveSpot(null)} className="text-neutral-400 hover:text-black">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mt-1">
                  {matrixDress.name}
                </h4>
                <div className="text-xs font-semibold tabular-nums text-neutral-800 mt-0.5">
                  {formatPrice(matrixDress.price)} · 2 Colors
                </div>
                <div className="flex gap-2 mt-3 pt-2 border-t border-neutral-100">
                  <button
                    onClick={e => {
                      addToCart(matrixDress, { event: e });
                      setActiveSpot(null);
                    }}
                    className="flex-1 py-2 bg-black hover:bg-[#8b181b] text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>QUICK BUY</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickViewProduct(matrixDress);
                      setActiveSpot(null);
                    }}
                    className="px-2.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-[10px] uppercase tracking-wider font-semibold transition-colors"
                  >
                    DETAILS
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hotspot 2: Sharp Leather Trench */}
          <div className="absolute top-[62%] right-[25%] sm:right-[32%] z-20">
            <button
              onClick={() => setActiveSpot(activeSpot === 'spot-trench' ? null : 'spot-trench')}
              className="relative w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer hotspot-pulse"
              aria-label="View Sharp Leather Trench hotspot"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b181b]" />
            </button>

            {activeSpot === 'spot-trench' && (
              <div className="absolute -left-60 sm:-left-64 -top-8 w-56 sm:w-64 bg-white text-black p-4 rounded-sm shadow-2xl z-30 animate-[themeReveal_0.25s_cubic-bezier(0.22,1,0.36,1)] border border-black/10">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase tracking-widest text-[#8b181b] font-bold">HOTSPOT 02</span>
                  <button onClick={() => setActiveSpot(null)} className="text-neutral-400 hover:text-black">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mt-1">
                  {sharpTrench.name}
                </h4>
                <div className="text-xs font-semibold tabular-nums text-neutral-800 mt-0.5">
                  {formatPrice(sharpTrench.price)} · Full-Grain Nappa
                </div>
                <div className="flex gap-2 mt-3 pt-2 border-t border-neutral-100">
                  <button
                    onClick={e => {
                      addToCart(sharpTrench, { event: e });
                      setActiveSpot(null);
                    }}
                    className="flex-1 py-2 bg-black hover:bg-[#8b181b] text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>QUICK BUY</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickViewProduct(sharpTrench);
                      setActiveSpot(null);
                    }}
                    className="px-2.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-black text-[10px] uppercase tracking-wider font-semibold transition-colors"
                  >
                    DETAILS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
