import React from "react";
import { useAuth } from "../../context/AuthContext";

interface FooterProps {
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

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { setIsAdminOpen } = useAuth();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-navy-800/80 light:border-slate-300 mt-16 bg-navy-950 light:bg-slate-100 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-16">
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* <div className="w-5 h-5 rotate-45 border-2 border-amber-400 bg-amber-400/20 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 bg-amber-400" />
            </div> */}
            <LogoMark />
            <span className="hidden min-[400px]:inline font-serif text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] md:tracking-[0.22em] text-white light:text-navy-950 whitespace-nowrap">
              M.V.R.Q
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 font-medium text-sm tracking-wider">
            <button
              onClick={() => handleLinkClick("shop")}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => handleLinkClick("about")}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleLinkClick("sizing")}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              Sizing Guide
            </button>
            <button
              onClick={() => handleLinkClick("returns")}
              className="text-slate-400 hover:text-white light:text-slate-600 light:hover:text-navy-950 transition-colors"
            >
              Returns
            </button>
            <button
              onClick={() => handleLinkClick("contact")}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
            </a>
            <a
              href="https://twitter.com/mvrq_namlezz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-electric-400 transition-colors"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-twitter-x"
                viewBox="0 0 16 16"
              >
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
            </a>
            <a
              href="https://wa.me/2348139419905"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-electric-400 transition-colors"
              aria-label="WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-whatsapp"
                viewBox="0 0 16 16"
              >
                <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="mt-8 pt-8 border-t border-navy-900 light:border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono text-slate-500 light:text-slate-600">
          <p>© {currentYear} MVRQ by naMLez. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <button
              onClick={() => handleLinkClick("returns")}
              className="hover:text-slate-300"
            >
              Privacy
            </button>
            <button
              onClick={() => handleLinkClick("returns")}
              className="hover:text-slate-300"
            >
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
