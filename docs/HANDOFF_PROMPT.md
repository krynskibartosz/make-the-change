# 🔄 HANDOFF PROMPT - Make the Change

> **Prompt à fournir à une nouvelle session IA pour continuer le développement**

---

## 📋 CONTEXTE DU PROJET

### Identité du Projet
- **Nom**: Make the Change
- **Description**: Plateforme d'investissement biodiversité avec système de récompenses tangibles (points échangeables contre produits)
- **Type**: Monorepo TypeScript multi-plateforme (Web + Mobile)
- **État**: En développement, restructuration architecture en cours

### Technologies Stack Actuel

> ⚠️ **VERSIONS OBLIGATOIRES**
> - Next.js: **16.1** (dernière version stable)
> - Expo SDK: **55** (dernière version stable)
> - React: **19** (déjà utilisé)

**Stack Technique**:
- **Monorepo**: Turborepo + pnpm workspace
- **Backend**: Supabase (PostgreSQL 15.8.1 + Auth + Storage + Realtime)
- **Frontend Web**: Next.js 16.1 + React 19 + Tailwind v4
- **Mobile**: Expo SDK 55 + React Native 0.78 + NativeWind
- **API**: ❌ **tRPC 11 (DETTE TECHNIQUE - À SUPPRIMER EN PRIORITÉ)**
- **Nouvelle API**: Next.js 16.1 Server Actions + Route Handlers + Supabase direct
- **State Management**: @tanstack/react-query 5.85+
- **Validation**: Zod 3.24+
- **i18n**: next-intl 4.3+
- **Testing**: Playwright (E2E) + Vitest (Unit)

---

## 🗄️ INFORMATIONS SUPABASE

### Projet Actif
- **Project Name**: sextant-consulting
- **Project ID**: `ubejpadyznpdeoqkrmxv`
- **Region**: eu-west-2
- **PostgreSQL**: 15.8.1.131
- **Status**: ACTIVE_HEALTHY

### Variables d'Environnement Requises
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ubejpadyznpdeoqkrmxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# Mobile (Expo)
EXPO_PUBLIC_SUPABASE_URL=<same_as_above>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<same_as_above>

