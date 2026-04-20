import { notFound } from 'next/navigation'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { TransactionReceipt } from '@/app/[locale]/(dashboard)/dashboard/investments/_features/transaction-receipt'

interface InterceptedTransactionPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
  searchParams: Promise<{
    type?: 'investment' | 'order'
  }>
}

export default async function InterceptedTransactionPage({ params, searchParams }: InterceptedTransactionPageProps) {
  const { id } = await params
  const { type } = await searchParams

  if (!id || !type) {
    notFound()
  }

  return (
    <FullScreenSlideModal title="Détail de l'opération" fallbackHref="/dashboard/investments" headerMode="close">
      <TransactionReceipt transactionId={id} transactionType={type} />
    </FullScreenSlideModal>
  )
}
