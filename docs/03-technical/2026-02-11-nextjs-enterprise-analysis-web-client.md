# Analyse "Next.js at Enterprise Level" appliquée à `apps/web-client`

Date: 11 février 2026  
Périmètre: `apps/web-client` (Next.js 16.1, App Router, Supabase, Stripe)

## Résumé exécutif

`web-client` est déjà bien structuré pour un produit moderne (App Router, RLS Supabase, Server Actions, webhook Stripe signé), mais il n'est pas encore "enterprise-ready" sur trois axes majeurs: cache/latence, observabilité, et sécurité opérationnelle.

Les deux écarts les plus importants par rapport à l'article:

1. Le rendu public est fortement couplé à l'authentification (sessions Supabase lues dans des layouts larges), ce qui réduit fortement les gains CDN/cache.
2. Il manque une couche d'observabilité/SLO exploitable (instrumentation, métriques, alerting, traçage de bout en bout).

## Méthode

Analyse réalisée à partir du code et de la config du repo:

- `apps/web-client/src/app/[locale]/layout.tsx`
- `apps/web-client/src/app/[locale]/(marketing)/layout.tsx`
- `apps/web-client/src/app/[locale]/(marketing-no-footer)/layout.tsx`
- `apps/web-client/src/proxy.ts`
- `apps/web-client/src/lib/supabase/admin.ts`
- `apps/web-client/src/app/api/**/*.ts`
- `apps/web-client/src/features/**/actions*.ts`
- `.github/workflows/*.yml`
- `apps/web-client/package.json`
- `apps/web-client/next.config.js`

Indicateurs rapides observés:

- 52 pages, 11 layouts, 7 route handlers API.
- 10 fichiers de Server Actions.
- 72 appels `createClient()`, 39 appels `auth.getUser()`.
- 20 appels `revalidatePath()`.
- 0 occurrence de `Cache-Control` explicite côté `apps/web-client/src`.
- 0 instrumentation OTel/Sentry détectée côté web-client.

## Ce qui est déjà aligné avec l'article

- Gestion de session via `proxy.ts` compatible Next.js 16:
  - `apps/web-client/src/proxy.ts`
- Modèle RLS côté produit client (pas d'accès SQL direct depuis l'app):
  - `apps/web-client/README.md`
  - `apps/web-client/src/lib/supabase/server.ts`
- Validation d'entrées sur plusieurs endpoints critiques (Zod):
  - `apps/web-client/src/app/api/products/route.ts`
  - `apps/web-client/src/app/api/payments/create-intent/route.ts`
  - `apps/web-client/src/app/api/payments/mobile-sheet/route.ts`
- Webhook Stripe en runtime Node avec vérification de signature:
  - `apps/web-client/src/app/api/webhooks/stripe/route.ts`

## Gaps prioritaires (article vs web-client)

