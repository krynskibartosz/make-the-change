import { Button } from '@make-the-change/core/ui'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'
import { DiversityFactLoader } from '@/app/[locale]/(marketing)/(home)/_features/diversity-fact-loader'
import { PageHero } from '@/components/ui/page-hero'
import { Link } from '@/i18n/navigation'
import type { HeroVariantProps } from './hero-lab.types'
import { HeroStatsPills } from './hero-stats-pills'

export function HeroVariantV1({
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,hsl(var(--primary)/0.32),transparent_44%),radial-gradient(circle_at_86%_22%,hsl(var(--secondary)/0.28),transparent_42%),linear-gradient(165deg,hsl(var(--background))_0%,hsl(var(--muted)/0.92)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-28 top-24 h-[28rem] w-[28rem] animate-blob rounded-full bg-primary/25 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-8 h-[30rem] w-[30rem] animate-blob rounded-full bg-secondary/20 blur-[120px]"
        aria-hidden="true"
      />
      <p
        className="pointer-events-none absolute left-4 top-[7.5rem] -z-0 text-[15vw] font-black uppercase leading-none tracking-tighter text-foreground/[0.03] md:left-10 md:top-24"
        aria-hidden="true"
      >
        Wild
      </p>

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-left">
          <PageHero.Badge className="mb-5 animate-none">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/75 px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                {copy.badge}
              </span>
            </span>
          </PageHero.Badge>

          <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.9] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl">
            {copy.title}
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg font-medium leading-relaxed text-muted-foreground md:text-2xl">
            {copy.subtitle}
          </p>

          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.24em] text-primary/85">
            {copy.microProof}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
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

          <HeroStatsPills heroStats={heroStats} className="justify-start pt-7" />
        </div>

        <aside className="relative">
          <div className="grid gap-4">
            <article className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card/80 p-6 shadow-2xl backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/80">
                Impact Scene 01
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight">
                Nature is not a metric. It is a story.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                High contrast narrative framing inspired by editorial campaign landings.
              </p>
              <div
                className="pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full border border-primary/25"
                aria-hidden="true"
              />
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl border border-border bg-card/75 p-5 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/80">
                  Scene 02
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                  Tactile grain, strong type and asymmetric composition.
                </p>
              </article>
              <article className="rounded-3xl border border-border bg-card/75 p-5 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/80">
                  Scene 03
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                  A hero built to feel authored, not auto-generated.
                </p>
              </article>
            </div>
          </div>
        </aside>
      </div>

      <PageHero.Content className="w-full pt-8">
        <DiversityFactLoader />
        <div className="mx-auto mt-10 flex h-12 w-12 animate-bounce items-center justify-center rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm">
          <ArrowDown className="h-6 w-6 text-primary" />
        </div>
      </PageHero.Content>
    </PageHero.Layout>
  )
}
