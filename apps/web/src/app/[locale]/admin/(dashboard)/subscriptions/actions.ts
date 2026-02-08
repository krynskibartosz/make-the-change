'use server'

import { admin } from '@make-the-change/core'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guards'

export type SubscriptionFormState = {
  success: boolean
  message: string
  errors?: Record<string, string[]> | null
  id?: string
}

export async function createSubscription(
  _prevState: SubscriptionFormState,
  formData: FormData,
): Promise<SubscriptionFormState> {
  await requireAdmin()
  const validatedFields = admin.adminSubscriptionSchema.safeParse(
    Object.fromEntries(formData.entries()),
  )

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Erreurs de validation. Veuillez vérifier les champs.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const db = await import('@make-the-change/core/db').then((m) => m.db)
  const { subscriptions } = await import('@make-the-change/core/schema')

  try {
    const [data] = await db
      .insert(subscriptions)
      .values({
        ...validatedFields.data,
        monthly_price: validatedFields.data.monthly_price?.toString(),
        annual_price: validatedFields.data.annual_price?.toString(),
        bonus_percentage: validatedFields.data.bonus_percentage?.toString(),
      })
      .returning()

    if (!data) {
      return { success: false, message: "Échec de création de l'abonnement" }
    }

    revalidatePath('/admin/subscriptions')

    return {
      success: true,
      message: 'Abonnement créé avec succès!',
      id: data.id,
    }
  } catch (error) {
    console.error('Erreur création abonnement:', error)
    return {
      success: false,
      message: `Erreur lors de la création: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

export async function updateSubscription(
  id: string,
  patch: Partial<admin.AdminSubscriptionInput>,
): Promise<SubscriptionFormState> {
  await requireAdmin()
  const parsed = admin.adminSubscriptionSchema.partial().safeParse(patch)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Erreurs de validation. Veuillez vérifier les champs.',
      errors: parsed.error.flatten().fieldErrors,
    }
  }
  const db = await import('@make-the-change/core/db').then((m) => m.db)
  const { subscriptions } = await import('@make-the-change/core/schema')
  const { eq } = await import('drizzle-orm')

  try {
    const [data] = await db
      .update(subscriptions)
      .set({
        ...parsed.data,
        monthly_price: parsed.data.monthly_price?.toString(),
        annual_price: parsed.data.annual_price?.toString(),
        bonus_percentage: parsed.data.bonus_percentage?.toString(),
        updated_at: new Date(),
      })
      .where(eq(subscriptions.id, id))
      .returning()

    if (!data) {
      return { success: false, message: 'Abonnement non trouvé' }
    }

    revalidatePath('/admin/subscriptions')
    revalidatePath(`/admin/subscriptions/${id}`)

    return {
      success: true,
      message: 'Abonnement mis à jour avec succès!',
      id: data.id,
    }
  } catch (error) {
    console.error('Erreur mise à jour abonnement:', error)
    return {
      success: false,
      message: `Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
