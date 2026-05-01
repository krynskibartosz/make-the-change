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

## 7) tsconfig strictness
- `strict` remains enabled.
- `verbatimModuleSyntax` enabled.
- `noUncheckedIndexedAccess` enabled.

## 8) CI and local gates
- Mandatory local checks:
  - `pnpm --filter @make-the-change/web-client type-check`
  - `pnpm --filter @make-the-change/web-client lint`
  - `pnpm --filter @make-the-change/web-client exec tsc --noEmit --noUncheckedIndexedAccess`
- Metrics:
  - `pnpm --filter @make-the-change/web-client ts:metrics`
  - `pnpm --filter @make-the-change/web-client ts:metrics:check`
