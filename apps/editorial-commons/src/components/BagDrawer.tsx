import { useEditorialHost } from '../portable/EditorialHost';
import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const BagDrawer: React.FC = () => {
  const {
    isBagOpen,
    setIsBagOpen,
    cart,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    freeShippingThreshold,
    freeShippingProgress,
    formatPrice
  } = useCart();

  const { commerce, mode } = useEditorialHost();
  const canCheckout = mode === 'connected' && Boolean(commerce.onCheckout);
  const canUsePromo = mode === 'connected' && Boolean(commerce.validatePromotion);
  const [status, setStatus] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isBagOpen) return null;

  const discountAmount = appliedPromo ? discountValue : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commerce.validatePromotion || !canUsePromo) return;
    try {
      const promo = await commerce.validatePromotion(promoCode.trim(), cart);
      setAppliedPromo(promo?.code ?? null);
      setDiscountValue(promo?.discount ?? 0);
      setStatus(promo ? 'Promotion validated by your store.' : 'This promotion is unavailable.');
      setPromoCode('');
    } catch {
      setStatus('Could not verify promotion. Please try again.');
    }
  };

  const handleCheckout = async () => {
    if (!canCheckout || !commerce.onCheckout) return;
    setIsCheckingOut(true);
    setStatus('');
    try {
      await commerce.onCheckout(cart);
      setCheckoutSuccess(true);
    } catch {
      setStatus('Checkout could not be started. No order was confirmed.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Blurred & dimmed backdrop */}
      <div
        onClick={() => setIsBagOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity duration-300"
      />

      {/* Right Slide-over Sheet (520px) */}
      <div
        className="absolute inset-y-0 right-0 w-full max-w-[520px] bg-[#0c0c0c] text-white border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-[themeReveal_0.4s_cubic-bezier(0.22,1,0.36,1)]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-[#0e0e0e]">
          <div>
            <h2 className="font-serif text-3xl font-light tracking-wide text-white">Your BAG</h2>
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50 mt-0.5">
              {cartCount} {cartCount === 1 ? 'PIECE' : 'PIECES'} SELECTED
            </div>
          </div>
          <button
            onClick={() => setIsBagOpen(false)}
            className="p-1.5 hover:text-[#8b181b] transition-colors"
            aria-label="Close bag"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-8 py-3 bg-[#141414] border-b border-white/5">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#8b181b]" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-[#e2a8aa] font-medium">Complimentary Express Shipping Unlocked</span>
              ) : (
                <span>Add {formatPrice(remainingForFreeShipping)} more for Free Express Delivery</span>
              )}
            </span>
            <span className="tabular-nums font-mono text-[11px]">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8b181b] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {checkoutSuccess ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#8b181b]/20 text-[#8b181b] flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl text-white">Checkout handed to store</h3>
              <p className="text-sm text-white/60 max-w-sm mx-auto">
                Your store connector accepted the checkout request. Order status is verified only by your commerce provider.
              </p>
              <button
                onClick={() => {
                  setCheckoutSuccess(false);
                  setIsBagOpen(false);
                }}
                className="mt-4 px-6 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#8b181b] hover:text-white transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-white/40 uppercase tracking-widest text-xs">Your shopping bag is empty.</p>
              <button
                onClick={() => setIsBagOpen(false)}
                className="px-6 py-3 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#8b181b] hover:text-white transition-colors"
              >
                DISCOVER THE COLLECTION
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
                  className="flex gap-4 p-3 bg-white/5 rounded-sm border border-white/5 relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-28 object-cover bg-neutral-900 shrink-0 rounded-sm"
                  />
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-[13px] font-semibold uppercase tracking-wider text-white">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                          className="text-white/40 hover:text-white transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs text-white/50 mt-1 space-x-2">
                        <span>Color: {item.selectedColor}</span>
                        <span>·</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-white/10 rounded-sm bg-black/40">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity - 1
                            )
                          }
                          className="p-1 px-2 text-white/60 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedColor,
                              item.selectedSize,
                              item.quantity + 1
                            )
                          }
                          className="p-1 px-2 text-white/60 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold tabular-nums text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Total & Checkout */}
        {cart.length > 0 && !checkoutSuccess && (
          <div className="p-8 border-t border-white/10 bg-[#090909] space-y-4">
            {/* Promo Code input */}
            {canUsePromo && <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                placeholder="PROMOTION CODE"
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs text-white uppercase placeholder-white/40 focus:outline-none focus:border-white/30"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-medium transition-colors"
              >
                Apply
              </button>
            </form>}

            {appliedPromo && (
              <div className="flex justify-between items-center text-xs text-[#e2a8aa]">
                <span>Promotion ({appliedPromo})</span>
                <span className="tabular-nums font-mono">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            {/* Subtotal */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex justify-between items-center text-xs text-white/60">
                <span>Shipping</span>
                <span>{canCheckout ? (remainingForFreeShipping === 0 ? 'Estimate: included' : 'At checkout') : 'Preview only'}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-white">
                <span className="uppercase tracking-wider">Estimated Total</span>
                <span className="text-lg tabular-nums font-mono">{formatPrice(finalTotal)}</span>
              </div>
              <div className="text-[10px] text-white/40 text-right">
                Duties & taxes calculated at checkout
              </div>
            </div>

            {status && <p role="status" className="text-xs text-white/65">{status}</p>}
            {/* Primary Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || !canCheckout}
              className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.14em] hover:bg-[#8b181b] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isCheckingOut ? (
                <span>OPENING STORE CHECKOUT...</span>
              ) : (
                <>
                  <span>{canCheckout ? 'PROCEED TO CHECKOUT' : 'PREVIEW ONLY — CHECKOUT UNAVAILABLE'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{canCheckout ? 'Checkout managed by your commerce provider' : 'Illustrative cart — no live orders or payments'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
