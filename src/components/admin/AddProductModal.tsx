import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Category } from '../../types/product';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useProducts();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'ALL'>>('TOPS');
  const [price, setPrice] = useState<string>('');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState<'SALE' | 'NEW' | 'SOLD OUT' | 'PRE-ORDER' | undefined>(undefined);
  const [inStock, setInStock] = useState(true);
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<string>('Midnight Navy, Black');

  if (!isOpen) return null;

  // Preset Luxury Streetwear Photos for quick selection
  const presetImages = [
    { label: 'Hoodie / Jacket', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000' },
    { label: 'Heavy Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000' },
    { label: 'Cargo Pants', url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1000' },
    { label: 'Tracksuit', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000' },
  ];

  const toggleSize = (size: string) => {
    setSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !image) return;

    addProduct({
      name,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      badge: badge || undefined,
      inStock,
      image,
      description: description || 'Heavyweight luxury cotton garment designed by MVRQ naMLez.',
      sizes: sizes.length > 0 ? sizes : ['M', 'L'],
      colors: colors.split(',').map(c => c.trim()).filter(Boolean),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 light:bg-white border border-navy-800 light:border-slate-300 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-100 light:text-navy-950">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-navy-800 pb-4 mb-6">
          <h2 className="text-xl font-bold tracking-mega uppercase flex items-center space-x-2">
            <Plus className="w-5 h-5 text-electric-400" />
            <span>POST NEW CLOTHING ITEM</span>
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Added clothes will instantly appear in the live MVRQ store catalog.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Item Title / Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. MVRQ Heavy Zip Hoodie"
                className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
              >
                <option value="TOPS">TOPS</option>
                <option value="BOTTOMS">BOTTOMS</option>
                <option value="OUTERWEAR">OUTERWEAR</option>
                <option value="SETS">SETS</option>
                <option value="ACCESSORIES">ACCESSORIES</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Price (NGN ₦) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 35000"
                className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Original Price (Optional)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                placeholder="e.g. 42000 (if on sale)"
                className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Image URL & Presets */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none font-mono mb-2"
            />
            
            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
              <ImageIcon className="w-3.5 h-3.5 text-electric-400" />
              <span>Or click preset luxury photoshoot sample:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {presetImages.map(img => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setImage(img.url)}
                  className="px-2.5 py-1 bg-navy-950 light:bg-slate-100 border border-navy-800 text-[10px] font-mono text-slate-300 hover:text-electric-400 rounded-md"
                >
                  + {img.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Description & Fabric Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the cut, GSM cotton weight, fit..."
              className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Colorways (Comma Separated)
            </label>
            <input
              type="text"
              value={colors}
              onChange={e => setColors(e.target.value)}
              placeholder="e.g. Midnight Navy, Charcoal, Black"
              className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none font-mono"
            />
          </div>

          {/* Sizes Selection */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', 'ONE SIZE'].map(sz => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                    sizes.includes(sz)
                      ? 'bg-electric-600 text-white border-electric-400 font-bold'
                      : 'bg-navy-950 text-slate-400 border-navy-800'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Badge Tag
              </label>
              <select
                value={badge || ''}
                onChange={e => setBadge(e.target.value as any || undefined)}
                className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
              >
                <option value="">None</option>
                <option value="SALE">SALE</option>
                <option value="NEW">NEW</option>
                <option value="PRE-ORDER">PRE-ORDER</option>
                <option value="SOLD OUT">SOLD OUT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Stock Status
              </label>
              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={e => setInStock(e.target.checked)}
                    className="w-4 h-4 rounded accent-electric-500"
                  />
                  <span>Product In Stock</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs tracking-superwide uppercase py-4 rounded-xl transition-all shadow-lg shadow-electric-500/25"
            >
              POST ITEM TO STORE
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
