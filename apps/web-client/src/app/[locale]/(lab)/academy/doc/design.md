# Academy Design Document

## Overview
Premium Dark Spatial Design for the Academy learning path. No lines (SVG), using margins for the "No-Line" tree concept. Glassmorphism header with player cockpit.

---

## 📱 ZONE 1: HEADER FIXE (Le Tableau de Bord)
**Glassmorphism prononcé** - Flotte en haut, laisse passer le contenu flouté quand on scroll.

### Layout: Dynamic Island (pilule noire translucide collée en haut)

**À Gauche (Les Défis / Missions)**
- Icône: "Parchemin" ou "Cible" 🎯
- Notification: Point rouge/vert fluo pulse si défis restants
- Action: Navigation vers page "Défis" existante (Quête de Melli, 20 jours de présence)

**Au Centre (La Flamme - Streak)**
- Icône: Petite flamme
- Texte: `🔥 12 j`
- État actif: Orange vif avec effet de lumière
- État perdu: Gris mat `🔥 0`

**À Droite (L'Économie)**
- Icône: Graine verte
- Texte: `🌱 2 450`
- Couleur: Vert ou couleur de la faction

---

## 🗺️ ZONE 2: PARCOURS D'EXPLORATION (L'Arbre "No-Line")
Scroll vertical libre. Pas de lignes SVG, uniquement des marges pour créer le chemin visuel.

### A. Les Bannières de Chapitre (Séparateurs)
- **Design:** Grand bloc aux bords arrondis, pleine largeur
- **Fond:** Image très sombre et élégante liée au thème (ex: forêt amazonienne plongée dans la nuit)
- **Texte:**
  - En majuscules brillantes: `CHAPITRE 1`
  - Plus grand, gras blanc pur: `L'ALPHABET ORIGINEL`
- **Indicateur:** En haut à droite: `0 / 3 👑` (Unités complétées)

### B. Les Nœuds (Le Chemin en Zigzag)
- **Espacement:** Gap généreux entre les unités
- **Alignement:**
  - Unité 1: Centrée
  - Unité 2: Décalée vers la gauche (marge droite)
  - Unité 3: Décalée vers la droite (marge gauche)
- **Effet:** Crée la sensation visuelle d'un chemin sans utiliser de lignes

### C. Le Design des Unités (3 États)

#### 1. Unité Verrouillée (Le Futur)
- **Cercle:** Noir mat (`bg-white/5`)
- **Bordure:** Invisible ou très fine
- **Icône:** Ombre de l'icône de leçon, très sombre
- **Effet:** Mystérieux, n'attire pas l'œil

#### 2. Unité Complétée (Le Passé)
- **Cercle:** Plein, couleur désaturée (gris/vert très chic)
- **Icône:** Visible mais sans éclat
- **Indicateur:** Petite coche ✅ flotte en bas à droite

#### 3. Unité Active (Le Présent - La Star ✨)
- **Héritage:** Brilliant.org style
- **Animation:** Le cercle pulse doucement
- **Couleur:** Intense et liée à la Faction (ex: Vert Émeraude pour Sylva)
- **Glow:** Ombre portée énorme mais diffuse de la même couleur (effet "Néon")
- **Mascotte:** Flotte juste au-dessus du cercle actif
  - Doigt pointé dessus
  - Bulle animée: `C'est parti !` ou `C'est ici !`

---

## 🚀 ZONE 3: PAGE "SAS DE PRÉPARATION" (Full-Screen)
**Navigation:** Quand le joueur clique sur l'Unité Active, il QUITTE la page de l'arbre et navigue vers cette nouvelle page.

### Concept
Salle d'attente avant l'effort. Page magnifique, très épurée. Crée l'attente et l'excitation.

### Hero Image (En haut)
- Image immersive ou illustration 3D liée au thème
- Prend le tiers supérieur de l'écran
- Exemple: Belle goutte d'eau sur une feuille pour Unité 1.1
- Bouton "Retour" (`<`) en haut à gauche

### Le Corps (Au centre)
- **Sur-titre:** `CHAPITRE 1 - UNITÉ 1`
- **Grand Titre:** `Les Forges de la Vie`
- **Description:** "Soleil, eau, sols... Découvre comment ces 3 éléments se mélangent pour créer l'énergie de notre planète."
- **Détails:** `⏱️ 2 min` • `🧠 4 exercices`

### Le Bouton d'Action (En bas)
- **Carte de récompense:** Flotte juste au-dessus du bouton
  - Texte: `🎁 Récompense à la clé : +10 💧`
  - Effet: Brille
- **Bouton:** MAJUSCULE géant, couleur Faction, occupe le bas de l'écran
  - Texte: **`DÉMARRER L'EXPLORATION`**

---

## Design Principles

### Pourquoi le "No-Line" Tree?
1. **Léger:** Pas de courbes SVG qui se cassent selon la taille d'écran
2. **Satisfaisant (Dopamine):** Contraste entre fond noir pur, unités verrouillées sombres, et Halo Néon de l'unité active guide instinctivement le pouce
3. **Narratif:** Grandes bannières avec images sombres donnent de la noblesse au propos

### Glassmorphism Header
- Crée une profondeur immense
- Laisse passer le contenu flouté quand on scroll
- Donne l'impression d'une interface native premium

### Full-Screen SAS Page
- Plus robuste techniquement que les pop-ups/bottom-sheets
- Immersion totale
- Crée l'anticipation avant le lancement des exercices

---

## Technical Implementation Notes

### Responsive Design
- Mobile-first approach
- Marges flexibles pour le zigzag (pas de positions absolues)
- Unités utilisent `margin-left` et `margin-right` alternés

### Color System
- Background: `#05050A` (noir pur, comme ecosystem simulator)
- Active unit: Couleur de la Faction (ex: Vert Émeraude)
- Completed unit: Couleur désaturée
- Locked unit: `bg-white/5`

### Animations
- Active unit: Pulse doux
- Mascotte: Animation flottante
- Header: Glassmorphism avec backdrop-blur

### Navigation
- Header Défis → Page Défis existante
- Unité Active → Page SAS de Préparation (nouvelle route)
- SAS → Lancement des exercices
