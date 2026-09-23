import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product, Category } from '../../types/product';

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose }) => {
  const { updateProduct } = useProducts();

  if (!product) return null;

  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState<Exclude<Category, 'ALL'>>(product.category);
  const [price, setPrice] = useState<string>(product.price.toString());
  const [originalPrice, setOriginalPrice] = useState<string>(
    product.originalPrice ? product.originalPrice.toString() : ''
  );
  const [image, setImage] = useState(product.image);
  const [description, setDescription] = useState(product.description);
  const [badge, setBadge] = useState(product.badge);
  const [inStock, setInStock] = useState(product.inStock);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, {
      name,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      badge: badge || undefined,
      inStock,
      image,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 light:bg-white border border-navy-800 light:border-slate-300 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-100 light:text-navy-950">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-navy-800 pb-4 mb-6">
          <h2 className="text-xl font-bold tracking-mega uppercase flex items-center space-x-2">
            <Save className="w-5 h-5 text-electric-400" />
            <span>EDIT CLOTHING ITEM</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 light:text-navy-950"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 light:text-navy-950"
            >
              <option value="TOPS">TOPS</option>
              <option value="BOTTOMS">BOTTOMS</option>
              <option value="OUTERWEAR">OUTERWEAR</option>
              <option value="SETS">SETS</option>
              <option value="ACCESSORIES">ACCESSORIES</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Price (₦)</label>
              <input
                type="number"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 light:text-navy-950"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Original Price (₦)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 light:text-navy-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Badge Tag</label>
            <select
              value={badge || ''}
              onChange={e => setBadge(e.target.value as any || undefined)}
              className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 light:text-navy-950"
            >
              <option value="">None</option>
              <option value="SALE">SALE</option>
              <option value="NEW">NEW</option>
              <option value="PRE-ORDER">PRE-ORDER</option>
              <option value="SOLD OUT">SOLD OUT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 light:text-navy-950"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Image URL</label>
            <input
              type="url"
              required
              value={image}
              onChange={e => setImage(e.target.value)}
              className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 light:text-navy-950"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Stock Status</label>
            <label className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <input
                type="checkbox"
                checked={inStock}
                onChange={e => setInStock(e.target.checked)}
                className="w-4 h-4 rounded accent-electric-500"
              />
              <span>In Stock</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs tracking-superwide uppercase py-3.5 rounded-xl shadow-lg"
          >
            UPDATE PRODUCT
          </button>
        </form>

      </div>
    </div>
  );
};
