# Modèle Produit — Impact, Missions, BioDex & Leaderboards

**Statut**: Proposition de cadrage 2026  
**Périmètre**: `apps/web-client`, `apps/web`, `packages/core`  
**Objectif**: fixer une architecture produit cohérente entre investissement, commerce, communauté, missions, BioDex et classement.

## 1. Problème Produit

Aujourd'hui, l'application contient déjà des briques fortes:
- investissement dans des projets concrets,
- génération et usage de points,
- e-commerce en points ou en argent,
- BioDex,
- challenges / quests,
- leaderboard.

Le risque produit est de traiter ces briques comme des fonctionnalités séparées alors qu'elles décrivent en réalité une seule boucle d'engagement:

1. l'utilisateur soutient un projet réel,
2. il reçoit une reconnaissance et une progression,
3. il découvre la biodiversité liée à ce projet,
4. il revient pour suivre, partager, compléter des missions,
5. il dépense ses points ou les réinvestit,
6. il renforce son statut dans l'écosystème.

## 2. Découpage Produit Recommandé

Le produit doit être organisé autour de **5 domaines métier**:

| Domaine | Rôle principal | Question à laquelle il répond |
|---|---|---|
| `Investissement` | Financer un impact réel | "Qu'est-ce que je soutiens concrètement ?" |
| `Produits` | Convertir la valeur perçue en usage | "Qu'est-ce que je reçois ou consomme ?" |
| `Communauté` | Créer la preuve sociale et la rétention | "Avec qui je vis cette expérience ?" |
| `Missions` | Orchestrer les comportements attendus | "Que dois-je faire ensuite ?" |
| `BioDex` | Matérialiser la relation au vivant | "Qu'est-ce que j'ai découvert et débloqué ?" |

## 3. Positionnement de Chaque Domaine

### 3.1 `Investissement`

L'investissement est le **coeur du produit**.  
Il doit rester la source principale de:
- l'impact réel,
- la progression principale,
- la crédibilité du leaderboard,
- le déverrouillage initial des espèces du BioDex.

### 3.2 `Produits`

Les produits servent à:
- convertir les points en valeur tangible,
- prolonger la relation avec les partenaires,
- augmenter la rétention et la perception de récompense.

Les produits **ne doivent pas remplacer l'investissement comme source d'impact principal**.  
Ils sont un prolongement de l'engagement, pas son équivalent.

### 3.3 `Communauté`

La communauté sert à:
- rendre l'impact visible,
- créer des habitudes de retour,
- amplifier les histoires de projets,
- valoriser les membres engagés.

La communauté doit apporter un **bonus secondaire**, pas devenir la source dominante du score d'impact.

### 3.4 `Missions`

Les missions doivent être conçues comme un **moteur transverse**.  
Elles ne sont ni un sous-module des projets, ni une sous-feature de la communauté.

Leur rôle:
- guider les prochaines actions,
- relier les domaines métier entre eux,
- transformer l'usage en progression lisible,
- éviter une expérience fragmentée.

### 3.5 `BioDex`

Le BioDex doit être un **mix 50/50** entre:
- **encyclopédie publique**: découvrir le vivant et comprendre l'impact des projets,
- **collection personnelle**: débloquer des espèces et approfondir leur contenu.

Le BioDex n'est donc pas seulement un catalogue, ni seulement une collection.  
Il doit tenir les deux promesses en même temps.

## 4. Vision Produit Unifiée

### 4.1 Boucle principale recommandée

1. Découverte d'un projet ou d'un thème biodiversité.
2. Investissement dans un projet.
3. Gain de points et progression de mission.
4. Déblocage d'une espèce ou progression du BioDex.
5. Retour sur le dashboard pour suivre l'impact et les missions.
6. Interaction communautaire autour du projet ou de la cause.
7. Dépense des points en produits ou réinvestissement.
8. Progression dans les leaderboards et les badges.

### 4.2 Hiérarchie de valeur

L'application doit toujours communiquer la hiérarchie suivante:

1. **Impact réel vérifié**
2. **Progression personnelle**
3. **Reconnaissance sociale**
4. **Récompenses / collection**

Cette hiérarchie permet de préserver la mission du produit: l'impact d'abord, la gamification ensuite.

## 5. Objets Métier Recommandés

### 5.1 `ProfileImpact`

Représente la progression globale de l'utilisateur:
- points,
- niveau,
- projets soutenus,
- score d'impact,
- scores secondaires,
- badges.

### 5.2 `Project`

Un projet doit être l'unité centrale d'impact.  
Il doit être lié à:
- un producteur,
- un écosystème,
- une espèce principale,
- éventuellement plusieurs espèces secondaires,
- des missions projet,
- des updates.

### 5.3 `Species`

Une espèce représente une entité du vivant visible dans le BioDex:
- fiche publique,
- statut de conservation,
- contenu par niveaux,
- rareté éventuelle,
- appartenance à un écosystème,
- liens avec projets.

### 5.4 `UserBioDexEntry`

Entrée personnelle de collection BioDex:
- espèce débloquée,
- niveau atteint,
- XP / progression,
- source de déverrouillage,
- date,
- badges liés si besoin.

### 5.5 `Challenge`

