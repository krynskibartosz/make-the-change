import { notFound } from 'next/navigation'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { TransactionReceipt } from '@/app/[locale]/(screens)/profile/contributions/_features/transaction-receipt'

interface InterceptedTransactionPageProps {
  params: Promise<{
    locale: string
    id: string
  }>
  searchParams: Promise<{
    type?: 'support' | 'order'
  }>
}

export default async function InterceptedTransactionPage({ params, searchParams }: InterceptedTransactionPageProps) {
  const { id } = await params
  const { type } = await searchParams

  if (!id || !type) {
    notFound()
  }

  return (
    <FullScreenSlideModal title="Détail de l'opération" fallbackHref="/profile/contributions" headerMode="close">
      <TransactionReceipt transactionId={id} transactionType={type} />
    </FullScreenSlideModal>
  )
}
