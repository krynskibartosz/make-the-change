# 08 — Apprendre, Academy, gamification, missions et défis

## Principe central

La gamification aide l'utilisateur à comprendre et à revenir. Elle ne remplace pas la preuve d'impact. Les Graines, les badges, les streaks, les niveaux et les Credits Impact ne sont jamais une preuve d'impact environnemental.

---

## Apprendre — rôle actuel

`[ACTUEL_CODE]` La tab Apprendre est implémentée dans `src/app/[locale]/(tabs)/learn`.

Elle relie :

- Academy ;
- Atlas du vivant ;
- parcours guidés ;
- catalogue de cours ;
- projets ;
- espèces BioDex ;
- Toile vivante ;
- domaines pédagogiques ;
- progression en Graines.

Apprendre sert à comprendre les projets, les espèces, les écosystèmes et les limites de l'impact. Ce n'est pas un substitut au don ou au soutien.

## Architecture pédagogique actuelle

`[ACTUEL_CODE]` Le catalogue pédagogique est défini principalement dans :

- `src/lib/learning/catalog.ts` ;
- `src/lib/learning/schema.ts` ;
- `src/lib/learning/selectors.ts`.

Types d'entrées actuels :

| Type | Rôle |
|---|---|
| `academy_unit` | Cours Academy interactif |
| `project_experience` | Expérience liée à un projet |
| `living_web` | Exploration de la Toile vivante |

Domaines actuels :

- Alphabet du vivant ;
- Milieux & habitats ;
- Relations du vivant ;
- Menaces ;
- Solutions ;
- Lire l'impact.

Parcours actuels :

- Les bases du vivant ;
- Comprendre les pollinisateurs ;
- Forêts & sols ;
- Récifs & océans ;
- Lire l'impact.

## Quatre modules distincts

| Module | Rôle | Relation à l'impact |
|---|---|---|
| **Aventure** | Orchestre l'expérience quotidienne. Hub principal. | Dirige vers les actions, ne crée pas l'impact seul |
| **Academy** | Apprend et comprend. Contenu pédagogique immersif. | Renforce la compréhension, ne crée pas d'impact direct |
| **Missions** | Impulsions courtes et guidées pour agir chaque jour. | Donne des Graines, ne prouve pas l'impact |
| **Défis** (Challenges) | Objectifs structurés sur plusieurs jours. | Donne des Graines, ne prouve pas l'impact |

**Aventure orchestre tout.** L'Academy apprend. Les Missions guident. Les Défis structurent. Les Projets portent l'impact réel.

---

## Academy — règles officielles

L'Academy est une brique pédagogique importante, non obligatoire.

**Ce que l'Academy fait :**
- Apprendre à connaître des espèces, des écosystèmes et des gestes d'impact.
- Donner des Graines à la complétion.
- Recommander des projets ou espèces pour contextualiser.
- Renforcer la compréhension et la rétention.

**Ce que l'Academy ne fait pas (règles fermes) :**
- L'Academy ne débloque jamais seule une espèce BioDex.
- L'Academy ne génère pas de Credits Impact.
- L'Academy ne bloque jamais l'accès au don, au soutien ou à l'achat.
- L'Academy de base est gratuite en V1.

**Hypothèse (non validée) :** L'Academy peut devenir un moteur de rétention quotidienne et être recommandée comme action prioritaire dans Aventure.

---

## Missions — règles officielles

Une Mission est une impulsion courte et guidée qui donne une direction quotidienne à l'utilisateur.

**Ce que les Missions font :**
- Donner une direction claire et actionnables.
- Renvoyer vers l'Academy, les projets, le BioDex ou la dimension collective.
- Donner des Graines à la complétion.

**Ce que les Missions ne font pas :**
- Les Missions ne créent pas d'impact terrain direct.
- Les Missions ne génèrent pas de Credits Impact.
- Les Missions ne débloquent pas seules une espèce BioDex.

---

## Défis (Challenges) — règles officielles

Un Défi est un objectif structuré ou détaillé, pouvant durer plusieurs jours.

**Ce que les Défis font :**
- Donner des Graines à la complétion.
- Proposer des objectifs plus avancés ou thématiques.

**Ce que les Défis ne font pas :**
- Les Défis ne créent pas d'impact terrain direct.
- Les Défis ne génèrent pas de Credits Impact.

---

## Factions et mascottes

Les factions structurent l'identité de l'utilisateur dans l'aventure.

Factions cibles :
- **Vie Sauvage / Melli** — Pollinisateurs et faune sauvage
- **Terres & Forêts / Sylva** — Forêts, terres et agriculture durable
- **Gardiens des mers / Ondine** — Océans, récifs, littoraux

La faction influence la personnalisation dans Aventure. Elle n'a pas d'impact mécanique validé sur les récompenses pour l'instant.

---

## Boucles produit validées

### Boucle quotidienne
1. Ouvrir Aventure.
2. Recevoir une action courte (mission, défi, recommandation).
3. Gagner des Graines.
4. Voir une progression.
5. Découvrir un projet ou une espèce.

### Boucle don pur
1. Découvrir un projet.
2. Comprendre l'impact attendu.
3. Faire un don.
4. Recevoir des Graines, une trace, et éventuellement une espèce BioDex si le lien est documenté.
5. Suivre l'historique dans le profil.

### Boucle soutien producteur
1. Découvrir un projet producteur.
2. Comprendre le producteur, la filière, l'impact attendu.
3. Soutenir le projet.
4. Recevoir des Credits Impact, un bonus symbolique de Graines, et éventuellement une espèce BioDex si le lien est documenté.
5. Utiliser les Credits Impact dans les avantages ou produits partenaires.

### Boucle BioDex
1. Débloquer une espèce (via don ou soutien lié à cette espèce).
2. Comprendre son rôle et son lien avec le projet.
3. Enrichir la fiche avec des Graines (niveau 2).
4. Revenir compléter la collection.

---

## Ce qui n'est pas encore décidé sur la gamification

- Les termes UI exacts : "Mission", "Défi", "Challenge", "Action du jour", "Objectif" — à trancher.
- Le niveau exact de visibilité de l'Academy dans Aventure.
- Le format exact des missions (quotidien vs hebdomadaire).
- Le système final de factions (noms, mascottes, rôle mécanique).
- Le nombre exact de Graines par action.
- Si les Graines peuvent être dépensées ou seulement accumulées.
- Le statut produit final des labs Kinnu / Kinnu V2.
