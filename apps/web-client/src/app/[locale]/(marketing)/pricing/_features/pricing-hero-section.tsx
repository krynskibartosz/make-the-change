import { PageHero } from '@/components/ui/page-hero'
import type { PricingHeroProps } from './pricing.types'

export function PricingHeroSection({ title, subtitle }: PricingHeroProps) {
  return (
    <PageHero title={title} description={subtitle} size="lg" variant="gradient">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-marketing-positive-500/20 blur-[100px]" />
      </div>
    </PageHero>
  )
}
