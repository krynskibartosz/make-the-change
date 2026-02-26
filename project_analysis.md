# Analyse du Projet Make the Change

## 1. Vue d'ensemble
**Make the Change** est une plateforme monorepo (Next.js 16) divisée en deux applications distinctes :
- **`apps/web-client`** : L'interface publique pour les particuliers (B2C) et investisseurs.
- **`apps/web`** : Le back-office pour les administrateurs et les partenaires (Producteurs).

Le projet est en phase de **prototypage avancé** (MVP). Les fondations techniques sont solides, mais plusieurs flux utilisateurs critiques (paiement, investissement réel) sont simulés.

---

## 2. Audit Frontend (`apps/web-client`)

### 2.1 Composants Clés
L'interface utilise une architecture modulaire avec des composants partagés (`@make-the-change/core/ui`) et des composants spécifiques à l'application.

*   **Auth (`src/app/[locale]/(auth)`)** : Login, Register, Forgot Password implémentés avec Server Actions.
*   **Marketing (`src/app/[locale]/(marketing)`)** :
    *   `hero-section`, `featured-projects` : Présentation statique mais soignée.
    *   `biodex` : Catalogue d'espèces interactif (point fort de gamification).
*   **Dashboard (`src/app/[locale]/(dashboard)`)** :
    *   `investments` : Liste des investissements (actuellement simulée ou partielle).
    *   `profile` : Édition des données personnelles avec sauvegarde optimiste.
*   **E-commerce (`src/app/[locale]/(marketing-no-footer)`)** :
    *   `cart` : Panier géré en local (client-side only).
    *   `checkout` : Page de paiement non finalisée (placeholder).

### 2.2 Manques Identifiés (Frontend)
*   **Absence de Feed Social :** Aucune trace de composants pour afficher un flux d'activité, des commentaires ou des likes.
*   **Interactivité Limitée :** Les pages projets sont "read-only". Pas de possibilité de poser des questions ou d'interagir avec le producteur.
*   **Feedback Utilisateur :** Le système de toast est basique. Manque de notifications temps réel (cloche de notification).

---

## 3. Audit Base de Données (Supabase)

### 3.1 Schémas Existants
L'architecture DB est très mature, utilisant des schémas PostgreSQL pour isoler les domaines.

*   **`public`** : Profils utilisateurs (`profiles`), pays, langues.
*   **`investment`** :
    *   `projects` & `producers` : Cœur du métier.
    *   `project_updates` : Table existante pour les news, mais sous-exploitée (pas de commentaires).
*   **`commerce`** :
    *   `products`, `orders`, `order_items` : Prêt pour le E-commerce.
*   **`gamification`** :
    *   `challenges`, `quests`, `user_inventory` : Structure prête pour la gamification avancée.
*   **`identity`** : Gestion des consentements et sessions.

### 3.2 Manques Identifiés (DB)
*   **Schéma `social` inexistant :** Pas de tables pour `comments`, `likes`, `follows`, `shares`. C'est le blocage majeur pour l'aspect communautaire.
*   **Relations Guildes :** Aucune structure pour gérer des équipes ou des groupes d'utilisateurs (`guilds`, `team_members`).

---

## 4. Audit API (`src/app/api`)

### 4.1 Endpoints Actuels
*   **`web-client`** :
    *   `/payments/create-intent` : Tentative d'intégration Stripe.
    *   `/projects/featured` : Récupération de données pour la home.
    *   `/webhooks/stripe` : Listener pour les événements de paiement.
*   **`web` (Admin)** :
    *   CRUD complet sur `projects`, `products`, `users`.
    *   Upload d'images (`/upload/product-images`).

### 4.2 Manques API
*   Pas d'endpoints pour poster des commentaires ou des réactions.
*   Pas d'API pour la création de contenu "Producteur" depuis une interface mobile simplifiée (nécessaire pour l'option 4b).

---

## 5. Conclusion
Le projet est un **"Beau Coquillage"** : l'extérieur (UI, DB Structure) est magnifique et professionnel, mais l'intérieur (Logique sociale, Transactions réelles) est encore vide ou simulé.

Pour passer au niveau supérieur (Communauté & Rétention), il faut impérativement :
1.  **Activer le Social :** Créer le schéma DB et les API pour les interactions.
2.  **Connecter le Réel :** Remplacer les simulations d'investissement par de vraies écritures DB.
3.  **Outiller les Producteurs :** Leur donner un moyen simple de nourrir la machine à contenu.
