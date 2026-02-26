# Spécifications Communauté & Gamification ("MTC Social")

## 1. Vision
Transformer l'expérience individuelle d'investissement en une aventure collective. L'objectif est de créer des boucles de rétention basées sur la **Preuve Sociale** (voir ce que font les autres) et la **Collaboration** (faire ensemble).

---

## 2. Le Feed Social (Le Cœur du Réacteur)

### 2.1. "Global Impact Feed" (Dashboard)
Au lieu d'un tableau de bord statique, l'utilisateur arrive sur un flux vivant.
*   **Contenu Agrégé :**
    *   **Project Updates :** Les nouvelles des producteurs suivis (provenant de l'Outil Producteur).
    *   **User Activity :** "Alice a planté 3 chênes", "La Guilde 'Tech for Good' a atteint son objectif".
    *   **System Events :** "Nouveau projet disponible : Mangrove au Sénégal".
*   **Interactions :**
    *   **Like (Goutte d'eau) :** "Arroser" une publication (Gratuit).
    *   **Super Like (Graine) :** "Planter" une graine (Coûte des points, donne de la visibilité).
    *   **Commentaires :** Discussions contextuelles.

### 2.2. Profil Public ("Impact Identity")
*   **URL :** `make-the-change.com/u/pseudo`
*   **Composants :**
    *   **Header :** Avatar, Niveau (Explorateur -> Gardien), Titre.
    *   **La Forêt :** Visualisation 3D/2D des arbres plantés.
    *   **Trophées :** Badges débloqués (voir Gamification).
    *   **Impact Stats :** Tonnes CO2 compensées, Hectares préservés.

---

## 3. Gamification Avancée

### 3.1. Système d'XP et Niveaux
*   **Actions Rémunératrices :**
    *   Investir 1€ = 10 XP.
    *   Poster un commentaire pertinent = 5 XP (limité par jour).
    *   Partager un projet = 20 XP.
*   **Niveaux (Tiers) :**
    1.  **Graine (Niv 1-5)** : Accès basique.
    2.  **Pousse (Niv 5-10)** : Accès aux votes de gouvernance.
    3.  **Arbre (Niv 10-20)** : Accès aux projets "Early Bird".
    4.  **Forêt (Niv 20+)** : Statut Ambassadeur (Merch exclusif).

### 3.2. Badges & Collections (Biodex)
*   **Types de Badges :**
    *   **Explorateur :** "A soutenu des projets dans 3 continents".
    *   **Spécialiste :** "A financé 10 ruches".
    *   **Social :** "A parrainé 5 amis".
*   **Mécanique de "Drop" :**
    *   Lors d'un investissement, chance d'obtenir une carte "Espèce Rare" pour le Biodex.
    *   Possibilité d'échanger des doublons avec d'autres membres (Marketplace V2).

---

## 4. Les Guildes (Collaboration)

### 4.1. Structure
*   **Création :** Tout utilisateur niveau "Pousse" peut créer une Guilde.
*   **Types :** Entreprise (RSE), École, Famille, Ouverte.
*   **Page Guilde :** Logo, Description, Membres, Impact Cumulé.

### 4.2. Raids & Challenges
*   **Objectifs Communs :** "La Guilde doit planter 100 arbres avant la fin du mois".
*   **Récompense :** Badge unique de Guilde + Bonus d'XP pour tous les membres.
*   **Leaderboard Inter-Guildes :** Classement mensuel avec remise à zéro partielle (saison).

---

## 5. Architecture Technique (Frontend)

### 5.1. Nouveaux Composants (`apps/web-client`)
*   `src/components/social/Feed.tsx` : Liste virtuelle infinie (TanStack Query).
*   `src/components/social/PostCard.tsx` : Affichage polymorphique (Update Producteur vs Action Utilisateur).
*   `src/components/gamification/BadgeGrid.tsx` : Affichage des trophées.
*   `src/app/[locale]/u/[username]/page.tsx` : Page profil publique (ISR - Incremental Static Regeneration).
*   `src/app/[locale]/guilds/page.tsx` : Annuaire et création de guildes.

### 5.2. Intégration Supabase
*   **Tables requises (en plus de `social.*`) :**
    *   `gamification.levels` : Configuration des seuils d'XP.
    *   `gamification.user_xp_history` : Log des gains pour éviter la triche.
    *   `identity.guilds` & `identity.guild_members`.

### 5.3. Realtime
*   Notification "Toast" quand un membre de la guilde investit.
*   Mise à jour en direct de la barre de progression du Challenge de Guilde.
