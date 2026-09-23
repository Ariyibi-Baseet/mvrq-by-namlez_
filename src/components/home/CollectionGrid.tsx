import React from 'react';
import { Category } from '../../types/product';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from './ProductCard';

export const CollectionGrid: React.FC = () => {
  const {
    filteredProducts,
    filter,
    setCategoryFilter,
  } = useProducts();

  const categories: Category[] = ['ALL', 'TOPS', 'BOTTOMS', 'OUTERWEAR', 'SETS', 'ACCESSORIES'];

  const getCategoryTitle = (cat: Category) => {
    switch (cat) {
      case 'ALL': return 'All Pieces';
      case 'TOPS': return 'Tops';
      case 'BOTTOMS': return 'Bottoms';
      case 'OUTERWEAR': return 'Outerwear';
      case 'SETS': return 'Sets';
      case 'ACCESSORIES': return 'Accessories';
      default: return 'All Pieces';
    }
  };

  return (
    <section id="products" className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
      
      {/* Category Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-navy-800/60 pb-6">
        <div>
          <p className="magazine-label text-slate-400 light:text-slate-500 mb-2">
            The Collection
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-slate-100 light:text-navy-950">
            {getCategoryTitle(filter.category)}
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => {
            const label = cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase();
            const isActive = filter.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`category-pill ${isActive ? 'active' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid (2 columns on mobile, 3 on tablet, 4 on desktop) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="magazine-label text-slate-400">No items available in this category.</p>
          <button
            onClick={() => setCategoryFilter('ALL')}
            className="outlined-btn text-xs"
          >
            Show All Pieces
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </section>
  );
};
