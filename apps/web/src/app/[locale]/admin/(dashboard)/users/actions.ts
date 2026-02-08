'use server'

import { admin } from '@make-the-change/core'
import { db } from '@make-the-change/core/db'
import { profiles } from '@make-the-change/core/schema'
import { requireAdmin } from '@/lib/auth-guards'
import { createAdminClient } from '@/lib/supabase/server'

type AdminUserInput = admin.AdminUserInput

type CreateUserResult = {
  success: boolean
  id?: string
  message?: string
  errors?: Record<string, string[]>
}

export async function createUserAction(input: AdminUserInput): Promise<CreateUserResult> {
  await requireAdmin()
  const parsed = admin.adminUserSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Erreurs de validation',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const supabase = await createAdminClient()
  const data = parsed.data

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      first_name: data.first_name,
      last_name: data.last_name,
      address_country_code: data.address_country_code,
    },
  })

  if (authError) {
    return { success: false, message: authError.message }
  }

  const userId = authData.user?.id
  if (!userId) {
    return { success: false, message: 'Utilisateur non créé' }
  }

  try {
    await db
      .insert(profiles)
      .values({
        id: userId,
        email: data.email,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        user_level: data.user_level,
        kyc_status: data.kyc_status,
        address_country_code: data.address_country_code || null,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          email: data.email,
          first_name: data.first_name || null,
          last_name: data.last_name || null,
          user_level: data.user_level,
          kyc_status: data.kyc_status,
          address_country_code: data.address_country_code || null,
        },
      })
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur lors de la création du profil',
    }
  }

  return { success: true, id: userId }
}
