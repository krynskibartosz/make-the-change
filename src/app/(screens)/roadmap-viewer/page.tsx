'use client'

import { ChevronLeft, CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProjectRoadmap } from '@/features/projects/components/project-roadmap'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import type { Phase } from '@/lib/domain'

export default function RoadmapViewerPage() {
  const router = useRouter()
  const [phases, setPhases] = useState<Phase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const ph = await mockClarusRepository.getPhases()
        setPhases(ph)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground pb-20">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/30 bg-background/80 px-4 py-4 backdrop-blur-xl pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 items-center justify-center rounded-full bg-surface hover:bg-surface-elevated active:scale-95 transition-all"
            aria-label="Retour"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="size-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Planning global</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Vue macro du chantier</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ProjectRoadmap phases={phases} />
        )}
      </main>
    </div>
  )
}
