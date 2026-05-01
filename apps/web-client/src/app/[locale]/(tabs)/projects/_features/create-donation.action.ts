'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'
import { getDonationOptionById } from './mock-donations'

const CreateDonationSchema = z.object({
  projectId: z.string().uuid(),
  donationOptionId: z.string(),
})

export type CreateDonationInput = z.infer<typeof CreateDonationSchema>

export type CreateDonationResult =
  | { donationId: string; clientSecret: string; pointsEarned: number }
  | { errorCode: 'UNAUTHENTICATED' | 'INVALID' | 'UNKNOWN'; message: string }

const isDonationType = (value: unknown): value is 'reef' | 'coral' =>
  value === 'reef' || value === 'coral'

export async function createDonationAction(
  input: CreateDonationInput,
): Promise<CreateDonationResult> {
  const parsed = CreateDonationSchema.safeParse(input)
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
    console.error('[donation] fetch project failed', projectError)
    return { errorCode: 'UNKNOWN', message: 'Projet introuvable.' }
  }

  if (!isDonationType(project.type)) {
    return { errorCode: 'UNKNOWN', message: 'Type de projet invalide.' }
  }

  const donationOption = getDonationOptionById(parsed.data.donationOptionId)
  if (!donationOption) {
    return { errorCode: 'INVALID', message: 'Option de donation invalide.' }
  }

  if (donationOption.projectId !== parsed.data.projectId) {
    return { errorCode: 'INVALID', message: 'Option de donation incompatible.' }
  }

  const points = donationOption.rewards.points

  // 1. Create Donation (Pending)
  const { data: created, error: createError } = await supabase
    .from('donations')
    .insert({
      user_id: user.id,
      project_id: parsed.data.projectId,
      donation_option_id: parsed.data.donationOptionId,
      amount_points: points,
      amount_eur_equivalent: donationOption.price,
      status: 'pending',
    })
    .select('id')
    .single()

  if (createError || !created) {
    console.error('[donation] create donation failed', createError)
    return { errorCode: 'UNKNOWN', message: 'Impossible de créer la donation.' }
  }

  // 2. Create Stripe PaymentIntent with strict metadata
  try {
    const stripe = getStripe()
    const { data: profile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const metadata = isRecord(profile?.metadata) ? profile.metadata : null
    const customerId = metadata ? asString(metadata.stripe_customer_id) || undefined : undefined

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(donationOption.price * 100),
      currency: 'eur',
      metadata: {
        order_type: 'donation',
        reference_id: created.id,
        user_id: user.id,
      },
      automatic_payment_methods: { enabled: true },
      ...(customerId !== undefined ? { customer: customerId } : {}),
    })

    if (!paymentIntent.client_secret) {
      throw new Error('No client_secret returned from Stripe')
    }

    revalidatePath('/dashboard')

    return {
      donationId: created.id,
      clientSecret: paymentIntent.client_secret,
      pointsEarned: points,
    }
  } catch (stripeError: unknown) {
    console.error('[donation] stripe error', stripeError)
    return { errorCode: 'UNKNOWN', message: 'Erreur lors de linitialisation du paiement.' }
  }
}
