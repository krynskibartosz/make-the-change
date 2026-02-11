# Analyse de Déploiement Vercel

Cette analyse vérifie la compatibilité des projets `apps/web-client` et `apps/web` pour un déploiement sur Vercel.

## 1. Structure Globale (Monorepo)

Le projet est structuré comme un monorepo moderne utilisant `pnpm` et `Turborepo`. Cette structure est **nativement supportée et optimisée pour Vercel**.

*   **Gestionnaire de paquets** : `pnpm` est utilisé. Vercel détectera automatiquement le fichier `pnpm-lock.yaml` à la racine et utilisera pnpm pour l'installation des dépendances.
*   **Workspaces** : Les dossiers `apps/*` et `packages/*` sont correctement définis dans le `package.json` racine.

## 2. Analyse par Projet

### A. `apps/web-client`

*   **Type** : Application Next.js.
*   **Configuration (`next.config.js`)** :
    *   ✅ `transpilePackages: ['@make-the-change/core']` est présent. C'est essentiel pour que Vercel puisse compiler le code TypeScript importé depuis votre dossier `packages/`.
*   **Dépendances (`package.json`)** :
    *   ✅ Utilise `"@make-the-change/core": "workspace:*"` pour assurer que la dernière version locale du code partagé est utilisée lors du build.
*   **Scripts** :
    *   Le script de build utilise l'option `--turbo`. Bien que Turbopack soit supporté, si vous rencontrez des erreurs inattendues lors du build sur Vercel, essayez de retirer ce flag temporairement.

### B. `apps/web`

*   **Type** : Application Next.js.
*   **Configuration (`next.config.js`)** :
    *   ✅ Contient également `transpilePackages: ['@make-the-change/core']`, assurant la compatibilité avec les paquets partagés.
*   **Dépendances (`package.json`)** :
    *   ✅ Dépendances workspace correctement configurées.

## 3. Recommandations de Configuration Vercel

Lors de l'importation de vos projets dans Vercel, utilisez les paramètres suivants :

### Pour `web-client`
*   **Framework Preset** : Next.js
*   **Root Directory** : `apps/web-client`
*   **Build Command** : Laisser par défaut (ou `cd ../.. && npx turbo run build --filter=web-client` si vous voulez explicitement utiliser Turbo, mais le défaut Next.js fonctionne généralement très bien).
*   **Output Directory** : `.next` (Défaut)

### Pour `web`
*   **Framework Preset** : Next.js
*   **Root Directory** : `apps/web`
*   **Build Command** : Laisser par défaut.
*   **Output Directory** : `.next` (Défaut)

## 4. Points d'Attention Critiques ⚠️

1.  **Version Node.js** :
    *   Votre projet racine spécifie `"node": ">=20.0.0"`.
    *   **Action requise** : Dans les paramètres de chaque projet sur Vercel (**Settings > General > Node.js Version**), assurez-vous de sélectionner **Node.js 20.x** (ou plus récent). Si vous laissez la version par défaut (qui peut être 18.x sur d'anciens projets), le build échouera.

2.  **Variables d'Environnement** :
    *   Les fichiers `.env` ne sont pas commités (ce qui est une bonne pratique).
    *   **Action requise** : Vous devez ajouter manuellement toutes les variables d'environnement nécessaires (ex: `NEXT_PUBLIC_SUPABASE_URL`, clés API Stripe, etc.) dans l'onglet **Settings > Environment Variables** de chaque projet Vercel.

3.  **Build Ignore Command (Optionnel mais recommandé)** :
    *   Pour économiser des builds inutiles, vous pouvez configurer la "Ignored Build Step" sur Vercel pour utiliser `npx turbo-ignore`. Cela permet à Vercel de ne pas reconstruire l'application si les changements ne concernent que des fichiers non liés (comme la documentation).

## Conclusion

Les deux projets sont **bien configurés** pour un déploiement sur Vercel. La structure monorepo est propre et les configurations Next.js gèrent correctement les dépendances internes. Le succès du déploiement dépendra principalement de la configuration correcte des **variables d'environnement** et de la **version de Node.js** dans le tableau de bord Vercel.
