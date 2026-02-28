# User Stories — Missions, BioDex & Leaderboards

**Statut**: Base de travail 2026  
**Objectif**: fournir 10 user stories cohérentes avec le modèle produit recommandé.

## US-01 — Déverrouiller une espèce via un premier investissement

**En tant que** nouvel investisseur  
**Je veux** débloquer l'espèce principale liée au projet que je soutiens  
**Afin de** voir immédiatement la biodiversité concrète associée à mon action

### Critères d'acceptation
- quand un investissement est confirmé sur un projet avec une espèce principale, une entrée personnelle BioDex est créée
- l'espèce apparaît dans `Mon BioDex`
- le niveau initial affiché est `1`
- un feedback visuel confirme le déverrouillage

## US-02 — Voir les missions liées à un projet

**En tant que** visiteur d'une page projet  
**Je veux** voir les missions directement liées à ce projet  
**Afin de** comprendre quelles actions me permettent d'aller plus loin

### Critères d'acceptation
- la page projet affiche un bloc de missions projet
- chaque mission affiche sa récompense et sa progression
- une mission projet peut faire référence à l'espèce principale ou à une cause du projet
- les CTA renvoient vers l'action attendue

## US-03 — Compléter une mission projet pour faire progresser le BioDex

**En tant que** membre ayant déjà investi  
**Je veux** gagner de l'XP BioDex en accomplissant une mission projet  
**Afin de** débloquer des niveaux de connaissance plus profonds

### Critères d'acceptation
- la mission projet peut attribuer de l'XP BioDex à une espèce déjà débloquée
- la progression de niveau est mise à jour après validation
- le contenu `intermediate` devient visible au niveau requis
- la récompense est traçable

## US-04 — Participer à la communauté sans écraser l'impact réel

**En tant que** membre actif dans la communauté  
**Je veux** être récompensé pour mes contributions utiles  
**Afin de** sentir que ma participation compte

### Critères d'acceptation
- les actions sociales utiles font progresser des missions communauté
- elles augmentent le score communauté
- elles peuvent donner un bonus limité de points
- elles n'augmentent pas massivement le rang d'impact principal

## US-05 — Comprendre la différence entre BioDex public et BioDex personnel

**En tant que** utilisateur  
**Je veux** distinguer ce qui est consultable publiquement de ce que j'ai personnellement débloqué  
**Afin de** comprendre ma progression sans perdre la valeur pédagogique du catalogue

### Critères d'acceptation
- le BioDex public reste exploratoire
- `Mon BioDex` affiche uniquement les espèces débloquées
- une espèce non débloquée peut exister publiquement sans apparaître comme acquise personnellement
- l'UI rend cette différence explicite

## US-06 — Voir plusieurs leaderboards lisibles

**En tant que** membre engagé  
**Je veux** comparer mon rang en impact, en communauté et en BioDex  
**Afin de** comprendre où je progresse réellement

### Critères d'acceptation
- la page leaderboard propose au moins les onglets `Impact` et `Communauté`
- un onglet `BioDex` peut être ajouté dans la même logique
- l'onglet `Impact` est la vue par défaut
- chaque vue explique brièvement ce qu'elle mesure

## US-07 — Effectuer un achat produit sans casser la logique du classement

**En tant que** utilisateur qui dépense ses points  
**Je veux** acheter un produit durable  
**Afin de** profiter de mes récompenses sans biaiser le classement d'impact

### Critères d'acceptation
- l'achat produit peut satisfaire une mission spécifique si elle existe
- l'achat produit n'augmente pas le leaderboard d'impact principal dans le MVP
- l'achat peut débloquer un bonus de collection ou un badge commerce
- le comportement est documenté et cohérent dans l'UI

## US-08 — Débloquer une espèce secondaire via un engagement approfondi

**En tant que** membre fidèle sur un projet  
**Je veux** débloquer une espèce secondaire de l'écosystème  
**Afin de** sentir que ma compréhension du vivant s'approfondit progressivement

### Critères d'acceptation
- une espèce secondaire n'est pas débloquée au premier investissement par défaut
- elle se débloque via une mission dédiée, un second engagement ou une campagne ciblée
- l'utilisateur comprend pourquoi cette espèce devient disponible
- l'espèce secondaire est identifiée comme liée à l'écosystème du projet

## US-09 — Participer à un défi collectif de guilde

**En tant que** membre d'une guilde  
**Je veux** contribuer à un objectif collectif  
**Afin de** vivre une progression sociale sans perdre le lien avec les projets réels

### Critères d'acceptation
- un défi collectif possède un objectif partagé et une barre de progression commune
- sa récompense augmente le score communauté et peut donner un badge de guilde
- il peut offrir un bonus modéré de points
- il n'écrase pas les utilisateurs qui investissent réellement sur le leaderboard principal

## US-10 — Comprendre comment chaque action influence ma progression

**En tant que** utilisateur  
**Je veux** voir clairement l'effet d'une action sur mes points, mes missions, mon BioDex et mon classement  
**Afin de** ne jamais percevoir la gamification comme opaque

### Critères d'acceptation
- après une action importante, l'application affiche les gains associés
- l'utilisateur peut savoir si l'action a affecté:
  - ses points,
  - une mission,
  - une espèce,
  - un leaderboard
- la hiérarchie de valeur reste compréhensible: impact d'abord, social ensuite

## Backlog de Priorisation Recommandé

### Priorité MVP

1. `US-01`
2. `US-02`
3. `US-03`
4. `US-06`
5. `US-10`

### Priorité Phase 2

6. `US-04`
7. `US-07`
8. `US-08`
9. `US-09`
10. enrichissements additionnels autour des collections
