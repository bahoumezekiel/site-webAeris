// ============================================================
// pages/AProposPage.tsx
// Page À propos : Hero + Histoire/Approche + Valeurs
//                 + Partenaires + Chiffres clés animés + CTA
//
// Prérequis : placer les logos partenaires dans src/assets/
//   - wascal.png
//   - tanga.png
//   - paif.jpg    (adapter l'extension si le fichier réel diffère)
//   - banque-mondiale.png
// Format conseillé : PNG/JPG à fond transparent, largeur minimale 400px
// ============================================================

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";

// Logos des partenaires
import wascalLogo from "../assets/wascal.png";
import tangaLogo from "../assets/tanga.png";
import paifLogo from "../assets/paif.jpg";
import banqueMondialeLogo from "../assets/banque-mondiale.jpg";
import aproposHero from "../assets/aeris.jpg";

// ============================================================
// Types
// ============================================================
interface Valeur {
  title: string;
  description: string;
  color: string;
  icon: ReactNode;
}

interface Partenaire {
  name: string;
  role: string;
  url: string;
  logo: string;
  accent: string;
}

interface Chiffre {
  value: number;
  suffix: string;
  label: string;
}

interface Performance {
  label: string;
  value: number;
}

// ============================================================
// Données : valeurs de l'entreprise
// ============================================================
const valeurs: Valeur[] = [
  {
    title: "Précision",
    description:
      "Nous mettons un point d'honneur à la rigueur technique et à la fiabilité de nos solutions.",
    color: "#3B82F6",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "Agilité",
    description:
      "Méthodes agiles appliquées au hardware : itérations rapides, feedback continu, livraison fréquente.",
    color: "#F59E0B",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Collaboration",
    description:
      "Nous travaillons en partenariat avec nos clients, de la définition du besoin à la maintenance.",
    color: "#10B981",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Excellence",
    description:
      "Standards élevés dans chaque phase du projet, du design à la certification finale.",
    color: "#8B5CF6",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M9.18 20.82 10.5 18h3l1.32 2.82A9 9 0 0 0 21 14.5V14a9 9 0 0 0-18 0v.5a9 9 0 0 0 6.18 6.32z" />
      </svg>
    ),
  },
];

// ============================================================
// Données : partenaires
// ============================================================
const partenaires: Partenaire[] = [
  {
    name: "Wascal",
    role: "Recherche & Climat",
    url: "https://www.wascal.org",
    logo: wascalLogo,
    accent: "#143C62",
  },
  {
    name: "PAIF PME",
    role: "Financement PME",
    url: "https://www.paifpme.bf",
    logo: paifLogo,
    accent: "#143C62",
  },
  {
    name: "Banque Mondiale",
    role: "Institution Financière",
    url: "https://www.banquemondiale.org",
    logo: banqueMondialeLogo,
    accent: "#143C62",
  },
  {
    name: "Tanga Groupe",
    role: "Partenaire Industriel",
    url: "https://www.tangagroupe.com",
    logo: tangaLogo,
    accent: "#E05A1B",
  },
];

// ============================================================
// Données : chiffres clés
// ============================================================
const chiffres: Chiffre[] = [
  { value: 150, suffix: "+", label: "Projets réalisés" },
  { value: 25, suffix: "+", label: "Experts en équipe" },
  { value: 6, suffix: "", label: "Domaines d'expertise" },
  { value: 98, suffix: "%", label: "Clients satisfaits" },
];

// ============================================================
// Données : barres de performance
// ============================================================
const performances: Performance[] = [
  { label: "Satisfaction client", value: 98 },
  { label: "Projets livrés dans les délais", value: 94 },
  { label: "Taux de renouvellement client", value: 87 },
];

// ============================================================
// Hook : animation de compteur (0 vers la valeur cible)
// ============================================================
function useCounter(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    const stepTime = Math.max(10, Math.floor(duration / target));
    const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [start, target, duration]);

  return count;
}

// ============================================================
// Composant : chiffre animé individuel
// ============================================================
function AnimatedStat({
  chiffre,
  start,
}: {
  chiffre: Chiffre;
  start: boolean;
}) {
  const count = useCounter(chiffre.value, 1200, start);

  return (
    <div className="text-center group">
      <div className="font-bold text-4xl md:text-6xl text-orange-500 mb-2 tabular-nums transition-transform duration-300 group-hover:scale-110">
        {count}
        {chiffre.suffix}
      </div>
      <div className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-widest">
        {chiffre.label}
      </div>
    </div>
  );
}

