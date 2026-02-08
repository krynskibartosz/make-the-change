import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Supabase admin env vars are not set')
  }
  return createClient(url, serviceKey)
}

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const supabaseAdmin = getSupabaseAdmin()
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Use P7 Transactional RPC
        const { error } = await supabaseAdmin.rpc('handle_payment_intent_succeeded', {
          p_event_id: event.id,
          p_payment_intent_id: paymentIntent.id,
          p_amount_cents: paymentIntent.amount,
          p_metadata: paymentIntent.metadata,
        })

        if (error) {
          console.error('RPC handle_payment_intent_succeeded failed:', error)
          // We throw to catch block but logic inside RPC handles most errors by logging to stripe_events
          // If it's a critical RPC failure, returning 500 will make Stripe retry.
          throw new Error(`RPC failed: ${error.message}`)
        }

        console.log('Processed payment_intent.succeeded via RPC for event:', event.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error(
          'Payment failed:',
          paymentIntent.id,
          paymentIntent.last_payment_error?.message,
        )
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('Charge refunded:', charge.id, 'Refund logic not yet implemented via RPC')
        break
      }

      default:
      // console.log('Unhandled event type:', event.type)
    }
  } catch (error: unknown) {
    console.error('Error processing webhook:', error)
    // Return 500 to let Stripe retry if it's a transient error
    // But for logic errors (captured in DB), we might want to return 200.
    // Our RPC captures logic errors in 'stripe_events.error' column.
    // Only real connection/DB errors will throw here.
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// Disable body parsing for raw webhook verification
export const runtime = 'nodejs'
