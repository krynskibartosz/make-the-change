import { Download, PackageOpen } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { GuidelinesContentShell } from '@/features/brand-guidelines/guidelines-content-shell'
import {
  getBrandGuidelineMetadata,
  resolveGuidelineLocale,
} from '@/features/brand-guidelines/metadata'

const ASSET_ROWS = [
  { key: 'logo_kit', status: 'ready' },
  { key: 'social_templates', status: 'coming' },
  { key: 'presentation', status: 'coming' },
  { key: 'press_photos', status: 'internal' },
] as const

const STATUS_STYLES = {
  ready: 'bg-primary/10 text-primary border-primary/20',
  coming: 'bg-warning/10 text-warning-foreground border-warning/20',
  internal: 'bg-muted text-muted-foreground border-border',
} as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return getBrandGuidelineMetadata(resolveGuidelineLocale(locale), 'assets')
}

export default async function BrandGuidelinesAssetsPage() {
  const t = await getTranslations('brand_guidelines.assets')

  const toc = [
    { id: 'catalog', label: t('catalog_title') },
    { id: 'downloads', label: t('download_title') },
    { id: 'note', label: t('note_title') },
  ]

  return (
    <GuidelinesContentShell title={t('title')} intro={t('intro')} tocItems={toc}>
      <section id="catalog" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('catalog_title')}
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {t('catalog_description')}
        </p>

        <div className="mt-5 space-y-3">
          {ASSET_ROWS.map((asset, index) => {
            const statusLabel = t(`status_${asset.status}`)

            return (
              <article
                key={asset.key}
                className="grid gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm md:grid-cols-[44px_minmax(0,1fr)_auto] md:items-center"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-black uppercase tracking-wide text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-black tracking-tight text-foreground">
                    {t(`items.${asset.key}.name`)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(`items.${asset.key}.usage`)}
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {t(`items.${asset.key}.format`)}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${STATUS_STYLES[asset.status]}`}
                >
                  {statusLabel}
                </span>
              </article>
            )
          })}
        </div>
      </section>

      <section id="downloads" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('download_title')}
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t('download_description')}
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[11px] font-black uppercase tracking-wide text-primary-foreground opacity-60"
          >
            <Download className="h-4 w-4" />
            {t('download_primary')}
          </button>
          <button
            type="button"
            disabled
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-[11px] font-black uppercase tracking-wide text-muted-foreground opacity-70"
          >
            <PackageOpen className="h-4 w-4" />
            {t('download_secondary')}
          </button>
        </div>
      </section>

      <section id="note" className="rounded-3xl border border-warning/30 bg-warning/10 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-warning-foreground">
          {t('note_title')}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t('note_description')}
        </p>
      </section>
    </GuidelinesContentShell>
  )
}
