# Marketing Composition Primitives

## Quand utiliser quoi

- `PageHero`: hero simple et générique pour pages standards (titre + description + CTA léger).
- `MarketingHeroShell`: wrapper hero branding pour mises en page custom (background riche, grid, visual complexe).
- `MarketingCtaBand`: bande CTA premium réutilisable en bas de page (badge, titre, description, 1-2 actions).
- `MarketingSection`: wrapper de section marketing qui relaie l'API de `SectionContainer` (`title`, `description`, `action`, `variant`, `size`, etc.).

## Exemples rapides

```tsx
<PageHero title="Produits" description="..." size="sm" />
```

```tsx
<MarketingHeroShell
  minHeightClassName="min-h-[90vh]"
  background={<div className="absolute inset-0 bg-primary/10" />}
>
  <div className="text-center">
    <h1>Notre mission</h1>
  </div>
</MarketingHeroShell>
```

```tsx
<MarketingCtaBand
  badge={<span className="text-xs uppercase tracking-widest">Rejoignez le mouvement</span>}
  title={<span>Ensemble, préservons notre héritage.</span>}
  description="Chaque action compte."
  primaryAction={<Button>Commencer</Button>}
  secondaryAction={<Button variant="outline">Voir les projets</Button>}
/>
```
