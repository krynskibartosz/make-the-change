# ACADEMY-MISSIONS-CHALLENGES-AVENTURE-DISTINCTION.md

**P0-5b — Différence entre Academy, Missions, Challenges et Aventure**

---

## Contexte

**Date** : 7 mai 2026
**Objectif** : Clarifier le rôle exact de chaque brique pour éviter que l'app devienne confuse.

**Déjà validé (P0-5)** :
- Aventure est le hub principal
- Academy est une brique pédagogique importante, gratuite en V1, non obligatoire
- Academy peut donner des Graines
- Academy ne débloque pas seule le BioDex
- Les Graines peuvent enrichir une fiche déjà débloquée
- Missions et challenges ne doivent pas devenir une routine vide déconnectée de l'impact
- L'action cœur reste : don ou soutien à un projet réel

---

## 1. État réel dans le code

### 1.1 Route Aventure

`[ACTUEL_CODE]` Route `/adventure` existe dans `(tabs)/adventure/page.tsx`.

**Contenu affiché** :
- Salutation personnalisée avec faction/mascotte
- Quêtes du jour (quests)
- Progression mensuelle
- Projet recommandé
- Espèce BioDex liée
- Progression collective
- Solde Graines et Credits Impact

**Types de quests dans Aventure** :
- `education` : renvoie vers `/challenges/eco-fact`
- `daily_harvest` : renvoie vers `/challenges/daily-harvest`
- `social` : renvoie vers `/challenges`

**Fonction `getQuestHref`** :
- Génère des liens vers `/challenges` avec des paramètres (dayKey, faction, challengeId, viewerId)
- Les quests d'Aventure redirigent vers la page Challenges

### 1.2 Route Challenges

`[ACTUEL_CODE]` Route `/challenges` existe dans `(screens)/challenges/page.tsx`.

**Sous-routes** :
- `/challenges/eco-fact/[dayKey]` - Challenge éducation
- `/challenges/daily-harvest/[dayKey]` - Challenge récolte
- `/challenges/[slug]` - Challenge détaillé

**Contenu affiché** :
- Header avec faction
- Daily quests (quotidiens)
- Monthly quest (mensuelle)
- Progression par faction

**Types de challenges** :
- `education` : apprentissage avec article, fait, impact, rituel
- `social` : action sociale (ex: envoyer des Bravos)
- `daily_harvest` : récolte de Graines

**Structure des challenges** :
- `MockChallengeDetail` avec metadata : hint, nextStep, themeLabel, articleTitle, articleSummary, articleBody, ctaHref, ctaLabel
- Liens possibles : linkedSpeciesId, linkedProjectSlug, linkedProductSlug
- Récompenses en Graines
- Progression (progress/max)

### 1.3 Missions

`[ACTUEL_CODE]` Le terme "mission" est utilisé dans le code mais pas comme route principale.

**Occurrences** :
- `mock-factions.ts` : "Chaque mission terrain aide la canopée et rapproche tout le collectif du but."
- `mock-challenges.ts` : "Envoie trois Bravos distincts dans le Collectif pour valider la mission."
- `impact-tab-client.tsx` : "A complété une mission et ajouté des Graines à la récolte de Melli."
- `about.view-model.ts` : Section "mission" pour la page About

**Observation** : Le terme "mission" est utilisé de manière inconsistante :
- Parfois comme "mission terrain" (action réelle)
- Parfois comme synonyme de "challenge" (tâche gamifiée)
- Parfois dans le contexte de la mission de l'organisation

### 1.4 Academy

`[ACTUEL_CODE]` Academy existe comme route `(screens)/academy` (déjà analysé dans P0-5).

**Rôle dans le code** :
- Module pédagogique avec cours, unités, leçons
- Donne des Graines comme récompenses
- Ne débloque pas seule une espèce BioDex
- Système de progression (streak, lives, seeds)

**Liens avec Aventure** :
- Academy n'est pas directement visible dans Aventure actuellement
- Pas de lien direct entre Academy et les quests/challenges

---

## 2. Confusions actuelles

### 2.1 Confusion Mission vs Challenge

`[ACTUEL_CODE]` Le terme "mission" est utilisé de manière inconsistante :
- Dans `mock-factions.ts` : "mission terrain" (action réelle)
- Dans `mock-challenges.ts` : "valider la mission" (synonyme de challenge)
- Dans l'UI : parfois "mission", parfois "challenge", parfois "quest"

