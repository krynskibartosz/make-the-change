# Audit de Sémantique HTML

> **Date** : 18 février 2026
> **Statut** : Critique / Intransigeant
> **Basé sur** : [Analyse Sémantique HTML](./analyse-semantique-html.md)

Ce document recense les erreurs, approximations et opportunités d'amélioration sémantique identifiées dans les fichiers sources du projet.

---

## 1. Structure Globale & Layout

### `src/components/layout/header.tsx`
- ✅ Usage correct de `<header>`, `<nav>`, `<ul>`, `<li>`.
- ⚠️ **Ligne 98** : `aria-label="Navigation principale"`. Redondant si c'est la seule `<nav>` principale, mais acceptable.
- 🚨 **Ligne 198** : Le conteneur du MegaMenu est une `div`. Si c'est un sous-menu de navigation, il devrait idéalement être intégré structurellement dans la liste parente, ou lié explicitement via `aria-owns` / `aria-controls` (ce qui semble être fait avec `aria-controls`, bon point).

### `src/components/layout/footer.tsx`
- ✅ Usage correct de `<footer>`, `<address>`.
- ⚠️ **Navigation** : Les listes de liens (Quick Links, Account, Support) sont dans des `<div>`.
  - **Correction recommandée** : Envelopper chaque groupe de liens dans une `<nav>` avec un `aria-label` distinct (ex: `aria-label="Liens rapides"`, `aria-label="Support"`).
- 🚨 **Réseaux sociaux** : `<nav aria-label="Réseaux sociaux">` est utilisé. C'est correct, mais une liste `<ul>` à l'intérieur serait plus propre sémantiquement que des `<a>` en vrac dans la `nav`.

### `src/components/layout/main-content.tsx`
- ✅ Usage correct de `<main>`.

### `src/components/layout/mobile-bottom-nav.tsx`
- ✅ Usage de `<nav>`.
- 🚨 **Structure** : Les liens sont des enfants directs de `<nav>`. Bien que valide, une liste `<ul>`/`<li>` est préférable pour l'énumération d'options de navigation, surtout pour les lecteurs d'écran (qui annoncent "Liste de X éléments").

---

## 2. Pages & Sections Marketing

### `src/app/[locale]/(marketing)/page.tsx`
- ✅ `PageHero` contient le `<h1>`. Excellent.
- 🚨 **Hiérarchie des titres** :
  - `PageHero` -> `h1`.
  - `HomeUniverseSection` -> `MarketingSection` -> `SectionContainer` -> `h2` (via la prop `title`). Correct.
  - `HomeStatsSection` -> `MarketingSection` -> `h2`. Correct.
  - Attention à ne pas sauter de niveaux dans les composants enfants.
- ⚠️ **Ligne 195** : Liste de stats dans le héros (`<ul className="...">`). Correct sémantiquement.

### `src/components/marketing/marketing-section.tsx` & `src/components/ui/section-container.tsx`
- ✅ Utilise `<section>`. Correct.
- ✅ Gestion des titres `h2`.
- **Note** : Vérifier que `description` (rendu en `<p>`) ne contient pas lui-même de blocs sémantiques complexes.

### `src/components/marketing/marketing-cta-band.tsx`
- ⚠️ **Élément `<aside>`** : Utilisé pour le CTA (`<aside aria-label="Call to action">`).
  - **Analyse** : `<aside>` est pour le contenu "tangentiel". Un CTA principal de fin de page est-il tangentiel ? Souvent, c'est la conclusion logique du contenu principal. Une `<section>` serait plus robuste sémantiquement, ou même un `<footer>` (si ce n'était pas déjà dans un main). Je recommande de changer pour `<section>` car cela fait partie du flux narratif principal de la page.

### `src/components/marketing/home/diversity-fact-loader.tsx`
- ✅ Utilise `<aside>` et `<figure>`/`<figcaption>`.
  - **Analyse** : Très bon usage. C'est typiquement un contenu "tangentiel" (Fun Fact). `<figure>` est approprié pour l'illustration + texte.

### `src/components/marketing/home/home-partners-section.tsx`
- 🚨 **Liste des partenaires** :
  - `role="list"` est utilisé sur une `div`.
  - `role="listitem"` sur les liens.
  - **Correction impérative** : Utiliser nativement `<ul>` et `<li>`. L'attribut ARIA ne doit être un palliatif que si le CSS casse la sémantique (ce qui arrive parfois avec `display: contents` ou certains carousels), mais ici une structure native est largement préférable.

