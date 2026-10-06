import React, { useState } from 'react';
import { ShoppingBag, Check, ChevronDown, ShieldCheck, Ruler, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const FeaturedPDP: React.FC = () => {
  const { PRODUCTS, PDP_LEATHER_TEE_IMAGE, HERO_IMAGE, SPLIT_LEATHER_IMAGE, LOOKBOOK_IMAGE } = useEditorialData();
  const { addToCart, setIsBagOpen, formatPrice } = useCart();
  const product = PRODUCTS.find(p => p.id === 'leather-tee')!;

  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState('M');
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      count: 1,
      event: e
    });
    setTimeout(() => setIsBagOpen(true), 600);
  };

  const galleryImages = [
    { src: PDP_LEATHER_TEE_IMAGE, caption: 'Angle 01 · Front Architectural Proportion' },
    { src: HERO_IMAGE, caption: 'Angle 02 · Styled with Tailored Wool Sable Blazer' },
    { src: SPLIT_LEATHER_IMAGE, caption: 'Angle 03 · Macro Grain Detail & Laser-Cut Hem' },
    { src: LOOKBOOK_IMAGE, caption: 'Angle 04 · Evening Low-Light Vignette' }
  ];

  return (
    <section id="featured-pdp" className="relative z-20 bg-white text-[#111111] py-24 px-6 md:px-10 border-b border-black/10">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-10 text-center md:text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8b181b] font-bold block mb-1">
            FEATURED AUTUMN/WINTER MASTERPIECE
          </span>
          <h2 className="text-3xl font-bold uppercase tracking-[0.1em] text-black">
            CALFSKIN AS TEXTILE
          </h2>
        </div>

        {/* 3-Column PDP Grid with Dual Pinned Sticky Rails on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* LEFT RAIL: Pinned Sticky at top:80px (3 cols) */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-6 bg-neutral-50 p-6 rounded-sm border border-black/10 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[#8b181b] text-white text-[9px] font-bold uppercase tracking-widest">
                  SALE ARCHIVE
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">0.6MM CALFSKIN</span>
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-2xl font-bold tabular-nums font-mono text-black">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm line-through text-neutral-400 tabular-nums font-mono">
                  {formatPrice(product.originalPrice!)}
                </span>
                <span className="text-xs text-[#8b181b] font-semibold">SAVE 26%</span>
              </div>
            </div>

            {/* Color Swatch Options */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              <div className="text-[11px] uppercase tracking-wider text-neutral-600 font-medium">
                SHADE: <span className="text-black font-bold">{selectedColor}</span>
              </div>
              <div className="flex gap-2.5">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                      selectedColor === col.name ? 'border-black scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {selectedColor === col.name && (
                      <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Chips */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-neutral-600 font-medium">
                <span>SELECT SIZE: <strong className="text-black">{selectedSize}</strong></span>
                <button
                  type="button"
                  onClick={() => alert('Sizing Note: Cut with an architectural boxy drape. Take your regular European size.')}
                  className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-black uppercase"
                >
                  <Ruler className="w-3 h-3" />
                  <span>FIT GUIDE</span>
                </button>
              </div>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded-sm border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-black text-white border-black shadow'
                        : 'bg-white text-black border-neutral-300 hover:border-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Add To Cart Button with Fly Effect */}
            <button
              id="pdp-add-to-cart-btn"
              onClick={handleAddToCart}
              className="w-full py-4 bg-black text-white hover:bg-[#8b181b] text-xs font-bold uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART · {formatPrice(product.price)}</span>
            </button>

            <div className="text-[10px] text-neutral-400 tracking-wider space-y-1 text-center">
              <div>COMPLIMENTARY MONOGRAMMING AVAILABLE</div>
              <div>SHIPS IN RECYCLABLE SIGNATURE BLACK WOOD BOX</div>
            </div>
          </div>

          {/* CENTER COLUMN: Scrolling Multi-Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Gallery Image 1: Main 600x800 */}
            <div className="bg-neutral-100 rounded-sm overflow-hidden border border-black/5 shadow-md">
              <img
                src={galleryImages[0].src}
                alt={galleryImages[0].caption}
                className="w-full aspect-[3/4] object-cover hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="p-3 text-[11px] text-neutral-500 font-mono tracking-wider bg-white border-t border-neutral-100">
                {galleryImages[0].caption}
              </div>
            </div>

            {/* Gallery 2-Up Tiles: 298x397 each */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-100 rounded-sm overflow-hidden border border-black/5 shadow-sm">
                <img
                  src={galleryImages[1].src}
                  alt={galleryImages[1].caption}
                  className="w-full aspect-[3/4] object-cover hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="p-2 text-[10px] text-neutral-500 font-mono truncate bg-white border-t border-neutral-100">
                  {galleryImages[1].caption}
                </div>
              </div>
              <div className="bg-neutral-100 rounded-sm overflow-hidden border border-black/5 shadow-sm">
                <img
                  src={galleryImages[2].src}
                  alt={galleryImages[2].caption}
                  className="w-full aspect-[3/4] object-cover hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="p-2 text-[10px] text-neutral-500 font-mono truncate bg-white border-t border-neutral-100">
                  {galleryImages[2].caption}
                </div>
              </div>
            </div>

            {/* Gallery Image 4: Bottom 600x800 */}
            <div className="bg-neutral-100 rounded-sm overflow-hidden border border-black/5 shadow-md">
              <img
                src={galleryImages[3].src}
                alt={galleryImages[3].caption}
                className="w-full aspect-[3/4] object-cover hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="p-3 text-[11px] text-neutral-500 font-mono tracking-wider bg-white border-t border-neutral-100">
                {galleryImages[3].caption}
              </div>
            </div>
          </div>

          {/* RIGHT RAIL: Pinned Sticky at top:80px (3 cols) */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-4 bg-neutral-50 p-6 rounded-sm border border-black/10 shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b181b] font-bold block">
              SPECIFICATION & PROVENANCE
            </span>

            <p className="text-xs text-neutral-700 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Accordions */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              {/* Materials Accordion */}
              <div className="border border-black/10 rounded-sm overflow-hidden bg-white">
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wider flex justify-between items-center"
                >
                  <span>MATERIAL & CRAFT</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordion === 'materials' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'materials' && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 space-y-1.5 border-t border-neutral-100 pt-2">
                    {product.details?.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#8b181b] mt-0.5">✦</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fit & Silhouette */}
              <div className="border border-black/10 rounded-sm overflow-hidden bg-white">
                <button
                  onClick={() => toggleAccordion('fit')}
                  className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wider flex justify-between items-center"
                >
                  <span>FIT & SILHOUETTE</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordion === 'fit' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'fit' && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 space-y-1 border-t border-neutral-100 pt-2">
                    <p>Designed for a relaxed, sculptural fit through the chest with an architectural square shoulder line.</p>
                    <p className="pt-1 text-[11px] text-neutral-400">Model is 186cm / 6&apos;1&quot; wearing size Medium.</p>
                  </div>
                )}
              </div>

              {/* Shipping & Duties */}
              <div className="border border-black/10 rounded-sm overflow-hidden bg-white">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wider flex justify-between items-center"
                >
                  <span>SHIPPING & RETURNS</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 space-y-1 border-t border-neutral-100 pt-2">
                    <p>Complimentary express worldwide delivery.</p>
                    <p>Final shipping, duties, and taxes are confirmed by the connected storefront.</p>
                    <p>30-day effortless return window with complimentary home courier pickup.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-neutral-100 rounded-sm border border-black/5 flex items-center gap-2.5 text-[11px] text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-[#8b181b] shrink-0" />
              <span>AUTHENTICITY GUARANTEE & LIFETIME ATELIER REPAIR SERVICE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
