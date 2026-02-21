import { Button } from '@make-the-change/core/ui'
import { ArrowRight, BarChart3, ShieldCheck, Sparkles } from 'lucide-react'
import { DiversityFactLoader } from '@/app/[locale]/(marketing)/(home)/_features/diversity-fact-loader'
import { PageHero } from '@/components/ui/page-hero'
import { Link } from '@/i18n/navigation'
import type { HeroVariantProps } from './hero-lab.types'
import { HeroStatsPills } from './hero-stats-pills'

export function HeroVariantV2({
  copy,
  secondaryCtaLabel,
  heroContextualCta,
  heroStats,
}: HeroVariantProps) {
  return (
    <PageHero.Layout
      size="lg"
      variant="default"
      className="relative min-h-dvh overflow-hidden pt-24 md:pt-36"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(224_45%_8%)_0%,hsl(220_42%_11%)_40%,hsl(211_48%_15%)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_12%_18%,rgba(28,221,165,0.3),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(76,147,255,0.32),transparent_33%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 grid w-full max-w-6xl gap-10 md:gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <BarChart3 className="h-3.5 w-3.5 text-white/90" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
              {copy.badge}
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.88] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-lg font-medium leading-relaxed text-white/72 sm:text-xl md:text-2xl">
            {copy.subtitle}
          </p>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300/95">
            {copy.microProof}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={heroContextualCta.href} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-14 w-full rounded-2xl bg-white px-8 text-sm font-black uppercase tracking-widest text-slate-900 shadow-2xl shadow-cyan-300/20 sm:w-auto hover:bg-white/90"
              >
                {heroContextualCta.label}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-white/25 bg-white/8 px-8 text-sm font-black uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-white/14 sm:w-auto"
            >
              {secondaryCtaLabel}
            </Link>
          </div>

          <HeroStatsPills
            heroStats={heroStats}
            className="justify-start pt-7 [&_span]:border-white/15 [&_span]:bg-white/10 [&_span]:text-white [&_svg]:text-cyan-300"
          />
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/55 p-6 shadow-2xl shadow-cyan-400/15 backdrop-blur-2xl md:p-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:26px_26px] opacity-20"
            aria-hidden="true"
          />
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              Impact Snapshot
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/40 bg-cyan-300/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-200">
              <Sparkles className="h-3 w-3" />
              Live
            </span>
          </div>

          <ul className="m-0 list-none space-y-3 p-0">
            {heroStats.map((heroStat, index) => (
              <li
                key={heroStat.key}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/75">
                    <heroStat.icon className="h-4 w-4 text-cyan-300" />
                    {heroStat.label}
                  </span>
                  <strong className="text-lg font-black tracking-tight text-white">
                    {heroStat.value}
                  </strong>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
                    style={{ width: `${Math.max(25, 100 - index * 22)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              Trust signal
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{copy.microProof}</p>
          </div>
        </aside>
      </div>

      <div className="pt-8 [&_p]:text-white/80 [&_span]:text-cyan-300">
        <DiversityFactLoader />
      </div>
    </PageHero.Layout>
  )
}
