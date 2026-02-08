# Revue d'Implémentation & Bonnes Pratiques DB

Ce document audite les actions de peuplement effectuées (seeding) au regard des bonnes pratiques de l'architecture PostgreSQL / Supabase actuelle.

## 1. Respect du Schéma & Contraintes

### ✅ Points Forts
- **Utilisation des UUIDs** : Toutes les insertions respectent les clés primaires `uuid` générées automatiquement ou récupérées via les relations.
- **Normalisation** : Les données ont été insérées en respectant la séparation `investment` / `commerce` / `public`.
- **Champs JSONB** : L'utilisation de `name_i18n` et `description_i18n` pour le multilingue est conforme à la stratégie "Modern i18n" du projet, évitant la duplication de tables.
- **Relations** : Les clés étrangères (`producer_id`, `user_id`, `project_id`) sont correctement maintenues, garantissant l'intégrité référentielle.

### ⚠️ Points d'Attention (Dette Technique)
- **Contours de validation** : Certains scripts ont dû contourner des contraintes manquantes ou mal définies (ex: `onConflict` sur des champs non-uniques).
  - *Recommandation* : Ajouter des index `UNIQUE` explicites sur `scientific_name` (species) et `slug` (projects) pour sécuriser les `UPSERT`.
- **Champs manquants** : Découverte de disparités entre le code TypeScript et la DB (`common_name` vs `name_i18n`, absence de `image_url` dans `species`).
  - *Recommandation* : Mettre à jour les types TypeScript générés (`database.types.ts`) pour refléter le schéma réel et éviter ces erreurs au runtime.

## 2. Qualité des Données

### ✅ Points Forts
- **Réalisme** : Utilisation de vrais noms, adresses (villes existantes) et coordonnées géographiques cohérentes.
- **Médias** : Intégration d'images Unsplash pertinentes via un mapping par mots-clés, améliorant considérablement l'UX.
- **Volumétrie** : Le volume (50 utilisateurs, ~40 produits, ~10 projets) est suffisant pour tester la pagination et les performances sans alourdir inutilement le dev.

### ⚠️ Points d'Amélioration
- **Données Temporelles** : Les dates (`created_at`, `published_at`) sont souvent "maintenant" ou aléatoires sur une période courte.
  - *Recommandation* : Pour des tests d'analytique (chartes), il faudrait lisser les données sur 12 mois glissants.
- **Richesse du contenu** : Les champs `content` (Rich Text) des articles de blog sont très basiques.
- **Enum Values** : Le cas de l'Olivier (`NE`) a montré que les énumérations (`conservation_status_enum`) sont restrictives. Il faut soit les étendre, soit nettoyer les données d'entrée.

## 3. Sécurité & Performance

### ✅ Points Forts
- **Admin API** : Utilisation du `supabaseAdmin` (service role) pour le seeding, contournant le RLS légitimement pour l'initialisation.
- **Batching** : Les scripts traitent les données par lots ou boucles contrôlées, évitant de saturer la connexion.

### ⚠️ Risques Identifiés
- **Permissions RLS** : L'échec du seeding `finance` indique que même le `service_role` peut être bloqué par des triggers ou des RLS mal configurés sur certains schémas sensibles.
  - *Recommandation* : Auditer les policies RLS du schéma `finance` et les triggers `security definer`.

## 4. Bilan Global

L'opération de peuplement est un succès fonctionnel : l'application est "vivante". Cependant, elle a mis en lumière que le **schéma de base de données a évolué plus vite que la documentation ou les types côté code**.

**Note Globale : A-**
*Le travail est solide et fonctionnel, mais nécessite un réalignement Code <> DB pour être pérenne.*
