# TypeScript/React Conventions - web-client

Date: 2026-02-19
Scope: `apps/web-client`

## 1) Type-first policy
- Use `type` by default for props, DTOs, unions and mapped utility types.
- Use `interface` only when explicit object extension/merging is required.

## 2) React component typing
- Prefer typed props function components (`function Component(props: Props)`) over `React.FC` for new/edited files.
- Keep `children` explicit in props when needed.

## 3) Supabase query typing
- Prefer narrow local row types near query usage.
- Avoid `as any` and `@ts-ignore`; use `unknown` + type guards/casts to specific shapes.
- Handle joins defensively (`Array.isArray(join) ? join[0] : join`).

## 4) Static config safety
- Use `satisfies` for static config/maps to validate shape without losing literal inference.
- Current example: home marketing view model and section configuration.

## 5) Utility types adoption
- Introduce `ComponentProps*`, `Extract`, `Exclude`, `NoInfer` only where they reduce duplication or remove unsafe casts.
- Avoid speculative type complexity.

## 6) JSON-LD and security lint rules
- Do not use `dangerouslySetInnerHTML` for structured data.
- Prefer direct script children:

```tsx
<script type="application/ld+json">{JSON.stringify(payload)}</script>
```

## 7) Before/After examples from this repo
- `ComponentProps*` + native prop passthrough:
  - Before: custom props duplicated manually, no native element passthrough.
  - After: `src/components/ui/page-hero.tsx` and `src/components/ui/section-container.tsx` use `ComponentPropsWithoutRef` + `Omit` for reusable typed wrappers.
- Avoid HTML attribute collisions when extending intrinsic props:
  - Before: `title` prop conflict on section wrappers possible.
  - After: `src/app/[locale]/(marketing)/_features/marketing-cta-band.tsx` uses `Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'title'>`.
- Utility types with real value (not cosmetic):
  - Before: ad-hoc query parsing.
  - After: `src/app/[locale]/(marketing)/products/_features/query-state.ts` uses `Extract`, `Exclude`, `NoInfer` for parse/build safety and fallback constraints.
- JSON-LD without dangerous HTML injection:
  - Before: raw HTML injection for script tags.
  - After: `src/app/[locale]/(marketing)/products/[id]/product-details.tsx` and `src/app/[locale]/(marketing)/projects/[slug]/project-details.tsx` render JSON-LD via `<script>{json}</script>`.

## 8) tsconfig strictness
- `strict` remains enabled.
- `verbatimModuleSyntax` enabled.
- `noUncheckedIndexedAccess` enabled.

## 9) CI and local gates
- Mandatory local checks:
  - `pnpm --filter @make-the-change/web-client type-check`
  - `pnpm --filter @make-the-change/web-client lint`
  - `pnpm --filter @make-the-change/web-client exec tsc --noEmit --noUncheckedIndexedAccess`
- Metrics:
  - `pnpm --filter @make-the-change/web-client ts:metrics`
  - `pnpm --filter @make-the-change/web-client ts:metrics:check`

## 10) Canonical examples in repo
- Home view-model extraction: `src/app/[locale]/(marketing)/(home)/_features/home.view-model.ts`
- Home page wiring: `src/app/[locale]/(marketing)/(home)/page.tsx`
- Dashboard save/status typing cleanup:
  - `src/app/[locale]/(dashboard)/_features/lib/hooks/use-optimistic-auto-save.ts`
  - `src/app/[locale]/(dashboard)/_features/save-status-indicator.tsx`
- Supabase query cleanup examples:
  - `src/app/[locale]/(marketing)/products/_features/get-products.ts`
  - `src/app/[locale]/(dashboard)/dashboard/orders/page.tsx`
