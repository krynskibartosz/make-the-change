# Audit UX/UI Web-Client (Neuro-Persuasion + Lois UX + Couleur)

## 1. NOTE GLOBALE
**7.2 / 10** (bon socle visuel, mais plusieurs points de friction UX et persuasion faibles sur mobile).

## 2. TABLEAU D’AUDIT CRITIQUE

| Élément analysé | Problème détecté | Violation théorique (Source) | Solution expert |
|---|---|---|---|
| Navigation globale (mobile) | Double repère cognitif: top header + bottom nav peut créer une hésitation sur l’action principale | Loi de Jakob (UX Laws) | Simplifier la top bar sur mobile (titre + action contextuelle seulement), et réserver la navigation principale au bottom nav |
| Menu/filtrage (Projects/Products) | Trop de choix visibles simultanément (chips multiples + search + tabs), charge cognitive élevée | Loi de Hick + Loi de Miller (UX Laws) | Grouper filtres secondaires en bottom sheet; conserver 1–2 filtres majeurs visibles |
| Hero (Home/About/How-it-works) | Les textes d’intro restent présents sur desktop alors que l’action principale est tardive | Loi de Fitts + Cerveau Ancien (Neuro) | Réduire l’intro, placer CTA visible au 1er écran, ajouter preuve sociale près du CTA |
| Leaderboard | Peu de signaux de progression personnelle (hors “Votre rang”), manque d’indices de mouvement | Engagement & Cohérence (Neuro) | Ajouter micro-feedback sur la progression (↑/↓ + delta), et un mini-objectif de montée de rang |
| Dashboard | Densité d’informations élevée, trop d’items au-dessus de la ligne de flottaison | Loi de Miller (UX Laws) | Prioriser 2–3 cartes clés, regrouper le reste en sections accordéon |
| Pages Auth | Formulaires longs sur mobile (register), risque d’abandon | Engagement & Cohérence (Neuro) | Le wizard est bon; améliorer encore avec micro‑validation par étape et progress indicator visuel plus clair |
| Pages Produit/Projet | Peu de déclencheurs émotionnels en début de page (bénéfice humain, impact direct) | Cerveau Ancien (Neuro) | Ajouter micro-bénéfice visuel (impact direct, “avant/après”, visages) dans le hero |
| CTA principaux | Certains CTA sont visuellement “froids” ou noyés dans une palette proche du fond | Température (Couleur) + Fitts (UX) | Utiliser accent chaud (10%) pour CTA principal et augmenter contraste/poids |
| Preuve sociale | Peu d’éléments de preuve sociale proches des points de friction (ex: CTA “Investir”) | Validation Sociale (Neuro) | Ajouter “X investisseurs aujourd’hui”, “X projets financés” à proximité immédiate des CTA |
| Scarcity / Urgence | Absence d’urgence crédible (ex: campagnes limitées, stock réel) | Rareté / Urgence (Neuro) | Si vrai, afficher quota/temps restant; sinon ne pas simuler |
| Cohérence visuelle | Multiplicité de styles de cards (glass, flat, gradients) | Effet Esthétique-Usabilité (UX) | Réduire à 2 styles de surfaces max: “surface principale” + “surface premium” |
| Couleurs | Ratio 60-30-10 pas toujours respecté (trop de gradients / accents concurrents) | Règle 60-30-10 (Couleur) | Clarifier dominante neutre, secondaire marque, accent unique pour CTA |
| Contraste texte | Certaines zones de texte sur visuels (hero / images) risquent de faible lisibilité | Valeur & Contraste (Couleur) | Ajouter overlay uniforme ou fond semi-opaque; vérifier contraste minimal |
| Segmentation visuelle | Des sections longues sans rupture nette visuelle (home, about) | Loi de Région Commune (UX) | Ajouter conteneurs nets ou alternance de fond pour “chunking” |
| Micro-interactions | Feedback parfois discret (pas de micro‑validations sur actions clés) | Seuil de Doherty (UX) | Ajouter feedback immédiat (loading micro, skeleton, confirmations courtes) |

## 3. SYNTHÈSE STRATÉGIQUE
**Force majeure** : l’interface a un langage visuel premium (glass, gradients) et des composants cohérents qui installent une perception de qualité (Effet Esthétique‑Usabilité). **Faiblesse bloquante** : la persuasion est trop faible au niveau des points d’action (peu de preuve sociale, pas d’urgence crédible, CTA parfois peu dominants). Pour le business, cela réduit la conversion car le “cerveau ancien” n’est pas suffisamment stimulé au moment de décider.

