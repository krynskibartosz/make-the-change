import { getTranslations } from 'next-intl/server'
import { FaqAccordion } from './_features/faq-accordion'
import { FaqShell } from './_features/faq-shell'
import { buildFaqViewModel } from './_features/faq.view-model'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing_pages.faq.meta' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function FaqPage() {
  const t = await getTranslations('marketing_pages.faq')
  const viewModel = await buildFaqViewModel(t)

  return (
    <FaqShell title="FAQ">
      {/* Halo lumineux */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-lime-500/5 blur-[100px] pointer-events-none z-0" />

      {/* HERO */}
      <div className="relative z-10 px-6 pt-24 pb-8 flex flex-col items-start">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.03] px-3 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-lime-400">
            {viewModel.badge}
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance text-white hyphens-none leading-[1.1]">
          {viewModel.title}
        </h1>

        <p className="text-base font-light leading-relaxed text-pretty text-gray-400">
          {viewModel.description}
        </p>
      </div>

      <FaqAccordion
        items={viewModel.items}
        footerTitle={viewModel.footerTitle}
        footerDescription={viewModel.footerDescription}
        footerCta={viewModel.footerCta}
      />
    </FaqShell>
  )
}
