# UI & Motion Spec — Home V2 Mobile

## Layout mobile

- Base mobile-first.
- Carrousels en `scroll-snap`.
- CTA principaux full-width.
- Textes longs alignés gauche.

## Rythme visuel

- Section 1: hero immersif sombre (vidéo + overlay).
- Section 2: fond principal.
- Section 3: fond principal.
- Section 4: fond secondaire.
- Section 5: fond sombre accentué (halo discret).
- Section 6: fond secondaire (bande marquee).
- Section 7: fond principal.
- Section 8: fond principal avec contraste CTA fort.

## Tokens cibles

- `Background Primary`: base thème.
- `Background Secondary`: variation légère pour cassure.
- `Surface`: cartes projets/boutique.
- `Accent`: vert action pour CTA et points.

## Motion v1

- Durée standard: `200ms` à `300ms`.
- Courbe: `easeOut`.
- Déclenchement reveal: entrée dans le tiers inférieur du viewport.
- Reduced motion: réduire/supprimer animations décoratives.

## Animations retenues

- Fade-up sections/titres/blocs.
- Draw line sur timeline.
- Progress bar projets animée à l’entrée viewport.
- Marquee logos linéaire et infinie, pause au touch.
- FAQ accordéon slide-down fluide + rotation icône.

## Animations reportées (hors v1)

- Gyroscope/tilt.
- Shimmer complexe périodique.
- Effets lourds non nécessaires à la conversion.

