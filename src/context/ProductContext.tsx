import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Category, ProductFilter } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  filter: ProductFilter;
  setCategoryFilter: (category: Category) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: ProductFilter['sortBy']) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  resetToDefault: () => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mvrq_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved products:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [filter, setFilter] = useState<ProductFilter>({
    category: 'ALL',
    searchQuery: '',
    sortBy: 'featured',
  });

  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('mvrq_products', JSON.stringify(products));
  }, [products]);

  const setCategoryFilter = (category: Category) => {
    setFilter(prev => ({ ...prev, category }));
  };

  const setSearchQuery = (searchQuery: string) => {
    setFilter(prev => ({ ...prev, searchQuery }));
  };

  const setSortBy = (sortBy: ProductFilter['sortBy']) => {
    setFilter(prev => ({ ...prev, sortBy }));
  };

  const addProduct = (newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `mvrq-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const resetToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('mvrq_products');
  };

  // Compute filtered & sorted products
  const filteredProducts = products.filter(p => {
    const matchesCategory = filter.category === 'ALL' || p.category === filter.category;
    const matchesQuery = filter.searchQuery === '' ||
      p.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(filter.searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  }).sort((a, b) => {
    if (filter.sortBy === 'price-low') return a.price - b.price;
    if (filter.sortBy === 'price-high') return b.price - a.price;
    if (filter.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0; // featured
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        filter,
        setCategoryFilter,
        setSearchQuery,
        setSortBy,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        resetToDefault,
        activeProductModal,
        setActiveProductModal,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
