import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { getMockAdvantages } from '../_features/mock-advantages'
import { AdvantagesCatalogClient } from '../_features/advantages-catalog-client'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Catalogue des avantages | Make the Change' }
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdvantagesCatalogPage({ searchParams }: Props) {
  const params = await searchParams
  const typeFilter = typeof params.type === 'string' ? params.type : 'all'
  const advantages = getMockAdvantages()

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
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
              Avantages
            </p>
            <p className="truncate text-sm font-black text-white">Catalogue complet</p>
          </div>
        </div>
      }
      className="bg-[#0B0F15]"
    >
      <AdvantagesCatalogClient advantages={advantages} initialType={typeFilter} />
    </Screen>
  )
}
