export type Category = 'ALL' | 'TOPS' | 'BOTTOMS' | 'OUTERWEAR' | 'SETS' | 'ACCESSORIES';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, 'ALL'>;
  price: number;
  originalPrice?: number;
  badge?: 'SALE' | 'NEW' | 'SOLD OUT' | 'PRE-ORDER';
  inStock: boolean;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  swatches?: ColorSwatch[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface ProductFilter {
  category: Category;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest';
}