| Priorité | Gap | Preuves | Impact | Action recommandée |
|---|---|---|---|---|
| P0 | Rendu public trop dynamique | `apps/web-client/src/app/[locale]/layout.tsx`, `apps/web-client/src/app/[locale]/(marketing)/layout.tsx`, `apps/web-client/src/app/[locale]/(marketing-no-footer)/layout.tsx` | Cache hit ratio faible, TTFB plus élevé, coût infra plus élevé sous charge | Découpler auth du shell marketing. Garder un layout public cacheable et déplacer la personnalisation utilisateur dans les zones authentifiées ou un fragment client lazy. |
| P0 | Pas de politique cache explicite sur APIs publiques | `apps/web-client/src/app/api/projects/route.ts`, `apps/web-client/src/app/api/projects/featured/route.ts`, `apps/web-client/src/app/api/products/route.ts` | Pas de contrôle clair CDN/edge, latence variable | Ajouter `Cache-Control` (`s-maxage`, `stale-while-revalidate`) sur les endpoints publics non personnalisés. |
| P1 | Observabilité insuffisante | Absence d'`instrumentation.ts`, absence de stack de traces/métriques dans `apps/web-client` | SLO non pilotables, diagnostic incident lent | Ajouter instrumentation OpenTelemetry + logs structurés + correlation id + dashboard de base (latence, erreurs, saturation). |
| P1 | Fallback dangereux sur client admin Supabase | `apps/web-client/src/lib/supabase/admin.ts` | Si clé service absente, fallback anon silencieux, comportements incohérents et perte de traçabilité | Supprimer le fallback et faire échouer immédiatement si `SUPABASE_SERVICE_ROLE_KEY` est absente. |
| P1 | Route API utilisant un client navigateur côté serveur | `apps/web-client/src/app/api/projects/route.ts` importe `@/lib/supabase/client` | Risque d'écart auth/cookies/comportement selon runtime | Remplacer par `@/lib/supabase/server` dans route handler. |
| P1 | Protection anti-abus incomplète sur endpoints sensibles | `apps/web-client/src/app/api/payments/create-intent/route.ts`, `apps/web-client/src/app/api/payments/mobile-sheet/route.ts`, `apps/web-client/src/app/api/webhooks/stripe/route.ts` | Risque volumétrique et coût induit (spam, brute force, saturation) | Ajouter rate limiting + quotas + instrumentation dédiée paiements/webhooks. |
| P2 | CI/CD orienté build mais faible sur qualité runtime | `.github/workflows/copilot-setup-steps.yml`, absence de tests web-client actifs | Régressions détectées tardivement | Ajouter smoke E2E critiques et checks PR bloquants sur parcours paiement/auth. |
| P2 | Configuration de déploiement ambiguë pour `web-client` | `vercel.json` racine (`outputDirectory: apps/web/.next`) | Risque de confusion/mauvais artefact en déploiement multi-app | Clarifier un projet Vercel dédié `web-client` ou documenter explicitement la stratégie de déploiement mono/multi-projets. |

## Roadmap recommandée (30 jours)

## J+7 (quick wins à fort ROI)

- Corriger `createAdminClient()` pour supprimer le fallback anon.
- Migrer `apps/web-client/src/app/api/projects/route.ts` vers le client serveur.
- Ajouter des headers cache sur `GET /api/projects`, `GET /api/projects/featured`, `GET /api/products`.
- Poser un `x-request-id` systématique (proxy/route handlers) et log structuré minimal.

## J+14 (stabilité et pilotage)

- Introduire une instrumentation de base:
  - latence p50/p95/p99 API publiques,
  - taux d'erreur 5xx,
  - latence Stripe webhook,
  - taux de succès `payment_intent` et `mobile-sheet`.
- Définir 3 SLO minimum:
  - disponibilité API publique,
  - latence p95 pages marketing,
  - succès des paiements.

## J+30 (architecture enterprise pragmatique)

- Refactor layout:
  - shell marketing cacheable,
  - personnalisation user isolée.
- Ajouter rate limiting robuste pour endpoints sensibles (paiement/webhook).
- Ajouter tests automatisés de non-régression:
  - login/logout,
  - création PaymentIntent,
  - webhook signature invalid/valid,
  - affichage pages marketing principales.

## Décisions d'architecture à formaliser (ADR)

- ADR-1: Politique de cache HTTP/CDN par type de route (public/auth/sensible).
- ADR-2: Contrat d'observabilité (logs, traces, métriques, SLO, alertes).
- ADR-3: Stratégie de rendu Next.js (public cacheable vs zones auth dynamiques).
- ADR-4: Politique secrets et fail-fast (interdiction des fallbacks sur clés critiques).

## Checklist opérationnelle

- [ ] `createAdminClient()` sans fallback anon.
- [ ] `api/projects` migré sur client serveur.
- [ ] Headers `Cache-Control` en production sur endpoints publics.
- [ ] Instrumentation + dashboards + alertes minimales.
- [ ] Rate limiting sur `/api/payments/*` et `/api/webhooks/stripe`.
- [ ] 1 suite E2E smoke active en CI.
- [ ] SLO documentés dans `docs/05-operations`.

## Conclusion

Par rapport à l'article, la base technique de `web-client` est saine, mais l'effort "enterprise" doit se concentrer sur la dissociation rendu public/auth, la stratégie cache explicite, et l'observabilité pilotée par SLO.  
Ce sont les trois leviers qui amélioreront le plus rapidement la fiabilité perçue, la performance et le coût à charge croissante.
