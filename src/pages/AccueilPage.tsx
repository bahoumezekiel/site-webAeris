// ============================================================
// pages/AccueilPage.tsx
// Hero carousel amélioré + Galerie épurée et adaptée
// ============================================================

import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "../hooks/useInView";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";
import ingenieur2 from "../assets/ingenieur2.jpg";
import imprimante from "../assets/imprimante.jpg";
import robotique from "../assets/robotique.jpg";
import automatisme from "../assets/automatisme.jpg";
import ingenieur from "../assets/ingenieur.jpg";
import domotique from "../assets/domotique.jpg";
import galeri1 from "../assets/image1.jpeg";
import galeri2 from "../assets/image2.jpeg";
import galeri3 from "../assets/image3.jpeg";
import galeri4 from "../assets/image4.jpeg";
import galeri5 from "../assets/image5.jpeg";

const heroSlides = [
  { src: imprimante, label: "Impression 3D" },
  { src: robotique, label: "Robotique" },
  { src: automatisme, label: "Automatisme" },
  { src: ingenieur, label: "Ingénierie" },
  { src: domotique, label: "Domotique" },
];

// Images galerie : composants électroniques accessibles en Afrique
const galleryImages = [
  {
    src: galeri1,
  },
  {
    src: galeri2,
    category: "Prototypage",
  },
  {
    src: galeri3,
    category: "IoT",
  },
  {
    src: galeri4,
    category: "Domotique",
  },
  {
    src: galeri5,
    category: "3D",
  },
];

const galleryFilters = [
  "Tous",
  "Embarqué",
  "Prototypage",
  "IoT",
  "Domotique",
  "3D",
  "Robotique",
  "Automatisme",
];

