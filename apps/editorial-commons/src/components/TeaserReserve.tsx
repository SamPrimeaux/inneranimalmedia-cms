import React, { useState } from 'react';
import { ArrowRight, Sparkles, Check, X } from 'lucide-react';
import { useEditorialData } from '../portable/EditorialHost';

export const TeaserReserve: React.FC = () => {
  const { SPLIT_LEATHER_IMAGE, PDP_LEATHER_TEE_IMAGE } = useEditorialData();
  const [email, setEmail] = useState('');
  const [reserved, setReserved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setReserved(true);
    }
  };

  return (
    <section className="relative z-20 bg-white text-[#111111] py-24 px-6 md:px-12 border-b border-black/10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading 46.8px/700 + Reserve Action */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8b181b] font-bold block">
              PRIVATE PRE-RELEASE ARCHIVE
            </span>
            {/* 46.8px/700 largest heading per spec */}
            <h2 className="text-3xl sm:text-5xl md:text-[46.8px] font-bold uppercase tracking-[0.06em] text-black leading-[1.08]">
              SOMETHING NEW <br />
              IS ALMOST READY
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed max-w-lg pt-2">
              Be the first to wear our unreleased heavy wool overcoat and sculpted evening accessories before the collection officially opens to the public in November.
            </p>
          </div>

          {reserved ? (
            <div className="p-5 bg-neutral-50 border border-black/15 rounded-sm max-w-md space-y-2">
              <div className="flex items-center gap-2 text-[#8b181b] font-bold text-xs uppercase tracking-wider">
                <Check className="w-4 h-4" />
                <span>VIP Priority Reserved (#AW26-881)</span>
              </div>
              <p className="text-xs text-neutral-600">
                You will receive a private access passcode 48 hours prior to global release.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReserve} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email to reserve priority"
                className="flex-1 px-4 py-3.5 bg-neutral-50 border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black rounded-sm"
              />
              <button
                type="submit"
                className="py-3.5 px-6 bg-black text-white hover:bg-[#8b181b] text-xs font-bold uppercase tracking-[0.2em] transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>RESERVE ACCESS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="flex items-center gap-6 pt-2 text-[11px] text-neutral-400 uppercase tracking-wider">
            <span>Edition of 75 numbered coats</span>
            <span>·</span>
            <span>Bespoke sizing fitting available</span>
          </div>
        </div>

        {/* Right Column: Tall Portrait Teaser Media */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[3/4] rounded-sm overflow-hidden bg-neutral-900 border border-black/10 shadow-2xl relative group">
            <img
              src={SPLIT_LEATHER_IMAGE}
              alt="Upcoming Secret Release"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#e2a8aa] font-bold block">
                CLASSIFIED ARCHIVE
              </span>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mt-1">
                KAGE HEAVY WOOL OVERCOAT
              </h4>
              <p className="text-xs text-white/70 font-light mt-0.5">
                Releasing November 12, 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
