# ACADEMY-ROLE-AUDIT.md

**P0-5 — Rôle exact de l'Academy**

---

## Contexte

**Date** : 7 mai 2026
**Objectif** : Clarifier le rôle produit, UX, gamification et business de l'Academy dans Make the Change.

**Déjà validé** :
- L'Academy seule ne débloque pas une espèce BioDex (P0-4)
- L'Academy peut donner des Graines
- Les Graines peuvent enrichir une fiche BioDex déjà débloquée
- Les Graines ne peuvent pas débloquer une espèce sans impact réel lié à un projet
- Le cœur produit reste : soutenir/donner à des projets réels, comprendre l'impact, progresser, revenir
- Aventure est le hub principal
- Academy doit renforcer la compréhension, pas bloquer l'action

---

## 1. État réel de l'Academy dans le code

### 1.1 Routes Academy actuelles

`[ACTUEL_CODE]` Academy existe comme route immersive dans `(screens)/academy` :

- `/academy` - Page principale avec parcours, unités, progression
- `/academy/chapters` - Sélection de chapitres
- `/academy/[chapter]/[unit]` - Détail d'une unité avec leçons
- `/academy/out-of-lives` - Écran quand plus de vies
- `/academy/streak` - Série Academy (streak)

`[ACTUEL_CODE]` Structure de données dans `(lab)/_lib/mock-academy.ts` :

- **AcademyCursus** : 3 cursus possibles (`living-mechanics`, `nature-mysteries`, `climate-solutions`)
- **AcademyChapter** : Chapitres avec unités
- **AcademyUnit** : Unités avec leçons et exercices
- **AcademyLesson** : Leçons avec exercices (STORY, SWIPE, DRAG_DROP, QUIZ)
- **AcademyProgress** : Progression utilisateur (unités complétées, graines, streak, vies)
- **AcademyReward** : Récompenses en Graines (`type: 'seeds'`)

### 1.2 Labs Kinnu / Kinnu V2

`[ACTUEL_CODE] [PROTOTYPE]` Des labs liés à l'apprentissage existent dans `(lab)/kinnu` et `(lab)/kinnu-v2`.

`[DEPRECIE]` Ces labs sont des prototypes et ne doivent pas être considérés comme source de vérité finale pour l'Academy produit.

`[A_DECIDER]` Il faut choisir si Kinnu reste une référence interne, une inspiration ou un module produit.

### 1.3 Présence dans Aventure

`[ACTUEL_CODE]` Academy n'est pas directement visible dans la page Aventure actuelle (`/adventure`).

`[ACTUEL_CODE]` Aventure contient :
- Salutation personnalisée
- Faction/mascotte
- Quêtes du jour
- Progression mensuelle
- Projet recommandé
- Espèce BioDex liée
- Progression collective
- Solde Graines et Credits Impact

`[A_DECIDER]` Il faut définir si Academy doit être visible dans Aventure et comment.

### 1.4 Liens avec challenges

`[ACTUEL_CODE]` Les espèces BioDex ont un champ `associated_challenges` dans `mock-biodex.ts`.

`[ACTUEL_CODE]` L'Abeille Noire nécessite un challenge Academy en plus de l'investissement dans la logique actuelle de déblocage.

`[CIBLE_VALIDEE]` En V1, l'Academy ne doit pas être une condition de déblocage d'espèce (P0-4 validé).

### 1.5 Liens avec Graines

`[ACTUEL_CODE]` Academy donne des Graines comme récompenses :

- `AcademyReward` : `{ type: 'seeds', amount: number, label: string }`
- `seedsBalance` dans `AcademyProgress`
- Récompenses par unité complétée

`[CIBLE_VALIDEE]` Academy peut donner des Graines (validé P0-4).

`[ACTUEL_CODE] [A_TESTER]` Les montants exacts de récompenses en Graines sont à tester.

### 1.6 Liens avec BioDex

`[ACTUEL_CODE]` Academy peut indirectement enrichir une fiche BioDex via les Graines (validé P0-4).

