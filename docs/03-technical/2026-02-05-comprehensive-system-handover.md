# System Handover & Technical Specification (v1.2)

**Date**: 2026-02-05
**Project**: Make-the-Change
**Version**: 1.2 (Corrected & Verified)
**Audience**: AI Agents & Senior Engineers

---

## 📌 I. Source of Truth Protocol

When discrepancies arise, strictly follow this priority order:
1.  **Live Database Schema** (Postgres `information_schema`)
2.  **Drizzle definitions** (`packages/core/src/shared/db/schema.ts`)
3.  **Runtime Code** (`apps/**/src/**/*.{ts,tsx}`)
4.  **Documentation** (This file and others)

> **Critical Note on "Ghost Tables"**: The following tables exist in the DB but are **NOT yet typed in Drizzle**:
> *   `commerce.points_ledger`
> *   `commerce.stripe_events`
> *   `public.producer_messages`
> *   SQL View/MV: `public.public_user_profiles`, `public.public_user_rankings`

---

## 🛠 II. Core Architecture & Schema

### A. Public Data (Privacy-First)

**1. `public.public_user_profiles` (SQL View)**
*   **Purpose**: Expose safe profile data (stats/avatar) without leaking PII.
*   **Source**: Reads `profiles` table, extracting fields from `metadata` JSONB.
*   **Filter**: `(metadata->>'is_public')::boolean IS TRUE`

**2. `public.public_user_rankings` (Materialized View)**
*   **Purpose**: Performance-optimized Leaderboard.
*   **Refresh**: Must run `REFRESH MATERIALIZED VIEW public.public_user_rankings`.

### B. Business Logic Schema (Untyped in Drizzle)

| Table | Status | Known Usage |
| :--- | :--- | :--- |
| `commerce.points_ledger` | **Legacy/Audit** | Only reliably written via Webhook (`add_points` RPC). *Server Actions currently bypass this (See Section V).* |
| `commerce.stripe_events` | **Active** | Used in `api/webhooks/stripe` for idempotency. |
| `public.producer_messages` | **Active** | Inserted from web-client/mobile contact flows (RLS) and read/updated in producer inbox (`apps/web`). |

---

## 💻 III. Application Logic Specifications

### 1. Points System: "The Dual-Write Gap"

**⚠️ Architectural Debt / Known Behavior**:
The system has two sources of point balance, which are currently **not perfectly synced**.

1.  **Profiles Metadata** (`profiles.metadata.points_balance`):
    *   **Role**: The "Hot Cache" used by UI and Checkout logic.
    *   **Writers**: Server Actions (`create-investment`, `place-points-order`).
    *   **Risk**: If an action fails mid-stream, this value might drift.

2.  **Points Ledger** (`commerce.points_ledger`):
    *   **Role**: The "Cold Storage" / Legal Audit Trail.
    *   **Writers**: Primarily the Stripe Webhook (via `add_points` RPC).
    *   **Gap**: Server Actions currently **DO NOT** write to this ledger.

**Next Step for P7**: Implement a DB Trigger to auto-update `metadata.points_balance` from `SUM(ledger.delta)`, forcing all writes to go through the Ledger.

### 2. Stripe Integration

**Webhook Handler**: `apps/web-client/src/app/api/webhooks/stripe/route.ts`
**Payment Intent (Web)**: `apps/web-client/src/app/api/payments/create-intent/route.ts`
**PaymentSheet (Mobile)**: `apps/web-client/src/app/api/payments/mobile-sheet/route.ts`
*   **PaymentIntent Metadata Contract** (required by webhook processing):
    *   `user_id`: Supabase user UUID.
    *   `order_type`: `'investment'` | `'product_purchase'`.
    *   `reference_id`: UUID of the related `investments` / `orders` row.
    *   `points_used`: (purchase only) stringified integer.
*   **Trigger**: `payment_intent.succeeded`
*   **Idempotency**: Checks `stripe_events` table (using unique `event_id`).
*   **Logic**:
    *   **Investment**: Adds `Math.floor(payment_intent.amount / 100)` points (amount is in cents).
    *   **Purchase**: Deducts points from `payment_intent.metadata.points_used` (`parseInt(...)`).

### 3. Gamification Weights (`gamification.ts`)

Scores are calculated using these factors:
*   `Points`: **1x**
*   `Projects Count`: **250x**
*   `Invested EUR`: **0.5x**

---

## 🔒 IV. Environment Variables

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | API Connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Client RLS Access |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server Only**. Admin access (Webhooks). |
| `STRIPE_SECRET_KEY` | ✅ | **Server Only**. Payment API. |
| `STRIPE_WEBHOOK_SECRET` | ✅ | **Server Only**. Signature verification. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Client-side Stripe Elements. |
| `DATABASE_URL` | ✅ | **Server Only**. Drizzle migrations/queries. |

---

## ✅ V. Runbook: Verification Commands

Use **SQL** (via Supabase Query Editor) to verify system state.

```sql
-- 0. Sanity check: verify where relations exist (NULL = missing in this schema)
SELECT
  to_regclass('public.public_user_profiles') as public_user_profiles_view,
  to_regclass('public.public_user_rankings') as public_user_rankings_mv,
  to_regclass('commerce.points_ledger') as commerce_points_ledger,
  to_regclass('public.points_ledger') as public_points_ledger,
  to_regclass('commerce.stripe_events') as commerce_stripe_events,
  to_regclass('public.stripe_events') as public_stripe_events,
  to_regclass('public.producer_messages') as public_producer_messages;

-- 1. Check Metadata Extraction in View
SELECT id, display_name, points_balance, biodiversity_impact 
FROM public.public_user_profiles 
LIMIT 5;

-- 2. Audit "Dual-Write" Gap (Metadata vs Ledger)
-- If "diff" is non-zero, the ledger is out of sync with the UI.
-- If `commerce_points_ledger` is NULL above, replace `commerce.points_ledger` with `public.points_ledger`.
SELECT 
  p.id,
  COALESCE((p.metadata->>'points_balance')::int, 0) as ui_balance,
  COALESCE((SELECT SUM(delta) FROM commerce.points_ledger WHERE user_id = p.id), 0) as ledger_balance,
	  (COALESCE((p.metadata->>'points_balance')::int, 0) - 
	   COALESCE((SELECT SUM(delta) FROM commerce.points_ledger WHERE user_id = p.id), 0)) as diff
FROM profiles p
WHERE COALESCE((p.metadata->>'points_balance')::int, 0) > 0;

-- 3. Check for specific Stripe Event (adjust schema based on sanity check above)
SELECT * FROM commerce.stripe_events 
WHERE type = 'payment_intent.succeeded' 
ORDER BY processed_at DESC LIMIT 5;
```
