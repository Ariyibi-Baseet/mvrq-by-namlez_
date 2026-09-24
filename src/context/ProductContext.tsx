import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  deleteField,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Product, Category, ProductFilter } from "../types/product";
import { INITIAL_PRODUCTS } from "../data/initialProducts";

const COLLECTION = "products";

type NewProduct = Omit<Product, "id" | "createdAt">;

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  filter: ProductFilter;
  setCategoryFilter: (category: Category) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: ProductFilter["sortBy"]) => void;
  addProduct: (product: NewProduct) => Promise<void>;
  updateProduct: (id: string, updatedData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStock: (id: string) => Promise<void>;
  /** Copies the starter products into Firestore (skips ones that already exist). Returns how many were added. */
  seedDefaults: () => Promise<number>;
  /** Kept so older code that calls resetToDefault keeps working. */
  resetToDefault: () => Promise<number>;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Firestore rejects `undefined` values, so drop them before writing.
const stripUndefined = (obj: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<ProductFilter>({
    category: "ALL",
    searchQuery: "",
    sortBy: "featured",
  });

  const [activeProductModal, setActiveProductModal] = useState<Product | null>(
    null,
  );

  // Live subscription: every visitor sees changes as soon as the admin saves them.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION),
      (snapshot) => {
        const list = snapshot.docs
          .map(
            (d) =>
              ({ ...(d.data() as Omit<Product, "id">), id: d.id }) as Product,
          )
          .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")); // newest first
        setProducts(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const setCategoryFilter = (category: Category) =>
    setFilter((prev) => ({ ...prev, category }));
  const setSearchQuery = (searchQuery: string) =>
    setFilter((prev) => ({ ...prev, searchQuery }));
  const setSortBy = (sortBy: ProductFilter["sortBy"]) =>
    setFilter((prev) => ({ ...prev, sortBy }));

  const addProduct = async (data: NewProduct) => {
    await addDoc(collection(db, COLLECTION), {
      ...stripUndefined(data as Record<string, unknown>),
      createdAt: new Date().toISOString(),
    });
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    // `undefined` means "clear this field" (e.g. removing a badge)
    const { id: _ignored, ...rest } = data;
    const payload = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [
        key,
        value === undefined ? deleteField() : value,
      ]),
    );
    await updateDoc(doc(db, COLLECTION, id), payload);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  const toggleStock = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    await updateDoc(doc(db, COLLECTION, id), { inStock: !product.inStock });
  };

  const seedDefaults = async () => {
    const existing = new Set(products.map((p) => p.id));
    const batch = writeBatch(db);
    let added = 0;

    INITIAL_PRODUCTS.forEach((p) => {
      if (existing.has(p.id)) return;
      const { id, ...rest } = p;
      batch.set(doc(db, COLLECTION, id), {
        ...stripUndefined(rest as Record<string, unknown>),
        createdAt: p.createdAt ?? new Date().toISOString(),
      });
      added += 1;
    });

    if (added > 0) await batch.commit();
    return added;
  };

  // Filtered products for the storefront (same logic as before)
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory =
        filter.category === "ALL" || p.category === filter.category;
      const q = filter.searchQuery.toLowerCase();
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (filter.sortBy === "price-low") return a.price - b.price;
      if (filter.sortBy === "price-high") return b.price - a.price;
      if (filter.sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return 0; // featured = newest first (already sorted above)
    });

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        loading,
        error,
        filter,
        setCategoryFilter,
        setSearchQuery,
        setSortBy,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        seedDefaults,
        resetToDefault: seedDefaults,
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
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};
