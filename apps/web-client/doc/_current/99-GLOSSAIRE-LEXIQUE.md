# 99 - Glossaire et lexique

## Role de ce document

Ce document centralise les termes recommandes, sensibles, deprecies ou a decider.

## Statuts

| Statut | Usage |
|---|---|
| `[CIBLE_VALIDEE]` | Terme recommande. |
| `[ACTUEL_CODE]` | Terme present dans le code. |
| `[DEPRECIE]` | Terme a eviter cote utilisateur. |
| `[A_DECIDER]` | Terme a arbitrer. |
| `[RISQUE]` | Terme pouvant creer confusion ou risque. |

## Termes recommandes

| Terme | Definition | Statut |
|---|---|---|
| Make the Change | Nom du produit/projet | `[CIBLE_VALIDEE]` |
| Aventure | Hub principal qui orchestre l'experience quotidienne : salutation, faction, action prioritaire, progression mensuelle, projet recommande, espece BioDex liee, progression collective, solde Graines et Credits Impact | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` |
| Projets | Actions terrain ou producteurs a decouvrir/soutenir | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` |
| Collectif | Dimension commune de l'impact ou des saisons | `[ACTUEL_CODE]` |
| Avantages | Terme UI actuel pour `/products` | `[ACTUEL_CODE]` + `[A_DECIDER]` |
| Profil | Espace utilisateur | `[ACTUEL_CODE]` |
| BioDex | Collection/vulgarisation d'especes, attachement et memoire du vivant | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` |
| Academy | Brique pedagogique importante, non obligatoire, gratuite en V1, qui apprend et comprend. Peut donner des Graines, ne debloque pas seule le BioDex, renforce la comprehension des projets, especes, ecosystemes et gestes d'impact | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` partiel |
| Mission | Impulsion courte et guidee qui donne une direction quotidienne. Peut renvoyer vers Academy, projets, BioDex ou collectif. Peut donner des Graines, ne cree pas d'impact direct | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` partiel |
| Challenge / Defi | Objectif structure ou detaille, espace secondaire pour objectifs plus avances. Peut durer plusieurs jours, peut donner des Graines, ne cree pas d'impact direct | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` |
| Action prioritaire | Action unique recommandee dans Aventure pour eviter de surcharger l'utilisateur | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` |
| Graines | Monnaie d'engagement et de progression, engagement, apprentissage, BioDex, missions et reconnaissance symbolique | `[CIBLE_VALIDEE]` |
| Credits Impact | Valeur boutique liee a un soutien producteur, utilisable dans les avantages ou produits partenaires | `[CIBLE_VALIDEE]` |
| Don pur | Contribution financiere a un projet biodiversite ou environnemental sans contrepartie economique directe | `[CIBLE_VALIDEE]` |
| Soutien producteur | Contribution financiere a un projet porte par un producteur ou partenaire, sans rendement ni propriete | `[CIBLE_VALIDEE]` |
| Achat produit | Achat direct d'un produit dans la boutique ou les avantages partenaires | `[CIBLE_VALIDEE]` |
| Promesse utilisateur initiale | Soutenir des projets biodiversite concrets, comprendre son geste et progresser dans une aventure vivante | `[CIBLE_VALIDEE]` |
| Promesse business initiale | Tester d'abord la conversion autour du don pur et du soutien producteur | `[HYPOTHESE_FORTE]` |
| Boutique / Avantages | Prolongement ou avantage lie aux Credits Impact, pas coeur moral du produit | `[CIBLE_VALIDEE]` + `[A_TESTER]` |
| RSE | Piste B2B a tester plus tard avec methode de preuve robuste | `[PLUS_TARD]` + `[A_TESTER]` |
| Abonnement Ambassadeur | Piste d'abonnement a tester plus tard, non lancee ni definitive | `[PLUS_TARD]` + `[A_TESTER]` |
| `donation` | Nom technique cible du don pur | `[CIBLE_VALIDEE]` |
| `producer_support` | Nom metier cible du soutien producteur | `[CIBLE_VALIDEE]` |
| `product_purchase` | Nom technique cible de l'achat produit | `[CIBLE_VALIDEE]` |
| Recu de paiement | Trace de paiement confirme, sans promesse fiscale ni preuve terrain | `[CIBLE_VALIDEE]` |
| Recu de contribution | Trace de contribution ou soutien, sans promesse fiscale ni preuve terrain | `[CIBLE_VALIDEE]` |
| Paiement confirme | Statut de paiement reussi ; ne veut pas dire impact mesure | `[CIBLE_VALIDEE]` |
| Impact estime | Impact formule prudemment selon hypothese ou methode documentee | `[CIBLE_VALIDEE]` |
| Impact mesure | Impact appuye par mesure, methode, source et niveau de confiance | `[PLUS_TARD]` |
| PaymentIntent | Objet Stripe de paiement ; preuve technique de tentative ou confirmation paiement selon statut, pas preuve terrain | `[ACTUEL_CODE]` |
| Stripe | Infrastructure de paiement presente dans certains flows, integration actuelle hybride | `[ACTUEL_CODE] [HYBRIDE]` |

