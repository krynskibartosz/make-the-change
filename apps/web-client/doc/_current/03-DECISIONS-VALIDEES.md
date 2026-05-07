# 03 - Decisions validees

## Role de ce document

Ce document liste uniquement les decisions considerees comme validees a ce stade. Si un sujet n'est pas ici, il doit etre considere comme hypothese, test ou decision ouverte.

## Decisions produit

- `[CIBLE_VALIDEE]` Make the Change doit etre une experience positive, concrete et engageante autour du vivant.
- `[CIBLE_VALIDEE]` L'experience doit etre mobile-first.
- `[CIBLE_VALIDEE]` Aventure est une tab principale et doit orchestrer l'experience quotidienne.
- `[CIBLE_VALIDEE]` Les projets de terrain sont un pilier du produit.
- `[CIBLE_VALIDEE]` Le BioDex est un pilier narratif, pedagogique et de collection.
- `[CIBLE_VALIDEE]` L'utilisateur doit comprendre la difference entre engagement, soutien, don, achat et recompense.
- `[CIBLE_VALIDEE]` La separation officielle cible est : don pur, soutien producteur, achat produit.

## Decision P0-1 - Don, soutien producteur, achat

### Don pur

- `[CIBLE_VALIDEE]` Un don pur est une contribution financiere a un projet biodiversite ou environnemental sans contrepartie economique directe pour l'utilisateur.
- `[CIBLE_VALIDEE]` Un don pur peut donner des Graines, une preuve simple du geste, une explication pedagogique de l'impact attendu, un historique, un recu/certificat symbolique, un badge symbolique et un deblocage BioDex si le projet est explicitement lie a une espece.
- `[CIBLE_VALIDEE]` Un don pur ne doit pas donner de Credits Impact, de produit, de valeur boutique, de rendement ou de promesse mesuree non prouvee.
- `[CIBLE_VALIDEE]` Le nom technique cible est `donation`.

### Soutien producteur

- `[CIBLE_VALIDEE]` Un soutien producteur est une contribution financiere a un projet porte par un producteur ou partenaire, avec une logique economique liee a des produits, une production, une filiere ou une activite reelle.
- `[CIBLE_VALIDEE]` Le soutien producteur n'est pas un investissement financier : pas de rendement, pas de part, pas de propriete, pas de retour financier, pas de remboursement garanti.
- `[CIBLE_VALIDEE]` Un soutien producteur peut donner des Credits Impact, un petit bonus de Graines si pertinent, une preuve simple du soutien, une explication pedagogique de l'impact attendu, un deblocage BioDex si le projet est explicitement lie a une espece, et un acces futur a des produits partenaires via Credits Impact.
- `[CIBLE_VALIDEE]` Le nom metier cible prefere est `producer_support`.
- `[CIBLE_VALIDEE]` La route utilisateur cible preferee est `/projects/[slug]/support`.

### Achat produit

- `[CIBLE_VALIDEE]` Un achat produit est l'achat direct d'un produit dans la boutique ou les avantages partenaires.
- `[CIBLE_VALIDEE]` Un achat produit peut se faire en euros, en Credits Impact, ou eventuellement via un mix plus tard si valide.
- `[CIBLE_VALIDEE]` Un achat produit donne un produit, une commande et un historique d'achat.
- `[CIBLE_VALIDEE]` Un achat produit ne doit pas etre presente comme l'action d'impact principale, ne doit pas creer de Credits Impact et ne doit pas debloquer automatiquement une espece BioDex.
- `[CIBLE_VALIDEE]` Le nom technique cible est `product_purchase`.

### BioDex et monnaies

- `[CIBLE_VALIDEE]` Une espece BioDex peut etre debloquee par un don pur ou un soutien producteur si le projet est explicitement lie a cette espece.
- `[CIBLE_VALIDEE]` Une espece BioDex ne doit pas etre debloquee par un achat produit seul, un quiz Academy seul, une mission sans impact reel, une logique aleatoire ou une exception prototype en production.
- `[CIBLE_VALIDEE]` Les Graines representent l'engagement, l'apprentissage, la progression, la reconnaissance symbolique et l'enrichissement BioDex.
- `[CIBLE_VALIDEE]` Les Credits Impact representent une valeur boutique liee a un soutien producteur et utilisable dans les avantages ou produits partenaires.
- `[CIBLE_VALIDEE]` Un don pur ne genere pas de Credits Impact.
- `[CIBLE_VALIDEE]` Un quiz ne genere pas de Credits Impact.
- `[CIBLE_VALIDEE]` Les Credits Impact gratuits mensuels sans soutien producteur ne sont pas une cible validee.

