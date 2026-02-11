import { ThemePalette } from '@make-the-change/core'
import { getTranslations } from 'next-intl/server'
import { GuidelinesContentShell } from '@/features/brand-guidelines/guidelines-content-shell'
import {
  getBrandGuidelineMetadata,
  resolveGuidelineLocale,
} from '@/features/brand-guidelines/metadata'

const CORE_COLORS = [
  { key: 'emerald', hex: '#58CC02', cssVar: '--primary' },
  { key: 'night', hex: '#4B4B4B', cssVar: '--foreground' },
  { key: 'amber', hex: '#FFC800', cssVar: '--accent' },
  { key: 'offwhite', hex: '#F7F7F7', cssVar: '--background' },
  { key: 'terracotta', hex: '#FF9600', cssVar: '--warning' },
  { key: 'sage', hex: '#AFAFAF', cssVar: '--muted' },
] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return getBrandGuidelineMetadata(resolveGuidelineLocale(locale), 'colors')
}

export default async function BrandGuidelinesColorsPage() {
  const t = await getTranslations('brand_guidelines.colors')

  const toc = [
    { id: 'ratio', label: t('ratio_title') },
    { id: 'palette', label: t('core_palette_title') },
    { id: 'tokens', label: t('tokens_title') },
  ]

  return (
    <GuidelinesContentShell title={t('title')} intro={t('intro')} tocItems={toc}>
      <section id="ratio" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('ratio_title')}
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {t('ratio_description')}
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          <div className="flex h-16 w-full text-[10px] font-black uppercase tracking-wide sm:text-xs">
            <div className="flex w-3/5 items-center justify-center bg-muted px-1 text-center text-muted-foreground">
              {t('ratio_neutral')}
            </div>
            <div className="flex w-3/10 items-center justify-center bg-primary px-1 text-center text-primary-foreground">
              {t('ratio_primary')}
            </div>
            <div className="flex w-1/10 items-center justify-center bg-accent px-1 text-center text-accent-foreground">
              <span className="sm:hidden">10%</span>
              <span className="hidden sm:inline">{t('ratio_accent')}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="palette" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('core_palette_title')}
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {t('core_palette_description')}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CORE_COLORS.map((color) => (
            <article
              key={color.key}
              className="rounded-2xl border border-border bg-background p-4 shadow-sm"
            >
              <div
                className="mb-3 h-20 rounded-xl border border-border"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-base font-black tracking-tight text-foreground">
                {t(`palette.${color.key}.name`)}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t(`palette.${color.key}.role`)}
              </p>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-xs">
                <span className="font-mono text-muted-foreground">{color.hex}</span>
                <span className="ml-auto rounded-full bg-muted px-2 py-1 font-black uppercase tracking-wide text-muted-foreground">
                  {color.cssVar}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="tokens" className="rounded-3xl border border-border bg-muted/40 p-5 md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-primary">
          {t('tokens_title')}
        </p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {t('tokens_description')}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-muted-foreground">
              {t('theme_preview.default')}
            </p>
            <ThemePalette brand="default" currentTheme="light" />
          </article>
          <article className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-muted-foreground">
              {t('theme_preview.ocean')}
            </p>
            <ThemePalette brand="ocean" currentTheme="light" />
          </article>
          <article className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-muted-foreground">
              {t('theme_preview.forest')}
            </p>
            <ThemePalette brand="forest" currentTheme="light" />
          </article>
        </div>
      </section>
    </GuidelinesContentShell>
  )
}
