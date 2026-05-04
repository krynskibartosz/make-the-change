import { CheckCircle, Lock, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { AssociatedProject } from '@/types/species'

interface ImpactCardProps {
  projects: AssociatedProject[] | null
}

export function ImpactCard({ projects }: ImpactCardProps) {
  if (!projects || projects.length === 0) return null

  const supportedProject = projects.find((p) => p.userParticipation)
  const displayProject = supportedProject ?? projects[0]

  if (!displayProject) return null

  const isSupported = !!supportedProject
  const projectHref = displayProject.slug ? `/projects/${displayProject.slug}` : null

  if (isSupported) {
    const inner = (
      <>
        <CheckCircle className='h-5 w-5 shrink-0 text-emerald-400' />
        <div className='min-w-0 flex-1'>
          <p className='text-[10px] font-bold uppercase tracking-wider text-emerald-400/80'>
            Protégée grâce à votre soutien
          </p>
          <p className='truncate text-sm font-semibold text-white/90'>{displayProject.name}</p>
        </div>
        {projectHref && <ArrowRight className='h-4 w-4 shrink-0 text-emerald-400/50' />}
      </>
    )

    return (
      <div className='mx-5 mt-5'>
        {projectHref ? (
          <Link
            href={projectHref}
            className='flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 transition-colors hover:bg-emerald-500/15'
          >
            {inner}
          </Link>
        ) : (
          <div className='flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3'>
            {inner}
          </div>
        )}
      </div>
    )
  }

  const inner = (
    <>
      <Lock className='h-5 w-5 shrink-0 text-white/30' />
      <div className='min-w-0 flex-1'>
        <p className='text-[10px] font-bold uppercase tracking-wider text-white/40'>
          Soutenez pour révéler cette espèce
        </p>
        <p className='truncate text-sm font-semibold text-white/60'>{displayProject.name}</p>
      </div>
      {projectHref && <ArrowRight className='h-4 w-4 shrink-0 text-white/25' />}
    </>
  )

  return (
    <div className='mx-5 mt-5'>
      {projectHref ? (
        <Link
          href={projectHref}
          className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10'
        >
          {inner}
        </Link>
      ) : (
        <div className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
          {inner}
        </div>
      )}
    </div>
  )
}
