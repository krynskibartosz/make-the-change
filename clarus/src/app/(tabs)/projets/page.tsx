'use client'

import { useEffect, useState } from 'react'
import { PortfolioBoard } from '@/features/projects/components/portfolio-board'
import { mockClarusRepository } from '@/lib/repositories'
import type { DashboardKPIs, Project } from '@/lib/domain'
import { Plus } from 'lucide-react'

export default function ProjetsPage() {
  const [data, setData] = useState<{ project: Project; kpis: DashboardKPIs }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const project = await mockClarusRepository.getProject()
    const kpis = await mockClarusRepository.getDashboardKPIs()
    // Mock multiple projects using the same project data for demo
    setData([{ project, kpis }])
    setLoading(false)
  }

  return (
    <div className="flex flex-col min-h-dvh text-foreground bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col gap-4 p-5 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Projets</h1>
            <p className="text-sm text-muted-foreground">Vue d'ensemble CRM</p>
          </div>
          <button className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors">
            <Plus className="size-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground text-sm">
            Chargement...
          </div>
        ) : (
          <PortfolioBoard projects={data} />
        )}
      </main>
    </div>
  )
}
