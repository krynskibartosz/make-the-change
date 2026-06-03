'use server'

import type { ServerActionState } from '@/lib/server-actions'

function isValidEmail(email: string): boolean {
  const parts = email.split('@')
  return parts.length === 2 && (parts[1]?.includes('.') ?? false)
}

export async function sendContactMessage(
  _prev: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  const errors: Record<string, string> = {}
  if (!isValidEmail(email)) errors.email = 'Adresse e-mail invalide.'
  if (message.length < 10) errors.message = 'Message trop court (10 caractères minimum).'

  if (Object.keys(errors).length > 0) return { errors }

  // TODO: wire to email service (Resend or similar)
  console.log('[contact] new message from', email)
  return { success: true }
}
