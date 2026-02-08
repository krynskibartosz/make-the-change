# Analyse d'Opportunités de Réutilisation : Vers la Version Finale

Ce document présente une analyse approfondie des actifs techniques existants (`web-v3`, `_old-products`, `web-client`) afin d'identifier les composants, logiques et patterns à intégrer dans le projet final. L'objectif est de capitaliser sur l'existant pour accélérer le développement tout en garantissant une qualité optimale.

## 1. Synthèse Globale

L'analyse révèle une **qualité de code élevée** dans les modules prototypes, avec une adoption précoce de standards modernes (Next.js App Router, Zod, Server Actions). Le défi principal n'est pas la réécriture, mais l'**unification** et l'**intégration** cohérente de ces briques éparses.

**Score de Réutilisation Estimé : 70%** (Logique métier et UI complexe).

---

## 2. Pépites Techniques par Domaine

### A. Expérience Éditeur (Admin) - ⭐ Critique

C'est le domaine où la valeur récupérable est la plus forte. Les patterns UX "complexes" sont déjà résolus.

| Composant / Pattern | Source | Description & Valeur | Action Requise |
| :--- | :--- | :--- | :--- |
| **`useOptimisticAutoSave`** | `_old-products` | Gère l'état de sauvegarde (pristine/saving/saved/error) avec debounce et retry. **Indispensable** pour l'UX admin. | **Déjà migré**. À étendre aux autres entités (Projets, Partenaires). |
| **`TranslationContext`** | `_old-products` | Permet l'édition multilingue (FR/EN/NL) sans recharger la page, avec switch de contexte local. | **Déjà migré**. À généraliser pour les champs SEO de toutes les entités. |
| **Architecture Controller/View** | `web-v3` | Séparation stricte : Le Controller gère la data/actions, la Vue gère le rendu pur. | **Standardiser** ce pattern pour toutes les pages Admin. |

### B. Gestion des Médias - ⭐ Haute Valeur

La gestion d'images (upload, crop, optimisation) est complexe et chronophage à recoder.

| Composant / Pattern | Source | Description & Valeur | Action Requise |
| :--- | :--- | :--- | :--- |
| **`useImageCrop`** | `web-v3` | Hook complet : sélection fichier, validation (type/taille), crop client (`react-easy-crop`), génération Blob. | **Migrer** dans `apps/web/src/hooks` ou `@make-the-change/core/ui`. |
| **`EntityGallerySection`** | `web-v3` | Interface de gestion de collection d'images (Drag & Drop, suppression, ajout). | **Migrer** le composant UI. Vérifier la dépendance à `dnd-kit`. |
| **`BlurHash` Generation** | `web-v3` | Génération de placeholder flou à l'upload pour un chargement progressif. | Intégrer la logique de génération côté client ou serveur. |

### C. Validation & Données - ⭐ Fondamental

La couche de données est robuste et doit être la fondation du projet final.

| Composant / Pattern | Source | Description & Valeur | Action Requise |
| :--- | :--- | :--- | :--- |
| **Schémas Zod** | `web-v3` & `_old-products` | Validateurs stricts (`productFormSchema`, `projectFormSchema`). Gèrent les règles métier complexes (dates, prix). | **Centraliser** dans `@make-the-change/core/validators` pour partage Client/Admin/Server. |
| **Server Actions** | `web-v3` | Mutations typées pour la DB. | Adapter pour utiliser le client DB Drizzle centralisé. |

### D. UI & Composants (Public & Admin)

| Composant / Pattern | Source | Description & Valeur | Action Requise |
| :--- | :--- | :--- | :--- |
| **`DataList` & Filtres** | `web-v3` | Tableaux de données avec filtres synchronisés dans l'URL (via `nuqs`). | Adopter pour toutes les listes Admin (Produits, Commandes). |
| **`useCart`** | `web-client` | Logique de panier e-commerce (ajout, total, persistance). | Réutiliser tel quel pour le Front Client. |
| **Design System** | `web-client` | Implémentation de `shadcn/ui`. | S'assurer que le thème (tokens CSS) est cohérent avec l'Admin. |

---

## 3. Matrice de Priorité de Migration

Cette matrice définit l'ordre dans lequel les composants doivent être intégrés au projet final.

### Priorité 1 : Immédiat (Fondations Admin)
- [x] `useOptimisticAutoSave` (Fait)
- [x] `TranslationContext` & composants associés (Fait)
- [ ] `useImageCrop` & `EntityGallerySection` (Prochaine étape logique)
- [ ] Unification des Schémas Zod dans `packages/core`

### Priorité 2 : Court Terme (Listes & Navigation)
- [ ] Pattern `DataList` + `nuqs` (Filtres URL)
- [ ] Composants de Layout Admin (`PageHeader`, `Sidebar` optimisée)

### Priorité 3 : Moyen Terme (Fonctionnalités Métier Spécifiques)
- [ ] Logique de Panier (`useCart`)
- [ ] Composants "Projet" (`ProjectCard`, `DonationFlow`)

---

## 4. Points d'Attention & Risques

1.  **Dépendances** : Vérifier que les bibliothèques utilisées dans les prototypes (ex: `react-easy-crop`, `dnd-kit`, `nuqs`) sont bien installées dans le `package.json` du projet final.
2.  **Styles** : Attention aux conflits CSS si les prototypes utilisaient des versions différentes de Tailwind ou des variables CSS personnalisées.
3.  **Contexte d'Exécution** : Certains hooks (ex: `useCart`) supposent un contexte spécifique (React Context). Ne pas oublier de migrer les `Providers` associés.

## 5. Conclusion

Le projet dispose d'une **"boîte à outils" de très haute qualité** dispersée dans les anciens dossiers. L'effort ne doit pas être mis sur la re-création, mais sur l'**assemblage**.
La stratégie gagnante est de traiter `web-v3` comme une librairie interne de composants "Gold Standard" et de les importer méthodiquement dans l'application finale.
