import { getTranslations } from 'next-intl/server'
import { AboutGenesis } from './_features/about-genesis'
import { AboutHeroManifest } from './_features/about-hero-manifest'
import { AboutLetter } from './_features/about-letter'
import { AboutModelBento } from './_features/about-model-bento'
import { AboutStickyCta } from './_features/about-sticky-cta'
import { AboutTeamCarousel } from './_features/about-team-carousel'
import { buildAboutViewModel } from './_features/about.view-model'

export default async function AboutPage() {
  const t = await getTranslations('about')
  const viewModel = await buildAboutViewModel(t)

  return (
    <>
      <AboutHeroManifest {...viewModel.hero} />
      <AboutGenesis {...viewModel.genesis} />
      <AboutModelBento {...viewModel.model} />
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
