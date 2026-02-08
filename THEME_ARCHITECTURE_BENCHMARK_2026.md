# Benchmark & Stratégie d'Architecture Multi-Thèmes (2026)

## 📅 Date: 8 Février 2026
## 🎯 Objectif
Définir l'architecture technique optimale pour supporter un système de thèmes multiples (ex: Ocean, Forest) où **chaque thème** dispose de ses propres variantes **Clair (Light)** et **Sombre (Dark)**.

---

## 1. Benchmark & État de l'Art (Leaders du Marché)

Analyse des stratégies adoptées par les applications de référence pour gérer la complexité de la thématisation.

### 🐙 GitHub (Primer Design System)
*   **Architecture** : Système "Multi-Mode" sophistiqué.
*   **Approche** : GitHub ne se limite pas à Light/Dark. Ils supportent `light`, `light_high_contrast`, `dark`, `dark_dimmed`, `dark_high_contrast`.
*   **Implémentation** :
    *   Utilise des attributs `data-color-mode` et `data-light-theme` / `data-dark-theme` sur la balise `<html>`.
    *   **Variables CSS Tiered** :
        1.  **Primitives** : `scale-blue-5` (Valeur brute).
        2.  **Fonctionnelles** : `accent-fg` (Rôle sémantique).
        3.  **Composants** : `btn-primary-bg` (Spécifique).
*   **Leçon à retenir** : La séparation entre le "Mode" (Luminosité) et le "Thème" (Palette) est cruciale pour l'accessibilité.

### 💬 Slack
*   **Architecture** : Thématisation "Scoped" (Partielle).
*   **Approche** : Slack permet une personnalisation extrême mais **uniquement sur la Sidebar**. Le reste de l'app suit un thème système plus strict (Light/Dark).
*   **Implémentation** : Injection de variables CSS dynamiques via JS dans le conteneur de la sidebar (`.p-channel_sidebar`).
*   **Leçon à retenir** : Les "Scopes" CSS permettent de mixer des thèmes différents sur une même page sans conflit.

### 📝 Notion
*   **Architecture** : Pragmatique & Sémantique.
*   **Approche** : Pas de "thèmes" globaux complexes, mais une gestion fine du mode Dark. Les couleurs (rouge, bleu, vert) sont des classes utilitaires qui changent subtilement selon le mode.
*   **Implémentation** : Classes CSS simples (`.bg-red`) qui redéfinissent leur couleur de fond via des media queries ou des classes parentes `.dark`.

### 🎨 Figma
*   **Architecture** : Hybride (Canvas WebGL + UI HTML).
*   **Approche** : L'interface UI supporte le Light/Dark mode de manière standard.
*   **Implémentation** : Utilisation intensive de **Design Tokens** transformés en variables CSS. Figma a récemment migré vers une architecture de variables plus stricte pour supporter les nouveaux modes.

---

## 2. Comparatif des Approches Techniques

Quelle stratégie pour une "Modern Web App" en 2026 ?

| Approche | Description | Avantages | Inconvénients |
| :--- | :--- | :--- | :--- |
| **A. Theme = Mode** | Chaque combinaison est un thème unique (ex: `theme-ocean-dark`, `theme-ocean-light`). | Simple à implémenter avec `next-themes`. | Explosion combinatoire. Duplication de code. Difficile à maintenir. |
| **B. CSS-in-JS (Emotion/SC)** | Injection dynamique des styles via JS. | Isolation parfaite, typage fort. | **Performance** (Runtime overhead), obsolète avec React Server Components (RSC). |
| **C. The Matrix (Recommandé)** | Séparation orthogonale : **Marque** (Brand) × **Mode** (Brightness). | Scalabilité, Maintenance, Performance (CSS natif), Support Tailwind. | Demande une rigueur stricte sur les Design Tokens. |

---

## 3. Architecture Recommandée : "The Matrix" (Brand × Mode)

C'est la solution "Best Practice 2026", alignée avec CSS Layers et Container Queries.

