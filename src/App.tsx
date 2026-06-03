// ============================================================
// App.tsx
// Routeur principal de l'application Aeris Consulting
// Déclare les routes et importe les pages + composants partagés
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AccueilPage from "./pages/AccueilPage";
import ServicesPage from "./pages/ServicesPage";
import AProposPage from "./pages/AProposPage";

// Pages à venir (décommenter au fur et à mesure)
// import ServicesPage from "./pages/ServicesPage";
// import AProposPage from "./pages/AProposPage";
// import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navigation fixe partagée sur toutes les pages */}
      <Navbar />

      {/* Contenu des pages selon la route active */}
      <Routes>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/a-propos" element={<AProposPage />} />

        {/* Routes à activer progressivement */}
        {/* <Route path="/services" element={<ServicesPage />} /> */}
        {/* <Route path="/a-propos" element={<AProposPage />} /> */}
        {/* <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>

      {/* Footer partagé sur toutes les pages */}
      <Footer />
    </BrowserRouter>
  );
}
