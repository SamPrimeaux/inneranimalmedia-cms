import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, PageRoute } from '../types';
import { useEditorialData, useEditorialHost } from '../portable/EditorialHost';

interface FlyState {
  startX: number;
  startY: number;
  active: boolean;
}

interface CartContextType {
  // Routing & Multi-Page State
  currentPage: PageRoute;
  currentCategoryFilter: string | null;
  navigateTo: (page: PageRoute, params?: { productId?: string; category?: string; scrollToId?: string }) => void;

  // Cart & Commerce
  cart: CartItem[];
  addToCart: (product: Product, options?: { color?: string; size?: string; count?: number; event?: React.MouseEvent }) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;

  // Drawer & Modal States
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isBagOpen: boolean;
  setIsBagOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isDiscoverOpen: boolean;
  setIsDiscoverOpen: (open: boolean) => void;
  isPromoOpen: boolean;
  setIsPromoOpen: (open: boolean) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isReserveModalOpen: boolean;
  setIsReserveModalOpen: (open: boolean) => void;

  // Dedicated Product Page state
  activeProductPage: Product | null;
  setActiveProductPage: (prod: Product | null) => void;

  // AgentSam Assistant Dashboard
  isAgentSamOpen: boolean;
  setIsAgentSamOpen: (open: boolean) => void;

  // Fly animation & bag pop
  flyState: FlyState;
  isBagPopping: boolean;

  // Currency
  currency: string;
  setCurrency: (c: string) => void;
  currencyRate: number;
  formatPrice: (amount: number) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to parse route from URL hash
function getRouteFromHash(): { page: PageRoute; productId?: string; category?: string } {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!hash) return { page: 'home' };

  if (hash.startsWith('product/')) {
    const id = hash.replace('product/', '');
    return { page: 'pdp', productId: id };
  }
  if (hash.startsWith('collections/') || hash.startsWith('shop/')) {
    const cat = hash.split('/')[1];
    return { page: 'collections', category: cat ? cat.toUpperCase() : undefined };
  }
  if (hash === 'collections' || hash === 'shop') return { page: 'collections' };
  if (hash === 'lookbook' || hash === 'editorial') return { page: 'lookbook' };
  if (hash === 'maison' || hash === 'about') return { page: 'maison' };
  if (hash === 'reserve' || hash === 'vault' || hash === 'droplist') return { page: 'reserve' };
  if (hash === 'studio' || hash === 'brand-stream' || hash === 'brand') return { page: 'studio' };
  if (hash === 'home' || hash === '') return { page: 'home' };

