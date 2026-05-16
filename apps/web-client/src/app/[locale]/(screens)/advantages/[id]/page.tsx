import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { getMockAdvantageById } from '../_features/mock-advantages'
import { AdvantageDetail } from './_features/advantage-detail'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const advantage = getMockAdvantageById(id)
  return {
    title: advantage ? `${advantage.title} | Make the Change` : 'Avantage | Make the Change',
  }
}

export default async function AdvantageDetailPage({ params }: Props) {
  const { id } = await params
  const advantage = getMockAdvantageById(id)

  if (!advantage) notFound()

  if (advantage.type === 'product' && advantage.productSlug) {
    redirect(`/products/${advantage.productSlug}`)
  }

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
          <span className="text-sm font-black text-white">{advantage.partner}</span>
        </div>
      }
      className="bg-[#0B0F15]"
    >
      <AdvantageDetail advantage={advantage} />
    </Screen>
  )
}
