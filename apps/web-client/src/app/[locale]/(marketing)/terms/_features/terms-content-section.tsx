import { ArrowRight, FileText } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import type { TermsContentProps } from './terms.types'

export function TermsContentSection({ acceptance, evolution, contact }: TermsContentProps) {
  return (
    <MarketingSection size="lg" className="pb-32" contentClassName="max-w-4xl mx-auto">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-marketing-info-500/5 to-transparent blur-3xl" />

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-marketing-neutral-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <FileText className="h-48 w-48 text-foreground" />
          </div>

          <div className="space-y-16 relative z-10">
            {/* Acceptance */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-marketing-info-500/10 text-marketing-info-600 transition-transform group-hover:scale-110">
                  <span className="font-mono font-bold text-lg">01</span>
                </div>
                <h2 className="text-2xl font-black">{acceptance.title}</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed pl-16">
                <p>{acceptance.content}</p>
                <div className="h-1 w-20 bg-marketing-info-500/20 rounded-full mt-8" />
              </div>
            </div>

            {/* Evolution */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <span className="font-mono font-bold text-lg">02</span>
                </div>
                <h2 className="text-2xl font-black">{evolution.title}</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed pl-16">
                <p>{evolution.content}</p>
                <div className="flex gap-2 mt-8">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-2 w-8 rounded-full bg-primary/20 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="group bg-muted/50 rounded-3xl p-8 border border-border/50 mt-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-marketing-info-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-marketing-info-500/20 text-marketing-info-600">
                    <span className="font-mono font-bold text-lg">03</span>
                  </div>
                  <h2 className="text-2xl font-black">{contact.title}</h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed pl-16 mb-6">
                  <p>{contact.content}</p>
                </div>
                <div className="pl-16">
                  <a
                    href="mailto:contact@make-the-change.com"
                    className="inline-flex items-center gap-2 font-bold text-marketing-info-600 hover:text-marketing-info-700 dark:text-marketing-info-400 dark:hover:text-marketing-info-300 transition-colors"
                  >
                    <span>{contact.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingSection>
  )
}
