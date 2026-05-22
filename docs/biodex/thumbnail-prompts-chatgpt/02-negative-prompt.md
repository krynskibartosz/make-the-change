# Global Negative Prompt

Use this avoidance language in every species prompt when the image tool allows it.

```txt
Avoid vertical cover image, hero image, cinematic lower third, wide scenic composition, background-first composition, cartoon, illustration, painting, 3D render, CGI, fantasy creature, magical glow, surreal scene, invented colors, oversaturated palette, studio backdrop, aquarium glass, zoo enclosure, cage, human hand, human object, text, logo, watermark, frame, UI element, label, duplicate animal, second main subject, cluttered scene, dramatic action, deformed anatomy, extra limbs, wrong number of wings, wrong species, hidden subject, tiny subject, cropped identifying feature, blurry subject, low resolution, harsh flash, plastic texture.
```

Extra care:

- For thumbnails, reject images where the subject is too small.
- For bees, hoverflies, and wasps: enforce the correct insect type.
- For lemurs: avoid ring-tailed lemur traits unless the species actually has them.
- For chameleons: avoid mixing Parson's chameleon and panther chameleon traits.
- For reef species: avoid aquarium-style saturated backgrounds.
- For birds: avoid generic birds from the wrong continent.
