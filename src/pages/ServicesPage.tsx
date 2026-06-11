// ============================================================
// pages/ServicesPage.tsx
// Hero avec bulles dynamiques animées + blocs services alternés
// ============================================================

import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";
import bambuImage from "../assets/imprimante.png";
import prototypeImage from "../assets/prototype.jpeg";
import domotiqueImage from "../assets/domotique.png";
import systemeImage from "../assets/systeme.jpeg";
import automatiseImage from "../assets/automatisme.png";

// ============================================================
// Données des services
// ============================================================
const servicesDetail = [
  {
    id: 1,
    title: "Robotique",
    tagline: "Conception et programmation de solutions robotiques adaptées à vos besoins industriels ou de recherche.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    features: [
      "Robotique mobile et navigation autonome",
      "Bras robotisés et cobots",
      "Vision par ordinateur et IA embarquée",
      "ROS / ROS2 et middleware robotique",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M12 11V7" /><circle cx="12" cy="5" r="2" />
        <path d="M5 15H2M22 15h-3" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Systèmes embarqués",
    tagline: "Développement de solutions hardware/software intégrées, du capteur au cloud.",
    image: systemeImage,
    features: [
      "Firmware temps réel (FreeRTOS, Zephyr)",
      "Architectures ARM Cortex et FPGA",
      "Protocoles de communication (CAN, SPI, I2C, Ethernet)",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h8" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Automatisme",
    tagline: "Conception et mise en oeuvre de systèmes automatiques pour l'industrie et le bâtiment.",
    image: automatiseImage,
    features: [
      "Automates programmables (PLC, Arduino, Raspberry)",
      "Supervision SCADA et IIoT",
      "Régulation PID et contrôle avancé",
      "Intégration chaîne de production",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Impression & Modélisation 3D",
    tagline: "Prototypage rapide et production de pièces sur mesure par impression additive.",
    image: bambuImage,
    features: [
      "FREECAD et Fusion 360 pour la modélisation",
      "Modélisation CAO (Fusion 360, SolidWorks)",
      "Impression FDM, SLA et résine",
      "Post-traitement et finition",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Prototypage",
    tagline: "Validation rapide de vos concepts par des itérations agiles et des bancs de test dédiés.",
    image: prototypeImage,
    features: [
      "Cahier des charges technique",
      "Proof of Concept (PoC) et MVP hardware",
      "Intégration mécanique/électronique/logiciel",
      "Bancs de test et caractérisation",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M9 2H5a2 2 0 0 0-2 2v4M15 2h4a2 2 0 0 1 2 2v4M3 16v4a2 2 0 0 0 2 2h4M21 16v4a2 2 0 0 1-2 2h-4" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 6,
    title: "Domotique",
    tagline: "Automatisation intelligente de vos espaces pour plus de confort, de sécurité et d'économies d'énergie.",
    image: domotiqueImage,
    features: [
      "Maison intelligente et objets connectés",
      "Gestion énergétique et Données Biometrique",
      "Sécurité et surveillance",
      "Intégration assistants vocaux",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
];

// ============================================================
// Composant : Bulles dynamiques animées (canvas)
// ============================================================
function BubblesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Redimensionnement
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Paramètres des bulles
    type Bubble = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      alpha: number; alphaDir: number;
      color: string;
    };

    const COLORS = [
      "rgba(249,115,22,",   // orange
      "rgba(20,60,98,",     // bleu marine
      "rgba(255,255,255,",  // blanc
    ];

    const bubbles: Bubble[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.5 + 0.2), // remonte doucement
      r: Math.random() * 28 + 6,
      alpha: Math.random() * 0.3 + 0.05,
      alphaDir: (Math.random() - 0.5) * 0.003,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const b of bubbles) {
        // Mouvement
        b.x += b.vx;
        b.y += b.vy;
        b.alpha += b.alphaDir;

        // Rebond latéral
        if (b.x - b.r < 0 || b.x + b.r > canvas.width) b.vx *= -1;
        // Réapparaît en bas quand sort par le haut
        if (b.y + b.r < 0) {
          b.y = canvas.height + b.r;
          b.x = Math.random() * canvas.width;
        }
        // Clamp alpha
        if (b.alpha > 0.35 || b.alpha < 0.04) b.alphaDir *= -1;

        // Dessin cercle avec dégradé radial (effet 3D)
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1,
          b.x, b.y, b.r
        );
        grad.addColorStop(0, `${b.color}${(b.alpha * 1.6).toFixed(2)})`);
        grad.addColorStop(0.6, `${b.color}${b.alpha.toFixed(2)})`);
        grad.addColorStop(1, `${b.color}0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Petit reflet en haut-gauche
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.28, b.r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(b.alpha * 0.8).toFixed(2)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}

// ============================================================
// Composant : bloc service individuel (layout alterné)
// ============================================================
function ServiceBlock({
  service,
  index,
}: {
  service: (typeof servicesDetail)[0];
  index: number;
}) {
  const { ref, inView } = useInView(0.1);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="py-20 border-b border-gray-100 last:border-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Colonne texte */}
          <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#143C62] rounded-xl flex items-center justify-center text-white">
                {service.icon}
              </div>
              <span className="text-5xl text-gray-100 select-none font-bold leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                0{service.id}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl text-[#143C62] mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
              {service.title}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">{service.tagline}</p>
            <ul className="space-y-3 mb-10">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-700">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-orange-500 shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#143C62] hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
            >
              Discuter de votre projet
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Colonne image */}
          <div className={isEven ? "order-2" : "order-2 lg:order-1"}>
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden aspect-4/3 shadow-xl relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-contain bg-white"
                />
                <div className="absolute inset-0 bg-linear-to-br from-[#143C62]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white rounded-xl px-4 py-2 shadow-lg">
                <span className="text-sm font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{service.title}</span>
              </div>
              <div className={`absolute -z-10 w-full h-full rounded-2xl bg-gray-100 top-3 ${isEven ? "left-3" : "-left-3"}`} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ============================================================
// Composant principal : page Services
// ============================================================
export default function ServicesPage() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================================================
          HERO avec bulles dynamiques
      ================================================ */}
      <section className="relative pt-32 pb-20 bg-gray-50 overflow-hidden">

        {/* Canvas bulles — couche de fond */}
        <BubblesCanvas />

        {/* Décoration de fond statique (cercles) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#143C62]/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-500/5 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#143C62]/3 rounded-full -translate-y-1/2" />
        </div>

        <div
          ref={heroRef}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">
            Ce que nous faisons
          </span>
          <h1
            className="text-5xl md:text-6xl text-[#143C62] mt-3 mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Nos Services
          </h1>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            De la conception à la réalisation, nous accompagnons vos projets techniques
            avec expertise et réactivité.
          </p>

          {/* Indicateurs de scroll / ancres */}
          <div className="flex items-center justify-center gap-3 mt-10">
            {servicesDetail.map((s) => (
              <a
                key={s.id}
                href={`#service-${s.id}`}
                className="w-2 h-2 rounded-full bg-gray-300 hover:bg-orange-500 transition-colors duration-200"
                aria-label={s.title}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          LISTE DES SERVICES — blocs alternés
      ================================================ */}
      <section className="bg-white">
        {servicesDetail.map((service, i) => (
          <div key={service.id} id={`service-${service.id}`}>
            <ServiceBlock service={service} index={i} />
          </div>
        ))}
      </section>

      {/* ================================================
          CTA FINAL
      ================================================ */}
      <section className="relative py-24 bg-[#143C62] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-4xl md:text-5xl text-white mb-5"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}
          >
            Votre projet ne rentre dans aucune case ?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Nous aimons les défis techniques hors norme. Décrivez-nous votre besoin, nous trouverons la solution.
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
