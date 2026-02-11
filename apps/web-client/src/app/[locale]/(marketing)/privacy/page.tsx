import { Button } from '@make-the-change/core/ui'
import { CheckCircle2, Fingerprint, Lock, Mail, Server, Shield } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { MarketingHero } from '@/components/marketing/marketing-hero'
import { MarketingSection } from '@/components/marketing/marketing-section'

export default async function PrivacyPage() {
  const t = await getTranslations('marketing_pages.privacy')

  return (
    <>
      <MarketingHero
        minHeightClassName="min-h-[70vh]"
        titleClassName="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 drop-shadow-sm"
        descriptionClassName="sm:text-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
        background={
          <>
            <div className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-marketing-info-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-3000" />
            <div className="absolute bottom-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000 delay-1000" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-100 text-foreground/20 mask-image-gradient" />
          </>
        }
        badge={
          <div className="inline-flex items-center gap-2 rounded-full border border-marketing-info-500/20 bg-marketing-info-500/5 px-4 py-1.5 text-sm font-medium text-marketing-info-600 dark:text-marketing-info-400 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
            <Shield className="h-4 w-4" />
            <span className="uppercase tracking-widest text-xs font-bold">{t('badge')}</span>
          </div>
        }
        title={
          <>
            {t('hero.title_line1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-marketing-info-600 via-primary to-marketing-info-600 dark:from-marketing-info-400 dark:to-marketing-info-400 animate-gradient bg-300%">
              {t('hero.title_highlight')}
            </span>
          </>
        }
        description={
          <>
            {t('hero.description_line1')} {t('hero.description_line2')}
          </>
        }
        visual={
          <div className="mt-16 relative h-48 w-48 mx-auto animate-in zoom-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-gradient-to-tr from-marketing-info-500 to-primary rounded-[2rem] rotate-3 opacity-20 blur-2xl" />
            <div className="relative h-full w-full bg-background/50 backdrop-blur-xl border border-marketing-overlay-light/20 dark:border-marketing-overlay-light/10 rounded-[2rem] shadow-2xl flex items-center justify-center">
              <Lock className="h-20 w-20 text-foreground/80" />
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-marketing-positive-500 border-4 border-background" />
            </div>
          </div>
        }
      />

      {/* Content Section - Bento Grid Style */}
      <MarketingSection size="lg" className="pb-32" contentClassName="max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {/* Card 1: Data Collection (Wide) */}
          <div className="group md:col-span-2 p-10 rounded-[2.5rem] bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-500">
                <Server className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3">{t('cards.minimal_collection.title')}</h3>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  {t('cards.minimal_collection.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: No Selling (Tall/Colored) */}
          <div className="group md:col-span-1 md:row-span-2 p-10 rounded-[2.5rem] bg-marketing-neutral-900 dark:bg-card text-marketing-overlay-light dark:text-card-foreground relative overflow-hidden shadow-2xl shadow-marketing-info-900/20 hover:-translate-y-1 transition-transform duration-500 flex flex-col justify-between border border-transparent dark:border-border">
            {/* Noise & Glow */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-marketing-info-500/30 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-marketing-overlay-light/10 dark:bg-primary/10 text-marketing-info-300 dark:text-primary backdrop-blur-md border border-marketing-overlay-light/10 dark:border-primary/20 group-hover:rotate-12 transition-transform duration-500">
                <Fingerprint className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black mb-4">{t('cards.data_ownership.title')}</h3>
              <p className="text-marketing-info-100/80 dark:text-muted-foreground font-medium text-lg leading-relaxed mb-8">
                {t('cards.data_ownership.description')}
              </p>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 text-sm font-bold text-marketing-info-300 dark:text-primary uppercase tracking-wider">
                <CheckCircle2 className="h-5 w-5" />
                <span>{t('cards.data_ownership.guarantee')}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Security */}
          <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-background border border-border/50 hover:border-marketing-info-500/30 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 h-40 w-40 bg-marketing-info-500/5 rounded-full blur-3xl transition-all group-hover:bg-marketing-info-500/10" />
            <div className="relative z-10">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-marketing-info-500/10 text-marketing-info-600 dark:text-marketing-info-400">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black mb-3">{t('cards.security.title')}</h3>
              <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                {t('cards.security.description')}
              </p>
            </div>
          </div>

          {/* Card 4: Contact (Action) */}
          <div className="group md:col-span-1 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 hover:bg-primary/10 transition-all duration-500 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Mail className="h-24 w-24 -rotate-12 text-foreground/10" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black mb-2">{t('cards.contact.title')}</h3>
                <p className="text-muted-foreground font-medium text-sm">
                  {t('cards.contact.description')}
                </p>
              </div>
              <Button className="mt-6 w-full rounded-xl font-bold" asChild>
                <a href="mailto:contact@make-the-change.com">{t('cards.contact.cta')}</a>
              </Button>
            </div>
          </div>
        </div>
      </MarketingSection>
    </>
  )
}
