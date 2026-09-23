import React from 'react';
import { Sparkles } from 'lucide-react';

export const TopBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-navy-900 via-electric-700 to-navy-900 text-slate-100 text-xs tracking-superwide font-mono py-2 px-4 text-center border-b border-electric-500/20 shadow-lg relative z-50 flex items-center justify-center gap-2">
      <Sparkles className="w-3.5 h-3.5 text-electric-400 animate-pulse" />
      <span>PRE-ORDER ONLY &nbsp;|&nbsp; LAUNCHING 20 OCTOBER 2026</span>
      <Sparkles className="w-3.5 h-3.5 text-electric-400 animate-pulse" />
    </div>
  );
};
