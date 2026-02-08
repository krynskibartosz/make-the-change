# Documentation Import de Données Producteurs

Ce document détaille le processus mis en place pour peupler la base de données avec les produits des partenaires **Habeebee** et **Ilanga Nature**.

## 1. Sources de Données

| Producteur | URL Source | Méthode d'Extraction |
|------------|------------|----------------------|
| **Habeebee** | `https://habeebee.be` | API Shopify JSON (`/products.json`) |
| **Ilanga Nature** | `https://www.ilanga-nature.com/en/shop` | Scraping DOM via Playwright |

## 2. Stratégie de Mapping

Les données extraites sont normalisées pour correspondre au schéma de la base de données Supabase (`commerce` et `investment`).

### Hiérarchie
1. **Producteur** (`investment.producers`) : Créé ou mis à jour basé sur le nom.
2. **Catégorie** (`commerce.categories`) : Créée à la volée basée sur les catégories du site source.
3. **Produit** (`commerce.products`) :
   - **Nom/Description** : Stockés en `jsonb` (`name_i18n`, `description_i18n`) pour le support multilingue (FR/EN).
   - **Prix** : Converti en `price_points` (x10) et `price_eur_equivalent`.
   - **Stock** : Initialisé à 100 par défaut.
   - **Images** : URL de l'image principale stockée dans le tableau `images`.

## 3. Scripts d'Automatisation

Les scripts sont situés dans `apps/web/scripts/` :

- `seed-producers.ts` : Script principal d'orchestration.
- `scrapers/habeebee.ts` : Logique spécifique pour l'API Shopify.
- `scrapers/ilanga.ts` : Logique spécifique pour le scraping HTML.

### Comment exécuter le script

Depuis le dossier `apps/web` :

```bash
npx tsx scripts/seed-producers.ts
```

## 4. Résultats de l'Import Initial

- **Habeebee** : ~30 produits importés.
- **Ilanga Nature** : ~12 produits importés.
- **Catégories créées** : Soins, Baumes, Miels, Épicerie, etc.

## 5. Notes Techniques

- Le script gère l'idempotence (ne crée pas de doublons si relancé).
- Les variantes de produits (tailles, poids différents) ne sont pas gérées pour l'instant (création du produit "parent" uniquement).
