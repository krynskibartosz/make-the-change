# Chapter Context Documentation

## Overview
Chapters are the main organizational units within the Academy. Each chapter represents a major topic or theme in the learning curriculum.

## Dynamic Route Structure
- Route: `/academy/[chapter]`
- Parameter: `chapter` (slug) - unique identifier for the chapter
- Example: `/academy/ecosystems-basics`, `/academy/biodiversity`

## Chapter Data Structure (JSON Schema)
```json
{
  "id": "chapitre_1",
  "slug": "ecosystemes-basics",
  "titre": "Les Fondations de la Vie",
  "description": "Découvrez les éléments essentiels qui permettent à la vie de prospérer sur Terre.",
  "ordre": 1,
  "duree_estimee": 45,
  "difficulte": "debutant",
  "prerequis": [],
  "unites": [
    // Array of Unit objects (see [unit]/doc/context.md)
  ],
  "vignette": "image_prompt: Une forêt luxuriante avec des rayons de soleil filtrant à travers les feuilles",
  "est_verrouille": false,
  "taux_completion": 0
}
```

## UI Components Needed
- Chapter header with title and description
- Progress indicator
- Unit list/grid
- Navigation to previous/next chapters
- Lock/unlock status indicators
- Difficulty badges

## Learning Flow
1. User lands on chapter page
2. Sees chapter overview and progress
3. Can access unlocked units
4. Completes units in sequence
5. Chapter unlocks upon completion of all units

## Design Considerations
- Consistent with ecosystem page aesthetics
- Dark theme (#05050A background)
- No bottom navigation bar
- Immersive, focused learning environment
- Mobile-first responsive design

## Content Categories (Examples)
- Ecosystem Fundamentals
- Biodiversity & Conservation
- Climate Change
- Sustainable Practices
- Environmental Policy
