# Refactoring Phase R8 — Points / Wallet / Credits Impact

**Date:** 2026-05-08  
**Scope:** `apps/web-client/src/`  
**Objective:** Rename the `points` field to `impactCreditsBalance` throughout mock types, mock data, and UI components. Replace the deprecated `formatPoints()` formatter with `formatImpactCredits()` where applicable. Clean up local variable names (`userPoints`, `[points, setPoints]`) in UI components.

---

## Summary

| Category | Changes |
|----------|---------|
| Type definitions | 1 field renamed in `Profile` |
| Mock data | 2 files updated (`mock-viewer.ts`) |
| UI components | 5 files updated |
| Formatter migration | 3 call sites migrated to `formatImpactCredits` |
| Intentionally untouched | 3 zones (see below) |

---

## Files Modified

### `src/lib/mock/types.ts`
- `Profile.points: number` → `Profile.impactCreditsBalance: number`

**Classification:** [MIGRATION_COMPLETE]

---

### `src/lib/mock/mock-viewer.ts`
- `EXISTING_VIEWER_PROFILE`: `points: 2450` → `impactCreditsBalance: 2450`
- `PUBLIC_PROFILE_DIRECTORY` (8 entries): `points` → `impactCreditsBalance`
- `buildGenericProfile()`: `points: 120` → `impactCreditsBalance: 120`
- `getMockProfile()`: `points: getMockImpactPoints(...)` → `impactCreditsBalance: getMockImpactPoints(...)`
- `getMockPublicProfile()`: 5 lines — `directoryEntry.points` → `directoryEntry.impactCreditsBalance`

**Classification:** [MIGRATION_COMPLETE]

---

### `src/app/[locale]/(tabs)/profile/_features/authenticated-profile.tsx`
- `profile?.points || 2450` → `profile?.impactCreditsBalance ?? 2450`

**Classification:** [MIGRATION_COMPLETE]

---

### `src/app/[locale]/(screens)/profile/[id]/mock-public-profile.tsx`
- `profile.points.toLocaleString('fr-FR')` → `profile.impactCreditsBalance.toLocaleString('fr-FR')`

**Classification:** [MIGRATION_COMPLETE]

---

### `src/app/[locale]/(site)/(home)/_api/home.view-model.ts`
- Import: `formatPoints` → `formatImpactCredits`
- `formatPoints(pointsGeneratedState.value)` → `formatImpactCredits(pointsGeneratedState.value)`

**Classification:** [MIGRATION_COMPLETE]

---

### `src/app/[locale]/(screens)/profile/[id]/page.tsx`
- Import: `formatPoints` → `formatImpactCredits`
- Local var: `const points = profile.points_balance || 0` → `const impactCreditsBalance = profile.points_balance || 0`
- `getMilestoneBadges({ points, ... })` → `getMilestoneBadges({ points: impactCreditsBalance, ... })` (param name kept — internal API)
- `formatPoints(levelProgress.nextMin - impactScore)` → `formatImpactCredits(...)`
- `formatPoints(investment.amount_points || 0)` → `formatImpactCredits(...)`

> Note: `profile.points_balance` is a Supabase column name — [A_NE_PAS_TOUCHER]. Only the local variable alias was renamed.

**Classification:** [MIGRATION_COMPLETE]

---

### `src/app/[locale]/@modal/(.)products/balance/balance-modal-content.tsx`
- `[points, setPoints]` → `[balance, setBalance]`
- `const userPoints = await getCurrentMockImpactPoints(...)` → `const userBalance = ...`
- Updated all references: `setPoints(userPoints)` → `setBalance(userBalance)`, `userPoints > 0` → `userBalance > 0`
- `<WarriorState balance={points} ...>` → `<WarriorState balance={balance} ...>`

**Classification:** [MIGRATION_COMPLETE]

---

### `src/app/[locale]/(tabs)/products/products-client.tsx`
- `[userPoints, setUserPoints]` → `[userImpactCredits, setUserImpactCredits]`
- `loadUserPoints()` → `loadUserImpactCredits()`
- `const points = await getCurrentMockImpactPoints(...)` → `const balance = ...`
- `setUserPoints(points)` → `setUserImpactCredits(balance)`
- `value={userPoints}` (×2 CurrencyAmount) → `value={userImpactCredits}`

**Classification:** [MIGRATION_COMPLETE]

---

## Intentionally Untouched — [LEGACY_COMPAT] [A_NE_PAS_TOUCHER]

### `src/lib/mock/mock-member-data.ts`
Fields such as `amount_points`, `total_points`, `unit_price_points` are Supabase column name mirrors. Renaming them would break DB adapter compatibility. Deferred to DB V2 migration.

### `src/lib/gamification/gamification.ts`
`ImpactInputs.points` is an internal gamification engine parameter. It is not exposed in the UI and does not map to the wallet concept. No change needed.

### `src/lib/utils.ts` — `formatPoints()`
The function remains as `@deprecated` for any remaining call sites outside the scope of this phase (e.g., Supabase-backed pages, `apps/web`). All mock/UI call sites within scope have been migrated.

---

## Semantic Notes

| Term | Meaning | Field name |
|------|---------|------------|
| Credits Impact | User-facing label (FR) | `impactCreditsBalance` |
| `impactCredits` | CurrencyKind value | `kind="impactCredits"` |
| Seeds / Graines | Engagement currency | `totalSeedsContributed` |
| `seeds` | CurrencyKind value | `kind="seeds"` |
| `points` | Legacy alias — deprecated | replaced by `impactCreditsBalance` |

---

## What Remains (Post R8)

- `Profile.totalSeedsContributed` — naming is already correct, no change needed
- Routes `/invest` → `/support` — reserved P2
- Stripe metadata `producer_support` — reserved P2
- DB V2 column rename (`points_balance` → `impact_credits_balance`) — reserved P0-10a
- `formatPoints()` in `src/lib/utils.ts` — keep `@deprecated`, remove when all Supabase-path callers are gone
