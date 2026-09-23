import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, Sun, Moon, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { totalItems, setIsCartOpen } = useCart();
  const { setIsAdminOpen, isAdminAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
    { id: 'sizing', label: 'Sizing Guide' },
    { id: 'returns', label: 'Returns' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 light:bg-white/95 backdrop-blur-md border-b border-navy-800/80 light:border-slate-200 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between relative">
        
        {/* Left: Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-11 h-11 flex items-center justify-center text-slate-100 light:text-navy-950 hover:text-electric-400 transition-colors focus:outline-none"
          aria-label="Open menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Center: Brand Logo (Golden Diamond Icon + M.V.R.Q) */}
        <button
          onClick={() => handleNavClick('shop')}
          className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2 focus:outline-none group"
        >
          {/* Golden Diamond Logo Icon */}
          <div className="w-6 h-6 rotate-45 border-2 border-amber-400 bg-amber-400/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <div className="w-2 h-2 bg-amber-400" />
          </div>
          <span className="font-serif text-lg tracking-[0.25em] font-semibold uppercase text-slate-100 light:text-navy-950 group-hover:text-electric-400 transition-colors">
            M . V . R . Q
          </span>
        </button>

        {/* Right Action Icons (Search, Account, Theme Toggle, Admin, Cart) */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Search Trigger */}
          <button
            onClick={() => handleNavClick('shop')}
            className="w-10 h-10 flex items-center justify-center text-slate-300 light:text-navy-800 hover:text-electric-400 transition-colors"
            title="Search Products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account / Admin Trigger */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${
              isAdminAuthenticated
                ? 'text-amber-400'
                : 'text-slate-300 light:text-navy-800 hover:text-electric-400'
            }`}
            title="Admin Login / Account"
          >
            {isAdminAuthenticated ? <Lock className="w-5 h-5 text-amber-400" /> : <User className="w-5 h-5" />}
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center text-slate-300 light:text-navy-800 hover:text-electric-400 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-navy-900" />}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-slate-100 light:text-navy-950 hover:text-electric-400 relative transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-electric-500 text-white font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="bg-navy-950/98 light:bg-white border-b border-navy-800 light:border-slate-200 px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          <nav className="flex flex-col space-y-3 font-mono text-sm tracking-wider uppercase">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-2 px-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-electric-500/20 text-electric-400 font-bold'
                    : 'text-slate-300 light:text-navy-900 hover:bg-navy-900 light:hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
