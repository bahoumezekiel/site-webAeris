// ============================================================
// pages/AProposPage.tsx
// Page À propos : Hero + Histoire/Approche + Valeurs + Equipe
//                 + Chiffres clés animés + CTA
// ============================================================

import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";
import { useEffect, useRef, useState } from "react";

// ============================================================
// Données : valeurs de l'entreprise
// ============================================================
const valeurs = [
  {
    title: "Précision",
    description: "Nous mettons un point d'honneur à la rigueur technique et à la fiabilité de nos solutions.",
    color: "#3B82F6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "Agilité",
    description: "Méthodes agiles appliquées au hardware : itérations rapides, feedback continu, livraison fréquente.",
    color: "#F59E0B",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Collaboration",
    description: "Nous travaillons en partenariat avec nos clients, de la définition du besoin à la maintenance.",
    color: "#10B981",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Excellence",
    description: "Standards élevés dans chaque phase du projet, du design à la certification finale.",
    color: "#8B5CF6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M9.18 20.82 10.5 18h3l1.32 2.82A9 9 0 0 0 21 14.5V14a9 9 0 0 0-18 0v.5a9 9 0 0 0 6.18 6.32z" />
      </svg>
    ),
  },
];

// ============================================================
// Données : chiffres clés
// ============================================================
const chiffres = [
  { value: 150, suffix: "+", label: "Projets réalisés" },
  { value: 25, suffix: "+", label: "Experts en équipe" },
  { value: 6, suffix: "", label: "Domaines d'expertise" },
  { value: 98, suffix: "%", label: "Clients satisfaits" },
];