  return { page: 'home' };
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { PRODUCTS } = useEditorialData();
  const { commerce } = useEditorialHost();
  const initialRoute = getRouteFromHash();
  const [currentPage, setCurrentPage] = useState<PageRoute>(initialRoute.page);
  const [currentCategoryFilter, setCurrentCategoryFilter] = useState<string | null>(initialRoute.category || null);
  const [activeProductPage, setActiveProductPage] = useState<Product | null>(() =>
    initialRoute.productId
      ? PRODUCTS.find(product => product.id === initialRoute.productId) ?? null
      : null
  );
  // Never invent or preload a customer order.
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isAgentSamOpen, setIsAgentSamOpen] = useState(false);

  const [flyState, setFlyState] = useState<FlyState>({ startX: 0, startY: 0, active: false });
  const [isBagPopping, setIsBagPopping] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const currencyRates: Record<string, { symbol: string; rate: number }> = {
    USD: { symbol: '$', rate: 1.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    JPY: { symbol: '¥', rate: 152.0 }
  };

  const currencyRate = currencyRates[currency]?.rate || 1.0;

  const formatPrice = (amount: number) => {
    const info = currencyRates[currency] || { symbol: '$', rate: 1.0 };
    const converted = amount * info.rate;
    if (currency === 'JPY') {
      return `${info.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${info.symbol}${converted.toFixed(2)}`;
  };

  // Synchronized Navigation Function
  const navigateTo = useCallback(
    (page: PageRoute, params?: { productId?: string; category?: string; scrollToId?: string }) => {
      // Close overlays when navigating
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setIsDiscoverOpen(false);
      setIsPromoOpen(false);
      setActiveStoryIndex(null);
      setQuickViewProduct(null);

      setCurrentPage(page);

      if (page === 'pdp') {
        const prod = params?.productId
          ? PRODUCTS.find(p => p.id === params.productId) || PRODUCTS[0]
          : activeProductPage || PRODUCTS[0];
        setActiveProductPage(prod);
        window.location.hash = `#/product/${prod.id}`;
      } else {
        setActiveProductPage(null);
        if (page === 'collections') {
          if (params?.category) {
            setCurrentCategoryFilter(params.category);
            window.location.hash = `#/collections/${params.category.toLowerCase()}`;
          } else {
            setCurrentCategoryFilter(null);
            window.location.hash = '#/collections';
          }
        } else if (page === 'home') {
          window.location.hash = '#/';
        } else {
          window.location.hash = `#/${page}`;
        }
      }

      // Scroll to top or specific anchor
      if (params?.scrollToId) {
        setTimeout(() => {
          const el = document.getElementById(params.scrollToId!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [activeProductPage, PRODUCTS]
  );

  // Sync state with browser hash changes (Back/Forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash();
      setCurrentPage(route.page);
      if (route.page === 'pdp' && route.productId) {
        const prod = PRODUCTS.find(p => p.id === route.productId) || PRODUCTS[0];
        setActiveProductPage(prod);
      } else {
        setActiveProductPage(null);
      }
      if (route.category) {
        setCurrentCategoryFilter(route.category);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [PRODUCTS]);

  // Scroll lock effect when any full overlay is active
  useEffect(() => {
    const isAnyModalOpen =
      isMenuOpen ||
      isSearchOpen ||
      isBagOpen ||
      isDiscoverOpen ||
      activeStoryIndex !== null ||
      quickViewProduct !== null ||
      isReserveModalOpen;

    if (isAnyModalOpen) {
      document.documentElement.classList.add('is-scroll-locked');
      document.body.classList.add('is-scroll-locked');
    } else {
      document.documentElement.classList.remove('is-scroll-locked');
      document.body.classList.remove('is-scroll-locked');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsBagOpen(false);
        setIsSearchOpen(false);
        setIsDiscoverOpen(false);
        setIsPromoOpen(false);
        setActiveStoryIndex(null);
        setQuickViewProduct(null);
        setIsReserveModalOpen(false);
        setIsAgentSamOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, isSearchOpen, isBagOpen, isDiscoverOpen, activeStoryIndex, quickViewProduct, isReserveModalOpen]);

  const addToCart = (
    product: Product,
    options?: { color?: string; size?: string; count?: number; event?: React.MouseEvent }
  ) => {
    const color = options?.color || product.colors[0]?.name || 'Standard';
    const size = options?.size || product.sizes[0] || 'One Size';
    const count = options?.count || 1;

    // Trigger fly-to-cart animation if click coordinates exist
    if (options?.event) {
      const rect = (options.event.currentTarget as HTMLElement).getBoundingClientRect();
      setFlyState({
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        active: true
      });
      setTimeout(() => {
        setFlyState({ startX: 0, startY: 0, active: false });
        setIsBagPopping(true);
        setTimeout(() => setIsBagPopping(false), 450);
      }, 550);
    } else {
      setIsBagPopping(true);
      setTimeout(() => setIsBagPopping(false), 450);
    }

    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );
      if (existing) {
        return prev.map(item =>
          item === existing ? { ...item, quantity: item.quantity + count } : item
        );
      }
      return [...prev, { product, selectedColor: color, selectedSize: size, quantity: count }];
    });
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setCart(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
      )
    );
  };

  const updateQuantity = (productId: string, color: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedColor === color && item.selectedSize === size
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    commerce.onCartChange?.(cart);
  }, [cart, commerce]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const freeShippingThreshold = commerce.freeShippingThreshold ?? 150;
  const freeShippingProgress = freeShippingThreshold > 0 ? Math.min(100, (cartTotal / freeShippingThreshold) * 100) : 100;

  return (
    <CartContext.Provider
      value={{
        currentPage,
        currentCategoryFilter,
        navigateTo,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        freeShippingThreshold,
        freeShippingProgress,
        isMenuOpen,
        setIsMenuOpen,
        isBagOpen,
        setIsBagOpen,
        isSearchOpen,
        setIsSearchOpen,
        isDiscoverOpen,
        setIsDiscoverOpen,
        isPromoOpen,
        setIsPromoOpen,
        activeStoryIndex,
        setActiveStoryIndex,
        quickViewProduct,
        setQuickViewProduct,
        isReserveModalOpen,
        setIsReserveModalOpen,
        activeProductPage,
        setActiveProductPage: prod => {
          if (prod) {
            navigateTo('pdp', { productId: prod.id });
          } else {
            navigateTo('home');
          }
        },
        isAgentSamOpen,
        setIsAgentSamOpen,
        flyState,
        isBagPopping,
        currency,
        setCurrency,
        currencyRate,
        formatPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
