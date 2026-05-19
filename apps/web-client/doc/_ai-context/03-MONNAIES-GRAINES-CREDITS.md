# 03 — Monnaies : Graines et Credits Impact

Make the Change utilise deux monnaies produit distinctes. Elles ne sont pas interchangeables et ne représentent pas la même valeur.

## Les deux monnaies

| Monnaie | Rôle | Source | Usage |
|---|---|---|---|
| **Graines** | Engagement, apprentissage, progression, reconnaissance symbolique | Don pur, missions, défis, Academy, bonus de bienvenue, parrainage, streak | Progression, enrichissement BioDex, boucle quotidienne |
| **Credits Impact** | Valeur boutique liée au soutien producteur | Soutien producteur uniquement | Produits partenaires, avantages, boutique |

## Règles des Graines

Les Graines représentent l'engagement de l'utilisateur dans son aventure.

**Ce qui peut générer des Graines :**

- Compléter une mission ou un défi.
- Progresser dans l'Academy.
- Faire un don pur, sous forme de reconnaissance symbolique.
- Faire un soutien producteur, sous forme de petit bonus symbolique.
- Recevoir un bonus de bienvenue, streak ou parrainage.

**Ce que les Graines ne font pas :**

- Les Graines ne sont pas des Credits Impact.
- Les Graines ne sont pas des euros.
- Les Graines ne prouvent pas un impact environnemental.
- Les Graines ne peuvent pas débloquer seules une espèce BioDex sans action terrain liée à un projet.
- Les Graines peuvent enrichir une fiche BioDex déjà débloquée, mais l'enrichissement n'est pas un déblocage.

## Règles des Credits Impact

Les Credits Impact représentent une valeur boutique issue d'un soutien producteur.

**Ce qui génère des Credits Impact :**

- Le soutien producteur uniquement.

**Ce qui ne génère pas de Credits Impact :**

- Un don pur.
- Un quiz Academy.
- Une mission.
- Un défi.
- Un achat produit.
- Une allocation mensuelle d'abonnement.
- Une récompense gratuite sans soutien producteur.

**À quoi servent les Credits Impact :**

- Accéder à des produits partenaires.
- Utiliser des avantages dans la boutique.
- Préparer une valeur boutique future avec les partenaires producteurs.

## Nommage technique cible

`[CIBLE_VALIDEE]` Pour le futur modèle technique :

- `impact_credits` en snake_case pour DB, API, metadata ou payloads persistants ;
- `impactCredits` en TypeScript ;
- `points` uniquement comme alias legacy temporaire.

`[INTERDIT]` Ne pas faire de remplacement global de `points`. Chaque occurrence doit être classée selon son contexte réel.

## Ce qui n'est pas encore décidé

- La correspondance exacte entre euros, soutien producteur et Credits Impact reçus.
- Les règles d'expiration, remboursement et comptabilité.
- Si 1 Credit Impact = 1 centime d'euro ou une valeur purement interne.
- Les règles précises de conversion et d'utilisation.

Tant que ces règles ne sont pas arrêtées, ne pas présenter les Credits Impact comme une monnaie bancaire, un actif financier ou une preuve d'impact.

## Ne pas confondre

| Terme | N'est pas | Est |
|---|---|---|
| Graines | Credits Impact, euros, preuve d'impact | Engagement symbolique |
| Credits Impact | Don, rendement financier, Graines, preuve d'impact | Valeur boutique issue d'un soutien producteur |
| `points` | Nom métier final | Alias technique hérité et ambigu |

## Ce qu'une IA ne doit jamais faire

- Convertir des Graines ou Credits Impact en nombre d'espèces sauvées.
- Présenter les Credits Impact comme une preuve d'impact environnemental.
- Inventer une règle de conversion non documentée.
- Dire qu'un quiz, une mission, un défi ou un achat produit génère des Credits Impact.
