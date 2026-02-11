import type { PropsWithChildren } from 'react'
import { GuidelinesHero } from '@/features/brand-guidelines/guidelines-hero'
import { GuidelinesNav } from '@/features/brand-guidelines/guidelines-nav'

export default function BrandGuidelinesLayout({ children }: PropsWithChildren) {
  return (
    <section className="bg-muted/40">
      <GuidelinesHero />

      <div className="mx-auto max-w-[1360px] px-4 py-6 md:py-10">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-6 xl:gap-8">
          <aside className="mb-4 lg:col-span-3 lg:mb-0 xl:col-span-2">
            <GuidelinesNav />
          </aside>

          <div className="min-w-0 space-y-8 pb-24 md:pb-16 lg:col-span-9 lg:pb-10 xl:col-span-10">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
