import { connection } from 'next/server'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default async function ForgotPasswordPage() {
  await connection()
  return <ForgotPasswordForm />
}
