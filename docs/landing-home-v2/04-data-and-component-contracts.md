# Data & Component Contracts — Home V2

## Contrats sections

## Hero

- Source copy: i18n `home_v2.hero.*`.
- Asset fond: vidéo configurable (fallback image).

## Projets

- Source: `featuredProjectsState`.
- Champs requis: `id`, `slug`, `name`, `description`, `hero_image_url`, `current_funding`, `target_budget`.
- Rendu: carte uniforme + CTA interne + progression.

## Boutique

- Source: `featuredProductsState`.
- Filtres:
  - `is_active = true`
  - `stock_quantity > 0`
  - B2C désirable via règle configurable (mots-clés/tags).
- Rendu: carte cliquable, pas de wishlist/badge/bouton flottant.

## Gamification

- Source copy: i18n `home_v2.gamification.*`.
- Données dynamiques non bloquantes en v1 (cartes statiques guidées).

## Ecosystème

- Source principale: `activeProducersState`.
- Fallback: liste locale de labels si vide/unknown.
- Rendu: logos/labels monochromes en marquee continue.

## FAQ

- Source copy: i18n `home_v2.faq.*`.
- Contrat: exactement 3 items.

## Final CTA

- Source copy: i18n `home_v2.final_cta.*`.
- 1 seul CTA primaire.

## Contrats techniques

- Namespace i18n: `home_v2` dans `fr/en/nl`.
- Ne pas casser les contrats partagés home utilisés par d’autres routes.
- Les sections supprimées de la home (univers/blog) ne doivent plus être rendues.

