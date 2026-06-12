'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { SegmentedControl } from '@/components/ui'
import { PlansGalleryClient } from './plans-gallery-client'
import { ZoneChantierClient } from './zone-chantier-client'

type TabValue = 'plans' | 'zones'

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('plans')

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex flex-col gap-4 pb-4 px-4 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center gap-3">
          <Link
            href="/chantier"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-elevated active:scale-95 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold leading-tight truncate">Chantier</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Plans & Zones techniques</p>
          </div>
        </div>

        {/* Tabs / Segmented Control */}
        <SegmentedControl
          options={[
            { label: 'Plans', value: 'plans' },
            { label: 'Zones', value: 'zones' },
          ]}
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as TabValue)}
          ariaLabel="Vue plans ou zones"
        />
      </header>

      <div className="flex-1 pt-4">
        {activeTab === 'plans' ? (
          <div className="px-4">
            <PlansGalleryClient />
          </div>
        ) : (
          <div className="pb-4">
            <ZoneChantierClient />
          </div>
        )}
      </div>
    </main>
  )
}
