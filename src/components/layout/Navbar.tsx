import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Lock,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/** Gold quilted diamond: one large diamond split into four smaller ones. */
const LogoMark: React.FC = () => (
  <svg
    viewBox="0 0 32 32"
    className="w-7 h-7 sm:w-[34px] sm:h-[34px] shrink-0 transition-transform duration-300 group-hover:scale-110"
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id="mvrq-gold"
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
        fill="url(#mvrq-gold)"
      />
    ))}
  </svg>
);

// Icon size scales up from phone to desktop
const ICON = "w-5 h-5 sm:w-[22px] sm:h-[22px]";

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { totalItems, setIsCartOpen } = useCart();
  const { setIsAdminOpen, isAdminAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "shop", label: "Shop" },
    { id: "about", label: "About" },
    { id: "sizing", label: "Sizing Guide" },
    { id: "returns", label: "Returns" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close the menu with the Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  // 40px touch targets on phones, 44px from `sm` up
  const iconBtn =
    "w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-white light:text-navy-950 hover:text-amber-400 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400";

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] light:bg-white border-b border-transparent light:border-slate-200 transition-colors duration-300">
      {/* 3-column grid: left | logo | right. The logo is always truly centered
          and can never overlap the icons, whatever the screen width. */}
      <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center h-14 sm:h-16 md:h-20 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))] md:pl-[max(3rem,env(safe-area-inset-left))] md:pr-[max(3rem,env(safe-area-inset-right))]">
        {/* Left: Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`${iconBtn} justify-self-start`}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          )}
        </button>

        {/* Center: Logo mark + wordmark.
            Under 400px wide only the mark shows, so it fits beside the icons. */}
        <button
          onClick={() => handleNavClick("shop")}
          className="flex items-center gap-2 sm:gap-3 focus:outline-none group"
          aria-label="M.V.R.Q home"
        >
          <LogoMark />
          <span className="hidden min-[400px]:inline font-serif text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] md:tracking-[0.22em] text-white light:text-navy-950 whitespace-nowrap">
            M.V.R.Q
          </span>
        </button>

        {/* Right: Search, Account, Cart */}
        <div className="flex items-center justify-self-end gap-0 sm:gap-2 md:gap-4">
          <button
            onClick={() => handleNavClick("shop")}
            className={iconBtn}
            title="Search Products"
            aria-label="Search products"
          >
            <Search className={ICON} strokeWidth={1.5} />
          </button>

          <button
            onClick={() => setIsAdminOpen(true)}
            className={`${iconBtn} ${isAdminAuthenticated ? "!text-amber-400" : ""}`}
            title="Admin Login / Account"
            aria-label="Account"
          >
            {isAdminAuthenticated ? (
              <Lock className={ICON} strokeWidth={1.5} />
            ) : (
              <User className={ICON} strokeWidth={1.5} />
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className={`${iconBtn} relative`}
            aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
          >
            <ShoppingBag className={ICON} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0 sm:top-1 sm:right-0.5 bg-amber-400 text-black font-mono font-bold text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Menu drawer. Scrolls internally if it's taller than a small screen. */}
      {mobileMenuOpen && (
        <div className="bg-[#0a0a0a] light:bg-white border-t border-white/10 light:border-slate-200 px-4 sm:px-6 md:px-12 py-4 sm:py-6 animate-fade-in shadow-2xl overflow-y-auto max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-5rem)]">
          <nav className="flex flex-col space-y-1 font-mono text-sm tracking-wider uppercase">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-3 px-3 transition-colors ${
                  activeTab === item.id
                    ? "text-amber-400 font-bold"
                    : "text-slate-300 light:text-navy-900 hover:text-amber-400"
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="text-left py-3 px-3 flex items-center gap-3 text-slate-300 light:text-navy-900 hover:text-amber-400 transition-colors border-t border-white/10 light:border-slate-200 mt-2 pt-4"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Moon className="w-4 h-4" strokeWidth={1.5} />
              )}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
