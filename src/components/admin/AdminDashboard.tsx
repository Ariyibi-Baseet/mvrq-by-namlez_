import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  LogOut,
  Search,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { Product, Category } from "../../types/product";
import { optimizeUrl } from "../../lib/cloudinary";
import { ProductFormModal, CATEGORIES } from "./Productformmodal";
import {
  inputCls,
  eyebrowCls,
  btnPrimary,
  btnGhost,
  btnDanger,
  chipCls,
} from "./Adminstyles";

type StockFilter = "all" | "in" | "out";
type Toast = { message: string; tone: "success" | "error" } | null;

/* ---------- Small pieces ---------- */

const StockSwitch: React.FC<{ inStock: boolean; onToggle: () => void }> = ({
  inStock,
  onToggle,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={inStock}
    onClick={onToggle}
    title={inStock ? "Mark as sold out" : "Mark as in stock"}
    className="inline-flex items-center gap-2.5"
  >
    <span
      className={`relative w-9 h-5 border transition-colors ${
        inStock
          ? "bg-emerald-500/20 border-emerald-500/60"
          : "border-navy-800 light:border-slate-300"
      }`}
    >
      <span
        className={`absolute top-[3px] h-3 w-3 transition-all ${
          inStock ? "left-[19px] bg-emerald-400" : "left-[3px] bg-slate-500"
        }`}
      />
    </span>
    <span
      className={`text-[11px] font-mono uppercase tracking-[0.15em] ${
        inStock ? "text-emerald-400" : "text-slate-400"
      }`}
    >
      {inStock ? "In stock" : "Sold out"}
    </span>
  </button>
);

const IconButton: React.FC<{
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}> = ({ label, onClick, danger, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`p-2.5 border border-navy-800 light:border-slate-300 text-slate-400 transition-colors hover:border-slate-500 ${
      danger
        ? "hover:!text-rose-400 hover:!border-rose-500/50"
        : "hover:text-white light:hover:text-navy-950"
    }`}
  >
    {children}
  </button>
);

const Thumb: React.FC<{ product: Product; className?: string }> = ({
  product,
  className = "w-12",
}) => (
  <img
    src={optimizeUrl(product.image, 160)}
    alt={product.name}
    loading="lazy"
    className={`${className} aspect-[3/4] object-cover bg-navy-900 light:bg-slate-100 shrink-0`}
  />
);

/* ---------- Dashboard ---------- */

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { products, loading, error, deleteProduct, toggleStock, seedDefaults } =
    useProducts();
  const { formatPrice } = useCart();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category>("ALL");
  const [stock, setStock] = useState<StockFilter>("all");

  const [toast, setToast] = useState<Toast>(null);
  const notify = (message: string, tone: "success" | "error" = "success") =>
    setToast({ message, tone });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const stats = useMemo(() => {
    const inStock = products.filter((p) => p.inStock);
    return {
      total: products.length,
      inStock: inStock.length,
      soldOut: products.length - inStock.length,
      value: inStock.reduce((sum, p) => sum + p.price, 0),
    };
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      const matchesCat = cat === "ALL" || p.category === cat;
      const matchesStock =
        stock === "all" || (stock === "in" ? p.inStock : !p.inStock);
      return matchesQuery && matchesCat && matchesStock;
    });
  }, [products, query, cat, stock]);

  const filtersActive = query !== "" || cat !== "ALL" || stock !== "all";
  const clearFilters = () => {
    setQuery("");
    setCat("ALL");
    setStock("all");
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setFormOpen(true);
  };
  const closeForm = () => setFormOpen(false);

  const handleToggle = async (p: Product) => {
    try {
      await toggleStock(p.id);
      notify(
        p.inStock
          ? `${p.name} marked as sold out`
          : `${p.name} is back in stock`,
      );
    } catch (e) {
      console.error(e);
      notify(
        "Could not update stock. Check your connection and permissions.",
        "error",
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteProduct(deleting.id);
      notify(`${deleting.name} deleted`);
      setDeleting(null);
    } catch (e) {
      console.error(e);
      notify(
        "Could not delete. Check your connection and permissions.",
        "error",
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const n = await seedDefaults();
      notify(
        n > 0
          ? `Imported ${n} starter products`
          : "Starter products are already imported",
      );
    } catch (e) {
      console.error(e);
      notify("Import failed. Check your Firestore rules.", "error");
    } finally {
      setSeeding(false);
    }
  };

  const statCells = [
    { label: "Total pieces", value: stats.total },
    { label: "In stock", value: stats.inStock },
    { label: "Sold out", value: stats.soldOut },
    { label: "Stock value", value: formatPrice(stats.value) },
  ];

  return (
    <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-100 light:text-navy-950">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-navy-800 light:border-slate-200">
        <div>
          <p className={eyebrowCls}>Administrator</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-2 text-white light:text-navy-950">
            Inventory
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAdd} className={btnPrimary}>
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add product
          </button>
          <button onClick={() => void logout()} className={btnGhost}>
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </header>

      {/* Firestore problem banner */}
      {error && (
        <div
          className="flex items-start gap-3 border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300"
          role="alert"
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              Couldn't load products from Firestore.
            </p>
            <p className="font-mono text-xs mt-1 opacity-80 break-words">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <section
        aria-label="Inventory summary"
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-navy-800 light:bg-slate-200 border border-navy-800 light:border-slate-200"
      >
        {statCells.map((s) => (
          <div key={s.label} className="bg-navy-950 light:bg-white p-5 sm:p-6">
            <p className={eyebrowCls}>{s.label}</p>
            <p className="font-serif text-3xl sm:text-4xl mt-2 text-white light:text-navy-950 truncate">
              {s.value}
            </p>
          </div>
        ))}
      </section>

      {/* Toolbar */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {(["ALL", ...CATEGORIES] as Category[]).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`${chipCls(cat === c)} shrink-0`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 lg:w-64 lg:flex-none">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                className={`${inputCls} !pl-10`}
              />
            </div>
            <select
              value={stock}
              onChange={(e) => setStock(e.target.value as StockFilter)}
              aria-label="Filter by stock"
              className={`${inputCls} !w-auto`}
            >
              <option value="all">All stock</option>
              <option value="in">In stock</option>
              <option value="out">Sold out</option>
            </select>
          </div>
        </div>

        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
          Showing {visible.length} of {products.length}
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="ml-3 underline underline-offset-2 hover:text-white"
            >
              Clear filters
            </button>
          )}
        </p>
      </section>

      {/* List */}
      {loading ? (
        <div className="space-y-px" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-navy-900/60 light:bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 && !error ? (
        <div className="border border-dashed border-navy-800 light:border-slate-300 py-16 px-6 text-center">
          <h2 className="font-serif text-2xl">No products yet</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Add your first piece with photos, or import the starter products to
            see how the store looks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button onClick={openAdd} className={btnPrimary}>
              <Plus className="w-4 h-4" /> Add product
            </button>
            <button
              onClick={() => void handleSeed()}
              disabled={seeding}
              className={btnGhost}
            >
              {seeding ? "Importing…" : "Import starter products"}
            </button>
          </div>
        </div>
      ) : visible.length === 0 ? (
        <div className="border border-navy-800 light:border-slate-200 py-14 text-center">
          <p className="font-serif text-xl">No products match your filters</p>
          <button onClick={clearFilters} className={`${btnGhost} mt-5`}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-navy-800 light:border-slate-200 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-navy-800 light:border-slate-200 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
                  <th className="py-4 px-6 font-normal">Product</th>
                  <th className="py-4 px-4 font-normal">Category</th>
                  <th className="py-4 px-4 font-normal">Price</th>
                  <th className="py-4 px-4 font-normal">Availability</th>
                  <th className="py-4 px-6 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800 light:divide-slate-200">
                {visible.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-navy-900/40 light:hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <Thumb product={p} />
                        <div className="min-w-0">
                          <p className="text-sm text-white light:text-navy-950 truncate max-w-xs">
                            {p.name}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 mt-1">
                            {p.images?.length ?? 1} photo
                            {(p.images?.length ?? 1) === 1 ? "" : "s"}
                            {p.badge && (
                              <span className="ml-2 px-1.5 py-0.5 border border-amber-400/50 text-amber-400 uppercase tracking-wider">
                                {p.badge}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[11px] font-mono uppercase tracking-[0.15em] text-slate-300">
                      {p.category}
                    </td>
                    <td className="py-4 px-4 text-sm font-mono">
                      {formatPrice(p.price)}
                      {p.originalPrice ? (
                        <span className="ml-2 text-xs text-slate-500 line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-4 px-4">
                      <StockSwitch
                        inStock={p.inStock}
                        onToggle={() => void handleToggle(p)}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <IconButton
                          label={`Edit ${p.name}`}
                          onClick={() => openEdit(p)}
                        >
                          <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                        </IconButton>
                        <IconButton
                          label={`Delete ${p.name}`}
                          onClick={() => setDeleting(p)}
                          danger
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="md:hidden divide-y divide-navy-800 light:divide-slate-200 border border-navy-800 light:border-slate-200">
            {visible.map((p) => (
              <li key={p.id} className="p-4">
                <div className="flex gap-4">
                  <Thumb product={p} className="w-16" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white light:text-navy-950">
                      {p.name}
                    </p>
                    <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-400 mt-1">
                      {p.category}
                      {p.badge && (
                        <span className="ml-2 text-amber-400">{p.badge}</span>
                      )}
                    </p>
                    <p className="text-sm font-mono mt-2">
                      {formatPrice(p.price)}
                      {p.originalPrice ? (
                        <span className="ml-2 text-xs text-slate-500 line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <StockSwitch
                    inStock={p.inStock}
                    onToggle={() => void handleToggle(p)}
                  />
                  <div className="flex gap-2">
                    <IconButton
                      label={`Edit ${p.name}`}
                      onClick={() => openEdit(p)}
                    >
                      <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                    </IconButton>
                    <IconButton
                      label={`Delete ${p.name}`}
                      onClick={() => setDeleting(p)}
                      danger
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </IconButton>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Add / edit */}
      {formOpen && (
        <ProductFormModal
          key={editing?.id ?? "new"}
          product={editing}
          onClose={closeForm}
          onSaved={(m) => notify(m)}
        />
      )}

      {/* Delete confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm animate-fade-in">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm delete"
            className="w-full max-w-md bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 p-8 text-slate-100 light:text-navy-950"
          >
            <p className={eyebrowCls}>Delete product</p>
            <h2 className="font-serif text-2xl mt-2">
              Delete “{deleting.name}”?
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              It disappears from the store straight away and can't be undone.
              Its photos stay in your Cloudinary library.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleting(null)}
                disabled={deleteBusy}
                className={`${btnGhost} flex-1`}
              >
                Cancel
              </button>
              <button
                onClick={() => void confirmDelete()}
                disabled={deleteBusy}
                className={`${btnDanger} flex-1`}
              >
                {deleteBusy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-4 sm:right-6 z-[70] flex items-center gap-3 max-w-[calc(100vw-2rem)] bg-navy-900 light:bg-white border border-navy-800 light:border-slate-300 border-l-2 px-4 py-3 text-sm shadow-2xl ${
            toast.tone === "success"
              ? "border-l-emerald-400"
              : "border-l-rose-400"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            aria-label="Dismiss"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
