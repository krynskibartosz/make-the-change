# Règles Métier & Modèle de Données — Impact, Missions, BioDex & Leaderboards

**Statut**: Proposition de baseline 2026  
**Objectif**: transformer la vision produit en règles implémentables et cohérentes avec le schéma existant.

## 1. Principes de Conception

### 1.1 Règle de priorité

L'application doit préserver la hiérarchie suivante:

1. **Impact réel vérifié**
2. **Progression personnelle**
3. **Engagement communautaire**
4. **Récompenses de collection / boutique**

### 1.2 Règle de lisibilité

Un même événement peut produire plusieurs effets, mais ces effets doivent rester compréhensibles:
- points,
- progression de mission,
- progression BioDex,
- score leaderboard,
- badge / item.

## 2. Typologie des Missions

Chaque mission doit porter un `scope` clair.

| `scope` | Usage | Exemple |
|---|---|---|
| `personal` | progression individuelle | revenir 7 jours |
| `project` | action liée à un projet | soutenir 2 fois une ruche |
| `community` | action sociale | commenter 3 updates utiles |
| `seasonal` | campagne temporaire | mois des pollinisateurs |

Chaque mission doit aussi porter un `trigger_type`.

| `trigger_type` | Déclencheur principal |
|---|---|
| `investment` | investissement confirmé |
| `purchase` | achat confirmé |
| `social` | action communautaire |
| `streak` | présence régulière |
| `referral` | parrainage |
| `content` | lecture / consultation / suivi |

## 3. Effets Métier par Type d'Événement

| Événement | Points wallet | Mission | BioDex | Leaderboard |
|---|---:|---|---|---|
| Investissement confirmé | Oui | Oui | Oui | Impact |
| Abonnement confirmé | Oui | Oui | Non par défaut | Impact |
| Achat produit | Non par défaut | Oui, si mission spécifique | Bonus contenu seulement | Pas d'effet principal |
| Lecture d'update projet | Non ou très faible | Oui | Oui, faible | Non |
| Commentaire utile | Faible, capé | Oui | Oui, très faible | Communauté |
| Partage / repost | Faible, capé | Oui | Non | Communauté |
| Défi de guilde complété | Oui, modéré | Oui | Bonus faible | Communauté |
| Réclamation de récompense | Non | Clôture | Oui si récompense BioDex | Non |

## 4. Règles Exactes — Points Wallet

### 4.1 Investissement

Le wallet points reste aligné avec l'existant:
- `1 EUR investi = 1 point de base`
- bonus selon type d'investissement ou abonnement
- la source de vérité long terme doit être le ledger

### 4.2 Abonnement

L'abonnement peut continuer à générer des points selon le plan.

### 4.3 Communauté

Les actions communauté peuvent générer des points, mais elles doivent rester **capées**.

Règle recommandée:
- commentaire utile: `+5 pts`, max `25 pts / jour`
- post original pertinent: `+10 pts`, max `20 pts / jour`
- partage de projet avec contexte: `+10 pts`, max `20 pts / jour`
- défi collectif accompli: `+30 à +50 pts`

### 4.4 Produits

Règle recommandée MVP:
- un achat produit **ne génère pas de points wallet**
- un achat produit peut uniquement faire progresser une mission spécifique ou débloquer un bonus de collection non principal

### 4.5 Points non liés au revenu

Tous les points générés par missions, communauté, parrainage ou campagnes doivent être traités comme des **points marketing provisionnés** et monitorés séparément.

## 5. Règles Exactes — Liens Projet / Espèces

## 5.1 Structure recommandée

Chaque projet doit posséder:
- `1 espèce principale` obligatoire
- `0..3 espèces secondaires` optionnelles

### 5.2 Modèle recommandé

MVP:
- conserver `projects.species_id` comme espèce principale

Phase 2:
- ajouter `investment.project_species`
- colonnes recommandées:
  - `project_id`
  - `species_id`
  - `role` = `primary | secondary`
  - `weight`

### 5.3 Règle métier

