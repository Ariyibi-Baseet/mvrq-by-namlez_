import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { Product, Category } from "../../types/product";
import { ImageUploader } from "./Imageuploader";
import {
  inputCls,
  labelCls,
  eyebrowCls,
  btnPrimary,
  btnGhost,
  chipCls,
} from "./Adminstyles";

type EditableCategory = Exclude<Category, "ALL">;

export const CATEGORIES: EditableCategory[] = [
  "TOPS",
  "BOTTOMS",
  "OUTERWEAR",
  "SETS",
  "ACCESSORIES",
];
const BADGES: NonNullable<Product["badge"]>[] = [
  "SALE",
  "NEW",
  "PRE-ORDER",
  "SOLD OUT",
];
const SIZES = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "ONE SIZE"];

interface ProductFormModalProps {
  /** null = add a new product, otherwise edit this one */
  product: Product | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

/**
 * Render with a `key` (e.g. key={product?.id ?? 'new'}) so the form resets
 * whenever you switch between products.
 */
export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  onClose,
  onSaved,
}) => {
  const isEdit = product !== null;
  const { addProduct, updateProduct } = useProducts();

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<EditableCategory>(
    product?.category ?? "TOPS",
  );
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice ? String(product.originalPrice) : "",
  );
  const [images, setImages] = useState<string[]>(
    product?.images?.length
      ? product.images
      : product?.image
        ? [product.image]
        : [],
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [badge, setBadge] = useState<Product["badge"]>(product?.badge);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [sizes, setSizes] = useState<string[]>(
    product?.sizes ?? ["S", "M", "L", "XL"],
  );
  const [colors, setColors] = useState(
    product?.colors?.join(", ") ?? "Midnight Navy, Black",
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Escape closes; page behind doesn't scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, saving]);

  const toggleSize = (size: string) =>
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const priceNum = parseFloat(price);
    const originalNum = originalPrice ? parseFloat(originalPrice) : undefined;

    if (!name.trim()) return setFormError("Enter a product name.");
    if (!(priceNum > 0)) return setFormError("Enter a price greater than 0.");
    if (originalNum !== undefined && originalNum <= priceNum)
      return setFormError(
        "Original price must be higher than the current price.",
      );
    if (images.length === 0) return setFormError("Add at least one photo.");

    const data = {
      name: name.trim(),
      category,
      price: priceNum,
      originalPrice: originalNum,
      badge: badge || undefined,
      inStock,
      image: images[0], // cover image, used everywhere in the store
      images,
      description:
        description.trim() ||
        "Heavyweight luxury cotton garment designed by MVRQ naMLez.",
      sizes: sizes.length > 0 ? sizes : ["M", "L"],
      colors: colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      if (product) await updateProduct(product.id, data);
      else await addProduct(data);
      onSaved(isEdit ? "Changes saved" : "Product added to the store");
      onClose();
    } catch (err) {
      console.error(err);
      setFormError(
        "Could not save. Check your connection and Firestore rules, then try again.",
      );
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6 bg-navy-950/90 backdrop-blur-sm animate-fade-in">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit product" : "Add product"}
        className="flex flex-col w-full h-[100dvh] md:h-auto md:max-h-[92vh] md:max-w-4xl bg-navy-950 light:bg-white border-0 md:border border-navy-800 light:border-slate-300 text-slate-100 light:text-navy-950"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-8 py-5 border-b border-navy-800 light:border-slate-200 shrink-0">
          <div>
            <p className={eyebrowCls}>
              {isEdit ? "Edit product" : "New product"}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl mt-1.5">
              {isEdit ? product.name : "Add to the collection"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="p-2 -mr-2 text-slate-400 hover:text-white light:hover:text-navy-950 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-10">
            {/* Photos */}
            <section>
              <h3 className={`${labelCls} !mb-3`}>Photos *</h3>
              <ImageUploader
                images={images}
                onChange={setImages}
                onBusyChange={setUploading}
              />
            </section>

            {/* Details */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className={eyebrowCls}>Details</h3>
                <div>
                  <label htmlFor="pf-name" className={labelCls}>
                    Name *
                  </label>
                  <input
                    id="pf-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. MVRQ Heavy Zip Hoodie"
                    className={inputCls}
                  />
                </div>

                <div>
                  <span className={labelCls}>Category *</span>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={chipCls(category === c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="pf-desc" className={labelCls}>
                    Description
                  </label>
                  <textarea
                    id="pf-desc"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the cut, fabric weight (GSM) and fit…"
                    className={inputCls}
                  />
                </div>
              </section>

              <section className="space-y-4 pt-8 border-t border-navy-800 light:border-slate-200">
                <h3 className={eyebrowCls}>Pricing</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pf-price" className={labelCls}>
                      Price (₦) *
                    </label>
                    <input
                      id="pf-price"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="35000"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                  <div>
                    <label htmlFor="pf-orig" className={labelCls}>
                      Original price (₦)
                    </label>
                    <input
                      id="pf-orig"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="Only if on sale"
                      className={`${inputCls} font-mono`}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-8 border-t border-navy-800 light:border-slate-200">
                <h3 className={eyebrowCls}>Options</h3>

                <div>
                  <span className={labelCls}>Sizes</span>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={chipCls(sizes.includes(sz))}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="pf-colors" className={labelCls}>
                    Colours (comma separated)
                  </label>
                  <input
                    id="pf-colors"
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    placeholder="Midnight Navy, Charcoal, Black"
                    className={inputCls}
                  />
                </div>

                <div>
                  <span className={labelCls}>Badge</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setBadge(undefined)}
                      className={chipCls(!badge)}
                    >
                      None
                    </button>
                    {BADGES.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBadge(b)}
                        className={chipCls(badge === b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-amber-400"
                  />
                  <span className="text-sm text-slate-200 light:text-navy-900">
                    Available to buy (in stock)
                  </span>
                </label>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-8 py-4 border-t border-navy-800 light:border-slate-200 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p
            className="text-xs font-mono text-rose-400 min-h-[1rem]"
            role="alert"
          >
            {formError}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={`${btnGhost} flex-1 sm:flex-none`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className={`${btnPrimary} flex-1 sm:flex-none`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving
                </>
              ) : uploading ? (
                "Uploading photos…"
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Publish product"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
