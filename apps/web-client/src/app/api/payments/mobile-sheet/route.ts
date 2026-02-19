import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

const MobileSheetSchema = z.object({
  amount: z.number().min(50).max(99999999),
  currency: z.string().default('eur'),
  metadata: z
    .object({
      order_type: z.enum(['investment', 'product_purchase', 'subscription']).optional(),
      reference_id: z.string().uuid().optional(),
      points_used: z.number().int().nonnegative().optional(),
    })
    .strict()
    .optional()
    .default({}),
})

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = MobileSheetSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.format() },
        { status: 400 },
      )
    }

    const { amount, currency, metadata } = parsed.data

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const profileMetadata = (profile?.metadata || {}) as Record<string, unknown>
    let customerId = profileMetadata.stripe_customer_id as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({
          metadata: {
            ...profileMetadata,
            stripe_customer_id: customerId,
          },
        })
        .eq('id', user.id)
    }

    // Create ephemeral key for mobile
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2026-01-28.clover' },
    )

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      metadata: {
        ...metadata,
        user_id: user.id,
      },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    })
  } catch (error: unknown) {
    console.error('Mobile sheet error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
