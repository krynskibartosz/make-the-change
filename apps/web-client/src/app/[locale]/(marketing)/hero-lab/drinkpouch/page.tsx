import { Button } from '@make-the-change/core/ui'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Droplets,
  ShieldPlus,
  Sparkles,
  X,
} from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getHeroLabCopy } from '@/app/[locale]/(marketing)/hero-lab/_features/hero-lab-copy'
import { HeroLabNav } from '@/app/[locale]/(marketing)/hero-lab/_features/hero-lab-nav'
import { Link } from '@/i18n/navigation'

const formulas = [
  {
    flavor: 'Raspberry Ginger',
    name: 'Immunity+',
    subtitle: 'Strengthen, Defend, Thrive',
    tags: ['0G Sugar', '5 Calories', 'Vitamin C', 'Glutathione'],
    accent: 'from-[#f8c8b8] via-[#f29f87] to-[#d85f58]',
  },
  {
    flavor: 'Lemon',
    name: 'Hydration+',
    subtitle: 'Cellular Replenishment Formula',
    tags: ['0G Sugar', '5 Calories', 'Electrolytes', 'Aquamin'],
    accent: 'from-[#d6f3e5] via-[#98d8c2] to-[#5ba88a]',
  },
  {
    flavor: 'Peach Chamomile',
    name: 'SkinRevive+',
    subtitle: 'Complexion Care Formula',
    tags: ['0G Sugar', '5 Calories', 'Hyaluronic Acid', 'Vitamin E'],
    accent: 'from-[#f4d7ef] via-[#d4a7d8] to-[#9d6fa8]',
  },
  {
    flavor: 'Orange Honey',
    name: 'WellDrip+',
    subtitle: 'All-in-One Wellness Formula',
    tags: ['0G Sugar', '5 Calories', 'B-Complex', 'Zinc'],
    accent: 'from-[#ffe0a6] via-[#ffc973] to-[#f0a84e]',
  },
] as const

const sciencePillars = [
  'IV-inspired nutrient architecture',
  'Bioavailable ingredient selection',
  'Targeted daily-use formulations',
  'Portable premium wellness format',
  'Clean label, no sugar, no sweeteners',
] as const

const sipVsDripRows = [
  { feature: 'Safe for daily routine', sip: true, drip: false },
  { feature: 'No needles, no discomfort', sip: true, drip: false },
  { feature: 'Portable and on-the-go', sip: true, drip: false },
  { feature: 'Clinical-style ingredient stack', sip: true, drip: true },
  { feature: 'Infection risk', sip: false, drip: true },
] as const

const faqItems = [
  {
    q: 'How often can I drink these formulas?',
    a: 'For most users, one pouch per day works well. Hydration-focused formulas can be used more frequently based on activity and climate.',
  },
  {
    q: 'Do formulas require refrigeration?',
    a: 'No. They are shelf-stable. Chilling is optional and only for taste preference.',
  },
  {
    q: 'How is this different from basic hydration drinks?',
    a: 'The formulas are structured around IV-inspired nutrient profiles, not only hydration salts and sweeteners.',
  },
  {
    q: 'Are these formulas tested?',
    a: 'Yes. The concept assumes independent verification for content accuracy and contaminant screening.',
  },
] as const

const pouch101Posts = [
  {
    title: 'Meet the drinkable IV concept',
    excerpt: 'Why portable, bioavailable wellness is replacing occasional clinic-style routines.',
  },
  {
    title: 'Hydration as performance infrastructure',
    excerpt: 'A practical framework for energy, cognition, and recovery in high-output lives.',
  },
  {
    title: 'How to choose the right formula',
    excerpt: 'A simple model to pick immunity, hydration, skin, or full-spectrum support.',
  },
] as const

