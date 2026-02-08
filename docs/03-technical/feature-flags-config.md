# Feature Flags — État actuel (2026)

> Historique 2024/2025 — à revalider en 2026.

## Statut
Aucun système de feature flags n'est implémenté dans le repo pour l'instant.

## Recommandation (si besoin ultérieur)
- **Server-only** : garder la logique côté serveur (Server Actions / RSC), sans hooks client.
- **Source de vérité** : table `feature_flags` en DB (Supabase) ou provider dédié.
- **Emplacement suggéré** : `packages/core/src/shared/feature-flags` si on l’ajoute.
- **Sécurité** : journaliser les modifications, restreindre par rôle admin, éviter l’exposition `NEXT_PUBLIC_*`.

## Exemple minimal (conceptuel)
```ts
// Pseudo-code (non présent dans le repo)
// const isEnabled = await flags.isEnabled('gamification', userId)
```

Quand ce module sera réellement implémenté, documenter ici les clés, tables et flux.