`[CIBLE_VALIDEE]` Academy ne débloque pas seule une espèce BioDex (validé P0-4).

`[ACTUEL_CODE]` L'Abeille Noire a un lien avec un challenge Academy dans les mocks, mais c'est déprécié en V1.

### 1.7 Liens avec projets

`[ACTUEL_CODE]` Academy a des "events" liés à des projets dans les mocks :

- `AcademyEvent` avec `sponsor`, `projectUrl`, `impactTarget`
- Events actifs avec countdown
- Archives avec `archiveImpact` et `archiveCta`

`[ACTUEL_CODE]` Les unités Academy ont un kind `project` qui peut être lié à des projets.

`[A_DECIDER]` Academy doit-elle recommander des projets ? Comment ?

### 1.8 Progression

`[ACTUEL_CODE]` Academy a un système de progression complet :

- **Streak** : série de jours consécutifs (`streak.current`, `streak.best`, `streak.completedDays`)
- **Lives** : système de vies avec régénération (`lives.remaining`, `lives.updatedAt`)
- **Seeds** : solde de Graines lié à la progression
- **Unités complétées** : `completedUnitIds`
- **Leçons complétées** : `completedLessonIds`
- **Résultats** : scores, erreurs, récompenses gagnées

`[ACTUEL_CODE]` Il y a un système de "mistake queue" pour revoir les concepts manqués.

### 1.9 Vies / contraintes

`[ACTUEL_CODE]` Academy a un système de vies :

- `MAX_LIVES` dans `(lab)/_lib/lives.ts`
- Régénération basée sur le temps
- Écran `/academy/out-of-lives` quand plus de vies
- Possibilité d'avoir des vies illimitées (`isUnlimitedLives`)

`[ACTUEL_CODE]` Les vies se régénèrent automatiquement.

`[A_DECIDER]` Le système de vies est-il nécessaire en V1 ? Est-ce une contrainte ou une mécanique gamifiée ?

### 1.10 Contenus gratuits / premium

`[CIBLE_VALIDEE]` Academy de base gratuite (documenté dans `02-PRODUIT.md`).

`[HYPOTHESE_FORTE]` Contenus avancés possibles via abonnement Ambassadeur plus tard.

`[A_DECIDER]` Academy doit-elle être gratuite en V1 ? Y a-t-il une place pour du contenu premium ?

### 1.11 Textes hardcodés

`[ACTUEL_CODE]` Academy a des textes hardcodés dans les fichiers de contenu :

- `(screens)/academy/_lib/content/units/` : contenus des unités par chapitre
- Des labels UI dans `page.tsx` : "Préparation du cours", "Unité verrouillée", etc.

`[A_DECIDER]` Ces textes doivent-ils être externalisés ou rester hardcodés en V1 ?

### 1.12 Différences entre doc historique et code réel

**Documentation historique** :
- Academy décrite comme expérience d'apprentissage, parfois associée au lab
- Academy de base gratuite, contenus avancés via Ambassadeur
- Labs Kinnu/Kinnu V2 mentionnés comme variantes

**Code réel** :
- Academy est une route immersive complète dans `(screens)/academy`
- Système de progression sophistiqué (lives, streak, mistake queue)
- Events liés à des projets avec countdown
- Labs Kinnu/Kinnu V2 existent mais sont des prototypes séparés

`[RISQUE]` La documentation ne doit pas laisser croire que les labs sont l'Academy finale.

---

## 2. Réponses aux 12 questions

### Q1 : L'Academy est-elle un module central ou secondaire ?

**Réponse** :

`[ACTUEL_CODE]` Academy est une route immersive complète avec son propre système de progression, mais n'est pas intégrée dans Aventure.

`[HYPOTHESE_FORTE]` Academy est un module pédagogique central mais non obligatoire.

`[A_DECIDER]` Academy doit-elle être un module central (visible dans Aventure) ou un module secondaire (accessible via profil ou projets) ?