// ============================================================
// Composant : Galerie épurée — grille uniforme + lightbox simple
// ============================================================
function GallerySection() {
  const { ref, inView } = useInView();
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeFilter === "Tous"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter);

  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = useCallback(() => {
    setLightboxIndex((p) =>
      p !== null ? (p - 1 + filtered.length) % filtered.length : 0,
    );
  }, [filtered.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((p) => (p !== null ? (p + 1) % filtered.length : 0));
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prevImage, nextImage]);

  return (
    <section className="py-20 bg-[#0b1f35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* En-tête */}
        <div
          ref={ref}
          className="text-center mb-10"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">
            Notre univers
          </span>
          <h2 className="text-3xl md:text-4xl text-white mt-3 mb-3 font-bold leading-tight">
            Composants & réalisations
            <br />
            <span className="text-orange-400">au cœur de l'Afrique</span>
          </h2>
          <p className="text-white/50 text-sm max-w-sm mx-auto">
            Équipements électroniques, modules IoT et systèmes que nous
            concevons et intégrons.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {galleryFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeFilter === f
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grille : 1 grande image (2 colonnes) + 2 colonnes normales */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
        >
          {/* Grande image gauche — occupe 2 lignes */}
          {filtered.length > 0 && (
            <div
              className="relative overflow-hidden rounded-xl cursor-pointer group"
              style={{
                gridColumn: "1",
                gridRow: "1 / 3",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease 0s, transform 0.5s ease 0s",
              }}
              onClick={() => setLightboxIndex(0)}
            >
              <img
                src={filtered[0].src}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4"></div>
              <div className="absolute top-2 right-2 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  className="w-3.5 h-3.5"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* 4 images normales — colonnes 2 et 3, inchangées */}
          {filtered.slice(1, 5).map((img, i) => (
            <div
              key={img.src + i}
              className="relative overflow-hidden rounded-xl cursor-pointer group"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${(i + 1) * 0.08}s, transform 0.5s ease ${(i + 1) * 0.08}s`,
              }}
              onClick={() => setLightboxIndex(i + 1)}
            >
              <img
                src={img.src}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3"></div>
              <div className="absolute top-2 right-2 w-7 h-7 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  className="w-3.5 h-3.5"
                >
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        {/* Message si filtre vide */}
        {filtered.length === 0 && (
          <p className="text-white/40 text-center py-10 text-sm">
            Aucune image dans cette catégorie.
          </p>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center px-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fermer */}
            <button
              className="absolute -top-10 right-0 w-9 h-9 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
              onClick={closeLightbox}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image principale */}
            <div className="rounded-2xl overflow-hidden">
              <img
                src={filtered[lightboxIndex].src}
                className="w-full max-h-[70vh] object-contain bg-gray-900"
              />
            </div>

            {/* Info + compteur */}
            <div className="flex items-center justify-between mt-4 px-1">
              <div></div>
              <span className="text-white/40 text-xs">
                {lightboxIndex + 1} / {filtered.length}
              </span>
            </div>

            {/* Navigation précédent / suivant */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-9 h-9 bg-white/10 hover:bg-orange-500 rounded-full hidden sm:flex items-center justify-center transition-colors duration-200"
              onClick={prevImage}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-9 h-9 bg-white/10 hover:bg-orange-500 rounded-full hidden sm:flex items-center justify-center transition-colors duration-200"
              onClick={nextImage}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Navigation mobile : boutons en bas */}
            <div className="flex justify-center gap-4 mt-4 sm:hidden">
              <button
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200"
                onClick={prevImage}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200"
                onClick={nextImage}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Miniatures */}
            <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-1">
              {filtered.map((img, idx) => (
                <button
                  key={img.src + idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    idx === lightboxIndex
                      ? "border-orange-500 scale-110"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [prevSlide, setPrevSlide] = useState(0);

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
    [sliding, currentSlide],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length, "left");
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, goToSlide]);

  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
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
          SECTION HERO — carousel avec overlay léger
      ================================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Image sortante */}
        {sliding && (
          <img
            key={`exit-${prevSlide}`}
            src={heroSlides[prevSlide].src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${
              direction === "left" ? "slide-exit-left" : "slide-exit-right"
            }`}
            style={{ zIndex: 1 }}
          />
        )}

        {/* Image entrante / courante */}
        <img
          key={`enter-${currentSlide}`}
          src={heroSlides[currentSlide].src}
          alt={heroSlides[currentSlide].label}
          className={`absolute inset-0 w-full h-full object-cover ${
            sliding
              ? direction === "left"
                ? "slide-enter-left"
                : "slide-enter-right"
              : ""
          }`}
          style={{ zIndex: 2 }}
        />

        {/* Overlay : dégradé gauche fort + léger bas — laisse l'image visible à droite */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 3,
            background:
              "linear-gradient(105deg, rgba(20,60,98,0.92) 0%, rgba(20,60,98,0.75) 45%, rgba(20,60,98,0.30) 100%)",
          }}
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"
          style={{ zIndex: 3 }}
        />

        {/* Décoration géométrique — côté droit uniquement */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none"
          style={{ zIndex: 4 }}
        >
          <svg viewBox="0 0 800 800" className="w-full h-full" fill="none">
            <circle
              cx="600"
              cy="200"
              r="300"
              stroke="white"
              strokeWidth="0.5"
            />
            <circle
              cx="600"
              cy="200"
              r="200"
              stroke="white"
              strokeWidth="0.5"
            />
            <circle
              cx="600"
              cy="200"
              r="100"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="0"
              y1="400"
              x2="800"
              y2="400"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="400"
              y1="0"
              x2="400"
              y2="800"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Contenu hero — CENTRÉ */}
        <div
          className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 pt-20"
          style={{ zIndex: 5 }}
        >
          <div className="max-w-3xxl mx-auto text-center">
            {/* Titre */}
            <h1
              className="text-white leading-none mb-6"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2.4rem, 6vw, 5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              L'innovation technique
              <br />
              au service de{" "}
              <span style={{ color: "#f97316" }}>vos projets</span>
            </h1>

            {/* Description */}
            <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
              Aeris Consulting vous accompagne dans la conception de solutions
              robotiques, embarquées et automatisées. De l'idée au prototype
              fonctionnel.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/services"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 text-sm"
              >
                Découvrir nos services
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-7 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 text-sm"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Flèches navigation — cachées sur très petit écran */}
        <button
          onClick={() =>
            goToSlide(
              (currentSlide - 1 + heroSlides.length) % heroSlides.length,
              "right",
            )
          }
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-orange-500 border border-white/20 rounded-full items-center justify-center transition-all duration-200 hidden sm:flex"
          style={{ zIndex: 10 }}
          aria-label="Slide précédente"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() =>
            goToSlide((currentSlide + 1) % heroSlides.length, "left")
          }
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-orange-500 border border-white/20 rounded-full items-center justify-center transition-all duration-200 hidden sm:flex"
          style={{ zIndex: 10 }}
          aria-label="Slide suivante"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicateurs bas */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
          style={{ zIndex: 10 }}
        >
          {heroSlides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i, i > currentSlide ? "left" : "right")}
              aria-label={slide.label}
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentSlide ? "1.5rem" : "0.4rem",
                  height: "0.4rem",
                  backgroundColor:
                    i === currentSlide ? "#f97316" : "rgba(255,255,255,0.35)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Label slide courant */}
        <div
          className="absolute bottom-6 right-6 text-white/35 text-xs tracking-widest uppercase hidden sm:block"
          style={{ zIndex: 10 }}
        >
          {heroSlides[currentSlide].label}
        </div>
      </section>

      {/* ================================================
          SECTION SERVICES
      ================================================ */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            ref={servicesRef}
            className="text-center mb-12"
            style={{
              opacity: servicesInView ? 1 : 0,
              transform: servicesInView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
              Nos expertises
            </span>
            <h2 className="text-3xl md:text-5xl text-[#143C62] mt-3 mb-4 font-bold">
              Une équipe pluridisciplinaire
              <br />à votre service
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              De la robotique à la domotique, nous couvrons l'ensemble du
              spectre de l'ingénierie électronique et mécanique.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Cliquer sur une carte pour la retourner
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[#143C62] font-semibold border border-[#143C62] px-7 py-3 rounded-xl hover:bg-[#143C62] hover:text-white transition-all duration-300 text-sm"
            >
              Voir tous nos services
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION À PROPOS
      ================================================ */}
      <section className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Texte */}
            <div
              ref={aboutTextRef}
              style={{
                opacity: aboutInView ? 1 : 0,
                transform: aboutInView ? "translateX(0)" : "translateX(-40px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
                À propos
              </span>
              <h2
                className="text-5xxl md:text-5xl text-[#143C62] mt-2 mb-1 font-bold"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  lineHeight: 1.05, // Même valeur que le titre Hero
                  letterSpacing: "-0.02em", // Optionnel : resserre les lettres
                }}
              >
                Des ingénieurs passionnés par l'innovation
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                Fondée par des Ingenieurs en électronique , informatiqu et
                mecanique, Aeris Consulting allie rigueur technique et agilité
                pour transformer vos idées en solutions concrètes.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Notre approche : comprendre vos besoins, prototyper rapidement
                et industrialiser avec méthode.
              </p>
              <Link
                to="/a-propos"
                className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:gap-4 transition-all duration-300"
              >
                En savoir plus
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Image */}
            <div
              style={{
                opacity: aboutInView ? 1 : 0,
                transform: aboutInView ? "translateX(0)" : "translateX(40px)",
                transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
              }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-2xl">
                <img
                  src={ingenieur2}
                  alt="Équipe Aeris Consulting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-br from-[#143C62]/20 to-transparent" />
              </div>

              {/* Badge flottant */}
              <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#143C62] rounded-xl flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth={1.5}
                    className="w-5 h-5"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#143C62]">50+</div>
                  <div className="text-gray-500 text-xs">Projets réalisés</div>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 w-20 h-20 bg-orange-100 rounded-full -z-10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50 rounded-full -z-10" />
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
      <section
        ref={ctaRef}
        className="relative py-14 bg-[#143C62] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                x="0"
                y="0"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div
          className="relative z-10 max-w-2xl mx-auto px-6 text-center"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h2 className="text-2xl md:text-4xl text-white mb-4 font-bold">
            Prêt à concrétiser votre projet ?
          </h2>
          <p className="text-white/70 text-sm mb-7">
            Discutons de vos besoins et explorons ensemble les solutions
            techniques les plus adaptées.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold px-9 py-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 text-sm"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </section>
    </div>
  );
}
