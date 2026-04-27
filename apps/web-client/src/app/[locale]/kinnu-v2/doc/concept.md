# Kinnu V2 — Hex Archipel

> Prototype d'une carte d'exploration hexagonale (style Kinnu / Civilization)
> pour l'apprentissage non-linéaire de la biodiversité.

## Concept

Au lieu d'un graphe nodal classique (Kinnu V1 : cercles + arêtes, type
arbre de compétences RPG), Kinnu V2 propose une **carte spatiale en hexagones**
inspirée des jeux 4X (Civilization, Catan).

Chaque domaine de connaissance est représenté par une **île** (cluster
d'hexagones de même couleur). À l'intérieur de l'île, des **Pathways** sont
les points d'entrée vers les vrais cours.

## 3 niveaux de zoom (UX Kinnu)

1. **Macro — Le Monde** : la carte globale Pan/Zoom-able, vue d'ensemble
   de toutes les îles.
2. **Méso — L'Île** : zoom sur une île → bottom sheet avec illustration
   et description du Pathway.
3. **Micro — Le Cours** : navigation vers l'Academy existante (chemin en
   zigzag avec exercices). _Phase 3 — non implémenté._

## Curriculum (6 îles)

| Île | Couleur | Thématique |
|-----|---------|------------|
| 🟡 **L'Alphabet de la Vie** | Doré | Fondations (cellules, photosynthèse, eau, sols) |
| 🔵 **Le Royaume des Eaux** | Bleu | Hydrosphère (récifs, mangroves, abysses) |
| 🟢 **Les Continents Verts** | Émeraude | Biosphère terrestre (Amazonie, Madagascar) |
| 🟣 **Les Maîtres de l'Air** | Violet | Atmosphère (migrations, climat, carbone) |
| 🔴 **L'Âge de l'Homme** | Rouge | Anthropocène (menaces, déforestation, plastique) |
| 💎 **Les Gardiens** | Or | Solutions (agroforesterie, sanctuaires, ruches) |

### Cross-links inter-îles

Les Pathways de l'Île 6 (Gardiens) requièrent des Pathways d'autres îles,
créant une narration **problème → théorie → solution** :

- `guardians-1` (Renaissance des Coraux) ← `waters-0` + `anthropocene-0`
- `guardians-0` (Agroforesterie) ← `continents-0` + `continents-4`
- `anthropocene-2` (Plastique) ← `anthropocene-1` + `waters-0`

## Stack technique

| Choix | Détail |
|-------|--------|
| **Rendu** | SVG pur (`<polygon>`) — contrôle total |
| **Géométrie** | Coords axiales (q, r) flat-top — `_lib/hex-math.ts` |
| **Pan/Zoom** | Custom (Pointer Events + pinch + wheel) — pas de dépendance externe |
| **Persistance** | `localStorage` — `_lib/progress.ts` |
| **Animations** | CSS keyframes (pulse, sheet-up) |

> **Note sur `react-zoom-pan-pinch`** : finalement remplacé par une
> implémentation custom basée sur les Pointer Events natifs. Avantages :
> aucune dépendance ajoutée, support pinch + wheel + drag immédiat, contrôle
> total du clamping.

## Phases

- [x] **Phase 1** — Math hexagonale + 1 île statique
- [x] **Phase 2** — 6 îles + Pan/Zoom navigable + données mockées
- [x] **Phase 2.5** — Bottom Sheet basique (illustration placeholder + CTA)
- [x] **Phase 3** — Lien `Démarrer` → Academy (`/academy/[chapter]/[unit]`)
- [x] **Phase 4** — Fog of War + cross-links visuels animés
- [ ] **Phase 5** — Vraies illustrations 3D (origami / dioramas)
- [ ] **Phase 6** — Sync progression Kinnu ↔ Academy (master auto à fin de cours)

## Phase 3 — Mapping Academy

Chaque Pathway expose `academyChapterSlug` + `academyUnitSlug` (voir
`ACADEMY_MAPPING` dans `_lib/hex-grid-data.ts`). Le bouton **"Démarrer"**
du Bottom Sheet appelle `router.push('/academy/<chapter>/<unit>')`.

Les Pathways sans cours mappé (ex: `waters-2` Plancton, `air-2`
Chauves-souris partiel) affichent un fallback "Cours Academy bientôt
disponible" et conservent le toggle mock pour tester le déblocage.

Mapping actuel (21/29 Pathways mappés) :

| Île | Mappés | Manquants (besoin de nouveaux cours Academy) |
|-----|--------|----------------------------------------------|
| Foundations | 5/5 | — |
| Waters | 1/5 | mangrove, plancton, baleines, abysses |
| Continents | 4/5 | amazonie |
| Air | 4/4 | — |
| Anthropocene | 3/5 | invasif, assèchement |
| Guardians | 5/5 | — |

## Phase 4 — Fog of War & Cross-links

### Fog of War

3 niveaux d'opacité par hex selon la progression :

| Niveau | Condition | Rendu |
|--------|-----------|-------|
| `visible` | Pathway `available` ou `mastered` | Pleine opacité |
| `discovered` | Pathway `locked` mais ≥1 prérequis `mastered` | Opacité 0.55 |
| `fogged` | Pathway `locked` et 0 prérequis `mastered` | Opacité 0.18 + blur |

Les **îles entièrement fogged** masquent leur label.
Les hex décoratifs **suivent le fog dominant** de leur île.

### Cross-links inter-îles

Lignes Bezier (courbes) entre Pathways requis d'îles différentes :

- **Inactive** (les 2 endpoints `locked`) : pointillés très transparents
- **Active** (≥1 endpoint `mastered`) : trait plein + particule animée
  qui circule le long de la courbe
- **Complete** (les 2 endpoints `mastered`) : trait épais blanc + halo
  glow + circulation rapide

Cross-links définis dans `getCrossIslandLinks()` (calculé depuis les
champs `requires`). Exemples :

- `foundations-3` (Toile Trophique) → `anthropocene-0` (Fièvre Planétaire)
- `waters-0` (Récif) → `anthropocene-2` (Plastique)
- `continents-0` (Amazonie) + `continents-4` (Pollens) → `guardians-0` (Agroforesterie)
- `waters-0` + `anthropocene-0` → `guardians-1` (Coraux)
- `continents-4` + `foundations-1` → `guardians-3` (Ruches)

## Test rapide

1. Naviguer vers `/[locale]/kinnu-v2`
2. **Pan** : drag à la souris ou avec le doigt
3. **Zoom** : molette ou pinch (touch)
4. **Click** sur un hex `available` (couleur vibrante avec halo pulsant)
   → ouvre le Bottom Sheet
5. **"Démarrer"** → marque le Pathway comme `mastered` et débloque les suivants
6. **Reset** (bouton rouge en bas-gauche) → efface la progression locale

## Fichiers

```
kinnu-v2/
├── page.tsx                          # Hub principal
├── _components/
│   ├── hex-grid-canvas.tsx           # SVG + Pan/Zoom custom
│   ├── hex-tile.tsx                  # <polygon> par hex (3 states)
│   └── hex-hud.tsx                   # Header (retour + score)
├── _lib/
│   ├── hex-math.ts                   # Conversions axial ↔ pixel
│   ├── hex-grid-data.ts              # 6 îles + Pathways + cross-links
│   └── progress.ts                   # localStorage
└── doc/
    └── concept.md                    # Ce fichier
```
