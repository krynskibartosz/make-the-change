# Blueprint Source — Home V2 Mobile

Ce document consolide le blueprint produit transmis pour la home mobile `web-client`.

## Règle absolue

- Aucune section supplémentaire ne doit être ajoutée sur la home.
- La home doit conserver un objectif unique de conversion: `Découvrir les projets`.

## Ordre final des 8 sections

1. Hero Header (accroche)
2. Comment ça marche (timeline verticale)
3. Projets (carrousel horizontal)
4. Boutique (carrousel horizontal)
5. Gamification (bento mobile)
6. Ecosystème (marquee logos)
7. FAQ (accordéon 3 questions)
8. Final CTA (bloc minimaliste)

## Contraintes UX majeures

- Mobile-first strict.
- Texte de plus de 2 lignes aligné à gauche.
- CTA principaux full-width en zone de pouce.
- Pas de portes de sortie prématurées (liens “Voir tout” sous carrousels).
- Home sans footer classique sur mobile.

## Contraintes de contenu

- Supprimer les sections “Explorez l’univers” et “Dernière actualité”.
- Supprimer dans le hero: surtitre, stats, encart “Le saviez-vous”, flèche.
- Exclure les produits épuisés sur la home.
- Utiliser un vocabulaire orienté impact/récompense (éviter “Investir/ROI” dans la copy home).

## Motion v1 (noyau performant)

- Scroll reveal fade-up (`<=300ms`).
- Scroll snap mobile sur carrousels.
- Progress bars projets animées à l’entrée viewport.
- Accordéon FAQ avec slide-down fluide.
- Marquee partenaires en défilement continu + pause au touch.
- Respect `prefers-reduced-motion`.

