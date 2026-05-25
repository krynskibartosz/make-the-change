import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { AdvantagesCatalogClient } from '@/app/[locale]/(screens)/advantages/_features/advantages-catalog-client'
import {
  filterAdvantagesByType,
  getMockAdvantages,
} from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'

type Props = {
  searchParams: Promise<{ type?: string }>
}

export default async function AdvantagesCatalogModalPage({ searchParams }: Props) {
  const { type } = await searchParams
  const advantages = filterAdvantagesByType(getMockAdvantages(), type)

  return (
    <FullScreenSlideModal
      fallbackHref="/advantages"
      headerMode="back"
      title="Avantages partenaires"
      className="bg-[#0B0F15]"
      contentClassName="overflow-y-auto"
    >
      <AdvantagesCatalogClient advantages={advantages} />
    </FullScreenSlideModal>
  )
}
