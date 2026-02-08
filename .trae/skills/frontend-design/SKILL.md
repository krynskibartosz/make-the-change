---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces. Invoke when building/styling web components, pages, dashboards, or any UI and you want a strong aesthetic direction.
---

# Frontend Design

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic, cookie-cutter aesthetics. It focuses on committing to an intentional visual direction and implementing real working code with careful attention to typography, color, layout, and motion.

The user typically provides frontend requirements: a component, page, application, or interface to build, plus context about purpose, audience, and constraints.

## Design Thinking

Before coding, understand the context and commit to a clear aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme and execute it intentionally: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this memorable? What will users remember after 5 seconds?

Choose a clear conceptual direction and execute it with precision. Both bold maximalism and refined minimalism can work; the key is intentionality.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear point-of-view
- Meticulously refined in details (spacing, states, contrast, rhythm)

## Frontend Aesthetics Guidelines

Prioritize the following:

- **Typography**: Choose beautiful, characterful fonts. Pair a distinctive display font for headings with a refined body font. Avoid defaulting to generic system fonts.
- **Color & Theme**: Commit to a cohesive palette. Use CSS variables/tokens for consistency. Dominant colors with sharp accents tend to read better than timid, evenly-distributed palettes.
- **Motion**: Use motion deliberately for high-impact moments (page load, section reveals, hover affordances). Prefer CSS where possible; use a motion library when available and already used in the codebase.
- **Spatial Composition**: Consider asymmetry, overlap, grid-breaking elements, and purposeful negative space. Make density a deliberate choice, not an accident.
- **Backgrounds & Visual Details**: Create atmosphere (gradient meshes, noise/grain overlays, patterns, layered transparencies, refined shadows, decorative borders), but keep it consistent with the chosen aesthetic.

## Anti-Patterns (Avoid)

- Generic, repetitive “AI-looking” layouts and component patterns
- Overused safe choices without context (same fonts, same gradients, same cards)
- Low-contrast body text or decorative colors used as backgrounds without readability checks
- Inconsistent spacing and typography scale

## Output Expectations

When implementing UI changes:

- Use the project’s existing component system and tokens when available.
- Prefer semantic tokens/variables rather than hardcoded colors.
- Ensure accessibility basics: focus states, readable contrast for body text, correct headings and labels.
- Keep code maintainable: consistent naming, small components, and reusable styling primitives.