`[RISQUE]` Cette confusion peut rendre l'expérience utilisateur confuse : l'utilisateur ne sait pas s'il fait une mission (action réelle) ou un challenge (tâche gamifiée).

### 2.2 Confusion Aventure vs Challenges

`[ACTUEL_CODE]` Aventure affiche des "quests" qui redirigent vers `/challenges`.

`[RISQUE]` L'utilisateur peut penser que Aventure est un hub indépendant, alors qu'il renvoie vers Challenges pour la plupart des actions.

### 2.3 Confusion des types de quests

`[ACTUEL_CODE]` Les types de quests sont : `education`, `social`, `daily_harvest`.

`[A_DECIDER]` Ces types ne sont pas clairement définis pour l'utilisateur final. L'UI utilise des icônes mais pas de labels explicites.

### 2.4 Absence de définition claire

`[RISQUE]` Il n'y a pas de définition claire dans la documentation de ce qu'est une "mission" vs un "challenge" vs une "quest".

---

## 3. Définitions proposées

### 3.1 Aventure

**Rôle** : Hub principal qui orchestre l'expérience quotidienne.

**Fréquence d'usage** : Quotidienne.

**Place dans la navigation** : Tab principale.

**Contenu affiché** :
- Salutation personnalisée avec faction/mascotte
- Action prioritaire claire
- Progression mensuelle
- Projet recommandé
- Espèce BioDex liée
- Progression collective
- Solde Graines et Credits Impact

**Relation avec autres briques** :
- **Academy** : peut être recommandée comme action prioritaire ou accès secondaire
- **Missions** : peut afficher une mission courte comme action prioritaire
- **Challenges** : peut afficher un challenge comme action prioritaire
- **Projets** : affiche le projet recommandé
- **BioDex** : affiche l'espèce liée
- **Collectif** : affiche la progression collective

`[CIBLE_VALIDEE]` Aventure = hub principal qui orchestre l'expérience quotidienne.

`[CIBLE_VALIDEE]` Aventure doit mettre en avant une action prioritaire claire.

`[CIBLE_VALIDEE]` Aventure orchestre Academy, Missions, Defis/Challenges, Projets, BioDex et Collectif.

`[HYPOTHESE_FORTE]` Aventure peut afficher des accès secondaires : Academy, projet recommandé, espèce BioDex, objectif collectif, avantage discret.

`[A_DECIDER]` Nombre exact de cartes/actions visibles dans le hub.

`[A_DECIDER]` Format exact de l'action prioritaire.

`[A_DECIDER]` Place exacte des accès secondaires.

### 3.2 Academy

**Rôle pédagogique** : Apprendre et comprendre, pas prouver l'impact.

**Lien avec Graines** : Academy peut donner des Graines (validé P0-5).

**Lien avec BioDex** : Academy ne débloque pas seule une espèce BioDex (validé P0-5). Les Graines d'Academy peuvent enrichir une fiche déjà débloquée.

**Lien avec projets** : Academy peut recommander des projets pour contextualiser l'apprentissage (hypothèse forte P0-5).

**Lien avec Aventure** : Academy peut être visible dans Aventure comme action prioritaire (hypothèse forte P0-5).

`[CIBLE_VALIDEE]` Academy = apprendre et comprendre, pas prouver l'impact.

### 3.3 Missions

**Définition** : Petites actions guidées qui donnent une direction à l'utilisateur.

**Action courte** : Oui, action simple et rapide (quelques minutes).

**Objectif quotidien** : Oui, missions quotidiennes pour donner une direction.

**Impulsion** : Donner une direction claire à l'utilisateur chaque jour.

**Retour utilisateur** : Feedback immédiat sur la complétion.

**Lien possible avec Academy** : Une mission peut renvoyer vers Academy (ex: "Apprends sur les pollinisateurs").

**Lien possible avec projets** : Une mission peut renvoyer vers un projet (ex: "Découvre ce projet").

**Lien possible avec BioDex** : Une mission peut renvoyer vers une espèce BioDex (ex: "Découvre cette espèce").

**Lien possible avec collectif** : Une mission peut être sociale (ex: "Envoie un Bravo").

