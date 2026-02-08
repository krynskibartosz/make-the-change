# Stripe Configuration

## Web Client (.env.local)

```bash
# Public (client-side safe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Secret (server-side only - NEVER commit)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Mobile (.env)

```bash
# Public only
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Getting Your Keys

### 1. Create Stripe Account
- Go to https://dashboard.stripe.com/register
- Complete account setup

### 2. Get API Keys
- Dashboard → Developers → API keys
- Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Copy **Secret key** → `STRIPE_SECRET_KEY`

### 3. Setup Webhook
- Dashboard → Developers → Webhooks
- Click "+ Add endpoint"
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events to listen: 
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`
- Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## Testing

### Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires 3DS: 4000 0025 0000 3155
Insufficient funds: 4000 0000 0000  9995
```

### Local Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will output a webhook signing secret
# Use it as STRIPE_WEBHOOK_SECRET
```

## Security Notes

- ✅ **NEVER** commit secret keys to git
- ✅ Use `.env.local` for local development (git-ignored)
- ✅ Store secrets in Vercel environment variables for production
- ✅ Rotate keys if accidentally exposed
- ❌ **NEVER** use secret keys in client-side code
