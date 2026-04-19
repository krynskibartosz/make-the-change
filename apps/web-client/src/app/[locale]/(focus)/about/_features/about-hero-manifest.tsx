import { HeroParallaxBackground } from '../../../(marketing)/(home)/_features/hero-parallax-background'
import type { AboutHeroProps } from './about.types'

const HERO_VIDEO_URL = '/videos/home-header.mp4'
const HERO_POSTER_URL = '/images/home-header-poster.jpeg'

export function AboutHeroManifest({ overline, title, subtitle, imageAlt }: AboutHeroProps) {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black px-6 pb-16 pt-12"
      aria-label={imageAlt}
    >
      <HeroParallaxBackground videoUrl={HERO_VIDEO_URL} posterUrl={HERO_POSTER_URL} />

      {/* Same gradient structure as home: fade to page background from bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/90 via-30% to-transparent"
      />

      <div className="relative z-10 w-full text-center py-12">
        <span className="mb-5 block text-[11px] font-semibold uppercase tracking-[0.4em] text-amber-400/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          {overline}
        </span>
        <h1 className="mx-auto max-w-[14ch] text-[40px] font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-[85%] text-[15px] leading-relaxed text-white/75 sm:max-w-md sm:text-base">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