### Q2 : L'Academy est-elle obligatoire avant un don ou un soutien ?

**Réponse** :

`[CIBLE_VALIDEE]` Academy ne doit pas être obligatoire avant un don ou un soutien.

`[ACTUEL_CODE]` Aucune contrainte Academy n'est appliquée dans les flux de don/soutien actuels.

### Q3 : L'Academy doit-elle donner des Graines ?

**Réponse** :

`[CIBLE_VALIDEE]` Academy peut donner des Graines (validé P0-4).

`[ACTUEL_CODE]` Academy donne des Graines comme récompenses dans les mocks.

`[ACTUEL_CODE] [A_TESTER]` Les montants exacts de récompenses sont à tester.

### Q4 : L'Academy doit-elle être visible dans Aventure ?

**Réponse** :

`[ACTUEL_CODE]` Academy n'est pas visible dans Aventure actuellement.

`[HYPOTHESE_FORTE]` Academy devrait être visible dans Aventure pour encourager l'apprentissage.

`[A_DECIDER]` Comment Academy doit-elle être intégrée dans Aventure ? Carte ? Section ? Recommandation quotidienne ?

### Q5 : L'Academy doit-elle être une page autonome forte ?

**Réponse** :

`[ACTUEL_CODE]` Academy est déjà une page autonome forte avec son propre système de progression.

`[CIBLE_VALIDEE]` Academy doit rester une page autonome immersive pour l'apprentissage profond.

`[HYPOTHESE_FORTE]` Academy peut coexister avec une présence légère dans Aventure.

### Q6 : L'Academy doit-elle recommander des projets ?

**Réponse** :

`[ACTUEL_CODE]` Academy a des events liés à des projets avec countdowns et CTAs.

`[HYPOTHESE_FORTE]` Academy peut recommander des projets pour contextualiser l'apprentissage.

`[A_DECIDER]` Academy doit-elle recommander des projets ? Comment ? À quel moment ?

### Q7 : L'Academy doit-elle recommander des espèces BioDex ?

**Réponse** :

`[ACTUEL_CODE]` Aucun lien direct entre Academy et recommandation d'espèces BioDex dans le code actuel.

`[HYPOTHESE_FORTE]` Academy peut recommander des espèces BioDex pour contextualiser l'apprentissage sur la biodiversité.

`[A_DECIDER]` Academy doit-elle recommander des espèces BioDex ? Comment ?

### Q8 : L'Academy peut-elle enrichir une fiche BioDex indirectement via les Graines ?

**Réponse** :

`[CIBLE_VALIDEE]` Academy peut enrichir une fiche BioDex indirectement via les Graines (validé P0-4).

`[CIBLE_VALIDEE]` Les Graines peuvent enrichir une fiche BioDex déjà débloquée (validé P0-4).

### Q9 : L'Academy doit-elle être gratuite en V1 ?

**Réponse** :

`[CIBLE_VALIDEE]` Academy de base gratuite (documenté dans `02-PRODUIT.md`).

`[HYPOTHESE_FORTE]` Academy doit être gratuite en V1.

`[A_DECIDER]` Y a-t-il une place pour du contenu premium plus tard ? Comment le structurer ?

### Q10 : Y a-t-il une place pour du contenu premium plus tard ?

**Réponse** :

`[HYPOTHESE_FORTE]` Contenus avancés possibles via abonnement Ambassadeur plus tard (documenté dans `02-PRODUIT.md`).

`[A_DECIDER]` Comment structurer les contenus premium ? Quels contenus seraient premium ?

### Q11 : Quelle différence entre Academy, Challenges, Missions et Aventure ?

**Réponse** :

`[ACTUEL_CODE]` Dans le code actuel :
- **Academy** : Route immersive avec leçons, exercices, progression, lives, streak
- **Challenges** : Associés aux espèces BioDex, peuvent être liés à Academy
- **Missions** : Terme utilisé dans les events Academy ("Mission active")
- **Aventure** : Hub quotidien avec quêtes, progression, projets, BioDex

