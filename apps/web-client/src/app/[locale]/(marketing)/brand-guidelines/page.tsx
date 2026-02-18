import { ArrowRight, BookMarked, MessageCircle, Palette, Shapes, Type } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import {
  getBrandGuidelineMetadata,
  resolveGuidelineLocale,
} from '@/app/[locale]/(marketing)/brand-guidelines/_features/metadata'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return getBrandGuidelineMetadata(resolveGuidelineLocale(locale), 'overview')
}

export default async function BrandGuidelinesOverviewPage() {
  const t = await getTranslations('brand_guidelines.overview')
  const tNav = await getTranslations('brand_guidelines.nav')
  const tUi = await getTranslations('brand_guidelines.ui')
  const tLogo = await getTranslations('brand_guidelines.logo')
  const tColors = await getTranslations('brand_guidelines.colors')
  const tTypography = await getTranslations('brand_guidelines.typography')
  const tVoice = await getTranslations('brand_guidelines.voice')
  const tAssets = await getTranslations('brand_guidelines.assets')

  const guideCards = [
    {
      slug: 'logo',
      href: '/brand-guidelines/logo',
      title: tNav('logo'),
      description: tLogo('intro'),
      className: 'bg-marketing-positive-600 text-marketing-overlay-light',
      icon: Shapes,
    },
    {
      slug: 'colors',
      href: '/brand-guidelines/colors',
      title: tNav('colors'),
      description: tColors('intro'),
      className: 'bg-marketing-info-500 text-marketing-overlay-light',
      icon: Palette,
    },
    {
      slug: 'typography',
      href: '/brand-guidelines/typography',
      title: tNav('typography'),
      description: tTypography('intro'),
      className: 'bg-marketing-accent-alt-500 text-marketing-overlay-light',
      icon: Type,
    },
    {
      slug: 'voice',
      href: '/brand-guidelines/voice',
      title: tNav('voice'),
      description: tVoice('intro'),
      className: 'bg-marketing-warning-500 text-marketing-neutral-900',
      icon: MessageCircle,
    },
    {
      slug: 'assets',
      href: '/brand-guidelines/assets',
      title: tNav('assets'),
      description: tAssets('intro'),
      className: 'bg-marketing-surface-elevated text-marketing-overlay-light',
      icon: BookMarked,
    },
  ] as const

  const principles = [
    t('principles.item1'),
    t('principles.item2'),
    t('principles.item3'),
    t('principles.item4'),
    t('principles.item5'),
  ]

  const governanceItems = [t('governance.item1'), t('governance.item2'), t('governance.item3')]

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guideCards.map((card, index) => {
          const Icon = card.icon

          return (
            <Link
              key={card.slug}
              href={card.href}
              className={`${card.className} group relative flex min-h-[220px] flex-col overflow-hidden rounded-3xl border border-border p-5 shadow-sm transition-transform hover:-translate-y-1 md:min-h-[250px] md:p-6`}
            >
              <p className="text-3xl font-black tracking-tight sm:text-4xl">
                {card.title.toLowerCase()}
              </p>
              <p className="mt-2 max-w-[28ch] text-[15px] leading-relaxed opacity-90 sm:text-base">
                {card.description}
              </p>

              <div className="mt-auto flex items-center gap-3 pt-6 text-xs font-black uppercase tracking-wide">
                <span>{tUi('view_guide')}</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>

              <div className="pointer-events-none absolute bottom-3 right-3 opacity-20 transition group-hover:opacity-30">
                <Icon className="h-16 w-16 sm:h-20 sm:w-20" />
              </div>

              <span className="pointer-events-none absolute right-4 top-4 text-xs font-black uppercase opacity-70">
                {String(index + 1).padStart(2, '0')}
              </span>
            </Link>
          )
        })}
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-primary">
              {t('eyebrow')}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t('intro')}
            </p>

            <h3 className="mt-8 text-sm font-black uppercase tracking-wide text-primary">
              {t('principles_title')}
            </h3>
            <ul className="mt-4 space-y-2">
              {principles.map((item, index) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-muted-foreground"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-border bg-muted/40 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-primary">
              {t('governance_title')}
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {governanceItems.map((item) => (
                <li key={item} className="rounded-xl bg-background px-4 py-3 shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  )
}
