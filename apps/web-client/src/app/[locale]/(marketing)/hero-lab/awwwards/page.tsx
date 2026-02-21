import { Button } from '@make-the-change/core/ui'
import {
  ArrowRight,
  BadgeCheck,
  CircuitBoard,
  Globe2,
  Layers3,
  Play,
  Sparkles,
  Users,
  Waves,
} from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getHeroLabCopy } from '@/app/[locale]/(marketing)/hero-lab/_features/hero-lab-copy'
import { HeroLabNav } from '@/app/[locale]/(marketing)/hero-lab/_features/hero-lab-nav'
import { Link } from '@/i18n/navigation'

const ecosystemNodes = [
  {
    label: 'Contributors',
    value: '4.2K',
    icon: Users,
    className: 'left-[6%] top-[22%] md:left-[10%] md:top-[18%]',
  },
  {
    label: 'Verified projects',
    value: '217',
    icon: BadgeCheck,
    className: 'left-[68%] top-[14%] md:left-[72%] md:top-[16%]',
  },
  {
    label: 'Live discussions',
    value: '1.8K',
    icon: Sparkles,
    className: 'left-[74%] top-[66%] md:left-[79%] md:top-[66%]',
  },
  {
    label: 'Regions tracked',
    value: '31',
    icon: Globe2,
    className: 'left-[9%] top-[72%] md:left-[16%] md:top-[70%]',
  },
] as const

const dataRibbons = [
  {
    label: 'Impact stream',
    className:
      'top-[20%] h-10 rotate-[5deg] bg-gradient-to-r from-emerald-500/85 via-lime-400/65 to-emerald-600/80',
  },
  {
    label: 'Rewards stream',
    className:
      'top-[44%] h-9 rotate-[-3deg] bg-gradient-to-r from-fuchsia-500/80 via-purple-500/75 to-pink-500/80',
  },
  {
    label: 'Commerce stream',
    className:
      'top-[65%] h-9 rotate-[7deg] bg-gradient-to-r from-orange-400/85 via-amber-300/75 to-orange-500/85',
  },
] as const

