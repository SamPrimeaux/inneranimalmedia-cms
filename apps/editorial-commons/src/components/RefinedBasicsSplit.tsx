import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const RefinedBasicsSplit: React.FC = () => {
  const { PRODUCTS, HERO_IMAGE } = useEditorialData();
  const { addToCart, setQuickViewProduct, formatPrice, setActiveProductPage } = useCart();
  const basics = PRODUCTS.slice(0, 8);

  return (
    <section className="relative z-20 bg-white text-[#111111] py-24 px-6 md:px-10 border-b border-black/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left Media Column: PINNED STICKY AT TOP:0 (desktop) */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-20 space-y-6">
            <div className="relative aspect-[3/4] max-h-[850px] w-full rounded-sm overflow-hidden bg-neutral-900 border border-black/10 shadow-xl">
              <img
                src={HERO_IMAGE}
                alt="Refined Basics Campaign"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#e2a8aa] font-bold">
                  THE FOUNDATIONAL EDIT
                </span>
                <h3 className="font-serif text-3xl font-light tracking-wide text-white">
                  Quiet Architecture for the Everyday
                </h3>
                <p className="text-xs text-white/70 max-w-md font-light leading-relaxed">
                  Sculpted essentials engineered to be layered, repeated, and worn in perpetuity.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 2-Column Scrolling Product Grid */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="border-b border-black/10 pb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b181b] font-bold block mb-1">
                AUTUMN / WINTER 26
              </span>
              {/* Refined Basics 38.4px / 400 regular weight as specified */}
              <h2 className="text-3xl sm:text-[38.4px] font-normal uppercase tracking-[0.06em] text-black">
                REFINED BASICS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {basics.map(product => (
                <div
                  key={product.id}
                  className="group bg-neutral-50 rounded-sm overflow-hidden border border-black/5 hover:border-black/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div
                    onClick={() => setActiveProductPage(product)}
                    className="relative aspect-[3/4] overflow-hidden bg-neutral-200 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase tracking-widest">
                        {product.badge}
                      </span>
                    )}

                    <div
                      onClick={e => e.stopPropagation()}
                      className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <button
                        onClick={e => addToCart(product, { event: e })}
                        className="flex-1 py-2 bg-white text-black hover:bg-[#8b181b] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-2 bg-black/80 hover:bg-black text-white rounded-sm shadow transition-colors"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1 bg-white">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
                      {product.category}
                    </div>
                    <h4
                      onClick={() => setActiveProductPage(product)}
                      className="text-xs font-bold uppercase tracking-wider text-black truncate group-hover:text-[#8b181b] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    <div className="text-xs font-semibold tabular-nums text-black pt-0.5">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
