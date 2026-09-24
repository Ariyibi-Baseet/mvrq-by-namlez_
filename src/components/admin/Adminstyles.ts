// Shared class strings so every admin screen looks the same.
// Style: sharp edges, thin borders, mono labels, white primary button (matches the storefront).

export const inputCls =
  "w-full bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 px-3.5 py-2.5 text-sm text-slate-100 light:text-navy-950 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none transition-colors disabled:opacity-50";

export const labelCls =
  "block text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 light:text-slate-500 mb-1.5";

export const eyebrowCls =
  "text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400 light:text-slate-500";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 bg-white light:bg-navy-950 text-navy-950 light:text-white hover:bg-amber-400 light:hover:bg-amber-500 light:hover:text-navy-950 px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50 disabled:pointer-events-none";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 border border-navy-800 light:border-slate-300 text-slate-300 light:text-navy-900 hover:border-slate-400 hover:text-white light:hover:text-navy-950 px-5 py-3 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors disabled:opacity-50 disabled:pointer-events-none";

export const btnDanger =
  "inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 text-[11px] font-mono font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50 disabled:pointer-events-none";

export const chipCls = (active: boolean) =>
  `px-3.5 py-2 text-[11px] font-mono uppercase tracking-[0.15em] border transition-colors ${
    active
      ? "bg-white text-navy-950 border-white light:bg-navy-950 light:text-white light:border-navy-950"
      : "border-navy-800 light:border-slate-300 text-slate-300 light:text-navy-800 hover:border-slate-500"
  }`;