**Attention** : Une mission n'est PAS uniquement "action terrain". Une mission peut être pédagogique, sociale, exploratoire ou orientée projet.

`[CIBLE_VALIDEE]` Missions = impulsions courtes et guidées qui donnent une direction quotidienne.

### 3.4 Challenges

**Définition** : Objectifs structurés ou détaillés, espace secondaire pour objectifs plus avancés.

**Objectifs plus structurés** : Oui, parcours ou défis détaillés avec plusieurs étapes.

**Parcours ou défis détaillés** : Oui, challenges avec article, fait, impact, rituel.

**Progression** : Progression (progress/max) avec récompenses.

**Récompenses** : Peuvent donner des Graines.

**Différence avec missions** : Challenges sont plus détaillés et structurés, missions sont plus courtes et guidées.

**Rôle de la route `/challenges`** : Espace secondaire pour objectifs détaillés, pas onglet principal.

`[CIBLE_VALIDEE]` Challenges = objectifs structurés ou détaillés, espace secondaire.

---

## 4. Réponses aux 12 questions

### Q1 : Quelle différence entre mission et challenge ?

**Réponse** :

`[CIBLE_VALIDEE]` Mission = impulsion courte et guidée (quotidienne, quelques minutes).

`[CIBLE_VALIDEE]` Challenge = objectif structuré ou détaillé (plusieurs étapes, plus de contexte).

**Différence clé** :
- Mission : courte, guidée, quotidienne, direction simple
- Challenge : détaillé, structuré, plus de contexte, espace secondaire

### Q2 : Une mission est-elle toujours quotidienne ?

**Réponse** :

`[HYPOTHESE_FORTE]` Oui, les missions sont principalement quotidiennes pour donner une direction chaque jour.

`[A_DECIDER]` Il pourrait y avoir des missions hebdomadaires ou exceptionnelles, mais la mission principale est quotidienne.

### Q3 : Un challenge peut-il durer plusieurs jours ?

**Réponse** :

`[ACTUEL_CODE]` Dans le code actuel, les challenges ont un `startDate` et un `endDate`, donc ils peuvent durer plusieurs jours.

`[CIBLE_VALIDEE]` Oui, un challenge peut durer plusieurs jours (ex: challenge mensuel).

### Q4 : Une mission peut-elle simplement renvoyer vers Academy ?

**Réponse** :

`[CIBLE_VALIDEE]` Oui, une mission peut renvoyer vers Academy (ex: "Apprends sur les pollinisateurs").

`[HYPOTHESE_FORTE]` Academy peut être recommandée comme mission quotidienne pour encourager l'apprentissage.

### Q5 : Une mission peut-elle renvoyer vers un projet ?

**Réponse** :

`[CIBLE_VALIDEE]` Oui, une mission peut renvoyer vers un projet (ex: "Découvre ce projet").

`[HYPOTHESE_FORTE]` Les missions peuvent renvoyer vers des projets pour contextualiser l'apprentissage.

### Q6 : Une mission peut-elle donner des Graines ?

**Réponse** :

`[ACTUEL_CODE]` Dans le code actuel, les challenges donnent des récompenses en Graines.

`[CIBLE_VALIDEE]` Oui, une mission peut donner des Graines.

`[CIBLE_VALIDEE]` Missions et challenges peuvent donner des Graines, mais ne doivent pas créer de fausse preuve d'impact.

### Q7 : Un challenge peut-il donner des Graines ?

**Réponse** :

`[ACTUEL_CODE]` Dans le code actuel, les challenges donnent des récompenses en Graines.

`[CIBLE_VALIDEE]` Oui, un challenge peut donner des Graines.

`[CIBLE_VALIDEE]` Missions et challenges peuvent donner des Graines, mais ne doivent pas créer de fausse preuve d'impact.

### Q8 : Aventure doit-elle afficher une seule action prioritaire ?

**Réponse** :

`[CIBLE_VALIDEE]` Oui, Aventure doit éviter d'afficher trop d'actions en même temps.

`[HYPOTHESE_FORTE]` Aventure doit afficher une seule action prioritaire pour éviter de surcharger l'utilisateur.

### Q9 : `/challenges` doit-il rester une page secondaire ?

**Réponse** :

`[CIBLE_VALIDEE]` Oui, `/challenges` reste secondaire (pas onglet principal).

