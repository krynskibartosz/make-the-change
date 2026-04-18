import { getTranslations } from 'next-intl/server'
import { AboutHeroManifest } from './_features/about-hero-manifest'
import { AboutLetter } from './_features/about-letter'
import { AboutPillarsTimeline } from './_features/about-pillars-timeline'
import { AboutStickyCta } from './_features/about-sticky-cta'
import { AboutTeamCarousel } from './_features/about-team-carousel'
import { buildAboutViewModel } from './_features/about.view-model'
import { HomeReveal } from '../../(marketing)/(home)/_features/home-reveal'

export default async function AboutPage() {
  const t = await getTranslations('about')
  const viewModel = await buildAboutViewModel(t)

  return (
    <>
      <AboutHeroManifest {...viewModel.hero} />
      <HomeReveal delay={0.1}>
        <AboutPillarsTimeline {...viewModel.pillars} />
      </HomeReveal>
      <AboutTeamCarousel {...viewModel.team} />
      <AboutLetter {...viewModel.letter} />
      {/* Bottom spacer so the last content is never hidden behind the fixed sticky CTA */}
      <div
        aria-hidden="true"
        style={{ height: 'calc(6rem + env(safe-area-inset-bottom))' }}
      />
      <AboutStickyCta {...viewModel.cta} />
    </>
  )
}
