import { getTranslations } from 'next-intl/server'
import { buildPrivacyViewModel } from './_features/privacy.view-model'
import { PrivacyCardsSection } from './_features/privacy-cards-section'
import { PrivacyShell } from './_features/privacy-shell'

export default async function PrivacyPage() {
  const t = await getTranslations('marketing_pages.privacy')
  const viewModel = await buildPrivacyViewModel(t)

  return (
    <PrivacyShell title="Confidentialité">
      {/* Halo lumineux */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-lime-500/5 blur-[100px] pointer-events-none z-0" />

      {/* HERO */}
      <div className="relative z-10 px-6 pt-24 pb-10 flex flex-col items-start">
        <span className="text-[10px] font-bold tracking-[0.25em] text-emerald-500 uppercase mb-4">
          {viewModel.hero.badge}
        </span>
        <h1 className="mb-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white hyphens-none">
          {viewModel.hero.title.line1}{' '}
          <span className="text-lime-400">{viewModel.hero.title.highlight}</span>
        </h1>
        <p className="text-balance text-base font-light leading-relaxed text-white/80">
          {viewModel.hero.description.line1} {viewModel.hero.description.line2}
        </p>
      </div>

      <PrivacyCardsSection {...viewModel.cards} />
    </PrivacyShell>
  )
}
