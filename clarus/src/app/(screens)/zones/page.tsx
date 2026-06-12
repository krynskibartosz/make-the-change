'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import type { Zone } from '@/lib/schemas/clarus'
import { Screen } from '@/app/(screens)/_components/screen'
import { FloatingCTA } from '@/components/ui/floating-cta'
import { Button } from '@/components/ui/button'
import { ChevronRight, Plus } from 'lucide-react'

export default function ZonesPage() {
  const router = useRouter()
  const [zones, setZones] = useState<Zone[]>([])

  useEffect(() => {
    mockClarusRepository.getZones().then(setZones)
  }, [])

  return (
    <Screen title="Zones" backHref="/menu" eyebrow="Référentiel">
      <div className="flex flex-col gap-3 pb-24">
        {zones.map((zone) => (
          <Link
            key={zone.id}
            href={`/zones/${zone.id}/editer`}
            className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border/50 active:bg-surface-elevated transition-colors"
          >
            <div className="flex flex-col gap-1.5">
              <span className="font-medium text-foreground">{zone.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-sm">
                  {zone.type === 'technical' ? 'Technique' : 'Simple'}
                </span>
                {zone.technicalCode && (
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-sm">
                    {zone.technicalCode}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground/40 shrink-0" />
          </Link>
        ))}
        {zones.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Aucune zone pour le moment.
          </div>
        )}
      </div>

      <FloatingCTA>
        <Button className="w-full" onClick={() => router.push('/zones/ajouter')}>
          <Plus className="size-5 mr-2" />
          Nouvelle zone
        </Button>
      </FloatingCTA>
    </Screen>
  )
}