// ============================================================
// Hook : animation de compteur (0 → valeur cible)
// ============================================================
function useCounter(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const stepTime = Math.max(10, Math.floor(duration / target));
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / stepTime));
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
function AnimatedStat({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCounter(value, 1200, start);
  return (
    <div className="text-center group">
      <div className="font-bold text-5xl md:text-6xl text-orange-500 mb-2 tabular-nums transition-transform duration-300 group-hover:scale-110">
        {count}{suffix}
      </div>
      <div className="text-gray-500 text-sm font-medium uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ============================================================
// Composant : card valeur avec hover effect
// ============================================================
function ValeurCard({ valeur, index }: { valeur: typeof valeurs[0]; index: number }) {
  const { ref, inView } = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-7 cursor-default overflow-hidden transition-all duration-300"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        backgroundColor: hovered ? valeur.color : "white",
        boxShadow: hovered ? `0 20px 40px ${valeur.color}30` : "0 1px 3px rgba(0,0,0,0.08)",
        border: `1px solid ${hovered ? "transparent" : "#f1f5f9"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cercle décoratif de fond */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full transition-all duration-300"
        style={{ backgroundColor: hovered ? "rgba(255,255,255,0.1)" : `${valeur.color}10` }}
      />

      {/* Icône */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
        style={{
          backgroundColor: hovered ? "rgba(255,255,255,0.2)" : `${valeur.color}15`,
          color: hovered ? "white" : valeur.color,
        }}
      >
        {valeur.icon}
      </div>

      {/* Titre */}
      <h3
        className="text-lg font-bold mb-3 transition-colors duration-300"
        style={{ color: hovered ? "white" : "#143C62" }}
      >
        {valeur.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed transition-colors duration-300"
        style={{ color: hovered ? "rgba(255,255,255,0.85)" : "#6b7280" }}
      >
        {valeur.description}
      </p>

      {/* Barre de couleur en bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300"
        style={{ backgroundColor: hovered ? "rgba(255,255,255,0.3)" : valeur.color }}
      />
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
  const { ref: chiffresRef, inView: chiffresInView } = useInView(0.3);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.2);

  // Ref pour la ligne timeline animée
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================================================
          HERO - En-tête de la page À propos
      ================================================ */}
      <section className="relative pt-32 pb-24 bg-gray-50 overflow-hidden">

        {/* Décorations de fond */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#143C62]/5 rounded-full" />
          <div className="absolute top-1/2 -left-16 w-64 h-64 bg-orange-500/5 rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-100/40 rounded-full" />
        </div>

        <div
          ref={heroRef}
          className="relative z-10 max-w-5xxl mx-auto px-6 text-center"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >

          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Qui sommes-nous
          </span>
          <h1 className="font-bold text-5xl md:text-6xl text-[#143C62] mt-3 mb-6 leading-tight">
            À propos d'Aeris Consulting
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            Fondée par des ingénieurs passionnés, Aeris Consulting est née d'une conviction :
            la technologie de pointe doit être accessible à toutes les entreprises,
            des startups aux grands groupes.
          </p>
        </div>
      </section>

      {/* ================================================
          SECTION HISTOIRE + APPROCHE
      ================================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={histoireRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            style={{
              opacity: histoireInView ? 1 : 0,
              transform: histoireInView ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >

            {/* Notre histoire */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-[#143C62]/20 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#143C62] rounded-xl flex items-center justify-center text-white shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#143C62]">Notre histoire</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Aeris Consulting a été fondée en 2018 par une équipe d'ingénieurs en mécatronique
                et électronique. Après plusieurs années passées dans l'industrie et la recherche,
                nous avons décidé de créer une structure agile capable d'accompagner les entreprises
                sur l'ensemble du cycle de vie de leurs projets techniques.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Depuis, nous avons mené plus de 150 projets dans des domaines aussi variés que la
                robotique industrielle, les systèmes embarqués médicaux, l'impression 3D de pièces
                techniques et la domotique résidentielle.
              </p>

              {/* Timeline compacte */}
              <div className="mt-8 space-y-3" ref={timelineRef}>
                {[
                  { year: "2018", event: "Fondation d'Aeris Consulting" },
                  { year: "2020", event: "Expansion vers la domotique et l'IoT" },
                  { year: "2022", event: "Ouverture du laboratoire de prototypage 3D" },
                  { year: "2024", event: "50+ clients actifs, 25 experts en équipe" },
                ].map((item, i) => (
                  <div key={item.year} className="flex items-center gap-4">
                    <div
                      className="w-14 text-xs font-bold shrink-0 transition-colors duration-300"
                      style={{ color: histoireInView ? "#E05A1B" : "#9ca3af", transitionDelay: `${0.3 + i * 0.1}s` }}
                    >
                      {item.year}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <p className="text-gray-600 text-sm">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notre approche */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                    <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#143C62]">Notre approche</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Nous croyons que le meilleur résultat naît d'une collaboration étroite avec nos
                clients. C'est pourquoi nous privilégions une méthodologie itérative, transparente
                et orientée résultats.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Chaque projet commence par une phase d'écoute et d'analyse approfondie, suivie de
                cycles de conception et de prototypage rapides qui permettent d'ajuster le cap en
                continu. Notre objectif : livrer des solutions robustes, dans les délais et le
                budget impartis.
              </p>

              {/* Étapes de la méthode */}
              <div className="space-y-4">
                {[
                  { step: "01", title: "Écoute & Analyse", desc: "Compréhension profonde du besoin" },
                  { step: "02", title: "Conception & Prototypage", desc: "Itérations rapides et feedback continu" },
                  { step: "03", title: "Validation & Livraison", desc: "Tests rigoureux et mise en production" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#143C62]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#143C62] text-xs font-bold">{item.step}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION VALEURS
      ================================================ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

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
            <h2 className="font-bold text-4xl md:text-5xl text-[#143C62] mt-3 mb-4">
              Nos valeurs
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
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
          SECTION CHIFFRES CLÉS - Compteurs animés
      ================================================ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
              En chiffres
            </span>
            <h2 className="font-bold text-4xl md:text-5xl text-[#143C62] mt-3">
              Chiffres clés
            </h2>
          </div>

          {/* Grille des stats avec compteurs */}
          <div
            ref={chiffresRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          >
            {chiffres.map((stat) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                start={chiffresInView}
              />
            ))}
          </div>

          {/* Barre de progression décorative */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Satisfaction client", value: 98 },
              { label: "Projets livrés dans les délais", value: 94 },
              { label: "Taux de renouvellement client", value: 87 },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">{bar.label}</span>
                  <span className="text-orange-500 font-bold">{bar.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
      <section
        ref={ctaRef}
        className="relative py-24 bg-[#143C62] overflow-hidden"
      >
        {/* Décorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs><pattern id="grid2" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>

        <div
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h2 className="font-bold text-4xl md:text-5xl text-white mb-5">
            Rejoignez l'aventure Aeris
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Vous avez un projet technique ? Discutons-en ensemble.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1"
          >
            Nous contacter
          </Link>
        </div>
      </section>

    </div>
  );
}
