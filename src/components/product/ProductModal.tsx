import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

export const ProductModal: React.FC = () => {
  const { activeProductModal, setActiveProductModal } = useProducts();
  const { addToCart, formatPrice } = useCart();

  if (!activeProductModal) return null;

  const [selectedSize, setSelectedSize] = useState(
    activeProductModal.sizes[0] || 'M'
  );
  const [selectedColor, setSelectedColor] = useState(
    activeProductModal.colors[0] || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    addToCart(activeProductModal, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 light:bg-white border border-navy-800 light:border-slate-300 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row text-slate-100 light:text-navy-950">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-20 p-2.5 bg-navy-950/70 hover:bg-navy-950 text-white rounded-full backdrop-blur-md border border-navy-750 transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Panel */}
        <div className="w-full md:w-1/2 bg-navy-950 relative min-h-[320px] md:min-h-full">
          <img
            src={activeProductModal.image}
            alt={activeProductModal.name}
            className="w-full h-full object-cover object-center"
          />
          {activeProductModal.badge && (
            <div className="absolute top-4 left-4 bg-electric-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
              {activeProductModal.badge}
            </div>
          )}
        </div>

        {/* Product Info Panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono text-electric-400 uppercase tracking-superwide">
                {activeProductModal.category}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-100 light:text-navy-950 mt-1">
                {activeProductModal.name}
              </h2>
            </div>

            <div className="flex items-center space-x-3 font-mono">
              <span className="text-2xl font-bold text-slate-100 light:text-navy-950">
                {formatPrice(activeProductModal.price)}
              </span>
              {activeProductModal.originalPrice && (
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(activeProductModal.originalPrice)}
                </span>
              )}
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                activeProductModal.inStock
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {activeProductModal.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 light:text-slate-700 leading-relaxed font-light">
              {activeProductModal.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 uppercase">SELECT SIZE</span>
                <span className="text-electric-400">SIZE GUIDE</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeProductModal.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      selectedSize === sz
                        ? 'bg-electric-600 text-white border-electric-400 shadow-md shadow-electric-500/30'
                        : 'bg-navy-950 light:bg-slate-100 text-slate-300 light:text-navy-900 border-navy-800 light:border-slate-300 hover:border-electric-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            {activeProductModal.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-mono text-slate-400 uppercase">
                  COLORWAY: <strong className="text-slate-200 light:text-navy-950">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeProductModal.colors.map(clr => (
                    <button
                      key={clr}
                      onClick={() => setSelectedColor(clr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                        selectedColor === clr
                          ? 'bg-electric-600/30 text-electric-400 border-electric-500 font-bold'
                          : 'bg-navy-950 light:bg-slate-100 text-slate-400 border-navy-800'
                      }`}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <span className="block text-xs font-mono text-slate-400 uppercase">QUANTITY</span>
              <div className="flex items-center space-x-3 bg-navy-950 light:bg-slate-100 w-max border border-navy-800 light:border-slate-300 rounded-xl px-3 py-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-400 hover:text-white light:hover:text-navy-950 font-bold px-1"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-400 hover:text-white light:hover:text-navy-950 font-bold px-1"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Add to Cart CTA */}
          <div className="space-y-3 pt-4 border-t border-navy-800 light:border-slate-200">
            <button
              onClick={handleAddToCart}
              disabled={!activeProductModal.inStock}
              className={`w-full py-4 rounded-xl font-bold text-xs tracking-superwide uppercase transition-all shadow-lg flex items-center justify-center space-x-2 ${
                activeProductModal.inStock
                  ? 'bg-electric-600 hover:bg-electric-500 text-white shadow-electric-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {activeProductModal.inStock
                  ? addedToast
                    ? 'ADDED TO CART!'
                    : 'ADD TO CART'
                  : 'OUT OF STOCK'}
              </span>
            </button>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 light:text-slate-600 text-center pt-2">
              <div className="flex items-center justify-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-electric-400 shrink-0" />
                <span>NATIONWIDE DELIVERY</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5 text-electric-400 shrink-0" />
                <span>7-DAY RETURNS</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-electric-400 shrink-0" />
                <span>AUTHENTICITY</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
