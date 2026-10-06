import React, { useState } from 'react';
import { Check, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const BundleBuilder: React.FC = () => {
  const { PRODUCTS } = useEditorialData();
  const { addToCart, setIsBagOpen, formatPrice } = useCart();

  const bundleItems = [
    PRODUCTS.find(p => p.id === 'gloom-gauntlets')!,
    PRODUCTS.find(p => p.id === 'ink-boots')!,
    PRODUCTS.find(p => p.id === 'kuro-jacket')!,
    PRODUCTS.find(p => p.id === 'slate-trousers')!
  ];

  // Track which bundle items are included
  const [includedIds, setIncludedIds] = useState<string[]>(
    bundleItems.map(item => item.id)
  );

  const toggleItem = (id: string) => {
    setIncludedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedProducts = bundleItems.filter(p => includedIds.includes(p.id));
  const originalSum = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  // 20% bundle privilege discount if 3 or more pieces selected
  const hasBundleDiscount = selectedProducts.length >= 3;
  const discountAmount = hasBundleDiscount ? originalSum * 0.2 : 0;
  const bundleTotal = originalSum - discountAmount;

  const handleAddBundle = (e: React.MouseEvent) => {
    selectedProducts.forEach((p, idx) => {
      setTimeout(() => {
        addToCart(p);
      }, idx * 100);
    });
    setTimeout(() => setIsBagOpen(true), selectedProducts.length * 100 + 100);
  };

  return (
    <section id="bundle" className="relative z-20 bg-white text-[#111111] py-24 px-6 sm:px-10 border-b border-black/10">
      <div className="max-w-[1440px] mx-auto space-y-10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8b181b] font-bold block mb-1">
            CURATED CAPSULE · SAVE 20%
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-[0.1em] text-black">
            BETTER TOGETHER
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Mix and match our signature leather & tailoring elements. Select 3 or more pieces to automatically activate the 20% capsule privilege.
          </p>
        </div>

        {/* Layout: Left scrolling products stack, Right Pinned Sticky Summary Card */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left Column: Bundle Products List */}
          <div className="flex-1 space-y-6 w-full">
            {bundleItems.map((product, idx) => {
              const isIncluded = includedIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleItem(product.id)}
                  className={`p-5 rounded-sm border cursor-pointer transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 ${
                    isIncluded
                      ? 'bg-neutral-50 border-black/30 shadow-md'
                      : 'bg-white border-black/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-28 h-36 object-cover bg-neutral-200 rounded-sm shrink-0"
                  />

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono tracking-widest text-[#8b181b] font-bold">
                        PIECE 0{idx + 1}
                      </span>
                      {/* Checkbox Chip */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          toggleItem(product.id);
                        }}
                        className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5 transition-colors ${
                          isIncluded
                            ? 'bg-black text-white'
                            : 'bg-neutral-100 text-neutral-500 border border-neutral-300'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{isIncluded ? 'INCLUDED' : 'ADD PIECE'}</span>
                      </button>
                    </div>

                    <h3 className="text-base font-bold uppercase tracking-wider text-black">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                    <div className="text-sm font-semibold tabular-nums text-black mt-2">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: PINNED STICKY SUMMARY CARD (top: 80px) */}
          <div className="w-full lg:w-[360px] lg:sticky lg:top-24 bg-[#0d0d0d] text-white p-8 rounded-sm shadow-2xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#e2a8aa] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8b181b]" />
                <span>CAPSULE SUMMARY</span>
              </span>
              <span className="text-xs text-white/50 tabular-nums">
                {selectedProducts.length} of {bundleItems.length} selected
              </span>
            </div>

            {/* Selected Items mini summary list */}
            <div className="space-y-2 text-xs">
              {selectedProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center text-white/80">
                  <span className="truncate max-w-[200px]">{p.name}</span>
                  <span className="tabular-nums font-mono text-white/60">{formatPrice(p.price)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="flex justify-between text-xs text-white/60">
                <span>Original Retail</span>
                <span className="tabular-nums font-mono">{formatPrice(originalSum)}</span>
              </div>

              {hasBundleDiscount ? (
                <div className="flex justify-between text-xs text-[#e2a8aa]">
                  <span>Capsule Privilege (-20%)</span>
                  <span className="tabular-nums font-mono">-{formatPrice(discountAmount)}</span>
                </div>
              ) : (
                <div className="text-[11px] text-[#e2a8aa] italic">
                  Select {3 - selectedProducts.length} more piece(s) to unlock 20% off!
                </div>
              )}

              <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                <span className="text-xs uppercase tracking-wider font-semibold text-white">
                  Your Total
                </span>
                <span className="text-2xl font-bold font-mono tabular-nums text-white">
                  {formatPrice(bundleTotal)}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleAddBundle}
              disabled={selectedProducts.length === 0}
              className="w-full py-4 bg-white text-black hover:bg-[#8b181b] hover:text-white disabled:bg-neutral-800 disabled:text-neutral-500 text-xs font-bold uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD THE SELECTED ({selectedProducts.length})</span>
            </button>

            <p className="text-[10px] text-white/40 text-center tracking-wider">
              INCLUDES COMPLIMENTARY TRAVEL GARMENT BAG & LEATHER CONDITIONER
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
