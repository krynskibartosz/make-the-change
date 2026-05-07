# 10 - BioDex et biodiversite

## Role de ce document

Ce document decrit le role du BioDex, ses contenus, ses regles a clarifier et ses risques.

## Vision BioDex

`[CIBLE_VALIDEE]` Le BioDex doit rendre le vivant visible, memorisable et relie aux actions de l'utilisateur.

Il combine :

- collection ;
- vulgarisation ;
- lien avec projets ;
- motivation ;
- trace d'engagement ;
- support narratif.

## Etat code

`[ACTUEL_CODE]` Le BioDex existe via :

- `/profile/biodex` ;
- `/profile/biodex/[id]` ;
- `species-context.service.ts` ;
- `biodex-preview.service.ts` ;
- mocks BioDex.

`[ACTUEL_CODE]` Les donnees peuvent venir des mocks ou de `v_species_context` selon le mode data.

`[ACTUEL_CODE]` Une exception prototype debloque une espece si aucune espece n'est debloquee.

## Exception prototype

`[ACTUEL_CODE]` La fonction de service garantit qu'au moins une espece peut etre affichee comme debloquee en contexte prototype.

`[RISQUE]` Cette exception peut etre mal comprise comme une regle produit finale.

`[CIBLE_VALIDEE]` La documentation doit presenter cette exception comme un mecanisme prototype, pas comme une regle cible.

## Contenus d'une fiche espece

`[ACTUEL_CODE]` Les champs observes incluent :

- nom ;
- nom scientifique ;
- description ;
- statut de conservation ;
- image ;
- projets associes ;
- producteurs associes ;
- challenges associes ;
- statut utilisateur ;
- habitat ;
- menaces ;
- poids ;
- taille ;
- pays d'origine ;
- regime alimentaire.

`[A_DECIDER]` Il faut definir les champs obligatoires pour une fiche publiable.

## Statuts et rarete

`[ACTUEL_CODE]` Le preview BioDex transforme certains statuts de conservation en rarete : Commun, Rare, Legendaire.

`[RISQUE]` La rarete gamifiee peut etre confondue avec une evaluation scientifique si elle n'est pas expliquee.

`[CIBLE_VALIDEE]` Distinguer statut de conservation et rarete de collection.

## Deblocage BioDex

`[AUDITE]` Audit complet dans `_audit/BIOSPECIES-UNLOCK-RULES-AUDIT.md`.

`[CIBLE_VALIDEE]` Regles V1 :

- Deblocage par don pur si le projet est explicitement lie a une espece.
- Deblocage par soutien producteur si le projet est explicitement lie a une espece.
- Un projet peut avoir une espece principale et des especes secondaires.
- Une espece principale ou secondaire peut etre debloquee uniquement si le lien projet-espece est explicite et documente.
- Le deblocage doit preciser le type de lien : espece principale ou espece secondaire.

`[HYPOTHESE_FORTE]` Recommandation V1 : 1 espece principale par projet, 0 a 3 especes secondaires par projet.

`[A_DECIDER]` Conditions precises pour qu'une espece secondaire soit debloquante.

`[CIBLE_VALIDEE]` Enrichissement : Les Graines peuvent enrichir une fiche BioDex deja debloquee. Les Graines ne peuvent pas debloquer une espece sans impact reel lie a un projet.

`[ACTUEL_CODE] [A_TESTER]` Le cout actuel de 500 Graines, la logique actuelle de niveau 2, les seuils exacts d'enrichissement.

`[INTERDIT]` En V1 :

- Achat produit seul ne debloque jamais une espece.
- Academy seule ne debloque jamais une espece sans action terrain.
- Challenges Academy ne debloquent jamais une espece sans action terrain.
- Exception prototype ne doit pas exister en production.

`[CIBLE_VALIDEE]` Une espece debloquee dans le BioDex est une trace pedagogique et narrative liee a un projet, pas une preuve que l'espece est sauvee.

`[CIBLE_VALIDEE]` Un deblocage BioDex doit etre rattache a un don pur ou un soutien producteur explicitement lie a une espece, sauf mecanisme prototype clairement marque comme tel.

## Images

`[A_DECIDER]` Chaque image BioDex devrait avoir un type :

- photo terrain ;
- illustration ;
- image IA ;
- placeholder ;
- diorama.

`[RISQUE]` Une image IA ou illustration peut etre interpretee comme preuve terrain.

## Lien avec projets

`[CIBLE_VALIDEE]` Une espece BioDex doit idealement aider l'utilisateur a comprendre le lien entre un projet et le vivant.

Exemples de liens possibles :

- espece protegee par le projet ;
- espece pollinisatrice ;
- espece indicatrice ;
- habitat restaure ;
- relation indirecte avec une filiere.

`[A_PLANIFIER]` Il faut definir quels liens sont acceptables et lesquels seraient trop indirects.

`[CIBLE_VALIDEE]` Les formulations BioDex doivent privilegier `espece liee au projet`, `habitat associe`, `role ecologique`, `projet lie a cette espece`.

`[RISQUE]` Les formulations `espece protegee`, `espece sauvee`, `cette espece est protegee grace a toi` sont trop fortes sans preuve operationnelle ou mesuree.

## BioDex et Academy

`[CIBLE_VALIDEE]` L'Academy ne debloque pas seule une espece BioDex.

`[CIBLE_VALIDEE]` L'Academy peut donner des Graines.

`[CIBLE_VALIDEE]` Les Graines peuvent enrichir une fiche BioDex deja debloquee.

`[CIBLE_VALIDEE]` L'Academy peut recommander des especes BioDex pour contextualiser la biodiversite.

## BioDex et RSE

`[HYPOTHESE]` Le BioDex peut servir a rendre un reporting RSE plus humain et pedagogique.

`[RISQUE]` Les fiches especes ne suffisent pas comme preuve d'impact RSE.

## Garde-fous

- `[CIBLE_VALIDEE]` Ne pas inventer de faits scientifiques.
- `[CIBLE_VALIDEE]` Distinguer vulgarisation et preuve.
- `[CIBLE_VALIDEE]` Ne pas faire passer une collection pour une restauration reelle.
- `[CIBLE_VALIDEE]` Ne pas faire passer un deblocage BioDex pour une preuve de sauvetage ou de protection.
- `[RISQUE]` Ne pas afficher un impact individuel trop direct si l'action est collective ou estimee.

## Question prioritaire

`[A_DECIDER]` Quels niveaux de lien projet-espece sont acceptables pour declencher un deblocage BioDex ? Recommandation V1 : role "Espece principale" ou "Espece secondaire" avec lien direct documente.
