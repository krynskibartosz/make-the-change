# 🚀 Stack Technique & Outils

> **État**: À jour (Février 2026)
> **Alignement**: ADR-0001 (Architecture Monorepo)

Ce document détaille les choix techniques, les versions exactes et les configurations critiques du projet Make the CHANGE.

---

## 🏗️ Architecture Globale

**Monorepo**: [Turborepo v2.3](https://turbo.build/) + [pnpm workspaces](https://pnpm.io/)
**Runtime**: Node.js 22 LTS (Web/API)
**Pattern**: Full-stack TypeScript + tRPC (bientôt Server Actions)

### Structure Workspace
- `apps/web`: Admin Dashboard + E-commerce (Next.js 15)
- `apps/mobile`: Application Mobile (Expo 53)
- `packages/api`: Backend logic & Routers (tRPC)
- `packages/shared`: Shared types, constants, utilities
- `packages/db`: Database schema (Supabase)

---

## 🛠️ Stack Technique Détaillée

### PHASE 1 - MVP Stack (0€/mois)

#### Web Dashboard Minimal (Vercel Free)
```yaml
Framework: Next.js 15.4 App Router + React Server Components
Hosting: Vercel Hobby (gratuit 100GB bandwidth)
Language: TypeScript 5.9+ (strict mode)
UI Framework: Base UI (Headless) + Tailwind CSS v4 + Custom Components
Forms: TanStack Form (simple)
Payment: Stripe Elements v3 + Stripe Subscriptions (dual billing)
Billing: Stripe Customer Portal + Subscription management
Analytics: Vercel Analytics (gratuit)
```

#### Backend Bootstrap (Gratuit)
```yaml
API Framework: tRPC v11.5.0 (type-safe)
Runtime: Vercel Edge Functions (gratuit 100GB)
Database: Supabase Free Tier (500MB PostgreSQL)
Authentication: Supabase Auth (gratuit)
Billing: Stripe Subscriptions (monthly) + Payment Intents (annual)
Customer Portal: Stripe Customer Portal integration
Webhooks: Stripe webhooks pour subscription lifecycle (route handler en Node runtime, pas Edge)
Storage: Supabase Storage (1GB gratuit)
Cache: Browser cache + PostgreSQL views
Email: Resend gratuit (100 emails/jour)
```

### PHASE 2 - Growth Stack (145€/mois)

#### Mobile App Production
```yaml
Build System: EAS Build (Expo)
Distribution: App Store + Google Play
Performance: React Native optimizations
Offline: TanStack Query offline support
Push: Expo Push Notifications
Analytics: Expo Analytics + Custom tracking
```

#### Web Platform Enhanced
```yaml
Hosting: Vercel Pro (20€/mois)
Performance: Edge Functions scaling
CDN: Vercel Edge Network worldwide
Monitoring: Advanced error tracking
SEO: Next.js 15.1 App Router optimizations
```

#### Backend Production
```yaml
Database: Supabase Pro (25€/mois)
Storage: Vercel Blob (50€/mois)
Functions: Scaling serverless (50€/mois)
Cache: PostgreSQL + Edge caching
Queue: Background jobs via Vercel cron
Monitoring: Uptime + performance alerts
```

### PHASE 3 - Scale Stack (500-2000€/mois)

#### Enterprise Infrastructure
```yaml
Multi-region deployment
Advanced caching layers
Microservices architecture
Auto-scaling infrastructure
Enterprise security & compliance
Advanced monitoring & alerting
```

#### Development Stack
```yaml
Package Manager: pnpm v9+ (fastest, required)
Node Version: 22 LTS (latest stable)
TypeScript: 5.9+ (strict mode)
Database: PostgreSQL 15 (local + production)
Monorepo: Turborepo v2 (optimisation builds)
```

## 🎯 Justification Choix Technique Web

### Next.js 15.1 vs TanStack Start
**DÉCISION FINALE : Next.js 15.1**

#### Pourquoi Next.js 15.1 ?
```yaml
✅ Maturité: Framework stable, production-ready
✅ Écosystème: Vaste communauté, packages, ressources
✅ Expertise équipe: Connaissance approfondie du framework
✅ Vercel Integration: Optimisation native déploiement gratuit
✅ App Router: Routing avancé avec Server Components
✅ Performance: Turbopack, optimisations intégrées
✅ Documentation: Complète et maintenue
```

#### Pourquoi pas TanStack Start ?
```yaml
❌ Beta Status: Encore en développement (v1.0 pas sortie)
❌ Écosystème limité: Communauté et resources moins établies  
❌ Courbe d'apprentissage: Framework moins connu équipe
❌ Risque: Changements breaking potentiels en beta
❌ Support: Moins de ressources d'aide disponibles
```

**Cette décision élimine tout risque technique et assure une base solide pour le projet.**

## 🔧 Outils de Développement

### Code Quality
```yaml
Linting: ESLint v9 + @typescript-eslint
Formatting: Prettier v3
Type Checking: TypeScript strict mode
Git Hooks: Husky v9 + lint-staged
Pre-commit: Lint + format + type check
```

### Testing Stack
```yaml
Unit Tests: Vitest v2 (ultra-fast)
Component Tests: React Testing Library
E2E Tests: Playwright v1.45 (web) + Maestro (mobile)
Coverage: c8 (intégré dans Vitest)
Mocking: MSW (Mock Service Worker)
```

### Build & Deploy
```yaml
Build Tool: Turbo v2 (monorepo optimization)
Mobile Build: EAS Build (Expo)
Web Hosting: Vercel Pro
Database: Supabase Pro (production)
CDN: Vercel Edge Network
CI/CD: GitHub Actions
```

## 📱 Mobile Stack Détaillé

### Configuration Expo
```typescript
// app.config.ts
export default {
  expo: {
    name: "Make the CHANGE",
    slug: "make-the-change",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#4ade80"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.makethechange.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#4ade80"
      },
      package: "com.makethechange.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-maps"
    ]
  }
};
```

### NativeWind Configuration
```javascript
// tailwind.config.js (mobile)
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#059669',    // Make the CHANGE green
        secondary: '#D97706',  // Honey amber
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
      },
    },
  },
  plugins: [],
};
```

## 🌐 Web Stack Détaillé

### Vercel Edge Functions Configuration
```typescript
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "edge"
    }
  },
  "rewrites": [
    {
      "source": "/api/trpc/:path*",
      "destination": "/api/trpc/:path*"
    }
  ]
}
```

### Pattern Doré: RSC + TanStack Query + revalidateTag
```tsx
// app/projects/page.tsx (Server Component - RSC)
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import { ProjectsClient } from '@/components/projects-client'
import { cookies, headers } from 'next/headers'
import { appRouter } from '@/server/routers/app'
import { createTRPCContext } from '@/server/trpc'

export const revalidate = 60
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'

export default async function ProjectsPage() {
  // Préchargement via tRPC côté serveur (type-safe, pas d'overfetch)
  const ctx = await createTRPCContext({ cookies: cookies(), headers: headers() })
  const caller = appRouter.createCaller(ctx)
  const initial = await caller.projects.list({ q: '' })

  // Option Hydration (si vous prévoyez d'utiliser Query côté client)
  const qc = new QueryClient()
  await qc.prefetchQuery({ queryKey: ['projects', { q: '' }], queryFn: () => initial })
  const state = dehydrate(qc)

  return (
    <HydrationBoundary state={state}>
      <ProjectsClient initialData={initial} />
    </HydrationBoundary>
  )
}

// components/projects-client.tsx (Client Component)
'use client'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'

export function ProjectsClient({ initialData }: { initialData: any[] }) {
  const { data } = useQuery({
    queryKey: ['projects', { q: '' }],
    queryFn: () => trpc.projects.list.query({ q: '' }),
    initialData,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
  return <ProjectsList projects={data ?? []} />
}

// app/projects/actions.ts (Server Action) – Invalidation serveur Next
'use server'
import { revalidateTag } from 'next/cache'
import { appRouter } from '@/server/routers/app'
import { createTRPCContext } from '@/server/trpc'

export async function createProjectAction(input: any) {
  const ctx = await createTRPCContext()
  const caller = appRouter.createCaller(ctx)
  await caller.admin.projects.create(input)
  revalidateTag('projects') // Taguez aussi vos fetch RSC avec { tags: ['projects'] }
}

// Côté client après mutation via tRPC + Query
// queryClient.invalidateQueries({ queryKey: ['projects'] }) // garde le cache client cohérent
```

### Base UI & Custom UI Configuration
```typescript
// packages/core/src/shared/ui/README.md
// Voir documentation interne pour l'usage des composants Base UI.
```
