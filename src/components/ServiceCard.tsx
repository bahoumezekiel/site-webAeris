// ============================================================
// components/ServiceCard.tsx
// Card service redesignée : flip 3D + icônes SVG + micro-interactions
// ============================================================

import { useState } from "react";
import type { Service } from "../data/services";
import React from "react";

// ── Icônes SVG par service ───────────────────────────────────
const serviceIcons: Record<number, React.JSX.Element> = {
  1: ( // Robotique
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="20" width="20" height="18" rx="3" />
      <rect x="18" y="27" width="4" height="4" rx="1" fill="currentColor" stroke="none" opacity={0.6} />
      <rect x="26" y="27" width="4" height="4" rx="1" fill="currentColor" stroke="none" opacity={0.6} />
      <path d="M24 20v-6" />
      <circle cx="24" cy="11" r="3" />
      <path d="M14 29H8M40 29h-6" />
      <path d="M19 38v4M29 38v4" />
      <path d="M20 14h8" strokeDasharray="2 2" opacity={0.4} />
    </svg>
  ),
  2: ( // Systèmes embarqués
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="14" width="28" height="20" rx="2" />
      <rect x="16" y="20" width="16" height="8" rx="1" fill="currentColor" stroke="none" opacity={0.15} />
      <path d="M16 20h16M16 24h16M16 28h10" opacity={0.5} />
      <path d="M14 10v4M20 10v4M26 10v4M32 10v4M34 10v4" />
      <path d="M14 34v4M20 34v4M26 34v4M32 34v4" />
      <path d="M6 20v8M42 20v8" />
    </svg>
  ),
  3: ( // Automatique
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="8" />
      <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" opacity={0.5} />
      <path d="M24 8v6M24 34v6M8 24h6M34 24h6" />
      <path d="M13.4 13.4l4.2 4.2M30.4 30.4l4.2 4.2M34.6 13.4l-4.2 4.2M17.6 30.4l-4.2 4.2" />
      <circle cx="24" cy="8" r="2" fill="currentColor" stroke="none" opacity={0.4} />
      <circle cx="24" cy="40" r="2" fill="currentColor" stroke="none" opacity={0.4} />
      <circle cx="8" cy="24" r="2" fill="currentColor" stroke="none" opacity={0.4} />
      <circle cx="40" cy="24" r="2" fill="currentColor" stroke="none" opacity={0.4} />
    </svg>
  ),
  4: ( // Impression 3D
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 16h32v20a2 2 0 01-2 2H10a2 2 0 01-2-2V16z" />
      <path d="M8 16l4-8h24l4 8" />
      <rect x="18" y="22" width="12" height="2" rx="1" fill="currentColor" stroke="none" opacity={0.5} />
      <path d="M24 24v10" />
      <circle cx="24" cy="34" r="2" fill="currentColor" stroke="none" opacity={0.6} />
      <path d="M14 16v-2M34 16v-2" opacity={0.4} />
      <path d="M36 11h2M10 11h2" opacity={0.4} />
    </svg>
  ),
  5: ( // Prototypage
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 36l8-14 6 8 5-7 5 13" />
      <rect x="6" y="10" width="36" height="28" rx="3" />
      <circle cx="15" cy="18" r="3" fill="currentColor" stroke="none" opacity={0.3} />
      <path d="M30 14h8M30 18h6M30 22h8" opacity={0.4} />
    </svg>
  ),
  6: ( // Domotique
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22L24 8l18 14" />
      <path d="M10 19v19a2 2 0 002 2h24a2 2 0 002-2V19" />
      <rect x="19" y="29" width="10" height="11" rx="1" />
      <circle cx="32" cy="23" r="3" stroke="currentColor" fill="none" />
      <path d="M32 18v-2M32 30v2M27 23h-2M39 23h-2" opacity={0.5} />
      <path d="M29.1 20.1l-1.4-1.4M36.3 27.3l1.4 1.4M36.3 20.1l1.4-1.4M29.1 27.3l-1.4 1.4" opacity={0.4} />
    </svg>
  ),
};

