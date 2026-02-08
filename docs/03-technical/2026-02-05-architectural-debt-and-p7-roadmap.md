# Architectural Audit & P7 Roadmap: Hardening & Consistency

**Date**: 2026-02-05
**Status**: DRAFT (Proposed Strategy)
**Objective**: Resolve high-risk architectural debt identified in the P0-P6 Handover.

---

## 🛑 Critical Security & Consistency Fixes (Prioritized)

### 1. Fix "Dual-Write" Points System (Ledger as Source of Truth)
**Current Debt**: `profiles.metadata.points_balance` is updated ad-hoc by Server Actions. Disconnect with `commerce.points_ledger`.
**Target Architecture**:
-   **Single Write Path**: ALL points changes must be row inserts to `commerce.points_ledger`.
-   **Automation**: A PostgreSQL Trigger (`after insert on points_ledger`) automatically updates `profiles.metadata.points_balance`.
-   **Security**: Client/Server Actions *cannot* update metadata directly. They must insert a ledger entry.

### 2. Transactional Checkout (Prepare for Scale)
**Current Debt**: Checkout is 3 steps (Orders -> Items -> Points Deduct). Failure at step 2 or 3 leaves system in inconsistent state.
**Target Architecture**:
-   **Atomic RPC**: Create `commerce.checkout()` SQL function.
-   **Logic**: Wrapped in `BEGIN ... COMMIT`.
-   **Steps**:
    1.  Verify stock & points balance (lock rows).
    2.  Insert Order & Items.
    3.  Insert Ledger Entry (Debit).
    4.  Update Stock.

### 3. Secure Investment Flow (Stripe-Gated)
**Current Debt**: `create-investment.action.ts` creates "Active" investment immediately, assuming payment happened.
**Target Architecture**:
-   **Step 1 (Client)**: Action creates Investment with status `PENDING_PAYMENT`.
-   **Step 2 (Stripe)**: User pays.
-   **Step 3 (Webhook)**: `payment_intent.succeeded` -> Updates Investment to `ACTIVE` + Awards Points (Atomic transaction).

### 4. Stripe Metadata Validation
**Current Debt**: Unchecked metadata propagation.
**Target Architecture**:
-   **Schema Validation**: Use Zod in Webhook Action to strictly validate `metadata` shape (`order_type`, `reference_id` UUID format).
-   **Reference Check**: Webhook must verify `reference_id` exists in `investments` or `orders` before processing.

---

## 🛠 Operational Hardening (Secondary Priority)

### 5. "Ghost" Schema Versioning
**Current Debt**: Tables like `points_ledger` and `stripe_events` exist only in prod DB, not in Drizzle code.
**Fix**:
-   Reverse-engineer Drizzle definitions for all missing tables.
-   Add to `packages/core/src/shared/db/schema.ts`.
-   Ensure `drizzle-kit push` captures them.

### 6. Leaderboard Refresh Strategy
**Current Debt**: `public_user_rankings` (MV) is static.
**Fix**:
-   **Cron**: Use `pg_cron` (if available on Supabase tier) or a Vercel/GitHub Action Cron (every 10-60 mins).
-   **Command**: `REFRESH MATERIALIZED VIEW CONCURRENTLY public.public_user_rankings;`.

### 7. Producer Messaging Security
**Current Debt**: `producer_messages` insert trusts `sender_user_id` from client.
**Fix**:
-   **RLS Policy**: `CHECK (auth.uid() = sender_user_id)`. Enforced at DB level.

---

## 📅 Proposed Execution Plan (P7)

| Sprint | Task | Outcome |
| :--- | :--- | :--- |
| **P7.1** | **Ledger Trigger & Data Migration** | Ledger becomes sole writer of balance. `add_points` RPC standardized. |
| **P7.2** | **Drizzle Schema Alignment** | All "Ghost" tables typed. Migration history clean. |
| **P7.3** | **Stripe "Strict Mode"** | Webhook validates metadata. Investment flow becomes async/pending-first. |
| **P7.4** | **Transactional Checkout** | Move logic to Postgres Function / Transactional transaction. |

---

## ❓ Open Questions Resolved

*   **Source of Truth**: **Ledger** (writes) -> **Metadata** (Read Cache).
*   **Investments**: MUST be gated by Stripe Webhook for status activation.
*   **Env Vars**: `DATABASE_URL` is authorized for Server Actions (Admin access), while `SUPABASE_.._KEY` handles RLS context.
