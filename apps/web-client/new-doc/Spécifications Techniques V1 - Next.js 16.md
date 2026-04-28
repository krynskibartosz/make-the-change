Spécifications Techniques V1 : Architecture & Features
Ce document décrit l'infrastructure technique, la stack logicielle et le découpage des fonctionnalités pour la version Web/Mobile développée avec Next.js 16.
1. Stack Technique
Framework : Next.js 16 (App Router) pour les performances et le SEO.
Langage : TypeScript (pour la sécurité du typage des données espèces/dons).
Styling : Tailwind CSS (approche Mobile-First).
Gestion d'état : React Context ou Zustand (pour l'économie globale et les stats utilisateur).
Base de données : PostgreSQL (via Prisma ou Drizzle) pour la persistance des profils et du BioDex.
2. Architecture des Pages (User Flow)
Page / Écran
Fonctionnalités Clés
 
Onboarding
Introduction narrative, choix de la Faction, création de profil.
Dashboard (Profil)
Visualisation des stats (Abeilles sauvées, CO2 capturé, Points d'impact). Affichage du Streak.
Projets (Feed)
Liste des projets filtrables par type (Forêt, Faune, Océan). Barre de progression de financement.
BioDex
Grille des espèces. Détail par espèce (cartes 3D/Illustrations, stats, bouton "Évoluer").
Boutique / Récompenses
Échange des Points d'Impact contre des produits réels (API partenaire).

3. Logique Métier Critique
Calcul de l'Impact
Chaque euro donné doit être converti en unités d'impact affichables (ex: 1€ = 150 abeilles protégées). Ces ratios doivent être stockés en base de données et modifiables par projet.
Système de "Graines"
Les graines sont générées par :
Actions sociales (partage de projet).
Validation de quêtes quotidiennes.
Bonus de faction (si la faction Melli atteint un objectif, tous les membres reçoivent X graines).

4. Optimisation Mobile
L'application doit être une PWA (Progressive Web App) pour permettre une installation sur l'écran d'accueil du téléphone, avec gestion du mode hors-ligne pour la consultation du BioDex.
