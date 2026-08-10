// ============================================================
// data/services.ts
// Données centralisées des services Aeris Consulting
// Modifier ici pour mettre à jour toutes les cards du site
// ============================================================

export interface Service {
  id: number;
  title: string;
  image: string;
  description: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "Robotique",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    description:
      "Conception et programmation de robots industriels et collaboratifs. De la cartographie à la navigation autonome, nous concevons des systèmes robotiques sur mesure adaptés à vos contraintes de production.",
  },
  {
    id: 2,
    title: "Systèmes embarqués",
    image: "src/assets/systeme.jpg",
    description:
      "Développement de firmware temps réel, architectures ARM/FPGA et chaînes de compilation croisée. Nous maîtrisons l'ensemble de la chaîne du bas niveau au système d'exploitation embarqué.",
  },
  {
    id: 3,
    title: "Automatisme",
    image:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80",
    description:
      "Conception d'automatismes industriels, supervision SCADA, régulation PID et contrôle-commande de processus. Nous optimisons vos lignes de production par l'automatisation intelligente.",
  },
  {
    id: 4,
    title: "Impression & Modélisation 3D",
    image: "src/assets/imprimante.jpg",
    description:
      "Prototypage rapide, modélisation FreeCAD,DAO impression FDM/SLA et post-traitement de pièces. Du concept à la pièce physique en quelques heures pour valider vos idées avant industrialisation.",
  },
  {
    id: 5,
    title: "Prototypage",
    image:
      "https://images.unsplash.com/photo-1581082174218-59b33e8e0d28?w=600&q=80",
    description:
      "Réalisation de preuves de concept, bancs de test et MVPs hardware en cycles itératifs courts. Nous transformons vos idées en démonstrateurs fonctionnels pour convaincre investisseurs et clients.",
  },
  {
    id: 6,
    title: "Domotique",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    description:
      "Intégration de systèmes connectés, maison intelligente et optimisation énergétique des bâtiments. Nous concevons des architectures IoT robustes et interopérables pour le bâtiment du futur.",
  },
];
