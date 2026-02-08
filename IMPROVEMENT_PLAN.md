# Plan d'Amélioration & Consolidation (MVP Solo)

Ce document synthétise l'audit technique et stratégique du projet "Make the Change" et définit la feuille de route pour sécuriser le MVP tout en préparant le scale futur.

**Date de l'audit** : 06 Février 2026
**Périmètre** : `apps/web` (Admin), `apps/web-client` (User), `packages/core`.

---

## 1. État des Lieux & Métriques

### 🟢 Points Forts (À préserver)
*   **Architecture Web-Client** : Le code du client (`apps/web-client`) est sain (0 erreur de linting/type-check au moment de l'audit).
*   **Structure Monorepo** : La séparation `core` vs `apps` est en place et respecte globalement les principes du *Feature-Sliced Design*.
*   **Design System** : Le package `ui` dans le core est robuste, et l'intégration du système de thème (`theme-factory`) est fonctionnelle.
*   **Stack Technique** : Choix modernes et performants (Next.js 15+, Tailwind v4, Supabase, Biome, Playwright).

### 🟠 Points de Friction (Dette Technique)
*   **Admin (`apps/web`)** :
    *   **~110 Warnings Biome** : Principalement des usages explicites de `any` (`item: any`, `product as any`) qui contournent TypeScript.
    *   **Hooks React** : Plusieurs `useEffect` avec dépendances manquantes (risque de bugs de re-render ou boucles infinies).
*   **Core UI** : Quelques redondances détectées (ex: `data-card.tsx` existe à la racine de `shared/ui` ET dans `shared/ui/next`, risque de confusion).
*   **Tests** : Les tests E2E Playwright échouent actuellement (problème de sélecteurs ou de fixtures), ce qui brise le filet de sécurité.

---

## 2. Objectifs SMART (MVP Solo)

Pour un développeur solo visant un code "propre" avant le scale, les objectifs sont :

1.  **Zéro `any` dans l'Admin** : Éliminer 100% des `any` explicites dans `apps/web` d'ici la prochaine release majeure (remplacement par Zod schemas ou interfaces partagées).
2.  **CI/CD Vert** : Rendre le pipeline de linting (`biome check`) et de type-checking (`tsc`) passant sur l'ensemble du monorepo.
3.  **UI Unifiée** : Migrer 100% des couleurs hardcodées (`bg-emerald-500`) vers les tokens sémantiques (`bg-success`) pour permettre le changement de thème sans refactor.

---

## 3. Plan d'Action Priorisé

### Phase 1 : Sécurisation & Assainissement (Immédiat)
*Objectif : Retrouver une base de code "verte" et fiable.*

1.  **Fixer les `any` de l'Admin** :
    *   Créer des types partagés dans `@make-the-change/core/types` pour les entités (Product, Partner, Order).
    *   Typer strictement les props des composants `DataTable` et `Form`.
2.  **Réparer les Hooks React** :
    *   Corriger les tableaux de dépendances `useEffect` signalés par Biome dans `apps/web`.
3.  **Nettoyage Core UI** :
    *   Clarifier l'export de `DataCard` (garder une seule source de vérité).
    *   Supprimer les fichiers morts ou dupliqués dans `packages/core/src/shared/ui`.

### Phase 2 : Design System & Scalabilité UI (Moyen terme)
*Objectif : Rendre le design évolutif et thémable.*

1.  **Généralisation des Tokens** :
    *   Scanner le code pour les classes `text-emerald-*`, `bg-amber-*`, etc.
    *   Remplacer par `text-success`, `bg-warning` ou `text-primary`.
2.  **Finaliser `theme-factory`** :
    *   Configurer `themes/client.css` pour qu'il soit le seul point de contrôle des couleurs du `web-client`.

### Phase 3 : Automatisation & Tests (Fondations Scale)
*Objectif : Coder seul sans casser l'existant.*

1.  **Réparer le Seed E2E** : S'assurer que `pnpm test:seed` passe pour générer des données de test fiables.
2.  **Hook Pre-commit** : Installer `husky` + `lint-staged` pour empêcher le commit de nouveaux `any` ou erreurs de lint.

---

## 4. Recommandations Spécifiques "Solo Founder"

*   **Règle des 80/20 sur les Tests** : Ne teste pas tout. Teste uniquement les **parcours critiques d'argent** (Checkout, Don, Création de projet). Laisse tomber les tests unitaires de composants UI pour l'instant.
*   **Zod est ton meilleur ami** : Utilise `zod` pour valider tes formulaires ET tes retours d'API. Si tes types TS sont inférés de Zod, tu n'auras plus jamais besoin de `any`.
*   **Pas de "Premature Optimization"** : Ne sépare pas le code dans `packages/core` tant qu'il n'est pas utilisé par AU MOINS deux apps (Web et Web-Client). La duplication est préférable à une mauvaise abstraction au début.

---

## 5. Prochaine Étape (Immédiate)

Je te propose de commencer par le chantier **"Zéro `any` dans l'Admin"** car c'est la source principale de fragilité actuelle.
