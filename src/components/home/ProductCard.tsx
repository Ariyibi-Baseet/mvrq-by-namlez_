import React from 'react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice } = useCart();
  const { setActiveProductModal } = useProducts();

  return (
    <div
      onClick={() => setActiveProductModal(product)}
      className="group block cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="product-card-img aspect-[3/4] bg-navy-900 mb-4 relative rounded-sm overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />

        {/* Badges */}
        {product.badge === 'SALE' && (
          <span className="sale-badge">Sale</span>
        )}
        {product.badge === 'SOLD OUT' && (
          <span className="sold-out-badge">Sold Out</span>
        )}

        {/* Hover View Product Button Overlay */}
        <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/50 transition-colors duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
          <span className="magazine-label text-white bg-navy-950/90 border border-white/30 px-5 py-2.5 backdrop-blur-sm">
            View Product
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-100 light:text-navy-950 truncate group-hover:text-electric-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 light:text-slate-500 mb-1">
          {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
        </p>

        {/* Price Display */}
        <div className="flex items-center gap-2 font-semibold text-sm">
          <span className={product.originalPrice ? "text-electric-400 font-bold" : "text-slate-100 light:text-navy-950"}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-500 line-through font-normal">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Color Swatch Circles */}
        {product.swatches && product.swatches.length > 0 && (
          <div className="flex gap-1.5 mt-2.5">
            {product.swatches.map((swatch, idx) => (
              <div
                key={idx}
                className="w-3 h-3 rounded-full border border-slate-600 light:border-slate-300 shadow-sm"
                style={{ backgroundColor: swatch.hex }}
                title={swatch.name}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
