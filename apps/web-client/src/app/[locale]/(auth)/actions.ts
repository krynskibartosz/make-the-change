'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type AuthState = {
  error?: string
  success?: string
  redirectUrl?: string
}

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()
  const locale = await getLocale()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const returnToRaw = formData.get('returnTo') as string | null

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  const safeReturnTo =
    returnToRaw && returnToRaw.startsWith('/') && !returnToRaw.startsWith('//')
      ? returnToRaw
      : '/dashboard'

  return { success: 'true', redirectUrl: safeReturnTo }
}

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user?.identities?.length === 0) {
    return { error: 'An account with this email already exists' }
  }

  // Record consents
  if (data.user) {
    try {
      const adminSupabase = createAdminClient()
      const headersList = await headers()
      const ip = headersList.get('x-forwarded-for') || 'unknown'
      const userAgent = headersList.get('user-agent') || 'unknown'

      await adminSupabase
        .schema('identity')
        .from('user_consents')
        .insert([
          {
            user_id: data.user.id,
            consent_type: 'terms_of_use',
            consent_version: '1.0',
            granted: true,
            ip,
            user_agent: userAgent,
          },
          {
            user_id: data.user.id,
            consent_type: 'privacy_policy',
            consent_version: '1.0',
            granted: true,
            ip,
            user_agent: userAgent,
          },
        ])
    } catch (e) {
      // Non-blocking error
      console.error('Failed to record consents', e)
    }
  }

  return { success: 'Check your email to confirm your account' }
}

export async function forgotPassword(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Check your email for a password reset link' }
}

export async function logout() {
  const supabase = await createClient()
  const locale = await getLocale()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect({ href: '/', locale })
}
