import { Button } from '@make-the-change/core/ui'
import { LockKeyhole, Sprout, Ticket } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

type HomeFinalCtaSectionProps = {
  variant?: 'default' | 'muted'
}

export async function HomeFinalCtaSection({ variant = 'default' }: HomeFinalCtaSectionProps) {
  const t = await getTranslations('home_v2')

  const reassuranceItems = [
    { key: 'secure', label: t('final_cta.reassurance.secure'), icon: LockKeyhole },
    { key: 'impact', label: t('final_cta.reassurance.impact'), icon: Sprout },
    { key: 'points', label: t('final_cta.reassurance.points'), icon: Ticket },
  ] as const

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Ciel étoilé abstrait ou halo de lumière vert */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(126,211,33,0.1),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black tracking-tight text-foreground dark:text-white sm:text-5xl lg:text-6xl text-balance">
            {t('final_cta.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground dark:text-white/70 sm:text-lg">
            {t('final_cta.subtitle')}
          </p>

          <div className="mx-auto mt-12 mb-8 max-w-md">
            <Link
              href="/projects"
              className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#7ED321] text-lg font-black text-[#121619] shadow-[0_8px_30px_rgb(132,204,22,0.25)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#8cee25] active:scale-95 dark:shadow-[0_0_32px_rgba(126,211,33,0.4)]"
            >
              {t('final_cta.cta') || 'Découvrir les projets'}
            </Link>
            <p className="mt-6 text-sm font-medium text-muted-foreground/60 dark:text-white/50">
              {t('final_cta.microtext')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

