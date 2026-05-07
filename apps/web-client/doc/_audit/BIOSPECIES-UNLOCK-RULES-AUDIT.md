# Audit P0-4 : Règles de déblocage BioDex

Date : 2026-05-07

Portée : audit documentaire et produit limité à `apps/web-client`. Aucun code applicatif, mock, Supabase, Stripe, route, composant, action ou type n'est modifié par ce document.

Statuts utilisés : `[PUBLIC]`, `[DEBLOQUE_PAR_IMPACT]`, `[ENRICHI_PAR_GRAINES]`, `[ACADEMY_PEDAGOGIQUE]`, `[ACHAT_PRODUIT_NON_DEBLOQUANT]`, `[PROTOTYPE]`, `[DEPRECIE]`, `[A_DECIDER]`, `[RISQUE]`, `[CIBLE_VALIDEE]`, `[ACTUEL_CODE]`, `[A_PLANIFIER]`, `[A_VERIFIER_CODE]`

---

## 1. Résumé

`[CIBLE_VALIDEE]` Le BioDex doit rendre le vivant visible, mémorisable et relié aux actions de l'utilisateur.

`[CIBLE_VALIDEE]` Une espèce débloquée dans le BioDex est une trace pédagogique et narrative liée à un projet, pas une preuve que l'espèce est sauvée.

`[CIBLE_VALIDEE]` Un déblocage BioDex doit être rattaché à un don pur ou un soutien producteur explicitement lié à une espèce, sauf mécanisme prototype clairement marqué comme tel.

`[ACTUEL_CODE]` Le code actuel mélange plusieurs mécaniques de déblocage : investissement producteur, challenges Academy, achats produits, et une exception prototype.

`[RISQUE]` L'exception prototype qui débloque automatiquement une espèce peut être mal comprise comme une règle produit finale.

---

## 2. Questions à répondre

### Q1 : Quelles espèces sont visibles publiquement dans le BioDex ?

**Réponse** :

`[ACTUEL_CODE]` Toutes les espèces définies dans `MOCK_SPECIES` sont visibles dans la liste BioDex, qu'elles soient débloquées ou non.

`[ACTUEL_CODE]` Le service `getSpeciesContextList` retourne toutes les espèces avec leur statut utilisateur (`isUnlocked`).

`[ACTUEL_CODE]` L'UI distingue visuellement les espèces débloquées (affichées en premier) et verrouillées (affichées ensuite).

`[CIBLE_VALIDEE]` En V1, toutes les espèces du catalogue devraient être visibles publiquement, avec un indicateur clair de leur statut de déblocage.

---

### Q2 : Quelles espèces sont débloquées pour un utilisateur donné ?

**Réponse** :

`[ACTUEL_CODE]` Le déblocage est déterminé dans `mock-biodex.ts` via la fonction `cloneSpecies` :

**Logique de déblocage actuelle** :

`[ACTUEL_CODE] [LEGACY_INVESTMENT] [A_MIGRER_PLUS_TARD]` Le déblocage est basé sur `investedProjectSlugs` qui provient de `getMockInvestments(viewerId)` - c'est du legacy `investment` à migrer vers `producer_support`.

- **Abeille Noire** (`MOCK_SPECIES_BLACK_BEE_ID`) : débloquée si `investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG)` ET `completedChallengeIds.has(MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID)`
- **Olivier** (`MOCK_SPECIES_OLIVE_TREE_ID`) : débloquée si `investedProjectSlugs.has(MOCK_PROJECT_SARDINIA_SLUG)`
- **Corail/Acropora** (`MOCK_SPECIES_CORAL_ID`, `MOCK_SPECIES_ACROPORA_ID`) : débloquées si `investedProjectSlugs.has(MOCK_PROJECT_CORAL_SLUG)`
- **Espèces Habeebee** (Bourdon, Osmie, Mégachile, Syrphe, Papillons, Hérisson) : débloquées si `investedProjectSlugs.has(MOCK_PROJECT_HABEEBEE_SLUG)`
- **Espèces Antsirabe** (Indri, Sifaka, Vari, Caméléons, Charançon, Grenouille, etc.) : débloquées si `investedProjectSlugs.has(MOCK_PROJECT_ANTSIRABE_SLUG)`
- **Autres espèces** (Poissons coraux, Tortue verte, Huppe) : débloquées si `investedProjectSlugs.has(MOCK_PROJECT_CORAL_SLUG)` ou `MOCK_PROJECT_SARDINIA_SLUG`

