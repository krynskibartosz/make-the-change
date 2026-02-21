import { Button } from '@make-the-change/core/ui'
import { ArrowDown, ArrowRight, BadgeCheck, Globe2, HeartHandshake, Users } from 'lucide-react'
import { DiversityFactLoader } from '@/app/[locale]/(marketing)/(home)/_features/diversity-fact-loader'
import { PageHero } from '@/components/ui/page-hero'
import { Link } from '@/i18n/navigation'
import type { HeroVariantProps } from './hero-lab.types'
import { HeroStatsPills } from './hero-stats-pills'

const communitySignals = [
  {
    title: 'Shared momentum',
    description: 'Members, producers and investors moving in one direction.',
    icon: Users,
  },
  {
    title: 'Visible progress',
    description: 'Every contribution adds to a measurable, collective outcome.',
    icon: Globe2,
  },
  {
    title: 'Proof over promises',
    description: 'Transparent data and on-the-ground project visibility.',
    icon: BadgeCheck,
  },
] as const

export function HeroVariantV3({
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,hsl(var(--primary)/0.22),transparent_44%),radial-gradient(circle_at_85%_18%,hsl(var(--secondary)/0.24),transparent_36%),linear-gradient(170deg,hsl(var(--background))_0%,hsl(var(--muted)/0.95)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-8 top-40 h-28 w-28 rotate-12 rounded-3xl border border-primary/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-10 top-60 h-20 w-20 -rotate-12 rounded-2xl border border-primary/20"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2">
          <HeartHandshake className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{copy.badge}</span>
        </div>

        <h1 className="mx-auto mt-5 max-w-5xl text-balance text-center text-5xl font-black leading-[0.9] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-balance text-center text-lg font-medium leading-relaxed text-muted-foreground md:text-2xl">
          {copy.subtitle}
        </p>

        <div className="mx-auto mt-7 flex w-fit flex-wrap items-center justify-center gap-2 rounded-2xl border border-border bg-background/75 px-3 py-3 backdrop-blur-sm">
          {['COMMUNITY', 'IMPACT', 'TRUST', 'TRANSPARENCY', 'MOMENTUM'].map((word) => (
            <span
              key={word}
              className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-primary"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href={heroContextualCta.href} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-14 w-full rounded-2xl px-8 text-sm font-black uppercase tracking-widest sm:w-auto"
            >
              {heroContextualCta.label}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-background/80 px-8 text-sm font-black uppercase tracking-widest transition-colors hover:bg-muted sm:w-auto"
          >
            {secondaryCtaLabel}
          </Link>
        </div>

        <p className="pt-6 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-primary/80">
          {copy.microProof}
        </p>

        <div className="mx-auto mt-8 grid w-full max-w-5xl gap-4 sm:grid-cols-3">
          {communitySignals.map((signal) => (
            <article
              key={signal.title}
              className="group rounded-2xl border border-border/80 bg-card/85 p-5 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25"
            >
              <div className="inline-flex rounded-xl border border-primary/20 bg-primary/10 p-2">
                <signal.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-black uppercase tracking-wide text-primary">
                {signal.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {signal.description}
              </p>
            </article>
          ))}
        </div>

        <HeroStatsPills heroStats={heroStats} className="pt-8" />
      </div>

      <PageHero.Content className="w-full pt-2">
        <DiversityFactLoader />

        <div className="mx-auto mt-10 flex h-12 w-12 animate-bounce items-center justify-center rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm">
          <ArrowDown className="h-6 w-6 text-primary" />
        </div>
      </PageHero.Content>
    </PageHero.Layout>
  )
}
