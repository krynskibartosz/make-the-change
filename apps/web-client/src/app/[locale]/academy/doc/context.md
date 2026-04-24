# Academy Context Documentation

## Overview
The Academy section is designed to provide educational content and learning paths for users interested in environmental sustainability and ecosystem understanding.

## Structure
- `/academy` - Main landing page for the academy
- `/academy/[chapter]` - Dynamic routes for individual chapters (using slug)
- `/academy/[unit]` - Dynamic routes for individual units (using slug)

## Purpose
- Educational content delivery
- Learning progression tracking
- Interactive learning experiences
- Gamification elements similar to the ecosystem simulator

## Design Requirements
- **No BottomBar**: Like the ecosystem page, the academy should not display the mobile bottom navigation
- **Immersive Experience**: Full-screen learning environment
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark Theme**: Consistent with the ecosystem simulator (#05050A background)

## Technical Notes
- Uses Next.js App Router with dynamic routes
- Follows the same pattern as `/ecosysteme` for layout
- Chapter and Unit are slugs (dynamic segments)
- i18n support through [locale] segment

## Data Schema (Contrat de Données)
The Academy uses a JSON-based data schema that serves as the "contract" between content creators (AI) and developers. This ensures consistency and scalability.

### Hierarchy
- **Chapter**: Contains multiple units
- **Unit**: Container for a lesson with metadata and exercises
- **Exercise**: 4 types (STORY, SWIPE, DRAG_DROP, QUIZ)

### Data Contract Benefits
- Clear separation between content and presentation
- Flexible exercise system through `type` field
- Development-friendly with `image_prompt` for temporary assets
- Gamification integrated (rewards, XP)
- Scalable architecture for multiple developers/AI collaboration

See `[chapter]/doc/context.md` for Chapter structure and `[unit]/doc/context.md` for detailed Unit/Exercise schemas.

## Future Development Areas
- Chapter management system
- Unit content delivery engine with 4 exercise types
- Progress tracking and gamification
- Interactive components (STORY, SWIPE, DRAG_DROP, QUIZ)
- Reward system (gouttes, XP)
- Certificate generation