Le challenge est un conteneur transverse:
- scope,
- conditions,
- durée,
- source,
- récompenses,
- progression utilisateur.

### 5.6 `Quest`

La quest est une mission plus contextualisée et souvent plus scénarisée:
- liée à un projet, une cause, une saison ou une série d'étapes,
- récompense plus forte,
- plus narrative qu'un challenge générique.

### 5.7 `Reward`

Une récompense peut être:
- des points,
- un badge,
- un item,
- de l'XP BioDex,
- un titre,
- un accès à un contenu enrichi.

### 5.8 `Guild`

Groupe social / communautaire:
- membres,
- défis collectifs,
- progression commune,
- classement communautaire.

### 5.9 `LeaderboardProfile`

Projection publique optimisée pour le classement:
- score d'impact,
- score communauté,
- score BioDex,
- score global,
- rangs par vue.

## 6. Missions: Où Les Mettre dans l'Expérience

### 6.1 Hub central

La page `/challenges` doit devenir un **hub global** avec:
- missions personnelles,
- missions projet,
- missions communauté,
- campagnes saisonnières.

### 6.2 Dashboard

Le dashboard doit afficher:
- les missions actives,
- la progression de niveau,
- les espèces débloquées récemment,
- les récompenses à réclamer.

### 6.3 Projets

Chaque page projet doit afficher:
- les missions liées à ce projet,
- les espèces associées,
- les gains potentiels pour le BioDex.

### 6.4 Communauté

La communauté doit afficher:
- les défis collectifs,
- les défis de guildes,
- les campagnes sociales,
- le classement communauté.

## 7. BioDex: Vision Produit Recommandée

### 7.1 Partie publique

Accessible à tous:
- consultation des espèces,
- rôle écologique,
- statut de conservation,
- projets liés,
- pédagogie biodiversité.

### 7.2 Partie personnelle

Accessible depuis le profil / dashboard:
- espèces débloquées,
- progression par espèce,
- niveaux de connaissance,
- collections thématiques,
- raretés et complétions.

### 7.3 Principe central

Le BioDex personnel doit refléter **la profondeur de la relation de l'utilisateur au vivant**.

Cela implique:
- l'investissement débloque,
- la fidélité approfondit,
- la mission structure,
- la communauté accélère légèrement,
- l'achat produit enrichit éventuellement l'expérience mais ne remplace pas l'impact.

## 8. Leaderboards: Positionnement Recommandé

### 8.1 Vues à exposer

L'application doit proposer au moins:
- `Impact` — classement principal,
- `Communauté` — classement social,
- `BioDex` — classement collection / connaissance.

Un `Global` peut être ajouté ensuite comme vue synthèse.

### 8.2 Rôle de chaque vue

| Vue | Ce qu'elle mesure | Importance produit |
|---|---|---|
| `Impact` | Contribution réelle et vérifiée | Principale |
| `Communauté` | Contribution sociale utile | Secondaire |
| `BioDex` | Progression de collection / connaissance | Secondaire |
| `Global` | Agrégat lisible des trois | Optionnel phase 2 |

### 8.3 Règle produit

Le classement par défaut doit être `Impact`.  
La communauté doit compter, mais comme bonus secondaire.  
Les achats ne doivent pas gonfler artificiellement le rang principal.

## 9. Décisions Produit Recommandées

### 9.1 Décisions à figer

- `Missions` = système transverse, pas sous-feature communauté.
- `Investissement` = source principale d'impact et de déverrouillage.
- `Communauté` = bonus secondaire, utile à la rétention.
- `Produits` = prolongement de valeur, pas raccourci vers l'impact.
- `BioDex` = encyclopédie publique + collection personnelle.
- `Leaderboard principal` = impact réel.

### 9.2 Position recommandée sur les produits

Par défaut:
- un produit **ne débloque pas une espèce complète**,
- un produit peut débloquer un bonus de contenu, un item, une carte, une galerie, un badge ou un lore additionnel.

### 9.3 Position recommandée sur les espèces liées aux projets

Le meilleur compromis produit est:
- **1 espèce principale obligatoire** par projet,
- **0 à 3 espèces secondaires optionnelles**.

Cela évite:
- un modèle trop pauvre avec une seule espèce partout,
- un modèle trop flou avec une explosion d'espèces sans hiérarchie.

## 10. MVP Recommandé

### MVP

- missions personnelles,
- missions liées aux projets,
- BioDex avec déverrouillage à l'investissement,
- leaderboard principal `Impact`,
- leaderboard `Communauté` secondaire,
- produits sans effet majeur sur le score principal.

### Phase 2

- espèces secondaires par projet,
- guildes et défis collectifs,
- leaderboard `BioDex`,
- vue `Global`,
- contenus BioDex plus riches et saisonniers.

## 11. Résumé Exécutif

Le bon modèle pour Make the Change est:
- **Investissement** pour créer l'impact,
- **Missions** pour guider les comportements,
- **Communauté** pour rendre l'impact visible,
- **BioDex** pour matérialiser la relation au vivant,
- **Leaderboards** pour donner du statut de manière lisible.

Autrement dit:

> L'investissement crée la valeur.  
> Les missions orchestrent la progression.  
> La communauté amplifie.  
> Le BioDex mémorise.  
> Le leaderboard compare.
