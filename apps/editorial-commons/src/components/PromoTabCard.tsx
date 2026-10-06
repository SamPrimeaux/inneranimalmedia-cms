import React, { useState } from 'react';
import { X, Tag, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const PromoTabCard: React.FC = () => {
  const { isPromoOpen, setIsPromoOpen } = useCart();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('DEMO15');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Persistent Left Edge Vertical Tab (~44x140px) */}
      {!isPromoOpen && (
        <button
          onClick={() => setIsPromoOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-[#0c0c0c] text-white hover:text-[#e2a8aa] border border-l-0 border-white/20 py-3.5 px-2 text-[10px] uppercase font-bold tracking-[0.25em] shadow-xl transition-all duration-300 hover:pl-3 group flex items-center gap-1.5 [writing-mode:vertical-rl] rotate-180 cursor-pointer"
          aria-label="Inspect illustrative offer card"
        >
          <Tag className="w-3.5 h-3.5 text-[#8b181b] rotate-90" />
          <span>DEMO OFFER</span>
        </button>
      )}

      {/* Anchored Promo Card (Bottom-Right, 394x232) */}
      {isPromoOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end p-4 md:p-6">
          {/* Subtle backdrop */}
          <div
            onClick={() => setIsPromoOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[3px] pointer-events-auto transition-opacity duration-300"
          />

          <div
            className="relative pointer-events-auto w-full max-w-[394px] bg-[#111111] text-white border border-white/15 p-6 shadow-2xl rounded-sm transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] scale-100 opacity-100"
          >
            {/* Close button */}
            <button
              onClick={() => setIsPromoOpen(false)}
              className="absolute top-4 right-4 p-1 text-white/50 hover:text-white transition-colors"
              aria-label="Close promotion"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="pr-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b181b] font-bold block mb-1">
                WELCOME PRIVILEGE
              </span>
              <h3 className="font-serif text-2xl font-light tracking-wide text-white mb-1.5">
                Take 15% Off Your First Order
              </h3>
              <p className="text-xs text-white/60 leading-relaxed mb-4">
                Subscribe to receive private salon invitations, archive drops, and an immediate 15% reduction code.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-3 bg-white/5 border border-white/10 rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/70">Your Privilege Code:</span>
                  <span className="text-xs font-mono font-bold text-white tracking-widest">DEMO15</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-[#8b181b] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <span>COPY CODE & APPLY</span>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/5 border border-white/15 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#8b181b]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black hover:bg-[#8b181b] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
