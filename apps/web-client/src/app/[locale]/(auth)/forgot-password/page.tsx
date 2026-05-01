import { connection } from 'next/server'
import { ForgotPasswordForm } from '@/app/[locale]/(auth)/_components/forgot-password-form'

export default async function ForgotPasswordPage() {
  await connection()
  return <ForgotPasswordForm />
}
