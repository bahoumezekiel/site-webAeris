// ============================================================
// pages/ContactPage.tsx
// Page Contact — composition en deux panneaux :
//   • panneau bleu Aeris (coordonnées) à gauche
//   • formulaire sur fond clair à droite
//
// NOTE SUR LES CLÉS
// La Public Key EmailJS n'est pas un secret : Vite l'inline dans le
// bundle livré au navigateur, elle est donc lisible quoi qu'il arrive.
// Elle est écrite en clair pour éviter toute dépendance aux variables
// de build (Docker / Dokploy), source de pannes silencieuses.
// ============================================================

import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useInView } from "../hooks/useInView";

// ── Configuration EmailJS ────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_nc73soi";
const EMAILJS_TEMPLATE_ID = "template_rb7to6k";
const EMAILJS_PUBLIC_KEY = "pdvy58y_12XizQ7bM";

const CONTACT_EMAIL = "aerisconsultingbf@gmail.com";

// ── Sujets proposés ──────────────────────────────────────────
const sujets = [
  "Projet robotique",
  "Systèmes embarqués",
  "Automatisme industriel",
  "Impression & modélisation 3D",
  "Prototypage",
  "Domotique",
  "Autre demande",
];

// ── Coordonnées affichées dans le panneau bleu ───────────────
const coordonnees = [
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Téléphone",
    value: "+226 67 42 83 16",
    href: "tel:+22667428316",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 17.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: "Adresse",
    value: "Ouagadougou, Burkina Faso",
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Horaires",
    value: "Lundi – Vendredi, 8h – 17h",
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

// ── Réseaux sociaux ──────────────────────────────────────────
const reseaux = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

// ============================================================
// Composant principal
// ============================================================
export default function ContactPage() {
  const { ref: panelRef, inView: panelInView } = useInView(0.05);

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Initialisation du SDK EmailJS
  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

  // Mise à jour d'un champ et effacement de son erreur
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validation avant envoi
  const validate = () => {
    const next: Partial<typeof formData> = {};
    if (!formData.nom.trim()) {
      next.nom = "Indiquez votre nom";
    }
    if (!formData.email.trim()) {
      next.email = "Indiquez votre email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Cette adresse semble incorrecte";
    }
    if (!formData.sujet) {
      next.sujet = "Choisissez un sujet";
    }
    if (!formData.message.trim()) {
      next.message = "Écrivez votre message";
    } else if (formData.message.trim().length < 20) {
      next.message = "Un peu plus de détails nous aiderait";
    }
    return next;
  };

  // Envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("sending");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          nom: formData.nom,
          email: formData.email,
          sujet: formData.sujet,
          message: formData.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setStatus("success");
      setFormData({ nom: "", email: "", sujet: "", message: "" });
    } catch (err) {
      // Détail technique réservé à la console — jamais exposé au visiteur
      console.error("[Contact] Échec de l'envoi EmailJS :", err);
      setStatus("error");
    }
  };

  // Style commun des champs du formulaire
  const fieldClass = (field: keyof typeof formData) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
        : "border-gray-200 hover:border-gray-300 focus:border-[#143C62] focus:ring-4 focus:ring-[#143C62]/10"
    }`;

  const labelClass = "block text-[13px] font-medium text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div
          ref={panelRef}
          className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_40px_-12px_rgba(20,60,98,0.15)]"
          style={{
            opacity: panelInView ? 1 : 0,
            transform: panelInView ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">

            {/* ================================================
                PANNEAU GAUCHE — bleu Aeris
            ================================================ */}
            <aside className="relative lg:col-span-5 bg-[#143C62] p-8 sm:p-10 lg:p-12 overflow-hidden">

              {/* Halos décoratifs discrets */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-500/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5 blur-2xl" />

              <div className="relative">
                {/* Surtitre */}
                <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                  Contact
                </p>

                {/* Titre */}
                <h1
                  className="text-white"
                  style={{
                    fontSize: "clamp(1.9rem, 3vw, 2.6rem)",
                    fontWeight: 700,
                    lineHeight: 1.12,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Parlons de
                  <br />
                  <span className="text-orange-400">votre projet</span>
                </h1>

                {/* Accroche */}
                <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">
                  Décrivez-nous votre besoin technique. Notre équipe revient
                  vers vous sous 24 heures ouvrées.
                </p>

                {/* Séparateur */}
                <div className="my-9 h-px bg-white/10" />

                {/* Coordonnées */}
                <ul className="space-y-6">
                  {coordonnees.map((item) => (
                    <li key={item.label} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-400">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] uppercase tracking-[0.14em] text-white/40">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="break-words text-[14.5px] text-white/90 transition-colors duration-200 hover:text-orange-400"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[14.5px] text-white/90">{item.value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Réseaux sociaux */}
                <div className="mt-10 flex gap-3">
                  {reseaux.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors duration-300 hover:bg-orange-500 hover:text-white"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* ================================================
                PANNEAU DROIT — formulaire
            ================================================ */}
            <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">

              {status === "success" ? (
                /* ---- Confirmation d'envoi ---- */
                <div className="flex h-full min-h-[26rem] flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth={1.5}
                      className="h-8 w-8"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                    </svg>
                  </div>
                  <h2 className="mb-3 text-2xl font-bold text-[#143C62]">
                    Message bien reçu
                  </h2>
                  <p className="mb-8 max-w-sm leading-relaxed text-gray-500">
                    Merci de nous avoir écrit. Nous vous répondrons sous
                    24 heures ouvrées à l'adresse indiquée.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="rounded-full border border-[#143C62]/20 px-7 py-3 text-[15px] font-medium text-[#143C62] transition-colors duration-300 hover:border-transparent hover:bg-[#143C62] hover:text-white"
                  >
                    Écrire un autre message
                  </button>
                </div>
              ) : (
                /* ---- Formulaire ---- */
                <form onSubmit={handleSubmit} noValidate>
                  <h2 className="mb-1 text-xl font-bold text-[#143C62]">
                    Envoyez-nous un message
                  </h2>
                  <p className="mb-8 text-sm text-gray-400">
                    Tous les champs sont requis.
                  </p>

                  {/* Nom + Email */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nom" className={labelClass}>
                        Nom complet
                      </label>
                      <input
                        id="nom"
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        autoComplete="name"
                        className={fieldClass("nom")}
                      />
                      {errors.nom && (
                        <p className="mt-2 text-xs text-red-500">{errors.nom}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vous@exemple.com"
                        autoComplete="email"
                        className={fieldClass("email")}
                      />
                      {errors.email && (
                        <p className="mt-2 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Sujet */}
                  <div className="mt-5">
                    <label htmlFor="sujet" className={labelClass}>
                      Sujet
                    </label>
                    <select
                      id="sujet"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleChange}
                      className={`${fieldClass("sujet")} cursor-pointer ${
                        formData.sujet ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      {sujets.map((s) => (
                        <option key={s} value={s} className="text-gray-900">
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.sujet && (
                      <p className="mt-2 text-xs text-red-500">{errors.sujet}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mt-5">
                    <label htmlFor="message" className={labelClass}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre projet, vos contraintes techniques, votre calendrier…"
                      rows={6}
                      className={`${fieldClass("message")} resize-none leading-relaxed`}
                    />
                    <div className="mt-2 flex items-start justify-between gap-4">
                      <p className="text-xs text-red-500">{errors.message ?? ""}</p>
                      <span className="shrink-0 text-xs tabular-nums text-gray-300">
                        {formData.message.length}
                      </span>
                    </div>
                  </div>

                  {/* Échec d'envoi — formulation neutre */}
                  {status === "error" && (
                    <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50/60 px-4 py-3.5">
                      <p className="mb-0.5 text-[14.5px] font-medium text-gray-800">
                        L'envoi n'a pas abouti.
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-gray-600">
                        Réessayez dans un instant, ou écrivez-nous directement à{" "}
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="font-medium text-orange-600 underline underline-offset-2 hover:text-orange-700"
                        >
                          {CONTACT_EMAIL}
                        </a>
                        .
                      </p>
                    </div>
                  )}

                  {/* Bouton d'envoi */}
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex items-center gap-2.5 rounded-full bg-[#143C62] px-8 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Envoi en cours…
                        </>
                      ) : (
                        <>
                          Envoyer le message
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            className="h-4 w-4"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="max-w-[15rem] text-xs leading-relaxed text-gray-400">
                      Vos données servent uniquement à traiter votre demande.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
