import { ArrowRight, MapPin, Newspaper } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'

export type SupportedProjectCard = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  fundingProgress: number
  amountSupported: number
  supportedAt: string
  href: string
  latestUpdate: {
    title: string
    postedAt: string
  } | null
}

export type AccueilProjectCard = {
  name: string
  description: string
  href: string
  location: string
  imageUrl: string | null
  fundingProgress: number
  typeLabel: string
  impactValue: number
  impactLabel: string
}

type AccueilTabProps = {
  displayName: string | null
  supportedProjects: SupportedProjectCard[]
  recommendedProject: AccueilProjectCard | null
  impactPoints: number
}

function formatRelativeUpdate(iso: string): string {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "aujourd'hui"
    if (diffDays === 1) return 'hier'
    if (diffDays < 7) return `il y a ${diffDays} j`
    if (diffDays < 30) return `il y a ${Math.floor(diffDays / 7)} sem`
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
  } catch {
    return ''
  }
}

function SupportedProjectCardView({ project }: { project: SupportedProjectCard }) {
  return (
    <Link
      href={project.href}
      className="group block text-left transition-transform duration-200 active:scale-[0.98]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-white/5">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <MapPin className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="mt-3 px-1">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-lime-400/80">
          Tu soutiens
        </p>
        <h3 className="mt-1 text-[20px] font-black leading-[1.1] tracking-tight text-white">
          {project.name}
        </h3>

        <p className="mt-2 text-[13px] text-white/55">
          <span className="font-bold text-white">{project.amountSupported} €</span> apportés
        </p>

        {project.latestUpdate ? (
          <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-white/70">
            <Newspaper className="mt-[3px] h-3.5 w-3.5 shrink-0 text-teal-300/80" aria-hidden="true" />
            <span>
              <span className="font-semibold text-teal-300">Du terrain · {formatRelativeUpdate(project.latestUpdate.postedAt)}</span>{' '}
              · {project.latestUpdate.title}
            </span>
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between text-[12px]">
          <span className="font-semibold tabular-nums text-white/50">
            {project.fundingProgress}% financé
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-white/70">
            Voir le projet
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function RecommendedProjectView({ project }: { project: AccueilProjectCard }) {
  return (
    <Link
      href={project.href}
      className="group block text-left transition-transform duration-200 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white/5">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <MapPin className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="mt-3 px-1">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
          {project.typeLabel}
        </p>
        <h3 className="mt-1 text-[22px] font-black leading-[1.1] tracking-tight text-white">
          {project.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-[13px] text-white/55">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{project.location}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-white/60">
          {project.description}
        </p>

        <div className="mt-4 flex items-baseline gap-2 text-[13px]">
          <span className="text-[18px] font-black tabular-nums tracking-tight text-lime-400">
            {formatCompact(project.impactValue)}
          </span>
          <span className="font-medium text-white/60">{project.impactLabel}</span>
        </div>
      </div>
    </Link>
  )
}

export function AccueilTab({
  displayName,
  supportedProjects,
  recommendedProject,
}: AccueilTabProps) {
  const firstName = displayName?.split(' ')[0] ?? null
  const hasSupportedProjects = supportedProjects.length > 0

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 pb-24 pt-[max(1.5rem,env(safe-area-inset-top))]">
      {/* HERO */}
      <header className="px-1">
        <h1 className="text-[28px] font-black leading-tight tracking-tight text-white">
          {firstName ? `Salut ${firstName},` : 'Salut,'}
        </h1>
        <p className="mt-1 text-[14px] font-medium leading-relaxed text-white/55">
          {hasSupportedProjects
            ? 'Voici les projets que tu soutiens.'
            : 'Prêt à soutenir un projet ? Voici un projet à découvrir.'}
        </p>
      </header>

      {/* SECTION 1 — Mes projets actifs */}
      {hasSupportedProjects ? (
        <section aria-labelledby="accueil-projects-title">
          <p
            id="accueil-projects-title"
            className="mb-4 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30"
          >
            Mes projets actifs
          </p>

          <div className="flex flex-col gap-8">
            {supportedProjects.map((project) => (
              <SupportedProjectCardView key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : null}

      {/* SECTION 2 — Découvrir un projet */}
      {recommendedProject ? (
        <section aria-labelledby="accueil-recommended-title">
          <div className="mb-4 flex items-end justify-between px-1">
            <p
              id="accueil-recommended-title"
              className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30"
            >
              {hasSupportedProjects ? 'Découvrir un autre projet' : 'Découvrir un projet'}
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/45 active:text-white/65"
            >
              Tout voir
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <RecommendedProjectView project={recommendedProject} />
        </section>
      ) : null}

      {/* SECTION 3 — Cette semaine (flat) */}
      <section aria-labelledby="accueil-week-title">
        <p
          id="accueil-week-title"
          className="mb-3 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/30"
        >
          Cette semaine
        </p>
        <p className="mb-4 px-1 text-sm leading-relaxed text-white/45">
          Comprends les écosystèmes que tu soutiens grâce aux cours liés et à l&apos;atlas du vivant.
        </p>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 px-1 text-[13px] font-bold text-lime-400 active:opacity-60"
        >
          Aller dans Apprendre
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
