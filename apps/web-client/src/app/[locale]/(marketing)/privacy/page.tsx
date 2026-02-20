import { getTranslations } from 'next-intl/server'
import { buildPrivacyViewModel } from './_features/privacy.view-model'
import { PrivacyCardsSection } from './_features/privacy-cards-section'
import { PrivacyHeroSection } from './_features/privacy-hero-section'

export default async function PrivacyPage() {
  const t = await getTranslations('marketing_pages.privacy')
  const viewModel = await buildPrivacyViewModel(t)

  return (
    <>
      <PrivacyHeroSection {...viewModel.hero} />
      <PrivacyCardsSection {...viewModel.cards} />
    </>
  )
}
