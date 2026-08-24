// ============================================================
// pages/ContactPage.tsx
// Page Contact — formulaire relié à EmailJS
//
// NOTE SUR LES CLÉS
// La Public Key EmailJS n'est pas un secret : Vite l'inline dans le
// bundle JS livré au navigateur, elle est donc lisible par tous quoi
// qu'il arrive. Elle est écrite en clair ici pour éviter toute
// dépendance aux variables de build (Docker / Dokploy), source de
// pannes silencieuses en production.
// La protection réelle se fait côté EmailJS :
//   Account > Security > Allowed Origins → ajouter le domaine du site
// ============================================================

import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useInView } from "../hooks/useInView";

// ── Configuration EmailJS ────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_nc73soi";
const EMAILJS_TEMPLATE_ID = "c4uuavm";
const EMAILJS_PUBLIC_KEY = "pdvy58y_12XizQ7bM";

// Adresse affichée et utilisée comme recours si l'envoi échoue
const CONTACT_EMAIL = "aerisconsultingbf@gmail.com";

// ── Sujets proposés dans le formulaire ───────────────────────
const sujets = [
  "Projet robotique",
  "Systèmes embarqués",
  "Automatisme industriel",
  "Impression & modélisation 3D",
  "Prototypage",
  "Domotique",
  "Autre demande",
];

// ── Coordonnées ──────────────────────────────────────────────
const coordonnees = [
  {
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    label: "Téléphone",
    value: "+226 67 42 83 16",
    href: "tel:+22667428316",
  },
  {
    label: "Adresse",
    value: "Ouagadougou, Burkina Faso",
    href: null,
  },
  {
    label: "Horaires",
    value: "Lundi – Vendredi, 8h – 17h",
    href: null,
  },
];

// ============================================================
// Composant principal
// ============================================================
export default function ContactPage() {
  const { ref: contentRef, inView: contentInView } = useInView(0.05);

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Initialisation du SDK EmailJS au montage de la page
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

  // Validation des champs avant envoi
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
      next.message = "Un peu plus de détails nous aiderait (20 caractères minimum)";
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
      // On envoie l'état React plutôt que le DOM du formulaire :
      // plus fiable, notamment avec l'autofill du navigateur qui ne
      // déclenche pas toujours onChange.
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
      // Détail technique réservé à la console développeur —
      // jamais exposé au visiteur
      console.error("[Contact] Échec de l'envoi EmailJS :", err);
      setStatus("error");
    }
  };

  // Style commun des champs
  const fieldClass = (field: keyof typeof formData) =>
    `w-full bg-transparent border-0 border-b py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none transition-colors duration-200 ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-[#143C62]"
    }`;

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================================================
          EN-TÊTE
      ================================================ */}
      <section className="pt-32 pb-4">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[13px] uppercase tracking-[0.2em] text-orange-600 font-medium mb-5">
            Contact
          </p>
          <h1
            className="text-[#143C62] max-w-2xl"
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Parlons de votre projet
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-lg mt-6">
            Décrivez-nous votre besoin technique. Nous revenons vers vous
            sous 24 heures ouvrées.
          </p>
        </div>
      </section>

      {/* ================================================
          CORPS — coordonnées + formulaire
      ================================================ */}
      <section className="py-20">
        <div
          ref={contentRef}
          className="max-w-6xl mx-auto px-6"
          style={{
            opacity: contentInView ? 1 : 0,
            transform: contentInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* ---- Coordonnées ---- */}
            <aside className="lg:col-span-4">
              <dl className="divide-y divide-gray-100 border-t border-gray-100">
                {coordonnees.map((item) => (
                  <div key={item.label} className="py-5">
                    <dt className="text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-1.5">
                      {item.label}
                    </dt>
                    <dd className="text-[15px] text-gray-800">
                      {item.href ? (
                        <a
                          href={item.href}
                          className="hover:text-orange-600 transition-colors duration-200"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Liens sociaux */}
              <div className="mt-10 flex gap-5">
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-gray-400 hover:text-[#143C62] transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-gray-400 hover:text-[#143C62] transition-colors duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </aside>

            {/* ---- Formulaire ---- */}
            <div className="lg:col-span-8">

              {status === "success" ? (
                /* État de confirmation */
                <div className="border-t border-gray-100 pt-12">
                  <div className="flex items-start gap-4 max-w-md">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth={1.5}
                      className="w-7 h-7 shrink-0 mt-0.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                    </svg>
                    <div>
                      <h2 className="text-xl font-semibold text-[#143C62] mb-2">
                        Message bien reçu
                      </h2>
                      <p className="text-gray-500 leading-relaxed mb-8">
                        Merci de nous avoir écrit. Notre équipe vous répondra
                        sous 24 heures ouvrées à l'adresse que vous avez indiquée.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="text-[15px] font-medium text-orange-600 hover:text-orange-700 transition-colors duration-200"
                      >
                        Écrire un autre message
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Formulaire */
                <form ref={formRef} onSubmit={handleSubmit} noValidate>

                  {/* Nom + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <div>
                      <label
                        htmlFor="nom"
                        className="block text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-1"
                      >
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
                        <p className="text-red-500 text-xs mt-2">{errors.nom}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-1"
                      >
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
                        <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Sujet */}
                  <div className="mt-8">
                    <label
                      htmlFor="sujet"
                      className="block text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-1"
                    >
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
                      <p className="text-red-500 text-xs mt-2">{errors.sujet}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mt-8">
                    <label
                      htmlFor="message"
                      className="block text-[11px] uppercase tracking-[0.15em] text-gray-400 mb-1"
                    >
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
                    <div className="flex justify-between items-start gap-4 mt-2">
                      <p className="text-red-500 text-xs">{errors.message ?? ""}</p>
                      <span className="text-gray-300 text-xs shrink-0 tabular-nums">
                        {formData.message.length}
                      </span>
                    </div>
                  </div>

                  {/* Message d'échec — formulation neutre, aucun détail technique */}
                  {status === "error" && (
                    <div className="mt-8 border-l-2 border-orange-400 pl-4 py-1">
                      <p className="text-[15px] text-gray-800 mb-1">
                        L'envoi n'a pas abouti.
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Vous pouvez réessayer dans un instant, ou nous écrire
                        directement à{" "}
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="text-orange-600 hover:text-orange-700 underline underline-offset-2"
                        >
                          {CONTACT_EMAIL}
                        </a>
                        .
                      </p>
                    </div>
                  )}

                  {/* Bouton d'envoi */}
                  <div className="mt-10 flex items-center gap-6">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex items-center gap-2.5 bg-[#143C62] hover:bg-[#0f2d4a] disabled:bg-gray-300 text-white text-[15px] font-medium px-8 py-3.5 rounded-full transition-colors duration-300 disabled:cursor-not-allowed"
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
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
                          Envoi…
                        </>
                      ) : (
                        <>
                          Envoyer
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            className="w-4 h-4"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 leading-relaxed max-w-[16rem]">
                      Vos données servent uniquement à traiter votre demande.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
