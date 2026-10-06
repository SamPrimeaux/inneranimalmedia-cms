import { useEditorialBrand } from '../portable/EditorialHost';
import React, { useState } from 'react';
import { X, Plus, Sparkles, Tag, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const DiscoverDrawer: React.FC = () => {
  const brand = useEditorialBrand();
  const { PRODUCTS } = useEditorialData();
  const { isDiscoverOpen, setIsDiscoverOpen, addToCart, setQuickViewProduct, formatPrice } = useCart();
  const [activeTab, setActiveTab] = useState<'NEW' | 'OFFERS' | 'MORE'>('NEW');

  if (!isDiscoverOpen) return null;

  const newItems = PRODUCTS.filter(p => p.badge === 'NEW' || p.badge === 'FEATURED').slice(0, 3);
  const offerItems = PRODUCTS.filter(p => p.isSale).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsDiscoverOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity duration-300"
      />

      <div
        className="absolute inset-y-0 right-0 w-full max-w-[620px] bg-[#0d0d0d] text-white border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-[themeReveal_0.4s_cubic-bezier(0.22,1,0.36,1)]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 bg-[#0e0e0e]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8b181b]" />
              <h2 className="text-sm uppercase tracking-[0.25em] font-semibold text-white">DISCOVER {brand.name}</h2>
            </div>
            <button
              onClick={() => setIsDiscoverOpen(false)}
              className="p-1 hover:text-[#8b181b] transition-colors"
              aria-label="Close discover drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 mt-6 border-b border-white/10 text-xs font-semibold uppercase tracking-[0.2em]">
            <button
              onClick={() => setActiveTab('NEW')}
              className={`pb-2 transition-all relative ${
                activeTab === 'NEW' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              NEW & NOW
              {activeTab === 'NEW' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b181b]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('OFFERS')}
              className={`pb-2 transition-all relative ${
                activeTab === 'OFFERS' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              PRIVILEGED OFFERS
              {activeTab === 'OFFERS' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b181b]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('MORE')}
              className={`pb-2 transition-all relative ${
                activeTab === 'MORE' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              EDITORIAL NOTES
              {activeTab === 'MORE' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b181b]" />
              )}
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {activeTab === 'NEW' && (
            <div className="space-y-6">
              {/* Campaign Announcement Card */}
              <div className="p-6 bg-gradient-to-br from-[#1a0f11] via-[#121212] to-black border border-[#8b181b]/30 rounded-sm">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#e2a8aa] font-semibold block mb-1">
                  NEW SEASON EDIT
                </span>
                <h3 className="font-serif text-2xl text-white font-light mb-2">
                  Autumn / Winter 26 Drop 02
                </h3>
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  Sculptural outerwear and bonded French calfskin essentials crafted for transitional city climates.
                </p>
                <a
                  href="#shop"
                  onClick={() => setIsDiscoverOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-white hover:text-[#8b181b] font-medium"
                >
                  <span>Explore Drop 02</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Quick Add Products */}
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold block mb-4">
                  CURATED NEW RELEASES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {newItems.map(p => (
                    <div
                      key={p.id}
                      className="bg-white/5 p-3 rounded-sm border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between"
                    >
                      <div
                        onClick={() => {
                          setQuickViewProduct(p);
                          setIsDiscoverOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="aspect-[3/4] overflow-hidden rounded-sm mb-2.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white truncate">
                          {p.name}
                        </h4>
                        <div className="text-xs text-white/60 tabular-nums mt-0.5">
                          {formatPrice(p.price)}
                        </div>
                      </div>

                      <button
                        onClick={e => addToCart(p, { event: e })}
                        className="mt-3 w-full py-2 bg-white/10 hover:bg-[#8b181b] text-white text-[11px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>QUICK ADD</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OFFERS' && (
            <div className="space-y-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                <div className="flex items-center gap-2 text-[#e2a8aa] text-xs font-semibold uppercase tracking-widest mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>WELCOME CODE</span>
                </div>
                <div className="text-lg font-mono tracking-wider font-bold text-white">DEMO15</div>
                <p className="text-xs text-white/60 mt-1">
                  Example discount appearance only. Not valid at checkout.
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold block mb-4">
                  SEASONAL SALE SELECTIONS
                </span>
                <div className="space-y-3">
                  {offerItems.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5 hover:border-white/20 transition-all justify-between"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-20 object-cover bg-neutral-900 rounded-sm shrink-0"
                      />
                      <div className="flex-1 min-w-0 px-2">
                        <div className="text-[10px] uppercase tracking-widest text-[#8b181b] font-bold">
                          {p.badge || 'SALE'}
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white truncate">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span className="text-white tabular-nums font-semibold">
                            {formatPrice(p.price)}
                          </span>
                          {p.originalPrice && (
                            <span className="text-white/40 line-through text-[11px] tabular-nums">
                              {formatPrice(p.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={e => addToCart(p, { event: e })}
                        className="p-2 bg-white/10 hover:bg-[#8b181b] text-white rounded-sm transition-colors shrink-0"
                        title="Add to Cart"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'MORE' && (
            <div className="space-y-4 text-xs text-white/70 leading-relaxed">
              <div className="p-4 bg-white/5 rounded-sm border border-white/5 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b181b] font-bold">
                  DIRECTOR NOTE
                </span>
                <h4 className="text-sm font-semibold uppercase text-white">THE GEOMETRY OF SHADOW</h4>
                <p>
                  Autumn / Winter 26 rejects frivolous ornamentation in favor of tectonic cuts and raw tactile honesty. Each silhouette is tested across 40 hours of real movement.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
