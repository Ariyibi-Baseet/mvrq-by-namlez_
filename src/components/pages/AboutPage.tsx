import React from 'react';
import { Shield, Sparkles, Feather } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 animate-fade-in text-slate-100 light:text-navy-950">
      
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="text-xs font-mono tracking-mega text-electric-400 uppercase">
          THE BRAND ORIGIN
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight uppercase">
          ABOUT MVRQ BY NAMLEZ
        </h1>
        <p className="text-sm font-mono tracking-superwide text-slate-400 uppercase max-w-lg mx-auto">
          Timeless Pieces. Modern Essence. Designed in Lagos.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="bg-navy-900/40 light:bg-slate-50 p-8 sm:p-12 rounded-3xl border border-navy-800 light:border-slate-300 space-y-6 text-slate-300 light:text-slate-700 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-100 light:text-navy-950">
          The Craft & Philosophy
        </h2>
        <p className="text-base font-light">
          Founded in Lagos, <strong className="text-electric-400 font-semibold">MVRQ by naMLez</strong> was established to redefine contemporary African streetwear for a global audience. We reject fast fashion trends and loud, ephemeral logos in favor of architectural silhouettes, premium cotton weights, and precision tailoring.
        </p>
        <p className="text-base font-light">
          Every garment begins as an architectural pattern draft in our Lagos design studio. We work exclusively with high-density combed cottons, durable technical weaves, and custom metal hardware.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-navy-900/60 light:bg-white rounded-2xl border border-navy-800 light:border-slate-200 space-y-3">
          <Feather className="w-8 h-8 text-electric-400" />
          <h3 className="font-bold text-lg text-slate-100 light:text-navy-950">
            Uncompromising Weight
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 font-mono">
            Heavyweight fabrics from 280GSM to 450GSM ensuring ideal drape, structural warmth, and lifetime durability.
          </p>
        </div>

        <div className="p-6 bg-navy-900/60 light:bg-white rounded-2xl border border-navy-800 light:border-slate-200 space-y-3">
          <Sparkles className="w-8 h-8 text-electric-400" />
          <h3 className="font-bold text-lg text-slate-100 light:text-navy-950">
            Minimalist Restraint
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 font-mono">
            Subtle tonal embroideries, raw edge seams, and concealed closures created for subtle sophistication.
          </p>
        </div>

        <div className="p-6 bg-navy-900/60 light:bg-white rounded-2xl border border-navy-800 light:border-slate-200 space-y-3">
          <Shield className="w-8 h-8 text-electric-400" />
          <h3 className="font-bold text-lg text-slate-100 light:text-navy-950">
            Lagos Heritage
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 font-mono">
            Direct homage to Lagos energy, hustle, and quiet luxury movement sweeping across global capitals.
          </p>
        </div>
      </div>

    </div>
  );
};
