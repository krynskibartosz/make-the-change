# Types TypeScript & Base de Données (2026)

> Historique 2024/2025 — à revalider en 2026.

## ✅ Source de vérité actuelle
Le schéma **Drizzle** est la source de vérité :
- `packages/core/src/shared/db/schema.ts`
- Types inférés via Drizzle (`InferSelectModel`, `InferInsertModel`)

## ✅ Utilisation recommandée
```ts
import type { InferSelectModel } from 'drizzle-orm'
import { products } from '@make-the-change/core/schema'

export type Product = InferSelectModel<typeof products>
```

## Supabase “generated types” (optionnel)
Si un besoin externe l’exige (outils BI, scripts data), on peut **générer** des types Supabase, mais ils ne sont **pas** utilisés dans l’app aujourd’hui.

```bash
supabase gen types typescript --project-id <PROJECT_ID> > /tmp/supabase-types.ts
```

## CI/CD (optionnel)
- Ajouter uniquement si la génération est nécessaire.
- Conserver ces fichiers hors du runtime applicatif.

## Résumé
- **Drizzle = source de vérité**
- **Supabase types = optionnel / non utilisé**