## Decisions de navigation actuellement assumees

- `[ACTUEL_CODE]` Les cinq tabs actuelles sont Aventure, Projets, Collectif, Avantages, Profil.
- `[CIBLE_VALIDEE]` La documentation doit prendre ces cinq tabs comme base de travail actuelle.
- `[A_DECIDER]` Les labels finaux exacts peuvent encore evoluer.

## Decisions de vocabulaire

- `[CIBLE_VALIDEE]` Utiliser `Graines` pour l'engagement et la progression non economique.
- `[CIBLE_VALIDEE]` Utiliser `Credits Impact` pour la valeur utilisable en avantages/produits/rewards.
- `[CIBLE_VALIDEE]` Utiliser `impact_credits` comme nom technique futur DB/API des Credits Impact.
- `[CIBLE_VALIDEE]` Utiliser `impactCredits` comme nom technique futur TypeScript des Credits Impact.
- `[CIBLE_VALIDEE]` Garder `points` uniquement comme alias legacy temporaire ; `points` ne doit plus etre utilise comme nom metier cible.
- `[CIBLE_VALIDEE]` Utiliser `donation` comme nom technique cible du don pur.
- `[CIBLE_VALIDEE]` Utiliser `producer_support` comme nom metier cible du soutien producteur.
- `[CIBLE_VALIDEE]` Utiliser `product_purchase` comme nom technique cible de l'achat produit.
- `[DEPRECIE]` Ne pas utiliser `Points biodiversite` comme nom produit.
- `[DEPRECIE]` Ne pas utiliser `investment` comme langage utilisateur final.
- `[DEPRECIE]` Ne pas utiliser `Artisans Locaux` comme faction cible ou nouveau vocabulaire produit.

## Decisions d'impact

- `[CIBLE_VALIDEE]` Ne pas promettre un impact non prouve.
- `[CIBLE_VALIDEE]` Distinguer faits, estimations, narration et gamification.
- `[CIBLE_VALIDEE]` Les contenus BioDex doivent rester comprehensibles par un public non expert.
- `[CIBLE_VALIDEE]` Doctrine de preuve V1 : afficher des preuves simples, des explications pedagogiques et des estimations prudentes.
- `[A_VERIFIER]` Les formules exactes de calcul d'impact (abeilles, coraux, CO2, surfaces) doivent etre documentees et rattachees a des hypotheses ou des sources.
- `[RISQUE]` Les claims CO2 sont sensibles et ne doivent pas etre affiches sans methode robuste, perimetre, source et limites.
- `[A_PLANIFIER]` Les metriques RSE exigent un niveau de preuve superieur : perimetre, periode, methode, source, limites, niveau de confiance et responsabilites.
- `[CIBLE_VALIDEE]` Les claims terrain comme "coraux restaures", "abeilles protegees", "especes sauvees" ne sont autorises que si le niveau de preuve correspondant existe.
- `[CIBLE_VALIDEE]` Un solde, des `points`, des Credits Impact ou des Graines ne doivent jamais etre convertis directement en preuve d'impact.
- `[CIBLE_VALIDEE]` L'impact doit etre rattache a un projet, une action reelle, un montant, un partenaire, une hypothese documentee ou une preuve terrain.
- `[CIBLE_VALIDEE]` En V1, afficher en priorite des preuves simples, des explications pedagogiques et des estimations prudentes.
- `[CIBLE_VALIDEE]` Ne pas afficher de preuve mesuree, de promesse forte ou de claim RSE sans methode robuste.
- `[CIBLE_VALIDEE]` Une espece debloquee dans le BioDex est une trace pedagogique et narrative liee a un projet, pas une preuve que l'espece est sauvee.
- `[CIBLE_VALIDEE]` Les usages RSE exigent un niveau de preuve superieur : perimetre, periode, methode, source, limites, niveau de confiance et responsabilites.

## Decisions techniques actuelles