export const metadata: Metadata = {
  title: 'Hero Lab Awwwards',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function HeroLabAwwwardsPage() {
  const locale = await getLocale()
  const copy = getHeroLabCopy(locale)

  return (
    <main className="relative bg-background pb-20">
      <section className="container mx-auto px-4 pb-6 pt-24">
        <HeroLabNav labels={copy.nav} />
      </section>

      <section className="px-4">
        <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2.6rem] border border-white/10 bg-[#06080f] text-white shadow-[0_35px_120px_rgba(2,5,18,0.68)]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(39,225,170,0.33),transparent_36%),radial-gradient(circle_at_84%_14%,rgba(76,132,255,0.35),transparent_34%),radial-gradient(circle_at_50%_80%,rgba(190,94,255,0.26),transparent_38%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.08]"
            aria-hidden="true"
          />

          <div className="relative z-20 px-6 pb-12 pt-8 md:px-10 md:pb-16">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-md">
                <CircuitBoard className="h-4 w-4 text-cyan-300" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/85">
                  Make the Change / Awwwards prototype
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1 backdrop-blur-md">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-900">
                  Home
                </span>
                <span className="px-3 text-xs font-bold uppercase tracking-wide text-white/75">
                  Story
                </span>
                <span className="px-3 text-xs font-bold uppercase tracking-wide text-white/75">
                  Product
                </span>
              </div>
            </header>

            <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.03fr_0.97fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300/95">
                  Not another template hero
                </p>
                <h1 className="mt-5 max-w-5xl text-balance text-5xl font-black leading-[0.86] tracking-[-0.035em] sm:text-6xl md:text-7xl lg:text-8xl">
                  Build a
                  <span className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-300 bg-clip-text text-transparent">
                    {' '}
                    living brand{' '}
                  </span>
                  around impact.
                </h1>
                <p className="mt-7 max-w-2xl text-balance text-lg leading-relaxed text-white/70 md:text-2xl">
                  Award-level storytelling for Make the Change: cinematic depth, bold hierarchy,
                  product staging and social proof in the first five seconds.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <Link href="/projects" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="h-14 w-full rounded-2xl bg-white px-8 text-sm font-black uppercase tracking-widest text-slate-900 shadow-2xl shadow-cyan-300/20 hover:bg-white/92 sm:w-auto"
                    >
                      Enter experience
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link
                    href="/hero-lab/v3"
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 text-sm font-black uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:w-auto"
                  >
                    <Play className="h-4 w-4" />
                    Open V3 concept
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {['Cinematic Layers', 'Editorial Typography', 'Interactive Product Stage'].map(
                    (signal) => (
                      <p
                        key={signal}
                        className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/80"
                      >
                        {signal}
                      </p>
                    ),
                  )}
                </div>
              </div>

              <aside className="relative">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950/55 p-6 shadow-2xl shadow-cyan-300/12 backdrop-blur-xl md:p-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200/90">
                    Biodiversity command stage
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">Impact Console</h2>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <article className="rounded-xl border border-white/15 bg-white/5 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                        Active projects
                      </p>
                      <p className="mt-2 text-3xl font-black tracking-tight text-white">217</p>
                    </article>
                    <article className="rounded-xl border border-white/15 bg-white/5 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                        Member actions
                      </p>
                      <p className="mt-2 text-3xl font-black tracking-tight text-white">8.4K</p>
                    </article>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                        Restoration progress
                      </p>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                        +32%
                      </p>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[44, 58, 72].map((height, index) => (
                        <div
                          key={String(height)}
                          className="rounded-lg border border-white/10 bg-black/20 p-2"
                        >
                          <div
                            className="rounded-md bg-gradient-to-t from-fuchsia-400/75 to-cyan-300/85"
                            style={{ height: `${height}px` }}
                          />
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-white/60">
                            q{index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
                      Premium signal
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      This layout is purpose-built to feel authored and memorable, not generated.
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            <div className="relative mt-14 h-[330px] overflow-hidden rounded-[2rem] border border-white/15 bg-black/30 md:h-[420px]">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-cyan-300/50 bg-cyan-300/12 backdrop-blur-md">
                <Waves className="h-9 w-9 text-cyan-200" />
              </div>

              {ecosystemNodes.map((node) => (
                <article
                  key={node.label}
                  className={`absolute rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm ${node.className}`}
                >
                  <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
                    <node.icon className="h-3.5 w-3.5 text-cyan-300" />
                    {node.label}
                  </p>
                  <p className="mt-1 text-xl font-black tracking-tight text-white">{node.value}</p>
                </article>
              ))}
            </div>
          </div>

          <section className="relative isolate overflow-hidden border-t border-black/10 bg-[#f3ecde] px-6 py-12 text-[#1f1811] md:px-10 md:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_15%,rgba(188,118,255,0.24),transparent_35%),radial-gradient(circle_at_86%_30%,rgba(40,161,255,0.2),transparent_34%)]"
              aria-hidden="true"
            />

            <h2 className="relative z-10 max-w-4xl text-balance text-4xl font-black leading-[0.92] tracking-[-0.02em] md:text-6xl">
              From data noise to narrative momentum.
            </h2>
            <p className="relative z-10 mt-4 max-w-2xl text-lg leading-relaxed text-[#3f352a]">
              Inspired by Feldera-like data ribbons and Vercel-grade clarity: one continuous visual
              flow from contribution to real-world biodiversity outcomes.
            </p>

            <div className="relative z-10 mt-10 h-64 overflow-hidden rounded-[1.8rem] border border-black/10 bg-[#f8f2e7] md:h-72">
              {dataRibbons.map((ribbon) => (
                <div
                  key={ribbon.label}
                  className={`absolute left-[-8%] w-[116%] rounded-full ${ribbon.className}`}
                  aria-hidden="true"
                />
              ))}

              <div className="absolute left-[12%] top-[14%] rounded-xl border border-black/20 bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">
                Signal intake
              </div>
              <div className="absolute left-[44%] top-[43%] rounded-xl border border-black/20 bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">
                Impact scoring
              </div>
              <div className="absolute left-[74%] top-[66%] rounded-xl border border-black/20 bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">
                Rewards loop
              </div>
            </div>

            <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Visual Hierarchy',
                  description: 'Massive headline contrast and deliberate whitespace orchestration.',
                  icon: Layers3,
                },
                {
                  title: 'Product-as-Story',
                  description:
                    'The interface itself becomes the storytelling object, not decoration.',
                  icon: CircuitBoard,
                },
                {
                  title: 'Brand Signature',
                  description:
                    'Distinctive mood, rhythm and geometry impossible to confuse with templates.',
                  icon: Sparkles,
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-black/10 bg-white/65 p-5 backdrop-blur-sm"
                >
                  <item.icon className="h-6 w-6 text-[#5f3acb]" />
                  <h3 className="mt-3 text-xl font-black tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4b4034]">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
          <p className="text-sm font-medium text-muted-foreground">
            If this direction matches your ambition, we can now migrate it to the real homepage.
          </p>
          <div className="flex items-center gap-2">
            <Button asChild className="rounded-xl">
              <Link href="/hero-lab/v1">
                Compare V1
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/">Open current home</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