# JWT
JWT_SECRET=<jwt_secret>
```

### Schéma Base de Données Principal

**Schéma `public`** (Tables principales pour Make the Change):

| Table | Usage | Colonnes clés |
|-------|-------|---------------|
| `users` | Utilisateurs | id, email, role (admin/super_admin/user), points_balance |
| `projects` | Projets biodiversité | id, name, slug, description, status, featured, funded_amount |
| `products` | Produits boutique | id, name, slug, price_points, producer_id, category_id, stock_quantity |
| `categories` | Catégories produits | id, name, slug, parent_id (hiérarchie) |
| `orders` | Commandes | id, user_id, total_points, status, fulfillment_method |
| `producers` | Producteurs/Partenaires | id, name, user_id |
| `points_transactions` | Historique points | id, user_id, amount, type, order_id |

**Legacy Tables** (Système Sextant Consulting - peut être ignoré):
- `competencies`, `capabilities`, `audit_requests`, `audit_definitions`, etc.

**Extensions PostgreSQL Actives**:
- pgsodium, pg_graphql, supabase_vault, pgcrypto, pgjwt, pg_stat_statements, uuid-ossp, hypopg, index_advisor

### ⚠️ Problèmes Sécurité Identifiés

**CRITIQUES** (13 tables sans RLS):
```sql
administrators, audit_definitions, competencies, capabilities, 
areas, level_decision_rules, circles, competency_level_conversion,
+ 5 tables backup (_areas_rank_text_backup, etc.)
```

**Performance** (13 foreign keys non indexées):
- `administrators.user_id`
- `areas.audit_definition_dbid`
- `audit_requests.audit_definition_dbid`
- etc.

**À corriger en priorité** (voir section TODO ci-dessous).

---

## 📁 STRUCTURE ACTUELLE DU MONOREPO

```
make-the-change/
├── apps/
│   ├── web/                    # ⚠️ À RENOMMER "admin"
│   │   ├── src/
│   │   │   ├── app/[locale]/admin/(dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── users/
│   │   │   │   ├── partners/
│   │   │   │   ├── projects/
│   │   │   │   └── subscriptions/
│   │   │   └── components/
│   │   ├── package.json        # "@make-the-change/web"
│   │   └── Port: 3000
│   │
│   ├── web-client/             # ✅ CRÉÉ (nouvelle app)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx    # Homepage avec exemple Supabase
│   │   │   │   └── globals.css
│   │   │   └── lib/supabase/
│   │   │       ├── server.ts   # createClient() SSR
│   │   │       └── client.ts   # createClient() CSR
│   │   ├── package.json        # "@make-the-change/web-client"
│   │   ├── next.config.js
│   │   ├── .env.example
│   │   └── Port: 3001
│   │
│   └── mobile/                 # ✅ CRÉÉ (nouvelle app)
│       ├── app/
│       │   ├── _layout.tsx
│       │   └── (tabs)/
│       │       ├── _layout.tsx # Bottom tabs navigation
│       │       ├── index.tsx   # Home screen
│       │       ├── projects.tsx
│       │       ├── products.tsx
│       │       └── profile.tsx
│       │       ├── lib/
│       │   └── supabase.ts     # Client avec AsyncStorage
│       ├── package.json        # "@make-the-change/mobile"
│       ├── app.json
│       ├── global.css
│       ├── tailwind.config.js  # NativeWind
│       └── .env.example
│
├── packages/
│   ├── api/                    # tRPC routers (LEGACY)
│   │   ├── src/
│   │   │   ├── routers.ts      # 50+ procedures (auth, admin, products, orders)
│   │   │   └── context.ts      # Auth context (Bearer/Cookie/Allowlist)
│   │   └── package.json        # "@make-the-change/api"
│   │
│   ├── shared/                 # Types et utils partagés
│   │   └── package.json        # "@make-the-change/core"
│   │
│   └── supabase/               # 🔄 À CRÉER
│       ├── types.ts            # Types générés depuis DB
│       ├── server.ts           # Client Next.js SSR
│       ├── client.ts           # Client Next.js CSR
│       ├── native.ts           # Client React Native
│       └── package.json        # "@make-the-change/supabase"
│
├── ARCHITECTURE_DEMO.md        # Doc architecture composable (admin)
├── DESIGN_SYSTEM_2025.md       # Design system complet
├── ARCHITECTURE_MULTI_PLATFORM.md  # ✅ CRÉÉ - Doc nouvelle archi
├── category-management-analysis.md
├── todo.md                     # Backlog détaillé (2860 lignes)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## 🎯 APPLICATIONS - DÉTAILS

### 1. Admin Dashboard (`apps/web` → à renommer `apps/admin`)

**Utilisateurs**: Administrateurs + Partenaires  
**Authentification**: Supabase Auth + Role-based (admin/super_admin/partner)  
**État**: Existant, fonctionnel avec tRPC

**Fonctionnalités Actuelles**:
- ✅ Gestion produits (CRUD, blur hashes, catégories hiérarchiques)
- ✅ Gestion commandes (statuts, refund logic avec points)
- ✅ Gestion utilisateurs
- ✅ Gestion partenaires
- ✅ Gestion projets
- ✅ Dashboard analytics
- ✅ Composants UI réutilisables (DetailView compound pattern)
- ✅ Auto-save avec debouncing
- ✅ Optimistic UI updates

**Architecture Backend (tRPC)**:
```typescript
// packages/api/src/routers.ts
appRouter = {
  auth: { register, login, me }
  admin: {
    products: { list, detail_enriched, create, update, blur }
    orders: { list, detail, update_status, add_note }
    partners: { ... }
    subscriptions: { ... }
  }
}
```

**Middlewares**:
- `isAuthenticated`: Vérifie ctx.user
- `isAdminMw`: Check ADMIN_EMAIL_ALLOWLIST ou DB role

**Design System**:
- Tailwind v4 avec tokens personnalisés
- Base UI (Headless) + Custom components
- Framer Motion animations
- Palette: Émeraude (#059669), Mocha Mousse, Ambre
- WCAG 2.2 compliant

### 2. Web Client (`apps/web-client`)

**Utilisateurs**: Clients finaux  
**État**: Structure créée, à développer  
**Backend**: Supabase direct (pas de tRPC)

**Fonctionnalités Prévues**:

**Public (SEO optimisé)**:
- [ ] Homepage (landing)
- [ ] À propos / Mission
- [ ] Liste projets avec filtres
- [ ] Détail projet (`/projects/[slug]`)
- [ ] Liste produits (boutique)
- [ ] Détail produit (`/products/[slug]`)

**Authentifié**:
- [ ] Dashboard utilisateur
- [ ] Investir dans projets
- [ ] Acheter produits (points)
- [ ] Historique investissements
- [ ] Historique commandes
- [ ] Gestion profil

**Structure Proposée**:
```typescript
app/
├── (marketing)/          // Public - SSR/SSG
│   ├── page.tsx          // Homepage
│   ├── about/
│   ├── projects/
│   │   ├── page.tsx      // Liste
│   │   └── [slug]/       // Détail (metadata SEO)
│   └── products/
│       ├── page.tsx
│       └── [slug]/
│
├── (app)/                // Auth required
│   ├── dashboard/
│   ├── invest/
│   ├── orders/
│   └── profile/
│
└── api/
    └── (custom endpoints si logique complexe)
```

**Exemple Code Supabase**:
```typescript
// Server Component (SEO)
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('projects')
    .select('title, description, image_url')
    .eq('slug', params.slug)
    .single()
  
  return { title: data.title, description: data.description }
}

// Client Component
'use client'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

const supabase = createClient()
const { data } = useQuery({
  queryKey: ['projects'],
  queryFn: () => supabase.from('projects').select('*')
})
```

### 3. Mobile App (`apps/mobile`)

**Utilisateurs**: Clients finaux (iOS + Android)  
**État**: Structure créée avec navigation tabs, à développer  
**Backend**: Supabase direct (même API que web-client)

**Fonctionnalités Prévues**:
- [ ] Authentification (login/register)
- [ ] Écran accueil (projets featured)
- [ ] Liste projets avec détails
- [ ] Liste produits (boutique)
- [ ] Investir / Acheter
- [ ] Profil utilisateur
- [ ] Historique

**Stack Mobile**:
- Expo SDK 55 + Expo Router (file-based routing)
- NativeWind (Tailwind pour React Native)
- Lucide React Native (icons)
- React Query (state)
- AsyncStorage (session persist)

**Navigation Actuelle**:
```typescript
// app/(tabs)/_layout.tsx
<Tabs>
  <Tab name="index" icon={Home} />      // Accueil
  <Tab name="projects" icon={Leaf} />   // Projets
  <Tab name="products" icon={ShoppingBag} /> // Boutique
  <Tab name="profile" icon={User} />    // Profil
</Tabs>
```

**Exemple Code Supabase Mobile**:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)

// Utilisation dans composant
const { data } = useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
    if (error) throw error
    return data
  }
})
```

---

## 🔐 STRATÉGIE SÉCURITÉ (RLS)

### Principe
Toute la sécurité est gérée **côté Supabase via Row Level Security (RLS)**, pas besoin de middleware custom dans l'API.

### Exemples de Policies à Implémenter

```sql
-- Users voient uniquement leurs propres commandes
CREATE POLICY "users_own_orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