### `src/components/marketing/home/home-features-section.tsx`
- ✅ Utilise `<ul>` pour la liste des cartes. Excellent.
- ⚠️ **Titres des cartes** : Utilise `CardTitle` qui rend souvent un `h3` (à vérifier dans `@make-the-change/core/ui`). Si la section parente a un `h2`, c'est parfait.

### `src/components/marketing/home/home-universe-section.tsx`
- 🚨 **Structure des cartes** :
  - Utilise `<article>`. C'est un choix fort. Correct si chaque carte est considérée comme un contenu autonome (un "teaser" vers une section).
  - **Images** : Les images sont purement décoratives (le texte contient l'info). L'attribut `alt` reprend le titre. C'est acceptable, mais `alt=""` serait envisageable si le titre est explicite à côté. Ici `alt={projects.title}` crée une redondance pour le lecteur d'écran ("Image: Projets... Titre: Projets").
  - **Liens** : Tout le contenu est enveloppé dans un `<Link>`. C'est valide en HTML5, mais peut être verbeux pour les lecteurs d'écran.

### `src/components/marketing/home/marketing-steps-section.tsx`
- ✅ Utilise `<ol>` (Ordered List) pour les étapes. **C'est sémantiquement parfait** pour une liste d'étapes (1, 2, 3).
- ✅ Utilise `<h3>` pour les titres d'étapes. Cohérent avec le `<h2>` de la section.

---

## 3. Composants UI & Marketing

### `src/components/ui/category-card.tsx`
- ⚠️ **Liens** : Enveloppe tout le contenu (image + texte) dans un `<a>`.
  - **Problème potentiel** : Si le texte est long, l'expérience lecteur d'écran est moyenne (lit tout le bloc d'un coup).
  - **Amélioration** : Vérifier que l'image a un `alt` vide si elle est décorative, ou descriptif si elle apporte de l'info non présente dans le texte. Ici `alt={title}` est redondant avec le `h3` qui suit immédiatement. **Recommandation : `alt=""` sur l'image dans la carte.**

### `src/components/ui/image-upload.tsx`
- ⚠️ **Input File** : `<input type="file" className="hidden" />`.
  - **Accessibilité** : L'input est caché et déclenché par un bouton/div. Il faut s'assurer que le focus est géré correctement. Le bouton "parcourez" a un `onClick` qui déclenche l'input. C'est fonctionnel, mais l'input file doit rester accessible au clavier d'une manière ou d'une autre (souvent via le label ou en rendant l'input visuellement caché mais focusable).
- 🚨 **Zone de drop** : C'est une `div` avec des événements de souris. Elle n'est pas focusable au clavier. Un utilisateur clavier ne peut pas "dropper" (normal), mais doit pouvoir accéder au bouton "parcourez". Le bouton est bien là `{/* ... <button>parcourez</button> ... */}`.

### `src/components/ui/stats-section.tsx`
- 🚨 **Structure** : Utilise une `div` conteneur pour une liste de stats.
  - **Correction** : Devrait être une liste de définition `<dl>` avec des `<dt>` (label) et `<dd>` (valeur), ou une liste `<ul>`.
  - Dans `HomeStatsSection`, on voit `<dl>` (Ligne 30 de `home-stats-section.tsx`), mais `StatsSection` (le composant UI générique) utilise des `div`. Il faut aligner ces pratiques. **Recommandation : Passer `StatsSection` en `<dl>`.**

---

## Synthèse des Actions Prioritaires

1.  **HomePartnersSection** : Remplacer `div role="list"` par `<ul>`.
2.  **StatsSection** : Convertir les `div` en `<dl>`/`<dt>`/`<dd>`.
3.  **Footer** : Envelopper les colonnes de liens dans des `<nav>` ou utiliser des listes simples sans prétention de navigation si ce n'est pas majeur.
4.  **Images (Cartes)** : Passer les `alt` en vide (`""`) quand le titre de la carte est présent juste à côté pour éviter la redondance audio.
5.  **MarketingCtaBand** : Remplacer `<aside>` par `<section>`.

---

> Ce rapport est intransigeant pour garantir une structure HTML aussi robuste que possible, favorisant l'accessibilité (A11Y) et le SEO.
