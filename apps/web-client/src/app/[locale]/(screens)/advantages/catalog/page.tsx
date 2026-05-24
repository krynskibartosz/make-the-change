import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { filterAdvantagesByType, getMockAdvantages } from '../_features/mock-advantages'
import { AdvantagesCatalogClient } from '../_features/advantages-catalog-client'

type Props = {
  searchParams: Promise<{ type?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Avantages partenaires | Make the Change' }
}

export default async function AdvantagesCatalogPage({ searchParams }: Props) {
  const { type } = await searchParams
  const advantages = filterAdvantagesByType(getMockAdvantages(), type)

  return (
    <Screen
      header={
        <div className="flex w-full items-center gap-3">
          <Link
            href="/advantages"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors active:bg-white/10"
            aria-label="Retour aux avantages"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <span className="text-sm font-black text-white">Avantages partenaires</span>
        </div>
      }
      className="bg-[#0B0F15]"
    >
      <AdvantagesCatalogClient advantages={advantages} />
    </Screen>
  )
}
