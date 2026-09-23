import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    formatPrice,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-navy-900 light:bg-white border-l border-navy-800 light:border-slate-300 text-slate-100 light:text-navy-950 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-navy-800 light:border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-electric-400" />
              <h2 className="text-lg font-bold tracking-superwide uppercase">
                YOUR CART ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="p-6 bg-navy-850 light:bg-slate-100 rounded-full border border-navy-800 light:border-slate-200">
                  <ShoppingBag className="w-12 h-12 text-slate-500 light:text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold tracking-wider uppercase">
                    YOUR CART IS EMPTY
                  </h3>
                  <p className="text-xs text-slate-400 light:text-slate-600 max-w-xs font-mono">
                    Explore our collection of timeless luxury pieces and elevate your wardrobe.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-electric-600 hover:bg-electric-500 text-white font-semibold text-xs tracking-superwide uppercase px-8 py-3.5 rounded-full transition-all shadow-lg shadow-electric-500/20"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className="flex space-x-4 p-4 bg-navy-850/60 light:bg-slate-50 rounded-xl border border-navy-800/80 light:border-slate-200 group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-lg bg-navy-800"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-slate-100 light:text-navy-950 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedSize, item.selectedColor)
                          }
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-slate-400 light:text-slate-500 font-mono mt-1 space-x-2">
                        <span>SIZE: {item.selectedSize}</span>
                        <span>•</span>
                        <span>{item.selectedColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity adjustments */}
                      <div className="flex items-center space-x-2 bg-navy-950 light:bg-white border border-navy-750 light:border-slate-300 rounded-lg px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)
                          }
                          className="text-slate-400 hover:text-white light:hover:text-navy-950 p-0.5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)
                          }
                          className="text-slate-400 hover:text-white light:hover:text-navy-950 p-0.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-sm font-bold font-mono text-electric-400 light:text-electric-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout button */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-navy-800 light:border-slate-200 bg-navy-950/80 light:bg-slate-50 space-y-4">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-slate-400 light:text-slate-600 uppercase">SUBTOTAL</span>
                <span className="text-lg font-bold text-slate-100 light:text-navy-950">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 light:text-slate-500 font-mono">
                Taxes and shipping calculated at checkout. Free shipping across Nigeria on orders over ₦50,000.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs tracking-superwide uppercase py-4 rounded-xl transition-all shadow-lg shadow-electric-500/25 flex items-center justify-center space-x-2 group"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