`[ACTUEL_CODE]` Une condition supplémentaire pour l'Abeille Noire exige un challenge Academy complété.

`[PROTOTYPE]` L'exception prototype `ensurePrototypeUnlockedSpecies` dans `species-context.service.ts` débloque automatiquement une espèce (préférée "chouette") si aucune n'est débloquée.

`[CIBLE_VALIDEE]` En V1, le déblocage devrait être uniquement basé sur don pur ou soutien producteur explicitement lié à une espèce.

---

### Q3 : Comment une espèce est-elle liée à un projet ?

**Réponse** :

`[ACTUEL_CODE]` Les espèces sont liées aux projets via le champ `associated_projects` dans `SpeciesContext`.

`[ACTUEL_CODE]` Dans les mocks, chaque espèce a un ou plusieurs projets associés avec des rôles :
- `role: 'Espece principale'` (ex: Olivier, Corail)
- `role: 'Espece secondaire'` (ex: Indri, Sifaka, Vari pour Antsirabe)
- `role: 'Espece associee'` (ex: certaines espèces Sardaigne)
- `role: 'Espece associee rare'` (ex: certaines espèces Sardaigne)
- `role: 'Pollinisateur principal'`, `'Pollinisateur complementaire'`, `'Pollinisateur specialise'`, etc. (ex: espèces Habeebee)

`[ACTUEL_CODE]` La fonction `isSpeciesAssociatedWithProject` dans `project-list-species.ts` vérifie la liaison par slug ou ID.

`[ACTUEL_CODE]` Le champ `userParticipation` dans `AssociatedProject` indique si l'utilisateur a participé au projet.

`[CIBLE_VALIDEE]` Les liens acceptables sont : espèce protégée par le projet, espèce pollinisatrice, espèce indicatrice, habitat restauré, relation indirecte avec une filière.

`[A_PLANIFIER]` Il faut définir quels liens sont acceptables pour déclencher un déblocage BioDex.

---

### Q4 : Quelles espèces sont débloquées par don pur ?

**Réponse** :

`[ACTUEL_CODE]` Le code actuel ne distingue pas explicitement entre don pur et soutien producteur pour le déblocage.

`[ACTUEL_CODE]` Le déblocage est basé sur `investedProjectSlugs`, qui provient de `getMockInvestments(viewerId)`.

`[A_VERIFIER_CODE]` `getMockInvestments` peut inclure à la fois des dons purs et des soutiens producteurs selon l'implémentation.

`[CIBLE_VALIDEE]` En V1, un don pur devrait débloquer une espèce BioDex si le projet est explicitement lié à cette espèce.

`[A_DECIDER]` Il faut clarifier si tous les projets liés à une espèce déclenchent un déblocage, ou seulement ceux avec un certain niveau de lien (ex: "Espece principale").

---

### Q5 : Quelles espèces sont débloquées par soutien producteur ?

**Réponse** :

`[ACTUEL_CODE]` Le déblocage actuel est basé sur `investedProjectSlugs`, qui représente principalement des soutiens producteurs.

`[ACTUEL_CODE]` Toutes les espèces liées à un projet investi sont débloquées selon les règles dans `cloneSpecies`.

`[CIBLE_VALIDEE]` En V1, un soutien producteur devrait débloquer une espèce BioDex si le projet est explicitement lié à cette espèce.

`[CIBLE_VALIDEE]` Le soutien producteur peut aussi donner un bonus symbolique de Graines.

---

### Q6 : Quelles espèces sont débloquées par achat produit ?

**Réponse** :

