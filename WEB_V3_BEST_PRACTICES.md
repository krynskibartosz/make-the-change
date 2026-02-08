# Bonnes Pratiques Web V3 & Admin

Ce document synthétise les patterns architecturaux et UX identifiés dans le dossier `web-v3` et le module `old-products`, à adopter pour le développement futur.

## 1. Architecture Frontend

### Séparation Logique / Vue
- **Pattern Controller**: Utiliser un composant "Controller" (ex: `ProductDetailController`) qui gère toute la logique (data fetching, state, handlers) et passe des props pures à des composants "View" (ex: `ProductDetailsEditor`).
- **Avantages**: Testabilité accrue, séparation des préoccupations, facilité de maintenance.

### Gestion d'État par URL (nuqs)
- **Principe**: Synchroniser l'état des filtres, de la pagination et des onglets avec l'URL.
- **Bibliothèque**: `nuqs` (Next URL Query Strings).
- **Usage**: Permet le partage de liens avec contexte, le support du bouton retour navigateur, et simplifie le state management global.

### Server Actions & Optimistic UI
- **Mutations**: Utiliser les Server Actions pour toutes les opérations d'écriture (Create/Update/Delete).
- **Feedback Immédiat**: Implémenter `useOptimistic` ou des patterns similaires pour mettre à jour l'UI instantanément avant la confirmation serveur.
- **Auto-save**: Utiliser le hook `useOptimisticAutoSave` pour les formulaires longs (ex: édition produit), avec debounce et indicateur de statut (Sauvegarde..., Sauvegardé, Erreur).

## 2. UX & Composants

### Gestion des Traductions (I18n)
- **Architecture**:
  - `TranslationProvider`: Contexte global pour le formulaire, stockant les traductions non-default.
  - `TranslatableInput` / `TranslatableTextArea`: Composants UI qui affichent la valeur de la langue courante ou un fallback visuel.
  - `LanguageSwitcher`: Sélecteur de langue avec indicateurs de complétion (badges, pourcentages).
- **Pattern**: Ne pas dupliquer les champs dans le DOM. Un seul champ affiché, valeur changée dynamiquement selon la langue sélectionnée.
- **Données**: Stocker les traductions dans des colonnes JSONB (`name_i18n`, `description_i18n`) pour une flexibilité maximale sans multiplier les colonnes.

### Gestion des Médias
- **Upload**: Utiliser `EntityGallerySection` pour une gestion unifiée (upload, reorder via dnd-kit, suppression).
- **Crop**: Intégrer `react-easy-crop` pour le recadrage côté client avant upload.
- **Optimisation**: Générer des BlurHash à l'upload pour un chargement progressif des images.

### Tableaux de Données (DataList)
- **Vues**: Offrir le choix entre vue Liste (Table) et vue Grille (Cards).
- **Filtres**: Facettes filtrables synchronisées avec l'URL.
- **Pagination**: Pagination curseur ou offset, synchronisée avec l'URL.

## 3. Formulaires & Validation

### Zod & React Hook Form
- **Validation**: Schémas Zod stricts partagés entre client et serveur (via `validators/product.ts`).
- **Types**: Inférence de types TypeScript directement depuis les schémas Zod.
- **Champs Complexes**: Utiliser `Controller` de RHF pour les composants custom (Select, DatePicker, Upload).

### Auto-save Pattern
- **Hook**: `useOptimisticAutoSave`
- **Comportement**:
  - `onChange` -> Update local state (immédiat) -> Debounce -> Server Action.
  - Gestion des erreurs avec possibilité de retry.
  - Indicateur visuel discret dans le header.

## 4. Structure de Dossiers Recommandée (App Router)

```
app/[locale]/admin/(dashboard)/entity/
├── page.tsx                # Server Component (Data Fetching)
├── components/
│   ├── entity-controller.tsx # Client Component (Logic)
│   ├── entity-editor.tsx     # Client Component (View)
│   ├── entity-list.tsx
│   └── ...
├── hooks/
│   └── use-entity-logic.ts
└── actions.ts              # Server Actions
```

## 5. Performance
- **Streaming**: Utiliser `Suspense` pour les parties lentes de l'interface.
- **Bundle Size**: Imports dynamiques pour les composants lourds (ex: éditeurs riches, cartes).
- **Images**: Utiliser `next/image` avec `sizes` appropriées et `blurDataURL`.
