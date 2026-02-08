# Frontend Implementation Prompt (Phase P7)

**Global Context**
We are hardening the application. The backend (Supabase + Server Actions + Stripe Logic) has been refactored to be robust and secure. We now need to update the client-side components to match these changes.

**Tech Stack**
- Next.js 15+ (App Router)
- Supabase (Auth, Client)
- Stripe (Elements, PaymentIntent)
- Shadcn/ui + Tailwind

---

## Task 1: Secure Investment Flow
**File**: `apps/web-client/src/features/investment/invest-client.tsx`

**Goal**: Replace the current "fake" success with a real Stripe Payment Flow.

**Context**:
- The Server Action `createInvestmentAction` has been updated.
- It now returns `{ investmentId, clientSecret, pointsEarned }`.
- The investment status is initially `pending` (no points awarded yet).

**Instructions**:
1.  **Install Stripe Elements**:
    - Wrap the confirmation step (Step 3) in `<Elements stripe={stripePromise} options={{ clientSecret }}>`.
    - Use `appearance: { theme: 'stripe' }` to match the design.
2.  **Add Payment Form**:
    - Create a child component `InvestmentPaymentForm`.
    - Use `<PaymentElement />` inside.
    - On submit, call `stripe.confirmPayment` with `return_url: window.location.origin + '/dashboard/investments'`.
3.  **Handle Success**:
    - Do NOT show the "Success" step immediately in the client logic.
    - Let Stripe redirect to the dashboard (or a success page).
    - Alternatively, if using `redirect: 'if_required'`, wait for success then show the success step.

**Reference**:
- use `loadStripe` from `@stripe/stripe-js`.
- Key `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is available.

---

## Task 2: Atomic Checkout Refactor (Pending Backend)
*Note: The backend migration for this is scheduled next. Prepare the UI logic.*

**Goal**: Prepare `PlacePointsOrderAction` usage.
Currently, `placePointsOrderAction` does too much. It will be replaced by a streamlined action that calls a DB RPC.

**Instructions**:
- Review `apps/web-client/src/features/commerce/checkout/checkout-form.tsx`.
- Ensure it handles errors gracefully if the server returns "Insufficient points" (which is now strictly enforced by DB triggers).

---

## Task 3: Producer Messaging UI
**File**: `apps/web-client/src/features/producer/contact-producer-form.tsx`

**Goal**: Clarify privacy copy.

**Instructions**:
- Update the text near the submit button:
  - *Current*: "Votre email sera partagé."
  - *New*: "Votre email et nom complet seront transmis au producteur pour qu'il puisse vous répondre."
- Ensure the form is protected (disable submit if not logged in).

---

## General Guidelines
- **No Direct DB Writes**: Never try to write to `profiles.metadata` or `points_balance` from the client.
- **Use Server Actions**: Always go through Server Actions for mutations.
- **Error Handling**: Display clear error messages returned by Server Actions (e.g., "Solde insuffisant").