- l'espèce principale représente la promesse biologique la plus lisible du projet
- les espèces secondaires représentent l'écosystème élargi et permettent des parcours de collection plus riches

## 6. Règles Exactes — Déverrouillage BioDex

## 6.1 Séparation public / personnel

Le BioDex public reste visible sans déverrouillage.  
Le BioDex personnel dépend des actions utilisateur.

## 6.2 Déverrouillage initial

Règle recommandée:
- **premier investissement qualifiant** dans un projet -> déverrouille l'espèce principale du projet

Définition d'un investissement qualifiant:
- paiement confirmé,
- montant supérieur ou égal au ticket minimum du projet,
- statut d'investissement `approved` ou `active`

Effet technique recommandé:
- création ou upsert dans `user_unlocked_species`
- `current_level = 1`
- `progress_xp = 0`
- `source_investment_id = investissement d'origine`

## 6.3 Progression BioDex par espèce

Règle recommandée:
- investissement supplémentaire sur un projet avec la même espèce principale: `+60 XP`
- mission projet complétée liée à cette espèce: `+25 XP`
- lecture de 3 updates distinctes sur ce projet: `+10 XP`
- mission communautaire thématique: `+5 XP`, capée

### 6.4 Niveaux d'une espèce

Chaque espèce personnelle a un niveau de maîtrise.

Règle recommandée:
- `100 XP = +1 niveau`
- niveau minimum à l'unlock: `1`
- niveau max MVP: `10`

Correspondance avec `content_levels`:
- `beginner` disponible dès le déverrouillage
- `intermediate` à partir du niveau `5`
- `advanced` à partir du niveau `10`

Cela s'aligne avec les paliers déjà présents dans `content_levels`.

## 6.5 Espèces secondaires

Règle recommandée MVP:
- les espèces secondaires ne sont **pas débloquées instantanément** au premier investissement

Elles se débloquent via l'un de ces chemins:
- accomplissement d'une mission projet dédiée,
- second investissement dans le même projet,
- campagne saisonnière ciblée,
- progression écosystème suffisante.

Ce choix évite de sur-récompenser un seul investissement avec trop de déblocages.

## 6.6 Produits et BioDex

Règle recommandée:
- un produit ne débloque pas une espèce complète
- un produit peut débloquer:
  - une carte de lore,
  - une image,
  - une anecdote,
  - un item de collection,
  - un badge thématique

Exception possible phase 2:
- produits éducatifs marqués `biodex_bonus_content = true`

## 7. Règles Exactes — Missions & Récompenses

## 7.1 Récompenses autorisées

Une mission peut récompenser:
- `reward_points`
- `reward_badge`
- `reward_items`
- `reward_biodex_xp`
- `reward_title`

## 7.2 Barèmes recommandés

| Type de mission | Récompense points | Récompense secondaire |
|---|---:|---|
| `personal` | `50 - 150` | badge léger |
| `project` | `100 - 300` | XP BioDex / badge |
| `community` | `20 - 80` | titre / badge / bonus léger |
| `seasonal` | `100 - 500` | badge rare / item |

## 7.3 Règle de cohérence

Une mission `community` ne doit pas rapporter autant qu'une mission `project` liée à un investissement réel, sauf campagne exceptionnelle explicitement assumée.

## 7.4 Cap communautaire

Règle recommandée:
- la somme des gains purement communautaires ne doit pas dépasser `15%` de la progression hebdomadaire moyenne d'un utilisateur engagé dans des projets

## 8. Règles Exactes — Leaderboards

## 8.1 Vues de classement

### `Impact`
Classement principal, visible par défaut.

### `Community`
Classement social, secondaire.

### `BioDex`
Classement collection / connaissance.

### `Global`
Vue synthèse optionnelle phase 2.

## 8.2 Score d'impact

### MVP

Le MVP doit rester cohérent avec la formule déjà utilisée dans l'application:

```txt
impact_score =
  points_wallet * 1
  + projects_supported_unique * 250
  + total_invested_eur * 0.5
```

