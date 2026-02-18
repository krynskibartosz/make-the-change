import { Button } from '@make-the-change/core/ui'
import {
  ArrowRight,
  Globe,
  HelpCircle,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { MarketingHero } from '@/app/[locale]/(marketing)/_features/marketing-hero'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { Link } from '@/i18n/navigation'
import { ContactCopyButton } from './contact-copy-button'

export default async function ContactPage() {
  const t = await getTranslations('marketing_pages.contact')

  const socialLinks = [
    {
      icon: Twitter,
      label: t('social.twitter.label'),
      handle: t('social.twitter.handle'),
      url: 'https://x.com/makethechange',
    },
    {
      icon: Linkedin,
      label: t('social.linkedin.label'),
      handle: t('social.linkedin.handle'),
      url: 'https://www.linkedin.com',
    },
    {
      icon: Instagram,
      label: t('social.instagram.label'),
      handle: t('social.instagram.handle'),
      url: 'https://www.instagram.com/mtc_impact',
    },
  ] as const

  return (
    <>
      <MarketingHero
        minHeightClassName="min-h-[70vh]"
        contentClassName="mx-auto max-w-7xl"
        titleClassName="mx-auto max-w-7xl text-7xl sm:text-8xl lg:text-9xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 drop-shadow-2xl"
        descriptionClassName="sm:text-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
        background={
          <>
            <div className="absolute left-[-10%] top-[-20%] h-[800px] w-[800px] animate-pulse rounded-full bg-primary/20 blur-[150px] mix-blend-multiply duration-3000 dark:mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] animate-pulse rounded-full bg-marketing-gradient-mid-400/20 blur-[150px] mix-blend-multiply delay-1000 duration-5000 dark:mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
          </>
        }
        badge={
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)] backdrop-blur-md animate-in fade-in zoom-in duration-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">{t('badge')}</span>
          </div>
        }
        title={
          <>
            {t('hero.title_line1')} <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-marketing-gradient-mid-400 to-marketing-positive-500 opacity-20 blur-2xl" />
              <span className="relative bg-gradient-to-r from-primary via-marketing-gradient-mid-400 to-marketing-positive-500 bg-clip-text text-transparent animate-gradient bg-300%">
                {t('hero.title_highlight')}
              </span>
            </span>
          </>
        }
        description={
          <>
            {t('hero.description_line1')} <br />
            <span className="text-foreground">{t('hero.description_line2')}</span>
          </>
        }
      />

      <MarketingSection size="lg" className="pb-32" contentClassName="max-w-7xl">
        <div className="mx-auto grid w-full max-w-7xl auto-rows-[350px] grid-cols-1 gap-6 md:grid-cols-6">
          <div className="group relative overflow-hidden rounded-[3rem] border border-border/50 bg-card p-12 text-card-foreground shadow-2xl shadow-marketing-positive-900/10 transition-all duration-700 hover:shadow-marketing-positive-900/20 md:col-span-4">
            <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
            <div className="absolute -mr-20 -mt-20 right-0 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-marketing-positive-500/20 to-marketing-gradient-mid-500/0 blur-[100px] transition-transform duration-1000 group-hover:scale-110" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-marketing-positive-500/20 bg-marketing-positive-500/10 text-marketing-positive-500 shadow-lg backdrop-blur-xl transition-transform duration-500 group-hover:rotate-12">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                  {t('email.title_line1')} <br />
                  <span className="bg-gradient-to-r from-marketing-positive-500 to-marketing-gradient-mid-400 bg-clip-text text-transparent">
                    {t('email.title_line2')}
                  </span>
                </h3>
                <p className="max-w-md text-xl font-medium text-muted-foreground">
                  {t('email.description')}
                </p>
              </div>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  href="mailto:contact@make-the-change.com"
                  className="inline-flex items-center gap-4 text-3xl font-black tracking-tight transition-colors hover:text-marketing-positive-500 md:text-4xl"
                >
                  contact@make-the-change.com
                  <ArrowRight className="h-8 w-8 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                </a>
                <ContactCopyButton
                  srLabel={t('email.copy_label')}
                  className="border-marketing-positive-500/20 bg-marketing-positive-500/10 text-marketing-positive-600 hover:bg-marketing-positive-500/20 hover:text-marketing-positive-700 dark:text-marketing-positive-400 dark:hover:text-marketing-positive-300"
                />
              </div>
            </div>
          </div>

          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[3rem] border border-border/50 bg-card p-10 transition-all duration-700 hover:border-primary/50 hover:shadow-2xl md:col-span-2 md:row-span-2">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-3xl font-black">{t('social.title')}</h3>
              <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                {t('social.description')}
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/item flex items-center justify-between rounded-2xl border border-border/50 bg-muted/50 p-4 transition-colors hover:border-primary/20 hover:bg-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-foreground shadow-sm transition-colors group-hover/item:text-primary">
                      <social.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{social.label}</div>
                      <div className="text-xs text-muted-foreground">{social.handle}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 -translate-x-2 text-primary opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[3rem] border border-border/50 bg-muted/30 p-10 transition-all duration-700 hover:border-marketing-info-500/50 hover:shadow-2xl md:col-span-2">
            <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-marketing-info-500/10 blur-[60px] transition-colors duration-700 group-hover:bg-marketing-info-500/20" />

            <div className="relative z-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-marketing-info-500/10 text-marketing-info-600 transition-transform duration-500 group-hover:scale-110">
                <HelpCircle className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-black">{t('faq_card.title')}</h3>
              <p className="text-sm font-medium text-muted-foreground">
                {t('faq_card.description')}
              </p>
            </div>

            <div className="relative mt-4 space-y-2">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-2 w-full overflow-hidden rounded-full bg-foreground/5"
                >
                  <div
                    className="h-full w-1/2 animate-pulse bg-marketing-info-500/20"
                    style={{ width: `${index * 15 + 35}%`, animationDelay: `${index * 200}ms` }}
                  />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-6 h-12 w-full rounded-2xl border-marketing-info-200 font-bold text-marketing-info-600 hover:bg-marketing-info-50 dark:border-marketing-info-900 dark:text-marketing-info-400 dark:hover:bg-marketing-info-950/30"
              asChild
            >
              <Link href="/faq">{t('faq_card.cta')}</Link>
            </Button>
          </div>

          <div className="group relative flex flex-col justify-between overflow-hidden rounded-[3rem] border border-border/50 bg-card p-10 text-card-foreground transition-all duration-700 hover:border-marketing-accent-alt-500/50 hover:shadow-2xl md:col-span-2">
            <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.03]" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-marketing-accent-alt-500/20 bg-marketing-accent-alt-500/10 text-marketing-accent-alt-500 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                  <MapPin className="h-7 w-7" />
                </div>
                <h3 className="mb-1 text-2xl font-black">{t('office.city')}</h3>
                <p className="text-sm font-medium text-muted-foreground">{t('office.label')}</p>
              </div>
              <div className="animate-pulse rounded-full border border-marketing-accent-alt-500/20 bg-marketing-accent-alt-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-marketing-accent-alt-500">
                {t('office.status')}
              </div>
            </div>

            <div className="relative z-10 mt-6 h-32 overflow-hidden rounded-2xl border border-border/50 bg-muted transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute h-4 w-4 animate-ping rounded-full bg-marketing-accent-alt-500 shadow-[0_0_20px_hsl(var(--marketing-accent-alt)/0.8)]" />
                <div className="relative z-10 h-4 w-4 rounded-full border-2 border-marketing-overlay-light bg-marketing-accent-alt-500 dark:border-marketing-overlay-dark" />
              </div>
              <div className="absolute bottom-2 left-2 font-mono text-[10px] text-muted-foreground">
                {t('office.coordinates')}
              </div>
            </div>
          </div>
        </div>
      </MarketingSection>

      <div className="container mx-auto px-4 pb-20 lg:pb-32">
        <div className="group relative isolate overflow-hidden rounded-[3rem] bg-primary p-12 text-primary-foreground shadow-2xl shadow-primary/30 md:p-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-marketing-gradient-mid-600" />
          <div className="absolute -right-[20%] -top-[50%] h-[100%] w-[100%] animate-blob rounded-full bg-marketing-overlay-light/10 blur-[100px]" />
          <div className="absolute -bottom-[50%] -left-[20%] h-[100%] w-[100%] animate-blob rounded-full bg-marketing-overlay-dark/10 blur-[100px] animation-delay-2000" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

          <div className="relative z-10 flex flex-col items-end justify-between gap-12 md:flex-row">
            <div className="max-w-3xl">
              <h2 className="mb-8 text-6xl font-black leading-[0.85] tracking-tighter opacity-90 transition-opacity group-hover:opacity-100 md:text-8xl">
                {t('cta.title_line1')} <br />
                {t('cta.title_line2')} <br />
                {t('cta.title_line3')}
              </h2>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-marketing-overlay-light/30">
                <div className="h-full w-1/2 animate-[shimmer_2s_infinite] bg-marketing-overlay-light" />
              </div>
            </div>

            <div className="flex w-full flex-col gap-6 md:w-auto">
              <p className="max-w-xs text-xl font-medium opacity-80 md:text-right">
                {t('cta.description')}
              </p>
              <Button
                asChild
                size="lg"
                className="h-20 rounded-full border-4 border-transparent bg-marketing-overlay-light px-12 text-xl font-black text-primary shadow-xl transition-all hover:scale-105 hover:border-primary/20 hover:bg-marketing-overlay-light/90"
              >
                <Link href="/register">
                  {t('cta.primary')}
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
