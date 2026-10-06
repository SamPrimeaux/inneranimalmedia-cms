import React, { useState, useEffect } from 'react';
import {
  Key,
  Lock,
  Unlock,
  Clock,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  Copy,
  Ticket,
  Send,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useEditorialData } from '../../portable/EditorialHost';

interface DropItem {
  id: string;
  batchNumber: string;
  title: string;
  editionLimit: number;
  remainingAllocations: number;
  releaseDate: string;
  price: number;
  image: string;
  details: string[];
  isLocked: boolean;
}

export const ReserveVaultPage: React.FC = () => {
  const { HERO_IMAGE, LOOKBOOK_IMAGE, SPLIT_LEATHER_IMAGE, PDP_LEATHER_TEE_IMAGE, PRODUCTS } = useEditorialData();
  const VAULT_DROPS: DropItem[] = [
  {
    id: 'drop-1',
    batchNumber: 'BATCH 01 / 50',
    title: 'HAND-WAXED CALFSKIN TRENCH · NUMBERED EDITION',
    editionLimit: 50,
    remainingAllocations: 7,
    releaseDate: 'OCT 12, 2026 · 18:00 CET',
    price: 980.0,
    image: SPLIT_LEATHER_IMAGE,
    details: [
      'Hand-numbered interior silver plaque (01/50 through 50/50)',
      '1.1mm vegetable tanned Toscana calfskin with beeswax edge burnishing',
      'Includes bespoke cedar garment case & monogrammed leather hanger'
    ],
    isLocked: true
  },
  {
    id: 'drop-2',
    batchNumber: 'BATCH 02 / 30',
    title: 'OBSIDIAN CASHMERE OVERCOAT · RAW CUT',
    editionLimit: 30,
    remainingAllocations: 12,
    releaseDate: 'OCT 20, 2026 · 18:00 CET',
    price: 1250.0,
    image: HERO_IMAGE,
    details: [
      '100% Carded Mongolian Cashmere (650gsm double-face)',
      'Unstructured kimono sleeve construction with seamless raw edges',
      'Solid oxidized sterling silver anchor buttons'
    ],
    isLocked: true
  },
  {
    id: 'drop-3',
    batchNumber: 'BATCH 03 / 40',
    title: 'OXBLOOD LEATHER TEE & GLOOM GAUNTLETS SET',
    editionLimit: 40,
    remainingAllocations: 18,
    releaseDate: 'NOV 01, 2026 · 18:00 CET',
    price: 490.0,
    image: PDP_LEATHER_TEE_IMAGE,
    details: [
      'Paired runway set: 0.4mm lambskin tee + elongated cabretta gloves',
      'Presented in serialized matte black presentation box'
    ],
    isLocked: false
  }
];

  const { addToCart, formatPrice } = useCart();
  const [accessPasscode, setAccessPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState(false);
  const [reserveEmail, setReserveEmail] = useState('');
  const [reserveTier, setReserveTier] = useState('VIP TIER 1');
  const [confirmedPass, setConfirmedPass] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 42, minutes: 18, seconds: 35 });

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlockVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessPasscode.trim().toUpperCase() === 'FORM26' || accessPasscode.trim().toUpperCase() === 'VAULT26') {
      setIsUnlocked(true);
      setUnlockError(false);
    } else {
      setUnlockError(true);
    }
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveEmail.trim()) return;
    const generatedPass = 'DEMO-ACCESS-PREVIEW';
    setConfirmedPass(generatedPass);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-24 pb-28"><p role="note" className="px-6 pt-4 text-xs text-white/70">
   Interactive reservation concept — passcodes, stock counts, release dates, and allocation cards are sample data. No live passes are issued.
 </p>
      {/* Top Banner */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#111111] to-[#070707] py-16 sm:py-20 px-6 sm:px-10">
        <div className="max-w-[1440px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#e2a8aa] uppercase font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Lock className="w-3 h-3 text-[#8b181b]" />
            <span>CONCEPT DROP VAULT · AW26</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight uppercase text-white max-w-3xl mx-auto leading-tight">
            VIP ALLOCATION & NUMBERED RUNS
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
            Private 48-hour reservation window for hand-numbered runway specimens and limited atelier editions capped at 50 pieces worldwide.
          </p>

          {/* Countdown Clock Display */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-4 font-mono">
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-sm text-center min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400">HOURS</span>
            </div>
            <span className="text-xl text-[#8b181b] font-bold">:</span>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-sm text-center min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400">MINS</span>
            </div>
            <span className="text-xl text-[#8b181b] font-bold">:</span>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-sm text-center min-w-[70px]">
              <span className="text-2xl sm:text-3xl font-bold text-white block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400">SECS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-12 space-y-16">
        {/* Passcode Unlock Bar */}
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-6 rounded-sm text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-300">
            {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-[#8b181b]" />}
            <span>{isUnlocked ? 'VAULT ACCESS GRANTED · VIP TIER ACTIVE' : 'HAVE A VIP ACCESS KEY?'}</span>
          </div>

          {!isUnlocked ? (
            <form onSubmit={handleUnlockVault} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter invite code (e.g. FORM26 or VAULT26)"
                value={accessPasscode}
                onChange={e => {
                  setAccessPasscode(e.target.value);
                  setUnlockError(false);
                }}
                className="flex-1 bg-black/60 border border-white/20 rounded px-3 py-2 text-xs text-white placeholder:text-neutral-500 uppercase font-mono focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                UNLOCK
              </button>
            </form>
          ) : (
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs font-mono">
              ✦ DEMO VIEW ENABLED — NO REAL INVENTORY ALLOCATED
            </div>
          )}

          {unlockError && (
            <p className="text-xs text-rose-400 font-mono">
              Invalid passcode. Try "FORM26" for demonstration access.
            </p>
          )}
        </div>

        {/* Drops Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-white font-mono">
              SCHEDULED NUMBERED BATCHES ({VAULT_DROPS.length})
            </h2>
            <span className="text-xs text-[#e2a8aa] font-mono">
              LIMITED ATELIER PRODUCTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VAULT_DROPS.map(drop => {
              const locked = drop.isLocked && !isUnlocked;

              return (
                <div
                  key={drop.id}
                  className="bg-white/5 border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-white/30 transition-all shadow-lg"
                >
                  <div className="space-y-4">
                    {/* Image with overlay badge */}
                    <div className="relative aspect-[3/4] w-full bg-neutral-900 overflow-hidden">
                      <img
                        src={drop.image}
                        alt={drop.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${locked ? 'blur-sm grayscale' : 'group-hover:scale-105'}`}
                      />

                      {locked && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center space-y-2">
                          <Lock className="w-8 h-8 text-[#8b181b]" />
                          <p className="text-xs font-mono uppercase tracking-widest text-white">
                            VAULT LOCKED
                          </p>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Enter VIP Passcode or join waitlist below
                          </span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#e2a8aa] text-[10px] font-mono font-bold tracking-widest uppercase border border-white/10">
                          {drop.batchNumber}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-0.5 bg-[#8b181b] text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                          {drop.remainingAllocations} LEFT
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span>RELEASE: {drop.releaseDate}</span>
                        <span className="text-white font-bold">{formatPrice(drop.price)}</span>
                      </div>

                      <h3 className="text-sm font-semibold tracking-wide uppercase text-white group-hover:text-[#e2a8aa] transition-colors">
                        {drop.title}
                      </h3>

                      <ul className="space-y-1.5 pt-2 text-[11px] text-neutral-400 font-light border-t border-white/10">
                        {drop.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#8b181b] font-bold">▪</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 pt-0">
                    {locked ? (
                      <button
                        onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
                        className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>ENTER VIP KEY</span>
                      </button>
                    ) : (
                      <button
                        onClick={e => {
                          const prod = PRODUCTS[0];
                          addToCart(prod, { event: e });
                        }}
                        className="w-full py-2.5 bg-white text-black hover:bg-[#8b181b] hover:text-white rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>RESERVE ALLOCATION ({formatPrice(drop.price)})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Waitlist & Digital Ticket Pass Generator */}
        <section className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-white/15 p-8 sm:p-12 rounded-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#e2a8aa] uppercase">
                GUARANTEED ALLOCATION ACCESS
              </span>
              <h3 className="text-2xl sm:text-4xl font-light uppercase tracking-tight text-white">
                REQUEST A VIP ALLOCATION PASS
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Join the sample allocation priority register. When Batch 01 and Batch 02 unlock, pass holders receive direct SMS/email unlock tokens 2 hours before the public drop.
              </p>
            </div>

            <div className="lg:col-span-6">
              {confirmedPass ? (
                <div className="bg-black/80 border border-[#8b181b]/50 p-6 rounded-sm space-y-4 text-center animate-[fadeIn_0.3s_ease-out]">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                      DIGITAL VIP ACCESS PASS ISSUED
                    </span>
                    <h4 className="text-lg font-mono font-bold text-[#e2a8aa] tracking-widest">
                      {confirmedPass}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-300 font-light">
                    Your allocation priority has been logged for {reserveEmail}. Access credentials will be dispatched at drop zero.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReserveSubmit} className="space-y-4 bg-black/40 p-6 rounded-sm border border-white/10">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@maison.com"
                      value={reserveEmail}
                      onChange={e => setReserveEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                      MEMBERSHIP TIER
                    </label>
                    <select
                      value={reserveTier}
                      onChange={e => setReserveTier(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    >
                      <option value="VIP TIER 1">TIER 1 · ATELIER PATRON (FIRST 48-HR WINDOW)</option>
                      <option value="VIP TIER 2">TIER 2 · RUNWAY ARCHIVE COLLECTOR</option>
                      <option value="VIP TIER 3">TIER 3 · GENERAL DROP NOTIFICATION</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>GENERATE VIP ALLOCATION PASS</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
