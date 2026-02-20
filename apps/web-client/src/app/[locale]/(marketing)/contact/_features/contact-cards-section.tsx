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
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { Link } from '@/i18n/navigation'
import { ContactCopyButton } from '../contact-copy-button'
import type { ContactCardsProps } from './contact.types'

const iconMap = {
  Twitter,
  Linkedin,
  Instagram,
}

export function ContactCardsSection({ email, social, faq, office }: ContactCardsProps) {
  return (
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
                {email.title.line1} <br />
                <span className="bg-gradient-to-r from-marketing-positive-500 to-marketing-gradient-mid-400 bg-clip-text text-transparent">
                  {email.title.line2}
                </span>
              </h3>
              <p className="max-w-md text-xl font-medium text-muted-foreground">
                {email.description}
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
                srLabel={email.copyLabel}
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
            <h3 className="mb-4 text-3xl font-black">{social.title}</h3>
            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
              {social.description}
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            {social.links.map((link) => {
              const Icon = iconMap[link.iconName]
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/item flex items-center justify-between rounded-2xl border border-border/50 bg-muted/50 p-4 transition-colors hover:border-primary/20 hover:bg-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-foreground shadow-sm transition-colors group-hover/item:text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{link.label}</div>
                      <div className="text-xs text-muted-foreground">{link.handle}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 -translate-x-2 text-primary opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="group relative flex flex-col justify-between overflow-hidden rounded-[3rem] border border-border/50 bg-muted/30 p-10 transition-all duration-700 hover:border-marketing-info-500/50 hover:shadow-2xl md:col-span-2">
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-marketing-info-500/10 blur-[60px] transition-colors duration-700 group-hover:bg-marketing-info-500/20" />

          <div className="relative z-10">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-marketing-info-500/10 text-marketing-info-600 transition-transform duration-500 group-hover:scale-110">
              <HelpCircle className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-black">{faq.title}</h3>
            <p className="text-sm font-medium text-muted-foreground">{faq.description}</p>
          </div>

          <div className="relative mt-4 space-y-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className="h-2 w-full overflow-hidden rounded-full bg-foreground/5">
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
            <Link href="/faq">{faq.cta}</Link>
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
              <h3 className="mb-1 text-2xl font-black">{office.city}</h3>
              <p className="text-sm font-medium text-muted-foreground">{office.label}</p>
            </div>
            <div className="animate-pulse rounded-full border border-marketing-accent-alt-500/20 bg-marketing-accent-alt-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-marketing-accent-alt-500">
              {office.status}
            </div>
          </div>

          <div className="relative z-10 mt-6 h-32 overflow-hidden rounded-2xl border border-border/50 bg-muted transition-transform duration-500 group-hover:scale-[1.02]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute h-4 w-4 animate-ping rounded-full bg-marketing-accent-alt-500 shadow-[0_0_20px_hsl(var(--marketing-accent-alt)/0.8)]" />
              <div className="relative z-10 h-4 w-4 rounded-full border-2 border-marketing-overlay-light bg-marketing-accent-alt-500 dark:border-marketing-overlay-dark" />
            </div>
            <div className="absolute bottom-2 left-2 font-mono text-[10px] text-muted-foreground">
              {office.coordinates}
            </div>
          </div>
        </div>
      </div>
    </MarketingSection>
  )
}
