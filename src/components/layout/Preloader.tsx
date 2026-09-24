import React, { useEffect, useState } from "react";

/**
 * Full-screen preloader shown while the app's first data is loading
 * (Firebase auth state, initial product fetch, fonts, etc).
 *
 * Usage in App.tsx:
 *
 *   const [appReady, setAppReady] = useState(false);
 *   const { authLoading } = useAuth();
 *   const { loading: productsLoading } = useProducts();
 *
 *   useEffect(() => {
 *     if (!authLoading && !productsLoading) setAppReady(true);
 *   }, [authLoading, productsLoading]);
 *
 *   return (
 *     <>
 *       <Preloader ready={appReady} />
 *       {appReady && <YourRealApp />}
 *     </>
 *   );
 *
 * `ready` controls the fade-out; the component unmounts itself once the
 * fade finishes, so nothing needs to conditionally render it.
 */

const FADE_MS = 600;

interface PreloaderProps {
  ready: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ ready }) => {
  const [mounted, setMounted] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setFading(true);
    const t = setTimeout(() => setMounted(false), FADE_MS);
    return () => clearTimeout(t);
  }, [ready]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading MVRQ"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] transition-opacity ease-out"
      style={{
        opacity: fading ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes mvrq-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(0.82); opacity: 0.55; }
        }
        @keyframes mvrq-ring {
          0%   { transform: scale(0.7); opacity: 0.5; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes mvrq-bar {
          0%   { transform: scaleX(0); transform-origin: left; }
          50%  { transform: scaleX(1); transform-origin: left; }
          50.1%{ transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mvrq-preloader-mark, .mvrq-preloader-ring, .mvrq-preloader-bar-fill { animation: none !important; }
        }
      `}</style>

      {/* Logo mark: quilted diamond, matching the navbar */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        {/* Expanding ring pulse behind the mark */}
        <span
          className="mvrq-preloader-ring absolute inset-0 rounded-full border border-amber-400/50"
          style={{ animation: "mvrq-ring 2.2s ease-out infinite" }}
        />
        <svg
          viewBox="0 0 32 32"
          className="mvrq-preloader-mark relative w-full h-full"
          style={{ animation: "mvrq-pulse 1.8s ease-in-out infinite" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="mvrq-preloader-gold"
              x1="0"
              y1="0"
              x2="32"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#F0CB8A" />
              <stop offset="0.5" stopColor="#C98F4A" />
              <stop offset="1" stopColor="#8F5A26" />
            </linearGradient>
          </defs>
          {[
            [16, 8.5],
            [8.5, 16],
            [23.5, 16],
            [16, 23.5],
          ].map(([cx, cy]) => (
            <polygon
              key={`${cx}-${cy}`}
              points={`${cx},${cy - 6.6} ${cx + 6.6},${cy} ${cx},${cy + 6.6} ${cx - 6.6},${cy}`}
              fill="url(#mvrq-preloader-gold)"
            />
          ))}
        </svg>
      </div>

      {/* Wordmark */}
      <p className="mt-7 font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.3em] text-white">
        M.V.R.Q
      </p>
      <p className="mt-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.35em] text-slate-500">
        Timeless pieces. Modern essence.
      </p>

      {/* Progress bar */}
      <div className="mt-8 w-40 sm:w-48 h-px bg-white/10 overflow-hidden">
        <div
          className="mvrq-preloader-bar-fill h-full bg-amber-400"
          style={{ animation: "mvrq-bar 1.6s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
};