- `[ACTUEL_CODE]` Le produit est actuellement mock-first.
- `[ACTUEL_CODE]` Supabase est integre partiellement.
- `[ACTUEL_CODE]` Stripe est integre partiellement.
- `[ACTUEL_CODE]` `next-intl` est present, mais l'i18n contenu est partiel.

## Decisions documentaires

- `[CIBLE_VALIDEE]` La nouvelle structure documentaire est creee a cote des anciens fichiers.
- `[CIBLE_VALIDEE]` Aucun ancien document n'est supprime ou archive dans cette premiere passe.
- `[CIBLE_VALIDEE]` Les noms de fichiers de la nouvelle structure sont sans accents.
- `[CIBLE_VALIDEE]` Les statuts sans accents sont la convention documentaire de reference.
- `[CIBLE_VALIDEE]` Les IA doivent verifier les statuts avant de proposer une evolution.

## Promesse business initiale

`[AUDITE]` P0-7 est documente dans `_audit/BUSINESS-INITIAL-PROMISE-AUDIT.md`.

`[CIBLE_VALIDEE]` La promesse utilisateur initiale recommandee est : soutenir des projets biodiversite concrets, comprendre son geste et progresser dans une aventure vivante.

`[CIBLE_VALIDEE]` Le projet reel doit rester le centre de la promesse, pas la boutique, pas la recompense, pas le reporting RSE.

`[CIBLE_VALIDEE]` La boutique est un prolongement / avantage, pas le coeur moral du produit.

`[CIBLE_VALIDEE]` La RSE n'est pas validee comme offre mature en V1.

`[CIBLE_VALIDEE]` L'abonnement Ambassadeur ne doit pas etre presente comme lance ou definitif.

`[CIBLE_VALIDEE]` Les recompenses ne doivent jamais devenir plus importantes que le projet soutenu.

## Non-decisions importantes

Les sujets suivants ne sont pas encore des decisions validees :

- `[A_DECIDER]` Sort final des labs Kinnu / Kinnu V2.
- `[A_DECIDER]` Niveau exact de visibilite Academy dans Aventure.
- `[A_DECIDER]` Format exact des recommandations projet / espece Academy.
- `[A_DECIDER]` Nombre exact de cartes/actions visibles dans le hub Aventure.
- `[A_DECIDER]` Format exact de l'action prioritaire dans Aventure.
- `[A_DECIDER]` Place exacte des acces secondaires dans Aventure.
- `[A_DECIDER]` Termes exacts a utiliser dans l'UI (mission, defi, challenge, action du jour, objectif).
- `[A_TESTER]` Conversion initiale don pur / soutien producteur.
- `[A_TESTER]` Place exacte de la boutique comme avantage sans brouiller la mission.
- `[A_TESTER]` Propension a payer pour un abonnement Ambassadeur.
- `[A_TESTER]` Modele RSE/B2B.
- `[A_TESTER]` Abonnement Ambassadeur.
- `[A_TESTER]` Go-to-market initial.
- `[A_PLANIFIER]` Migration technique progressive de `investment` vers `producer_support`.
- `[A_DECIDER]` Details fins de conversion, expiration, remboursement et comptabilite des Credits Impact.

## Decisions P0-8 - Statut de Artisans Locaux

### `[CIBLE_VALIDEE]`

- `Artisans Locaux` est une ancienne faction depreciee.
- Les seules factions cibles sont :
  - Vie Sauvage / Melli ;
  - Terres & Forets / Sylva ;
  - Gardiens des mers / Ondine.
- Producteurs / partenaires ne sont pas des factions utilisateur.
- Ne pas renforcer `Artisans Locaux` dans les nouveaux ecrans, nouveaux mocks ou nouveaux flows.

### `[ACTUEL_CODE] [LEGACY_FACTION] [DEPRECIE] [A_MIGRER_PLUS_TARD]`

- `Artisans Locaux` existe encore dans le code pour compatibilite.
- Ne pas le supprimer brutalement sans plan de migration.

### `[A_DECIDER]`

- Faction par defaut apres migration.
- Strategie pour les utilisateurs ou mocks qui utilisent encore `Artisans Locaux`.

## Decisions P0-9

