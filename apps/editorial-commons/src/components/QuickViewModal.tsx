import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, formatPrice, setIsBagOpen } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  if (!quickViewProduct) return null;

  const currentColor = selectedColor || quickViewProduct.colors[0]?.name || 'Standard';
  const currentSize = selectedSize || quickViewProduct.sizes[0] || 'Standard';
  const displayImage = activeImage || quickViewProduct.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    addToCart(quickViewProduct, {
      color: currentColor,
      size: currentSize,
      count: quantity,
      event: e
    });
    setQuickViewProduct(null);
    setTimeout(() => setIsBagOpen(true), 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-[6px] flex items-center justify-center p-4 sm:p-6 animate-[themeReveal_0.3s_cubic-bezier(0.22,1,0.36,1)]">
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0"
      />

      <div className="relative w-full max-w-3xl bg-[#0f0f0f] text-white border border-white/15 rounded-sm shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-white/50 hover:text-white bg-black/40 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Imagery */}
        <div className="md:w-1/2 bg-neutral-900 relative aspect-[3/4] md:aspect-auto">
          <img
            src={displayImage}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
          {quickViewProduct.badge && (
            <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#8b181b] text-white text-[10px] font-bold uppercase tracking-widest">
              {quickViewProduct.badge}
            </span>
          )}

          {/* Alternate angle thumbnail triggers */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={() => setActiveImage(quickViewProduct.image)}
              className={`w-10 h-14 rounded-sm overflow-hidden border-2 transition-all ${
                displayImage === quickViewProduct.image ? 'border-white' : 'border-white/30 opacity-70'
              }`}
            >
              <img src={quickViewProduct.image} alt="Angle 1" className="w-full h-full object-cover" />
            </button>
            {quickViewProduct.hoverImage && (
              <button
                onClick={() => setActiveImage(quickViewProduct.hoverImage)}
                className={`w-10 h-14 rounded-sm overflow-hidden border-2 transition-all ${
                  displayImage === quickViewProduct.hoverImage ? 'border-white' : 'border-white/30 opacity-70'
                }`}
              >
                <img src={quickViewProduct.hoverImage} alt="Angle 2" className="w-full h-full object-cover" />
              </button>
            )}
          </div>
        </div>

        {/* Product Details & Selection */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b181b] font-bold">
                {quickViewProduct.category}
              </span>
              <h3 className="font-serif text-2xl font-light tracking-wide text-white">
                {quickViewProduct.name}
              </h3>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-lg font-bold tabular-nums">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-white/40 line-through text-sm tabular-nums">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Color Swatches */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                COLOR: <span className="text-white font-medium">{currentColor}</span>
              </div>
              <div className="flex gap-2">
                {quickViewProduct.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentColor === col.name ? 'border-white scale-110' : 'border-transparent opacity-80'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {currentColor === col.name && (
                      <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                SELECT SIZE: <span className="text-white font-medium">{currentSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickViewProduct.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-sm border transition-all ${
                      currentSize === size
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-white text-black hover:bg-[#8b181b] hover:text-white text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO BAG · {formatPrice(quickViewProduct.price * quantity)}</span>
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COMPLIMENTARY SHIPPING & 30-DAY BESPOKE RETURNS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