-- Users peuvent créer leurs propres commandes
CREATE POLICY "users_create_orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Partners gèrent leurs propres produits
CREATE POLICY "partners_own_products" ON products
  FOR ALL USING (
    producer_id IN (
      SELECT id FROM producers 
      WHERE user_id = auth.uid()
    )
  );

-- Admins accès complet
CREATE POLICY "admins_all_products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Public peut lire produits actifs
CREATE POLICY "public_read_active_products" ON products
  FOR SELECT USING (status = 'active');
```

### Auth Flow

**Web (Next.js)**:
```typescript
// Middleware automatique via @supabase/ssr
// Les cookies sont gérés automatiquement
// User disponible dans ctx via createClient()
```

**Mobile (React Native)**:
```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Session persiste automatiquement dans AsyncStorage
// Auto-refresh token activé

// Check current user
const { data: { user } } = await supabase.auth.getUser()
```

---

## 📊 DÉCISIONS TECHNIQUES PRISES

### 1. Migration tRPC → Supabase Direct

**Raison**: Multi-plateforme (Web + Mobile)

**Avant** (tRPC):
```typescript
// ❌ Complexe avec mobile
apps/web (admin) → tRPC Server
apps/mobile → ??? (tRPC pas fait pour RN)
```

**Après** (Supabase):
```typescript
// ✅ Unifié
SUPABASE (RLS)
    ↓