`[ACTUEL_CODE]` Dans `cloneSpecies`, la condition de progression pour l'Abeille Noire inclut :
```
progressionLevel =
  graph.investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG) ||
  graph.orderedProductIds.has(MOCK_PRODUCT_MANAKARA_ID)
    ? 2
    : 1
```

`[ACTUEL_CODE]` L'achat du produit Manakara peut faire passer l'Abeille Noire au niveau 2, mais ne la débloque pas.

`[ACTUEL_CODE]` Aucun déblocage d'espèce n'est basé sur `orderedProductIds` dans la logique actuelle.

`[CIBLE_VALIDEE]` En V1, l'achat produit seul ne doit pas débloquer une espèce BioDex.

`[CIBLE_VALIDEE]` L'achat produit donne produit, commande, historique, reconnaissance symbolique éventuelle, mais pas BioDex automatique.

---

### Q7 : Quelles espèces sont débloquées par Academy ?

**Réponse** :

`[ACTUEL_CODE]` L'Abeille Noire a une condition de déblocage qui inclut un challenge Academy :
```
isUnlocked =
  graph.investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG) &&
  graph.completedChallengeIds.has(MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID)
```

`[ACTUEL_CODE]` Le challenge Academy est une condition supplémentaire, pas un déblocage autonome.

`[ACTUEL_CODE]` Aucune espèce n'est débloquée uniquement par Academy dans la logique actuelle.

`[CIBLE_VALIDEE]` En V1, l'Academy seule ne doit pas débloquer une espèce sans action terrain.

`[A_DECIDER]` L'Academy peut-elle approfondir des fiches BioDex (niveau 2) sans déblocage ?

---

### Q8 : Quelles espèces sont débloquées par exception prototype ?

**Réponse** :

`[ACTUEL_CODE]` La fonction `ensurePrototypeUnlockedSpecies` dans `species-context.service.ts` :
- Débloque automatiquement une espèce si aucune espèce n'est débloquée
- Préfère une espèce contenant "chouette" dans son nom
- Sinon, débloque la première espèce de la liste
- Définit `unlockSource: 'prototype_checkout_unlock'`

`[ACTUEL_CODE]` Cette exception s'applique uniquement en mode mock.

`[PROTOTYPE]` Cette exception est un mécanisme prototype pour démonstration.

`[DEPRECIE]` Cette exception ne fait pas partie de la cible produit.

`[RISQUE]` Cette exception peut être mal comprise comme une règle produit finale.

---

### Q9 : Comment le BioDex preview affiche-t-il les espèces ?

**Réponse** :

`[ACTUEL_CODE]` `biodex-preview.service.ts` définit une liste `FALLBACK_SPECIES` utilisée si aucune espèce n'est disponible depuis l'API.

`[ACTUEL_CODE]` Le service retourne :
- `unlockedSpecies` : espèces débloquées (limité par `unlockedLimit`, défaut 2)
- `lockedSpecies` : espèces verrouillées (limité par `lockedLimit`, défaut 2)
- `unlockedCount` et `totalCount`

`[ACTUEL_CODE]` La rareté est calculée à partir du statut de conservation :
- `EN`, `CR`, `EW`, `EX` → Légendaire
- `VU`, `NT` → Rare
- Autres → Commun

`[ACTUEL_CODE]` Les espèces sont triées par statut de déblocage puis par nom.

`[CIBLE_VALIDEE]` Distinguer statut de conservation et rareté de collection dans l'affichage.

---

### Q10 : Comment les espèces sont-elles affichées dans les profils utilisateur ?

**Réponse** :

`[ACTUEL_CODE]` Le BioDex est accessible via `/profile/biodex`.

`[ACTUEL_CODE]` Chaque espèce a une page détaillée `/profile/biodex/[id]` avec :
- Image, nom, nom scientifique
- Carte impact (projet lié)
- Onglets Découverte / Scientifique
- Description, menaces, habitat
- Contenu niveau 2 (description scientifique) débloqué par Graines

`[ACTUEL_CODE] [A_TESTER]` La barre évolutive `StickyEvolutionBar` montre le coût en Graines pour passer au niveau 2 (REQUIRED_SEEDS = 500).

