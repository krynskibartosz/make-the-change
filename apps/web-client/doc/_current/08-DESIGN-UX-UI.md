# 08 - Design UX UI

## Role de ce document

Ce document decrit les principes design et UX a respecter. Il ne remplace pas le code ni le design system.

## Positionnement visuel

`[CIBLE_VALIDEE]` L'experience doit combiner :

- chaleur ;
- confiance ;
- modernite ;
- dimension premium raisonnable ;
- gamification douce ;
- credibilite impact.

## Mobile-first

`[ACTUEL_CODE]` La navigation principale est pensee pour mobile avec bottom nav.

`[CIBLE_VALIDEE]` Les parcours cles doivent rester comprehensibles et utilisables sur petit ecran : Aventure, Projet, Don/Soutien, BioDex, Produits, Profil.

## Principes UX

- `[CIBLE_VALIDEE]` Clarifier l'action principale de chaque ecran.
- `[CIBLE_VALIDEE]` Eviter les promesses floues ou trop fortes.
- `[CIBLE_VALIDEE]` Rendre les differences entre Graines et Credits Impact visibles.
- `[CIBLE_VALIDEE]` Montrer la progression sans creer de pression excessive.
- `[CIBLE_VALIDEE]` Differencier don, soutien producteur et achat.
- `[RISQUE]` Ne pas utiliser la gamification pour masquer une incertitude impact.

## Tabs principales

`[ACTUEL_CODE]` Les tabs actuelles sont :

- Aventure ;
- Projets ;
- Collectif ;
- Avantages ;
- Profil.

`[A_DECIDER]` Les labels peuvent etre ajustes, mais la structure actuelle doit rester la base documentaire tant que le code ne change pas.

## Aventure

`[CIBLE_VALIDEE]` Aventure doit etre un hub vivant, pas une simple liste de cartes.

Elements a garder clairs :

- prochaine action ;
- recompense ou progression ;
- lien avec une espece ;
- lien avec un projet ;
- etat du collectif ;
- solde utilisateur.

## Factions cibles

`[CIBLE_VALIDEE]` Les trois factions a representer clairement dans les experiences concernees sont :

- Vie Sauvage / Melli ;
- Terres & Forets / Sylva ;
- Gardiens des mers / Ondine.

## Projets

`[CIBLE_VALIDEE]` Une fiche projet doit permettre de comprendre rapidement :

- quoi ;
- ou ;
- avec qui ;
- pourquoi ;
- quel impact attendu ;
- quelle action possible ;
- quel niveau de preuve.

`[RISQUE]` Si le CTA parle de financement, investissement ou rendement, il peut creer une confusion.

## Don / soutien / achat

`[A_DECIDER]` Les flows doivent avoir des codes visuels distincts :

- don : contribution, restauration, impact direct ou estime ;
- soutien producteur : projet/filiere/partenaire, rewards possibles ;
- achat : produit, stock, livraison, prix.

## BioDex

`[CIBLE_VALIDEE]` Le BioDex doit etre attractif et lisible, mais ne doit pas faire passer des illustrations pour des preuves.

Differencier visuellement :

- espece verrouillee ;
- espece debloquee ;
- rarete ;
- information scientifique ;
- lien projet ;
- narration.

## Aventure

`[CIBLE_VALIDEE]` Aventure est le hub principal qui orchestre l'experience quotidienne.

`[CIBLE_VALIDEE]` Aventure doit mettre en avant une action prioritaire claire.

`[CIBLE_VALIDEE]` Aventure orchestre Academy, Missions, Defis/Challenges, Projets, BioDex et Collectif.

`[HYPOTHESE_FORTE]` Aventure peut afficher des acces secondaires : Academy, projet recommande, espece BioDex, objectif collectif, avantage discret.

`[A_DECIDER]` Nombre exact de cartes/actions visibles dans le hub.

`[A_DECIDER]` Format exact de l'action prioritaire.

`[A_DECIDER]` Place exacte des acces secondaires.

## Missions et Defis

`[CIBLE_VALIDEE]` Missions = impulsions courtes et guidees qui donnent une direction quotidienne.

`[CIBLE_VALIDEE]` Defis = objectifs structures ou detailles, espace secondaire.

`[CIBLE_VALIDEE]` UI francaise recommandee : Mission pour les petites actions guidees, Defi pour les objectifs structures.

`[A_DECIDER]` Termes exacts a utiliser dans l'UI (mission, defi, challenge, action du jour, objectif).

## Boutique / Avantages

`[ACTUEL_CODE]` La tab `/products` existe avec cartes produits, filtres et pagination.

`[A_DECIDER]` Il faut definir si le label final est Produits, Boutique, Avantages ou un mix.

`[RISQUE]` Une experience trop e-commerce peut affaiblir la mission impact.

## Accessibilite

`[CIBLE_VALIDEE]` Les principes minimums :

- contrastes suffisants ;
- tailles de texte lisibles ;
- CTA explicites ;
- etats focus ;
- alternatives textuelles ;
- ne pas transmettre une information uniquement par la couleur.

## Design risks

- `[RISQUE]` Trop de cartes peut rendre l'experience confuse.
- `[RISQUE]` Trop de metriques peut reduire la comprehension.
- `[RISQUE]` Trop de mascottes peut infantiliser le produit.
- `[RISQUE]` Trop de premium peut paraitre opportuniste.
- `[RISQUE]` Trop de gamification peut affaiblir la credibilite.
