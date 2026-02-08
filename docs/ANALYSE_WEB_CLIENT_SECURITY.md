# Analyse approfondie : Incohérence critique dans `apps/web-client`

**Date** : 4 février 2026  
**Sujet** : Conflit documentation vs réalité du modèle de sécurité  
**Impact** : Critique

---

## 📋 Documentation vs Réalité

### Documentation officielle (`apps/web-client/README.md`)

```markdown
## 🔒 Security Model
Unlike `apps/web` (Admin), this application does **not** have direct database access.
- ✅ Uses Supabase Row Level Security (RLS) for all data access.
- ❌ No Drizzle ORM / Direct DB connection.
- 🔒 Users can only read/write their own data.
```

### Réalité du code

**L'application utilise MASSIVEMENT Drizzle ORM et accès DB direct :**

---

## 🔍 Preuves concrètes

### 1. Imports directs de `@make-the-change/core/db`

#### Fichier : `apps/web-client/src/app/[locale]/(dashboard)/dashboard/profile/actions.ts`
```typescript
// Ligne 36
const db = await import('@make-the-change/core/db').then((m) => m.db)

// Ligne 118
const db = await import('@make-the-change/core/db').then((m) => m.db)
```

#### Fichier : `apps/web-client/src/app/[locale]/(dashboard)/dashboard/investments/page.tsx`
```typescript
// Ligne 10
import { db } from '@make-the-change/core/db'
import { investments } from '@make-the-change/core/schema'
import { eq, desc } from 'drizzle-orm'

// Ligne 19-31 : Requête complexe
const userInvestments = await db.query.investments.findMany({
  where: eq(investments.user_id, user.id),
  orderBy: [desc(investments.created_at)],
  with: {
    project: {
      columns: {
        name_default: true,
        slug: true,
        status: true,
      }
    }
  }
})
```

#### Fichier : `apps/web-client/src/app/[locale]/products/[slug]/page.tsx`
```typescript
// Ligne 2
import { db } from '@make-the-change/core/db'
import { products } from '@make-the-change/core/schema'
import { eq, and, ne } from 'drizzle-orm'

// Ligne 18-20 : Requête produit
const product = await db.query.products.findFirst({
  where: and(eq(products.slug, slug), eq(products.is_active, true)),
})

// Ligne 43-49 : Requête avec relations
const product = await db.query.products.findFirst({
  where: and(eq(products.slug, slug), eq(products.is_active, true)),
  with: {
    producer: true,
    category: true,
  },
})
```

### 2. `DATABASE_URL` obligatoire

#### Fichier : `packages/core/src/shared/db/client.ts`
```typescript
// Lignes 16-20
function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
  }
  return connectionString
}

// Ligne 25
globalForDb.conn = postgres(getConnectionString(), { prepare: false })
```

### 3. Variables d'environnement incomplètes

#### Fichier : `apps/web-client/.env.example`
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ❌ MANQUE CRITIQUE : DATABASE_URL=postgresql://...
```

---

## 🚨 Nature du problème

### Architecture hybride non documentée

L'application utilise **DEUX modèles d'accès aux données** simultanément :

1. **Supabase Client** (pour l'authentification et certains uploads)
2. **Drizzle ORM + connexion DB directe** (pour la majorité des requêtes de données)

### Schéma de l'architecture réelle

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Server Side    │    │   Database      │
│   (Browser)     │    │   (Next.js)      │    │   (PostgreSQL)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Supabase Client     │                       │
         │    (Auth + Upload)     │                       │
         │───────────────────────▶│                       │
         │                       │ 2. Drizzle ORM        │
         │                       │    (Direct DB)        │
         │                       │──────────────────────▶│
         │                       │                       │
         │ ◀─────────────────────│                       │
         │    (RLS responses)     │                       │
```

---

## 📊 Implications

### Pour le développement

