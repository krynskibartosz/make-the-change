import { connection } from 'next/server'
import { LoginForm } from '@/app/[locale]/(auth)/_components/login-form'

export default async function LoginPage() {
  await connection()
  return <LoginForm />
}
