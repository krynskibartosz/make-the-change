# 07 - Impact et credibilite

## Role de ce document

Ce document definit les principes de prudence et de credibilite autour de l'impact environnemental, social et pedagogique.

## Principe central

`[CIBLE_VALIDEE]` Make the Change doit rendre l'impact plus visible sans promettre plus que ce qui est prouve.

`[CIBLE_VALIDEE]` La promesse business initiale ne doit pas transformer une recompense, un solde, une boutique ou une offre RSE en preuve d'impact.

`[CIBLE_VALIDEE]` Le projet reel soutenu doit rester la source principale de la trace d'impact.

## Types d'information

| Type | Exemple | Regle |
|---|---|---|
| Fait verifie | Nom scientifique, localisation, partenaire connu | Peut etre affirme si source fiable. |
| Estimation | CO2, abeilles protegees, coraux restaures | Doit etre formulee prudemment. |
| Narration | Mascotte, aventure, progression | Ne doit pas etre confondue avec une preuve. |
| Gamification | Graines, badges, BioDex, quetes | Doit soutenir l'engagement sans inventer l'impact. |
| Hypothese | Effet futur d'un projet non mesure | Doit rester marquee `[HYPOTHESE]`. |

## Preuves d'impact

`[CIBLE_VALIDEE]` La doctrine P0-6 est documentee dans `_audit/IMPACT-PROOF-LEVELS-AUDIT.md`.

Niveaux cibles :

| Niveau | Description | Usage possible |
|---|---|---|
| `[PREUVE_SIMPLE]` | Trace factuelle : montant, date, projet, partenaire, statut paiement | UI V1. |
| `[PREUVE_PEDAGOGIQUE]` | Explication du lien projet-espece ou projet-ecosysteme | UI V1. |
| `[ESTIMATION]` | Ordre de grandeur base sur hypothese documentee | UI V1 avec prudence. |
| `[PREUVE_OPERATIONNELLE]` | Action terrain documentee : photo, localisation, partenaire, etape realisee | UI + suivi projet. |
| `[PREUVE_MESUREE]` | Mesure verifiee, audit externe, releve valide | RSE et communication externe, avec methode. |

`[CIBLE_VALIDEE]` Un solde, des `points`, des Credits Impact ou des Graines ne doivent jamais etre convertis directement en preuve d'impact.

`[CIBLE_VALIDEE]` L'impact doit etre rattache a un projet, une action reelle, un montant, un partenaire, une hypothese documentee ou une preuve terrain.

`[CIBLE_VALIDEE]` Paiement confirme ne veut pas dire impact mesure.

`[CIBLE_VALIDEE]` Un succes Stripe ou un PaymentIntent reussi ne constitue pas une preuve terrain.

`[CIBLE_VALIDEE]` Un recu de paiement ou recu de contribution ne doit pas etre presente comme recu fiscal sans validation legale.

`[RISQUE]` Un ecran de succes paiement ne doit pas afficher "impact valide" ou equivalent sans preuve robuste.

`[PLUS_TARD]` Une offre RSE complete exige un niveau de preuve, de methode, de responsabilite et de reporting superieur a la V1 B2C.

## BioDex et scientificite

`[CIBLE_VALIDEE]` Le BioDex doit distinguer :

- informations scientifiques ;
- informations vulgarisees ;
- liens avec projets ;
- elements narratifs ;
- elements de collection.

`[RISQUE]` Les images IA ou dioramas peuvent etre perçus comme preuves terrain si la distinction n'est pas claire.

`[A_DECIDER]` Il faut definir quand une image est :

- photo terrain ;
- illustration ;
- image IA ;
- placeholder prototype.

## Projets et impact

`[ACTUEL_CODE]` Les projets exposent des metriques d'impact dans les mocks et composants : abeilles, coraux, oliviers, CO2, biodiversite, emplois, etc.

`[RISQUE]` Ces metriques ne doivent pas etre documentees comme prouvees sans source.

`[CIBLE_VALIDEE]` Les metriques comme abeilles, fleurs, coraux, CO2, kg de miel ou surfaces restaurees doivent etre formulees comme estimations tant qu'elles ne disposent pas d'une preuve operationnelle ou mesuree.

`[CIBLE_VALIDEE]` Un don pur peut afficher une explication pedagogique de l'impact attendu, mais ne doit pas promettre de mesure non prouvee ni generer de Credits Impact.

`[CIBLE_VALIDEE]` Un soutien producteur peut afficher une explication pedagogique de l'impact attendu et donner des Credits Impact, mais ne doit pas promettre de rendement, de profit, de part, de propriete ou de remboursement garanti.

