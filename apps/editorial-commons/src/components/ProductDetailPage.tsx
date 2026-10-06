import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  Ruler,
  Star,
  Plus,
  Share2,
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';
import { Product } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { PRODUCTS } = useEditorialData();
  const {
    activeProductPage,
    setActiveProductPage,
    addToCart,
    formatPrice,
    setIsBagOpen,
    setQuickViewProduct
  } = useCart();

  const product = activeProductPage || PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<'details' | 'fit' | 'shipping' | null>('details');
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!activeProductPage) return null;

  const galleryImages = [
    product.image,
    product.hoverImage,
    '/src/assets/images/split_media_leather_kuro_1790997173107.jpg',
    '/src/assets/images/hero_autumn_winter_1790997144449.jpg'
  ].filter(Boolean);

  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  const handleAddToCart = (e: React.MouseEvent) => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      count: quantity,
      event: e
    });
    setTimeout(() => setIsBagOpen(true), 600);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pt-24 pb-20 animate-[themeReveal_0.4s_cubic-bezier(0.22,1,0.36,1)]">
      {/* Top Breadcrumb & Return Bar */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-4 flex items-center justify-between border-b border-black/5 text-xs">
        <button
          onClick={() => setActiveProductPage(null)}
          className="inline-flex items-center gap-2 text-black hover:text-[#8b181b] font-bold tracking-widest uppercase transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO FLAGSHIP STOREFRONT</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
          <span>HOME</span>
          <span>/</span>
          <span>COLLECTIONS</span>
          <span>/</span>
          <span className="uppercase">{product.category}</span>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-[140px]">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Grid: Gallery Left + Contiguous Purchase Module Right */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          {/* LEFT: Multi-Angle Imagery Gallery (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image Frame */}
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-neutral-100 border border-black/5 shadow-sm group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest shadow">
                  {product.badge}
                </span>
              )}

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all shadow ${
                  isWishlisted ? 'text-[#8b181b]' : 'text-neutral-500 hover:text-black'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-black ring-2 ring-black/10 scale-[1.02]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Model & Fit Specification Card */}
            <div className="p-4 bg-neutral-50 rounded-sm border border-black/5 flex items-center justify-between text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#8b181b]" />
                <span>
                  <strong>MODEL MEASUREMENTS:</strong> 182cm / 6&apos;0&quot; · Chest 96cm · Wearing Size {product.sizes[1] || 'M'}
                </span>
              </div>
              <span className="hidden sm:inline font-mono text-[11px] text-neutral-400">
                TRUE TO EUROPEAN FIT
              </span>
            </div>
          </div>

          {/* RIGHT: Contiguous Purchase Module (5 Columns) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="space-y-2 border-b border-black/10 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8b181b] font-bold">
                  AUTUMN / WINTER 26 CAPSULE
                </span>
                <div className="flex items-center gap-1 text-[#8b181b] text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-neutral-400 ml-1 text-[11px]">(24 reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-wider text-black">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold tabular-nums font-mono text-black">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-neutral-400 tabular-nums font-mono">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.isSale && (
                  <span className="text-xs font-bold text-[#8b181b] uppercase tracking-wider">
                    ARCHIVE PRIVILEGE
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Shade Selection */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider text-neutral-700">
                <span>SHADE: <strong className="text-black">{selectedColor}</strong></span>
                <span className="text-[11px] text-neutral-400">{product.colors.length} ATELIER SHADES</span>
              </div>
              <div className="flex gap-3">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                      selectedColor === col.name ? 'border-black scale-110 shadow' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {selectedColor === col.name && (
                      <Check className="w-4 h-4 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider text-neutral-700">
                <span>SIZE: <strong className="text-black">{selectedSize}</strong></span>
                <button
                  type="button"
                  onClick={() => alert('Sizing Guide: Cut true to European tailoring specifications. If in between sizes, size up for a relaxed drape.')}
                  className="text-[11px] text-[#8b181b] hover:underline uppercase font-semibold cursor-pointer"
                >
                  BESPOKE FIT GUIDE
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-xs font-mono font-bold rounded-sm border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-black text-white border-black shadow'
                        : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Limited batch inventory in stock. Dispatches in 24 hours.</span>
              </div>
            </div>

            {/* Actions: Add to Bag + Express Buy */}
            <div className="space-y-3 pt-4 border-t border-black/10">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-black text-white hover:bg-[#8b181b] text-xs font-bold uppercase tracking-[0.22em] transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG · {formatPrice(product.price * quantity)}</span>
              </button>

              <button
                onClick={() => {
                  addToCart(product, { color: selectedColor, size: selectedSize, count: quantity });
                  setIsBagOpen(true);
                }}
                className="w-full py-3.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors rounded-sm cursor-pointer"
              >
                EXPRESS CONCIERGE CHECKOUT
              </button>
            </div>

            {/* Accordion Specs */}
            <div className="space-y-2 pt-2 border-t border-black/10">
              {/* Materials & Care */}
              <div className="border border-black/10 rounded-sm overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                  className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wider flex justify-between items-center cursor-pointer"
                >
                  <span>FABRICATION & PROVENANCE</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'details' && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 space-y-1.5 border-t border-neutral-100 pt-2 font-light">
                    {product.details?.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#8b181b]">✦</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                    <div className="pt-2 text-neutral-500">
                      Finished with custom engraved ruthenium hardware. Numbered certificate of craft included.
                    </div>
                  </div>
                )}
              </div>

              {/* Complimentary Shipping & Returns */}
              <div className="border border-black/10 rounded-sm overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                  className="w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wider flex justify-between items-center cursor-pointer"
                >
                  <span>SHIPPING, DUTIES & RETURNS</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openSection === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'shipping' && (
                  <div className="px-4 pb-4 text-xs text-neutral-600 space-y-2 border-t border-neutral-100 pt-2 font-light">
                    <p>Complimentary express worldwide shipping on orders exceeding $150.</p>
                    <p>Shipping, duties, and taxes are confirmed by the connected storefront.</p>
                    <p>30-day effortless return window with complimentary home courier pickup.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-sm border border-black/5 flex items-center gap-3 text-[11px] text-neutral-600">
              <ShieldCheck className="w-5 h-5 text-[#8b181b] shrink-0" />
              <span>AUTHENTICITY GUARANTEE · ATELIER CARE REPAIRS INCLUDED</span>
            </div>
          </div>
        </div>

        {/* COMPLETE THE LOOK / PAIR WITH SECTION */}
        <div className="mt-20 pt-12 border-t border-black/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b181b] font-bold block mb-1">
                STYLED BY THE ATELIER
              </span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-black">
                COMPLETE THE LOOK
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Architecturally balanced pairings selected to complement this silhouette.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                className="group bg-neutral-50 rounded-sm overflow-hidden border border-black/5 hover:border-black/20 hover:shadow-lg transition-all p-3 flex flex-col justify-between"
              >
                <div
                  onClick={() => setActiveProductPage(rel)}
                  className="cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-sm bg-neutral-200 mb-3">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
                    {rel.category}
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black truncate group-hover:text-[#8b181b] transition-colors mt-0.5">
                    {rel.name}
                  </h4>
                  <div className="text-xs font-semibold tabular-nums text-black mt-1">
                    {formatPrice(rel.price)}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={e => addToCart(rel, { event: e })}
                    className="flex-1 py-2 bg-black hover:bg-[#8b181b] text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD TO ENSEMBLE</span>
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(rel)}
                    className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-black text-[11px] uppercase tracking-wider font-semibold transition-colors"
                  >
                    VIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM PURCHASE BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/10 p-3 px-4 flex items-center justify-between gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <div>
          <div className="text-[10px] uppercase text-neutral-400 font-bold truncate max-w-[130px]">
            {product.name}
          </div>
          <div className="text-sm font-bold tabular-nums text-black">
            {formatPrice(product.price)}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 bg-black hover:bg-[#8b181b] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>ADD TO BAG</span>
        </button>
      </div>
    </div>
  );
};