`[ACTUEL_CODE]` `/challenges` est une route dans `(screens)`, pas dans `(tabs)`.

`[CIBLE_VALIDEE]` Aventure est le hub principal, Challenges est un espace secondaire pour objectifs détaillés.

### Q10 : Comment éviter que missions/challenges deviennent une gamification vide ?

**Réponse** :

`[CIBLE_VALIDEE]` Relier missions/challenges à l'impact réel sans faire de fausse preuve.

`[CIBLE_VALIDEE]` Les missions/challenges peuvent donner des Graines (progression symbolique), mais ne doivent pas créer de fausse preuve d'impact.

`[CIBLE_VALIDEE]` L'impact réel reste : don ou soutien à un projet réel.

`[CIBLE_VALIDEE]` Les missions/challenges doivent être contextuels et liés à des projets, espèces ou contenus pédagogiques réels.

### Q11 : Comment relier missions/challenges à l'impact réel sans faire de fausse preuve ?

**Réponse** :

`[CIBLE_VALIDEE]` Les missions/challenges peuvent être liés à des projets réels (linkedProjectSlug).

`[CIBLE_VALIDEE]` Les missions/challenges peuvent être liés à des espèces BioDex (linkedSpeciesId).

`[CIBLE_VALIDEE]` Les récompenses sont des Graines (progression symbolique), pas des Credits Impact.

`[CIBLE_VALIDEE]` Les missions/challenges ne créent pas d'impact direct, mais peuvent encourager l'action réelle (don ou soutien).

### Q12 : Quels termes utiliser dans l'UI : mission, défi, challenge, action du jour, objectif ?

**Réponse** :

`[CIBLE_VALIDEE]` UI française recommandée :

- `Mission` = petite action guidée, souvent courte ou quotidienne
- `Défi` = objectif structuré, plus détaillé ou plus long
- `Action prioritaire` = action mise en avant dans Aventure
- `Aventure` = hub principal
- `Academy` = apprentissage
- `Projet` = lieu de l'impact réel
- `BioDex` = collection pédagogique et mémoire du vivant
- `Collectif` = dynamique commune

`[DEPRECIE]` À éviter côté utilisateur :

- `Quest` : terme technique actuel / legacy à ne pas afficher
- `Challenge` : si un mot français clair peut être utilisé, préférer "Défi"
- `Mission terrain` pour toutes les missions, car toutes ne sont pas forcément terrain

`[ACTUEL_CODE]` Code actuel / legacy :

- `quest` peut rester un terme technique actuel si présent dans le code
- Ne pas le traiter comme wording final utilisateur
- Ne pas renommer le code maintenant

`[A_DECIDER]` Valider les termes exacts à utiliser dans l'UI.

---

## 5. Doctrine V1 recommandée

### 5.1 Aventure

`[CIBLE_VALIDEE]` Aventure = hub principal qui orchestre l'expérience quotidienne.

`[CIBLE_VALIDEE]` Aventure affiche une seule action prioritaire pour éviter de surcharger l'utilisateur.

`[CIBLE_VALIDEE]` Aventure affiche : salutation, faction, action prioritaire, progression mensuelle, projet recommandé, espèce BioDex liée, progression collective, solde Graines et Credits Impact.

### 5.2 Academy

`[CIBLE_VALIDEE]` Academy = apprendre et comprendre, pas prouver l'impact.

`[CIBLE_VALIDEE]` Academy peut donner des Graines.

`[CIBLE_VALIDEE]` Academy ne débloque pas seule une espèce BioDex.

`[HYPOTHESE_FORTE]` Academy peut être recommandée comme action prioritaire dans Aventure.

### 5.3 Missions

`[CIBLE_VALIDEE]` Missions = impulsions courtes et guidées qui donnent une direction quotidienne.

`[CIBLE_VALIDEE]` Missions peuvent donner des Graines.

`[CIBLE_VALIDEE]` Missions peuvent renvoyer vers Academy, projets, BioDex ou collectif.

`[CIBLE_VALIDEE]` Missions ne créent pas d'impact direct, mais peuvent encourager l'action réelle.

### 5.4 Challenges

`[CIBLE_VALIDEE]` Challenges = objectifs structurés ou détaillés, espace secondaire.

`[CIBLE_VALIDEE]` Challenges peuvent durer plusieurs jours.

