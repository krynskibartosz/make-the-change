'use client'

import { Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { KINNU_WORLDS } from '@/lib/kinnu/graph'
import { loadKinnuProgress, computeKinnuScore } from '@/lib/kinnu/bridge'
import { KinnuWorldCard } from './_components/kinnu-world-card'

export default function KinnuHubPage() {
  const router = useRouter()
  const [masteredByWorld, setMasteredByWorld] = useState<Record<string, number>>({})
  const [totalScore, setTotalScore] = useState(0)

  useEffect(() => {
    const progress = loadKinnuProgress()
    const counts: Record<string, number> = {}
    let total = 0

    for (const world of KINNU_WORLDS) {
      const masteryObj = progress[world.id]?.mastery
      const count = masteryObj ? Object.keys(masteryObj).length : 0
      counts[world.id] = count
      total += computeKinnuScore(count)
    }

    setMasteredByWorld(counts)
    setTotalScore(total)
  }, [])

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-5">
      {/* Ambiance */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-emerald-500/6 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Header */}
        <header className="py-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-200/60">
            Prototype — Mode Exploration
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
            La Toile
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/50">
            Explore des écosystèmes réels nœud par nœud. Chaque concept maîtrisé déverrouille les espèces suivantes.
          </p>

          {/* Knowledge Bank global */}
          {totalScore > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-amber-200/20 bg-amber-300/[0.07] px-4 py-2.5">
              <Brain className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-black text-amber-200">
                {totalScore} points Knowledge Bank
              </span>
            </div>
          )}
        </header>

        {/* Worlds grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KINNU_WORLDS.map((world) => (
            <KinnuWorldCard
              key={world.id}
              world={world}
              masteredCount={masteredByWorld[world.id] ?? 0}
              onClick={() => router.push(`/kinnu/${world.id}`)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-center gap-2 pb-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/20">
          <span>Kinnu × Biolingo</span>
          <span>·</span>
          <span>Prototype V1</span>
          <span>·</span>
          <span>Exploration non-linéaire</span>
        </div>
      </div>
    </main>
  )
}
