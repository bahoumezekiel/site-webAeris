// ============================================================
// pages/AccueilPage.tsx
// Hero avec carousel à défilement (slide) + Services + À propos + Galerie + CTA
// ============================================================

import { Link } from "react-router-dom"; // permet de naviguer sans recharger la page
import { useState, useEffect, useCallback } from "react";
import { useInView } from "../hooks/useInView";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";

/** Tableau d'object contenant les urls et labels des slides du carousel hero */
const heroSlides = [
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80", label: "Systèmes embarqués" },
  { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80", label: "Robotique" },
  { src: "https://images.unsplash.com/photo-1581091877018-dac6a371d50f?w=1920&q=80", label: "Automatique" },
  { src: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=1920&q=80", label: "Impression 3D" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80", label: "Domotique" },
];

/**tableau d'object contenant les urls et labels des images de la galerie chaque image a un label et une catégorie pour le filtrage */
const galleryImages = [
  { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", label: "Robotique industrielle", category: "Robotique" },
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", label: "Systèmes embarqués", category: "Embarqué" },
  { src: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80", label: "Automatisation", category: "Automatique" },
  { src: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80", label: "Impression 3D", category: "3D" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", label: "Domotique connectée", category: "Domotique" },
  { src: "https://images.unsplash.com/photo-1581082174218-59b33e8e0d28?w=800&q=80", label: "Prototypage", category: "Prototypage" },
];

// ============================================================
// Composant : Galerie avec filtres et lightbox
// ============================================================
function GallerySection() {
  const { ref, inView } = useInView();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("Tous"); // stocke quel categorie est sélectionnée pour le filtrage

  const filters = ["Tous", "Robotique", "Embarqué", "Automatique", "3D", "Domotique", "Prototypage"];
  const filtered =
    activeFilter === "Tous"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter);

  const closeLightbox = () => setLightboxIndex(null);

  //va a l'image précédente ou suivante dans la lightbox en fonction de la touche appuyée
  const prevImage = useCallback(() => {
    setLightboxIndex((p) => (p !== null ? (p - 1 + filtered.length) % filtered.length : 0));
  }, [filtered.length]);

  // va a l'image suivante 
  const nextImage = useCallback(() => {
    setLightboxIndex((p) => (p !== null ? (p + 1) % filtered.length : 0));
  }, [filtered.length]);

  // Ajoute des écouteurs de clavier pour naviguer dans la lightbox et la fermer avec Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prevImage, nextImage]);

  return (
    <section className="py-24 bg-[#0b1f35]">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className="text-center mb-12"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">Notre univers</span>
          <h2
            className="text-4xl md:text-5xl text-white mt-3 mb-4 leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
          >
            Explorez notre galerie
            <br />
            <span className="text-orange-400">de réalisations</span>
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto">Un aperçu de nos projets et domaines d'expertise</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === f
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((img, i) => (
            <div
              key={img.src}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${i === 0 ? "md:row-span-2" : ""}`}
              style={{
                aspectRatio: i === 0 ? "3/4" : "4/3",
                opacity: inView ? 1 : 0,
                transform: inView ? "scale(1)" : "scale(0.95)",
                transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
              }}
              onClick={() => setLightboxIndex(i)}
            >
              <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-1">{img.category}</span>
                <p className="text-white font-semibold text-sm">{img.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <img src={filtered[lightboxIndex].src} alt={filtered[lightboxIndex].label} className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="text-center mt-4">
              <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full mr-2">{filtered[lightboxIndex].category}</span>
              <span className="text-white/80 text-sm">{filtered[lightboxIndex].label}</span>
            </div>
            <p className="text-white/40 text-xs text-center mt-2">{lightboxIndex + 1} / {filtered.length}</p>
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200" onClick={prevImage}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200" onClick={nextImage}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path d="M9 5l7 7-7 7" /></svg>
            </button>
            <button className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-200" onClick={closeLightbox}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
              {filtered.map((img, idx) => (
                <button key={img.src} onClick={() => setLightboxIndex(idx)}
                  className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${idx === lightboxIndex ? "border-orange-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================================
// Composant principal : page Accueil
// ============================================================
export default function AccueilPage() {
  const { ref: servicesRef, inView: servicesInView } = useInView();
  const { ref: aboutTextRef, inView: aboutInView } = useInView();
  const { ref: ctaRef, inView: ctaInView } = useInView();

  // ── État carousel hero ───────────────────────────────────
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  // ✅ FIX: useState au lieu de useRef — prevSlide est lu dans le JSX (rendu)
  // donc un ref est interdit par react-hooks/refs. useState donne le bon re-render.
  const [prevSlide, setPrevSlide] = useState(0);

  // ✅ goToSlide avec useCallback, déclaré avant le useEffect
  const goToSlide = useCallback(
    (index: number, dir: "left" | "right" = "left") => {
      if (sliding || index === currentSlide) return;
      setDirection(dir);
      setSliding(true);
      setPrevSlide(currentSlide);
      setTimeout(() => {
        setCurrentSlide(index);
        setSliding(false);
      }, 600);
    },
    [sliding, currentSlide]
  );

  // Avance automatique toutes les 5s
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length, "left");
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, goToSlide]);

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Keyframes des animations de défilement */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0); }
          to   { transform: translateX(100%); }
        }
        .slide-enter-left  { animation: slideInFromRight 0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
        .slide-enter-right { animation: slideInFromLeft  0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
        .slide-exit-left   { animation: slideOutToLeft   0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
        .slide-exit-right  { animation: slideOutToRight  0.6s cubic-bezier(0.4,0,0.2,1) forwards; }
      `}</style>

      {/* ================================================
          SECTION HERO — carousel à défilement
      ================================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Image sortante */}
        {sliding && (
          <img
            key={`exit-${prevSlide}`}
            src={heroSlides[prevSlide].src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${direction === "left" ? "slide-exit-left" : "slide-exit-right"}`}
            style={{ zIndex: 1 }}
          />
        )}

        {/* Image entrante / courante */}
        <img
          key={`enter-${currentSlide}`}
          src={heroSlides[currentSlide].src}
          alt={heroSlides[currentSlide].label}
          className={`absolute inset-0 w-full h-full object-cover ${sliding ? (direction === "left" ? "slide-enter-left" : "slide-enter-right") : ""}`}
          style={{ zIndex: 2 }}
        />

        {/* Overlays couleur */}
        <div className="absolute inset-0 bg-linear-to-r from-[#143C62]/95 via-[#143C62]/80 to-[#143C62]/40" style={{ zIndex: 3 }} />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" style={{ zIndex: 3 }} />

        {/* Décoration géométrique */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none" style={{ zIndex: 4 }}>
          <svg viewBox="0 0 800 800" className="w-full h-full" fill="none">
            <circle cx="600" cy="200" r="300" stroke="white" strokeWidth="0.5" />
            <circle cx="600" cy="200" r="200" stroke="white" strokeWidth="0.5" />
            <circle cx="600" cy="200" r="100" stroke="white" strokeWidth="0.5" />
            <line x1="0" y1="400" x2="800" y2="400" stroke="white" strokeWidth="0.5" />
            <line x1="400" y1="0" x2="400" y2="800" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Contenu hero */}
        <div className="relative max-w-7xl mx-auto px-6 pt-20 w-full flex flex-col items-center" style={{ zIndex: 5 }}>
          <div className="max-w-5xxl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Ingénierie de pointe
            </div>
            <h1
              className="text-white leading-tight mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "clamp(2.6rem, 6vw, 4.5rem)", letterSpacing: "-0.02em" }}
            >
              L'innovation technique au
              <br />
              service de{" "}
              <span style={{ color: "#f97316" }}>vos projets</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-5xl mx-auto">
              Aeris Consulting vous accompagne dans la conception de solutions robotiques,
              embarquées et automatisées. De l'idée au prototype fonctionnel.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/services" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5">
                Découvrir nos services
              </Link>
              <Link to="/contact" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-300">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Flèche gauche */}
        <button
          onClick={() => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length, "right")}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-orange-500 border border-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ zIndex: 10 }}
          aria-label="Slide précédente"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Flèche droite */}
        <button
          onClick={() => goToSlide((currentSlide + 1) % heroSlides.length, "left")}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-orange-500 border border-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ zIndex: 10 }}
          aria-label="Slide suivante"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Indicateurs bas */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3" style={{ zIndex: 10 }}>
          {heroSlides.map((slide, i) => (
            <button key={i} onClick={() => goToSlide(i, i > currentSlide ? "left" : "right")} aria-label={slide.label}>
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentSlide ? "2rem" : "0.5rem",
                  height: "0.5rem",
                  backgroundColor: i === currentSlide ? "#f97316" : "rgba(255,255,255,0.4)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Label slide */}
        <div className="absolute bottom-10 right-8 text-white/40 text-xs tracking-widest uppercase" style={{ zIndex: 10 }}>
          {heroSlides[currentSlide].label}
        </div>

        {/* Flèche scroll */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/30 animate-bounce" style={{ zIndex: 10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="M19 9l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* ================================================
          SECTION SERVICES
      ================================================ */}
      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={servicesRef}
            className="text-center mb-16"
            style={{
              opacity: servicesInView ? 1 : 0,
              transform: servicesInView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Nos expertises</span>
            <h2 className="text-4xl md:text-5xl text-[#143C62] mt-3 mb-5" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              Une équipe pluridisciplinaire
              <br />à votre service
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              De la robotique à la domotique, nous couvrons l'ensemble du spectre de l'ingénierie électronique et mécanique.
            </p>
            <p className="text-gray-400 text-sm mt-3">Cliquer sur une carte pour la retourner</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 text-[#143C62] font-semibold border border-[#143C62] px-8 py-3 rounded-xl hover:bg-[#143C62] hover:text-white transition-all duration-300">
              Voir tous nos services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION À PROPOS
      ================================================ */}
      <section className="py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              ref={aboutTextRef}
              style={{ opacity: aboutInView ? 1 : 0, transform: aboutInView ? "translateX(0)" : "translateX(-40px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
            >
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">À propos</span>
              <h2 className="text-4xl md:text-5xl text-[#143C62] mt-3 mb-6 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                Des ingénieurs passionnés par l'innovation
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                Fondée par des experts en électronique et mécatronique, Aeris Consulting allie rigueur technique et agilité pour transformer vos idées en solutions concrètes.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">Notre approche : comprendre vos besoins, prototyper rapidement et industrialiser avec méthode.</p>
              <ul className="space-y-3 mb-10">
                {["Équipe d'ingénieurs certifiés et experts", "Méthodologie agile adaptée au hardware", "De l'idée au produit fini en un seul partenaire"].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-gray-700">
                    <span className="mt-1 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3"><path d="M3 8l3.5 3.5L13 4" stroke="#E05A1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link to="/a-propos" className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:gap-4 transition-all duration-300">
                En savoir plus
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>

            <div style={{ opacity: aboutInView ? 1 : 0, transform: aboutInView ? "translateX(0)" : "translateX(40px)", transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s" }} className="relative">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80" alt="Équipe Aeris Consulting au travail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-br from-[#143C62]/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#143C62] rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} className="w-6 h-6"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <div className="text-2xl text-[#143C62]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>50+</div>
                  <div className="text-gray-500 text-sm">Projets réalisés</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-100 rounded-full -z-10" />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-50 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION GALERIE
      ================================================ */}
      <GallerySection />

      {/* ================================================
          SECTION CTA
      ================================================ */}
      <section ref={ctaRef} className="relative py-16 bg-[#143C62] overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
          style={{ opacity: ctaInView ? 1 : 0, transform: ctaInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
        >
          <h2 className="text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
            Prêt à concrétiser votre projet ?
          </h2>
          <p className="text-white/70 text-base mb-8">
            Discutons de vos besoins et explorons ensemble les solutions techniques les plus adaptées.
          </p>
          <Link to="/contact" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold text-base px-10 py-3.5 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1">
            Prendre rendez-vous
          </Link>
        </div>
      </section>

    </div>
  );
}