`[CIBLE_VALIDEE]` Les flows paiement cibles doivent etre separes clairement : `donation`, `producer_support`, `product_purchase`, `subscription` plus tard.

`[CIBLE_VALIDEE]` Les recus doivent etre appeles "reçu de paiement" ou "reçu de contribution", pas "reçu fiscal" sans validation legale.

`[CIBLE_VALIDEE]` Paiement valide ne veut pas dire impact mesure.

`[CIBLE_VALIDEE]` Les ecrans de succes doivent rester prudents sur l'impact.

`[ACTUEL_CODE] [REEL]` Donation utilise Stripe reellement (cree un PaymentIntent Stripe).

`[ACTUEL_CODE] [REEL] [LEGACY]` Invest utilise Stripe reellement mais avec metadata legacy `investment`.

`[ACTUEL_CODE] [SIMULE] [RISQUE]` Produit est simule (setTimeout) et ne doit pas etre presente comme paiement Stripe reel.

`[ACTUEL_CODE] [PARTIEL]` Webhook partiel (logique de remboursement non implémentee).

`[ACTUEL_CODE] [PARTIEL] [RISQUE]` Les flows donation et invest ne passent pas par la route create-intent.

`[A_MIGRER_PLUS_TARD]` `investment` -> `producer_support` (metadata Stripe).

`[A_MIGRER_PLUS_TARD]` `points_used` -> champ cible a clarifier selon migration `impact_credits`.

`[A_MIGRER_PLUS_TARD]` flow produit simule -> Stripe reel.

`[A_MIGRER_PLUS_TARD]` webhooks remboursement / post-paiement.

`[A_MIGRER_PLUS_TARD]` correction de la divergence d'architecture (harmoniser les flows pour passer par create-intent).

## Decisions P0-10 - Source de verite data

### Doctrine par contexte

`[CIBLE_VALIDEE]` **Source de verite selon le contexte :**

| Contexte | Source de verite | Statut |
|----------|------------------|--------|
| Decisions produit, business, impact, gamification, wording | Docs recentes (00-11, 99), surtout `03-DECISIONS-VALIDEES.md` | `[CIBLE_VALIDEE]` |
| Etat technique reel | Code actuel observe | `[ACTUEL_CODE]` |
| Donnees prototype, besoins UX, flows | Mocks (`src/lib/mock/`) | `[ACTUEL_CODE] [SOURCE_PROTOTYPE]` |
| Historique backend / dashboard admin | Supabase legacy V0 uniquement comme etat legacy | `[ACTUEL_CODE] [LEGACY] [A_NE_PAS_TOUCHER]` |

`[CIBLE_VALIDEE]` **En cas de contradiction :**
- Lire le code pour la realite technique (`[ACTUEL_CODE]`)
- Verifier la documentation pour les decisions validees (`[CIBLE_VALIDEE]`)
- Classer l'ecart avec les tags standards (`[A_MIGRER_PLUS_TARD]`, `[RISQUE]`, etc.)
- Ne pas modifier directement pour forcer l'alignement
- Documenter dans `_audit/CODE-VS-DOC.md` ou `_audit/DATA-SOURCE-TRUTH-AUDIT.md`

### Role des mocks

`[ACTUEL_CODE] [SOURCE_PROTOTYPE]` Les mocks sont la source de reference court terme pour : prototyper les ecrans, stabiliser les flows, comprendre les besoins data. Ils sont une entree majeure pour concevoir la future DB V2, mais le schema final devra etre deduit des flows valides, des decisions produit, des besoins du futur dashboard admin et des contraintes techniques.

`[CIBLE_VALIDEE]` Les 5 mocks les plus structurants sont : `mock-ids.ts`, `mock-biodex.ts`, `mock-projects.ts`, `mock-products.ts`, `mock-member-data.ts`. Ils doivent etre stabilises avant toute migration.

### Future DB V2

`[CIBLE_VALIDEE]` La future DB V2 ne doit pas etre concue maintenant. Attendre : mocks stabilises, flows valides terrain, dashboard admin refondu, schema cible documente.

`[A_DECIDER]` P0-10a — Quand et comment stabiliser les mocks critiques ? (timing de gel, gestion des doublons, uniformisation API)

`[A_PLANIFIER]` P0-11 — Strategie DB V2 (apres stabilisation mocks P0-10a)
