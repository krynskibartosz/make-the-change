import { connection } from 'next/server'
import { RegisterForm } from '@/app/[locale]/(auth)/_components/register-form'

export default async function RegisterPage() {
  await connection()
  return <RegisterForm />
}
