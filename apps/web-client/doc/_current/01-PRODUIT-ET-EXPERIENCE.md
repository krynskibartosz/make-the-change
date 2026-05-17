# 01 - Produit et experience

## Role de ce document

Ce document decrit l'experience produit voulue et l'etat fonctionnel observe, sans masquer les zones prototype.

## Experience globale

`[CIBLE_VALIDEE]` Make the Change doit aider l'utilisateur a passer de l'intention a l'action : comprendre, choisir une action, soutenir, voir une trace, progresser, revenir.

## Navigation principale

`[ACTUEL_CODE]` La navigation mobile principale contient cinq tabs :

| Tab | Label UI | Route | Role |
|---|---|---|---|
| Aventure | Accueil | `/adventure` | Hub quotidien, quetes, recommandation projet, BioDex, progression. |
| Projets | Projets | `/projects` | Liste, recherche, carte/liste/grille, detail projet. |
| Apprendre | Apprendre | `/learn` | Module d'apprentissage (remplace l'ancienne tab Collectif `/impact`). |
| Avantages | Avantages | `/advantages` | Produits ou avantages lies aux Credits Impact. |
| Profil | Profil | `/profile` | Compte, solde, BioDex, historique, abonnement, settings. |

## Aventure

`[ACTUEL_CODE]` Aventure existe comme tab principale. Elle assemble :

- salutation personnalisee ;
- faction/mascotte ;
- quetes du jour ;
- progression mensuelle ;
- projet recommande ;
- espece BioDex liee ;
- progression collective ;
- solde Graines et Credits Impact.

`[CIBLE_VALIDEE]` Aventure est le hub principal qui orchestre l'experience quotidienne.

`[CIBLE_VALIDEE]` Aventure doit mettre en avant une action prioritaire claire.

`[CIBLE_VALIDEE]` Aventure orchestre Academy, Missions, Defis/Challenges, Projets, BioDex et Collectif.

`[HYPOTHESE_FORTE]` Aventure peut afficher des acces secondaires : Academy, projet recommande, espece BioDex, objectif collectif, avantage discret.

`[A_DECIDER]` Nombre exact de cartes/actions visibles dans le hub.

`[A_DECIDER]` Format exact de l'action prioritaire.

`[A_DECIDER]` Place exacte des acces secondaires.

## Factions cibles

`[CIBLE_VALIDEE]` Les factions cibles sont :

- Vie Sauvage / Melli ;
- Terres & Forets / Sylva ;
- Gardiens des mers / Ondine.

## Projets

`[ACTUEL_CODE]` Les projets sont listes via mocks et, selon le mode, Supabase. Les vues grille, liste et carte existent.

Types observes :

- `beehive`
- `olive_tree`
- `vineyard`
- `reef`
- `coral`

`[ACTUEL_CODE]` Deux routes d'action existent :

- `/projects/[slug]/donate` pour des projets de type don, notamment corail/recif ;
- `/projects/[slug]/invest` pour des projets de soutien producteur, encore nommes `invest` dans le code.

`[RISQUE]` Le mot `invest` peut creer une confusion financiere. La documentation produit doit parler de soutien producteur, pas d'investissement financier.

## Don et soutien producteur

| Notion | Role cible | Etat code |
|---|---|---|
| Don | Contribution sans retour produit direct, liee a une restauration ou action terrain | `[ACTUEL_CODE]` route `/donate`, PaymentIntent Stripe reel |
| Soutien producteur | Contribution a un projet producteur, avec Credits Impact/rewards possibles | `[ACTUEL_CODE]` route `/invest`, vocabulaire legacy |
| Achat produit | Acquisition d'un produit/avantage via Credits Impact ou catalogue | `[ACTUEL_CODE]` boutique produits |

`[CIBLE_VALIDEE]` Don pur, soutien producteur et achat produit sont separes.

`[ACTUEL_CODE]` Les routes actuelles utilisent encore `/donate` et `/invest`.

`[A_MIGRER_PLUS_TARD]` `invest` / `investment` doit migrer progressivement vers `support` / `producer_support`.

## Produits / Avantages

`[ACTUEL_CODE]` La tab `/advantages` affiche un catalogue avec filtres, producteurs, categories, tags et pagination.

`[ACTUEL_CODE]` Les produits utilisent des champs `price_points` et des equivalents euros dans les mocks.

