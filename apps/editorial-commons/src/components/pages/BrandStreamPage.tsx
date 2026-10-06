import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  LayoutGrid,
  Columns3,
  SlidersHorizontal,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Terminal,
  Copy,
  Check,
  ChevronRight,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  ArrowRight,
  SplitSquareVertical,
  Maximize2,
  X,
  Tag,
  Palette,
  Type,
  FolderOpen
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { WORKSPACES, DEMO_RECOVERY_RECEIPT } from '../../data/brandStreamData';
import { BrandCardItem, BrandConcept, EpistemicState, BrandWorkspace, RecoveryReceipt } from '../../types';

export const BrandStreamPage: React.FC = () => {
  const { navigateTo } = useCart();

  // Active Workspace State
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('form26-editorial');
  const [activeLayout, setActiveLayout] = useState<'stream' | 'board' | 'grid' | 'compare'>('stream');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Recovery Simulator State
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [recoveryStep, setRecoveryStep] = useState<number>(0);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Inspector Drawer State
  const [inspectedCard, setInspectedCard] = useState<BrandCardItem | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Active Workspace
  const workspace = WORKSPACES[activeWorkspaceId] || WORKSPACES['form26-editorial'];

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return workspace.items.filter(item => {
      if (selectedStateFilter !== 'all' && item.state !== selectedStateFilter) return false;
      if (selectedTypeFilter !== 'all' && item.type !== selectedTypeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSub = (item.subtitle || '').toLowerCase().includes(q);
        const matchesTags = (item.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSub && !matchesTags) return false;
      }
      return true;
    });
  }, [workspace, selectedStateFilter, selectedTypeFilter, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Simulate Ingest & Deterministic Recovery Run
  const handleTriggerRecovery = (workspaceKey: string) => {
    setIsRecovering(true);
    setRecoveryStep(1);

    setTimeout(() => setRecoveryStep(2), 400);
    setTimeout(() => setRecoveryStep(3), 800);
    setTimeout(() => setRecoveryStep(4), 1200);
    setTimeout(() => {
      setIsRecovering(false);
      setActiveWorkspaceId(workspaceKey);
      setShowReceiptModal(true);
    }, 1600);
  };

  const getEpistemicBadge = (state: EpistemicState) => {
    switch (state) {
      case 'approved':
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">APPROVED</span>;
      case 'proposed':
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">PROPOSED</span>;
      case 'observed':
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">OBSERVED</span>;
      case 'inferred':
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">INFERRED</span>;
      case 'deprecated':
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">CONFLICT</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-neutral-500/15 text-neutral-400 border border-neutral-500/30">DECLARED</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#e0e0e0] pt-24 pb-28">
      <div role="note" className="mx-auto max-w-[1560px] px-6 sm:px-10 py-3 text-xs leading-relaxed bg-amber-500/10 text-amber-100 border-b border-amber-500/20">
        Studio concept: workspace records, file counts, hashes, and recovery receipts are illustrative fixtures.
        No archive has been inspected, no canonical asset was approved, and no BrandPack has been written.
      </div>
      {/* Studio Top Control Center */}
      <section className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-[35px] sm:top-14 z-30 px-6 sm:px-10 py-4">
        <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand Switcher Pills */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 pr-2 border-r border-white/10 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#e2a8aa]" />
              <span className="uppercase tracking-widest hidden sm:inline">WORKSPACE:</span>
            </div>

            <button
              onClick={() => setActiveWorkspaceId('form26-editorial')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeWorkspaceId === 'form26-editorial'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              FORM / 26 (FLAGSHIP)
            </button>

            <button
              onClick={() => setActiveWorkspaceId('fnf-outdoor')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeWorkspaceId === 'fnf-outdoor'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              FNF TECHNICAL OUTDOOR
            </button>

            <button
              onClick={() => setActiveWorkspaceId('copro-studio')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                activeWorkspaceId === 'copro-studio'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              COPRO CONCEPT LAB
            </button>

            {/* Ingest / Recover Archive Action */}
            <button
              onClick={() => handleTriggerRecovery('form26-editorial')}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-[#8b181b]/30 hover:bg-[#8b181b]/50 text-[#e2a8aa] border border-[#8b181b]/50 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>PREVIEW RECOVERY FLOW</span>
            </button>
          </div>

          {/* Right Layout View Switcher & Receipt trigger */}
          <div className="flex items-center gap-3">
            {workspace.lastReceipt && (
              <button
                onClick={() => setShowReceiptModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white bg-white/5 border border-white/10 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">RECEIPT:</span>
                <span className="text-white font-semibold">{workspace.healthScore}% HEALTH</span>
              </button>
            )}

            {/* Layout Switcher (Stream, Board, Grid, Compare) */}
            <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveLayout('stream')}
                className={`px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  activeLayout === 'stream' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Mixed Geometry Stream View"
              >
                STREAM
              </button>
              <button
                onClick={() => setActiveLayout('board')}
                className={`px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  activeLayout === 'board' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Concept Moodboard View"
              >
                CONCEPTS
              </button>
              <button
                onClick={() => setActiveLayout('grid')}
                className={`px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  activeLayout === 'grid' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Asset & Token Grid"
              >
                ASSETS
              </button>
              <button
                onClick={() => setActiveLayout('compare')}
                className={`px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  activeLayout === 'compare' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Side-by-Side Concept Comparison"
              >
                COMPARE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recovery In-Progress Overlay Banner */}
      {isRecovering && (
        <div className="bg-[#8b181b]/20 border-b border-[#8b181b]/40 py-3 px-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-[1560px] mx-auto flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin text-[#e2a8aa]" />
              <span className="text-[#e2a8aa] font-semibold">
                DEMO / RECOVERY SEQUENCE — NO FILES PROCESSED
              </span>
              <span className="text-neutral-300">
                {recoveryStep === 1 && 'Step 1/4: Illustrating inventory of example assets...'}
                {recoveryStep === 2 && 'Step 2/4: Previewing extraction of example tokens and fonts...'}
                {recoveryStep === 3 && 'Step 3/4: Previewing semantic classification...'}
                {recoveryStep === 4 && 'Step 4/4: Previewing a proposed BrandPack...'}
              </span>
            </div>
            <span className="text-[10px] text-[#e2a8aa] uppercase font-bold tracking-widest">
              DETERMINISTIC: TRUE
            </span>
          </div>
        </div>
      )}

      {/* Brand Room Header Overview */}
      <section className="max-w-[1560px] mx-auto px-6 sm:px-10 py-8 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#e2a8aa] uppercase tracking-widest">
              <span>◆ BRAND ROOM</span>
              <span>/</span>
              <span>{workspace.industry}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase">
              {workspace.name}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-3xl leading-relaxed">
              {workspace.purpose}
            </p>

            {/* Voice Keywords Pill Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mr-1">
                VOICE PILLARS:
              </span>
              {workspace.voiceKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 uppercase tracking-wider"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                BRAND HEALTH SCORE
              </span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {workspace.healthScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-neutral-400 text-[10px] block">RECOVERED BLOCKS</span>
                <span className="text-white font-bold">{workspace.items.length} Primitives</span>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] block">EXPLORING CONCEPTS</span>
                <span className="text-white font-bold">{workspace.concepts.length} Boards</span>
              </div>
            </div>

            <button
              onClick={() => navigateTo('collections')}
              className="w-full py-2 bg-white text-black hover:bg-[#8b181b] hover:text-white rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <span>VIEW LIVE STOREFRONT OUTPUT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter & Epistemic Toolbar */}
      <section className="max-w-[1560px] mx-auto px-6 sm:px-10 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          {/* Epistemic State Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mr-2 shrink-0">
              EPISTEMIC STATE:
            </span>
            {['all', 'approved', 'proposed', 'observed', 'inferred', 'deprecated'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStateFilter(st)}
                className={`px-3 py-1 rounded text-[11px] font-mono font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedStateFilter === st
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'ALL BLOCKS' : st}
              </button>
            ))}
          </div>

          {/* Search in Stream */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search tokens, assets, concepts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-1 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area based on active layout */}
      <div className="max-w-[1560px] mx-auto px-6 sm:px-10">
        {/* VIEW 1: DYNAMIC MULTI-FORMAT BRAND STREAM (MIXED GEOMETRY) */}
        {activeLayout === 'stream' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
              {filteredCards.map((card, idx) => {
                // Determine column spans based on semantic card type
                const colSpan =
                  card.type === 'brand-feature' || card.type === 'campaign-wide'
                    ? 'lg:col-span-8'
                    : card.type === 'palette-swatches' || card.type === 'concept-board'
                    ? 'lg:col-span-6'
                    : card.type === 'audit-report' || card.type === 'type-specimen' || card.type === 'logo-family'
                    ? 'lg:col-span-6'
                    : 'lg:col-span-4';

                return (
                  <div
                    key={card.id}
                    onClick={() => setInspectedCard(card)}
                    className={`${colSpan} bg-white/5 border border-white/10 hover:border-white/30 rounded-sm p-6 space-y-4 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`}
                  >
                    {/* Card Top Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEpistemicBadge(card.state)}
                        {card.confidence && (
                          <span className="text-[10px] font-mono text-neutral-400">
                            {Math.round(card.confidence * 100)}% CONFIDENCE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-neutral-400 group-hover:text-white">
                        <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">
                          {card.type}
                        </span>
                        <Maximize2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      </div>
                    </div>

                    {/* Media if present */}
                    {card.imageUrl && (
                      <div className="aspect-[16/9] w-full rounded-xs overflow-hidden bg-neutral-900 border border-white/5">
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        />
                      </div>
                    )}

                    {/* Title & Description */}
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-semibold tracking-wide uppercase text-white group-hover:text-[#e2a8aa] transition-colors">
                        {card.title}
                      </h3>
                      {card.subtitle && (
                        <p className="text-xs text-neutral-300 font-light leading-relaxed">
                          {card.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Specific Renderers: Palette Swatches */}
                    {card.swatches && (
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {card.swatches.map((swatch, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-2.5 rounded bg-black/40 border border-white/10 space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className="w-4 h-4 rounded-full border border-white/20"
                                  style={{ backgroundColor: swatch.hex }}
                                />
                                <span className="text-[9px] font-mono text-neutral-400">
                                  {swatch.hex}
                                </span>
                              </div>
                              <span className="text-[11px] font-semibold text-white block truncate">
                                {swatch.name}
                              </span>
                              <span className="text-[9px] text-neutral-400 font-mono block truncate">
                                {swatch.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specific Renderers: Typography */}
                    {card.typography && (
                      <div className="p-4 bg-black/50 border border-white/10 rounded-sm space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#e2a8aa] uppercase tracking-wider">
                            {card.typography.family}
                          </span>
                          <p className="text-xl font-light uppercase tracking-widest text-white">
                            {card.typography.sample}
                          </p>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Usage: {card.typography.usage}
                        </p>
                      </div>
                    )}

                    {/* Specific Renderers: Metrics / Audit */}
                    {card.metrics && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10">
                        {card.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="space-y-0.5">
                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">
                              {m.label}
                            </span>
                            <span className="text-xs font-mono font-bold text-white block">
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom Metadata & Provenance Hash */}
                    <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-neutral-400 border-t border-white/5">
                      <span className="truncate max-w-[200px]">
                        SRC: {card.sourcePath || 'deterministic'}
                      </span>
                      <span className="text-[#e2a8aa]">
                        {card.sourceHash || '0x4a1bc34e'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: CONCEPT BOARDS & MOODBOARD CANVAS */}
        {activeLayout === 'board' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light tracking-tight uppercase text-white">
                  CREATIVE CONCEPT BOARDS ({workspace.concepts.length})
                </h2>
                <p className="text-xs text-neutral-400">
                  Visual containers exploring competing aesthetic directions before canonical promotion.
                </p>
              </div>

              <button
                onClick={() => alert('New concept board created.')}
                className="px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>NEW CONCEPT DIRECTION</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {workspace.concepts.map(concept => (
                <div
                  key={concept.id}
                  className="bg-white/5 border border-white/10 hover:border-white/30 rounded-sm p-6 space-y-6 transition-all shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-[#8b181b]/30 text-[#e2a8aa] border border-[#8b181b]/40 text-[10px] font-mono uppercase font-bold rounded">
                      {concept.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      ALIGNMENT: {concept.alignmentScore}%
                    </span>
                  </div>

                  {/* Visual Mood Stack */}
                  <div className="grid grid-cols-2 gap-2">
                    {concept.moodImages.slice(0, 2).map((img, iIdx) => (
                      <div key={iIdx} className="aspect-[3/4] rounded-xs overflow-hidden bg-neutral-900">
                        <img src={img} alt={concept.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-light tracking-wide uppercase text-white">
                      {concept.name}
                    </h3>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      {concept.statement}
                    </p>
                  </div>

                  {/* Swatch row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">PALETTE:</span>
                    <div className="flex items-center gap-1.5">
                      {concept.palette.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: p.hex }}
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <button
                      onClick={() => alert(`Concept "${concept.name}" promoted to proposed brand contract.`)}
                      className="flex-1 py-2 bg-white text-black hover:bg-[#8b181b] hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      PROMOTE DIRECTION
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ASSET & TOKEN INVENTORY (GRID) */}
        {activeLayout === 'grid' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredCards.map(card => (
                <div
                  key={card.id}
                  onClick={() => setInspectedCard(card)}
                  className="bg-white/5 border border-white/10 hover:border-white/30 rounded-xs p-3 space-y-2 cursor-pointer transition-colors"
                >
                  <div className="aspect-square bg-neutral-900 rounded-xs overflow-hidden flex items-center justify-center">
                    {card.imageUrl ? (
                      <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileCode className="w-6 h-6 text-neutral-500" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {getEpistemicBadge(card.state)}
                    <h4 className="text-xs font-semibold uppercase text-white truncate pt-1">
                      {card.title}
                    </h4>
                    <span className="text-[9px] font-mono text-neutral-400 block truncate">
                      {card.sourcePath || 'contract'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: SIDE-BY-SIDE CONCEPT COMPARISON */}
        {activeLayout === 'compare' && (
          <div className="space-y-8">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-xl font-light tracking-tight uppercase text-white">
                SIDE-BY-SIDE CONCEPT EVALUATION
              </h2>
              <p className="text-xs text-neutral-400">
                Compare architectural traits, typography hierarchies, and palette coherence across active directions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {workspace.concepts.slice(0, 2).map((concept, idx) => (
                <div
                  key={concept.id}
                  className="bg-white/5 border border-white/10 rounded-sm p-6 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono font-bold text-[#e2a8aa] uppercase">
                      OPTION 0{idx + 1} · {concept.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      FIT SCORE: {concept.alignmentScore}/100
                    </span>
                  </div>

                  <div className="aspect-[16/9] rounded-xs overflow-hidden bg-neutral-900">
                    <img src={concept.moodImages[0]} alt={concept.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-light uppercase text-white">{concept.name}</h3>
                    <p className="text-xs text-neutral-300 font-light">{concept.statement}</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">TYPOGRAPHY:</span>
                      <span className="text-white font-bold">{concept.typography}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">PRIMARY THEME:</span>
                      <span className="text-white font-bold">{concept.theme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">REFERENCES:</span>
                      <span className="text-white font-bold">{concept.referencesCount} Assets</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* INSPECTOR DRAWER (SLIDE-OVER FROM RIGHT) */}
      {inspectedCard && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setInspectedCard(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 w-full max-w-[540px] bg-[#0c0c0c] border-l border-white/15 text-white p-6 sm:p-8 overflow-y-auto space-y-6 shadow-2xl animate-[slideLeft_0.3s_cubic-bezier(0.22,1,0.36,1)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#8b181b] text-xs">◆</span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#e2a8aa]">
                  BLOCK PROVENANCE INSPECTOR
                </span>
              </div>
              <button
                onClick={() => setInspectedCard(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getEpistemicBadge(inspectedCard.state)}
                <span className="text-xs font-mono text-neutral-400">
                  ID: {inspectedCard.id}
                </span>
              </div>
              <h2 className="text-xl font-light uppercase tracking-tight text-white">
                {inspectedCard.title}
              </h2>
              {inspectedCard.subtitle && (
                <p className="text-xs text-neutral-300 font-light">
                  {inspectedCard.subtitle}
                </p>
              )}
            </div>

            {/* Media if present */}
            {inspectedCard.imageUrl && (
              <div className="aspect-[16/9] rounded-xs overflow-hidden bg-neutral-900 border border-white/10">
                <img src={inspectedCard.imageUrl} alt={inspectedCard.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Provenance Receipt Box */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-sm space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-neutral-400">DETERMINISTIC HASH:</span>
                <span className="text-[#e2a8aa] font-bold">{inspectedCard.sourceHash || '0x4a1bc34e'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-neutral-400">SOURCE PATH:</span>
                <span className="text-white truncate max-w-[220px]">{inspectedCard.sourcePath || 'config/brand.contract.json'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-neutral-400">CONFIDENCE:</span>
                <span className="text-emerald-400 font-bold">{Math.round((inspectedCard.confidence || 0.95) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">CANONICAL STATUS:</span>
                <span className="text-white uppercase">{inspectedCard.state}</span>
              </div>
            </div>

            {/* Safe Agent Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
                SAFE AGENT MUTATIONS & ACTIONS
              </span>

              <div className="space-y-2">
                <button
                  onClick={() => alert(`Marked "${inspectedCard.title}" as canonical approved brand authority.`)}
                  className="w-full py-2.5 bg-white text-black hover:bg-[#8b181b] hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PROPOSE AS CANONICAL MASTER</span>
                </button>

                <button
                  onClick={() => handleCopy(JSON.stringify(inspectedCard, null, 2), 'inspector-json')}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedText === 'inspector-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>COPY PROVENANCE JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAMPLE RECEIPT MODAL */}
      {showReceiptModal && workspace.lastReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowReceiptModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl bg-[#0e0e0e] border border-white/20 rounded-sm p-6 sm:p-8 text-white space-y-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 font-mono">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  DETERMINISTIC BRAND SAMPLE RECEIPT
                </span>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/5 rounded font-mono text-xs">
              <div>
                <span className="text-neutral-400 text-[10px] block">FILES SCANNED</span>
                <span className="text-lg font-bold text-white">{workspace.lastReceipt.filesSeen}</span>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] block">ASSETS FOUND</span>
                <span className="text-lg font-bold text-white">{workspace.lastReceipt.assetsFound}</span>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] block">DUPLICATES</span>
                <span className="text-lg font-bold text-amber-400">{workspace.lastReceipt.duplicatesDetected}</span>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] block">TOKEN SOURCES</span>
                <span className="text-lg font-bold text-emerald-400">{workspace.lastReceipt.tokenSources}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-light">
              <div>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                  ✓ STRONG DETERMINISTIC EVIDENCE
                </h4>
                <ul className="space-y-1 text-neutral-300">
                  {workspace.lastReceipt.strongEvidence.map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">▪</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  ⚠ CONFLICTING & AMBIGUOUS TOKENS
                </h4>
                <ul className="space-y-1 text-neutral-300">
                  {workspace.lastReceipt.conflictingItems.map((cf, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">▪</span>
                      <span>{cf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#e2a8aa] mb-1.5">
                  ✦ RECOMMENDED NEXT MOVE
                </h4>
                <p className="p-3 bg-white/5 border border-white/10 rounded font-mono text-white">
                  {workspace.lastReceipt.recommendedNextMove}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-6 py-2 bg-white text-black hover:bg-neutral-200 rounded text-xs font-bold uppercase tracking-widest cursor-pointer"
              >
                OPEN WORKSPACE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
