// ============================================================
// pages/ContactPage.tsx
// Page Contact avec formulaire EmailJS
//
// CONFIGURATION EMAILJS :
// 1. Créer un compte sur https://www.emailjs.com
// 2. Créer un "Email Service" → copier le Service ID
// 3. Créer un "Email Template" → copier le Template ID
// 4. Account → copier la Public Key
// 5. Créer un fichier .env à la racine du projet avec :
//    VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//    VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
//    VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
// ============================================================

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useInView } from "../hooks/useInView";

// Clés EmailJS lues depuis les variables d'environnement
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// ============================================================
// Données statiques
// ============================================================
const sujets = [
  "Projet Robotique",
  "Systèmes embarqués",
  "Automatisme industriel",
  "Impression & Modélisation 3D",
  "Prototypage",
  "Domotique",
  "Autre demande",
];

const contactInfos = [
  {
    label: "Email",
    value: "aerisconsultingbf@gmail.com",
    href: "mailto:aerisconsultingbf@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Téléphone",
    value: "+226 67 42 83 16",
    href: "tel:+22667428316",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 17.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: "Adresse",
    value: "Ouagadougou, Burkina Faso",
    href: "https://maps.google.com/?q=Ouagadougou,Burkina+Faso",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Horaires",
    value: "Lun – Ven : 8h00 – 17h00",
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

// ============================================================
// Composant principal
// ============================================================
export default function ContactPage() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const { ref: contentRef, inView: contentInView } = useInView(0.1);

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
    const newErrors: Partial<typeof formData> = {};
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Adresse email invalide";
    }
    if (!formData.sujet) {
      newErrors.sujet = "Veuillez choisir un sujet";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message trop court (20 caractères minimum)";
    }
    return newErrors;
  };

  // Envoi via EmailJS
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus("sending");
    try {
      // Les noms des champs (name="nom", name="email"...) doivent correspondre
      // aux variables de votre template EmailJS : {{nom}}, {{email}}, {{sujet}}, {{message}}
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setFormData({ nom: "", email: "", sujet: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  // Classe CSS des champs selon leur état d'erreur
  const inputClass = (field: keyof typeof formData) =>
    `w-full px-4 py-3 rounded-xl border text-gray-800 text-sm placeholder-gray-400 bg-white outline-none transition-all duration-200 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-[#143C62] focus:ring-2 focus:ring-[#143C62]/10"
    }`;

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================================================
          HERO - Fond bleu brand + décorations géométriques
      ================================================ */}
      <section className="relative pt-32 pb-24 bg-[#143C62] overflow-hidden">

        {/* Texture grille décorative */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid-contact" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-contact)" />
          </svg>
        </div>

        {/* Cercles décoratifs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-500/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-orange-500/5 rounded-full pointer-events-none" />

        {/* Contenu */}
        <div
          ref={heroRef}
          className="relative z-10 max-w-2xl mx-auto px-6 text-center"
          style={{
            opacity: heroInView ? 1 : 0,
            transform: heroInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
           
          <span className="text-orange-400 font-semibold text-sm uppercase tracking-widest">
            Parlons de votre projet
          </span>
          <h1 className="font-bold text-5xl md:text-6xl text-white mt-3 mb-6">
            Contact
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed">
            Vous avez un projet en tête ? Une question technique ?
            Écrivez-nous, nous vous répondrons sous 24h.
          </p>

          {/* Badge réponse rapide */}
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-medium px-4 py-2 rounded-full mt-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Réponse garantie sous 24h
          </div>
        </div>
      </section>

      {/* ================================================
          SECTION PRINCIPALE : Infos + Formulaire
      ================================================ */}
      <section className="py-20 bg-white">
        <div
          ref={contentRef}
          className="max-w-7xl mx-auto px-6"
          style={{
            opacity: contentInView ? 1 : 0,
            transform: contentInView ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

            {/* ---- Colonne gauche : coordonnées ---- */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-bold text-2xl text-[#143C62] mb-2">Nos coordonnées</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Notre équipe est disponible du lundi au vendredi pour répondre
                  à toutes vos questions.
                </p>
              </div>

              {/* Cartes d'information */}
              {contactInfos.map((info) => (
                <div
                  key={info.label}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#143C62]/20 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-[#143C62]/10 rounded-xl flex items-center justify-center text-[#143C62] shrink-0 group-hover:bg-[#143C62] group-hover:text-white transition-all duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-[#143C62] text-sm mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        target={info.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="text-gray-500 text-sm hover:text-orange-500 transition-colors whitespace-pre-line"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm whitespace-pre-line">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Réseaux sociaux */}
              <div className="pt-2">
                <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">
                  Suivez-nous
                </p>
                <div className="flex gap-3">
                  {[
                    {
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/company/aeris-consulting/",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      ),
                    },
                    {
                      label: "Facebook",
                      href: "https://www.facebook.com/profile.php?id=100088140007030",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                           <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      ),
                    },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-[#143C62] text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Colonne droite : formulaire ---- */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">

                {/* Écran de succès après envoi */}
                {status === "success" ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} className="w-10 h-10">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-2xl text-[#143C62] mb-3">Message envoyé</h3>
                    <p className="text-gray-500 mb-8">
                      Merci pour votre message. Nous vous répondrons dans les 24 heures.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="bg-[#143C62] hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form ref={formRef} noValidate>
                    <h2 className="font-bold text-xl text-[#143C62] mb-6">
                      Envoyez-nous un message
                    </h2>

                    {/* Nom + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Nom complet <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          placeholder="Jean Dupont"
                          className={inputClass("nom")}
                        />
                        {errors.nom && (
                          <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jean@exemple.fr"
                          className={inputClass("email")}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Sujet */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Sujet <span className="text-orange-500">*</span>
                      </label>
                      <select
                        name="sujet"
                        value={formData.sujet}
                        onChange={handleChange}
                        className={inputClass("sujet")}
                      >
                        <option value="">Sélectionnez un sujet</option>
                        {sujets.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.sujet && (
                        <p className="text-red-500 text-xs mt-1">{errors.sujet}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message <span className="text-orange-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Décrivez votre projet, vos contraintes techniques, votre calendrier..."
                        rows={5}
                        className={`${inputClass("message")} resize-none`}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.message ? (
                          <p className="text-red-500 text-xs">{errors.message}</p>
                        ) : (
                          <span />
                        )}
                        <span className="text-gray-300 text-xs">
                          {formData.message.length} caractères
                        </span>
                      </div>
                    </div>

                    {/* Erreur d'envoi EmailJS */}
                    {status === "error" && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        Une erreur s'est produite. Vérifiez vos clés EmailJS dans le fichier .env
                        ou contactez-nous directement par email.
                      </div>
                    )}

                    {/* Bouton envoi */}
                    <button
                      onClick={handleSubmit}
                      disabled={status === "sending"}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#143C62] hover:bg-orange-500 disabled:bg-gray-300 text-white font-semibold px-10 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                          </svg>
                          Envoyer le message
                        </>
                      )}
                    </button>

                    <p className="text-gray-400 text-xs mt-4">
                      En envoyant ce formulaire, vous acceptez que vos données soient utilisées
                      pour traiter votre demande.
                    </p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}