┌───┴────┬─────────┐
│        │         │
Admin  Web-Client Mobile
```

**Status**: 
- Admin garde tRPC pour l'instant (legacy)
- Web-client et Mobile utilisent Supabase direct
- Migration admin optionnelle plus tard

### 2. Monorepo avec Packages Partagés

**Packages Actuels**:
- `@make-the-change/api` - tRPC routers (legacy)
- `@make-the-change/core` - Types et utils
- `@make-the-change/supabase` - Clients et types générés

**Avantages**:
- Types partagés entre apps
- Logique métier centralisée
- Maintenance simplifiée

### 3. Design System Unifié

**Couleurs Primaires**:
```css
--primary: 160 95% 30%    /* Émeraude #059669 */
--secondary: 25 8% 88%    /* Mocha Mousse */
--accent: 39 96% 52%      /* Ambre doré */
```

**Web**: Tailwind v4 + Base UI (Headless)  
**Mobile**: NativeWind (mêmes classes)  
**Fonts**: Inter (web) / System (mobile)

### 4. SEO Strategy

**Web-client**:
- Landing pages en SSR (Server Components)
- Metadata dynamique via `generateMetadata()`
- Sitemap.xml + robots.txt
- Open Graph tags

**Admin**:
- Pas de SEO nécessaire (app privée)

---

## ✅ CE QUI A ÉTÉ FAIT RÉCEMMENT

### Session Précédente

1. **Analyse approfondie du projet**
   - ✅ Exploration structure monorepo
   - ✅ Analyse base de données Supabase (tables, RLS, extensions)
   - ✅ Review architecture tRPC (routers.ts)
   - ✅ Analyse design system
   - ✅ Identification problèmes sécurité (13 tables sans RLS)

2. **Discussion architecture multi-plateforme**
   - ✅ Clarification besoin mobile
   - ✅ Décision tRPC → Supabase direct
   - ✅ Validation stack technique

3. **Création nouvelles applications**
   - ✅ `apps/web-client/` - Structure complète Next.js 15
     - Client Supabase SSR/CSR
     - Page exemple avec query DB
     - Design system configuré
   - ✅ `apps/mobile/` - Structure complète Expo
     - Navigation tabs
     - Client Supabase + AsyncStorage
     - NativeWind configuré
     - Exemples screens

4. **Documentation**
   - ✅ `ARCHITECTURE_MULTI_PLATFORM.md` - Guide complet
   - ✅ READMEs individuels pour chaque app
   - ✅ `.env.example` pour chaque app

---

## 🚧 TODO - PROCHAINES ÉTAPES

> **⚠️ PRIORITÉ ABSOLUE : DETTE TECHNIQUE**
> 
> **Avant toute nouvelle feature, il faut SUPPRIMER tRPC et migrer vers Next.js 16.1 + Supabase.**
> Ne pas commencer le développement de nouvelles fonctionnalités tant que la dette technique n'est pas résolue.

---

### 🔴 URGENT - Phase 0 : Suppression Dette Technique tRPC (2-3 jours)

#### Objectif
Migrer l'application admin de tRPC 11 vers **Next.js 16.1 Server Actions + Route Handlers + Supabase direct**.

#### Pourquoi c'est critique
- ❌ tRPC complexifie l'architecture multi-plateforme
- ❌ Duplication de logique entre tRPC et futures apps
- ❌ Next.js 16.1 offre des solutions natives meilleures
- ✅ Supabase direct = cohérence avec web-client et mobile
- ✅ Server Actions = DX optimale avec type-safety

#### Plan de Migration tRPC → Next.js 16.1

**Étape 1 : Inventaire des endpoints tRPC (2h)**

Analyser `packages/api/src/routers.ts` et lister tous les endpoints :

```typescript
// Exemple d'inventaire à créer
TRPC_ENDPOINTS_INVENTORY.md
├── auth.register → Server Action
├── auth.login → Server Action
├── auth.me → Server Action
├── admin.products.list → Route Handler GET
├── admin.products.create → Server Action
├── admin.products.update → Server Action
├── admin.orders.list → Route Handler GET
├── admin.orders.update_status → Server Action
└── ... (50+ endpoints)
```

**Étape 2 : Créer architecture Next.js 16.1 (3h)**

Structure proposée :

```typescript
apps/admin/src/
├── app/
│   ├── api/                    // Route Handlers (GET/POST)
│   │   ├── products/
│   │   │   ├── route.ts       // GET /api/products (liste)
│   │   │   └── [id]/route.ts  // GET /api/products/[id]
│   │   ├── orders/
│   │   │   └── route.ts
│   │   └── partners/
│   │       └── route.ts
│   │
│   └── [locale]/admin/(dashboard)/
│       ├── products/
│       │   └── actions.ts      // Server Actions
│       ├── orders/
│       │   └── actions.ts
│       └── partners/
│           └── actions.ts
│
└── lib/
    ├── supabase/
    │   ├── server.ts
    │   └── client.ts
    └── actions/                // Shared Server Actions
        ├── products.ts
        ├── orders.ts
        └── auth.ts
