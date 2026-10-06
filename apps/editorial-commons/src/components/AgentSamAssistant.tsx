import React, { useState } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  X,
  FileCode,
  Terminal,
  Cpu,
  Layers,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Send,
  UploadCloud,
  ShieldCheck,
  Compass,
  ShoppingBag,
  Ticket
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';
import { PageRoute } from '../types';

interface TipCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  suggestedPrompt: string;
  iconBg: string;
  iconSvg: string;
}

const TIPS: TipCard[] = [
  {
    id: 'tip-1',
    badge: 'BRAND ARCHAEOLOGY',
    title: 'Visual Brand Stream Recovery',
    description: 'Drop in raw ZIPs/folders to deterministically extract tokens, classify semantic asset roles, and render a dynamic multi-format visual workspace.',
    suggestedPrompt: 'Open the Brand Stream Studio and inspect the deterministic recovery receipt for the current demo.',
    iconBg: 'from-amber-500/20 via-rose-500/20 to-purple-500/20',
    iconSvg: '✨'
  },
  {
    id: 'tip-2',
    badge: 'LUXURY TAILORING',
    title: 'Bespoke Sizing & Virtual Fitting',
    description: 'Provide interactive model fit overlays that calculate shoulder-to-hem drape based on customer height and proportions.',
    suggestedPrompt: 'Add a 3D-styled interactive silhouette fit visualizer on the PDP with shoulder and sleeve measurements.',
    iconBg: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    iconSvg: '👔'
  },
  {
    id: 'tip-3',
    badge: 'COMMERCE ARCHITECTURE',
    title: 'Archive Private VIP Drop Vault',
    description: 'Create time-locked cryptographic invite drops where members enter one-time access keys to purchase small-batch runs.',
    suggestedPrompt: 'Test the VIP Vault section using passcode a configured invitation code to unlock limited-batch numbered allocations.',
    iconBg: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    iconSvg: '🗝️'
  },
  {
    id: 'tip-4',
    badge: 'GLOBAL LOCALIZATION',
    title: 'Dynamic Currency & Duties Engine',
    description: 'Auto-detect visitor geolocation to display local currencies (EUR, GBP, JPY, USD) with pre-calculated import clearances.',
    suggestedPrompt: 'Implement automatic IP-based currency switching with zero-surprise border fees.',
    iconBg: 'from-violet-500/20 via-fuchsia-500/20 to-pink-500/20',
    iconSvg: '🌐'
  },
  {
    id: 'tip-5',
    badge: 'EDITORIAL LOOKBOOKS',
    title: 'Interactive Shoppable Diptychs',
    description: 'Dynamically pair complementary garments into shoppable diptychs with automatic savings bundles.',
    suggestedPrompt: 'Explore the Editorial Lookbook chapters and hover over garment coordinate pins to buy looks directly.',
    iconBg: 'from-rose-500/20 via-red-500/20 to-amber-500/20',
    iconSvg: '📸'
  }
];

const BUILT_FILES = [
  { name: 'src/components/pages/CollectionsPage.tsx', status: 'verified', lines: 285, desc: 'Faceted Catalog & Silhouettes' },
  { name: 'src/components/pages/LookbookPage.tsx', status: 'verified', lines: 270, desc: 'Interactive Shoppable Editorial' },
  { name: 'src/components/pages/MaisonPage.tsx', status: 'verified', lines: 290, desc: 'Heritage, Craft & Ateliers' },
  { name: 'src/components/pages/ReserveVaultPage.tsx', status: 'verified', lines: 310, desc: 'Cryptographic VIP Drop Vault' },
  { name: 'src/components/pages/BrandStreamPage.tsx', status: 'verified', lines: 420, desc: 'AgentSam Brand Stream & Recovery' },
  { name: 'src/components/ProductDetailPage.tsx', status: 'verified', lines: 290, desc: 'Standalone Full PDP View' },
  { name: 'src/context/CartContext.tsx', status: 'verified', lines: 250, desc: 'Synchronized Multi-Page Router' },
  { name: 'src/components/Header.tsx', status: 'verified', lines: 220, desc: 'Universal Floating Navigation' },
  { name: 'src/components/MenuDrawer.tsx', status: 'verified', lines: 240, desc: 'Full-Height Frosted Drill-Down' }
];

