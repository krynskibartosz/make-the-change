# Implementation Plan — Home V2 Mobile

## Phases

## Phase 1 — Documentation & garde-fous

- Ajouter le dossier `docs/landing-home-v2` et ses spécifications.
- Verrouiller la scope home-only et les règles de non-régression.

## Phase 2 — Structure Home (8 sections)

- Recomposer `home/page.tsx` avec ordre final strict.
- Supprimer rendering des sections univers/blog/stats sur la home.
- Refaire hero mobile (alignement gauche + CTA unique).

## Phase 3 — Sections métier

- Refaire timeline “Comment ça marche” (verticale).
- Refaire Projets (carrousel snap + CTA carte + lien sous carrousel).
- Refaire Boutique (carrousel snap + exclusion produits épuisés).
- Ajouter Gamification, Ecosystème, FAQ, Final CTA.

## Phase 4 — Shell, i18n, data

- Renommer tab mobile “Investir” en “Projets”.
- Ajouter namespace `home_v2` (`fr/en/nl`).
- Appliquer filtres data home produits (stock + B2C configurable).
- Conserver fallback CMS si requis par robustesse existante.

## Phase 5 — Motion/perf/accessibilité

- Ajouter reveal, snap, progression animée, marquee pause, FAQ slide.
- Respect `prefers-reduced-motion`.
- Vérifier lisibilité, tailles tap-target, et hiérarchie mobile.

## Critères d’acceptation

- La home mobile contient exactement 8 sections attendues.
- Copy et lexique conformes aux règles.
- Footer absent sur home mobile.
- Produits épuisés absents sur home.
- Aucune régression visible sur routes marketing non ciblées.

## Tests

- Vérification manuelle responsive (`<768px`, `>=768px`).
- Vérification navigation mobile (onglet Projets).
- Smoke test type-check/lint ciblé `web-client` (avec relevé des erreurs préexistantes).

## Risques & mitigations

- Risque: données partenaires insuffisantes pour logos.
  - Mitigation: fallback labels de confiance.
- Risque: filtrage B2C trop strict vide la section.
  - Mitigation: fallback contrôlé si aucun produit ne matche la règle.