`[CIBLE_VALIDEE]` Un achat produit ne doit pas etre presente comme l'action d'impact principale et ne doit pas etre formule comme sauver une espece.

`[A_PLANIFIER]` Il faut definir la structure officielle d'une preuve projet :

- partenaire ;
- localisation ;
- action financee ou soutenue ;
- unite d'impact ;
- methode de calcul ;
- source ;
- date de verification ;
- niveau de confiance.

## BioDex et preuve d'action

`[AUDITE]` Audit complet dans `_audit/BIOSPECIES-UNLOCK-RULES-AUDIT.md`.

`[CIBLE_VALIDEE]` Regles V1 :

- Une espece BioDex peut etre debloquee par un don pur si le projet est explicitement lie a cette espece.
- Une espece BioDex peut etre debloquee par un soutien producteur si le projet est explicitement lie a cette espece.
- Un projet peut avoir une espece principale et des especes secondaires.
- Une espece principale ou secondaire peut etre debloquee uniquement si le lien projet-espece est explicite et documente.
- Le deblocage doit preciser le type de lien : espece principale ou espece secondaire.

`[HYPOTHESE_FORTE]` Recommandation V1 : 1 espece principale par projet, 0 a 3 especes secondaires par projet.

`[A_DECIDER]` Conditions precises pour qu'une espece secondaire soit debloquante.

`[CIBLE_VALIDEE]` Enrichissement : Les Graines peuvent enrichir une fiche BioDex deja debloquee. Les Graines ne peuvent pas debloquer une espece sans impact reel lie a un projet.

`[ACTUEL_CODE] [A_TESTER]` Le cout actuel de 500 Graines, la logique actuelle de niveau 2, les seuils exacts d'enrichissement.

`[INTERDIT]` En V1 :

- Une espece BioDex ne doit pas etre debloquee par un achat produit seul.
- Une espece BioDex ne doit pas etre debloquee par un quiz Academy seul, une mission sans impact reel, une logique aleatoire ou un prototype en production.

`[ACTUEL_CODE] [DEPRECIE]` Une exception prototype temporaire existe dans le code (`ensurePrototypeUnlockedSpecies`).

`[DEPRECIE]` Cette exception prototype ne doit pas exister en production.

## RSE et greenwashing

`[RISQUE]` Les usages RSE demandent une prudence superieure. Une entreprise pourrait vouloir communiquer sur l'impact, ce qui augmente le risque de greenwashing.

`[CIBLE_VALIDEE]` Sans methode robuste, l'app peut fournir un reporting narratif ou pedagogique, pas un reporting d'impact mesure.

`[A_PLANIFIER]` Avant une offre RSE, definir :

- ce qui peut etre revendique ;
- ce qui ne peut pas etre revendique ;
- la forme des rapports ;
- les disclaimers ;
- les sources ;
- la responsabilite entre Make the Change, partenaires et clients.

## Formulations recommandees

| A eviter | Preferer |
|---|---|
| `Vous sauvez X especes` | `Votre action contribue a soutenir un projet lie a...` |
| `Impact garanti` | `Impact estime selon...` |
| `Compense votre empreinte` | `Soutient une action positive pour...` |
| `Investissez dans la biodiversite` | `Soutenez un projet concret pour le vivant` |
| `Acheter ce produit sauve une espece` | `Produit partenaire` ou `Avantage partenaire` |
| `X abeilles sauvees` | `Environ X abeilles soutenues selon l'hypothese du projet` |
| `CO2 capture` | `Estimation CO2 selon methode a documenter` |
| `Impact verifie` | `Suivi en cours` ou `preuve disponible` selon niveau reel |
| `Impact valide` apres paiement | `Paiement confirme, suivi du projet en cours` |
| `Recu fiscal` | `Recu de paiement` ou `Recu de contribution` |

## Risques majeurs

- `[RISQUE]` Confondre gamification et preuve.
- `[RISQUE]` Montrer des chiffres sans methode.
- `[RISQUE]` Presenter des images non terrain comme preuve.
- `[RISQUE]` Donner une valeur economique implicite a un impact non audite.
- `[RISQUE]` Offrir du reporting RSE avant d'avoir une methode robuste.
- `[RISQUE]` Confondre paiement confirme, succes Stripe ou recu avec preuve d'impact mesure.

## Decision prioritaire

`[A_PLANIFIER]` Definir un systeme technique simple de niveaux de preuve par claim, projet et metrique avant toute communication publique forte ou RSE.
