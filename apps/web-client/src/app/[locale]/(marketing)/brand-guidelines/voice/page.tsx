import { CheckCircle2, XCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { GuidelinesContentShell } from '@/features/brand-guidelines/guidelines-content-shell'
import {
  getBrandGuidelineMetadata,
  resolveGuidelineLocale,
} from '@/features/brand-guidelines/metadata'

const PILLAR_KEYS = ['reassuring', 'collective', 'innovative', 'authentic', 'optimistic'] as const

const EXAMPLE_KEYS = ['cta', 'status', 'error', 'onboarding'] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return getBrandGuidelineMetadata(resolveGuidelineLocale(locale), 'voice')
}

export default async function BrandGuidelinesVoicePage() {
  const t = await getTranslations('brand_guidelines.voice')

  const reviewItems = [t('review_items.item1'), t('review_items.item2'), t('review_items.item3')]

  const toc = [
    { id: 'pillars', label: t('pillars_title') },
    { id: 'microcopy', label: t('microcopy_title') },
    { id: 'review', label: t('review_title') },
  ]

  return (
    <GuidelinesContentShell title={t('title')} intro={t('intro')} tocItems={toc}>
      <section id="pillars" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('pillars_title')}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {PILLAR_KEYS.map((key) => (
            <article
              key={key}
              className="rounded-2xl border border-border bg-background p-4 shadow-sm"
            >
              <p className="text-lg font-black tracking-tight text-foreground">
                {t(`pillars.${key}.title`)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`pillars.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="microcopy" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('microcopy_title')}
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t('microcopy_description')}
        </p>

        <div className="mt-5 space-y-3">
          {EXAMPLE_KEYS.map((key) => (
            <article
              key={key}
              className="rounded-2xl border border-border bg-background p-4 shadow-sm"
            >
              <p className="text-base font-black tracking-tight text-foreground">
                {t(`examples.${key}.label`)}
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-3">
                  <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    {t('microcopy_do_label')}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`examples.${key}.good`)}
                  </p>
                </div>
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3">
                  <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-destructive">
                    <XCircle className="h-4 w-4" />
                    {t('microcopy_dont_label')}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`examples.${key}.bad`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="review" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('review_title')}
        </p>
        <ul className="mt-4 space-y-2">
          {reviewItems.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </GuidelinesContentShell>
  )
}
