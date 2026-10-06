import React, { useState } from 'react';
import { Plus, Minus, Headphones, Truck, Award } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const FAQAndTrust: React.FC = () => {
  const { FAQS } = useEditorialData();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="relative z-20 bg-neutral-50 text-[#111111]">
      {/* S24: FAQ Accordions Section */}
      <section className="py-20 px-6 max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8b181b] font-bold block">
            CONCIERGE ASSISTANCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.1em] text-black">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-sm border border-black/10 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-black flex justify-between items-center cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                <span>{faq.question}</span>
                {openIdx === idx ? (
                  <Minus className="w-4 h-4 text-[#8b181b] shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed border-t border-neutral-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* S25: Icons Row Trust Strip (112px height) */}
      <section className="border-t border-b border-black/10 bg-white py-8 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black shrink-0">
              <Headphones className="w-5 h-5 text-[#8b181b]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                DEDICATED STYLING CONCIERGE
              </h4>
              <p className="text-[11px] text-neutral-500">
                Direct WhatsApp & email advisory with tailoring specialists.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black shrink-0">
              <Truck className="w-5 h-5 text-[#8b181b]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                EXPRESS GLOBAL FULFILLMENT
              </h4>
              <p className="text-[11px] text-neutral-500">
                Complimentary courier shipping on all orders over $150.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black shrink-0">
              <Award className="w-5 h-5 text-[#8b181b]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                ARTISANAL PROVENANCE
              </h4>
              <p className="text-[11px] text-neutral-500">
                Hand-numbered small batches tailored in Florence & West Yorkshire.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
