import { useEditorialBrand } from '../portable/EditorialHost';
import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const NewsletterBand: React.FC = () => {
  const brand = useEditorialBrand();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="relative z-20 bg-black text-white py-16 px-6 border-b border-white/10 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#e2a8aa] font-bold block">
          THE DISPATCH
        </span>

        {/* 38.4px / 400 regular weight white on black per spec */}
        <h2 className="text-2xl sm:text-4xl font-normal uppercase tracking-[0.08em] text-white">
          THE EDIT, IN YOUR INBOX
        </h2>

        <p className="text-xs text-white/60 font-light max-w-md mx-auto">
          Private runway invitations, small-batch release dates, and seasonal tailoring dissertations sent bimonthly.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
            <Check className="w-4 h-4 text-[#8b181b]" />
            <span>Welcome to the {brand.name} Dispatch</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white rounded-sm"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-white text-black hover:bg-[#8b181b] hover:text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors rounded-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