## Termes presents dans le code mais sensibles

| Terme | Presence | Statut | Recommandation |
|---|---|---|---|
| `investment` | Routes, actions, metadata Stripe, mocks | `[ACTUEL_CODE]` + `[DEPRECIE]` | Ne pas utiliser en UI finale. Metadata Stripe doivent migrer vers `producer_support`. |
| `invest` | Route `/projects/[slug]/invest` | `[ACTUEL_CODE]` + `[DEPRECIE]` | Parler de soutien dans les contenus. |
| `points` | Champs data et wallet | `[ACTUEL_CODE]` | Clarifier lien avec Credits Impact. |
| `price_points` | Produits | `[ACTUEL_CODE]` | Peut rester technique si documente. |
| `amount_points` | Soutien/historique | `[ACTUEL_CODE]` | Clarifier migration future. |
| `Artisans Locaux` | Factions/mocks | `[ACTUEL_CODE]` + `[LEGACY_FACTION]` + `[DEPRECIE]` + `[A_MIGRER_PLUS_TARD]` | Ne pas renforcer. Les seules factions cibles sont Vie Sauvage, Terres & Forets, Gardiens des mers. |
| `funding` | Progression projets | `[ACTUEL_CODE]` + `[RISQUE]` | Utiliser avec prudence. |
| `PaymentIntent` | Stripe / paiements | `[ACTUEL_CODE]` + `[RISQUE]` | Ne pas presenter comme preuve d'impact. |
| Stripe | Infrastructure paiement | `[ACTUEL_CODE] [HYBRIDE]` | Ne pas presenter tous les flows comme reels : produit est simule. |
| Paiement simule | Flow produit actuel | `[ACTUEL_CODE] [SIMULE] [RISQUE]` | Ne doit pas etre presente comme paiement Stripe reel. |
| Recu fiscal | Communication paiement | `[RISQUE]` | A eviter sans validation legale ; preferer recu de paiement ou recu de contribution. |

## Termes a eviter en communication utilisateur

| Terme | Pourquoi | Alternative |
|---|---|---|
| Investissement | Risque financier/legal | Soutien, contribution, participation |
| Financement | Peut evoquer une logique financiere ou d'investissement | Don, soutien, contribution selon contexte |
| Rendement | Promesse financiere | Credits Impact, avantage, recompense |
| Profit | Incompatible avec positionnement impact | Valeur, retour, avantage |
| ROI | Promesse financiere | Impact attendu, avantage, progression |
| Acheter une part | Evoque propriete ou titre financier | Soutenir ce producteur |
| Acheter de l'impact | Formulation trop transactionnelle | Contribuer a ce projet |
| Points biodiversite | Ancien nom confus | Graines ou Credits Impact selon cas |
| Impact garanti | Trop fort sans preuve | Impact estime, contribue a |
| Sauver une espece | Trop direct | Soutenir un projet lie a une espece |
| Compensation carbone | Risque greenwashing | Contribution positive, soutien a un projet |
| Abeilles sauvees | Promesse trop forte sans preuve | Abeilles soutenues estimees, projet favorable aux pollinisateurs |
| CO2 capture | Metrique sensible sans methode | Estimation CO2 selon methode documentee |
| Especes protegees | Trop fort sans preuve de protection | Especes liees au projet |
| Recu fiscal | Risque legal si statut non valide | Recu de contribution |
| Impact mesure | Trop fort sans preuve mesuree robuste | Impact estime, suivi en cours, preuve disponible selon niveau reel |
| Paiement simule presente comme Stripe reel | Trompeur pour l'utilisateur | Prototype de paiement, paiement a brancher, simulation interne |
| Quest | Terme technique actuel / legacy a ne pas afficher | Mission ou Defi selon contexte |
| Challenge | Si un mot francais clair peut etre utilise, preferer "Defi" | Defi |
| Mission terrain | Pour toutes les missions, car toutes ne sont pas forcement terrain | Mission |

