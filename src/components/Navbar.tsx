// ============================================================
// components/Navbar.tsx
// Barre de navigation fixe — responsive mobile + desktop
// ============================================================

import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();


  // Légère ombre supplémentaire après scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={logo}
            alt="Logo Aeris Consulting"
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* ── Liens desktop ── */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative transition-colors duration-200
                  after:content-[''] after:absolute after:-bottom-1 after:left-0
                  after:h-0.5 after:bg-orange-500 after:transition-all
                  ${
                    location.pathname === link.path
                      ? "text-[#143C62] after:w-full"
                      : "hover:text-[#143C62] after:w-0 hover:after:w-full"
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Bouton CTA desktop */}
          <li>
            <Link
              to="/contact"
              className="bg-[#143C62] text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors duration-300 font-medium whitespace-nowrap"
            >
              Prendre RDV
            </Link>
          </li>
        </ul>

        {/* ── Burger mobile ── */}
        <button
          className="md:hidden text-[#143C62] p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="w-6 h-6 transition-transform duration-200"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ── Menu mobile déroulant ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-[#143C62]/8 text-[#143C62] font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#143C62]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Bouton CTA mobile */}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-[#143C62] hover:bg-orange-500 text-white font-semibold text-sm text-center px-4 py-3 rounded-xl transition-colors duration-300"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </div>
    </nav>
  );
}