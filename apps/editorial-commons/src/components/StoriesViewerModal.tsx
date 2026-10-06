import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const StoriesViewerModal: React.FC = () => {
  const { STORIES_DATA, PRODUCTS } = useEditorialData();
  const { activeStoryIndex, setActiveStoryIndex, addToCart, setQuickViewProduct, formatPrice } = useCart();
  const [slideIndex, setSlideIndex] = useState(0);

  const currentGroup = activeStoryIndex !== null ? STORIES_DATA[activeStoryIndex] : null;
  const currentSlide = currentGroup?.slides[slideIndex];

  useEffect(() => {
    setSlideIndex(0);
  }, [activeStoryIndex]);

  // Auto advance timer per slide (5 seconds)
  useEffect(() => {
    if (activeStoryIndex === null || !currentGroup) return;

    const timer = setTimeout(() => {
      if (slideIndex < currentGroup.slides.length - 1) {
        setSlideIndex(prev => prev + 1);
      } else if (activeStoryIndex < STORIES_DATA.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
        setSlideIndex(0);
      } else {
        setActiveStoryIndex(null);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeStoryIndex, slideIndex, currentGroup, setActiveStoryIndex]);

  if (activeStoryIndex === null || !currentGroup || !currentSlide) return null;

  const handleNext = () => {
    if (slideIndex < currentGroup.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else if (activeStoryIndex < STORIES_DATA.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setSlideIndex(0);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    } else if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setSlideIndex(0);
    }
  };

  const linkedProduct = currentSlide.productTag
    ? PRODUCTS.find(p => p.id === currentSlide.productTag?.productId)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 sm:p-4 backdrop-blur-md">
      <button
        onClick={() => setActiveStoryIndex(null)}
        className="absolute top-6 right-6 z-50 text-white/70 hover:text-white p-2"
        aria-label="Close story viewer"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Navigation Arrows for desktop */}
      <button
        onClick={handlePrev}
        className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
        aria-label="Previous story"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
        aria-label="Next story"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Story container (aspect 9:16 mobile / portrait viewport) */}
      <div className="relative w-full max-w-[420px] h-full sm:h-[88vh] max-h-[820px] bg-neutral-900 overflow-hidden sm:rounded-xl shadow-2xl flex flex-col justify-between">
        {/* Background Image */}
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

        {/* Top Progress Bars */}
        <div className="relative z-20 p-4 space-y-3">
          <div className="flex gap-1.5">
            {currentGroup.slides.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    idx < slideIndex
                      ? 'w-full'
                      : idx === slideIndex
                      ? 'w-full animate-[progress_5s_linear]'
                      : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8b181b]" />
              <span className="text-xs uppercase font-semibold tracking-widest">{currentGroup.title}</span>
            </div>
            <span className="text-[10px] text-white/60 tracking-wider">
              {slideIndex + 1} / {currentGroup.slides.length}
            </span>
          </div>
        </div>

        {/* Tap areas for mobile navigation */}
        <div className="absolute inset-0 z-10 flex">
          <div onClick={handlePrev} className="w-1/3 h-full cursor-pointer" />
          <div onClick={handleNext} className="w-2/3 h-full cursor-pointer" />
        </div>

        {/* Bottom Story Content */}
        <div className="relative z-20 p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold tracking-wider uppercase text-white mb-1">
              {currentSlide.title}
            </h3>
            <p className="text-xs text-white/80 leading-relaxed max-w-xs">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Product Tag Badge if present */}
          {linkedProduct && (
            <div className="bg-black/75 backdrop-blur-md p-3 rounded-lg border border-white/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={linkedProduct.image}
                  alt={linkedProduct.name}
                  className="w-10 h-14 object-cover rounded bg-neutral-800"
                />
                <div>
                  <h4 className="text-xs font-semibold uppercase text-white truncate max-w-[150px]">
                    {linkedProduct.name}
                  </h4>
                  <div className="text-xs text-white/70 tabular-nums">
                    {formatPrice(linkedProduct.price)}
                  </div>
                </div>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  addToCart(linkedProduct, { event: e });
                }}
                className="px-3 py-2 bg-white text-black hover:bg-[#8b181b] hover:text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>BUY</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
