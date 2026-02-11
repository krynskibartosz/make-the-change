# Analyse approfondie des couleurs hardcodées (`web-client`)

Date de l'analyse : 2026-02-11  
Périmètre : `apps/web-client` (hors `node_modules`, hors `.next`)

## 1. Méthodologie

J'ai combiné plusieurs scans regex pour couvrir :

- Littéraux couleur bruts : `#hex`, `rgb()/rgba()`, `hsl()/hsla()`
- Classes Tailwind de palette explicite : `text-emerald-500`, `bg-yellow-100`, etc.
- Vérification des styles inline (`style={{ backgroundColor: ... }}`)
- Distinction entre :
  - tokens/thèmes (hardcodés mais centralisés par design)
  - hardcode applicatif (dans composants/pages)
  - assets statiques SVG (icônes/illustrations)

## 2. Résumé exécutif

Oui, il reste des couleurs hardcodées.

- `2371` occurrences de littéraux couleur (`#`, `rgb`, `hsl`) dans `apps/web-client`
- `551` occurrences dans `src/styles/theme-definitions.css` (source de thèmes centralisée)
- `25` occurrences dans `src/` hors `theme-definitions.css`
- `147` occurrences de classes Tailwind de palette brute dans `src/` (27 fichiers)
- `1795` occurrences dans `public/` (principalement SVG)

Conclusion rapide :

- Le plus gros volume est **intentionnel** (thèmes et SVG).
- Il reste cependant des hardcodes **applicatifs** (notamment palette Tailwind directe et quelques valeurs RGBA/HEX explicites) qui peuvent encore être rationalisés.

## 3. Détail des constats

### 3.1 Thèmes centralisés (acceptable si assumé)

Fichier principal :

- `apps/web-client/src/styles/theme-definitions.css` (`1358` lignes)
- `29` blocs de thèmes (`[data-theme='...']` / variantes light/dark)
- `551` appels `hsl(...)`

Lecture : ces valeurs sont hardcodées, mais **au bon endroit** (source de tokens). C'est cohérent avec une architecture de design system pilotée par variables CSS.

### 3.2 Littéraux dans le code applicatif (`src` hors thèmes)

#### A. Littéraux réellement bruts (à corriger en priorité)

`2` occurrences `rgba(...)` numériques sans variable :

- `apps/web-client/src/features/leaderboard/leaderboard-view.tsx:93` (`rgba(255,255,255,0.10)`)
- `apps/web-client/src/features/biodex/species-card.tsx:45` (`rgba(0,0,0,0.2)`)

Impact : couplage visuel direct, moins adaptable aux thèmes.

#### B. HEX explicites (cas documentation/brand)

`6` occurrences HEX :

- `apps/web-client/src/app/[locale]/(marketing)/brand-guidelines/colors/page.tsx:10`
- `apps/web-client/src/app/[locale]/(marketing)/brand-guidelines/colors/page.tsx:11`
- `apps/web-client/src/app/[locale]/(marketing)/brand-guidelines/colors/page.tsx:12`
- `apps/web-client/src/app/[locale]/(marketing)/brand-guidelines/colors/page.tsx:13`
- `apps/web-client/src/app/[locale]/(marketing)/brand-guidelines/colors/page.tsx:14`
- `apps/web-client/src/app/[locale]/(marketing)/brand-guidelines/colors/page.tsx:15`

Note : c'est une page de guidelines, donc potentiellement volontaire. Risque principal : dérive si ces HEX ne restent pas synchronisées avec les tokens réels.

#### C. Couleurs via variables dans classes arbitraires

`17` occurrences utilisent `hsl(var(--...))` ou `rgba(var(--...))` dans des classes Tailwind arbitraires.  
Ce n'est pas du hardcode couleur strict (valeur pilotée par token), mais c'est un style plus difficile à gouverner qu'une classe sémantique standardisée.

### 3.3 Palette Tailwind brute dans les composants/pages

`147` occurrences sur `27` fichiers (ex: `text-amber-500`, `bg-slate-950`, `from-yellow-500`).

Top fichiers :

| Occurrences | Fichier |
|---:|---|
| 23 | `apps/web-client/src/features/leaderboard/leaderboard-view.tsx` |
| 21 | `apps/web-client/src/features/leaderboard/podium-test-view.tsx` |
| 16 | `apps/web-client/src/app/[locale]/(auth)/layout.tsx` |
| 9 | `apps/web-client/src/features/blog/components/blog-card.tsx` |
| 9 | `apps/web-client/src/features/biodex/utils.ts` |
| 9 | `apps/web-client/src/app/[locale]/cart/page.tsx` |
| 8 | `apps/web-client/src/app/[locale]/(dashboard)/dashboard/points/page.tsx` |
| 7 | `apps/web-client/src/app/[locale]/challenges/page.tsx` |

Lecture : ce n'est pas forcément “mauvais” (certaines couleurs métier sont légitimes, ex. podium, statuts, alertes), mais c'est moins token-driven et donc plus fragile pour cohérence cross-thème.

### 3.4 Assets statiques (`public/`)

`1795` occurrences de couleurs HEX dans les assets.

Principaux fichiers :

- `apps/web-client/public/adopt.svg` : `707`
- `apps/web-client/public/favicon.svg` : `272`
- `apps/web-client/public/images/app-icon.svg` : `272`
- `apps/web-client/public/favicon.ico` : `272`
- `apps/web-client/public/apple-touch-icon.png` : `272`

Observation : `favicon.ico` et `apple-touch-icon.png` sont en réalité des contenus SVG textuels dans ce repo, donc avec couleurs figées.

## 4. Priorisation de remédiation

### Priorité haute

1. Remplacer les 2 `rgba(...)` numériques par variantes tokenisées (ex. variables CSS déjà utilisées ailleurs).
2. Réduire les classes palette brutes dans les écrans critiques (leaderboard/auth/challenges) via classes sémantiques.

### Priorité moyenne

1. Remplacer (ou au moins valider automatiquement) `CORE_COLORS` HEX de la page guidelines pour éviter la dérive visuelle.
2. Encapsuler les couleurs métier (podium, statuts biodiversité, points) dans des mappings sémantiques centralisés.

### Priorité basse

1. Conserver les SVG branding tels quels si le rendu doit rester strictement identitaire.
2. Sinon, migrer progressivement vers `currentColor`/tokens pour les assets qui doivent suivre les thèmes.

## 5. Risques résiduels

- Un scan regex peut manquer des couleurs construites dynamiquement via concaténation complexe.
- Certaines couleurs hardcodées sont volontairement liées à l'identité de marque (documentation et assets).

## 6. Verdict

- **Oui**, il y a encore des couleurs hardcodées.
- Les plus importantes en volume sont centralisées (thèmes + SVG).
- Les hardcodes applicatifs restants sont surtout :
  - 2 RGBA numériques à corriger vite
  - 147 classes de palette Tailwind brute à rationaliser progressivement
  - 6 HEX de documentation à synchroniser/fiabiliser