// ============================================================
// Composant : card valeur avec fond coloré au survol
// ============================================================
function ValeurCard({ valeur, index }: { valeur: Valeur; index: number }) {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-7 overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s, background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease`,
        backgroundColor: hovered ? valeur.color : "#ffffff",
        boxShadow: hovered
          ? `0 20px 40px ${valeur.color}30`
          : "0 1px 3px rgba(0,0,0,0.08)",
        border: `1px solid ${hovered ? "transparent" : "#f1f5f9"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cercle décoratif de fond */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full transition-colors duration-300 pointer-events-none"
        style={{
          backgroundColor: hovered
            ? "rgba(255,255,255,0.1)"
            : `${valeur.color}10`,
        }}
      />

      {/* Icône */}
      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
        style={{
          backgroundColor: hovered
            ? "rgba(255,255,255,0.2)"
            : `${valeur.color}15`,
          color: hovered ? "#ffffff" : valeur.color,
        }}
      >
        {valeur.icon}
      </div>

      {/* Titre */}
      <h3
        className="relative text-lg font-bold mb-3 transition-colors duration-300"
        style={{ color: hovered ? "#ffffff" : "#143C62" }}
      >
        {valeur.title}
      </h3>

      {/* Description */}
      <p
        className="relative text-sm leading-relaxed transition-colors duration-300"
        style={{ color: hovered ? "rgba(255,255,255,0.85)" : "#6b7280" }}
      >
        {valeur.description}
      </p>

      {/* Barre de couleur en bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-colors duration-300"
        style={{
          backgroundColor: hovered ? "rgba(255,255,255,0.3)" : valeur.color,
        }}
      />
    </div>
  );
}

// ============================================================
// Composant : card partenaire
// Logo affiché en niveaux de gris par défaut, couleur au survol.
// Ce traitement harmonise visuellement des logos aux palettes
// très différentes — standard sur les sites institutionnels.
// ============================================================
function PartenaireCard({
  partenaire,
  index,
}: {
  partenaire: Partenaire;
  index: number;
}) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      <a
        href={partenaire.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visiter le site de ${partenaire.name}`}
        className="partner-card flex flex-col rounded-2xl bg-white border border-gray-200 overflow-hidden isolate"
      >
        {/* Zone logo */}
        <div className="h-28 md:h-32 flex items-center justify-center p-5">
          <img
            src={partenaire.logo}
            alt={partenaire.name}
            className="max-h-full max-w-full w-auto object-contain"
            loading="lazy"
          />
        </div>

        {/* Bandeau nom + rôle */}
        <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <p className="text-xs md:text-sm font-semibold text-[#143C62] text-center truncate">
            {partenaire.name}
          </p>
          <p className="text-[11px] text-gray-400 text-center mt-0.5 truncate">
            {partenaire.role}
          </p>
        </div>
      </a>
    </div>
  );
}