`[ACTUEL_CODE]` Le niveau 2 débloque la description scientifique détaillée.

`[CIBLE_VALIDEE]` Les Graines peuvent enrichir une fiche BioDex déjà débloquée (niveau 2), mais ne doivent pas débloquer une espèce sans action terrain.

`[CIBLE_VALIDEE]` L'enrichissement de fiche (niveau 2) est débloqué par Graines, pas par impact.

---

### Q11 : Comment les espèces sont-elles affichées après checkout ?

**Réponse** :

`[ACTUEL_CODE]` Aucun écran de succès spécifique après checkout n'affiche directement les espèces BioDex débloquées.

`[ACTUEL_CODE]` L'impact-card dans la fiche espèce affiche "Projet lié à votre soutien" ou "Débloquez via un projet lié".

`[ACTUEL_CODE]` Les écrans de succès après checkout pourraient afficher les espèces nouvellement débloquées, mais ce n'est pas implémenté dans le code actuel.

`[A_DECIDER]` Faut-il afficher les espèces nouvellement débloquées dans les écrans de succès après checkout ?

---

### Q12 : Existe-t-il une distinction entre espèces principales et secondaires ?

**Réponse** :

`[ACTUEL_CODE]` Les mocks utilisent des rôles pour distinguer les espèces :
- `role: 'Espece principale'` (ex: Olivier pour Sardaigne, Corail pour Karimunjawa)
- `role: 'Espece secondaire'` (ex: Indri, Sifaka, Vari pour Antsirabe)
- `role: 'Espece associee'` et `'Espece associee rare'` (ex: certaines espèces Sardaigne)
- Rôles spécifiques pour pollinisateurs (ex: `'Pollinisateur principal'`, `'Pollinisateur complementaire'`)

`[ACTUEL_CODE]` Cette distinction n'est pas utilisée dans la logique de déblocage actuelle.

`[ACTUEL_CODE]` Toutes les espèces liées à un projet investi sont débloquées, quel que soit leur rôle.

`[CIBLE_VALIDEE]` Recommandation V1 :
- 1 espèce principale recommandée par projet
- 0 à 3 espèces secondaires maximum en V1
- Chaque espèce secondaire doit avoir une justification documentée
- Le déblocage doit préciser le type de lien (ex: "habitat restauré", "espèce pollinisatrice", "espèce indicatrice")

`[A_DECIDER]` Nombre final d'espèces secondaires par projet (0-3 recommandé en V1, à confirmer).

---

## 3. Classification des occurrences trouvées

### `[PUBLIC]`

- Toutes les espèces du catalogue BioDex sont visibles publiquement dans la liste.
- Les fiches espèces sont accessibles via `/profile/biodex/[id]`.

### `[DEBLOQUE_PAR_IMPACT]`

- Abeille Noire : débloquée par investissement Manakara + challenge Academy
- Olivier : débloqué par investissement Sardaigne
- Corail/Acropora : débloqués par investissement Karimunjawa
- Espèces Habeebee (7 espèces) : débloquées par investissement Habeebee
- Espèces Antsirabe (12 espèces) : débloquées par investissement Antsirabe
- Espèces corallines (5 espèces) : débloquées par investissement Karimunjawa
- Huppe : débloquée par investissement Sardaigne

### `[ENRICHI_PAR_GRAINES]`

- Niveau 2 des fiches espèces : débloqué par 500 Graines
- Description scientifique détaillée : accessible au niveau 2

### `[ACADEMY_PEDAGOGIQUE]`

- Challenge Academy "L'Esprit d'Equipe" : condition supplémentaire pour l'Abeille Noire
- Progression Academy : utilisée pour `userProgress` dans `associated_challenges`

### `[ACHAT_PRODUIT_NON_DEBLOQUANT]`

- Produit Manakara : peut faire passer l'Abeille Noire au niveau 2, mais ne la débloque pas
- Aucun déblocage d'espèce basé sur `orderedProductIds`

### `[PROTOTYPE]`

- Exception prototype `ensurePrototypeUnlockedSpecies` : débloque automatiquement une espèce si aucune n'est débloquée
- Fallback species dans `biodex-preview.service.ts` : utilisées si aucune espèce disponible depuis l'API

