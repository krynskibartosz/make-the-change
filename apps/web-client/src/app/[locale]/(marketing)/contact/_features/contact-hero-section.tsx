import { MarketingHero } from '@/app/[locale]/(marketing)/_features/marketing-hero'
import type { ContactHeroProps } from './contact.types'

export function ContactHeroSection({ badge, title, description }: ContactHeroProps) {
  return (
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
          <span className="text-xs font-bold uppercase tracking-widest">{badge}</span>
        </div>
      }
      title={
        <>
          {title.line1} <br className="hidden md:block" />
          <span className="relative inline-block">
            <span className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-marketing-gradient-mid-400 to-marketing-positive-500 opacity-20 blur-2xl" />
            <span className="relative bg-gradient-to-r from-primary via-marketing-gradient-mid-400 to-marketing-positive-500 bg-clip-text text-transparent animate-gradient bg-300%">
              {title.highlight}
            </span>
          </span>
        </>
      }
      description={
        <>
          {description.line1} <br />
          <span className="text-foreground">{description.line2}</span>
        </>
      }
    />
  )
}