`[A_DECIDER]` Clarifier la distinction entre Academy, Challenges, Missions et Aventure dans la doctrine produit.

### Q12 : Que faire des anciens labs Kinnu / Kinnu V2 ?

**Réponse** :

`[ACTUEL_CODE] [PROTOTYPE]` Labs Kinnu/Kinnu V2 sont des prototypes dans `(lab)/kinnu` et `(lab)/kinnu-v2`.

`[DEPRECIE]` Ces labs ne doivent pas être considérés comme source de vérité finale pour l'Academy produit.

`[A_DECIDER]` Classer Kinnu/Kinnu V2 comme prototypes ou inspirations. Ne pas les utiliser comme cible produit.

---

## 3. Classification des occurrences trouvées

### `[ACTUEL_CODE]`

- Route Academy dans `(screens)/academy` avec page principale, chapitres, unités
- Mock Academy dans `(lab)/_lib/mock-academy.ts` avec types complets
- Système de progression (streak, lives, seeds, unités complétées)
- Système de récompenses en Graines
- Events liés à des projets avec countdowns
- Labs Kinnu/Kinnu V2 dans `(lab)/kinnu` et `(lab)/kinnu-v2`
- Textes hardcodés dans les fichiers de contenu

### `[CIBLE_VALIDEE]`

- Academy est une brique pédagogique importante du produit
- Academy est non obligatoire
- Academy ne bloque jamais le don, le soutien producteur ou l'achat
- Academy peut donner des Graines
- Academy ne débloque pas seule une espèce BioDex (P0-4)
- Academy de base est gratuite en V1
- Academy renforce la compréhension des projets, espèces, écosystèmes et gestes d'impact

### `[HYPOTHESE_FORTE]`

- Academy est un moteur de rétention quotidienne
- Academy doit être visible dans Aventure
- Academy peut recommander des projets et espèces liés aux contenus appris
- Des contenus avancés pourraient exister plus tard via Ambassadeur

### `[A_TESTER]`

- Montants exacts de Graines
- Seuils exacts d'enrichissement BioDex via Graines

### `[A_DECIDER]`

- Niveau exact de visibilité dans Aventure
- Format exact des recommandations projet / espèce
- Rôle exact du système de vies en V1
- Montants exacts de Graines
- Place exacte des contenus premium
- Sort final des labs Kinnu / Kinnu V2
- Quelle place exacte l'Academy doit-elle prendre dans Aventure, les missions et la navigation ?

### `[PROTOTYPE]`

- Labs Kinnu / Kinnu V2
- Système actuel de lives, streak, mistake queue s'il n'est pas encore validé produit

### `[DEPRECIE]`

- Toute condition où Academy seule débloque une espèce BioDex
- Labs Kinnu/Kinnu V2 comme source de vérité finale pour Academy

### `[RISQUE]`

- Documentation laissant croire que les labs sont l'Academy finale
- Academy vue comme séparée du cœur impact
- Système de vies perçu comme contrainte plutôt que mécanique gamifiée

---

## 4. Doctrine Academy V1 recommandée

### 4.1 Rôle produit

`[CIBLE_VALIDEE]` Academy est une brique pédagogique importante du produit.

`[CIBLE_VALIDEE]` Academy est non obligatoire.

`[CIBLE_VALIDEE]` Academy ne bloque jamais le don, le soutien producteur ou l'achat.

`[CIBLE_VALIDEE]` Academy renforce la compréhension des projets, espèces, écosystèmes et gestes d'impact.

`[HYPOTHESE_FORTE]` Academy est un moteur de rétention quotidienne.

### 4.2 Intégration produit

`[HYPOTHESE_FORTE]` Academy doit être visible dans Aventure.

`[CIBLE_VALIDEE]` Academy reste une page autonome immersive pour l'apprentissage profond.

`[CIBLE_VALIDEE]` Academy peut être accessible depuis Aventure, Profil et Projets.

`[A_DECIDER]` Niveau exact de visibilité dans Aventure.

