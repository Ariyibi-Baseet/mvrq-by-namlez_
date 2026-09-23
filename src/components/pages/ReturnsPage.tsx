import React from 'react';
import { RefreshCw, Truck } from 'lucide-react';

export const ReturnsPage: React.FC = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 animate-fade-in text-slate-100 light:text-navy-950">
      <div className="text-center space-y-3">
        <div className="text-xs font-mono tracking-mega text-electric-400 uppercase">
          CLIENT CARE
        </div>
        <h1 className="text-4xl font-bold tracking-tight uppercase">
          RETURNS & SHIPPING POLICY
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Clear, transparent policies for every MVRQ piece.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-navy-900/60 light:bg-slate-50 rounded-2xl border border-navy-800 light:border-slate-300 space-y-4">
          <RefreshCw className="w-8 h-8 text-electric-400" />
          <h2 className="text-xl font-bold">7-Day Exchange Guarantee</h2>
          <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed font-light">
            If your garment does not fit as expected, we offer a complimentary exchange within 7 days of delivery. Items must be unworn, unwashed, with all original MVRQ tags attached.
          </p>
        </div>

        <div className="p-8 bg-navy-900/60 light:bg-slate-50 rounded-2xl border border-navy-800 light:border-slate-300 space-y-4">
          <Truck className="w-8 h-8 text-electric-400" />
          <h2 className="text-xl font-bold">Nationwide & Global Courier</h2>
          <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed font-light">
            Lagos orders are dispatched via door-to-door courier within 24-48 hours. Orders across other Nigerian states arrive in 2-4 business days. International orders are handled by DHL Express.
          </p>
        </div>
      </div>
    </div>
  );
};
