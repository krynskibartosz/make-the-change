'use server'

import { investment } from '@make-the-change/core'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

const CreateInvestmentSchema = z.object({
  projectId: z.string().uuid(),
  amountEur: z.number().positive(),
})

export type CreateInvestmentInput = z.infer<typeof CreateInvestmentSchema>

export type CreateInvestmentResult =
  | { investmentId: string; clientSecret: string; pointsEarned: number }
  | { errorCode: 'UNAUTHENTICATED' | 'INVALID' | 'UNKNOWN'; message: string }

export async function createInvestmentAction(
  input: CreateInvestmentInput,
): Promise<CreateInvestmentResult> {
  const parsed = CreateInvestmentSchema.safeParse(input)
  if (!parsed.success) return { errorCode: 'INVALID', message: 'Données invalides.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { errorCode: 'UNAUTHENTICATED', message: 'Vous devez être connecté.' }

  const { data: project, error: projectError } = await supabase
    .from('public_projects')
    .select('id, type')
    .eq('id', parsed.data.projectId)
    .single()

  if (projectError || !project) {
    console.error('[invest] fetch project failed', projectError)
    return { errorCode: 'UNKNOWN', message: 'Projet introuvable.' }
  }

  const type = project.type as investment.InvestmentType
  const rules = investment.getInvestmentRules(type)
  if (!rules) return { errorCode: 'UNKNOWN', message: 'Type de projet invalide.' }

  const amount = parsed.data.amountEur
  if (amount < rules.min_amount || amount > rules.max_amount) {
    return {
      errorCode: 'INVALID',
      message: `Montant hors limites (${rules.min_amount}-${rules.max_amount}€).`,
    }
  }

  const points = investment.calculateInvestmentPoints({
    type,
    amount_eur: amount,
    bonus_percentage: rules.expected_bonus,
  })

  // 1. Create Investment (Pending)
  const { data: created, error: createError } = await supabase
    .from('investments')
    .insert({
      user_id: user.id,
      project_id: parsed.data.projectId,
      amount_points: points.total_points,
      amount_eur_equivalent: amount,
      status: 'pending', // P7: Start as pending
    })
    .select('id')
    .single()

  if (createError || !created) {
    console.error('[invest] create investment failed', createError)
    return { errorCode: 'UNKNOWN', message: 'Impossible de créer l’investissement.' }
  }

  // 2. Create Stripe PaymentIntent with strict metadata
  try {
    const stripe = getStripe()
    // Get customer ID if exists (optional, nice to have for saved cards)
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const metadata = profile?.metadata as Record<string, unknown> | null | undefined
    const customerIdValue = metadata?.stripe_customer_id
    const customerId = typeof customerIdValue === 'string' ? customerIdValue : undefined

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Cents
      currency: 'eur',
      customer: customerId, // Optional
      metadata: {
        order_type: 'investment',
        reference_id: created.id,
        user_id: user.id,
        // No points_used for investment flow usually
      },
      automatic_payment_methods: { enabled: true },
    })

    if (!paymentIntent.client_secret) {
      throw new Error('No client_secret returned from Stripe')
    }

    revalidatePath('/dashboard')

    return {
      investmentId: created.id,
      clientSecret: paymentIntent.client_secret,
      pointsEarned: points.total_points,
    }
  } catch (stripeError: unknown) {
    console.error('[invest] stripe error', stripeError)
    // Rollback investment? ideally yes, or leave it as pending/abandoned.
    // We'll leave it pending (orphan) for now.
    return { errorCode: 'UNKNOWN', message: 'Erreur lors de l’initialisation du paiement.' }
  }
}