### 3.1 Concept
On croise deux axes de configuration :
1.  **L'Axe de Marque (`data-theme`)** : Définit la *Teinte* (Hue/Saturation). "C'est Bleu", "C'est Vert".
2.  **L'Axe de Mode (`class="dark"`)** : Définit la *Luminosité* (Lightness). "C'est Clair", "C'est Sombre".

### 3.2 Implémentation CSS (Variables Sémantiques)

Nous utilisons un système à **2 niveaux** pour garder la complexité gérable.

#### Niveau 1 : Les Primitives (Globales)
Définies une seule fois, elles contiennent toutes les couleurs brutes.
```css
:root {
  /* Ocean Brand */
  --brand-ocean-50: 210 40% 98%;
  --brand-ocean-500: 210 100% 50%;
  --brand-ocean-900: 210 100% 20%;
  
  /* Forest Brand */
  --brand-forest-50: 150 40% 98%;
  --brand-forest-500: 150 100% 40%;
}
```

#### Niveau 2 : Les Sémantiques (Contextuelles)
C'est ici que la magie opère. On mappe les variables fonctionnelles (`--primary`) vers les primitives selon le contexte.

```css
/* --- OCEAN THEME --- */
[data-theme='ocean'] {
  --primary: var(--brand-ocean-500);
  --radius: 0.5rem; /* Le thème peut aussi impacter le shape */
}

/* En mode Dark, on ajuste la luminosité pour le contraste */
[data-theme='ocean'].dark {
  --primary: var(--brand-ocean-400); /* Plus clair sur fond sombre ! */
  --background: var(--brand-ocean-900);
}

/* --- FOREST THEME --- */
[data-theme='forest'] {
  --primary: var(--brand-forest-500);
}
[data-theme='forest'].dark {
  --primary: var(--brand-forest-400);
  --background: var(--brand-forest-950); /* Fond très sombre mais teinté vert */
}
```

### 3.3 Configuration Tailwind
Tailwind ne doit "rien savoir" des thèmes Ocean ou Forest. Il ne connaît que la sémantique.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))', // Tailwind utilise la variable résolue
        background: 'hsl(var(--background))',
      }
    }
  }
}
```

---

## 4. Stratégie de Migration & Implémentation

### Phase 1 : Audit & Assainissement (Sanitization)
*   **Problème** : Présence de couleurs hardcodées (`bg-blue-600`) qui ne réagiront pas au changement de thème.
*   **Action** : Remplacer systématiquement par des classes sémantiques (`bg-primary`, `bg-primary-600` si nécessaire, mais préférer les rôles).

### Phase 2 : Infrastructure (Theming Engine)
1.  **Provider** : Créer un `AppThemeProvider` qui combine `next-themes` (pour le mode Dark) et un Context React custom (pour le `data-theme`).
2.  **Storage** : Persister le choix du thème dans `localStorage` (clé `app-theme`).

### Phase 3 : Création des Thèmes
Convertir les palettes de `.trae/rules/theme-factory.md` en CSS.
*   *Ocean Depths* -> `[data-theme="ocean"]`
*   *Forest Canopy* -> `[data-theme="forest"]`
*   *Modern Minimalist* -> `[data-theme="minimal"]` (Niveaux de gris, radius 0)

### Phase 4 : UI Switcher
Implémenter un sélecteur dans l'Admin Bar.
*   **Preview** : Afficher une pastille bicolore (Primary + Background) pour chaque thème.
*   **Feedback** : Changement immédiat sans rechargement de page.

---

## 5. Critères de Succès & Métriques

1.  **Zéro FOUC** : Aucun flash de contenu non stylé au chargement (géré par le script blocking de `next-themes`).
2.  **Accessibilité (WCAG AA)** : Chaque combinaison (Thème x Mode) doit garantir un ratio de contraste > 4.5:1 pour le texte.
3.  **Maintenance** : Ajouter un nouveau thème prend < 15 minutes (juste du CSS, pas de JS).
4.  **Bundle Size** : Impact négligeable (< 2kb de CSS Gzipped supplémentaire).