### `[DEPRECIE]`

- Exception prototype : ne fait pas partie de la cible produit
- Logique de déblocage mixte (investissement + challenge) : à simplifier en V1

### `[A_DECIDER]`

- Faut-il conditionner le déblocage au rôle de l'espèce (principale vs secondaire) ?
- L'Academy peut-elle approfondir des fiches BioDex sans déblocage ?
- Faut-il afficher les espèces nouvellement débloquées dans les écrans de succès après checkout ?
- Quels liens projet-espece sont acceptables pour déclencher un déblocage ?

### `[RISQUE]`

- Exception prototype peut être mal comprise comme règle produit finale
- Rarete gamifiee peut être confondue avec évaluation scientifique
- Image IA ou illustration peut être interprétée comme preuve terrain
- Formulations "espece protegee", "espece sauvee" trop fortes sans preuve

---

## 4. Doctrine V1 proposée pour BioDex unlock rules

### 4.1 Statuts des décisions P0-4

**Décisions validées (`[CIBLE_VALIDEE]`)** :
- Déblocage par don pur lié à une espèce
- Déblocage par soutien producteur lié à une espèce
- Achat produit seul ne débloque jamais une espèce
- Academy seule ne débloque jamais une espèce sans action terrain
- Un projet peut avoir une espèce principale
- Un projet peut avoir des espèces secondaires
- Une espèce principale ou secondaire peut être débloquée uniquement si le lien projet-espèce est explicite et documenté
- Le déblocage doit préciser le type de lien : espèce principale ou espèce secondaire
- Les Graines peuvent enrichir une fiche BioDex déjà débloquée
- Les Graines ne peuvent pas débloquer une espèce sans impact réel lié à un projet

**Hypothèses fortes (`[HYPOTHESE_FORTE]`)** :
- 1 espèce principale recommandée par projet
- 0 à 3 espèces secondaires recommandées en V1

**Éléments à tester (`[A_TESTER]`)** :
- Le coût actuel de 500 Graines
- La logique actuelle de niveau 2
- Les seuils exacts d'enrichissement

**Éléments à décider (`[A_DECIDER]`)** :
- Nombre exact maximum d'espèces secondaires
- Conditions précises pour qu'une espèce secondaire soit débloquante

**Éléments actuels du code à ne pas considérer comme cible (`[ACTUEL_CODE] [DEPRECIE]`)** :
- Exception prototype `ensurePrototypeUnlockedSpecies` dans `species-context.service.ts`
- `investedProjectSlugs` dans `mock-biodex.ts` (legacy `investment` à migrer vers `producer_support`)
- Logique de déblocage mixte investissement + challenge (ex: Abeille Noire)

### 4.2 Règles de déblocage V1

`[CIBLE_VALIDEE]` Une espèce est débloquée dans le BioDex uniquement si :

1. **Don pur** : L'utilisateur a fait un don pur à un projet explicitement lié à cette espèce.
2. **Soutien producteur** : L'utilisateur a soutenu un producteur via un projet explicitement lié à cette espèce.

`[CIBLE_VALIDEE]` Le lien projet-espece doit être explicite et documenté dans les données du projet.

`[CIBLE_VALIDEE]` Un projet peut avoir une espèce principale et des espèces secondaires.

`[HYPOTHESE_FORTE]` Recommandation V1 : 1 espèce principale par projet, 0 à 3 espèces secondaires par projet.

`[CIBLE_VALIDEE]` Une espèce principale ou secondaire peut être débloquée uniquement si le lien projet-espèce est explicite et documenté.

`[CIBLE_VALIDEE]` Le déblocage doit préciser le type de lien (ex: "habitat restauré", "espèce pollinisatrice", "espèce indicatrice").

`[A_DECIDER]` Conditions précises pour qu'une espèce secondaire soit débloquante.

`[INTERDIT]` L'achat produit seul ne débloque jamais une espèce.

`[INTERDIT]` L'Academy seule ne débloque jamais une espèce sans action terrain.

