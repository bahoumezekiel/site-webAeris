// ============================================================
// components/Navbar.tsx
// Barre de navigation fixe avec logo, liens et menu mobile
// ============================================================

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Accueil", path: "/" },
  { label: "Services", path: "/services" },
  { label: "À propos", path: "/a-propos" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo + nom de l'entreprise */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Logo Aeris Consulting"
            className="w-60 h-60 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-lg text-[#143C62] select-none">
            Aeris{" "}
            <span className="text-gray-500 font-normal" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
              Consulting
            </span>
          </span>
        </Link>

        {/* Liens de navigation desktop */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative transition-colors duration-200 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-orange-500 after:transition-all
                  ${location.pathname === link.path
                    ? "text-[#143C62] after:w-full"
                    : "hover:text-[#143C62] after:w-0 hover:after:w-full"
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Bouton CTA */}
          <li>
            <Link
              to="/contact"
              className="bg-[#143C62] text-white px-5 py-2 rounded-lg hover:bg-orange-500 transition-colors duration-300 font-medium"
            >
              Prendre RDV
            </Link>
          </li>
        </ul>

        {/* Bouton burger mobile */}
        <button
          className="md:hidden text-[#143C62] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`hover:text-[#143C62] transition-colors ${location.pathname === link.path ? "text-[#143C62] font-semibold" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
