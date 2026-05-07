# 09 - Gamification et economie

## Role de ce document

Ce document clarifie les monnaies, recompenses, quetes et boucles de progression.

## Principe central

`[CIBLE_VALIDEE]` La gamification doit aider l'utilisateur a comprendre et revenir, sans remplacer la preuve d'impact.

`[CIBLE_VALIDEE]` Les Graines, Credits Impact, scores, badges, streaks ou niveaux ne sont jamais une preuve d'impact.

## Deux monnaies produit

| Monnaie | Role | Statut |
|---|---|---|
| Graines | Engagement, apprentissage, progression, reconnaissance symbolique, enrichissement BioDex, missions et defis | `[CIBLE_VALIDEE]` |
| Credits Impact | Valeur boutique liee a un soutien producteur, utilisable dans les avantages ou produits partenaires | `[CIBLE_VALIDEE]` |

`[CIBLE_VALIDEE]` Missions et defis peuvent donner des Graines.

`[CIBLE_VALIDEE]` Missions et defis ne doivent pas creer de fausse preuve d'impact.

## `points` dans le code

`[ACTUEL_CODE]` Le code utilise encore `points` pour plusieurs champs : profils, produits, commandes, allocations, historiques.

`[A_VERIFIER_CODE]` L'audit `_audit/POINTS-TO-CREDITS-IMPACT-AUDIT.md` classe les usages de `points` en plusieurs familles :

- `[CREDITS_IMPACT_LEGACY]` pour les prix boutique, soldes, commandes et credits issus d'un soutien producteur ;
- `[GRAINES]` pour la progression symbolique, Academy, missions, BioDex ou engagement ;
- `[SCORE_OU_XP]` pour les scores, niveaux et badges ;
- `[IMPACT_METRIC]` pour les equivalences abeilles, fleurs, coraux, CO2, kg, etc. ;
- `[LEGACY_INVESTMENT]` pour les retours, allocations, rendement et ancien modele investissement ;
- `[SUPABASE_LEGACY]` pour les champs issus de l'ancienne base V0.

`[CIBLE_VALIDEE]` Ne pas considerer que `points = Credits Impact` partout.

`[A_PLANIFIER]` `points` doit rester un alias legacy temporaire, pas un nom metier cible.

`[RISQUE]` Tant que ce point n'est pas tranche, eviter de documenter des conversions economiques trop strictes.

## Graines

`[CIBLE_VALIDEE]` Les Graines servent a representer :

- l'engagement ;
- l'apprentissage ;
- la progression ;
- la reconnaissance symbolique ;
- l'enrichissement BioDex ;
- les quetes, missions et actions de decouverte.

Sources principales validees :

- don pur ;
- Academy ;
- missions ;
- bonus symbolique de soutien producteur ;
- progression.

`[A_DECIDER]` Il faut definir si les Graines peuvent etre depensees ou seulement accumulees/contribuees.

## Credits Impact

`[CIBLE_VALIDEE]` Les Credits Impact representent une valeur boutique liee a un soutien producteur.

Usages valides :

- produits ;
- avantages partenaires ;
- produits partenaires.

Sources principales validees :

- soutien producteur ;
- eventuellement budget Ambassadeur affecte a un projet producteur plus tard.

Interdits :

- pas de Credits Impact generes par un don pur ;
- pas de Credits Impact generes par un quiz ;
- pas de Credits Impact generes par un achat produit ;
- pas de Credits Impact gratuits chaque mois sans soutien producteur ;
- pas de `Points biodiversite` comme monnaie utilisateur.

`[A_PLANIFIER]` Nom technique futur recommande : `impact_credits` pour les champs persistants/API et `impactCredits` en TypeScript.

`[A_DECIDER]` Les regles de conversion, expiration, remboursement et comptabilite doivent encore etre definies.

## Quetes et challenges

`[ACTUEL_CODE]` Aventure utilise des quetes issues des mocks de challenges :

- education ;
- daily harvest ;
- social ou participation.

`[CIBLE_VALIDEE]` Les challenges doivent etre courts, comprehensibles et relies a l'impact ou a la comprehension du vivant.

`[RISQUE]` Les challenges ne doivent pas pousser a une action artificielle ou non credible.

## BioDex et gamification

`[CIBLE_VALIDEE]` Le BioDex utilise la collection comme motivation.

`[AUDITE]` Audit complet dans `_audit/BIOSPECIES-UNLOCK-RULES-AUDIT.md`.

`[ACTUEL_CODE]` Une espece peut etre debloquee automatiquement par exception prototype si aucune espece n'est debloquee.

`[CIBLE_VALIDEE]` Regles V1 de deblocage :

- don pur si le projet est explicitement lie a une espece ;
- soutien producteur si le projet est explicitement lie a une espece ;
- un projet peut avoir une espece principale et des especes secondaires ;
- une espece principale ou secondaire peut etre debloquee uniquement si le lien projet-espece est explicite et documente ;
- le deblocage doit preciser le type de lien : espece principale ou espece secondaire.

