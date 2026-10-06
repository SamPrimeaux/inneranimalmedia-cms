import { useEditorialBrand } from '../portable/EditorialHost';
import React, { useState, useEffect } from 'react';
import { Search, Megaphone, ShoppingBag, Globe, Sparkles, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PageRoute } from '../types';

export const Header: React.FC = () => {
  const brand = useEditorialBrand();
  const {
    currentPage,
    navigateTo,
    cartCount,
    setIsMenuOpen,
    isMenuOpen,
    setIsBagOpen,
    setIsSearchOpen,
    setIsDiscoverOpen,
    isBagPopping,
    currency,
    setCurrency
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; route: PageRoute; badge?: string }[] = [
    { label: 'FLAGSHIP', route: 'home' },
    { label: 'COLLECTIONS', route: 'collections' },
    { label: 'EDITORIAL', route: 'lookbook' },
    { label: 'MAISON', route: 'maison' },
    { label: 'VIP VAULT', route: 'reserve' },
    { label: 'BRAND STUDIO', route: 'studio', badge: 'STUDIO' }
  ];

  return (
    <>
      {/* S01: Announcement Marquee Bar (35px) */}
      <div className="relative z-40 h-[35px] bg-[#0b0b0b] text-[#e0e0e0] border-b border-white/10 flex items-center overflow-hidden select-none text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          <span className="mx-4 sm:mx-6 flex items-center gap-2">
            <span>Free express shipping on orders over $150</span>
            <span className="text-[#8b181b]">✦</span>
          </span>
          <span className="mx-4 sm:mx-6 flex items-center gap-2">
            <span>Autumn / Winter 26 runway archive now live</span>
            <span className="text-[#8b181b]">✦</span>
          </span>
          <span className="mx-4 sm:mx-6 flex items-center gap-2">
            <span>Explore the new AgentSam Brand Stream Workspace</span>
            <span className="text-[#8b181b]">✦</span>
          </span>
          <span className="mx-4 sm:mx-6 flex items-center gap-2">
            <span>Complimentary signature gift wrapping on all orders</span>
            <span className="text-[#8b181b]">✦</span>
          </span>
          {/* Duplicate track for seamless infinite marquee loop */}
          <span className="mx-4 sm:mx-6 flex items-center gap-2">
            <span>Free express shipping on orders over $150</span>
            <span className="text-[#8b181b]">✦</span>
          </span>
          <span className="mx-4 sm:mx-6 flex items-center gap-2">
            <span>Autumn / Winter 26 runway archive now live</span>
            <span className="text-[#8b181b]">✦</span>
          </span>
          <span className="mx-4 sm:mx-6 flex items-center gap-2">
            <span>Explore the new AgentSam Brand Stream Workspace</span>
            <span className="text-[#8b181b]">✦</span>
          </span>
          <span className="mx-4 sm:mx-6 flex items-center gap-2">
            <span>Complimentary signature gift wrapping on all orders</span>
            <span className="text-[#8b181b]">✦</span>
          </span>
        </div>
      </div>

      {/* Floating Header */}
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled
            ? 'top-2 sm:top-4 px-3 sm:px-4 flex justify-center pointer-events-none'
            : 'top-[35px] px-4 sm:px-8 md:px-10 h-16 bg-gradient-to-b from-black/85 via-black/50 to-transparent'
        }`}
      >
        <div
          className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled
              ? 'w-full max-w-[1140px] h-12 bg-white/95 text-[#0b0b0b] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.18)] backdrop-blur-md px-4 sm:px-6 flex items-center justify-between border border-black/5'
              : 'w-full h-full flex items-center justify-between text-white'
          }`}
        >
          {/* Left Zone: Hamburger & Brand Wordmark */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group relative flex items-center justify-center w-8 h-8 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current cursor-pointer"
              aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              <div className="w-5 h-3.5 flex flex-col justify-between items-start">
                <span
                  className={`h-[1.5px] rounded-full transition-all duration-300 ${
                    isScrolled ? 'bg-[#0b0b0b]' : 'bg-white'
                  } ${isMenuOpen ? 'w-5 translate-y-[5.5px] rotate-45' : 'w-5'}`}
                />
                <span
                  className={`h-[1.5px] rounded-full transition-all duration-300 ${
                    isScrolled ? 'bg-[#0b0b0b]' : 'bg-white'
                  } ${isMenuOpen ? 'opacity-0' : 'w-3.5 group-hover:w-5'}`}
                />
                <span
                  className={`h-[1.5px] rounded-full transition-all duration-300 ${
                    isScrolled ? 'bg-[#0b0b0b]' : 'bg-white'
                  } ${isMenuOpen ? 'w-5 -translate-y-[6.5px] -rotate-45' : 'w-5'}`}
                />
              </div>
            </button>

            {/* Brand Wordmark */}
            <button
              onClick={() => navigateTo('home')}
              className={`font-semibold tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-colors flex items-center gap-1 cursor-pointer ${
                isScrolled ? 'text-[#0b0b0b] text-[14px] sm:text-[16px]' : 'text-white text-[14px] sm:text-[17px]'
              }`}
            >
              <span className="text-[#8b181b] text-xs">◆</span>
              <span>{brand.name}</span>
              <span className="text-[#8b181b] text-xs">◆</span>
            </button>
          </div>

          {/* Center Zone: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-[11px] xl:text-[12px] uppercase tracking-[0.16em] font-medium">
            {navLinks.map(link => {
              const isActive = currentPage === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => navigateTo(link.route)}
                  className={`relative py-1 transition-colors cursor-pointer group flex items-center gap-1.5 ${
                    isActive
                      ? isScrolled
                        ? 'text-black font-bold'
                        : 'text-white font-bold'
                      : isScrolled
                      ? 'text-neutral-600 hover:text-black'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 bg-[#8b181b] text-white text-[8px] font-mono rounded tracking-widest shadow-xs">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#8b181b] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Zone: Controls (Search, Discover, Bag, Currency) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Currency selector (Desktop only) */}
            <div className="relative hidden xl:flex items-center gap-1 text-[11px] font-medium tracking-wider">
              <Globe className="w-3.5 h-3.5 opacity-60" />
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="bg-transparent appearance-none cursor-pointer pr-2 focus:outline-none uppercase"
              >
                <option value="USD" className="text-black bg-white">USD ($)</option>
                <option value="EUR" className="text-black bg-white">EUR (€)</option>
                <option value="GBP" className="text-black bg-white">GBP (£)</option>
                <option value="JPY" className="text-black bg-white">JPY (¥)</option>
              </select>
            </div>

            {/* Search Dropdown trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Open search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Discover Drawer trigger */}
            <button
              onClick={() => setIsDiscoverOpen(true)}
              className="p-1.5 hover:opacity-75 transition-opacity relative cursor-pointer"
              aria-label="Open discover news"
            >
              <Megaphone className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#8b181b] rounded-full" />
            </button>

            {/* Bag Drawer trigger with Counter Pop */}
            <button
              id="header-bag-btn"
              onClick={() => setIsBagOpen(true)}
              className={`relative flex items-center gap-1 py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full text-[11px] sm:text-[12px] font-medium tracking-wider transition-all cursor-pointer ${
                isScrolled
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white'
              } ${isBagPopping ? 'scale-110 ring-2 ring-[#8b181b]' : 'scale-100'}`}
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="font-mono text-xs font-semibold">({cartCount})</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