export const metadata: Metadata = {
  title: 'Hero Lab Drink Pouch',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function HeroLabDrinkPouchPage() {
  const locale = await getLocale()
  const copy = getHeroLabCopy(locale)

  return (
    <main className="bg-[#eeece8] pb-16 text-[#0f1113]">
      <section className="container mx-auto px-4 pb-6 pt-24">
        <HeroLabNav labels={copy.nav} />
      </section>

      <section className="px-4">
        <div className="mx-auto max-w-[1640px] overflow-hidden rounded-[2rem] border border-[#d7d2ca] bg-[#f5f2ec] shadow-[0_28px_90px_rgba(30,24,18,0.08)]">
          <div className="border-b border-[#ddd7ce] bg-[#ece8e0] px-6 py-3">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4f4a42]">
              <span className="inline-flex items-center gap-2">
                <Circle className="h-2.5 w-2.5 fill-[#0f1113] text-[#0f1113]" />
                Free shipping over $100
              </span>
              <span className="text-[#948d83]">/</span>
              <span>Performance starts within</span>
              <span className="rounded-full border border-[#cfc7bc] bg-[#f7f4ef] px-2 py-0.5 text-[10px]">
                Inspired prototype
              </span>
            </div>
          </div>

          <div className="border-b border-[#ddd7ce] px-6 py-5 md:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-2xl font-black tracking-tight">POUCH</div>
              <nav aria-label="DrinkPouch inspired nav" className="hidden md:block">
                <ul className="m-0 flex list-none items-center gap-6 p-0 text-sm font-medium text-[#49453e]">
                  <li>
                    <Link href="/hero-lab/drinkpouch">Shop</Link>
                  </li>
                  <li>
                    <Link href="/hero-lab/drinkpouch">About</Link>
                  </li>
                  <li>
                    <Link href="/hero-lab/drinkpouch">Pouch 101</Link>
                  </li>
                  <li>
                    <Link href="/hero-lab/drinkpouch">FAQs</Link>
                  </li>
                </ul>
              </nav>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-xl border-[#cfc7bc] bg-[#f7f4ef]">
                  Account
                </Button>
                <Button className="rounded-xl">Bag [0]</Button>
              </div>
            </div>
          </div>

          <section className="px-6 pb-12 pt-12 md:px-10 md:pb-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#656056]">
                  Drinkable IV formula
                </p>
                <h1 className="mt-4 max-w-3xl text-balance text-5xl font-black leading-[0.88] tracking-[-0.03em] md:text-7xl">
                  Welcome to Progress
                </h1>
                <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-[#4b473f] md:text-2xl">
                  Powered by IV-inspired formulas, crafted for high performers who demand more from
                  hydration, recovery, and daily wellness.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="rounded-2xl px-8">
                    <Link href="/products">
                      Explore the range
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-2xl border-[#cdc5ba] bg-[#f7f4ef] px-8"
                  >
                    Sound: off
                  </Button>
                </div>
              </div>

              <aside className="relative">
                <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-[#f5d6c5] blur-2xl" />
                <div className="absolute -right-10 bottom-10 h-28 w-28 rounded-full bg-[#d5ede0] blur-2xl" />
                <article className="relative overflow-hidden rounded-[2rem] border border-[#d5cec2] bg-[#f9f6f1] p-7 shadow-[0_18px_55px_rgba(35,29,22,0.1)]">
                  <div
                    className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_25%_20%,rgba(243,169,145,0.45),transparent_45%),radial-gradient(circle_at_82%_78%,rgba(117,196,173,0.42),transparent_40%)]"
                    aria-hidden="true"
                  />
                  <div className="relative z-10">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6d675d]">
                      Formula spotlight
                    </p>
                    <h2 className="mt-2 text-4xl font-black tracking-tight">WellDrip+</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#4f4a42]">
                      Full-spectrum support blending hydration, immune factors and recovery-focused
                      micronutrients.
                    </p>

                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-[#d2cabd] bg-[#f7f3ed] px-3 py-2 text-xs font-bold uppercase tracking-wide">
                        0G sugar
                      </div>
                      <div className="rounded-xl border border-[#d2cabd] bg-[#f7f3ed] px-3 py-2 text-xs font-bold uppercase tracking-wide">
                        5 calories
                      </div>
                      <div className="rounded-xl border border-[#d2cabd] bg-[#f7f3ed] px-3 py-2 text-xs font-bold uppercase tracking-wide">
                        Glutathione
                      </div>
                      <div className="rounded-xl border border-[#d2cabd] bg-[#f7f3ed] px-3 py-2 text-xs font-bold uppercase tracking-wide">
                        Aquamin
                      </div>
                    </div>

                    <Button className="mt-5 rounded-xl bg-[#11151a] text-white hover:bg-[#1c222a]">
                      Add to bag
                    </Button>
                  </div>
                </article>
              </aside>
            </div>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-12 md:px-10 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6b645a]">
              01 / our formulas
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Shop by solution
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#514c43]">
              Wellness that adapts to you. Each formula is purpose-built for hydration, immunity,
              skin support, and complete daily performance.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {formulas.map((formula) => (
                <article
                  key={formula.name}
                  className="group overflow-hidden rounded-[1.4rem] border border-[#d7d0c5] bg-[#faf7f2] shadow-sm"
                >
                  <div className={`h-28 bg-gradient-to-br ${formula.accent}`} />
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#777065]">
                      {formula.flavor}
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight">{formula.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#595348]">
                      {formula.subtitle}
                    </p>
                    <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                      {formula.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-[#d3cbbf] bg-[#f3efe8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#5d574c]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-12 md:px-10 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6b645a]">
              02 / why we exist
            </p>
            <h2 className="mt-4 max-w-6xl text-balance text-4xl font-black leading-[0.95] tracking-[-0.02em] md:text-6xl">
              We exist to keep you at your peak, reimagining IV intent into a portable drink that
              fuels performance and supports recovery every day.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#514c43]">
              Science-backed fluids. Real-world performance. Built for the pace of modern work,
              travel, and training.
            </p>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-12 md:px-10 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6b645a]">
              03 / the science
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Drinkable IV Formula
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sciencePillars.map((pillar) => (
                <article
                  key={pillar}
                  className="rounded-2xl border border-[#d7cfc3] bg-[#f8f4ee] p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold leading-relaxed text-[#433e35]">{pillar}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-12 md:px-10 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6b645a]">
              04 / medically supported
            </p>
            <article className="mt-5 rounded-[1.6rem] border border-[#d5cdbf] bg-[#faf6ef] p-7 shadow-sm">
              <p className="text-lg leading-relaxed text-[#3f3a32] md:text-2xl">
                “This concept translates IV-style nutrient logic into an oral, practical routine
                that better fits daily life while preserving formulation quality.”
              </p>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-[#6a6358]">
                Brooke Aaron, MS, RDN, LDN
              </p>
            </article>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-10 md:px-10">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {['Get focused', 'Feel energized', 'Enhance health', 'Fuel ambition'].map((line) => (
                <article
                  key={line}
                  className="rounded-2xl border border-[#d6cebf] bg-[#f7f3ec] px-4 py-5 text-center"
                >
                  <p className="text-lg font-black tracking-tight">{line}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-12 md:px-10 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6b645a]">
              06 / VarietyPack+
            </p>
            <div className="mt-5 grid items-center gap-8 rounded-[1.7rem] border border-[#d7cfc2] bg-[#f8f4ed] p-7 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-4xl font-black tracking-tight md:text-6xl">
                  One pack. Every formula.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-[#514c43]">
                  Twelve pouches. Four targeted blends. A complete cycle for hydration, immunity,
                  skin, and all-in-one wellness support.
                </p>
                <Button asChild className="mt-6 rounded-xl">
                  <Link href="/products">
                    Discover the VarietyPack+
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="rounded-[1.4rem] border border-[#d0c8ba] bg-[#f2ece2] p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#696257]">
                  Included formulas
                </p>
                <ul className="m-0 mt-4 list-none space-y-2 p-0">
                  {formulas.map((formula) => (
                    <li
                      key={`pack-${formula.name}`}
                      className="flex items-center justify-between rounded-lg border border-[#d4ccbe] bg-[#f8f5f0] px-3 py-2"
                    >
                      <span className="font-semibold">{formula.name}</span>
                      <span className="text-xs font-bold uppercase tracking-wide text-[#6b645a]">
                        3x
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-12 md:px-10 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6b645a]">
              07 / sip vs drip
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              IV Intent. Daily Format.
            </h2>
            <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-[#d8d0c4] bg-[#f8f4ee]">
              <div className="grid grid-cols-[1.5fr_0.5fr_0.5fr] border-b border-[#ddd5ca] bg-[#f1ece4] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#6a6458]">
                <span>Feature</span>
                <span className="text-center">Sip</span>
                <span className="text-center">Drip</span>
              </div>
              {sipVsDripRows.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[1.5fr_0.5fr_0.5fr] items-center border-b border-[#e2dbd0] px-5 py-3 text-sm last:border-b-0"
                >
                  <span className="font-medium text-[#433e35]">{row.feature}</span>
                  <span className="flex justify-center">
                    {row.sip ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <X className="h-4 w-4 text-rose-600" />
                    )}
                  </span>
                  <span className="flex justify-center">
                    {row.drip ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <X className="h-4 w-4 text-rose-600" />
                    )}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#6b655a]">
              Prototype note: educational comparison only. Not medical advice.
            </p>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-12 md:px-10 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6b645a]">
              08 / FAQs
            </p>
            <div className="mt-5 space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-[#d8d0c4] bg-[#f8f4ee] px-5 py-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
                    <span>{item.q}</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#4f4a42]">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="border-t border-[#ddd7ce] px-6 py-12 md:px-10 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6b645a]">
              09 / Pouch 101
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {pouch101Posts.map((post, index) => (
                <article
                  key={post.title}
                  className="rounded-[1.3rem] border border-[#d8d0c4] bg-[#f9f5ef] p-5 shadow-sm"
                >
                  <div
                    className={`h-40 rounded-xl ${
                      index === 0
                        ? 'bg-gradient-to-br from-[#f9cdb5] to-[#e1ab94]'
                        : index === 1
                          ? 'bg-gradient-to-br from-[#c5dfef] to-[#8db7d3]'
                          : 'bg-gradient-to-br from-[#dccceb] to-[#b5a3ca]'
                    }`}
                  />
                  <h3 className="mt-4 text-xl font-black tracking-tight">{post.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#555045]">{post.excerpt}</p>
                  <Link
                    href="/hero-lab/drinkpouch"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold"
                  >
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <footer className="border-t border-[#ddd7ce] bg-[#ece7dd] px-6 py-10 md:px-10">
            <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h3 className="text-3xl font-black tracking-tight md:text-4xl">Inside POUCH</h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#4d483f]">
                  Sign up for early launches, formula updates, and an exclusive welcome offer.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5f594d]">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#cfc7ba] bg-[#f8f5f0] px-3 py-1.5">
                    <Droplets className="h-3.5 w-3.5" />
                    Hydration
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#cfc7ba] bg-[#f8f5f0] px-3 py-1.5">
                    <ShieldPlus className="h-3.5 w-3.5" />
                    Immunity
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#cfc7ba] bg-[#f8f5f0] px-3 py-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Recovery
                  </span>
                </div>
              </div>
              <form className="rounded-2xl border border-[#d2cabc] bg-[#f8f4ee] p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="FIRST NAME"
                    className="h-11 rounded-xl border border-[#d2cabc] bg-[#fbf8f3] px-3 text-sm font-medium outline-none ring-primary/30 focus:ring-2"
                  />
                  <input
                    type="text"
                    placeholder="LAST NAME"
                    className="h-11 rounded-xl border border-[#d2cabc] bg-[#fbf8f3] px-3 text-sm font-medium outline-none ring-primary/30 focus:ring-2"
                  />
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="h-11 flex-1 rounded-xl border border-[#d2cabc] bg-[#fbf8f3] px-3 text-sm font-medium outline-none ring-primary/30 focus:ring-2"
                  />
                  <Button className="h-11 rounded-xl px-6">SIGN UP</Button>
                </div>
              </form>
            </div>
          </footer>
        </div>
      </section>
    </main>
  )
}
