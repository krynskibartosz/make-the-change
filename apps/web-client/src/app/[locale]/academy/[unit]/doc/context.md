# Unit Context Documentation

## Overview
Units are the smallest learning modules within chapters. Each unit contains specific educational content, activities, and assessments.

## Dynamic Route Structure
- Route: `/academy/[unit]`
- Parameter: `unit` (slug) - unique identifier for the unit
- Example: `/academy/introduction-to-ecosystems`, `/academy/species-interaction`

## Unit Data Structure (JSON Schema)
```json
{
  "id": "unite_1_1",
  "chapitre_id": "chapitre_1",
  "titre": "Les Forges de la Vie",
  "concept_cle": "Énergie, Minéraux, Hydratation",
  "mascotte": "Ondine",
  "recompense": {
    "type": "gouttes",
    "montant": 10
  },
  "exercices": [
    // Array of Exercise objects (4 types below)
  ]
}
```

## Exercise Types (4 Types)

### A. Type "STORY" (Écrans d'intro)
Uses an array of screens. Flexible number of taps based on screen count.

```json
{
  "id": "ex_1_1_story",
  "type": "STORY",
  "ecrans": [
    {
      "texte": "Soleil, eau, sol : les trois piliers de la vie.",
      "image_prompt": "Une jeune pousse lumineuse émergeant d'une terre humide sous un grand soleil"
    },
    {
      "texte": "Ensemble, ils forgent l'énergie de toute la nature.",
      "image_prompt": "La mascotte Ondine mélangeant joyeusement de l'eau, de la terre et des rayons solaires"
    }
  ]
}
```

### B. Type "SWIPE" (Tinder Vrai/Faux)
Separates right card (Vrai) and left card (Faux). Code knows which side to swipe to win.

```json
{
  "id": "ex_1_1_swipe",
  "type": "SWIPE",
  "question": "Est-ce un ingrédient indispensable à la création de la vie ?",
  "carte_droite": {
    "nom": "L'eau douce",
    "est_correct": true,
    "feedback_victoire": "Génial ! Sans eau, les cellules de la vie ne peuvent pas s'hydrater.",
    "image_prompt": "Une goutte d'eau pure et brillante"
  },
  "carte_gauche": {
    "nom": "Le goudron",
    "est_correct": false,
    "feedback_echec": "Oups ! Le goudron asphyxie nos sols et empêche l'eau de circuler.",
    "image_prompt": "Une route en asphalte noir"
  }
}
```

### C. Type "DRAG_DROP" (Mettre dans l'ordre)
Elements provided in correct order. React component shuffles them randomly on screen.

```json
{
  "id": "ex_1_1_drag",
  "type": "DRAG_DROP",
  "consigne": "Ordonne ces éléments du plus lointain au plus profond :",
  "ordre_correct": [
    { "id": "item1", "texte": "Le Soleil (Espace)" },
    { "id": "item2", "texte": "L'Eau (Surface)" },
    { "id": "item3", "texte": "Les Minéraux (Sous-sol)" }
  ]
}
```

### D. Type "QUIZ" (Question finale)
All options in array with `est_correct` boolean. Developer can shuffle for display.

```json
{
  "id": "ex_1_1_quiz",
  "type": "QUIZ",
  "question": "Quel élément fournit l'énergie de base à presque toute la Terre ?",
  "options": [
    { "texte": "Le vent fougueux", "est_correct": false },
    { "texte": "La roche magmatique", "est_correct": false },
    { "texte": "Le Soleil", "est_correct": true }
  ],
  "anecdote_victoire": "Bingo ! Les plantes capturent sa lumière pour nourrir toute la chaîne alimentaire."
}
```

## UI Components Needed
- Unit header with title and progress
- Content sections with scroll
- Interactive elements (buttons, sliders, etc.)
- Navigation (previous/next)
- Completion indicator
- XP reward display
- Chapter breadcrumb navigation

## Learning Flow
1. User enters unit from chapter page
2. Progresses through content sections
3. Completes activities and assessments
4. Marks unit as complete
5. Earns XP and unlocks next unit
6. Returns to chapter or proceeds to next unit

## Design Considerations
- Consistent with academy/chapter aesthetics
- Dark theme (#05050A background)
- No bottom navigation bar
- Focus on content consumption
- Smooth transitions between sections
- Mobile-optimized reading experience

## Interactive Elements (Future)
- Similar to ecosystem path visualization
- Species interaction simulators
- Climate model visualizations
- Gamified progress tracking
