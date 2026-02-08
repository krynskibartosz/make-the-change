# Plan de Réimplémentation : Dashboard Admin "Make The Change"

Ce document détaille la stratégie pour réimplémenter les fonctionnalités avancées de l'ancien dashboard (`legacy/apps-backup`) sur la nouvelle architecture de base de données Supabase (`2026`).

## 🎯 Objectif
Porter l'expérience utilisateur "Premium" de l'ancien projet (Auto-save, Optimistic UI, i18n fluide) sur la nouvelle structure de données robuste, en simplifiant la couche technique grâce aux nouvelles colonnes JSONB et aux types natifs de Supabase.

---

## 🏗 1. Architecture & Socle Technique (Core)

L'ancien projet reposait sur une logique complexe de synchronisation. La nouvelle version sera plus simple mais tout aussi réactive.

### 1.1 Stack Technique
- **Framework** : Next.js 15 (App Router).
- **UI Kit** : Shadcn/ui (déjà en place).
- **Forms** : React Hook Form (RHF) + Zod.
- **Data Fetching** : Server Actions (pour les mutations) + TanStack Query (pour la cache et l'état optimiste).
- **State** : Nuqs (pour les filtres d'URL) + Zustand (pour les états globaux complexes si besoin).

### 1.2 Le Pattern "Auto-Save Optimiste"
L'ancien hook `useOptimisticAutoSave` doit être réécrit pour supporter les Server Actions.

**Spécifications :**
1.  **Debounce** : 1000-1500ms sur la frappe.
2.  **Status Indicator** : "Sauvegardé" (vert), "En cours..." (jaune), "Erreur" (rouge).
3.  **Dirty Checking** : Ne sauvegarder que les champs modifiés (`form.formState.dirtyFields`).
4.  **BeforeUnload** : Avertir l'utilisateur si une sauvegarde est pendante en quittant la page.

### 1.3 Nouvelle Stratégie i18n (JSONB)
**Changement Majeur** : L'ancien système utilisait une table `translations` séparée. Le nouveau système utilise des colonnes JSONB (`name_i18n`, `description_i18n`) directement sur les tables.

*   **Adaptation du `TranslationContext`** :
    *   Au lieu de faire un appel API séparé pour les traductions, le contexte manipulera simplement des champs imbriqués dans le formulaire principal.
    *   Exemple RHF : `register("name_i18n.en")`, `register("name_i18n.fr")`.
    *   Le sélecteur de langue du dashboard servira juste à basculer la visibilité des champs ou à changer l'onglet de langue actif, sans rechargement de données.

---

## 🧩 2. Modules Fonctionnels & Mapping DB

### 2.1 Module "Investissement" (Ex-Biodex & Partners)

C'est le cœur du métier. Il regroupe la gestion des Projets, des Espèces et des Producteurs.

| Fonctionnalité Legacy | Table Supabase Cible | Améliorations & Notes |
| :--- | :--- | :--- |
| **Producteurs** (Partners) | `investment.producers` | Utiliser `location` (PostGIS) pour la géolocalisation. Intégrer `status` (pending/active). |
| **Projets** (Investments) | `investment.projects` | Gérer `financial_plan` via JSONB. Lier à `species_id`. |
| **Espèces** (Biodex) | `investment.species` | Conserver la logique de "déblocage" (gamification). |
| **Mises à jour** | `investment.project_updates` | Nouveau module pour poster des news (photos, texte) aux investisseurs. |

**Composants Clés à Migrer :**
*   `LocationPicker` : Un champ de formulaire pour sélectionner un point sur une carte (Mapbox/Leaflet) -> écrit dans la colonne `location` (type `geography`).
*   `ProducerStatusBadge` : Gestion des états (Pending -> Active).

### 2.2 Module "Commerce" (Produits & Commandes)

Gestion des ventes, désormais multi-devises (EUR).

| Fonctionnalité Legacy | Table Supabase Cible | Améliorations & Notes |
| :--- | :--- | :--- |
| **Produits** | `commerce.products` | Supporte `price_eur` et `price_usd`. Gestion du stock (`stock_quantity`). |
| **Catégories** | `commerce.categories` | Arborescence (parent/enfant). |
| **Commandes** | `commerce.orders` | Vue détaillée "readonly" pour la compta, mais éditable pour le statut (`status`). |
| **Abonnements** | `commerce.subscriptions` | Gestion des récurrences (Stripe integration). |

**Composants Clés à Migrer :**
*   `PriceInput` : Champ formaté avec devise.
*   `ProductVariantEditor` : Si gestion de variantes (taille/couleur) via JSONB.

### 2.3 Module "Contenu" (CMS)

Pour le blog et les ressources éducatives.

| Fonctionnalité Legacy | Table Supabase Cible | Améliorations & Notes |
| :--- | :--- | :--- |
| **Blog** | `content.blog_posts` | Éditeur Riche (TipTap ou MDX). Gestion `seo_title`, `seo_desc`. |
| **Médias** | `content.media_assets` | **Centralisation** : Tous les uploads passent par ici. |

---

## 🛠 3. Composants UI & Utilitaires à Migrer

Ces composants sont transversaux et doivent être priorisés.

### 3.1 `ImageManager` (Refonte Complète)
L'ancien système était complexe. Le nouveau doit utiliser **Supabase Storage**.
*   **Fonctionnalités** : Drag & Drop, Preview, Crop (optionnel).
*   **Back-end** :
    1.  Upload fichier -> Bucket `media`.
    2.  Création entrée -> Table `content.media_assets`.
    3.  Lien -> Table cible (ex: `investment.producers` champ `images` array).

### 3.2 `GenericFilters` (Filtrage Avancé)
Réimplémenter le système de filtres dynamiques.
*   Utiliser les paramètres d'URL (`?status=active&type=farmer`) pour que les liens soient partageables.
*   Composant `DataTable` générique avec tri serveur, pagination et filtres.

### 3.3 `TranslationStatus`
Un indicateur visuel (camembert ou barre de progression) montrant le % de complétion des traductions pour une entité (calculé sur la présence des clés `fr/en` dans les colonnes JSONB).

---

## 📅 4. Plan d'Implémentation (Roadmap)

### Phase 1 : Fondations (Semaine 1)
1.  [ ] Mettre en place le layout Admin (Sidebar, Header, Breadcrumbs).
2.  [ ] Créer le hook `useOptimisticAutoSave` compatible Server Actions.
3.  [ ] Créer le composant `ImageUploader` connecté à Supabase Storage.

### Phase 2 : Le Pilote "Producteurs" (Semaine 1-2)
*Pourquoi ? C'est une entité centrale mais isolée, idéale pour valider le pattern JSONB i18n.*
1.  [ ] Liste des producteurs (`DataTable` + Filtres).
2.  [ ] Formulaire de création (Wizard simple).
3.  [ ] Formulaire d'édition complet (Auto-save, i18n, Images, Localisation).

### Phase 3 : Commerce & Projets (Semaine 3)
1.  [ ] Migrer la gestion des Produits (similaire aux Producteurs).
2.  [ ] Implémenter la gestion des Projets (lien avec Producteurs).

### Phase 4 : Ledger & Users (Semaine 4)
1.  [ ] Vue "readonly" des transactions de points (`ledger.points_transactions`).
2.  [ ] Vue profils utilisateurs (`public.profiles`) avec attribution de rôles (Admin/Producer).

## 📝 Conventions de Code (Qualité)

*   **Server Components** par défaut pour le fetching (pages listes).
*   **Client Components** isolés pour les formulaires (`"use client"`).
*   **Zod Schemas** : Un seul fichier `schemas.ts` par domaine (ex: `investment.schemas.ts`) partagé entre client et server actions.
*   **Types** : Générés automatiquement via Supabase (`database.types.ts`), ne pas redéfinir manuellement les interfaces DB.
