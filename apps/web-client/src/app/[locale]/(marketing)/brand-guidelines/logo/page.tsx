import { Badge, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { CheckCircle2, XCircle } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import {
  getBrandGuidelineMetadata,
  resolveGuidelineLocale,
} from '@/features/brand-guidelines/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return getBrandGuidelineMetadata(resolveGuidelineLocale(locale), 'logo')
}

export default async function BrandGuidelinesLogoPage() {
  const t = await getTranslations('brand_guidelines.logo')

  const doItems = [t('do.item1'), t('do.item2'), t('do.item3')]
  const dontItems = [t('dont.item1'), t('dont.item2'), t('dont.item3'), t('dont.item4')]

  const variations = [
    {
      key: 'full',
      src: '/images/logo-full.png',
      bgClass: 'bg-background',
      imageClass: 'max-h-14 w-auto',
    },
    {
      key: 'icon',
      src: '/adopt.svg',
      bgClass: 'bg-background',
      imageClass: 'max-h-20 max-w-[96px]',
    },
    {
      key: 'dark',
      src: '/images/logo-text-on-black.png',
      bgClass: 'bg-client-slate-900',
      imageClass: 'max-h-14 w-auto',
    },
    {
      key: 'light',
      src: '/images/logo-text-on-white.png',
      bgClass: 'bg-client-white',
      imageClass: 'max-h-14 w-auto',
    },
  ] as const

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-2xl font-black tracking-tight text-foreground">
            {t('variations_title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {variations.map((variation) => (
              <article
                key={variation.key}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {t(`variations.${variation.key}`)}
                </p>
                <div
                  className={`flex min-h-[170px] items-center justify-center rounded-xl border border-border p-5 ${variation.bgClass}`}
                >
                  <img
                    src={variation.src}
                    alt={t(`variations.${variation.key}`)}
                    className={variation.imageClass}
                  />
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-client-emerald-500/30 bg-client-emerald-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-client-emerald-700 dark:text-client-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              {t('do_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {doItems.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-client-emerald-500/20 bg-background/80 px-3 py-2 text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-destructive">
              <XCircle className="h-5 w-5" />
              {t('dont_title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dontItems.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-destructive/20 bg-background/80 px-3 py-2 text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-border bg-card/90">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tight text-foreground">
            {t('clear_space_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-[1fr_220px] md:items-end">
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('clear_space_rule')}</p>
            <div className="mt-4 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{t('min_size_title')}</p>
              <p className="mt-2">{t('min_size_web')}</p>
              <p>{t('min_size_print')}</p>
            </div>
          </div>
          <Badge className="w-fit rounded-full bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            {t('main_logo_title')}
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
