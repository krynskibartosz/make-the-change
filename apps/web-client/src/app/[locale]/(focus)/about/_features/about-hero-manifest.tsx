import type { AboutHeroProps } from './about.types'

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80'

export function AboutHeroManifest({ overline, title, subtitle, imageAlt }: AboutHeroProps) {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE_URL}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />

      <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-end px-6 pb-16 pt-24 text-center">
        <span className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          {overline}
        </span>
        <h1 className="mx-auto max-w-[18ch] text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-gray-300">{subtitle}</p>
      </div>
    </section>
  )
}
