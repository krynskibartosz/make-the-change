import { getTranslations } from 'next-intl/server'
import { AboutBackHeader } from './_features/about-back-header'
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
    <div className="fixed inset-0 z-40 flex h-[100dvh] w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#0D1117] text-white">
      <AboutBackHeader title="À propos" />
      <AboutHeroManifest {...viewModel.hero} />
      <AboutGenesis {...viewModel.genesis} />
      <AboutModelBento {...viewModel.model} />
      <AboutTeamCarousel {...viewModel.team} />
      <AboutLetter {...viewModel.letter} />
      <AboutStickyCta {...viewModel.cta} />
    </div>
  )
}
