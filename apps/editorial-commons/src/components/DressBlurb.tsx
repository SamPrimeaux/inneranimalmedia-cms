import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const DressBlurb: React.FC = () => {
  const { PRODUCTS } = useEditorialData();
  const { setQuickViewProduct } = useCart();
  const matrixDress = PRODUCTS.find(p => p.id === 'matrix-mini-dress');

  return (
    <section className="relative z-20 bg-white text-[#111111] py-16 px-6 text-center border-b border-black/10">
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-sm sm:text-base text-neutral-800 font-light leading-relaxed max-w-xl mx-auto">
          &ldquo;Black leather cut close to the body and zipped from collar to hem — an unapologetic collision of razor tailoring and nocturnal ease.&rdquo;
        </p>

        <div>
          <button
            onClick={() => matrixDress && setQuickViewProduct(matrixDress)}
            className="cascade-link text-xs uppercase font-bold tracking-[0.22em] text-[#111111] hover:text-[#8b181b] inline-flex items-center gap-2 group cursor-pointer"
          >
            <span>SHOP THE DRESS</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
