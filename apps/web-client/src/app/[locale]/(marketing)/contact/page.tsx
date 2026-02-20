import { getTranslations } from 'next-intl/server'
import { buildContactViewModel } from './_features/contact.view-model'
import { ContactCardsSection } from './_features/contact-cards-section'
import { ContactCtaSection } from './_features/contact-cta-section'
import { ContactHeroSection } from './_features/contact-hero-section'

export default async function ContactPage() {
  const t = await getTranslations('marketing_pages.contact')
  const viewModel = await buildContactViewModel(t)

  return (
    <>
      <ContactHeroSection {...viewModel.hero} />
      <ContactCardsSection {...viewModel.cards} />
      <ContactCtaSection {...viewModel.cta} />
    </>
  )
}
