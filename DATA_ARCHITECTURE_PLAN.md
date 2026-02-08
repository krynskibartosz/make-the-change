# Plan d'Architecture de Données : Consolidation & Typage (Legacy vers 2026)

Ce document analyse les écarts entre les fonctionnalités "Riches" de l'ancien projet et la base de données actuelle Supabase. Bonne nouvelle : **la majorité des colonnes nécessaires existent déjà**. 

Le défi n'est donc pas de *créer* des tables, mais de **standardiser et typer** strictement les colonnes JSONB pour garantir l'intégrité des données, comme c'était le cas avec les schémas Zod de l'ancien projet.

---

## 1. 🧬 Biodex (Table `investment.species`)

L'ancien projet gérait une progression pédagogique (Débutant -> Expert).

### État Actuel DB
- ✅ `content_levels` (jsonb) : Présent.
- ✅ `scientific_name` (text) : Présent.
- ✅ `conservation_status` (enum) : Présent.

### 🛠 Ce qu'il faut implémenter (Typage JSONB)
La colonne `content_levels` ne doit pas accepter n'importe quoi. Elle doit respecter cette structure stricte :

```typescript
// Interface pour investment.species.content_levels
interface SpeciesContentLevels {
  beginner: {
    title: string;
    description: string; // Texte riche ou Markdown
    unlocked_at_level: 0;
  };
  intermediate: {
    title: string;
    description: string;
    unlocked_at_level: 5; // Exemple de gamification
  };
  advanced: {
    title: string;
    description: string;
    unlocked_at_level: 10;
  };
}
```

**Recommandation** : Ajouter une contrainte de validation Zod dans l'API d'écriture pour refuser tout JSON qui ne contient pas ces 3 clés.

---

## 2. 🛍 Commerce (Table `commerce.products`)

C'est le module le plus complexe. La base actuelle est très complète (`variants`, `dimensions`, `nutrition_facts`).

### État Actuel DB
- ✅ `dimensions`, `weight_grams` : Logistique OK.
- ✅ `nutrition_facts`, `allergens` : Compliance Food OK.
- ✅ `min_tier` : Contrôle d'accès OK.

### 🛠 Ce qu'il faut implémenter (Structures Complexes)

#### A. Variantes (Gestion des déclinaisons)
La colonne `variants` (jsonb) doit gérer les attributs multiples (Taille + Couleur).

```typescript
// Interface pour commerce.products.variants
interface ProductVariants {
  attributes: {
    name: string; // ex: "Taille"
    values: string[]; // ex: ["S", "M", "L"]
  }[];
  skus: {
    id: string;
    sku: string;
    attributes: Record<string, string>; // { "Taille": "M" }
    price_adjustment?: number; // Delta prix en points
    stock_quantity: number;
  }[];
}
```

#### B. Disponibilité Saisonnière
La colonne `seasonal_availability` (jsonb) permet de n'afficher les produits que quand c'est pertinent (ex: fruits de saison).

```typescript
// Interface pour commerce.products.seasonal_availability
interface SeasonalAvailability {
  months: number[]; // [1, 2, 12] pour Hiver
  is_preorder_allowed: boolean;
  harvest_period?: {
    start: string; // "2026-06-01"
    end: string;   // "2026-08-30"
  };
}
```

---

## 3. 👩‍🌾 Producteurs (Table `investment.producers`)

L'ancien projet mettait l'accent sur le "Storytelling" et la transparence.

### État Actuel DB
- ✅ `social_media` (jsonb) : Présent.
- ✅ `capacity_info` (jsonb) : Présent.

### 🛠 Ce qu'il faut implémenter

#### A. Réseaux Sociaux & Liens
Standardiser `social_media` pour éviter les clés disparates (`fb` vs `facebook`).

```typescript
// Interface pour investment.producers.social_media
interface ProducerSocials {
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string; // ou 'x'
}
```

#### B. Capacité de Production
La colonne `capacity_info` est cruciale pour les investisseurs (KPIs d'impact).

```typescript
// Interface pour investment.producers.capacity_info
interface ProducerCapacity {
  annual_production: number;
  unit: string; // "kg", "liters", "units"
  surface_area_hectares?: number;
  employees_count?: number;
  established_year?: number;
}
```

---

## 4. 📝 Blog & Contenu (Table `content.blog_posts`)

### État Actuel DB
- ✅ `seo_title`, `seo_description` : Colonnes dédiées.
- ⚠️ `content` : JSONB (probablement pour TipTap/ProseMirror).

### 🛠 Ce qu'il faut implémenter

#### Structure de l'Éditeur Riche
Ne pas stocker du HTML brut dans le JSONB, mais la structure JSON de l'éditeur (ex: TipTap) pour permettre une réédition facile et un rendu natif (React Native) futur.

```typescript
// Interface pour content.blog_posts.content
interface TipTapContent {
  type: 'doc';
  content: Array<{
    type: 'paragraph' | 'heading' | 'image' | 'bulletList';
    attrs?: Record<string, any>;
    content?: any[];
  }>;
}
```

---

## 5. 🚀 Stratégie de Mise en Œuvre

### Étape 1 : Création de la Librairie de Types (Shared Lib)
Ne pas dupliquer ces interfaces. Créer un package ou un dossier partagé `@/types/db-json-schemas.ts`.

### Étape 2 : Validateurs Zod (Runtime)
Pour chaque interface TypeScript ci-dessus, créer le schéma Zod correspondant.
*   Utiliser ces schémas dans les **Server Actions** lors de l'insertion/mise à jour.
*   C'est la seule façon de garantir que le JSON stocké dans Postgres reste propre.

### Étape 3 : Migration des Données Existantes (Nettoyage)
Si des données de test existent déjà dans ces colonnes JSONB, faire un script de migration pour les normaliser ou les vider avant de mettre en production les validateurs stricts.

---

## Résumé des Actions DB
| Table | Colonne | Action Requise |
| :--- | :--- | :--- |
| `investment.species` | `content_levels` | Implémenter interface Gamification (3 niveaux) |
| `commerce.products` | `variants` | Implémenter structure SKU/Attributs |
| `commerce.products` | `seasonal_availability` | Définir structure Mois/Périodes |
| `investment.producers` | `capacity_info` | Standardiser les KPIs de production |