`[CIBLE_VALIDEE]` Cote fichiers / code, `defis` sans accent est acceptable.

`[CIBLE_VALIDEE]` Cote UI francaise, utiliser `Defi` / `Defis` avec accent.

`[ACTUEL_CODE] [PROTOTYPE]` `Quest` doit rester un terme technique actuel/prototype, pas un wording utilisateur final.

## Don, soutien, achat

`[CIBLE_VALIDEE]` Definitions cible :

| Terme | Definition cible | Peut donner | Ne doit pas donner/promettre |
|---|---|---|---|
| Don pur | Contribution financiere a un projet biodiversite ou environnemental sans contrepartie economique directe | Graines, preuve simple, pedagogie, historique, recu/certificat symbolique, badge, BioDex si lien explicite avec une espece | Credits Impact, produit, valeur boutique, rendement, promesse non prouvee |
| Soutien producteur | Contribution financiere a un projet porte par un producteur ou partenaire, lie a une production, une filiere ou une activite reelle | Credits Impact, petit bonus de Graines, preuve simple, pedagogie, BioDex si lien explicite avec une espece, acces futur a des produits partenaires via Credits Impact | rendement, profit, part, propriete, remboursement garanti, confusion avec don pur |
| Achat produit | Achat direct d'un produit dans la boutique ou les avantages partenaires | produit, commande, historique d'achat, reconnaissance symbolique eventuelle | Credits Impact crees, BioDex automatique, promesse d'impact direct |

## Routes et noms techniques cibles

| Usage | Etat actuel | Cible |
|---|---|---|
| Don pur | `/projects/[slug]/donate` | `/projects/[slug]/donate`, `donation`, `order_type: "donation"` |
| Soutien producteur | `/projects/[slug]/invest`, `investment` | `/projects/[slug]/support`, `producer_support`, `order_type: "producer_support"` |
| Achat produit | `/products` | `/products`, `product_purchase`, `order_type: "product_purchase"` |

## Paiement, Stripe et preuve

| Terme | Regle |
|---|---|
| Recu de paiement | Peut confirmer une transaction, mais ne prouve pas l'impact terrain. |
| Recu de contribution | Peut tracer un don ou soutien, mais ne doit pas etre presente comme recu fiscal sans validation legale. |
| Recu fiscal | A eviter sans validation legale explicite. |
| Paiement confirme | Ne veut pas dire impact mesure. |
| PaymentIntent | Objet technique Stripe ; ne doit pas etre transforme en preuve d'impact. |
| Stripe | `[ACTUEL_CODE] [HYBRIDE]` : certains flows sont reels, mais l'integration n'est pas homogene. |
| Paiement simule | Ne doit pas etre presente comme paiement Stripe reel. |
| Impact estime | Acceptable avec hypothese ou methode documentee. |
| Impact mesure | Reserve a un niveau de preuve superieur avec methode, source, perimetre et confiance. |

## Graines vs Credits Impact

| Terme | Ne pas confondre avec |
|---|---|
| Graines | Euros, Credits Impact, preuve directe d'impact |
| Credits Impact | Don, rendement financier, monnaie bancaire, Graines, score, metrique d'impact |
| `points` | Nom metier cible, Graines, impact direct, rendement |
| `impact_credits` | Graines, score, metrique d'impact |

`[CIBLE_VALIDEE]` Un don pur ne genere pas de Credits Impact.

`[CIBLE_VALIDEE]` Un quiz ne genere pas de Credits Impact.

`[CIBLE_VALIDEE]` Un achat produit ne cree pas de Credits Impact.