`[INTERDIT]` Les challenges Academy ne débloquent jamais une espèce sans action terrain.

`[INTERDIT]` L'exception prototype ne doit pas exister en production.

### 4.3 Enrichissement de fiche

`[CIBLE_VALIDEE]` Les Graines peuvent enrichir une fiche BioDex déjà débloquée.

`[CIBLE_VALIDEE]` Les Graines ne peuvent pas débloquer une espèce sans impact réel lié à un projet.

`[CIBLE_VALIDEE]` Les Graines représentent l'engagement, l'apprentissage et la progression, pas une preuve d'impact.

`[CIBLE_VALIDEE]` L'enrichissement est pédagogique et ne doit pas être confondu avec une preuve de sauvetage.

`[ACTUEL_CODE] [A_TESTER]` Le coût actuel de 500 Graines.

`[ACTUEL_CODE] [A_TESTER]` La logique actuelle de niveau 2.

`[ACTUEL_CODE] [A_TESTER]` Les seuils exacts d'enrichissement.

### 4.4 Cible future conceptuelle

`[A_PLANIFIER]` Structure de données future pour remplacer les mocks legacy :

- **donation records** : traces des dons purs (id, user_id, project_id, amount, date, status)
- **producer_support records** : traces des soutiens producteurs (id, user_id, project_id, amount, date, status, impact_credits_earned)
- **project_species_links** : liens projets-especes (project_id, species_id, role, link_type, justification)
- **user_species_unlocks** : déblocages especes utilisateur (user_id, species_id, unlocked_date, unlock_source, unlock_record_id)

`[A_MIGRER_PLUS_TARD]` Ces structures remplaceront `investedProjectSlugs`, `orderedProductIds`, `completedChallengeIds` et la logique actuelle dans `mock-biodex.ts`.

### 4.5 Formulations BioDex

`[CIBLE_VALIDEE]` Utiliser les formulations recommandées :
- "Espece liée au projet"
- "Habitat associé"
- "Rôle écologique"
- "Projet lié à cette espèce"

`[INTERDIT]` Éviter les formulations trop fortes :
- "Espece protégée"
- "Espece sauvee"
- "Cette espèce est protégée grâce à toi"

### 4.6 Images BioDex

`[CIBLE_VALIDEE]` Chaque image BioDex doit avoir un type documenté :
- Photo terrain
- Illustration
- Image IA
- Placeholder
- Diorama

`[RISQUE]` Une image IA ou illustration ne doit pas être présentée comme preuve terrain.

### 4.7 Lien avec RSE

`[CIBLE_VALIDEE]` Le BioDex peut rendre un reporting RSE plus humain et pédagogique.

`[RISQUE]` Les fiches espèces ne suffisent pas comme preuve d'impact RSE.

`[CIBLE_VALIDEE]` Les usages RSE exigent un niveau de preuve supérieur : périmètre, période, méthode, source, limites, niveau de confiance et responsabilités.

---

## 5. Cas ambigus à clarifier

### 5.1 Rôle de l'espèce dans le déblocage

**Cas** : Les mocks distinguent "Espece principale", "Espece secondaire", "Espece associee", mais la logique de déblocage actuelle ne les distingue pas.

**Recommandation V1** : `[CIBLE_VALIDEE]` Débloquer seulement les "Espece principale" (1 recommandée par projet) et "Espece secondaire" (0-3 maximum en V1) avec lien direct et justification documentée. Les "Espece associee" restent informatives en V1.

### 5.2 Academy et déblocage

**Cas** : L'Abeille Noire nécessite un challenge Academy en plus de l'investissement.

**Recommandation V1** : `[CIBLE_VALIDEE]` En V1, l'Academy ne doit pas être une condition de déblocage. Elle peut enrichir des fiches déjà débloquées.

### 5.3 Achat produit et niveau 2

**Cas** : L'achat du produit Manakara peut faire passer l'Abeille Noire au niveau 2.

**Question** : Faut-il autoriser l'achat produit à enrichir une fiche sans la débloquer ?

