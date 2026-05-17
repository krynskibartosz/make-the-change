# 00 - Contexte commun

## Resume court

Make the Change est une experience mobile-first qui aide des personnes a comprendre, soutenir et suivre des actions concretes pour le vivant.

Le produit combine :

- une experience d'aventure quotidienne ;
- des projets de terrain ;
- une economie d'engagement ;
- un BioDex d'especes ;
- une boutique d'avantages ou produits responsables ;
- une dimension collective ;
- une future logique B2B/RSE a valider.

## Principes communs

- `[CIBLE_VALIDEE]` Le produit doit rendre l'impact plus concret, plus comprehensible et plus engageant.
- `[CIBLE_VALIDEE]` Le ton doit etre positif, clair, credible et non culpabilisant.
- `[CIBLE_VALIDEE]` Le produit ne doit pas promettre un impact non prouve.
- `[CIBLE_VALIDEE]` Le produit doit distinguer apprentissage, soutien, don, recompense et preuve d'impact.
- `[CIBLE_VALIDEE]` La promesse utilisateur initiale est : soutenir des projets biodiversite concrets, comprendre son geste et progresser dans une aventure vivante.
- `[CIBLE_VALIDEE]` Le projet reel doit rester le centre de la promesse, pas la boutique, pas la recompense, pas le reporting RSE.
- `[ACTUEL_CODE]` L'application actuelle reste un prototype avance, mock-first, avec integrations partielles.

## Ce que le produit n'est pas

- `[CIBLE_VALIDEE]` Ce n'est pas une plateforme d'investissement financier.
- `[CIBLE_VALIDEE]` Ce n'est pas un jeu de points sans lien avec le reel.
- `[CIBLE_VALIDEE]` Ce n'est pas une encyclopedie scientifique exhaustive.
- `[CIBLE_VALIDEE]` Ce n'est pas un outil RSE complet dans l'etat actuel.
- `[CIBLE_VALIDEE]` Ce n'est pas une marketplace dont la boutique serait le coeur moral du produit.

## Modules principaux

| Module | Role | Route actuelle | Statut |
|---|---|---|---|
| Aventure | Orchestrer l'experience quotidienne | `/adventure` (label UI : "Accueil") | `[ACTUEL_CODE]` |
| Projets | Presenter des actions terrain a soutenir | `/projects` | `[ACTUEL_CODE]` |
| Apprendre | Module d'apprentissage quotidien | `/learn` | `[ACTUEL_CODE]` |
| Avantages | Utiliser les Credits Impact ou decouvrir produits | `/advantages` | `[ACTUEL_CODE]` |
| Profil | Regrouper compte, BioDex, solde, historique | `/profile` | `[ACTUEL_CODE]` |
| BioDex | Collection d'especes et support pedagogique | `/profile/biodex` | `[ACTUEL_CODE]` |
| Academy | Apprentissage immersif (ecran secondaire) | `(screens)/academy` | `[ACTUEL_CODE]` mais structure a clarifier |
| Collectif / Impact | Montrer la progression collective (saisons, rewards) | `[LEGACY]` ancienne route `/impact` remplacee par `/learn` | `[A_DECIDER]` repositionner |
| RSE | Usage entreprise/collectif | — | `[HYPOTHESE]` et `[A_TESTER]` |

## Monnaies et valeur

| Nom produit | Role | Etat |
|---|---|---|
| Graines | Engagement, progression, actions non economiques | `[CIBLE_VALIDEE]` |
| Credits Impact | Valeur utilisable pour avantages/produits/rewards | `[CIBLE_VALIDEE]` |
| points | Terme technique encore present dans le code | `[ACTUEL_CODE]` + `[DEPRECIE]` cote wording utilisateur |

## Doctrine business initiale

`[AUDITE]` Audit complet dans `_audit/BUSINESS-INITIAL-PROMISE-AUDIT.md`.

`[HYPOTHESE_FORTE]` Tester d'abord la conversion autour du don pur et du soutien producteur.

`[PLUS_TARD]` RSE complete, abonnement Ambassadeur comme pilier, marketplace large, sponsoring avance et contenus premium.

## Vocabulaire sensible

- `[DEPRECIE]` `investment` ne doit pas etre utilise comme langage utilisateur final.
- `[PURGE_R7]` `Artisans Locaux` a ete retire du TypeScript (R7, 2026-05-08). Ne subsiste que dans l'ancienne base Supabase V0 (`[A_NE_PAS_TOUCHER]`). Ne pas reintroduire.
- `[DEPRECIE]` `Points biodiversite` ne doit pas etre reintegre comme nom produit.
- `[A_DECIDER]` Le vocabulaire exact entre don, soutien producteur, contribution et financement doit etre arbitre.

## Regle de prudence

`[RISQUE]` L'impact environnemental est un sujet sensible. Toute promesse d'impact doit etre accompagnee d'un niveau de preuve, d'une source ou d'une formulation prudente.

## Sources principales

- Ancienne doc : `01-VISION.md`, `02-PRODUIT.md`, `06-GAMIFICATION-ECONOMIE.md`, `07-BIODIVERSITE-BIODEX.md`.
- Audit : `_audit/CODE-VS-DOC.md`.
- Code observe : tabs, routes, mocks, services Supabase, Stripe partiel.
