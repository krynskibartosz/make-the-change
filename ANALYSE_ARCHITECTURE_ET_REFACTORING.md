# Rapport d'Analyse Architecturale et de Refactoring

**Date :** 8 Février 2026
**Projet :** Make The Change
**Périmètre :** `apps/web/` et `packages/`

## 1. Synthèse Exécutive

L'analyse des répertoires révèle une base de code moderne utilisant les dernières fonctionnalités de Next.js (App Router, Server Actions). Cependant, une **dette technique structurelle** commence à s'accumuler, caractérisée par une duplication de code entre l'application principale (`apps/web`) et le paquet partagé (`packages/core`). Cette "duplication fantôme" menace la maintenabilité à long terme. De plus, des reliquats de code ("Legacy") et des incohérences de dépendances nécessitent une intervention rapide.

**Note Globale : B+** (Architecture solide, mais discipline de partage à renforcer)

---

## 2. Architecture & Structure des Dossiers

### 2.1. `apps/web` : Le Monolithe Fonctionnel
L'application suit une structure basée sur les routes (`app/[locale]/...`), ce qui est standard. Cependant, nous notons une **colocation excessive** dans certains dossiers.

*   **Problème Critique : `admin/(dashboard)/components`**
    *   Ce dossier est devenu un "fourre-tout". Il contient à la fois des composants purement UI (`form-toggle.tsx`), des composants métier spécifiques (`order-list-item.tsx`) et des layouts (`admin-page-layout.tsx`).
    *   **Impact :** Difficile de savoir si un composant est réutilisable ailleurs.

*   **Code Mort : `_old-products`**
    *   Le dossier `apps/web/src/app/[locale]/admin/(dashboard)/_old-products` semble être une version obsolète non supprimée.
    *   **Action :** Suppression immédiate recommandée.

### 2.2. `packages/core` : La Bibliothèque Partagée
Ce paquet est bien structuré (`entities`, `features`, `shared`), mais il est **sous-utilisé**. Beaucoup de logique présente dans `apps/web` devrait s'y trouver.

---

## 3. Revue des Composants & Redondances (DRY)

Nous avons identifié une **"Duplication Fantôme"** majeure. Les composants existent en double, avec de légères variations qui rendent leur fusion complexe mais nécessaire.

| Composant | `apps/web` (Source) | `packages/core` (Source) | Diagnostic |
| :--- | :--- | :--- | :--- |
| **DataList** | `src/components/ui/data-list.tsx` | `src/shared/ui/data-list.tsx` | Version Web plus complète (sous-composants). Version Core trop générique. |
| **DetailView** | `src/components/ui/detail-view.tsx` | `src/shared/ui/detail-view.tsx` | Copie quasi-conforme avec styles hardcodés dans Web vs variantes dans Core. |
| **EmptyState** | `src/components/ui/empty-state.tsx` | `src/shared/ui/empty-state.tsx` | Version Core utilise `cva` (mieux), Web utilise du style inline. |
| **User Schema** | `src/lib/validators/user.ts` | `src/features/admin/schemas.ts` | **Critique.** Mêmes Regex de mot de passe dupliquées. Risque de désynchronisation. |

---

## 4. Inspection des Dépendances & Configuration

Des incohérences de versions entre le workspace et les paquets peuvent entraîner des bugs de compilation subtils.

*   **TypeScript** : `^5.9.2` (Web) vs `^5.7.2` (Core). **Action :** Aligner sur la version la plus récente (5.9.2).
*   **@types/react** : `^19.0.1` (Web) vs `^19.1.12` (Core). **Action :** Aligner sur 19.1.12.
*   **Points Positifs :** `react`, `drizzle-orm` et `next` sont correctement alignés.

---

## 5. Sécurité & Performance

### 5.1. Sécurité des Server Actions
L'analyse de `apps/web/src/lib/supabase/server.ts` révèle une vulnérabilité potentielle de configuration.

*   **Risque : Fuite de Clé Privée**
    *   Le fichier utilise `process.env.SUPABASE_SERVICE_ROLE_KEY` pour créer un client admin.
    *   Il manque la directive `'server-only'` en tête de fichier.
    *   Si ce fichier est importé par erreur dans un composant client (`"use client"`), le bundler pourrait inclure la clé privée (selon la config env).

### 5.2. Performance
*   Les composants UI dupliqués augmentent inutilement la taille du bundle global si les deux versions sont importées (peu probable ici, mais possible lors de refontes).
*   L'utilisation de Zod côté client et serveur est une bonne pratique, mais la duplication du schéma double le poids du code de validation.

---

## 6. Recommandations & Plan d'Action

Voici les actions priorisées pour assainir la base de code.

### Priorité 1 : Sécurité & Nettoyage (Immédiat)

1.  **Sécuriser le client Supabase Admin** :
    Ajouter `'server-only'` dans `apps/web/src/lib/supabase/server.ts`.

    ```typescript
    // apps/web/src/lib/supabase/server.ts
    import 'server-only'; // <--- AJOUT CRITIQUE

    import { createServerClient } from '@supabase/ssr';
    // ...
    ```

2.  **Supprimer le code mort** :
    Supprimer le dossier `apps/web/src/app/[locale]/admin/(dashboard)/_old-products`.

### Priorité 2 : Unification de la Logique (Court Terme)

1.  **Centraliser les Schémas Zod** :
    Déplacer tous les schémas de validation dans `packages/core`.

    *   **Refactoring :**
        Dans `apps/web/src/lib/validators/user.ts` :
        ```typescript
        // Au lieu de redéfinir :
        // export const userFormSchema = z.object({ ... })

        // Faire :
        export { adminUserSchema as userFormSchema } from '@make-the-change/core/features/admin/schemas';
        ```

### Priorité 3 : Refonte UI & Architecture (Moyen Terme)

1.  **Stratégie "Core-First" pour l'UI** :
    *   Adopter `packages/core` comme source de vérité (Single Source of Truth).
    *   Migrer les améliorations de `apps/web/src/components/ui/data-list.tsx` vers `packages/core`.
    *   Supprimer la version locale dans `apps/web` et mettre à jour les imports.

2.  **Découpler `admin/components`** :
    *   Déplacer les composants génériques (`form-toggle`, `admin-page-layout`) vers `packages/core/src/shared/ui/admin`.
    *   Ne garder dans `apps/web` que les composants purement spécifiques à une page unique.

### Priorité 4 : Maintenance (Continu)

1.  **Alignement des versions** :
    Exécuter une mise à jour des dépendances pour synchroniser TypeScript et les types React sur tout le monorepo.

