// ============================================================
// components/Footer.tsx
// Pied de page avec navigation, services et contact
// ============================================================

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Colonne marque */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#143C62] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                  <path d="M6 26 L16 6 L26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 20 L22 20" stroke="#E05A1B" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="16" cy="6" r="2" fill="#E05A1B" />
                </svg>
              </div>
              <span className="font-display text-[#143C62] text-base">
                Aeris{" "}
                <span className="text-gray-500 font-normal" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                  Consulting
                </span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Votre partenaire en robotique, systèmes embarqués, automatisme et prototypage 3D.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: "Accueil", path: "/" },
                { label: "Services", path: "/services" },
                { label: "À propos", path: "/a-propos" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-500 hover:text-[#143C62] text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Services</h4>
            <ul className="space-y-3">
              {["Robotique", "Systèmes embarqués", "Impression 3D", "Domotique"].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-gray-500 hover:text-[#143C62] text-sm transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-orange-500 shrink-0">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@aeris-consulting.fr
              </li>
              <li className="flex items-center gap-2 text-gray-500 text-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-orange-500 shrink-0">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +226 67 42 83 16
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">© 2026 Aeris Consulting. Tous droits réservés.</p>
          <p className="text-gray-400 text-sm">Conçu avec précision par l'équipe Aeris</p>
        </div>
      </div>
    </footer>
  );
}
