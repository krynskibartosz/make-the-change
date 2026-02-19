import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { Link } from '@/i18n/navigation'

type HomeSectionEmptyStateProps = {
  title: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  variant?: 'default' | 'muted'
}

export const HomeSectionEmptyState = ({
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  variant = 'default',
}: HomeSectionEmptyStateProps) => (
  <MarketingSection title={title} size="lg" variant={variant}>
    <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-border/70 bg-card/60 px-6 py-12 text-center shadow-sm backdrop-blur-sm sm:px-10">
      <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
        {description}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <Link href={primaryCtaHref}>
            {primaryCtaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {secondaryCtaLabel && secondaryCtaHref ? (
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={secondaryCtaHref}>
              {secondaryCtaLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  </MarketingSection>
)
