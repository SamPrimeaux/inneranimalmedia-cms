import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const TestimonialsSection: React.FC = () => {
  const { TESTIMONIALS } = useEditorialData();
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const activeReview = TESTIMONIALS[activeReviewIdx];

  return (
    <section className="relative z-20 bg-neutral-50 text-[#111111] py-20 px-6 border-b border-black/10">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* 5-Star Row */}
        <div className="flex justify-center gap-1.5 text-[#8b181b]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl font-light text-neutral-800 italic leading-relaxed min-h-[100px] flex items-center justify-center">
          &ldquo;{activeReview.quote}&rdquo;
        </blockquote>

        {/* Reviewer & Product Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 border-t border-black/10">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.author}
              onClick={() => setActiveReviewIdx(idx)}
              className={`text-left py-2 px-3 rounded-sm transition-all cursor-pointer ${
                activeReviewIdx === idx
                  ? 'bg-black text-white shadow'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-200/60'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider">{t.author}</div>
              <div className="text-[10px] opacity-75">{t.product} · {t.role}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
