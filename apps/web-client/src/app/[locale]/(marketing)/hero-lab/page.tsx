import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { getHeroLabCopy } from '@/app/[locale]/(marketing)/hero-lab/_features/hero-lab-copy'
import { HeroLabNav } from '@/app/[locale]/(marketing)/hero-lab/_features/hero-lab-nav'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Hero Lab',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function HeroLabIndexPage() {
  const locale = await getLocale()
  const copy = getHeroLabCopy(locale)

  return (
    <main className="container mx-auto space-y-8 px-4 pb-16 pt-24">
      <HeroLabNav labels={copy.nav} />

      <section className="rounded-[2rem] border bg-card p-8 md:p-12">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          {copy.index.eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-balance text-4xl font-black tracking-tight md:text-6xl">
          {copy.index.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {copy.index.description}
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="h-12 rounded-xl px-6 text-xs font-black uppercase">
            <Link href="/">
              {copy.index.openHome}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {copy.cards.map((card) => (
          <article
            key={card.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/25"
          >
            <h2 className="text-2xl font-black tracking-tight">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
            <div className="mt-6">
              <Link
                href={card.href}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors hover:border-primary/20 hover:text-primary"
              >
                {card.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
