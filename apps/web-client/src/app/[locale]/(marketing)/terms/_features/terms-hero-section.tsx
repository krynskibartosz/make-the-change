import { ScrollText } from 'lucide-react'
import { MarketingHero } from '@/app/[locale]/(marketing)/_features/marketing-hero'
import type { TermsHeroProps } from './terms.types'

export function TermsHeroSection({ badge, title, description }: TermsHeroProps) {
  return (
    <MarketingHero
      minHeightClassName="min-h-[60vh] md:min-h-[50vh]"
      titleClassName="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 text-5xl md:text-7xl lg:text-8xl"
      descriptionClassName="sm:text-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 opacity-80"
      background={
        <>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-marketing-info-500/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-5000" />
        </>
      }
      badge={
        <div className="inline-flex items-center gap-2 rounded-full border border-marketing-info-500/20 bg-marketing-info-500/5 px-4 py-1.5 text-sm font-medium text-marketing-info-600 dark:text-marketing-info-400 backdrop-blur-md mb-8 shadow-sm">
          <ScrollText className="h-4 w-4" />
          <span className="uppercase tracking-widest text-xs font-bold">{badge}</span>
        </div>
      }
      title={<>{title}</>}
      description={<>{description}</>}
      visual={<></>}
    />
  )
}
