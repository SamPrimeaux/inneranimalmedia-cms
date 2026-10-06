import React, { useState, useMemo } from 'react';
import {
  Filter,
  Grid,
  Columns2,
  Columns3,
  Columns4,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Eye,
  Check,
  RotateCcw,
  Search
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useEditorialData } from '../../portable/EditorialHost';
import { Product } from '../../types';

export const CollectionsPage: React.FC = () => {
  const { PRODUCTS, CATEGORIES_WARDROBE } = useEditorialData();
  const {
    navigateTo,
    addToCart,
    formatPrice,
    setQuickViewProduct,
    currentCategoryFilter
  } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategoryFilter || 'ALL');
  const [selectedSort, setSelectedSort] = useState<'featured' | 'new' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [saleOnly, setSaleOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedProductSizes, setSelectedProductSizes] = useState<Record<string, string>>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync if category was set via route navigation
  React.useEffect(() => {
    if (currentCategoryFilter) {
      setSelectedCategory(currentCategoryFilter);
    }
  }, [currentCategoryFilter]);

  const categories = [
    { id: 'ALL', name: 'ALL SILHOUETTES', count: PRODUCTS.length },
    { id: 'LEATHER', name: 'LEATHER & TAILORING', count: PRODUCTS.filter(p => p.category === 'LEATHER').length },
    { id: 'OUTERWEAR', name: 'OUTERWEAR', count: PRODUCTS.filter(p => p.category === 'OUTERWEAR').length },
    { id: 'TOPS', name: 'TOPS & KNITWEAR', count: PRODUCTS.filter(p => p.category === 'TOPS').length },
    { id: 'BOTTOMS', name: 'BOTTOMS & TROUSERS', count: PRODUCTS.filter(p => p.category === 'BOTTOMS').length },
    { id: 'DRESSES', name: 'DRESSES', count: PRODUCTS.filter(p => p.category === 'DRESSES').length },
    { id: 'FOOTWEAR', name: 'FOOTWEAR & OBJECTS', count: PRODUCTS.filter(p => p.category === 'FOOTWEAR').length }
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (saleOnly && !p.isSale) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      if (selectedColor) {
        const hasColor = p.colors.some(c => c.name.toLowerCase().includes(selectedColor.toLowerCase()));
        if (!hasColor) return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      if (selectedSort === 'new') return (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0);
      if (selectedSort === 'rating') return (b.rating || 4) - (a.rating || 4);
      return 0; // featured default
    });
  }, [selectedCategory, saleOnly, searchQuery, selectedColor, selectedSort]);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const size = selectedProductSizes[p.id] || p.sizes[0] || 'M';
    addToCart(p, {
      color: p.colors[0]?.name || 'Standard',
      size,
      count: 1,
      event: e
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSaleOnly(false);
    setInStockOnly(false);
    setSelectedColor(null);
    setSearchQuery('');
    setSelectedSort('featured');
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pt-24 pb-28">
      {/* Editorial Header Banner */}
      <section className="border-b border-black/5 bg-[#faf8f5] py-12 sm:py-16 px-6 sm:px-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-[#8b181b] uppercase font-mono">
                <span>◆ AUTUMN / WINTER 26 ARCHIVE</span>
                <span>/</span>
                <span>{filteredProducts.length} DESIGNS AVAILABLE</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#0a0a0a] uppercase">
                {selectedCategory === 'ALL' ? 'ARCHIVE CATALOG' : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl font-light leading-relaxed">
                Sculpted from 380gsm English wool crepe, drum-dyed Italian nappa, and ultra-fine circular merino knits. Each garment embodies architectural precision with raw tactile refinement.
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('lookbook')}
                className="px-4 py-2 bg-black text-white hover:bg-neutral-800 text-[11px] uppercase tracking-[0.16em] font-medium transition-all rounded-full flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e2a8aa]" />
                <span>VIEW EDITORIAL LOOKBOOK</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-8">
        {/* Sticky Filters & Toolbar */}
        <div className="sticky top-16 sm:top-20 z-20 bg-white/95 backdrop-blur-md py-4 border-b border-black/10 space-y-4">
          {/* Category Horizontal Pill Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`ml-1.5 text-[9px] ${selectedCategory === cat.id ? 'text-neutral-300' : 'text-neutral-400'}`}>
                  ({cat.count})
                </span>
              </button>
            ))}
          </div>

          {/* Controls Bar: Search, Filters, Layout & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Left: Search input + Sale pill */}
            <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter by silhouette, fabrication, shade..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-100 border border-black/5 rounded-full pl-8 pr-4 py-1.5 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <button
                onClick={() => setSaleOnly(!saleOnly)}
                className={`px-3 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  saleOnly
                    ? 'bg-[#8b181b] text-white shadow'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                SALE VAULT
              </button>
            </div>

            {/* Right: Sort and Layout Grid Toggles */}
            <div className="flex items-center gap-4">
              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400 font-mono text-[11px] uppercase hidden sm:inline">SORT:</span>
                <select
                  value={selectedSort}
                  onChange={e => setSelectedSort(e.target.value as any)}
                  className="bg-neutral-100 border border-black/5 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer focus:outline-none uppercase"
                >
                  <option value="featured">FEATURED CURATION</option>
                  <option value="new">NEW ARRIVALS</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                  <option value="rating">HIGHEST RATED</option>
                </select>
              </div>

              {/* Grid Column Switcher (Desktop) */}
              <div className="hidden lg:flex items-center bg-neutral-100 p-0.5 rounded-lg border border-black/5">
                <button
                  onClick={() => setGridColumns(2)}
                  className={`p-1.5 rounded ${gridColumns === 2 ? 'bg-white shadow-xs text-black' : 'text-neutral-400 hover:text-black'} cursor-pointer`}
                  title="2-Column Editorial View"
                >
                  <Columns2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setGridColumns(3)}
                  className={`p-1.5 rounded ${gridColumns === 3 ? 'bg-white shadow-xs text-black' : 'text-neutral-400 hover:text-black'} cursor-pointer`}
                  title="3-Column Classic Grid"
                >
                  <Columns3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setGridColumns(4)}
                  className={`p-1.5 rounded ${gridColumns === 4 ? 'bg-white shadow-xs text-black' : 'text-neutral-400 hover:text-black'} cursor-pointer`}
                  title="4-Column Dense View"
                >
                  <Columns4 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <p className="text-base text-neutral-500 uppercase tracking-widest font-mono">
              NO PIECES MATCH YOUR CURRENT FILTER CRITERIA
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET ALL FILTERS</span>
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 sm:gap-8 pt-8 ${
              gridColumns === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : gridColumns === 3
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {filteredProducts.map(product => {
              const isHovered = hoveredProduct === product.id;
              const displayImage = isHovered && product.hoverImage ? product.hoverImage : product.image;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col cursor-pointer"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => navigateTo('pdp', { productId: product.id })}
                >
                  {/* Image Card Container */}
                  <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden rounded-xs border border-black/5 shadow-xs">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
                      {product.badge && (
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest shadow-xs ${
                          product.badge === 'SALE' ? 'bg-[#8b181b] text-white' : 'bg-black text-white'
                        }`}>
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-black hover:bg-black hover:text-white flex items-center justify-center transition-colors shadow cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Hover Buy Action Bar */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center justify-between gap-2">
                      {/* Sizing Pills */}
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {product.sizes.map(size => {
                          const active = (selectedProductSizes[product.id] || product.sizes[0]) === size;
                          return (
                            <button
                              key={size}
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedProductSizes(prev => ({ ...prev, [product.id]: size }));
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                                active ? 'bg-white text-black' : 'bg-black/60 text-white/80 hover:bg-black/90'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>

                      {/* 1-Click Add */}
                      <button
                        onClick={e => handleQuickAdd(product, e)}
                        className="px-3 py-1 bg-white text-black hover:bg-[#8b181b] hover:text-white rounded text-[10px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0 shadow"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>ADD</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-3 pb-1 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Color Swatch Dots */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {product.colors.map(color => (
                          <span
                            key={color.name}
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>

                      <h3 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#0a0a0a] group-hover:text-[#8b181b] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 line-clamp-1 font-light">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-black">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-neutral-400 line-through text-[11px]">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] tracking-widest text-neutral-400 font-mono uppercase">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
