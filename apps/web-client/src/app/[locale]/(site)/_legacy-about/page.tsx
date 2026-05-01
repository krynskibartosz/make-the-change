import { getTranslations } from 'next-intl/server'
import { buildAboutViewModel } from './_features/about.view-model'
import { AboutCtaSection } from './_features/about-cta-section'
import { AboutHeroSection } from './_features/about-hero-section'
import { AboutMissionSection } from './_features/about-mission-section'
import { AboutTeamSection } from './_features/about-team-section'
import { AboutValuesSection } from './_features/about-values-section'

export default async function AboutPage() {
  const t = await getTranslations('about')
  const viewModel = await buildAboutViewModel(t)

  return (
    <>
      <AboutHeroSection {...viewModel.hero} />
      <AboutMissionSection {...viewModel.mission} />
      <AboutValuesSection {...viewModel.values} />
      <AboutTeamSection {...viewModel.team} />
      <AboutCtaSection {...viewModel.cta} />
    </>
  )
}
