import { getTranslations } from 'next-intl/server'
import { buildTermsViewModel } from './_features/terms.view-model'
import { TermsContentSection } from './_features/terms-content-section'
import { TermsHeroSection } from './_features/terms-hero-section'

export default async function TermsPage() {
  const t = await getTranslations('marketing_pages.terms')
  const viewModel = await buildTermsViewModel(t)

  return (
    <>
      <TermsHeroSection {...viewModel.hero} />
      <TermsContentSection {...viewModel.content} />
    </>
  )
}
