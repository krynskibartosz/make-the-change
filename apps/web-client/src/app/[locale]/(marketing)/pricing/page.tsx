import { getTranslations } from 'next-intl/server';
import { buildPricingViewModel } from './_features/pricing.view-model';
import { PricingHeroSection } from './_features/pricing-hero-section';
import { PricingTiersSection } from './_features/pricing-tiers-section';

export default async function PricingPage() {
  const t = await getTranslations('how_it_works');
  const viewModel = await buildPricingViewModel(t);

  return (
    <>
      <PricingHeroSection {...viewModel.hero} />
      <PricingTiersSection {...viewModel.tiers} />
    </>
  );
}
