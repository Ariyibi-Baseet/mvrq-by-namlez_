import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { setIsAdminOpen } = useAuth();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-navy-800/80 light:border-slate-300 mt-16 bg-navy-950 light:bg-slate-100 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-16">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rotate-45 border-2 border-amber-400 bg-amber-400/20 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 bg-amber-400" />
            </div>
            <span className="font-serif text-base tracking-[0.2em] uppercase text-slate-100 light:text-navy-950">
              M . V . R . Q
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 font-medium text-sm tracking-wider">
            <button
              onClick={() => handleLinkClick('shop')}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => handleLinkClick('about')}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleLinkClick('sizing')}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              Sizing Guide
            </button>
            <button
              onClick={() => handleLinkClick('returns')}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              Returns
            </button>
            <button
              onClick={() => handleLinkClick('contact')}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-5 font-mono text-sm tracking-wider text-slate-400 font-medium">
            <a
              href="https://instagram.com/mvrq_namlezz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-electric-400 transition-colors"
              aria-label="Instagram"
            >
              IG
            </a>
            <a
              href="https://twitter.com/mvrq_namlezz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-electric-400 transition-colors"
              aria-label="Twitter"
            >
              TW
            </a>
            <a
              href="https://wa.me/2348139419905"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-electric-400 transition-colors"
              aria-label="WhatsApp"
            >
              WA
            </a>
          </div>

        </div>

        {/* Bottom Footer Row */}
        <div className="mt-8 pt-8 border-t border-navy-900 light:border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono text-slate-500 light:text-slate-600">
          <p>© {currentYear} MVRQ by naMLez. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <button onClick={() => handleLinkClick('returns')} className="hover:text-slate-300">
              Privacy
            </button>
            <button onClick={() => handleLinkClick('returns')} className="hover:text-slate-300">
              Terms
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-slate-500 hover:text-electric-400 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