### Phase 2

Ajout d'un composant d'impact vérifié:

```txt
impact_score_v2 =
  points_wallet
  + projects_supported_unique * 250
  + total_invested_eur * 0.5
  + biodiversity_impact_verified_normalized
```

Le champ `biodiversity_impact_verified_normalized` doit être calculé à partir de métriques projet normalisées et comparables.

## 8.3 Score communauté

Barème recommandé:
- post original pertinent: `+10`
- commentaire utile: `+5`
- repost / partage qualifié: `+10`
- mission communautaire accomplie: `+20 à +30`
- défi de guilde: `+30`
- parrainage converti en premier investissement: `+50`

Cap recommandé:
- `500 points communauté / semaine`

## 8.4 Score BioDex

Barème recommandé:
- espèce débloquée: `+100`
- niveau d'espèce gagné: `+40`
- espèce rare ou endémique débloquée: `+150`
- collection d'écosystème complétée: `+250`

## 8.5 Score global

Règle recommandée si vue `Global`:

```txt
global_score =
  impact_score * 0.75
  + community_score * 0.15
  + biodex_score * 0.10
```

Justification:
- l'impact reste dominant,
- la communauté compte réellement,
- le BioDex valorise la profondeur sans écraser le coeur du produit.

## 8.6 Effet des produits sur le leaderboard

Règle recommandée MVP:
- un achat produit n'augmente **pas** le `Impact Score`
- il peut compter pour une mission spécifique ou un badge commerce

Règle phase 2 optionnelle:
- certains produits `impact-eligible` peuvent ajouter un bonus très faible, inférieur à l'équivalent investissement

## 9. Règles Anti-Abus

### 9.1 Communauté

- cap journalier sur posts, commentaires, partages
- prise en compte uniquement des interactions non supprimées / non modérées
- possibilité de marquer certaines actions comme `quality_verified`

### 9.2 Missions

- toute mission doit avoir un `idempotency_key` ou une logique d'idempotence côté attribution
- toute récompense doit être retraçable

### 9.3 Leaderboards

- les classements publics doivent être calculés sur des vues publiques ou matérialisées
- rafraîchissement planifié
- exclusion des comptes modérés, suspendus ou privés selon la politique produit

## 10. Modèle de Données Recommandé

## 10.1 Extensions de `gamification.challenges`

Colonnes recommandées:
- `scope`
- `trigger_type`
- `source_type`
- `source_id`
- `reward_biodex_xp`
- `reward_community_score`
- `reward_impact_score_bonus`
- `priority`

## 10.2 Nouvelle table `investment.project_species`

Colonnes recommandées:
- `project_id`
- `species_id`
- `role`
- `weight`
- `created_at`

## 10.3 Stabiliser `investment.user_unlocked_species`

Table déjà présente dans la base générée, à typer et utiliser comme source de vérité pour la collection personnelle.

Colonnes connues:
- `user_id`
- `species_id`
- `current_level`
- `progress_xp`
- `source_investment_id`
- `unlocked_at`

## 10.4 Vues de classement

Enrichir ou recalculer des vues de type:
- `public_user_rankings`
- `public_user_profiles`

Champs recommandés:
- `impact_score`
- `community_score`
- `biodex_score`
- `global_score`
- `rank_impact`
- `rank_community`
- `rank_biodex`
- `rank_global`

## 11. Résumé de Mise en Oeuvre

### Baseline à implémenter en premier

1. missions avec `scope`
2. déverrouillage BioDex à l'investissement
3. espèces principales par projet
4. points communauté capés
5. leaderboard `Impact` par défaut
6. leaderboards secondaires `Community` puis `BioDex`

### Décisions déjà recommandées

- `Investissement` = source principale de score et de déverrouillage
- `Communauté` = bonus secondaire
- `Produits` = bonus d'expérience, pas raccourci vers l'impact
- `BioDex` = public + personnel
- `Global` = agrégat lisible, pas point d'entrée principal