**Recommandation** : `[INTERDIT]` En V1, l'achat produit ne doit ni débloquer ni enrichir une fiche BioDex. Seuls les Graines (engagement, apprentissage) enrichissent.

### 5.4 Écrans de succès après checkout

**Cas** : Aucun écran de succès n'affiche les espèces nouvellement débloquées.

**Question** : Faut-il afficher les espèces nouvellement débloquées dans les écrans de succès ?

**Recommandation** : `[A_DECIDER]` Recommandé pour l'UX, mais pas prioritaire P0. À planifier pour V1+.

---

## 6. Risques de greenwashing

### 6.1 Confusion gamification vs preuve

`[RISQUE]` La rareté gamifiée (Commun, Rare, Légendaire) peut être confondue avec une évaluation scientifique.

`[RISQUE]` Le déblocage BioDex peut être interprété comme "espece sauvee" plutôt que "trace pédagogique".

`[RISQUE]` La collection d'espèces peut être confondue avec une restauration réelle.

### 6.2 Images et preuves

`[RISQUE]` Une image IA ou illustration peut être interprétée comme preuve terrain.

`[RISQUE]` Les dioramas peuvent être confondus avec des photos réelles.

### 6.3 Formulations trop fortes

`[RISQUE]` "Espece protégée", "espece sauvee" sans preuve opérationnelle ou mesurée.

`[RISQUE]` "Cette espèce est protégée grâce à toi" sans preuve d'impact individuel.

---

## 7. Prototypes et code legacy

### 7.1 Exception prototype

`[ACTUEL_CODE]` `ensurePrototypeUnlockedSpecies` dans `species-context.service.ts`

`[PROTOTYPE]` Débloque automatiquement une espèce si aucune n'est débloquée.

`[DEPRECIE]` Ne fait pas partie de la cible produit.

`[A_VERIFIER_CODE]` À supprimer ou désactiver en production.

### 7.2 Fallback species

`[ACTUEL_CODE]` `FALLBACK_SPECIES` dans `biodex-preview.service.ts`

`[PROTOTYPE]` Utilisées si aucune espèce disponible depuis l'API.

`[A_DECIDER]` À conserver pour UI fallback ou à supprimer si l'API est fiable.

### 7.3 Logique mixte investissement + challenge

`[ACTUEL_CODE]` L'Abeille Noire nécessite investissement + challenge Academy.

`[DEPRECIE]` À simplifier en V1 (investissement seul).

---

## 8. Recommandations pour V1

### 8.1 Règles de déblocage V1

1. **Déblocage par don pur** : Si le projet est explicitement lié à une espèce (rôle "Espece principale" ou "Espece secondaire").
2. **Déblocage par soutien producteur** : Si le projet est explicitement lié à une espèce (rôle "Espece principale" ou "Espece secondaire").
3. **Pas de déblocage par achat produit**.
4. **Pas de déblocage par Academy seule**.
5. **Pas de condition challenge Academy pour le déblocage**.
6. **Suppression de l'exception prototype en production**.

### 8.2 Enrichissement V1

1. **Enrichissement par Graines** : 500 Graines pour passer au niveau 2.
2. **Niveau 2 débloque** : Description scientifique détaillée.
3. **Pas d'enrichissement par achat produit**.

### 8.3 Formulations V1

1. **Utiliser** : "Espece liée au projet", "Habitat associé", "Rôle écologique".
2. **Éviter** : "Espece protégée", "Espece sauvee", "Cette espèce est protégée grâce à toi".

### 8.4 Documentation V1

1. **Documenter le type d'image** : Photo terrain, illustration, IA, placeholder, diorama.
2. **Distinguer rareté gamifiée et statut de conservation**.
3. **Clarifier que le déblocage est une trace pédagogique, pas une preuve de sauvetage**.

---

## 9. Questions P0 suivantes

1. **P0-5** : Définir les niveaux de lien projet-espece acceptables pour le déblocage (rôle, documentation, preuve).
2. **P0-6** : Définir les règles RSE pour l'utilisation du BioDex dans les reportings.
3. **P0-7** : Définir les règles d'affichage des espèces dans les écrans de succès après checkout.