`[A_DECIDER]` Quelle place exacte l'Academy doit-elle prendre dans Aventure, les missions et la navigation ?

### 4.3 Récompenses

`[CIBLE_VALIDEE]` Academy peut donner des Graines.

`[CIBLE_VALIDEE]` Les Graines peuvent enrichir une fiche BioDex déjà débloquée.

`[CIBLE_VALIDEE]` Academy ne débloque pas seule une espèce BioDex.

`[CIBLE_VALIDEE]` Academy ne donne pas de Credits Impact.

`[A_TESTER]` Montants exacts de Graines.

### 4.4 Recommandations

`[HYPOTHESE_FORTE]` Academy peut recommander des projets et espèces liés aux contenus appris.

`[A_DECIDER]` Format exact des recommandations projet / espèce.

### 4.5 Gamification

`[A_DECIDER]` Rôle exact du système de vies en V1.

`[PROTOTYPE]` Système actuel de lives, streak, mistake queue s'il n'est pas encore validé produit.

`[CIBLE_VALIDEE]` La progression (unités complétées, leçons) peut être gardée.

### 4.6 Contenu

`[CIBLE_VALIDEE]` Academy de base gratuite en V1.

`[HYPOTHESE_FORTE]` Des contenus avancés pourraient exister plus tard via Ambassadeur.

`[A_DECIDER]` Place exacte des contenus premium.

### 4.7 Labs Kinnu/Kinnu V2

`[ACTUEL_CODE] [PROTOTYPE]` Labs Kinnu/Kinnu V2 sont des prototypes.

`[DEPRECIE]` Ne pas utiliser les labs comme source de vérité finale pour Academy.

`[A_DECIDER]` Sort final des labs Kinnu / Kinnu V2.

---

## 5. Éléments à garder comme prototype

`[ACTUEL_CODE] [PROTOTYPE]` Labs Kinnu/Kinnu V2 dans `(lab)/kinnu` et `(lab)/kinnu-v2`.

`[DEPRECIE]` Condition Academy pour déblocage BioDex (ex: Abeille Noire).

---

## 6. Décisions réellement validables maintenant

**Validées (`[CIBLE_VALIDEE]`)** :
- Academy est une brique pédagogique importante du produit
- Academy est non obligatoire
- Academy ne bloque jamais le don, le soutien producteur ou l'achat
- Academy peut donner des Graines
- Academy ne débloque pas seule une espèce BioDex
- Academy de base est gratuite en V1
- Academy renforce la compréhension des projets, espèces, écosystèmes et gestes d'impact

**Hypothèses fortes (`[HYPOTHESE_FORTE]`)** :
- Academy est un moteur de rétention quotidienne
- Academy doit être visible dans Aventure
- Academy peut recommander des projets et espèces liés aux contenus appris
- Des contenus avancés pourraient exister plus tard via Ambassadeur

---

## 7. Éléments encore à décider

- Niveau exact de visibilité dans Aventure
- Format exact des recommandations projet / espèce
- Rôle exact du système de vies en V1
- Montants exacts de Graines
- Place exacte des contenus premium
- Sort final des labs Kinnu / Kinnu V2
- Quelle place exacte l'Academy doit-elle prendre dans Aventure, les missions et la navigation ?

---

## 8. Écarts entre code et doc

**Documentation** :
- Academy décrite comme parfois associée au lab
- Labs Kinnu/Kinnu V2 mentionnés comme variantes

**Code réel** :
- Academy est une route immersive complète dans `(screens)/academy`
- Labs Kinnu/Kinnu V2 sont des prototypes séparés
- Academy a un système de progression sophistiqué

`[RISQUE]` La documentation ne doit pas laisser croire que les labs sont l'Academy finale.

---

## 9. Prochaine question P0 recommandée

P0-5b — Différence entre Academy, Missions, Challenges et Aventure

Objectif : clarifier le rôle exact de chaque brique pour éviter que l'app devienne confuse.
