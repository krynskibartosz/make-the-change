# 05 - Business model

## Role de ce document

Ce document separe les elements business plausibles, actuels, testes ou a decider. Il ne transforme pas les hypotheses en decisions.

## Synthese

`[HYPOTHESE]` Make the Change peut combiner plusieurs sources de revenus : soutien de projets, produits/avantages, abonnement, partenariats producteurs et offres RSE.

`[RISQUE]` Cette combinaison peut devenir confuse si le produit ne distingue pas clairement don, soutien producteur, achat et abonnement.

`[AUDITE]` P0-7 est documente dans `_audit/BUSINESS-INITIAL-PROMISE-AUDIT.md`.

`[CIBLE_VALIDEE]` La promesse utilisateur initiale recommandee est : soutenir des projets biodiversite concrets, comprendre son geste et progresser dans une aventure vivante.

`[HYPOTHESE_FORTE]` La promesse business initiale est de tester d'abord la conversion autour du don pur et du soutien producteur.

`[CIBLE_VALIDEE]` La boutique est un prolongement / avantage, pas le coeur moral du produit.

`[PLUS_TARD]` RSE complete, abonnement Ambassadeur comme pilier, marketplace large, sponsoring avance et contenus premium.

## Sources de revenus possibles

| Source | Description | Statut |
|---|---|---|
| Don pur | Contribution a une action biodiversite/environnementale sans contrepartie economique directe | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` route `/donate` |
| Soutien producteur | Contribution a un projet producteur/partenaire economique reel, avec Credits Impact possibles | `[CIBLE_VALIDEE]` + `[ACTUEL_CODE]` partiel sous `invest` |
| Produits / avantages | Catalogue de produits ou avantages responsables | `[ACTUEL_CODE]` catalogue produits ; paiement produit `[ACTUEL_CODE] [SIMULE] [RISQUE]` |
| Abonnement Ambassadeur | Allocation mensuelle, avantages ou statut | `[HYPOTHESE]` + `[A_TESTER]` |
| RSE / B2B | Offres entreprises, equipes, reporting | `[HYPOTHESE]` + `[A_TESTER]` |
| Sponsoring / partenariats | Marques ou producteurs partenaires | `[HYPOTHESE]` |

## Paiements et Stripe

`[AUDITE]` P0-9 est documente dans `_audit/STRIPE-STATUS-AUDIT.md`.

`[ACTUEL_CODE] [HYBRIDE]` Stripe est reel sur certains flows, mais l'integration business n'est pas encore homogene.

`[CIBLE_VALIDEE]` Don pur, soutien producteur, achat produit et abonnement doivent rester des flux economiques separes.

`[ACTUEL_CODE] [REEL]` Les flows donation et invest creent des PaymentIntent Stripe reels.

`[ACTUEL_CODE] [REEL] [LEGACY]` Le flow invest utilise encore le vocabulaire et les metadata legacy `investment`.

`[ACTUEL_CODE] [SIMULE] [RISQUE]` Le flow produit est actuellement simule et ne doit pas etre considere comme un revenu reellement branche.

`[A_DECIDER]` Les commissions, frais, conditions de remboursement, frais producteurs et frais de plateforme restent a definir ou tester.

## Don vs soutien producteur vs achat

`[CIBLE_VALIDEE]` La separation officielle cible est validee.

| Notion | Definition cible | Peut donner | Ne doit pas donner/promettre |
|---|---|---|---|
| Don pur | Contribution financiere a un projet biodiversite ou environnemental sans contrepartie economique directe | Graines, preuve simple, pedagogie, historique, certificat symbolique, badge, BioDex si lien explicite avec une espece | Credits Impact, produit, valeur boutique, rendement, promesse non prouvee, vocabulaire d'investissement |
| Soutien producteur | Contribution financiere a un projet porte par un producteur ou partenaire, lie a une production, une filiere ou une activite reelle | Credits Impact, petit bonus de Graines si pertinent, preuve simple, pedagogie, BioDex si lien explicite avec une espece, acces futur a des produits partenaires via Credits Impact | Rendement, profit, part, propriete, remboursement garanti, confusion avec don pur |
| Achat produit | Achat direct d'un produit dans la boutique ou les avantages partenaires | Produit, commande, historique d'achat, reconnaissance symbolique eventuelle | Impact direct a lui seul, Credits Impact crees, espece BioDex automatique, promesse de sauver une espece |

## Wording business et UI

| Cas | Recommande | A eviter |
|---|---|---|
| Don pur | Faire un don, Donner pour ce projet, Contribuer a ce projet, Soutenir la biodiversite | Investir, Financer, Acheter de l'impact, Obtenir un retour, Impact valide sans preuve solide |
| Soutien producteur | Soutenir ce projet, Soutenir ce producteur, Soutenir cette ruche/rucher/oliveraie, Contribuer a ce projet producteur | Investir, Financement, Placement, Rendement, ROI, Acheter une part |
| Achat produit | Acheter en euros, Utiliser mes Credits Impact, Voir le produit, Produit partenaire, Avantage partenaire | Sauver une espece, Creer de l'impact direct, Generer des Credits Impact |

## Credits Impact

`[CIBLE_VALIDEE]` Les Credits Impact representent une valeur boutique liee a un soutien producteur et utilisable dans les avantages ou produits partenaires.

`[ACTUEL_CODE]` Le code utilise encore `points` comme nom technique pour de nombreux champs.

`[CIBLE_VALIDEE]` Un don pur ne genere pas de Credits Impact.

`[CIBLE_VALIDEE]` Un quiz ne genere pas de Credits Impact.

`[CIBLE_VALIDEE]` Un achat produit ne cree pas de Credits Impact.

`[CIBLE_VALIDEE]` Il n'y a pas de Credits Impact gratuits chaque mois sans soutien producteur dans la cible validee.

`[A_DECIDER]` Il faut encore definir si 1 Credit Impact correspond a :

- 1 centime d'euro ;
- 1 point interne non monetisable ;
- une valeur hybride ;
- une unite purement gamifiee.

`[RISQUE]` Si les Credits Impact ont une valeur economique trop directe, il faut verifier les implications fiscales, comptables et legales.

## Abonnement Ambassadeur

`[HYPOTHESE]` L'abonnement peut servir a :

- soutenir regulierement des projets ;
- affecter plus tard un budget Ambassadeur a un projet producteur ;
- acceder a des avantages ;
- soutenir la mission globale ;
- renforcer la retention.

`[CIBLE_VALIDEE]` L'abonnement ne doit pas generer de Credits Impact gratuits chaque mois sans soutien producteur.

`[A_TESTER]` La propension a payer doit etre verifiee avant de le traiter comme pilier business.

## RSE / B2B

`[HYPOTHESE]` Les entreprises pourraient utiliser Make the Change pour engager leurs equipes autour d'actions biodiversite.

`[A_TESTER]` Les besoins reels a tester :

- reporting fiable ;
- challenges collaborateurs ;
- budget impact ;
- preuves utilisables en communication interne ;
- prevention greenwashing ;
- tableaux de bord.

`[RISQUE]` Le B2B/RSE peut exiger un niveau de preuve, de securite, de reporting et de contractualisation superieur au B2C.

## Producteurs et marketplace

`[HYPOTHESE]` Les producteurs peuvent etre au centre du modele via projets, produits, recompenses ou storytelling.

`[A_DECIDER]` Il faut definir :

- qui encaisse ;
- qui livre ;
- qui gere le SAV ;
- quelle commission existe ;
- quel niveau de controle qualite est requis ;
- quelles preuves sont demandees au producteur.

## Risques business

- `[RISQUE]` Trop de modeles en parallele peuvent rendre le produit illisible.
- `[RISQUE]` `investment` peut creer une mauvaise attente utilisateur ou juridique.
- `[RISQUE]` Les Credits Impact peuvent etre percus comme monnaie si la valeur est trop directe.
- `[RISQUE]` La boutique peut detourner l'attention de l'impact.
- `[RISQUE]` La RSE peut amplifier les risques de greenwashing.
- `[RISQUE]` Presenter un achat produit comme une action d'impact principale peut affaiblir la credibilite.

## Metriques a suivre en phase prototype / validation

`[A_TESTER]` Metriques business prioritaires :

- Comprehension de la promesse en moins de 30 secondes
- Clic vers don ou soutien
- Taux de conversion don / soutien
- Abandon checkout
- Comprehension Graines vs Credits Impact
- Interet pour BioDex apres contribution
- Retour dans Aventure J1 / J7
- Interet pour les avantages / boutique
- Nombre de partenaires producteurs interesses
- Nombre de prospects RSE interesses
- Signaux d'interet pour Ambassadeur

## Decision business prioritaire

`[CIBLE_VALIDEE]` La separation don pur / soutien producteur / achat produit est validee.

`[HYPOTHESE_FORTE]` Le modele initial a tester en premier combine :

1. don d'impact ;
2. soutien producteur.

`[A_TESTER]` Le mix exact entre don pur et soutien producteur reste a valider par la comprehension, la confiance, l'intention de paiement, le montant acceptable et la conversion.

`[PLUS_TARD]` Boutique/avantages, abonnement, RSE, marketplace large et sponsoring doivent rester secondaires ou experimentaux tant que le coeur don/soutien n'est pas valide.
