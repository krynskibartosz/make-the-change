import { ArrowRight, Heart, MapPin, Newspaper, Sparkles } from 'lucide-react'
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

function formatSupportedDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(
      new Date(iso),
    )
  } catch {
    return ''
  }
}

function formatRelativeUpdate(iso: string): string {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} j`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem`
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
  } catch {
    return ''
  }
}

function SupportedProjectCardView({ project }: { project: SupportedProjectCard }) {
  return (
    <Link
      href={project.href}
      className="group block overflow-hidden rounded-3xl border border-white/8 bg-white/[0.04] transition-colors hover:bg-white/[0.07] active:scale-[0.99]"
    >
      <div className="relative h-40 w-full overflow-hidden bg-white/[0.04]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
              Tu soutiens
            </p>
            <h3 className="mt-0.5 truncate text-base font-black tracking-tight text-white">
              {project.name}
            </h3>
          </div>
        </div>
      </div>

      <div className="px-4 py-3.5">
        <div className="flex items-center justify-between gap-2 text-[12px] font-semibold text-white/55">
          <span>
            <span className="text-white">{project.amountSupported} €</span> apportés
          </span>
          <span className="text-white/35">{formatSupportedDate(project.supportedAt)}</span>
        </div>

        {project.latestUpdate && (
          <div className="mt-3 rounded-2xl border border-teal-400/15 bg-teal-400/[0.05] p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-teal-300/80">
              <Newspaper className="h-3 w-3" />
              <span>Du terrain · {formatRelativeUpdate(project.latestUpdate.postedAt)}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug text-white/85">
              {project.latestUpdate.title}
            </p>
          </div>
        )}

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-lime-400/80 transition-all"
            style={{ width: `${project.fundingProgress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-white/35">
          <span>{project.fundingProgress}% financé</span>
          <span className="inline-flex items-center gap-1 text-white/60">
            Voir le projet
            <ArrowRight className="h-3.5 w-3.5" />
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
      className="group block overflow-hidden rounded-3xl border border-white/8 bg-white/[0.04] transition-colors hover:bg-white/[0.07] active:scale-[0.99]"
    >
      <div className="relative h-44 w-full overflow-hidden bg-white/[0.04]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
            {project.typeLabel}
          </p>
          <h3 className="mt-0.5 text-lg font-black tracking-tight text-white">
            {project.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-white/60">
            <MapPin className="h-3 w-3" />
            <span>{project.location}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="line-clamp-2 text-[13px] leading-relaxed text-white/60">
          {project.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black tabular-nums text-lime-400">
              {formatCompact(project.impactValue)}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              {project.impactLabel}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 px-4 py-2.5 text-sm font-black text-black shadow-[0_0_20px_rgba(163,230,53,0.3)]">
            Soutenir
            <ArrowRight className="h-4 w-4" />
          </span>
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-24 pt-[max(1.5rem,env(safe-area-inset-top))]">
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
      {hasSupportedProjects && (
        <section aria-labelledby="accueil-projects-title">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2
              id="accueil-projects-title"
              className="text-[18px] font-black tracking-tight text-white"
            >
              Mes projets actifs
            </h2>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/45">
              <Heart className="h-3.5 w-3.5" />
              {supportedProjects.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {supportedProjects.map((project) => (
              <SupportedProjectCardView key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2 — Découvrir un projet */}
      {recommendedProject && (
        <section aria-labelledby="accueil-recommended-title">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2
              id="accueil-recommended-title"
              className="text-[18px] font-black tracking-tight text-white"
            >
              {hasSupportedProjects ? 'Découvrir un autre projet' : 'Découvrir un projet'}
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/45 hover:text-white/65"
            >
              Tout voir
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <RecommendedProjectView project={recommendedProject} />
        </section>
      )}

      {/* SECTION 3 — Cette semaine */}
      <section aria-labelledby="accueil-week-title" className="px-1">
        <div className="rounded-3xl border border-white/8 bg-white/[0.025] p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-teal-400/10 text-teal-300">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="accueil-week-title"
                className="text-[15px] font-black tracking-tight text-white"
              >
                Cette semaine
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-white/55">
                Découvre un cours lié à tes projets ou explore l&apos;atlas du vivant.
              </p>
              <Link
                href="/learn"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] font-bold text-white/75 transition-colors hover:bg-white/[0.08]"
              >
                Aller dans Apprendre
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
