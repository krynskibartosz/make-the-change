# Academy Exercise UI Documentation

## Overview
Premium interactive exercise interface. No page reloads, smooth transitions, game-like experience. 100% dedicated to learning with no global navigation.

---

## 🎮 L'INTERFACE GLOBALE (Visible sur tous les écrans)
*Interface de l'application disparaît (plus de menu en bas). L'écran est dédié à 100% à l'apprentissage.*

### Header (En haut)
**À gauche:** Croix `X` grise pour quitter
- Action: Pop-up d'avertissement *"Tu vas perdre ta progression !"* au clic

**Au centre:** Barre de Progression
- Magnifique ligne lumineuse découpée en 4 segments (1 par exercice)
- Se remplit d'un vert éclatant (ou ocre/bleu selon la faction)
- Effet de brillance à chaque victoire

**À droite:** Petit cœur ou jauge de vie (optionnel, selon difficulté)

---

## 📖 ÉTAPE 1: EXERCICE STORY (L'Immersion)
**Objectif:** Poser le contexte sans effort. Format "Story Instagram".

### Le Visuel (Haut de l'écran, 60% de l'espace)
- Image générée (ex: *L'île de Madagascar flottant sur l'océan*)
- Effet "Ken Burns": Zoom avant très, très lent pour donner de la vie

### Le Contenu (Bas de l'écran, 40% de l'espace)
- **Fond:** Dégradé sombre (Noir vers transparent) qui remonte sur l'image
- **Texte:** *"Une île isolée devient le laboratoire secret de la nature."* (Grosse typographie, très lisible)

### L'Interaction
- Barre de progression type Instagram en haut (2 petits tirets)
- L'utilisateur tape sur le côté droit de l'écran ➔ Passe à l'Écran 2
- S'il tape encore ➔ Transition fluide vers l'exercice Swipe

---

## ↔️ ÉTAPE 2: EXERCICE SWIPE (L'Action rapide)
**Objectif:** Test binaire intuitif.

### En Haut
- Question en gras: *"Ce comportement décrit-il une espèce dite 'endémique' ?"*

### Au Centre (La pile de cartes)
- Grande carte centrale en style Glassmorphism
- Texte dessus: *"Vivre uniquement à Madagascar"*
- **Astuce UX:** Derrière cette carte, on voit le bord de la carte suivante

### L'Interaction (Physique)
- L'utilisateur pose son doigt et glisse vers la droite
- Pendant qu'il glisse:
  - Fond de l'écran se teinte légèrement en Vert (pour "Vrai")
  - S'il glisse à gauche, ça se teinte en Rouge/Gris (pour "Faux")

### Le Feedback (Page Full Screen de validation)
- Il lâche la carte à droite ➔ **Navigation vers nouvelle page**
- **Page Vert fluo !** Fond plein écran vert
- La mascotte (Sylva) sourit au centre
- **Texte:** *"Exact ! Isolée de tout, l'espèce a évolué de façon unique et irremplaçable."*
- Gros bouton "Continuer" en bas de l'écran
- Au clic, on passe à l'exercice 3

---

## 🧩 ÉTAPE 3: DRAG & DROP (La Logique)
**Objectif:** Reconstruire une chronologie.

### En Haut
- Consigne: *"Retrace l'histoire fascinante de l'arrivée des lémuriens sur l'île."*

### Au Centre (Les Zones de Dépôt)
- 3 "Slots" (cases vides) verticaux
- Flèches descendantes entre eux: `[ 1 ] ⬇️ [ 2 ] ⬇️ [ 3 ]`

### En Bas (Les Tuiles à glisser)
- 3 belles tuiles (boutons arrondis) mélangées aléatoirement:
  - *Arrivée sur l'île*
  - *Évolution en espèces uniques*
  - *Dérive sur radeaux*

### L'Interaction (Haptique)
- Quand l'utilisateur maintient son doigt sur une tuile:
  - La tuile grossit légèrement
  - Se soulève (ombre portée forte)
  - Le téléphone fait une vibration courte (`tic`)
- Il la glisse dans le Slot correspondant

### Validation
- Quand les 3 tuiles sont posées, un gros bouton "Vérifier" apparaît
- **Si bon:** Navigation vers page full screen Vert de victoire
- **Si faux:** Navigation vers page full screen Rouge avec explication et la tuile fausse tremble

---

## 🎯 ÉTAPE 4: QUIZ FINAL (Le Boss)
**Objectif:** Valider l'acquis final.

### En Haut
- Question: *"Quel arbre géant au tronc massif est l'emblème de Madagascar ?"*

### Au Centre
- 3 gros boutons empilés verticalement
- Pas des petits QCM, de VRAIS gros boutons larges pour les gros doigts
  - `Le chêne centenaire`
  - `Le pin parasol`
  - `Le baobab`

### Interaction
- L'utilisateur tape sur `Le baobab`

### Feedback
- Le bouton s'illumine en vert
- Les autres se grisent
- **Navigation vers page full screen:**
  - Fond vert avec mascotte
  - Texte: *"Bravo ! Son tronc en forme de bouteille stocke l'eau pour survivre aux longues sécheresses."*
- Le bouton ne dit plus "Continuer", mais **"TERMINER L'UNITÉ"**

---

## 🏆 L'ÉCRAN DE VICTOIRE (L'Explosion de Dopamine)
**Transition de retour vers l'arbre d'apprentissage.**

### Animation
- L'écran devient très sombre
- Animation 3D spectaculaire au centre:
  - Une graine est plantée
  - Elle pousse en une seconde pour devenir un petit Baobab stylisé

### Textes (en fondu)
- **"UNITÉ COMPLÉTÉE !"**
- **"Précision : 100%"**

### Récompense
- La récompense tombe du haut de l'écran avec un son joyeux
- **"+40 Graines 🌱"** (qui s'ajoutent à son solde global)

### Bouton final
- *"Retour à l'Académie"*

---

## Technical Implementation Notes

### Global Principles
- **No page reloads:** Tout se passe en SPA (Single Page Application)
- **Smooth transitions:** Transitions fluides entre exercices
- **Game-like experience:** Feedback visuel, sonore, haptique
- **Mobile-first:** Gros boutons pour les doigts

### Full Screen Feedback Pattern
- Utilisé pour tous les feedbacks (victoire/échec)
- Navigation vers nouvelle page full screen
- Contient: mascotte + texte + bouton d'action
- Couleur: Vert (victoire) ou Rouge (échec)
- Pattern similaire aux pages de détails de projets

### Progress Bar
- Découpée en segments (1 par exercice)
- Couleur de la faction
- Animation de remplissage à chaque victoire

### Haptic Feedback
- Vibration courte (`tic`) quand on maintient une tuile
- Vibration plus forte à la victoire

### Color System
- Background: `#05050A` (noir pur)
- Progress: Vert éclatant / couleur faction
- Victory: Vert fluo
- Error: Rouge/Gris
- Glassmorphism: Translucide avec backdrop-blur

### Navigation
- Header `X` ➔ Pop-up confirmation ➔ Quitte l'unité
- Story ➔ Swipe ➔ Drag & Drop ➔ Quiz ➔ Victory ➔ Retour Academy
