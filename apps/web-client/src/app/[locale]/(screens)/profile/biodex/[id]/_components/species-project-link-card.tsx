import { CheckCircle, Leaf, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { AssociatedProject } from '@/types/species'

interface SpeciesProjectLinkCardProps {
  projects: AssociatedProject[] | null
}

export function SpeciesProjectLinkCard({ projects }: SpeciesProjectLinkCardProps) {
  if (!projects || projects.length === 0) return null

  const supportedProject = projects.find((p) => p.userParticipation)
  const displayProject = supportedProject ?? projects[0]
  if (!displayProject) return null

  const isSupported = !!supportedProject
  const projectHref = displayProject.slug ? `/projects/${displayProject.slug}` : null

  const inner = (
    <div className='flex items-center gap-3 px-4 py-4'>
      {isSupported ? (
        <CheckCircle className='h-5 w-5 shrink-0 text-emerald-400' aria-hidden='true' />
      ) : (
        <Leaf className='h-5 w-5 shrink-0 text-white/30' aria-hidden='true' />
      )}
      <div className='min-w-0 flex-1'>
        <p
          className={`text-[10px] font-black uppercase tracking-wider ${isSupported ? 'text-emerald-400/80' : 'text-white/40'}`}
        >
          {isSupported ? 'Projet lié à ton soutien' : 'Projet lié à cette espèce'}
        </p>
        <p className='mt-0.5 truncate text-sm font-semibold text-white/90'>{displayProject.name}</p>
        <p className='mt-1 text-xs leading-snug text-white/40'>
          {isSupported
            ? 'Cette fiche garde une trace pédagogique de ce lien.'
            : 'Découvre le projet associé à cette espèce.'}
        </p>
      </div>
      {projectHref && (
        <ArrowRight
          className={`h-4 w-4 shrink-0 ${isSupported ? 'text-emerald-400/50' : 'text-white/25'}`}
          aria-hidden='true'
        />
      )}
    </div>
  )

  const className = isSupported
    ? 'block rounded-2xl border border-emerald-500/20 bg-emerald-500/10 transition-colors active:bg-emerald-500/15'
    : 'block rounded-2xl border border-white/10 bg-white/5 transition-colors active:bg-white/[0.08]'

  return (
    <div className='mx-5'>
      {projectHref ? (
        <Link href={projectHref} className={className}>
          {inner}
        </Link>
      ) : (
        <div className={className.replace('block ', '')}>{inner}</div>
      )}
    </div>
  )
}