// ============================================================
// Composant principal : page À propos
// ============================================================
export default function AProposPage() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const { ref: histoireRef, inView: histoireInView } = useInView(0.1);
  const { ref: valeursRef, inView: valeursInView } = useInView(0.1);
  const { ref: partenairesRef, inView: partenairesInView } = useInView(0.1);
  const { ref: chiffresRef, inView: chiffresInView } = useInView(0.3);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.2);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ================================================
          STYLES — effet grayscale des logos partenaires
      ================================================ */}
      <style>{`
        .partner-card {
          transition: box-shadow 0.4s ease, transform 0.4s ease, border-color 0.4s ease;
        }
        .partner-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 30px -12px rgba(0,0,0,0.18);
          border-color: rgba(0,0,0,0.08);
        }
      `}</style>

      {/* ================================================
          HERO — En-tête de la page
      ================================================ */}

      <section className="pt-16">
        <div
          ref={heroRef}
          className="w-full h-[420px] md:h-[600px]"
          style={{
            opacity: heroInView ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <img
            src={aproposHero}
            alt="Aeris Consulting"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      {/* ================================================
          HISTOIRE + APPROCHE — cartes aux couleurs Aeris
      ================================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            ref={histoireRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
            style={{
              opacity: histoireInView ? 1 : 0,
              transform: histoireInView ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            {/* ---- Notre histoire : fond bleu Aeris ---- */}
            <div className="rounded-2xl p-8 bg-[#143C62] hover:shadow-2xl hover:shadow-[#143C62]/30 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-white shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-5 h-5"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Notre histoire</h2>
              </div>

              <p className="text-white/75 leading-relaxed mb-4">
                Aeris Consulting a été fondée en 2018 par une équipe
                d'ingénieurs en mécatronique et électronique. Après plusieurs
                années passées dans l'industrie et la recherche, nous avons
                décidé de créer une structure agile capable d'accompagner les
                entreprises sur l'ensemble du cycle de vie de leurs projets
                techniques.
              </p>
              <p className="text-white/75 leading-relaxed">
                Depuis, nous avons mené plus de 150 projets dans des domaines
                aussi variés que la robotique industrielle, les systèmes
                embarqués médicaux, l'impression 3D de pièces techniques et la
                domotique résidentielle.
              </p>
            </div>

            {/* ---- Notre approche : fond orange ---- */}
            <div className="rounded-2xl p-8 bg-orange-500 hover:shadow-2xl hover:shadow-orange-500/30 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-5 h-5"
                  >
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Notre approche</h2>
              </div>

              <p className="text-white/85 leading-relaxed mb-4">
                Nous croyons que le meilleur résultat naît d'une collaboration
                étroite avec nos clients. C'est pourquoi nous privilégions une
                méthodologie itérative, transparente et orientée résultats.
              </p>
              <p className="text-white/85 leading-relaxed">
                Chaque projet commence par une phase d'écoute et d'analyse
                approfondie, suivie de cycles de conception et de prototypage
                rapides qui permettent d'ajuster le cap en continu. Notre
                objectif : livrer des solutions robustes, dans les délais et le
                budget impartis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          VALEURS
      ================================================ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* En-tête */}
          <div
            ref={valeursRef}
            className="text-center mb-14"
            style={{
              opacity: valeursInView ? 1 : 0,
              transform: valeursInView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
              Ce qui nous guide
            </span>
            <h2 className="font-bold text-3xl md:text-5xl text-[#143C62] mt-3 mb-4">
              Nos valeurs
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Les principes qui guident chacune de nos actions au quotidien.
            </p>
          </div>

          {/* Grille des valeurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valeurs.map((valeur, i) => (
              <ValeurCard key={valeur.title} valeur={valeur} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          PARTENAIRES
      ================================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* En-tête */}
          <div
            ref={partenairesRef}
            className="text-center mb-14"
            style={{
              opacity: partenairesInView ? 1 : 0,
              transform: partenairesInView
                ? "translateY(0)"
                : "translateY(30px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
              Ils nous font confiance
            </span>
            <h2 className="font-bold text-3xl md:text-5xl text-[#143C62] mt-3 mb-4">
              Nos Partenaires
            </h2>
            <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
              Des organisations de référence avec lesquelles nous collaborons
              pour porter l'innovation technologique en Afrique.
            </p>
          </div>

          {/* Grille des partenaires */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {partenaires.map((partenaire, i) => (
              <PartenaireCard
                key={partenaire.name}
                partenaire={partenaire}
                index={i}
              />
            ))}
          </div>

          {/* Appel à partenariat */}
          <div className="mt-12 max-w-2xl mx-auto text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-600 text-sm leading-relaxed">
              Vous souhaitez devenir partenaire d'Aeris Consulting ?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-3 text-orange-500 font-semibold text-sm hover:gap-4 transition-all duration-300"
            >
              Contactez-nous
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
          CHIFFRES CLÉS — compteurs animés
      ================================================ */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* En-tête */}
          <div className="text-center mb-14">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
              En chiffres
            </span>
            <h2 className="font-bold text-3xl md:text-5xl text-[#143C62] mt-3">
              Chiffres clés
            </h2>
          </div>

          {/* Compteurs */}
          <div
            ref={chiffresRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          >
            {chiffres.map((chiffre) => (
              <AnimatedStat
                key={chiffre.label}
                chiffre={chiffre}
                start={chiffresInView}
              />
            ))}
          </div>

          {/* Barres de performance */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {performances.map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">{bar.label}</span>
                  <span className="text-orange-500 font-bold">
                    {bar.value}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#143C62] to-orange-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: chiffresInView ? `${bar.value}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          CTA FINAL
      ================================================ */}
      <section className="relative py-24 bg-[#143C62] overflow-hidden">
        {/* Texture grille */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern
                id="grid-apropos"
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
            <rect width="100%" height="100%" fill="url(#grid-apropos)" />
          </svg>
        </div>

        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

        {/* Contenu */}
        <div
          ref={ctaRef}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h2 className="font-bold text-3xl md:text-5xl text-white mb-5">
            Rejoignez l'aventure Aeris
          </h2>
          <p className="text-white/70 text-base md:text-lg mb-10">
            Vous avez un projet technique ? Discutons-en ensemble.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold text-base md:text-lg px-10 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}