- **Documentation trompeuse** : Les développeurs suivent la doc et tentent d'utiliser uniquement Supabase
- **Erreurs de configuration** : `DATABASE_URL` requis mais non documenté
- **Échecs de démarrage** : L'application ne démarrera pas sans `DATABASE_URL`

### Pour la sécurité

- **Modèle de sécurité incorrect** : La doc prétend "RLS-only" mais le code contourne RLS
- **Accès DB direct** : Possibilité d'accéder à toutes les données sans contraintes RLS
- **Double surface d'attaque** : Deux systèmes d'accès à maintenir

### Pour la production

- **Configuration complexe** : Nécessite connexion DB directe + Supabase
- **Maintenance double** : Deux systèmes d'accès aux données à gérer
- **Monitoring complexe** : Deux sources de données à surveiller

---

## 🎯 Questions stratégiques à résoudre

### 1. Quand utiliser Drizzle ORM vs Supabase ?

**Scénarios actuels identifiés :**

#### Drizzle ORM (utilisé actuellement)
- ✅ Requêtes complexes avec relations
- ✅ Performance côté serveur
- ✅ Type-safe avec TypeScript
- ✅ Transactions complexes
- ✅ Accès direct aux données sans contraintes RLS

#### Supabase Client (documenté mais non utilisé)
- ✅ Sécurité RLS automatique
- ✅ Accès client-side sécurisé
- ✅ Authentification intégrée
- ✅ Real-time subscriptions
- ❌ Moins performant pour requêtes complexes

### 2. Quel modèle d'architecture choisir ?

#### Option A : Architecture hybride (état actuel)
- **Avantages** : Flexibilité maximale, performance serveur
- **Inconvénients** : Complexité double, documentation incorrecte
- **Actions requises** : Documenter l'architecture hybride, ajouter `DATABASE_URL` au `.env.example`

#### Option B : Supabase RLS-only (documenté)
- **Avantages** : Sécurité maximale, simplicité, cohérence doc/code
- **Inconvénients** : Performance limitée, refactor majeur requis
- **Actions requises** : Refactor tout le code Drizzle vers Supabase Client

#### Option C : Drizzle-only (admin-like)
- **Avantages** : Performance, type-safety, simplicité technique
- **Inconvénients** : Sécurité à gérer manuellement, perte bénéfices RLS
- **Actions requises** : Supprimer références Supabase, implémenter sécurité custom

---

## 📋 Actions immédiates requises

### Critique (Blocant)
1. **Ajouter `DATABASE_URL`** dans `apps/web-client/.env.example`
2. **Mettre à jour la documentation** pour refléter l'architecture hybride
3. **Clarifier le modèle de sécurité** dans le README

### Majeur (Important)
1. **Décider de l'architecture cible** (hybride vs RLS-only vs Drizzle-only)
2. **Standardiser les patterns** d'accès aux données
3. **Former l'équipe** sur l'architecture retenue

### Secondaire (À planifier)
1. **Audit de sécurité** complet de l'architecture hybride
2. **Tests de charge** pour comparer performance Drizzle vs Supabase
3. **Documentation détaillée** des best practices par cas d'usage

---

## 🔮 Recommandation technique

**Pour une décision éclairée, consulter un expert architecture sur :**

1. **Performance** : Benchmarks Drizzle vs Supabase pour vos cas d'usage
2. **Sécurité** : Implications RLS vs accès direct pour vos données sensibles
3. **Maintenance** : Coût technique de l'architecture hybride vs unifiée
4. **Évolutivité** : Impact sur le développement futur et l'onboarding

---

## 📝 Notes additionnelles

- **74 fichiers** dans `apps/web-client` contiennent des références à `@make-the-change/core/db`
- **Architecture hybride** fonctionnelle mais non documentée
- **Risque de sécurité** si les développeurs ne comprennent pas le modèle réel
- **Impact déploiement** : Configuration plus complexe que documenté

---

**Analyse réalisée le 4 février 2026 - Basée sur le code source actuel**
