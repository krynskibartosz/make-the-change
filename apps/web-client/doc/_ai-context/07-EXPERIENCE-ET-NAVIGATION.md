# 07 — Expérience utilisateur et navigation

## Structure de l'application

Make the Change est une expérience mobile-first organisée en 5 tabs principales.

| Tab | Label UI | Route | Rôle |
|---|---|---|---|
| Aventure | Accueil | `/adventure` | Hub quotidien : missions, projet recommandé, espèce BioDex, progression, solde |
| Projets | Projets | `/projects` | Liste des projets de terrain à découvrir et soutenir |
| Apprendre | Apprendre | `/learn` | Hub pédagogique : reprendre, Atlas, parcours, cours, BioDex, Toile vivante |
| Avantages | Avantages | `/advantages` | Boutique et avantages accessibles via Credits Impact |
| Profil | Profil | `/profile` | Compte, BioDex, historique, solde, abonnement, paramètres |

---

## Aventure — Hub principal

Aventure est l'écran d'entrée quotidien. Il orchestre toute l'expérience.

Ce qu'Aventure peut afficher :
- Salutation personnalisée et faction (Vie Sauvage, Terres & Forêts, Gardiens des mers)
- Une **action prioritaire** claire (mission du jour, défi, recommandation)
- La progression mensuelle
- Un projet recommandé avec son impact attendu
- L'espèce BioDex liée au projet recommandé
- La progression collective de la saison
- Le solde en Graines et en Credits Impact

**Règle clé :** Aventure doit mettre en avant une action prioritaire unique pour ne pas surcharger l'utilisateur. C'est le hub, pas le catalogue.

---

## Projets

Les projets représentent des actions concrètes de terrain :
- Ruchers (soutien producteur)
- Oliveraies, vignobles (soutien producteur)
- Récifs coralliens, zones de restauration marine (don pur)

Chaque projet peut avoir deux types d'action :
- **Don** : pour des projets de restauration ou de protection (coraux, récifs)
- **Soutien producteur** : pour des projets liés à une production réelle (ruchers, oliveraies)

---

## Apprendre

`[ACTUEL_CODE]` Apprendre n'est plus seulement un module quotidien. C'est une tab structurante qui relie apprentissage, projets, espèces, BioDex et Toile vivante.

Portes d'entrée actuelles :

- reprendre un cours ;
- explorer l'Atlas du vivant ;
- ouvrir un parcours guidé ;
- consulter tous les cours ;
- filtrer par thème, niveau, durée, projet ou espèce ;
- découvrir des contenus liés aux projets et aux espèces débloquées.

Routes principales :

| Écran | Route | Rôle |
|---|---|---|
| Hub Apprendre | `/learn` | Accueil pédagogique, reprise, Atlas preview, parcours, cours du jour, BioDex |
| Atlas du vivant | `/learn/atlas` | Vue par domaines et îles pédagogiques |
| Catalogue cours | `/learn/courses` | Recherche et filtres |
| Détail cours | `/learn/courses/[courseId]` | Fiche cours, liens projet, tags, Toile vivante |
| Parcours guidés | `/learn/parcours` | Liste des séquences guidées |
| Détail parcours | `/learn/parcours/[pathId]` | Étapes ordonnées et point d'entrée |

Domaines actuels de l'Atlas :

- Alphabet du vivant ;
- Milieux & habitats ;
- Relations du vivant ;
- Menaces ;
- Solutions ;
- Lire l'impact.

Apprendre peut renvoyer vers l'Academy pour des sessions immersives, mais ne doit jamais devenir une condition obligatoire pour donner, soutenir ou acheter.

---

## Avantages

Espace pour utiliser les Credits Impact ou découvrir des produits et avantages partenaires. C'est un prolongement du produit, pas son cœur moral.

Les produits disponibles sont liés aux partenaires producteurs (miel, huile d'olive, etc.) ou à des avantages responsables.

---

## Profil

Espace personnel de l'utilisateur :
- Compte et paramètres
- BioDex (collection d'espèces débloquées)
- Historique des soutiens et dons
- Solde Graines et Credits Impact
- Abonnement (si actif)

---

## Écrans secondaires (hors tabs)

| Écran | Accès | Rôle |
|---|---|---|
| Academy | Depuis Aventure ou Apprendre | Module pédagogique immersif |
| Challenges / Défis | Depuis Aventure | Objectifs structurés quotidiens |
| Détail projet | Depuis Projets | Présentation complète d'un projet avec action (don ou soutien) |
| BioDex espèce | Depuis Profil / BioDex | Fiche détaillée d'une espèce |
| Paiement | Depuis Projets (don ou soutien) | Flow de paiement |
| Toile vivante | Depuis Apprendre / BioDex / écosystème | Relations entre espèces, milieux, projets et nœuds |

---

## Factions utilisateur

L'utilisateur choisit une faction lors de l'onboarding. Les trois factions cibles sont :

| Faction | Mascotte | Thème |
|---|---|---|
| Vie Sauvage | Melli | Pollinisateurs, faune sauvage |
| Terres & Forêts | Sylva | Forêts, terres, agriculture durable |
| Gardiens des mers | Ondine | Océans, récifs, littoraux |

La faction influence la personnalisation de l'expérience dans Aventure.

---

## Expérience minimale cible V1

Pour qu'un utilisateur puisse vivre une expérience complète, il doit pouvoir :

1. Comprendre ce qu'il peut faire (vision claire).
2. Choisir une action adaptée (don, soutien, apprentissage).
3. Voir l'impact attendu avec prudence.
4. Recevoir une progression claire (Graines, trace, BioDex si applicable).
5. Apprendre pourquoi son geste compte.
6. Retrouver ses traces dans son profil.
7. Ne pas confondre engagement, apprentissage, don, soutien, achat, récompense et preuve.

---

## Ce qui n'est pas encore décidé sur l'expérience

- Le nombre exact de cartes/actions visibles dans Aventure.
- Le format exact de l'action prioritaire dans Aventure.
- La place exacte des accès secondaires (Academy, BioDex, collectif) dans Aventure.
- Les labels UI finaux ("Apprendre", "Accueil" sont des labels de prototypage).
- Le rôle final du module Collectif / saisons dans la navigation.