`[CIBLE_VALIDEE]` Le langage utilisateur doit privilegier Credits Impact plutot que points.

`[A_DECIDER]` La boutique doit-elle etre une boutique de produits physiques, un espace d'avantages, ou les deux ?

## Collectif / Impact

`[LEGACY]` L'ancienne tab `/impact` (Collectif) a ete remplacee par `/learn` (Apprendre) apres R8. La route `/impact` n'existe plus sous `(tabs)`.

`[A_DECIDER]` Le role du Collectif (saisons, recompenses, sanctuaires) reste a repositionner dans la navigation.

`[HYPOTHESE]` Le collectif peut servir a montrer une saison, une faction, un objectif commun ou une recompense partagee.

`[A_DECIDER]` Il faut choisir le role principal de cette tab : preuve d'impact, competition douce, progression collective, ou vitrine communautaire.

## Profil

`[ACTUEL_CODE]` Le profil affiche un etat invite ou authentifie selon les mocks/session. Des sous-pages existent :

- compte ;
- BioDex ;
- investments/historique de soutien ;
- seeds ;
- settings ;
- subscription.

`[DEPRECIE]` `profile/investments` est un nom technique legacy a ne pas exposer tel quel dans le wording final.

## BioDex

`[ACTUEL_CODE]` BioDex est accessible depuis `/profile/biodex` et `/profile/biodex/[id]`.

`[CIBLE_VALIDEE]` Le BioDex doit rendre le vivant visible, memorisable et relie aux actions.

`[RISQUE]` Le deblocage prototype automatique doit etre clairement distingue des regles finales de deblocage.

## Academy

`[ACTUEL_CODE]` Academy existe principalement dans `(screens)/academy`.

`[ACTUEL_CODE]` Des labs `kinnu` et `kinnu-v2` existent aussi dans `(lab)`.

`[CIBLE_VALIDEE]` Academy est une brique pedagogique importante du produit, non obligatoire.

`[CIBLE_VALIDEE]` Academy ne bloque jamais le don, le soutien producteur ou l'achat.

`[CIBLE_VALIDEE]` Academy peut donner des Graines.

`[CIBLE_VALIDEE]` Academy ne debloque pas seule une espece BioDex.

`[CIBLE_VALIDEE]` Academy de base est gratuite en V1.

`[CIBLE_VALIDEE]` Academy = apprendre et comprendre, pas prouver l'impact.

`[HYPOTHESE_FORTE]` Academy est un moteur de retention quotidienne.

`[HYPOTHESE_FORTE]` Academy peut etre recommandee comme action prioritaire dans Aventure.

`[PROTOTYPE]` Labs Kinnu/Kinnu V2 sont des prototypes, pas l'Academy finale.

`[A_DECIDER]` Sort final des labs Kinnu / Kinnu V2.

## Missions et Defis

`[CIBLE_VALIDEE]` Missions = impulsions courtes et guidees qui donnent une direction quotidienne.

`[CIBLE_VALIDEE]` Defis = objectifs structures ou detailles, espace secondaire.

`[CIBLE_VALIDEE]` Missions et defis peuvent donner des Graines.

`[CIBLE_VALIDEE]` Missions et defis ne doivent pas creer de fausse preuve d'impact.

`[HYPOTHESE_FORTE]` Missions sont principalement quotidiennes.

`[HYPOTHESE_FORTE]` Missions peuvent renvoyer vers Academy, projets, BioDex ou collectif.

`[A_DECIDER]` Termes exacts a utiliser dans l'UI (mission, defi, challenge, action du jour, objectif).

## Onboarding, abonnement, RSE

- `[ACTUEL_CODE]` Des routes d'onboarding et de subscription existent.
- `[HYPOTHESE]` L'abonnement Ambassadeur peut devenir un pilier de revenus.
- `[A_TESTER]` Les usages RSE doivent etre testes avant d'etre documentes comme offre stable.

## Experience cible minimale

`[CIBLE_VALIDEE]` Une experience fiable doit permettre a l'utilisateur de :

1. comprendre ce qu'il peut faire ;
2. choisir une action adaptee ;
3. voir l'impact attendu avec prudence ;
4. recevoir une progression claire ;
5. retrouver ses traces dans le profil ;
6. ne pas confondre engagement, don, soutien et achat.
