import React from "react";

/** Full-screen overlay shown while the admin is being signed out. */
export const SignOutLoader: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-navy-950 light:bg-white animate-fade-in"
  >
    <div className="w-10 h-10 rounded-full border border-navy-800 light:border-slate-200 border-t-amber-400 animate-spin" />
    <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-slate-400">
      Signing out
    </p>
  </div>
);
