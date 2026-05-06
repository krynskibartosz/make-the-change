import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
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
      <section aria-labelledby="privacy-title" className="relative z-10 px-6 pt-24 pb-10 flex flex-col items-start">
        <span className="text-[10px] font-bold tracking-[0.25em] text-emerald-500 uppercase mb-4" aria-hidden="true">
          {viewModel.hero.badge}
        </span>
        <h2 id="privacy-title" className="mb-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white hyphens-none">
          {viewModel.hero.title.line1}{' '}
          <span className="text-lime-400">{viewModel.hero.title.highlight}</span>
        </h2>
        <p className="text-balance text-base font-light leading-relaxed text-white/80">
          {viewModel.hero.description.line1} {viewModel.hero.description.line2}
        </p>
      </section>

      <PrivacyCardsSection {...viewModel.cards} />

      {/* FULL POLICY LINK */}
      <section className="relative z-10 px-6 pb-20 pt-4 flex flex-col items-center text-center">
        <p className="text-sm text-gray-400 mb-2">Pour plus de détails sur le traitement de vos données :</p>
        <Link
          href="/legal/privacy"
          className="text-sm font-bold text-lime-400 hover:text-lime-300 transition-colors"
        >
          Consulter la politique de confidentialité complète
        </Link>
      </section>
    </PrivacyShell>
  )
}
