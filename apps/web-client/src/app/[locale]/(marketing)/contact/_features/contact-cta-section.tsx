import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { ContactCtaProps } from './contact.types'

export function ContactCtaSection({ title, description, primary }: ContactCtaProps) {
  return (
    <div className="container mx-auto px-4 pb-20 lg:pb-32">
      <div className="group relative isolate overflow-hidden rounded-[3rem] bg-primary p-12 text-primary-foreground shadow-2xl shadow-primary/30 md:p-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-marketing-gradient-mid-600" />
        <div className="absolute -right-[20%] -top-[50%] h-[100%] w-[100%] animate-blob rounded-full bg-marketing-overlay-light/10 blur-[100px]" />
        <div className="absolute -bottom-[50%] -left-[20%] h-[100%] w-[100%] animate-blob rounded-full bg-marketing-overlay-dark/10 blur-[100px] animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

        <div className="relative z-10 flex flex-col items-end justify-between gap-12 md:flex-row">
          <div className="max-w-3xl">
            <h2 className="mb-8 text-6xl font-black leading-[0.85] tracking-tighter opacity-90 transition-opacity group-hover:opacity-100 md:text-8xl">
              {title.line1} <br />
              {title.line2} <br />
              {title.line3}
            </h2>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-marketing-overlay-light/30">
              <div className="h-full w-1/2 animate-[shimmer_2s_infinite] bg-marketing-overlay-light" />
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 md:w-auto">
            <p className="max-w-xs text-xl font-medium opacity-80 md:text-right">{description}</p>
            <Button
              asChild
              size="lg"
              className="h-20 rounded-full border-4 border-transparent bg-marketing-overlay-light px-12 text-xl font-black text-primary shadow-xl transition-all hover:scale-105 hover:border-primary/20 hover:bg-marketing-overlay-light/90"
            >
              <Link href="/register">
                {primary}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