// ── Couleurs d'accent par service ────────────────────────────
const serviceAccents: Record<number, { from: string; to: string; glow: string; border: string }> = {
  1: { from: "#143C62",  to: "#1e5a96",  glow: "rgba(20,60,98,0.35)",   border: "rgba(30,90,150,0.4)" },
  2: { from: "#0f4c75",  to: "#1b6ca8",  glow: "rgba(15,76,117,0.35)",  border: "rgba(27,108,168,0.4)" },
  3: { from: "#1a3a5c",  to: "#2563a8",  glow: "rgba(26,58,92,0.35)",   border: "rgba(37,99,168,0.4)" },
  4: { from: "#c2410c",  to: "#ea580c",  glow: "rgba(194,65,12,0.35)",  border: "rgba(234,88,12,0.4)" },
  5: { from: "#9a3412",  to: "#c2410c",  glow: "rgba(154,52,18,0.35)",  border: "rgba(194,65,12,0.4)" },
  6: { from: "#166534",  to: "#15803d",  glow: "rgba(22,101,52,0.35)",  border: "rgba(21,128,61,0.4)" },
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const [flipped, setFlipped] = useState(false);
  const accent = serviceAccents[service.id] ?? serviceAccents[1];
  const icon = serviceIcons[service.id];

  return (
    <div
      className="group cursor-pointer"
      style={{
        perspective: "1200px",
        // Apparition décalée à l'entrée
        animation: `cardFadeIn 0.6s ease both`,
        animationDelay: `${index * 0.1}s`,
      }}
      onClick={() => setFlipped((f) => !f)}
    >
      {/* Conteneur flip */}
      <div
        style={{
          position: "relative",
          height: "320px",
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FACE AVANT ─────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "20px",
            overflow: "hidden",
            background: "white",
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: `0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)`,
            transition: "box-shadow 0.3s ease, transform 0.3s ease",
          }}
          className="card-front"
        >
          {/* Bande de couleur supérieure */}
          <div
            style={{
              height: "6px",
              background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
            }}
          />

          {/* Contenu face avant */}
          <div className="p-8 flex flex-col h-full">
            {/* Icône dans un cercle */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "18px",
                background: `linear-gradient(135deg, ${accent.from}15, ${accent.to}25)`,
                border: `1.5px solid ${accent.border}`,
                padding: "14px",
                color: accent.from,
                marginBottom: "20px",
                boxShadow: `0 4px 16px ${accent.glow}`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="icon-box"
            >
              {icon}
            </div>

            {/* Numéro flottant */}
            <div
              style={{
                position: "absolute",
                top: "18px",
                right: "22px",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 800,
                fontSize: "3.5rem",
                lineHeight: 1,
                color: `${accent.from}10`,
                userSelect: "none",
                letterSpacing: "-0.04em",
              }}
            >
              0{service.id}
            </div>

            {/* Titre */}
            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#143C62",
                marginBottom: "10px",
                lineHeight: 1.2,
              }}
            >
              {service.title}
            </h3>

            {/* Description courte (2 lignes) */}
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                lineHeight: 1.65,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {service.description}
            </p>

            {/* Indicateur "retourner" */}
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: accent.from,
                fontSize: "0.78rem",
                fontWeight: 600,
                opacity: 0.7,
              }}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
                <path d="M4 10a6 6 0 1 0 6-6" strokeLinecap="round" />
                <path d="M7 4H4V7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Retourner pour plus
            </div>
          </div>

          {/* Effet hover : lueur en bas */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
              transform: "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.4s ease",
            }}
            className="bottom-bar"
          />
        </div>

        {/* ── FACE ARRIÈRE ────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "20px",
            overflow: "hidden",
            background: `linear-gradient(145deg, ${accent.from}, ${accent.to})`,
            boxShadow: `0 8px 32px ${accent.glow}, 0 2px 8px rgba(0,0,0,0.15)`,
            padding: "28px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Motif de fond décoratif */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.06, pointerEvents: "none" }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={`dots-${service.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#dots-${service.id})`} />
            </svg>
          </div>

          {/* Cercle décoratif */}
          <div style={{
            position: "absolute",
            top: "-30px",
            right: "-30px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }} />

          {/* En-tête face arrière */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", position: "relative" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.15)",
              padding: "9px",
              color: "white",
              flexShrink: 0,
            }}>
              {icon}
            </div>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "white",
              lineHeight: 1.2,
            }}>
              {service.title}
            </h3>
          </div>

          {/* Description complète */}
          <p style={{
            fontSize: "0.83rem",
            color: "rgba(255,255,255,0.82)",
            lineHeight: 1.7,
            marginBottom: "18px",
            position: "relative",
            flex: 1,
          }}>
            {service.description}
          </p>

          {/* Tags compétences */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", position: "relative" }}>
            {getServiceTags(service.id).map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.9)",
                  borderRadius: "100px",
                  padding: "3px 10px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.2)",
                  letterSpacing: "0.02em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Indicateur retour */}
          <div style={{
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.72rem",
            fontWeight: 600,
            position: "relative",
          }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={1.8}>
              <path d="M16 10a6 6 0 1 1-6-6" strokeLinecap="round" />
              <path d="M13 4h3v3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Cliquer pour retourner
          </div>
        </div>
      </div>

      {/* Styles CSS globaux pour les effets hover */}
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .group:hover .card-front {
          box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06) !important;
          transform: translateY(-4px);
        }
        .group:hover .icon-box {
          transform: scale(1.08) rotate(-3deg);
          box-shadow: 0 8px 24px var(--glow) !important;
        }
        .group:hover .bottom-bar {
          transform: scaleX(1) !important;
        }
      `}</style>
    </div>
  );
}

// ── Tags par service ─────────────────────────────────────────
function getServiceTags(id: number): string[] {
  const tags: Record<number, string[]> = {
    1: ["ROS2", "Vision IA", "Cobots", "Navigation"],
    2: ["ARM", "FPGA", "FreeRTOS", "CAN/SPI"],
    3: ["PLC", "SCADA", "PID", "IIoT"],
    4: ["FDM/SLA", "CAO", "Fusion 360", "Post-traitement"],
    5: ["PoC", "MVP", "Tests", "Intégration"],
    6: ["IoT", "Smart home", "HVAC", "Sécurité"],
  };
  return tags[id] ?? [];
}