`[CIBLE_VALIDEE]` Challenges peuvent donner des Graines.

`[CIBLE_VALIDEE]` `/challenges` reste secondaire (pas onglet principal).

### 5.5 Projets

`[CIBLE_VALIDEE]` Projets = lieu de l'impact réel (don ou soutien).

`[CIBLE_VALIDEE]` L'action cœur reste : don ou soutien à un projet réel.

### 5.6 BioDex

`[CIBLE_VALIDEE]` BioDex = attachement et mémoire du vivant.

`[CIBLE_VALIDEE]` BioDex se débloque par don ou soutien producteur avec lien explicite (validé P0-4).

### 5.7 Collectif

`[CIBLE_VALIDEE]` Collectif = impact commun / dynamique sociale.

### 5.8 Graines

`[CIBLE_VALIDEE]` Graines = progression, engagement, Academy, BioDex, missions et reconnaissance symbolique.

`[CIBLE_VALIDEE]` Missions et challenges peuvent donner des Graines, mais ne doivent pas créer de fausse preuve d'impact.

---

## 6. Classification des éléments trouvés

### `[ACTUEL_CODE]`

- Route `/adventure` avec quests qui redirigent vers `/challenges`
- Route `/challenges` avec daily quests et monthly quest
- Types de quests : education, social, daily_harvest
- Mock challenges avec linkedSpeciesId, linkedProjectSlug, linkedProductSlug
- Récompenses en Graines pour challenges
- Progression (progress/max) pour challenges
- Terme "mission" utilisé de manière inconsistante dans le code

### `[CIBLE_VALIDEE]`

- Aventure = hub principal qui orchestre
- Academy = apprendre et comprendre
- Missions = impulsions courtes et guidées
- Challenges = objectifs structurés ou détaillés
- Projets = lieu de l'impact réel
- BioDex = attachement et mémoire du vivant
- Collectif = impact commun / dynamique sociale
- Missions et challenges peuvent donner des Graines
- Missions et challenges ne doivent pas créer de fausse preuve d'impact
- `/challenges` reste secondaire
- Aventure doit éviter d'afficher trop d'actions en même temps

### `[HYPOTHESE_FORTE]`

- Academy peut être recommandée comme action prioritaire dans Aventure
- Missions sont principalement quotidiennes
- Missions peuvent renvoyer vers Academy ou projets

### `[A_DECIDER]`

- Termes exacts à utiliser dans l'UI (mission, défi, challenge, action du jour, objectif)
- Missions hebdomadaires ou exceptionnelles
- Format exact des missions dans Aventure

### `[DEPRECIE]`

- Utilisation inconsistante du terme "mission" dans le code (parfois comme action réelle, parfois comme synonyme de challenge)

### `[RISQUE]`

- Confusion entre mission et challenge peut rendre l'expérience utilisateur confuse
- Aventure redirige vers Challenges peut être confus pour l'utilisateur
- Types de quests non clairement définis pour l'utilisateur final
- Absence de définition claire de mission vs challenge vs quest

---

## 7. Décisions validables maintenant

**Validées (`[CIBLE_VALIDEE]`)** :
- Aventure = hub principal qui orchestre
- Academy = apprendre et comprendre
- Missions = impulsions courtes et guidées
- Challenges = objectifs structurés ou détaillés
- Projets = lieu de l'impact réel
- BioDex = attachement et mémoire du vivant
- Collectif = impact commun / dynamique sociale
- Missions et challenges peuvent donner des Graines
- Missions et challenges ne doivent pas créer de fausse preuve d'impact
- `/challenges` reste secondaire
- Aventure doit éviter d'afficher trop d'actions en même temps

**Hypothèses fortes (`[HYPOTHESE_FORTE]`)** :
- Academy peut être recommandée comme action prioritaire dans Aventure
- Missions sont principalement quotidiennes
- Missions peuvent renvoyer vers Academy ou projets

---

## 8. Éléments encore à décider

- Termes exacts à utiliser dans l'UI (mission, défi, challenge, action du jour, objectif)
- Missions hebdomadaires ou exceptionnelles
- Format exact des missions dans Aventure
- Sort final de la confusion "mission" vs "challenge" dans le code

---

## 9. Prochaine question P0 recommandée

P0-7 : Quelle est la promesse business initiale ? (dépend de P0-1, P0-5)
