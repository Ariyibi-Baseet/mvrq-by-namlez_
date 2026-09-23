import React from 'react';

export const SizingPage: React.FC = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 animate-fade-in text-slate-100 light:text-navy-950">
      <div className="text-center space-y-3">
        <div className="text-xs font-mono tracking-mega text-electric-400 uppercase">
          FIT MATRIX
        </div>
        <h1 className="text-4xl font-bold tracking-tight uppercase">
          SIZING & FIT GUIDE
        </h1>
        <p className="text-xs font-mono text-slate-400">
          All MVRQ garments are engineered with an intentionally relaxed, boxy street silhouette.
        </p>
      </div>

      {/* Tops Measurement Table */}
      <div className="bg-navy-900/60 light:bg-slate-50 p-6 rounded-2xl border border-navy-800 light:border-slate-300 space-y-4">
        <h2 className="text-lg font-bold text-electric-400 font-mono">
          TOPS & HOODIES (INCHES)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-slate-300 light:text-navy-900">
            <thead>
              <tr className="border-b border-navy-800 light:border-slate-300 text-electric-400">
                <th className="py-3 px-4">SIZE</th>
                <th className="py-3 px-4">CHEST</th>
                <th className="py-3 px-4">LENGTH</th>
                <th className="py-3 px-4">SHOULDER</th>
                <th className="py-3 px-4">SLEEVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-850 light:divide-slate-200">
              <tr>
                <td className="py-3 px-4 font-bold text-white light:text-navy-950">SMALL (S)</td>
                <td className="py-3 px-4">42"</td>
                <td className="py-3 px-4">28"</td>
                <td className="py-3 px-4">20"</td>
                <td className="py-3 px-4">9.5"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white light:text-navy-950">MEDIUM (M)</td>
                <td className="py-3 px-4">44"</td>
                <td className="py-3 px-4">29"</td>
                <td className="py-3 px-4">21"</td>
                <td className="py-3 px-4">10"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white light:text-navy-950">LARGE (L)</td>
                <td className="py-3 px-4">47"</td>
                <td className="py-3 px-4">30"</td>
                <td className="py-3 px-4">22.5"</td>
                <td className="py-3 px-4">10.5"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white light:text-navy-950">XLARGE (XL)</td>
                <td className="py-3 px-4">50"</td>
                <td className="py-3 px-4">31"</td>
                <td className="py-3 px-4">24"</td>
                <td className="py-3 px-4">11"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fit Recommendation */}
      <div className="p-6 bg-navy-950 light:bg-white rounded-2xl border border-navy-800 light:border-slate-200 space-y-2 text-xs font-mono text-slate-400">
        <div className="text-electric-400 font-bold uppercase">FIT TIP:</div>
        <p>
          If you prefer a true-to-size oversized streetwear fit, choose your standard size. For a more tailored appearance, select one size down.
        </p>
      </div>

    </div>
  );
};