export const AgentSamAssistant: React.FC = () => {
  const { PRODUCTS } = useEditorialData();
  const {
    isAgentSamOpen,
    setIsAgentSamOpen,
    navigateTo,
    setIsMenuOpen,
    setIsBagOpen,
    currentPage
  } = useCart();

  const [activeTipIdx, setActiveTipIdx] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tips' | 'files' | 'preview'>('tips');

  const currentTip = TIPS[activeTipIdx];

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedPrompt(text);
    setTimeout(() => setCopiedPrompt(null), 2500);
  };

  const handleNextTip = () => {
    setActiveTipIdx(prev => (prev + 1) % TIPS.length);
  };

  const handlePrevTip = () => {
    setActiveTipIdx(prev => (prev - 1 + TIPS.length) % TIPS.length);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsAgentSamOpen(!isAgentSamOpen)}
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-black/85 hover:bg-black text-white text-xs font-semibold rounded-full border border-white/20 shadow-[0_0_25px_rgba(139,24,27,0.4)] backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open AgentSam Studio Companion"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8b181b] animate-ping absolute" />
            <Sparkles className="w-4 h-4 text-[#e2a8aa] group-hover:rotate-12 transition-transform" />
          </div>
          <span className="tracking-wider uppercase font-mono">AgentSam Studio</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 text-white/80 border border-white/10 uppercase">
            {currentPage}
          </span>
        </button>
      </div>

      {/* Full Modal Dashboard */}
      {isAgentSamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            onClick={() => setIsAgentSamOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0d0d] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-[themeReveal_0.4s_cubic-bezier(0.22,1,0.36,1)] z-10">
            {/* Top Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#141414] border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b181b] to-black flex items-center justify-center border border-white/20">
                  <Sparkles className="w-4 h-4 text-[#e2a8aa]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-widest uppercase">AgentSam Studio</span>
                    <span className="text-[10px] font-mono bg-[#8b181b]/30 text-[#e2a8aa] px-2 py-0.5 rounded border border-[#8b181b]/50 uppercase">
                      v2.6.12 ARCHITECTURE
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60">
                    Multi-Page Storefront & Brand Stream Recovery Engine
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAgentSamOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 px-6 bg-[#0f0f0f] border-b border-white/10 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('tips')}
                className={`py-3 transition-colors relative cursor-pointer ${
                  activeTab === 'tips' ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                Tips & Prompts Carousel
                {activeTab === 'tips' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b181b]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-3 transition-colors relative cursor-pointer ${
                  activeTab === 'preview' ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                Multi-Page Route Switcher
                {activeTab === 'preview' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b181b]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`py-3 transition-colors relative cursor-pointer ${
                  activeTab === 'files' ? 'text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                Architecture & Components ({BUILT_FILES.length})
                {activeTab === 'files' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b181b]" />
                )}
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: TIPS & PROMPTS */}
              {activeTab === 'tips' && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#e2a8aa] font-mono">
                      LUXURY E-COMMERCE & BRAND ARCHAEOLOGY
                    </span>
                    <h4 className="text-2xl font-bold tracking-tight text-white">
                      Actionable Prompts & Architectural Patterns
                    </h4>
                    <p className="text-xs text-white/60">
                      Copy any prompt below to explore features or test new workflows.
                    </p>
                  </div>

                  {/* Interactive Card Carousel */}
                  <div className="relative flex items-center justify-center py-4">
                    <button
                      onClick={handlePrevTip}
                      className="absolute left-0 sm:left-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                      aria-label="Previous tip"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Central 3D Tip Card */}
                    <div className="w-full max-w-lg bg-[#141414] border border-white/15 rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
                      <div className={`absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br ${currentTip.iconBg} blur-3xl pointer-events-none`} />

                      <div className="relative z-10 space-y-4 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 shadow-inner flex items-center justify-center text-3xl transform hover:scale-110 transition-transform">
                          {currentTip.iconSvg}
                        </div>

                        <div>
                          <span className="text-[10px] tracking-[0.25em] text-[#8b181b] font-mono uppercase font-bold">
                            {currentTip.badge}
                          </span>
                          <h5 className="text-xl font-bold text-white mt-1">
                            {currentTip.title}
                          </h5>
                          <p className="text-xs text-white/70 leading-relaxed max-w-md mx-auto mt-2">
                            {currentTip.description}
                          </p>
                        </div>

                        {/* Suggested Prompt Box with Copy */}
                        <div className="pt-3 text-left">
                          <div className="text-[10px] text-white/40 uppercase font-mono mb-1.5">
                            SUGGESTED PROMPT FOR AGENTSAM:
                          </div>
                          <div className="p-3 bg-black/60 border border-white/10 rounded-lg flex items-center justify-between gap-3">
                            <span className="text-xs text-white/90 font-mono truncate">
                              &ldquo;{currentTip.suggestedPrompt}&rdquo;
                            </span>
                            <button
                              onClick={() => handleCopyPrompt(currentTip.suggestedPrompt)}
                              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] font-mono flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                            >
                              {copiedPrompt === currentTip.suggestedPrompt ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNextTip}
                      className="absolute right-0 sm:right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                      aria-label="Next tip"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Carousel Dots */}
                  <div className="flex justify-center gap-2">
                    {TIPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTipIdx(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeTipIdx === i ? 'w-8 bg-[#8b181b]' : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PAGE ROUTER */}
              {activeTab === 'preview' && (
                <div className="space-y-6">
                  <div>
                    <h5 className="text-xs uppercase tracking-wider text-white/60 font-mono mb-3">
                      FAST JUMP TO ANY MULTI-PAGE ROUTE:
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                      {[
                        { name: 'Flagship Storefront', route: 'home' as PageRoute, desc: '27-Section Master Scroll' },
                        { name: 'Collections & Archive', route: 'collections' as PageRoute, desc: 'Faceted Catalog Grid' },
                        { name: 'Editorial Lookbook', route: 'lookbook' as PageRoute, desc: 'Shoppable Hotspots & Diptychs' },
                        { name: 'Maison & Ateliers', route: 'maison' as PageRoute, desc: 'Provenance & VIP Bookings' },
                        { name: 'VIP Drop Vault', route: 'reserve' as PageRoute, desc: 'Cryptographic Drops & Passes' },
                        { name: 'Brand Stream Studio', route: 'studio' as PageRoute, desc: 'Visual Archaeology & Ingest' }
                      ].map(pg => (
                        <button
                          key={pg.route}
                          onClick={() => {
                            navigateTo(pg.route);
                            setIsAgentSamOpen(false);
                          }}
                          className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                            currentPage === pg.route
                              ? 'bg-[#8b181b]/30 border-[#8b181b] text-white font-bold'
                              : 'bg-white/5 border-white/10 hover:border-white/30 text-neutral-300'
                          }`}
                        >
                          <div className="font-semibold text-white uppercase">{pg.name}</div>
                          <div className="text-[10px] text-neutral-400 mt-1">{pg.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h5 className="text-xs uppercase tracking-wider text-white/60 font-mono mb-3">
                      STANDALONE PRODUCT DETAIL PAGES (PDP):
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PRODUCTS.slice(0, 4).map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigateTo('pdp', { productId: p.id });
                            setIsAgentSamOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-left transition-colors cursor-pointer group"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-16 object-cover rounded bg-neutral-900 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold uppercase text-white truncate group-hover:text-[#e2a8aa] transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-white/60 font-mono mt-0.5">
                              Open Standalone PDP View →
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-[#8b181b]">
                              {p.category}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ARCHITECTURE & FILES */}
              {activeTab === 'files' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-white/60 font-mono border-b border-white/10 pb-2">
                    <span>MODULE / COMPONENT</span>
                    <span>STATUS</span>
                  </div>
                  <div className="space-y-2">
                    {BUILT_FILES.map(file => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all font-mono text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <FileCode className="w-4 h-4 text-[#8b181b]" />
                          <div>
                            <div className="font-semibold text-white">{file.name}</div>
                            <div className="text-[10px] text-white/50">{file.desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-white/40">{file.lines} lines</span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <Check className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status strip */}
            <div className="px-6 py-3 bg-[#111111] border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Multi-Page Router Synchronized · Port 3000 Ready</span>
              </div>
              <span className="hidden sm:inline">Press Esc to dismiss</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
