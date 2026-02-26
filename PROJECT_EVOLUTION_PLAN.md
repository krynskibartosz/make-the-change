# Plan d'Évolution Stratégique : Make the Change

Ce document synthétise l'état actuel du projet et propose une feuille de route pour transformer la plateforme en un écosystème communautaire engageant, inspiré des meilleures pratiques (Tree-Nation) et adapté à votre architecture technique moderne.

---

## 1. État des Lieux (Analyse Technique)

### ✅ Ce qui est Solide (Le Socle)
*   **Architecture "Enterprise-Grade" :** Monorepo (Next.js 16 + Supabase), séparation claire Admin/Client, Typage strict (TypeScript 5.9). C'est une base saine pour scaler.
*   **Modèle de Données (Supabase) :**
    *   Gestion native de l'internationalisation (`name_i18n`, `jsonb`).
    *   Séparation des domaines (`investment`, `commerce`, `gamification`) qui évite le code spaghetti.
    *   Le concept de **Biodex** (Table `investment.species`) est un excellent point de départ pour la gamification.
*   **UX/UI :** Utilisation de composants modernes (Tailwind 4, Framer Motion) offrant une expérience fluide.

### ⚠️ Les Manques Actuels (Les Freins)
*   **Expérience "Solo" :** L'utilisateur investit et achète seul. Il n'y a aucune visibilité sur ce que font les autres (pas de feed, pas de commentaires, pas de notion d'équipe).
*   **Transactions Simulées :** Le code d'investissement (`invest-client.tsx`) utilise encore des `setTimeout` et ne semble pas écrire réellement en base ou déclencher de paiement.
*   **Contenu Statique :** Les pages projets sont belles mais statiques. Il manque le "pouls" du terrain (photos récentes, nouvelles du producteur).
*   **Checkout "Placeholder" :** La brique E-commerce n'est pas finalisée pour la prise de commande réelle.

---

## 2. Vision Cible : "L'Investissement Participatif Gamifié"

L'objectif est de passer d'un "Site d'investissement" à un "Réseau Social de l'Impact".

### Pilier A : La Transparence Sociale (Le Feed)
*Inspiration Tree-Nation : "Updates"*
*   **Le concept :** Chaque projet possède un mur d'actualités.
*   **L'évolution :**
    *   Permettre aux utilisateurs de **commenter** et **réagir** (Graine, Goutte, Cœur) aux updates.
    *   Créer un **Feed Global** sur le Dashboard qui agrège les news des projets suivis ET l'activité des amis ("Alice a débloqué le badge 'Protecteur des Abeilles'").

### Pilier B : L'Identité d'Impact (Profil Public)
*Inspiration Tree-Nation : "Ma Forêt"*
*   **Le concept :** Votre profil ne doit pas être juste un formulaire d'édition (`profile.controller.tsx`), mais une vitrine.
*   **L'évolution :**
    *   Page publique `/u/pseudo` affichant la "Forêt Virtuelle" (tous les projets soutenus).
    *   **Certificats Partageables :** Génération dynamique d'images pour Instagram/LinkedIn à chaque investissement.

### Pilier C : La Collaboration (Guildes)
*Inspiration : Jeux MMO / Challenge RSE*
*   **Le concept :** On s'engage plus quand on le fait ensemble.
*   **L'évolution :**
    *   Création de **"Guildes"** (Entreprises, Familles, Écoles).
    *   **Quêtes de Groupe :** "La Guilde qui finance 50 arbres cette semaine gagne un bonus de points."

---

## 3. Roadmap Technique (Priorisée)

### Phase 1 : "Alive" (Rendre la plateforme vivante)
*   [ ] **Backend :** Créer le schéma `social` (posts, comments, reactions).
*   [ ] **Frontend :** Implémenter le composant `ActivityFeed` sur le Dashboard.
*   [ ] **Data :** Remplacer les fausses transactions par de vrais écritures en base (`investment.investments`).

### Phase 2 : "Share" (Viralité)
*   [ ] **Feature :** Page de profil publique (Public Read-Only).
*   [ ] **Feature :** Générateur de Certificats (PDF/Image) basé sur les données réelles.
*   [ ] **Feature :** "Gifting" (Flux d'achat pour offrir un arbre via email).

### Phase 3 : "Play" (Rétention)
*   [ ] **Gamification :** Connecter le `Leaderboard` aux vraies actions (points gagnés par euro investi).
*   [ ] **Feature :** Système de Guildes (Tables `teams` et `team_members`).

---

## 4. Questions Stratégiques (Pour affiner le dev)

*   **B2B vs B2C :** Si la priorité est le B2B (RSE), les "Guildes" deviennent la fonctionnalité n°1 (Teams d'entreprise). Si c'est B2C, le "Feed" et le "Profil Public" sont prioritaires.
*   **Contenu :** Qui va poster les photos des champs ? Les producteurs ont-ils l'outil pour le faire (app mobile simplifiée) ? Ou est-ce centralisé ?
