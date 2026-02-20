import { getTranslations } from 'next-intl/server';
import { buildPrivacyViewModel } from './_features/privacy.view-model';
import { PrivacyHeroSection } from './_features/privacy-hero-section';
import { PrivacyCardsSection } from './_features/privacy-cards-section';

export default async function PrivacyPage() {
  const t = await getTranslations('marketing_pages.privacy');
  const viewModel = await buildPrivacyViewModel(t);

  return (
    <>
      <PrivacyHeroSection {...viewModel.hero} />
      <PrivacyCardsSection {...viewModel.cards} />
    </>
  );
}
