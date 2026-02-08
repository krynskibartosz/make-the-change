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

  // Admin allowlist (optional extra restriction)
  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  const userEmail = (data.user?.email || '').toLowerCase()
  const isAllowlisted = allow.length === 0 || allow.includes(userEmail)

  // Check user roles via Drizzle
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
  const hasAdminRole = userRoleList.includes('superadmin') || userRoleList.includes('admin')
  const hasProducerRole = userRoleList.includes('producer')

  // Admin or superadmin role = admin access
  if (hasAdminRole && isAllowlisted) {
    return { success: true, redirectUrl: parsed.data.redirect || '/admin/dashboard' }
  }

  // Producer role = partner access
  if (hasProducerRole) {
    return { success: true, redirectUrl: '/partner/dashboard' }
  }

  // No valid role - sign out and deny
  await supabase.auth.signOut()
  console.warn(`[SECURITY] Unauthorized Admin Access Attempt: ${userEmail}`)
  return { success: false, message: 'Accès refusé. Utilisez le login approprié.' }
}