`[HYPOTHESE_FORTE]` Recommandation V1 : 1 espece principale par projet, 0 a 3 especes secondaires par projet.

`[A_DECIDER]` Conditions precises pour qu'une espece secondaire soit debloquante.

`[CIBLE_VALIDEE]` Enrichissement : Les Graines peuvent enrichir une fiche BioDex deja debloquee. Les Graines ne peuvent pas debloquer une espece sans impact reel lie a un projet.

`[ACTUEL_CODE] [A_TESTER]` Le cout actuel de 500 Graines, la logique actuelle de niveau 2, les seuils exacts d'enrichissement.

Interdits :

- achat produit seul ;
- quiz Academy seul ;
- mission sans impact reel ;
- logique aleatoire ;
- exception prototype en production.

`[ACTUEL_CODE]` Une exception prototype temporaire existe dans le code.

`[DEPRECIE]` Cette exception ne fait pas partie de la cible produit.

## Recompenses

`[CIBLE_VALIDEE]` Les recompenses dependent du type d'action :

| Action | Peut donner | Ne doit pas donner |
|---|---|---|
| Don pur | Graines, preuve simple, pedagogie, historique, badge symbolique, BioDex si lien explicite | Credits Impact, produit, rendement |
| Soutien producteur | Credits Impact, bonus symbolique de Graines, preuve simple, pedagogie, BioDex si lien explicite | rendement, profit, part, remboursement garanti |
| Achat produit | produit, commande, historique, reconnaissance symbolique eventuelle | Credits Impact crees, BioDex automatique, promesse d'impact direct |

`[A_DECIDER]` Il faut encore choisir les details de conversion et d'affichage pour eviter une economie trop complexe.

## Factions et mascottes

`[ACTUEL_CODE]` Des factions et mascottes existent dans les mocks et l'UI : pollinisateurs, forets, mers, neutral, etc.

`[ACTUEL_CODE]` `Artisans Locaux` reste present dans certains mocks/flows.

`[DEPRECIE]` `Artisans Locaux` est une faction legacy depreciee. Les seules factions cibles sont Vie Sauvage, Terres & Forets, Gardiens des mers.

`[A_MIGRER_PLUS_TARD]` La migration technique doit etre planifiee plus tard (P2 ou P3).

`[A_DECIDER]` Il faut definir le systeme final de factions : nombre, noms, mascottes, role mecanique.

## Boucles produit

### Boucle quotidienne

1. Ouvrir Aventure.
2. Recevoir une action courte.
3. Gagner des Graines.
4. Voir une progression.
5. Decouvrir un projet ou une espece.

Statut : `[CIBLE_VALIDEE]` comme direction, `[ACTUEL_CODE]` partiel.

### Boucle don pur

1. Decouvrir un projet.
2. Comprendre l'impact attendu.
3. Faire un don.
4. Recevoir des Graines, une trace et eventuellement une espece BioDex si le projet est explicitement lie a une espece.
5. Suivre l'historique.

Statut : `[CIBLE_VALIDEE]`.

### Boucle soutien producteur

1. Decouvrir un projet producteur.
2. Comprendre le producteur, la filiere et l'impact attendu.
3. Soutenir le projet.
4. Recevoir des Credits Impact, eventuellement un bonus symbolique de Graines et une espece BioDex si le projet est explicitement lie a une espece.
5. Utiliser les Credits Impact dans les avantages ou produits partenaires.

Statut : `[CIBLE_VALIDEE]`.

### Boucle achat produit

1. Decouvrir un produit ou avantage partenaire.
2. Acheter en euros ou utiliser des Credits Impact.
3. Recevoir un produit, une commande et un historique.
4. Ne pas presenter cet achat comme une action d'impact principale.

Statut : `[CIBLE_VALIDEE]`.

### Boucle BioDex

1. Debloquer une espece.
2. Comprendre son role.
3. Relier l'espece a un projet.
4. Revenir completer la collection.

Statut : `[CIBLE_VALIDEE]` pour le deblocage via don pur ou soutien producteur explicitement lie a une espece.

## Risques

- `[RISQUE]` Confondre Graines et Credits Impact.
- `[RISQUE]` Donner une valeur economique floue aux Credits Impact.
- `[RISQUE]` Gamifier des metriques non prouvees.
- `[RISQUE]` Multiplier les rewards sans logique comprehensible.
- `[RISQUE]` Garder `points` trop longtemps dans les textes utilisateur.
- `[RISQUE]` Generer des Credits Impact via don pur ou quiz brouillerait la logique economique validee.
- `[RISQUE]` Laisser `points` couvrir a la fois Credits Impact, Graines, score, metriques d'impact et heritages Supabase.
- `[RISQUE]` Convertir Credits Impact, Graines ou score en abeilles, CO2, coraux ou autre impact comme si c'etait une preuve.