`[CIBLE_VALIDEE]` Il n'y a pas de Credits Impact gratuits chaque mois sans soutien producteur dans la cible validee.

`[A_PLANIFIER]` Nom technique futur recommande pour Credits Impact : `impact_credits` en DB/API et `impactCredits` en TypeScript.

`[DEPRECIE]` `points` ne doit plus etre utilise comme nom metier cible. Il peut rester un alias legacy temporaire selon contexte.

`[A_DECIDER]` La conversion precise entre euros, anciens points techniques et Credits Impact doit etre arbitree.

## BioDex

`[AUDITE]` Audit complet dans `_audit/BIOSPECIES-UNLOCK-RULES-AUDIT.md`.

| Terme | Definition |
|---|---|
| Espece debloquee | Espece visible dans la collection utilisateur apres don pur ou soutien producteur explicitement lie a cette espece. |
| Espece verrouillee | Espece presente mais non encore debloquee. |
| Enrichissement de fiche | Enrichissement d'une fiche BioDex deja debloquee via Graines. |
| Statut de conservation | Donnee scientifique ou vulgarisee. |
| Rarete | Representation gamifiee a distinguer du statut scientifique. |
| Diorama | Illustration visuelle, pas preuve terrain par defaut. |

`[CIBLE_VALIDEE]` Regles V1 :

- Un projet peut avoir une espece principale et des especes secondaires.
- Une espece principale ou secondaire peut etre debloquee uniquement si le lien projet-espece est explicite et documente.
- Le deblocage doit preciser le type de lien : espece principale ou espece secondaire.

`[HYPOTHESE_FORTE]` Recommandation V1 : 1 espece principale par projet, 0 a 3 especes secondaires par projet.

`[A_DECIDER]` Conditions precises pour qu'une espece secondaire soit debloquee.

`[CIBLE_VALIDEE]` Une espece ne doit pas etre debloquee par un achat produit seul, un quiz Academy seul, une mission sans impact reel, une logique aleatoire ou un prototype en production.

`[CIBLE_VALIDEE]` Enrichissement : Les Graines peuvent enrichir une fiche BioDex deja debloquee. Les Graines ne peuvent pas debloquer une espece sans impact reel lie a un projet.

`[ACTUEL_CODE] [A_TESTER]` Le cout actuel de 500 Graines, la logique actuelle de niveau 2, les seuils exacts d'enrichissement.

`[ACTUEL_CODE] [DEPRECIE]` Une exception prototype temporaire existe dans le code (`ensurePrototypeUnlockedSpecies`).

`[DEPRECIE]` Cette exception prototype ne fait pas partie de la cible produit.

## Formulations recommandees

- `Soutiens un projet concret pour le vivant.`
- `Faire un don.`
- `Donner pour ce projet.`
- `Soutenir ce producteur.`
- `Soutenir ce rucher.`
- `Soutenir cette oliveraie.`
- `Decouvre l'espece liee a cette action.`
- `Gagne des Graines en progressant chaque jour.`
- `Utilise tes Credits Impact pour acceder a des avantages responsables.`
- `Acheter en euros.`
- `Utiliser mes Credits Impact.`
- `Produit partenaire.`
- `Avantage partenaire.`
- `Impact estime selon les informations disponibles.`
- `Environ X abeilles soutenues selon l'hypothese du projet.`
- `Ce projet vise a restaurer des zones de recif corallien.`
- `Suivi terrain en attente de validation partenaire.`
- `Recu de contribution.`
- `Projet partenaire en cours de suivi.`

## Formulations a verifier avant usage public

- `[A_VERIFIER_CODE]` `Ton paiement a ete confirme.`
- `[A_VERIFIER_CODE]` `Ton don a restaure X coraux.`
- `[A_VERIFIER_CODE]` `Tu as gagne X Credits Impact.`
- `[A_VERIFIER_CODE]` `Cette espece est protegee grace a toi.`
- `[A_VERIFIER_CODE]` `X abeilles sauvees.`
- `[A_VERIFIER_CODE]` `CO2 capture.`
- `[A_VERIFIER_CODE]` `Impact verifie.`

## Regle finale

Si un terme est present dans le code mais deprecie dans ce glossaire, ne pas l'utiliser dans une nouvelle interface ou documentation publique sans decision explicite.
