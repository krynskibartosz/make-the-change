'use server'

export type ContactActionState = {
  success?: boolean
  error?: string
}

export async function sendContactMessage(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!email.includes('@') || !email.split('@')[1]?.includes('.')) {
    return { error: 'Adresse e-mail invalide.' }
  }
  if (message.length < 10) {
    return { error: 'Le message est trop court (10 caractères minimum).' }
  }

  // TODO: wire to email service (Resend or similar)
  console.log('[contact] new message from', email)
  return { success: true }
}
