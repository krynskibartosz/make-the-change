import { redirect } from 'next/navigation'

interface TransactionPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
  searchParams: Promise<{
    type?: 'investment' | 'order'
  }>
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  // This page is intercepted by the modal at @modal/(.)transactions/[id]/page.tsx
  // If navigation reaches here, redirect back to investments
  redirect('/dashboard/investments')
}
