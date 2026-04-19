import { getTranslations } from 'next-intl/server'
import { AboutGenesis } from './_features/about-genesis'
import { AboutHeroManifest } from './_features/about-hero-manifest'
import { AboutLetter } from './_features/about-letter'
import { AboutModelBento } from './_features/about-model-bento'
import { AboutScrollShell } from './_features/about-scroll-shell'
import { AboutStickyCta } from './_features/about-sticky-cta'
import { AboutTeamCarousel } from './_features/about-team-carousel'
import { buildAboutViewModel } from './_features/about.view-model'

export default async function AboutPage() {
  const t = await getTranslations('about')
  const viewModel = await buildAboutViewModel(t)

  return (
    <AboutScrollShell title="À propos">
      <AboutHeroManifest {...viewModel.hero} />
      <AboutGenesis {...viewModel.genesis} />
      <AboutModelBento {...viewModel.model} />
      <AboutTeamCarousel {...viewModel.team} />
      <AboutLetter {...viewModel.letter} />
      <AboutStickyCta {...viewModel.cta} />
    </AboutScrollShell>
  )
}
