import { getTranslations } from 'next-intl/server'
import { GuidelinesContentShell } from '@/features/brand-guidelines/guidelines-content-shell'
import {
  getBrandGuidelineMetadata,
  resolveGuidelineLocale,
} from '@/features/brand-guidelines/metadata'

const SCALE_ROWS = [
  { key: 'h1', className: 'text-3xl md:text-5xl font-black tracking-tight' },
  { key: 'h2', className: 'text-2xl md:text-3xl font-black tracking-tight' },
  { key: 'h3', className: 'text-2xl font-bold' },
  { key: 'body', className: 'text-base font-medium' },
  { key: 'caption', className: 'text-sm font-medium text-muted-foreground' },
] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return getBrandGuidelineMetadata(resolveGuidelineLocale(locale), 'typography')
}

export default async function BrandGuidelinesTypographyPage() {
  const t = await getTranslations('brand_guidelines.typography')

  const bestPractices = [
    t('best_practices.item1'),
    t('best_practices.item2'),
    t('best_practices.item3'),
    t('best_practices.item4'),
  ]

  const toc = [
    { id: 'scale', label: t('scale_title') },
    { id: 'weights', label: t('weights_title') },
    { id: 'sample', label: t('sample_title') },
  ]

  return (
    <GuidelinesContentShell title={t('title')} intro={t('intro')} tocItems={toc}>
      <section id="scale" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('scale_title')}
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {t('scale_description')}
        </p>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-background shadow-sm">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[1.1fr_0.7fr_1fr] border-b border-border bg-muted px-3 py-2 text-[10px] font-black uppercase tracking-wide text-muted-foreground">
              <span>{t('table.heading_role')}</span>
              <span>{t('table.heading_size')}</span>
              <span>{t('table.heading_usage')}</span>
            </div>
            {SCALE_ROWS.map((row) => (
              <div
                key={row.key}
                className="grid grid-cols-[1.1fr_0.7fr_1fr] items-center gap-3 border-b border-border px-3 py-3 last:border-b-0"
              >
                <p className={row.className}>{t(`table.rows.${row.key}.label`)}</p>
                <p className="text-sm font-mono text-muted-foreground">
                  {t(`table.rows.${row.key}.size`)}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`table.rows.${row.key}.usage`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="weights" className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-border bg-muted/40 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-primary">
            {t('weights_title')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('weights_description')}
          </p>

          <div className="mt-4 space-y-2 rounded-2xl border border-border bg-background p-4">
            <p className="text-sm font-normal text-foreground">{t('weights_labels.regular')}</p>
            <p className="text-sm font-medium text-foreground">{t('weights_labels.medium')}</p>
            <p className="text-sm font-semibold text-foreground">{t('weights_labels.semibold')}</p>
            <p className="text-sm font-bold text-foreground">{t('weights_labels.bold')}</p>
            <p className="text-sm font-black text-foreground">{t('weights_labels.black')}</p>
          </div>
        </article>

        <article className="rounded-3xl border border-border bg-muted/40 p-5">
          <p className="text-xs font-black uppercase tracking-wide text-primary">
            {t('best_practices_title')}
          </p>
          <ul className="mt-4 space-y-2">
            {bestPractices.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section id="sample" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('sample_title')}
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t('sample_description')}
        </p>

        <div className="mt-5 rounded-3xl border border-border bg-background p-6 shadow-sm">
          <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
            {t('sample_heading')}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {t('sample_body')}
          </p>
          <p className="mt-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary">
            {t('sample_caption')}
          </p>
        </div>
      </section>
    </GuidelinesContentShell>
  )
}
