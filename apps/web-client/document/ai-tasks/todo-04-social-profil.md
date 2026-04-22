# Mission IA : Améliorations UX Modules Collectif & Profil

## Contexte et Objectif
Améliorer la lisibilité et l'ergonomie des modules communautaires et personnels, et introduire un point d'entrée pour la monétisation (Gardiens).

## Tâches à accomplir (Checklist)
- [ ] **Module Collectif - Clarté des Factions :** Sous les pourcentages de progression globale (les jauges de chaque faction), ajouter le nom explicite de la faction en petit texte discret (ex: text-xs text-gray-400 : "Terres & Forêts", "Vie Sauvage").
- [ ] **Module Collectif - Filtre d'Activité :** Ajouter un "Toggle" ou des Tabs au-dessus de la liste du flux d'activité ("Impact Global"). Ce filtre doit permettre de basculer l'affichage entre :
  - "Ma Faction" (Actif par défaut si l'utilisateur en a une : affiche uniquement les actions de ses alliés).
  - "Global" (Affiche toutes les actions).
- [ ] **Module Profil - Point d'entrée Upsell :** Sur la page Profil d'un utilisateur gratuit, ajouter une icône de couronne (👑) dorée en haut à droite (près des paramètres) OU une petite carte esthétique sous les statistiques indiquant "Passez au niveau supérieur. Découvrez les privilèges des Gardiens." Au clic, cela doit ouvrir la modale ou rediriger vers la page du Paywall.
- [ ] **Module Profil - Accessibilité Login :** Sur l'écran de profil d'un visiteur non-connecté, augmenter légèrement la luminosité du lien "Ou utiliser une adresse email" et y ajouter une icône d'enveloppe (✉️) pour qu'il paraisse plus cliquable.

## Fichiers probables à modifier
- Dossier du module Collectif : `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(adventure)\collectif\` ou `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(adventure)\community\`
- Pages de Profil utilisateur : 
  - `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(adventure)\profile\page.tsx`
  - `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(dashboard)\dashboard\profile\page.tsx`

## Règles de comportement
1. Assure-toi que les filtres du flux d'activité filtrent bien les données (soit via un state local si les données sont déjà chargées, soit via l'API).
2. Pour la carte "Gardiens", fais en sorte qu'elle paraisse "Premium" (bordure dorée subtile, fond légèrement différent).
