import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData, useEditorialHost } from '../portable/EditorialHost';
import { BoundCollectionCarousel } from '../portable/BoundCollectionCarousel';
import { Product } from '../types';

export const CollectionCarousel: React.FC = () => {
  const { section } = useEditorialHost();
  return section ? <BoundCollectionCarousel /> : <LegacyCollectionCarousel />;
};

const LegacyCollectionCarousel: React.FC = () => {
  const { PRODUCTS } = useEditorialData();
  const { addToCart, setQuickViewProduct, formatPrice, setActiveProductPage } = useCart();
  const [activeTab, setActiveTab] = useState<'NEW' | 'BEST' | 'SALE'>('NEW');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const getFilteredProducts = (): Product[] => {
    switch (activeTab) {
      case 'BEST':
        return PRODUCTS.filter(p => (p.rating && p.rating >= 5) || p.badge === 'FEATURED' || p.price > 400);
      case 'SALE':
        return PRODUCTS.filter(p => p.isSale || p.badge === 'SALE');
      case 'NEW':
      default:
        return PRODUCTS;
    }
  };

  const currentProducts = getFilteredProducts();

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // Passive scroll listener for maximum 120fps touch performance
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollByDirection = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    const scrollAmount = dir === 'left' ? -480 : 480;
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="collection-tab" className="relative z-20 bg-white text-[#111111] py-16 sm:py-20 px-5 sm:px-10 border-b border-black/5">
      <div className="max-w-[1440px] mx-auto space-y-6 sm:space-y-8">
        {/* Tabs Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-b border-black/10 pb-4 sm:pb-6">
          <div className="flex items-center gap-6 sm:gap-12 text-xs sm:text-base font-bold uppercase tracking-[0.18em]">
            <button
              onClick={() => setActiveTab('NEW')}
              className={`pb-2 transition-all relative cursor-pointer ${
                activeTab === 'NEW' ? 'text-black' : 'text-neutral-400 hover:text-black'
              }`}
            >
              NEW ARRIVALS
              {activeTab === 'NEW' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('BEST')}
              className={`pb-2 transition-all relative cursor-pointer ${
                activeTab === 'BEST' ? 'text-black' : 'text-neutral-400 hover:text-black'
              }`}
            >
              BEST SELLERS
              {activeTab === 'BEST' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('SALE')}
              className={`pb-2 transition-all relative cursor-pointer ${
                activeTab === 'SALE' ? 'text-[#8b181b]' : 'text-neutral-400 hover:text-[#8b181b]'
              }`}
            >
              SALE ARCHIVE
              {activeTab === 'SALE' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b181b]" />
              )}
            </button>
          </div>

          {/* Navigation Chevron Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollByDirection('left')}
              className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByDirection('right')}
              className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3:4 Horizontal Carousel Track with Native Mobile Touch Handling */}
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar select-none"
          style={{
            touchAction: 'pan-x',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain'
          }}
        >
          {currentProducts.map(product => {
            const isHovered = hoveredCardId === product.id;
            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group shrink-0 w-[240px] sm:w-[320px] md:w-[390px] snap-start bg-neutral-50 rounded-sm overflow-hidden flex flex-col justify-between border border-black/5 hover:border-black/20 hover:shadow-xl transition-all duration-300"
              >
                {/* 3:4 Image with instant swap on hover */}
                <div
                  onClick={() => setActiveProductPage(product)}
                  className="relative aspect-[3/4] overflow-hidden bg-neutral-200 cursor-pointer"
                >
                  <img
                    src={isHovered && product.hoverImage ? product.hoverImage : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-150 pointer-events-none"
                  />

                  {/* SALE or NEW badge */}
                  {product.badge && (
                    <span
                      className={`absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                        product.badge === 'SALE' ? 'bg-[#8b181b] text-white' : 'bg-black text-white'
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}

                  {/* Quick Actions Overlay Bar */}
                  <div
                    onClick={e => e.stopPropagation()}
                    className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <button
                      onClick={e => addToCart(product, { event: e })}
                      className="flex-1 py-2.5 bg-white text-black hover:bg-black hover:text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>QUICK BUY</span>
                    </button>
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="w-10 py-2.5 bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info & Swatches */}
                <div className="p-3.5 space-y-1.5 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
                      {product.category}
                    </span>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1">
                      {product.colors.map(col => (
                        <span
                          key={col.name}
                          className="w-2.5 h-2.5 rounded-full border border-black/20"
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      ))}
                    </div>
                  </div>

                  <h3
                    onClick={() => setActiveProductPage(product)}
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111] truncate group-hover:text-[#8b181b] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs sm:text-sm font-semibold tabular-nums text-black">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-neutral-400 line-through tabular-nums">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thin Scroll-Progress Bar */}
        <div className="w-full max-w-xs sm:max-w-md mx-auto h-[2px] bg-neutral-200 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-black transition-all duration-150 ease-out"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
      </div>
    </section>
  );
};
