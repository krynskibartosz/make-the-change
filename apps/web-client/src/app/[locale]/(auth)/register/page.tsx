import { connection } from 'next/server'
import { RegisterForm } from '@/components/auth/register-form'

export default async function RegisterPage() {
  await connection()
  return <RegisterForm />
}
