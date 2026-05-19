'use client'
import { formatCompact } from '@/lib/formatters'
import { getProducerAggregatedImpact } from '@/lib/impact-calculator'
import type { LinkedProject } from './species-linked-projects'

type SpeciesProjectStatsProps = {
  linkedProjects: LinkedProject[]
  partnersCount: number
}

export function SpeciesProjectStats({ linkedProjects, partnersCount }: SpeciesProjectStatsProps) {
  if (linkedProjects.length === 0) return null

  const impactStats = getProducerAggregatedImpact(
    linkedProjects.map((p) => ({ current_funding: p.current_funding, type: p.type })),
  )

  if (impactStats.length === 0) return null

  const projectsLabel = linkedProjects.length === 1 ? 'Projet lié' : 'Projets liés'
  const partnersLabel = partnersCount === 1 ? 'Partenaire associé' : 'Partenaires associés'

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Repères des projets liés
      </p>
      <div className='rounded-3xl border border-white/8 bg-white/[0.045] px-4 py-4'>
        <div className='flex flex-wrap gap-x-6 gap-y-3'>
          {impactStats.map((stat) => (
            <div key={stat.kind} className='flex flex-col gap-0.5'>
              <p className='text-xl font-black tabular-nums text-white/90'>
                ≈ {formatCompact(stat.value)}
              </p>
              <p className='text-[11px] font-medium capitalize text-white/45'>{stat.label}</p>
            </div>
          ))}

          <div className='flex flex-col gap-0.5'>
            <p className='text-xl font-black tabular-nums text-white/90'>{linkedProjects.length}</p>
            <p className='text-[11px] font-medium text-white/45'>{projectsLabel}</p>
          </div>

          {partnersCount > 0 && (
            <div className='flex flex-col gap-0.5'>
              <p className='text-xl font-black tabular-nums text-white/90'>{partnersCount}</p>
              <p className='text-[11px] font-medium text-white/45'>{partnersLabel}</p>
            </div>
          )}
        </div>

        <p className='mt-4 text-[11px] leading-relaxed text-white/30'>
          Ces chiffres regroupent les estimations des projets liés à cette espèce dans l&apos;app.
          Ils ne constituent pas une preuve que l&apos;espèce est sauvée ou protégée.
        </p>
      </div>
    </section>
  )
}
