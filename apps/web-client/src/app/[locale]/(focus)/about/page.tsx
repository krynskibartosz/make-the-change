import { getTranslations } from 'next-intl/server'
import { AboutHeroManifest } from './_features/about-hero-manifest'
import { AboutLetter } from './_features/about-letter'
import { AboutPillarsTimeline } from './_features/about-pillars-timeline'
import { AboutStickyCta } from './_features/about-sticky-cta'
import { AboutTeamCarousel } from './_features/about-team-carousel'
import { buildAboutViewModel } from './_features/about.view-model'

export default async function AboutPage() {
  const t = await getTranslations('about')
  const viewModel = await buildAboutViewModel(t)

  return (
    <>
      <AboutHeroManifest {...viewModel.hero} />
      <AboutPillarsTimeline {...viewModel.pillars} />
      <AboutTeamCarousel {...viewModel.team} />
      <AboutLetter {...viewModel.letter} />
      <AboutStickyCta {...viewModel.cta} />
    </>
  )
}
