# Billing Service (Dual) - Make the CHANGE

 Scope: Stripe Subscriptions (monthly) + Payment Intents (annual), Customer Portal, proration, and points generation (mensuel pour annuels).

## Responsibilities
- Create/update/cancel subscriptions; convert monthly↔annual avec proration.
- Handle Stripe webhooks (invoice succeeded/failed, subscription lifecycle, PI events).
- Award points: mensuel pour monthly; pour annual, attribution mensuelle (12 tranches) planifiée à la création.

## Design
- Node runtime route for Stripe webhooks with signature verification.
- Idempotency keys per operation; retry-safe handlers.
- Pricing config centralized; currency EUR; tax/VAT handling future.

## Key Flows
- Create monthly: Stripe Subscription with default PM; on invoice succeeded → points mensuels + nextBillingDate.
- Create annual: Payment Intent immediate confirmation; on success → activate annual period + créer un schedule d’allocation mensuelle (12×) avec expiry par tranche.
- Conversion monthly→annual: cancel sub, compute proration credit, create PI with discount, update DB; replanifier l’allocation mensuelle (pas de crédit immédiat de points).

## Data
- Table actuelle: `public.subscriptions` (voir `database-schema.md`).
- Tables planifiées: `subscription_billing_history`, `subscription_changes`.
- Planification (proposée): `scheduled_point_allocations` ou cron mensuel calculé à partir de `start_date`.
 - Voir `services/job-scheduling.md` pour schéma de table, fonction de processing et cron.

## Security
- Validate ownership and single active subscription per user; protect from duplicate webhook processing.

## Observability
- Metrics: MRR/ARR, churn, conversion rate monthly→annual, failed payments; drift entre plan d’allocation et exécution.

## Testing
- Webhook idempotency, proration correctness, error scenarios (PM fails), partial refunds.
- Accrual mensuel: 12 attributions sur 12 mois, expiry à +18mois/attribution.

## References
- `../integrations/stripe-integration.md`
