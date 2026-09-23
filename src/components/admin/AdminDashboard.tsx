import React, { useState } from 'react';
import { Plus, Trash2, Edit3, LogOut, Package, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/product';
import { AddProductModal } from './AddProductModal';
import { EditProductModal } from './EditProductModal';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { products, deleteProduct, toggleStock, resetToDefault } = useProducts();
  const { formatPrice } = useCart();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-100 light:text-navy-950">
      
      {/* Top Banner / Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-800 pb-6">
        <div>
          <div className="text-xs font-mono tracking-mega text-electric-400 uppercase">
            ADMINISTRATOR CONTROLS
          </div>
          <h1 className="text-3xl font-bold tracking-tight uppercase">
            MVRQ CLOTHING DASHBOARD
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs tracking-superwide uppercase px-5 py-2.5 rounded-xl transition-all shadow-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>POST CLOTHES</span>
          </button>

          <button
            onClick={logout}
            className="bg-navy-900 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-navy-800 hover:border-rose-500/40 text-xs font-mono uppercase px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-navy-900/60 light:bg-slate-50 rounded-2xl border border-navy-800 light:border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">TOTAL ITEMS</span>
            <Package className="w-5 h-5 text-electric-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-100 light:text-navy-950 mt-2">
            {totalProducts}
          </div>
        </div>

        <div className="p-6 bg-navy-900/60 light:bg-slate-50 rounded-2xl border border-navy-800 light:border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">IN STOCK</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-2">
            {inStockCount}
          </div>
        </div>

        <div className="p-6 bg-navy-900/60 light:bg-slate-50 rounded-2xl border border-navy-800 light:border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">OUT OF STOCK</span>
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-rose-400 mt-2">
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Clothes Product Table */}
      <div className="bg-navy-900/50 light:bg-white rounded-2xl border border-navy-800 light:border-slate-200 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-navy-800 light:border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold uppercase tracking-wider">STORE INVENTORY ({products.length})</h2>
          <button
            onClick={resetToDefault}
            className="text-xs font-mono text-slate-400 hover:text-electric-400 flex items-center space-x-1"
            title="Reset to default initial products"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET TO DEFAULTS</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300 light:text-navy-900">
            <thead>
              <tr className="bg-navy-950/80 light:bg-slate-100 border-b border-navy-800 light:border-slate-300 text-electric-400 uppercase">
                <th className="py-4 px-6">CLOTHING ITEM</th>
                <th className="py-4 px-6">CATEGORY</th>
                <th className="py-4 px-6">PRICE</th>
                <th className="py-4 px-6">STOCK</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-850 light:divide-slate-200">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-navy-850/40 light:hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 flex items-center space-x-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-14 object-cover rounded-lg bg-navy-950 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-100 light:text-navy-950 font-sans text-sm">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ID: {p.id} {p.badge ? `• [${p.badge}]` : ''}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-bold text-electric-400">
                    {p.category}
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-100 light:text-navy-950">
                    {formatPrice(p.price)}
                  </td>

                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleStock(p.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        p.inStock
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {p.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                    </button>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-2 text-slate-400 hover:text-electric-400 bg-navy-950 light:bg-slate-100 rounded-lg border border-navy-800"
                      title="Edit Item"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-navy-950 light:bg-slate-100 rounded-lg border border-navy-800"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />

    </div>
  );
};
