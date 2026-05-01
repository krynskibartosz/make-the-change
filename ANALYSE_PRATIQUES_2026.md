# Analyse : De la nouveauté à la "Bonne Pratique" stricte (vs. app/web-client)

Cette analyse compare les "pratiques de 2026" définies dans le texte de référence avec l'état actuel de la base de code du projet, spécifiquement dans le répertoire `apps/web-client`.

---

## 1. Optional Chaining (`?.`) et Nullish Coalescing (`??`) : L'arme à double tranchant

### La règle de 2026
*   **✅ Bonne pratique :** Interface utilisateur (affichage) - utilisé quand l'absence de donnée est normale et prévue.
*   **❌ Mauvaise pratique :** Masquage d'erreurs d'architecture (anti-pattern) - utilisé sur des données critiques (ex: ID d'une transaction attendue) créant des bugs silencieux.
*   **Règle d'or :** Si une donnée critique manque, laisser le code planter ou jeter une vraie erreur.

### Constat dans `apps/web-client`
L'utilisation de ces opérateurs est massive dans la base de code, en particulier dans les fichiers utilitaires et les mocks (`src/lib/mock/*`).

**Exemples légitimes (UI / Données non critiques) :**
Dans `src/lib/mock/mock-member-data.ts`, l'extraction du prénom/nom se fait en prévoyant l'absence de profil, ce qui est correct pour de l'affichage :
```typescript
const firstName = profile?.displayName?.split(' ')[0] || ''
```

**Exemples à risque (Masquage potentiel d'erreurs d'architecture) :**
Dans `src/lib/mock/mock-biodex.ts`, on trouve de nombreuses occurrences comme celle-ci :
```typescript
userProgress: graph.currentChallengeProgress.get(challenge.id) ?? null
```
Ou dans la récupération d'IDs :
```typescript
.map((item) => item.product?.id || null)
```
Si un produit est *censé* avoir un ID pour le bon fonctionnement de la base de données ou de la logique métier, utiliser `?.` masque un problème fondamental dans la donnée source. Le code continuera de s'exécuter avec des `null` là où il ne devrait pas y en avoir, ce qui pourrait causer des corruptions silencieuses plus tard dans la chaîne de traitement.

---

## 2. L'API Temporal vs `new Date()`

### La règle de 2026
*   **✅ Bonne pratique absolue :** Utilisation exclusive de l'API `Temporal` (immuabilité, distinction claire entre dates simples et dates avec fuseaux horaires).
*   **❌ Mauvaise pratique :** Utilisation de `new Date()`, souvent interdite par des règles ESLint.

### Constat dans `apps/web-client`
La base de code est entièrement construite sur `new Date()`. Le système de Mocks (qui gère les challenges, les saisons, l'académie) repose lourdement sur la manipulation des dates via l'ancienne API.

**Exemples fréquents :**
```typescript
// src/app/[locale]/(screens)/challenges/eco-fact/[dayKey]/page.tsx
const timestamp = new Date().toISOString()
endDate: new Date(Date.now() + 86400000).toISOString()

// src/app/[locale]/(lab)/_lib/lives/index.ts
const elapsed = nowMs - new Date(lives.updatedAt).getTime()
```

L'écart est ici total. Bien que `new Date()` soit la norme en 2024, pour respecter la vision "2026", il faudrait s'en abstraire totalement pour éviter les problèmes de mutation accidentelle et de gestion complexe des fuseaux horaires (qui sont particulièrement visibles dans les fichiers comme `src/lib/mock/mock-challenge-progress-server.ts`).

---

## 3. Déclaration des fonctions : `function` vs flèches (`=>`)

### La règle de 2026
*   **👑 `function` :** Roi de l'architecture. À utiliser pour les composants React, les fonctions exportées et les utilitaires globaux ("Newspaper Pattern" grâce au *hoisting*).
*   **👑 `=>` (Fonctions fléchées) :** Roi de l'action rapide. À utiliser uniquement pour les callbacks (ex: `.map(item => ...)`).

### Constat dans `apps/web-client`
Le projet actuel est fortement imprégné du "tout-fléché". La majorité des exports, qu'il s'agisse de fonctions utilitaires ou de composants React, sont déclarés avec `const = () =>`.

**Exemples (Non conformes aux règles de 2026) :**
Composants React :
```tsx
// src/components/ui/logo.tsx
export const Logo = ({ ... }: LogoProps) => { ... }
```

Utilitaires métiers (très nombreux dans les mocks) :
```typescript
// src/lib/mock/mock-session.ts
export const getClientMockViewerSession = (): MockViewerSession | null => { ... }

// src/lib/mock/mock-challenges.ts
export const getMockCalendarDayKey = (...) => { ... }
```

**L'impact :**
1.  **Lisibilité (Newspaper Pattern) :** Dans les fichiers complexes, l'absence de *hoisting* oblige à déclarer toutes les fonctions utilitaires avant le composant ou la fonction principale, reléguant souvent l'information cruciale en bas de fichier.
2.  **Debugging :** Les Stack Traces sont parfois moins lisibles, car certaines fonctions peuvent être traitées comme des fonctions anonymes assignées à des variables.

---

# Plan d'action pour rendre la base de code "propre" (Standard 2026)

Voici les étapes nécessaires pour faire évoluer la base de code `apps/web-client` vers ces nouvelles pratiques.

## Étape 1 : Migration des déclarations de fonctions (Architecture)
C'est le changement le plus sûr et le plus rapide pour améliorer la lisibilité immédiate du projet.

1.  **Composants React :** Remplacer systématiquement `export const MonComposant = () => {}` par `export default function MonComposant() {}` (ou `export function`).
2.  **Utilitaires :** Convertir les `export const utilitaire = () => {}` en `export function utilitaire() {}`.
3.  **Réorganisation (Newspaper Pattern) :** Dans les gros fichiers, déplacer les fonctions principales en haut du fichier et reléguer les fonctions utilitaires mineures en bas, profitant ainsi du *hoisting*.

## Étape 2 : Audit et correction de l'Optional Chaining (`?.`)
Ce travail nécessite une réflexion métier pour différencier l'UI de la donnée critique.

1.  **Définir les données critiques :** Identifier les interfaces où certaines données ne *doivent pas* être nulles (IDs, statuts de transaction, etc.).
2.  **Remplacer le masquage par des erreurs explicites :**
    *   *Avant :* `const id = data?.user?.id; if(!id) return;`
    *   *Après :* `if (!data.user.id) throw new Error("Erreur critique : User ID manquant");`
3.  **Conserver `?.` pour l'UI :** Laisser intacts les appels concernant l'affichage de données optionnelles (bios, avatars, etc.).

## Étape 3 : Transition vers l'API `Temporal` (ou équivalent robuste)
C'est la tâche la plus complexe car l'API `Temporal` n'est peut-être pas encore un standard pleinement supporté sans polyfill lourd, selon l'environnement de build actuel.

1.  **Option A (Idéale - Temporal) :**
    *   Ajouter le polyfill `@js-temporal/polyfill` si nécessaire.
    *   Configurer ESLint pour interdire `new Date()`.
    *   Refactoriser tous les calculs de dates (`new Date()`, `.toISOString()`, `.getTime()`) vers `Temporal.Now.instant()`, `Temporal.ZonedDateTime`, etc.
2.  **Option B (Pragmatique) :** Si `Temporal` est trop prématuré, utiliser une librairie imposant l'immuabilité (comme `date-fns` ou `luxon`) et centraliser la gestion des dates dans un utilitaire dédié (ex: `src/lib/date-utils.ts`) pour interdire l'appel direct à `new Date()` dans le code métier, préparant ainsi le terrain pour un switch facile vers `Temporal` à l'avenir.
