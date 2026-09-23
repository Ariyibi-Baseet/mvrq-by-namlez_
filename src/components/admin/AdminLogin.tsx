import React, { useState } from 'react';
import { Lock, Shield, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { login, isAdminOpen, setIsAdminOpen } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isAdminOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      setError(false);
      setPassword('');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-navy-900 light:bg-white border border-navy-800 light:border-slate-300 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 light:text-navy-950">
        
        <button
          onClick={() => setIsAdminOpen(false)}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white light:text-slate-600 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4 mb-6">
          <div className="w-14 h-14 bg-electric-500/10 text-electric-400 rounded-full flex items-center justify-center mx-auto border border-electric-500/30">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-superwide uppercase">ADMIN PORTAL</h2>
          <p className="text-xs font-mono text-slate-400 light:text-slate-600">
            Enter authorized access key to manage products & inventory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Admin Password Key
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password (default: admin)"
                className="w-full bg-navy-950 light:bg-slate-50 border border-navy-800 light:border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
              />
            </div>
            {error && (
              <p className="text-[11px] text-rose-400 font-mono mt-1">
                Invalid access key. Try 'admin' or 'mvrq2026'.
              </p>
            )}
          </div>

          <div className="p-3 bg-navy-950/40 rounded-xl border border-navy-850 text-[11px] font-mono text-slate-400">
            <span className="text-electric-400 font-bold">DEFAULT CREDENTIALS:</span> Password is <code className="text-white bg-navy-800 px-1 py-0.5 rounded">admin</code>
          </div>

          <button
            type="submit"
            className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs tracking-superwide uppercase py-3.5 rounded-xl transition-all shadow-lg shadow-electric-500/25 flex items-center justify-center space-x-2"
          >
            <span>AUTHENTICATE & ACCESS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
