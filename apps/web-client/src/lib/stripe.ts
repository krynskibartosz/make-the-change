import Stripe from 'stripe'

let stripeSingleton: Stripe | null = null

export const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  if (!stripeSingleton) {
    stripeSingleton = new Stripe(apiKey, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }

  return stripeSingleton
}
