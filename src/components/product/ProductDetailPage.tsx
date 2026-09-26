import React, { useEffect, useState } from "react";
import { Truck, ChevronRight } from "lucide-react";
import { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";

interface ProductDetailPageProps {
  product: Product;
  onBackToShop: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBackToShop,
  onOpenSizeGuide,
}) => {
  const { addToCart, formatPrice } = useCart();

  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] || "BLACK",
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "S");
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // This page is shown by swapping content in App.tsx rather than a real route
  // change, so the browser keeps whatever scroll position the shop page was
  // at. Without this, opening a product while scrolled down makes the detail
  // page appear to load "scrolled down" / mid-page instead of at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [product.id]);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const getStockCount = (id: string) => {
    // Generate realistic stock counts per item
    if (id === "p1") return 8;
    if (id === "p2") return 3;
    if (id === "p3") return 5;
    if (id === "p5") return 4;
    if (id === "p6") return 12;
    return 6;
  };

  const stockCount = getStockCount(product.id);

  return (
    <div className="min-h-screen bg-navy-950 light:bg-slate-50 text-slate-100 light:text-navy-950 transition-colors duration-300 animate-fade-in pb-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-8">
        {/* Breadcrumb Navigation Bar */}
        <nav className="flex items-center space-x-2 text-xs font-mono tracking-wider text-slate-400 light:text-slate-600 mb-8 uppercase">
          <button
            onClick={onBackToShop}
            className="hover:text-electric-400 transition-colors"
          >
            Shop
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <button
            onClick={onBackToShop}
            className="hover:text-electric-400 transition-colors"
          >
            {product.category.charAt(0) +
              product.category.slice(1).toLowerCase()}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 light:text-navy-950 font-bold truncate">
            {product.name}
          </span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Product Image Showcase */}
          <div className="lg:col-span-7 bg-navy-900/60 light:bg-slate-200 aspect-[3/4] rounded-sm overflow-hidden relative shadow-2xl border border-navy-800/60 light:border-slate-300">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge === "SALE" && (
              <span className="sale-badge">Sale</span>
            )}
            {product.badge === "SOLD OUT" && (
              <span className="sold-out-badge">Sold Out</span>
            )}
          </div>

          {/* Right Column: Specifications & Ordering */}
          <div className="lg:col-span-5 space-y-8">
            {/* Category & Title */}
            <div>
              <p className="magazine-label text-slate-400 light:text-slate-500 mb-2">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-normal leading-tight text-slate-100 light:text-navy-950 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl md:text-3xl font-semibold text-slate-100 light:text-navy-950">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono text-slate-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Colour Picker */}
            <div className="space-y-3 pt-2">
              <p className="magazine-label text-slate-300 light:text-navy-900">
                COLOUR:{" "}
                <span className="text-slate-100 light:text-navy-950 font-bold">
                  {selectedColor.toUpperCase()}
                </span>
              </p>

              <div className="flex items-center gap-3">
                {product.swatches && product.swatches.length > 0
                  ? product.swatches.map((swatch, idx) => {
                      const isSelected =
                        selectedColor.toLowerCase() ===
                        swatch.name.toLowerCase();
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(swatch.name)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? "ring-2 ring-electric-400 ring-offset-2 ring-offset-navy-950 light:ring-offset-white scale-110"
                              : "opacity-70 hover:opacity-100"
                          }`}
                          title={swatch.name}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-slate-600"
                            style={{ backgroundColor: swatch.hex }}
                          />
                        </button>
                      );
                    })
                  : product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
                          selectedColor === color
                            ? "bg-electric-600 text-white border-electric-400 font-bold"
                            : "bg-navy-900 text-slate-400 border-navy-800"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
              </div>
            </div>

            {/* Size Picker */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <p className="magazine-label text-slate-300 light:text-navy-900">
                  SIZE:{" "}
                  <span className="text-slate-100 light:text-navy-950 font-bold">
                    {selectedSize}
                  </span>
                </p>
                <button
                  onClick={onOpenSizeGuide}
                  className="text-xs font-mono text-slate-400 light:text-slate-600 hover:text-electric-400 underline uppercase tracking-wider"
                >
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center font-mono text-xs font-semibold tracking-wider transition-all border ${
                        isSelected
                          ? "bg-white text-navy-950 border-white font-bold shadow-lg"
                          : "bg-navy-900/60 light:bg-slate-100 text-slate-300 light:text-navy-900 border-navy-800 light:border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3 pt-2">
              <p className="magazine-label text-slate-300 light:text-navy-900">
                QUANTITY
              </p>

              <div className="flex items-center border border-navy-800 light:border-slate-300 bg-navy-900/40 light:bg-white w-max font-mono text-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white light:hover:text-navy-950 transition-colors"
                >
                  –
                </button>
                <span className="w-10 text-center font-bold text-slate-100 light:text-navy-950">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white light:hover:text-navy-950 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Full-Width Add To Cart Button */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 uppercase font-mono text-xs tracking-[0.25em] font-semibold transition-all duration-300 shadow-xl ${
                  product.inStock
                    ? "bg-white text-navy-950 hover:bg-slate-200 border border-white"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                }`}
              >
                {!product.inStock
                  ? "SOLD OUT"
                  : addedToast
                    ? "ADDED TO CART!"
                    : "ADD TO CART"}
              </button>
            </div>

            {/* Stock Alert Notice */}
            {product.inStock && (
              <p className="text-xs font-mono text-amber-400 light:text-amber-600">
                Only {stockCount} left in stock.
              </p>
            )}

            <div className="border-t border-navy-800 light:border-slate-300 pt-6 space-y-6">
              {/* Details Paragraph */}
              <div>
                <p className="magazine-label text-slate-400 light:text-slate-500 mb-2">
                  DETAILS
                </p>
                <p className="text-sm font-light text-slate-300 light:text-slate-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Pre-Order Delivery Box */}
              <div className="p-4 border border-navy-800 light:border-slate-300 bg-navy-900/30 light:bg-slate-100 rounded-sm flex items-center gap-3 text-xs font-mono text-slate-300 light:text-slate-700">
                <Truck className="w-5 h-5 text-electric-400 shrink-0" />
                <span>Pre-order — delivery by 20th October 2026.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
