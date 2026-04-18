import { HeroParallaxBackground } from '../../../(marketing)/(home)/_features/hero-parallax-background'
import type { AboutHeroProps } from './about.types'

const HERO_VIDEO_URL = '/videos/home-header.mp4'
const HERO_POSTER_URL = '/images/home-header-poster.jpeg'

export function AboutHeroManifest({ overline, title, subtitle, imageAlt }: AboutHeroProps) {
  return (
    <section
      className="relative min-h-[85vh] w-full overflow-hidden bg-black"
      aria-label={imageAlt}
    >
      <HeroParallaxBackground videoUrl={HERO_VIDEO_URL} posterUrl={HERO_POSTER_URL} />

      {/* Subtle top vignette for overline legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* Long bottom fade-to-black for organic transition to next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-black/70 to-black" />

      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-end px-6 pb-20 pt-24 text-center">
        <span className="mb-5 text-[11px] font-semibold uppercase tracking-[0.4em] text-amber-400/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          {overline}
        </span>
        <h1 className="mx-auto max-w-[14ch] text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-[85%] text-sm leading-relaxed text-white/70 sm:text-base sm:max-w-md">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
