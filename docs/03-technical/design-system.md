# Design System (2026) — Base UI + Tailwind v4

Source de vérité unique pour les styles et composants UI.

## ✅ Stack UI officielle
- **Base UI** (`@base-ui/react`)
- **Tailwind CSS v4** (data-* selectors)
- **Tokens** via CSS variables dans core

## 📍 Sources de vérité
- Tokens globaux : `packages/core/src/shared/ui/globals.css`
- Config Tailwind partagée : `packages/core/tailwind.config.ts`
- Composants UI : `packages/core/src/shared/ui/*`

## 🎯 Principes
1. **Aucune logique de style JS** (pas de `cn/clsx` pour les états).
2. **Styles par data-* attributes** (ex: `data-[selected]`, `data-[checked]`).
3. **Tokens globaux uniquement** (pas de couleurs hardcodées).
4. **Base UI = unique set de primitives** (Radix supprimé).

## 🧩 Exemple Base UI (Tab)
```tsx
import { Tabs } from '@base-ui/react'

<Tabs.Tab
  className="
    px-4 py-2
    data-[selected]:bg-primary data-[selected]:text-white
    data-[hover]:bg-muted
    data-[focus-visible]:ring-2
  "
/>
```

## ✅ Checklist UI
- Les variables HSL sont dans `globals.css` (core).
- Les apps Web/Mobile importent les tokens.
- Les composants UI partagés résident uniquement dans `packages/core`.

Dernière mise à jour: **2 février 2026**