```

**Étape 3 : Migrer endpoint par endpoint (1-2 jours)**

**Exemple : Products List**

Avant (tRPC) :
```typescript
// packages/api/src/routers.ts
export const adminRouter = createRouter({
  products: {
    list: adminProcedure
      .input(z.object({
        categoryId: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(['created_at', 'name', 'price']).optional(),
      }))
      .query(async ({ input, ctx }) => {
        let query = ctx.supabase
          .from('products')
          .select('*, producer(*), category(*)')
        
        if (input.categoryId) {
          query = query.eq('category_id', input.categoryId)
        }
        
        if (input.search) {
          query = query.ilike('name', `%${input.search}%`)
        }
        
        const { data, error } = await query
        if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
        return data
      })
  }
})
```

Après (Next.js 16.1 Route Handler) :
```typescript
// apps/admin/src/app/api/products/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const searchSchema = z.object({
  categoryId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'name', 'price']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Admin check
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (!userData?.role || !['admin', 'super_admin'].includes(userData.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const params = searchSchema.parse({
      categoryId: searchParams.get('categoryId') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
    })
    
    // Query
    let query = supabase
      .from('products')
      .select('*, producer(*), category(*)')
    
    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId)
    }
    
    if (params.search) {
      query = query.ilike('name', `%${params.search}%`)
    }
    
    if (params.sortBy) {
      query = query.order(params.sortBy)
    }
    
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

**Exemple : Product Update (Server Action)**

Avant (tRPC) :
```typescript
// packages/api/src/routers.ts
update: adminProcedure
  .input(z.object({
    id: z.string(),
    name: z.string().optional(),
    price_points: z.number().optional(),
    // ... autres champs
  }))
  .mutation(async ({ input, ctx }) => {
    const { id, ...updates } = input
    const { data, error } = await ctx.supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    return data
  })
```

Après (Server Action) :
```typescript
// apps/admin/src/app/[locale]/admin/(dashboard)/products/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  price_points: z.number().int().positive().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  // ... autres champs
})

export async function updateProduct(formData: z.infer<typeof updateProductSchema>) {
  try {
    // Validation
    const validated = updateProductSchema.parse(formData)
    
    // Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { error: 'Unauthorized' }
    }
    
    // Admin check
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (!userData?.role || !['admin', 'super_admin'].includes(userData.role)) {
      return { error: 'Forbidden' }
    }
    
    // Update
    const { id, ...updates } = validated
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      return { error: error.message }
    }
    
    // Revalidate cache
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
```
[... Truncated for memory restoration ...]
