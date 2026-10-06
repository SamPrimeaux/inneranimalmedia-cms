import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEditorialData } from '../portable/EditorialHost';

export const SearchPanel: React.FC = () => {
  const { PRODUCTS } = useEditorialData();
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct, formatPrice } = useCart();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const filtered = query.trim()
    ? PRODUCTS.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!isSearchOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0b0b0b] text-white border-b border-white/10 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 border-b border-white/20 pb-3">
          <Search className="w-5 h-5 text-white/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search silhouettes, materials (leather, merino, blazer, dress)..."
            className="w-full bg-transparent text-[16px] text-white placeholder-white/40 focus:outline-none tracking-wide"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs uppercase tracking-wider text-white/50 hover:text-white"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 hover:text-[#8b181b] transition-colors ml-2"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Predictive Suggestions / Results */}
        {query ? (
          <div className="pt-4 max-h-[380px] overflow-y-auto">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3 font-semibold">
              {filtered.length} Results Found
            </div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filtered.map(product => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setQuickViewProduct(product);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-16 object-cover bg-neutral-900 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-[12px] font-semibold tracking-wider uppercase text-white truncate group-hover:text-[#8b181b] transition-colors">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-white/60 tabular-nums">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-[#8b181b]">
                        {product.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-white/50">
                No items matching &ldquo;{query}&rdquo;. Try &ldquo;blazer&rdquo;, &ldquo;leather&rdquo;, or &ldquo;merino&rdquo;.
              </div>
            )}
          </div>
        ) : (
          <div className="pt-3 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span className="uppercase tracking-wider text-[10px] text-white/30 mr-2">POPULAR SEARCHES:</span>
            {['Sable Blazer', 'Leather Tee', 'Merino Turtleneck', 'Kuro Jacket', 'Culottes'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 rounded-full text-[11px] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
