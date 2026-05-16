import { notFound, redirect } from 'next/navigation'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getMockAdvantageById } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { AdvantageDetail } from '@/app/[locale]/(screens)/advantages/[id]/_features/advantage-detail'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdvantageDetailModalPage({ params }: Props) {
  const { id } = await params
  const advantage = getMockAdvantageById(id)

  if (!advantage) notFound()

  if (advantage.type === 'product' && advantage.productSlug) {
    redirect(`/products/${advantage.productSlug}`)
  }

  return (
    <FullScreenSlideModal fallbackHref="/advantages" headerMode="back" title={advantage.partner}>
      <AdvantageDetail advantage={advantage} />
    </FullScreenSlideModal>
  )
}
