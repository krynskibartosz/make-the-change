import { connection } from 'next/server'
import { LoginForm } from '@/components/auth/login-form'

export default async function LoginPage() {
  await connection()
  return <LoginForm />
}
