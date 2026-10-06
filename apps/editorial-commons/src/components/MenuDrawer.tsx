import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, X, Globe, User, Sparkles, ExternalLink, Layers, ShieldCheck, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialBrand, useEditorialData } from '../portable/EditorialHost';
import { PageRoute } from '../types';

export const MenuDrawer: React.FC = () => {
  const brand = useEditorialBrand();
  const { CATEGORIES_WARDROBE, PRODUCTS } = useEditorialData();
  const {
    isMenuOpen,
    setIsMenuOpen,
    currency,
    setCurrency,
    navigateTo
  } = useCart();
  const [currentPanel, setCurrentPanel] = useState<'root' | 'shop' | 'material'>('root');

  if (!isMenuOpen) return null;

  const handleOpenProduct = (productId: string) => {
    navigateTo('pdp', { productId });
  };

  const handleNavigatePage = (page: PageRoute, category?: string) => {
    navigateTo(page, { category });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed & blurred backdrop */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* FULL SCREEN HEIGHT Glassmorphic / Frosted Left Sheet Drawer */}
      <div
        className="absolute inset-y-0 left-0 w-full max-w-[640px] h-full bg-[#0a0a0a]/90 backdrop-blur-2xl text-white border-r border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden animate-[themeReveal_0.4s_cubic-bezier(0.22,1,0.36,1)] z-10"
      >
        {/* Top Header inside drawer */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-[#8b181b] text-xs">◆</span>
            <span className="font-semibold tracking-[0.3em] uppercase text-sm sm:text-base">{brand.name}</span>
            <span className="text-[10px] tracking-[0.2em] text-[#e2a8aa] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
              AW26 DIRECTORY
            </span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
          {currentPanel === 'root' && (
            <div className="space-y-6">
              {/* Primary Pages Directory */}
              <div className="space-y-2 text-[18px] sm:text-[20px] font-light tracking-[0.08em] uppercase">
                <button
                  onClick={() => handleNavigatePage('home')}
                  className="w-full text-left py-2 hover:text-[#e2a8aa] transition-colors hover:translate-x-2 duration-300 cursor-pointer block"
                >
                  FLAGSHIP STOREFRONT
                </button>

                <button
                  onClick={() => handleNavigatePage('collections')}
                  className="w-full text-left py-2 hover:text-[#e2a8aa] transition-colors hover:translate-x-2 duration-300 cursor-pointer block"
                >
                  COLLECTIONS & ARCHIVE
                </button>

                <button
                  onClick={() => setCurrentPanel('shop')}
                  className="w-full flex items-center justify-between py-2 text-left hover:text-[#e2a8aa] transition-colors group cursor-pointer"
                >
                  <span className="group-hover:translate-x-2 transition-transform duration-300">
                    SHOP BY SILHOUETTE
                  </span>
                  <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => handleNavigatePage('lookbook')}
                  className="w-full text-left py-2 hover:text-[#e2a8aa] transition-colors hover:translate-x-2 duration-300 cursor-pointer block"
                >
                  EDITORIAL LOOKBOOK
                </button>

                <button
                  onClick={() => handleNavigatePage('maison')}
                  className="w-full text-left py-2 hover:text-[#e2a8aa] transition-colors hover:translate-x-2 duration-300 cursor-pointer block"
                >
                  MAISON & ATELIERS
                </button>

                <button
                  onClick={() => handleNavigatePage('reserve')}
                  className="w-full text-left py-2 hover:text-[#e2a8aa] transition-colors hover:translate-x-2 duration-300 cursor-pointer flex items-center justify-between group"
                >
                  <span>VIP DROP VAULT</span>
                  <Ticket className="w-4 h-4 text-[#e2a8aa] opacity-70 group-hover:opacity-100" />
                </button>

                <button
                  onClick={() => handleNavigatePage('studio')}
                  className="w-full text-left py-2.5 px-3 bg-white/5 border border-[#8b181b]/40 rounded hover:bg-[#8b181b]/20 text-[#e2a8aa] transition-all hover:translate-x-1 duration-300 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#e2a8aa]" />
                    <span className="font-semibold">BRAND STREAM STUDIO</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-[#8b181b] text-white px-2 py-0.5 rounded">
                    NEW
                  </span>
                </button>
              </div>

              <div className="h-[1px] bg-white/10 my-4" />

              {/* Direct PDP quick links */}
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-mono block mb-2">
                  ICONIC SILHOUETTE SPOTLIGHTS (PDP)
                </span>
                <button
                  onClick={() => handleOpenProduct('leather-tee')}
                  className="w-full text-left py-1.5 text-xs text-neutral-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Calfskin Leather Tee ($325)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </button>
                <button
                  onClick={() => handleOpenProduct('sable-blazer')}
                  className="w-full text-left py-1.5 text-xs text-neutral-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Sable Wool Blazer ($480)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </button>
                <button
                  onClick={() => handleOpenProduct('matrix-mini-dress')}
                  className="w-full text-left py-1.5 text-xs text-neutral-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Matrix Lambskin Dress ($185)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </button>
              </div>

              <div className="h-[1px] bg-white/10 my-4" />

              {/* Inspiration Category Horizontal Rail */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-semibold font-mono">
                    CATEGORIES ARCHIVE
                  </div>
                  <span className="text-[9px] text-[#e2a8aa] tracking-widest uppercase font-mono">5 SILHOUETTES</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x no-scrollbar">
                  {CATEGORIES_WARDROBE.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleNavigatePage('collections', cat.name)}
                      className="group shrink-0 w-[140px] snap-start bg-white/5 rounded-xs overflow-hidden border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all text-left cursor-pointer"
                    >
                      <div className="aspect-[3/4] relative overflow-hidden bg-neutral-900">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="text-[11px] font-semibold tracking-wider uppercase text-white">
                            {cat.name}
                          </div>
                          <div className="text-[9px] text-white/60 font-mono">{cat.count}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Panel: Shop Categories */}
          {currentPanel === 'shop' && (
            <div className="space-y-6">
              <button
                onClick={() => setCurrentPanel('root')}
                className="flex items-center gap-2 text-[12px] uppercase tracking-widest text-[#e2a8aa] font-medium hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>

              <div className="space-y-6 pt-2">
                <div>
                  <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-semibold block mb-2.5 font-mono">
                    LEATHER & TAILORING
                  </span>
                  <div className="space-y-2 pl-2 text-[14px]">
                    <button
                      onClick={() => handleOpenProduct('sable-blazer')}
                      className="block text-left text-white/90 hover:text-white hover:translate-x-1.5 transition-all cursor-pointer"
                    >
                      Sable Wool Blazer
                    </button>
                    <button
                      onClick={() => handleOpenProduct('sharp-leather-trench')}
                      className="block text-left text-white/90 hover:text-white hover:translate-x-1.5 transition-all cursor-pointer"
                    >
                      Sharp Leather Trench
                    </button>
                    <button
                      onClick={() => handleOpenProduct('kuro-jacket')}
                      className="block text-left text-white/90 hover:text-white hover:translate-x-1.5 transition-all cursor-pointer"
                    >
                      Kuro Washed Jacket
                    </button>
                    <button
                      onClick={() => handleNavigatePage('collections', 'LEATHER')}
                      className="block text-left text-[#e2a8aa] text-xs pt-1 uppercase tracking-wider cursor-pointer"
                    >
                      View All Leather & Tailoring →
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-semibold block mb-2.5 font-mono">
                    TOPS & SECOND-SKINS
                  </span>
                  <div className="space-y-2 pl-2 text-[14px]">
                    <button
                      onClick={() => handleOpenProduct('leather-tee')}
                      className="block text-left text-white/90 hover:text-white hover:translate-x-1.5 transition-all cursor-pointer"
                    >
                      Calfskin Leather Tee
                    </button>
                    <button
                      onClick={() => handleOpenProduct('merino-turtleneck')}
                      className="block text-left text-white/90 hover:text-white hover:translate-x-1.5 transition-all cursor-pointer"
                    >
                      Merino Second-Skin Turtleneck
                    </button>
                    <button
                      onClick={() => handleNavigatePage('collections', 'TOPS')}
                      className="block text-left text-[#e2a8aa] text-xs pt-1 uppercase tracking-wider cursor-pointer"
                    >
                      View All Tops →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info inside Drawer */}
        <div className="p-6 sm:p-8 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="USD" className="text-black bg-white">USD ($)</option>
              <option value="EUR" className="text-black bg-white">EUR (€)</option>
              <option value="GBP" className="text-black bg-white">GBP (£)</option>
              <option value="JPY" className="text-black bg-white">JPY (¥)</option>
            </select>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#e2a8aa]">
            © 2026 {brand.name} · Editorial concept
          </span>
        </div>
      </div>
    </div>
  );
};
