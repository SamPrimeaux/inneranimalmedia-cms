import React from 'react';
import { Globe, ArrowUp, Sparkles, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PageRoute } from '../types';
import { useEditorialBrand } from '../portable/EditorialHost';

export const Footer: React.FC = () => {
  const brand = useEditorialBrand();
  const { currency, setCurrency, navigateTo } = useCart();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 bg-[#070707] text-white">
      {/* S26: Main Footer */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-lg font-bold tracking-[0.25em] uppercase text-white cursor-pointer"
          >
            <span className="text-[#8b181b]">◆</span>
            <span>{brand.name}</span>
            <span className="text-[#8b181b]">◆</span>
          </button>
          <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm">
            High-fashion architectural menswear and womenswear defined by tactile contrast, drum-dyed skins, and English wool tailoring.
          </p>
          <div className="pt-2 text-[11px] text-neutral-500 font-mono">
            FLORENCE · LONDON · PARIS · NEW YORK · TOKYO
          </div>
        </div>

        {/* Link Column 1: Directory */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2a8aa]">
            STOREFRONT
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400 font-light">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">
                Flagship Runway
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('collections')} className="hover:text-white transition-colors cursor-pointer">
                Collections & Archive
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('lookbook')} className="hover:text-white transition-colors cursor-pointer">
                Editorial Lookbook
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('maison')} className="hover:text-white transition-colors cursor-pointer">
                Maison & Ateliers
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('reserve')} className="hover:text-white transition-colors cursor-pointer">
                VIP Drop Vault
              </button>
            </li>
          </ul>
        </div>

        {/* Link Column 2: Studio & Craft */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2a8aa]">
            STUDIO & ATELIER
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400 font-light">
            <li>
              <button onClick={() => navigateTo('studio')} className="hover:text-[#e2a8aa] transition-colors cursor-pointer flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3 h-3 text-[#e2a8aa]" />
                <span>Brand Stream Workspace</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('maison')} className="hover:text-white transition-colors cursor-pointer">
                Florentine Leathercraft
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('collections', { category: 'LEATHER' })} className="hover:text-white transition-colors cursor-pointer">
                Vegetable-Tanned Nappa
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('collections', { category: 'TOPS' })} className="hover:text-white transition-colors cursor-pointer">
                16-Gauge Australian Merino
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('maison')} className="hover:text-white transition-colors cursor-pointer">
                Book Atelier Salon
              </button>
            </li>
          </ul>
        </div>

        {/* Region & Back to top Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e2a8aa]">
            REGION & PREFERENCE
          </h4>
          <div className="flex items-center gap-2 text-xs bg-white/5 p-3 rounded-sm border border-white/10">
            <Globe className="w-4 h-4 text-white/60" />
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer uppercase text-xs"
            >
              <option value="USD" className="bg-neutral-900">United States (USD $)</option>
              <option value="EUR" className="bg-neutral-900">European Union (EUR €)</option>
              <option value="GBP" className="bg-neutral-900">United Kingdom (GBP £)</option>
              <option value="JPY" className="bg-neutral-900">Japan (JPY ¥)</option>
            </select>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white uppercase tracking-widest pt-2 group cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* S27: Footer Bottom Panel */}
      <div className="border-t border-white/10 bg-[#050505] py-6 px-6 md:px-12 text-[11px] text-neutral-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026 {brand.name} · Editorial concept study.
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS OF SALE</a>
            <a href="#" className="hover:text-white transition-colors">LEGAL NOTICE</a>
            <a href="#" className="hover:text-white transition-colors">COOKIE PREFERENCES</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
