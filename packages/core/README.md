# @make-the-change/core

> Core business logic, database, and shared utilities for Make the CHANGE

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.45-green)](https://orm.drizzle.team/)
[![Feature-Sliced Design](https://img.shields.io/badge/FSD-Architecture-orange)](https://feature-sliced.design/)

---

## 📦 Installation

This package is part of the Make the CHANGE monorepo and is consumed by:
- `apps/web` (Next.js Admin Dashboard)
- `apps/web-client` (Next.js Client App)
- `apps/mobile` (React Native Mobile App)

```typescript
// In your app
import { commerce, investment, admin, auth } from '@make-the-change/core'
import { db } from '@make-the-change/core/db'
import { products, orders } from '@make-the-change/core/schema'
```

---

## 🏗️ Architecture

This package follows **Feature-Sliced Design (FSD)** principles:

```
src/
├── entities/          # Domain models (commerce, investment)
├── features/          # Application features (admin, auth)
└── shared/            # Cross-cutting concerns (db, ui, utils)
```

---

## 📂 Modules

### 🛒 **Entities** (Domain Models)

#### `commerce`
E-commerce domain: products, producers, categories, orders.

```typescript
import { commerce } from '@make-the-change/core'

// Types
type Product = commerce.types.Product
type Order = commerce.types.Order

// Utils
const price = commerce.utils.calculatePrice(product)
```

#### `investment`
Investment domain: projects, subscriptions, points system.

```typescript
import { investment } from '@make-the-change/core'

// Calculate loyalty points
const points = investment.pointsCalculator.calculate({
  subscriptionType: 'premium',
  amount: 100,
  duration: 12
})
```

---

### 🎯 **Features** (Application Logic)

#### `admin`
Admin panel validation schemas (Zod).

```typescript
import { admin } from '@make-the-change/core'

// Product form schema
const validated = admin.schemas.productSchema.parse(formData)
```

#### `auth`
Authentication types and utilities.

```typescript
import { auth } from '@make-the-change/core'

// Check permissions
const canEdit = auth.utils.hasPermission(user, 'products:write')
```

---

### 🔧 **Shared** (Infrastructure)

#### `db` (Database) 🔒 **Server-Only**

**Drizzle ORM singleton** with lazy-loading schema.

```typescript
// ✅ Server-side only (API routes, Server Components, Server Actions)
import { db } from '@make-the-change/core/db'

const products = await db.query.products.findMany()

// ❌ Browser/React Native - will throw error
import { db } from '@make-the-change/core/db' // Error: DB access forbidden
```

**Protection:**
- ✅ `server-only` package prevents client-side imports
- ✅ Conditional exports block React Native/Browser

#### `schema` (Database Schema)

Database table definitions (separated from client for circular dependency prevention).

```typescript
import { products, orders, subscriptions } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'

await db.select().from(products).where(eq(products.id, '123'))
```

#### `ui` (Components)

Shared UI components (Base UI + custom).

```typescript
import { Dialog, Select } from '@make-the-change/core/ui'

// Use in React components
<Dialog title="Confirm">...</Dialog>
```

#### `utils` (Utilities)

Cross-cutting utilities: formatters, validators, helpers.

```typescript
import { formatters, validators } from '@make-the-change/core/shared'

const price = formatters.formatCurrency(1234.56, 'EUR') // "1 234,56 €"
const valid = validators.isValidEmail('user@example.com')
```

---

## 🎨 Design System

### CSS Variables

```typescript
// Import global CSS
import '@make-the-change/core/css'
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import { sharedConfig } from '@make-the-change/core/tailwind.config'

export default {
  presets: [sharedConfig],
  // Your overrides...
}
```

**Custom Palette:**
- `olive`: #6b7c32 (primary brand color)
- `honey`: #d4a574 (accent)
- `earth`: #8b6914 (neutral)
- `ocean`: #4a90a4 (info)

---

## 🗄️ Database

### Schema Overview

**Source of truth**: `src/shared/db/schema.ts` (Drizzle ORM TypeScript)

**Architecture multi-schémas:**
- `public`: Tables de référence (countries, languages, profiles)
- `commerce`: Produits, catégories, commandes, abonnements
- `investment`: Projets, producteurs, investissements, espèces
- `content`: Blog, médias, traductions
- `identity**: Rôles utilisateurs, consentements, sessions
- `finance**: Journal comptable, comptes
- `ledger**: Transactions de points

**Principes clés:**
- Type-safe avec TypeScript
- RLS activé sur toutes les tables
- Colonnes i18n en JSONB
- Audit trail automatique
- Indexation optimisée

### Usage

```typescript
import { db } from '@make-the-change/core/db'
import { producers, projects } from '@make-the-change/core/db/schema'

// Requêtes type-safe
const result = await db.select().from(producers)
```

---

## 🌍 Internationalization

```typescript
import { i18n } from '@make-the-change/core/i18n'

// Supported locales
const locales = ['fr', 'en', 'nl']

// Locale data
import fr from '@make-the-change/core/locales/fr.json'
```

---

## 📦 Exports

```json
{
  ".": "./src/index.ts",                    // Main exports (FSD modules)
  "./ui": "./src/shared/ui/index.ts",       // UI components
  "./i18n": "./src/shared/i18n.ts",         // i18n config
  "./locales/*": "./locales/*.json",        // Translation files
  "./db": {                                 // Database (protected)
    "react-native": "./forbidden.ts",
    "browser": "./forbidden.ts",
    "default": "./client.ts"
  },
  "./schema": "./src/shared/db/schema.ts",  // DB schema (separate)
  "./css": "./src/shared/ui/globals.css",   // Global CSS
  "./tailwind.config": "./tailwind.config.ts" // Tailwind config
}
```

---

## 🔒 Security

### Server-Only Protection

```typescript
// packages/core/src/shared/db/client.ts
import 'server-only' // Prevents client-side imports
```

### Conditional Exports

```typescript
// Browser/React Native trying to import DB:
import { db } from '@make-the-change/core/db'
// ❌ Error: "Database access is forbidden in browser/React Native"
```

---

## 🛠️ Development

### Scripts

```bash
pnpm build         # Compile TypeScript
pnpm dev           # Watch mode
pnpm type-check    # Type checking
pnpm lint          # Biome linting
```

### Stack

- **TypeScript** 5.7
- **Drizzle ORM** 0.45 (PostgreSQL)
- **Zod** 3.24 (validation)
- **Base UI** 1.1 (headless components)
- **Lucide React** (icons)

---

## 📚 Best Practices

### ✅ Do

```typescript
// Import specific modules
import { commerce } from '@make-the-change/core'

// Use DB in server-side code only
import { db } from '@make-the-change/core/db' // In API routes
```

### ❌ Don't

```typescript
// Import DB in client components
'use client'
import { db } from '@make-the-change/core/db' // ❌ Error!

// Mix concerns
import { commerce, admin } from '@make-the-change/core'
// Use admin schemas in commerce logic ❌
```

## 📝 Contributing

This package follows:
- **Feature-Sliced Design** architecture
- **TypeScript strict mode**
- **Biome** for linting/formatting

**File naming:**
- `index.ts` - Public exports
- `types.ts` - TypeScript types
- `utils.ts` - Helper functions

---

## 📄 License

Private package - Part of Make the CHANGE monorepo.

---

**Maintained by:** Make the CHANGE Team  
**Version:** 0.1.0
