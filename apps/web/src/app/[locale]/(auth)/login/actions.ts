'use server'

import { db } from '@make-the-change/core/db'
import { userRoles } from '@make-the-change/core/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { createSupabaseServer } from '@/supabase/server'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
  redirect: z.string().optional(),
})

export async function signInAction(_: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: formData.get('redirect'),
  })

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, errors: fieldErrors, message: 'Validation échouée' }
  }

  // 1. Auth via Supabase
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    const msg = error.message.includes('Email not confirmed')
      ? 'Email non confirmé. Vérifiez votre boîte mail.'
      : error.message.includes('Invalid login credentials')
        ? 'Identifiants incorrects.'
        : "Erreur d'authentification."
    return { success: false, message: msg }
  }

  // 2. Get user roles via Drizzle
  const roles = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(
      and(
        eq(userRoles.user_id, data.user.id),
        isNull(userRoles.revoked_at),
        isNull(userRoles.deleted_at),
      ),
    )

  const userRoleList = roles.map((r) => r.role)

  // 3. Check for admin access (role, optionally restricted by allowlist)
  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  const userEmail = (data.user.email || '').toLowerCase()
  const isAllowlisted = allow.length === 0 || allow.includes(userEmail)
  const hasAdminRole = userRoleList.includes('superadmin') || userRoleList.includes('admin')

  // 4. Redirect based on role priority
  if (hasAdminRole && isAllowlisted) {
    return { success: true, redirectUrl: parsed.data.redirect || '/admin/dashboard' }
  }

  if (userRoleList.includes('producer')) {
    return { success: true, redirectUrl: parsed.data.redirect || '/partner/dashboard' }
  }

  // 5. No valid role - sign out and deny access
  await supabase.auth.signOut()
  console.warn(`[SECURITY] No valid dashboard role for: ${userEmail}`)
  return { success: false, message: "Accès refusé. Vous n'avez pas les droits nécessaires." }
}

export async function signOutAction() {
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  return { success: true }
}
