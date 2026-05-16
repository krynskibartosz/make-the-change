import type { LucideIcon } from 'lucide-react'
import {
  Atom,
  ChevronRight,
  Flower2,
  Play,
  Sprout,
  TreePine,
  Waves,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type ApprendreTabProps = {
  seeds: number
}

type ProjectModule = {
  id: string
  title: string
  context: string
  detail: string
  reward: string
  icon: LucideIcon
  iconBg: string
  status: string
  href: string
}

type LearningPath = {
  id: string
  title: string
  subtitle: string
  progress: number
  icon: LucideIcon
  active: boolean
  href: string
}

type Ecosystem = {
  id: string
  title: string
  subtitle: string
  count: string
  icon: LucideIcon
  locked: boolean
  href: string
}

type BiodexSpecies = {
  id: string
  name: string
  emoji: string
  unlocked: boolean
}

const PROJECT_MODULES: ProjectModule[] = [
  {
    id: 'honey-chain',
    title: 'De la ruche au pot de miel',
    context: 'Ilanga Nature · Manakara',
    detail: 'Module terrain · 5 min',
    reward: '+70 Graines',
    icon: Flower2,
    iconBg: 'bg-gradient-to-br from-yellow-300/22 to-emerald-300/8',
    status: 'Lié à ton projet',
    href: '/adventure',
  },
  {
    id: 'coral-cutting',
    title: 'Comment bouture-t-on un corail ?',
    context: 'Récif · Karimunjawa',
    detail: 'Making-of · 7 min',
    reward: '+90 Graines',
    icon: Waves,
    iconBg: 'bg-gradient-to-br from-cyan-300/22 to-blue-400/8',
    status: 'Ouvert',
    href: '/adventure',
  },
]

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'mechanics',
    title: 'Mécanique du Vivant',
    subtitle: 'Les bases pour comprendre les écosystèmes.',
    progress: 28,
    icon: Atom,
    active: true,
    href: '/adventure',
  },
  {
    id: 'pollinators',
    title: 'Pollinisation & récoltes',
    subtitle: 'Abeilles, fleurs, fruits et producteurs.',
    progress: 0,
    icon: Flower2,
    active: false,
    href: '/adventure',
  },
  {
    id: 'oceans',
    title: 'Récifs & océans vivants',
    subtitle: 'Coraux, refuges et restauration marine.',
    progress: 0,
    icon: Waves,
    active: false,
    href: '/adventure',
  },
]

const ECOSYSTEMS: Ecosystem[] = [
  {
    id: 'manakara',
    title: 'Forêt de Manakara',
    subtitle: 'Abeilles, sols, orchidées et canopée',
    count: '7 liens',
    icon: TreePine,
    locked: false,
    href: '/adventure',
  },
  {
    id: 'reef',
    title: 'Récif de Karimunjawa',
    subtitle: 'Coraux, poissons refuges et stress thermique',
    count: '6 liens',
    icon: Waves,
    locked: false,
    href: '/adventure',
  },
  {
    id: 'pollinators-belgium',
    title: 'Pollinisateurs de Belgique',
    subtitle: 'Haies, bourdons, osmies et auxiliaires',
    count: 'Bientôt',
    icon: Flower2,
    locked: true,
    href: '/adventure',
  },
]

const BIODEX_PREVIEW: BiodexSpecies[] = [
  { id: 'bee', name: 'Abeille Noire', emoji: '🐝', unlocked: true },
  { id: 'chameleon', name: 'Caméléon', emoji: '🦎', unlocked: true },
  { id: 'coral', name: 'Acropora', emoji: '🪸', unlocked: true },
  { id: 'lemur', name: 'Vari', emoji: '🐒', unlocked: false },
]

export function ApprendreTab({ seeds: _seeds }: ApprendreTabProps) {
  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 pt-7 md:pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-2] h-[24rem] bg-gradient-to-b from-teal-400/[0.04] to-[#0B0F15]" />
      <div className="pointer-events-none absolute left-1/2 top-[-8rem] z-[-1] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-teal-400/[0.08] blur-[110px]" />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4">

        {/* ── 1. Continuer ── */}
        <section>
          <div className="mb-3 px-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Reprendre</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Continuer</h2>
          </div>
          <Link href="/adventure" className="block transition-transform active:scale-[0.99]">
            <article className="overflow-hidden rounded-[2rem] border border-teal-200/14 bg-gradient-to-br from-teal-300/14 via-white/[0.055] to-emerald-300/8 p-4 shadow-2xl shadow-black/25">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-300/14 px-3 py-1.5 text-[11px] font-semibold text-teal-100">
                  <Play className="h-3.5 w-3.5" aria-hidden="true" /> À continuer
                </span>
                <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[11px] text-white/60">3 min</span>
              </div>
              <div className="flex gap-3">
                <div className="relative grid h-[88px] w-[88px] shrink-0 place-items-center rounded-[26px] bg-black/20">
                  <div className="absolute inset-0 rounded-[26px] bg-[radial-gradient(circle,rgba(45,255,193,.28),transparent_58%)]" />
                  <div className="relative grid h-14 w-14 place-items-center rounded-full bg-teal-300 text-[#04110e] shadow-lg shadow-teal-300/20">
                    <Atom className="h-7 w-7" aria-hidden="true" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-100/72">Chapitre 1 · Mécanique du vivant</p>
                  <h3 className="mt-1 text-[22px] font-black leading-[1.05] tracking-[-0.04em] text-white">L'Alphabet Originel</h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-white/54">Comprends les forces invisibles qui relient l'eau, le soleil, les sols et les espèces.</p>
                </div>
              </div>
              <div className="mt-4 rounded-[22px] bg-black/18 p-3">
                <div className="mb-2 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-white/70">8 / 28 unités</span>
                  <span className="font-black text-teal-100">28%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-teal-300 to-lime-300" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1.5 text-[11px] text-white/68">
                  <Sprout className="h-3.5 w-3.5 text-teal-200" aria-hidden="true" /> +60 Graines
                </span>
                <span className="inline-flex h-10 items-center justify-center gap-1 rounded-2xl bg-teal-300 px-4 text-[13px] font-black text-[#04110e]">
                  Continuer <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </article>
          </Link>
        </section>

        {/* ── 2. Lié à tes projets ── */}
        <section>
          <div className="mb-3 px-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Comprendre</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Lié à tes projets</h2>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {PROJECT_MODULES.map((module) => {
              const Icon = module.icon
              return (
                <li key={module.id}>
                  <Link
                    href={module.href}
                    className="flex gap-3 rounded-[26px] border border-white/10 bg-white/[0.055] p-3 transition-colors active:bg-white/[0.07]"
                  >
                    <div className={cn('grid h-[76px] w-[76px] shrink-0 place-items-center rounded-[22px]', module.iconBg)}>
                      <Icon className="h-7 w-7 text-white/[0.86]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[11px] text-white/42">{module.context}</p>
                        <span className="shrink-0 rounded-full bg-white/[0.07] px-2 py-1 text-[9px] text-white/55">{module.status}</span>
                      </div>
                      <h3 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-tight text-white">{module.title}</h3>
                      <p className="mt-1 text-[11px] text-white/45">{module.detail}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-teal-100">
                        <Sprout className="h-3.5 w-3.5" aria-hidden="true" /> {module.reward}
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ── 3. Mission espèce ── */}
        <section>
          <div className="mb-3 px-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Mission</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Mission espèce</h2>
          </div>
          <Link href="/adventure" className="block transition-transform active:scale-[0.99]">
            <article className="overflow-hidden rounded-[28px] border border-yellow-200/12 bg-gradient-to-br from-yellow-300/14 via-white/[0.045] to-teal-300/8">
              <div className="flex gap-3 p-4">
                <div className="relative grid h-[92px] w-[92px] shrink-0 place-items-center rounded-[26px] bg-black/20">
                  <div className="absolute inset-0 rounded-[26px] bg-[radial-gradient(circle,rgba(255,210,58,.25),transparent_55%)]" />
                  <span className="relative text-[48px]" aria-label="Abeille">🐝</span>
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-yellow-100/70">Mission espèce</p>
                  <h3 className="mt-1 text-[18px] font-black leading-tight tracking-[-0.035em] text-white">Comprendre l'Abeille Noire</h3>
                  <p className="mt-0.5 truncate text-[11px] italic text-white/38">Apis mellifera unicolor</p>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-white/52">
                    Découvre son rôle de pollinisatrice, ses menaces et ses liens dans la forêt de Manakara.
                  </p>
                </div>
              </div>
              <div className="border-t border-white/[0.07] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-semibold text-white/78">4 étapes · +120 Graines</p>
                    <p className="mt-0.5 text-[11px] text-white/40">Débloque : 1 lien Toile vivante</p>
                  </div>
                  <span className="rounded-full bg-yellow-300 px-3 py-1.5 text-[12px] font-black text-stone-950">
                    Commencer
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </section>

        {/* ── 4. Parcours ── */}
        <section>
          <div className="mb-3 px-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Progression</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Parcours</h2>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {LEARNING_PATHS.map((path) => {
              const Icon = path.icon
              return (
                <li key={path.id}>
                  <Link
                    href={path.href}
                    className={cn(
                      'flex items-center gap-3 rounded-[24px] border p-3 transition-all active:scale-[0.99]',
                      path.active
                        ? 'border-teal-200/20 bg-teal-300/10'
                        : 'border-white/10 bg-white/[0.045]',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-11 w-11 shrink-0 place-items-center rounded-2xl',
                        path.active ? 'bg-teal-300 text-[#04110e]' : 'bg-white/[0.06] text-white/55',
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-[14px] font-semibold text-white">{path.title}</h3>
                        <span className="shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] text-white/45">
                          {path.progress}%
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-[12px] text-white/43">{path.subtitle}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-white/28" aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {/* ── 5. Toile vivante ── */}
        <section>
          <div className="mb-1 px-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Réseau</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Explorer la Toile vivante</h2>
          </div>
          <p className="mb-4 px-0.5 text-[13px] leading-snug text-white/48">
            Comprends comment espèces, habitats, menaces et projets sont reliés.
          </p>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ECOSYSTEMS.map((eco) => {
              const Icon = eco.icon
              return (
                <Link
                  key={eco.id}
                  href={eco.href}
                  className="w-[198px] shrink-0 snap-start rounded-[28px] border border-white/10 bg-white/[0.055] p-4 transition-transform active:scale-[0.98]"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-[18px] bg-teal-300/12 text-teal-100">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-semibold',
                        eco.locked ? 'bg-white/[0.04] text-white/30' : 'bg-white/[0.07] text-white/60',
                      )}
                    >
                      {eco.count}
                    </span>
                  </div>
                  <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight text-white">{eco.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-white/48">{eco.subtitle}</p>
                  <div className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-teal-100">
                    {eco.locked ? (
                      'Bientôt'
                    ) : (
                      <>Explorer <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── 6. Mon BioDex ── */}
        <section>
          <div className="mb-3 flex items-end justify-between gap-4 px-0.5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Collection</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Mon BioDex</h2>
            </div>
            <Link
              href="/profile/biodex"
              className="flex items-center gap-1 text-sm font-black text-teal-300 active:text-teal-200"
            >
              Voir tout <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="rounded-[2rem] border border-white/7 bg-white/[0.045] p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">12 / 31 espèces découvertes</p>
                <p className="mt-0.5 text-xs text-white/45">Soutiens des projets pour débloquer de nouvelles espèces.</p>
              </div>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-lime-300" style={{ width: '39%' }} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {BIODEX_PREVIEW.map((species) => (
                <div
                  key={species.id}
                  className={cn('flex flex-col items-center gap-1', !species.unlocked && 'opacity-35')}
                >
                  <div className="grid aspect-square w-full place-items-center rounded-[18px] border border-white/10 bg-white/[0.05]">
                    <span className="text-[28px]" aria-label={species.name}>{species.emoji}</span>
                  </div>
                  <span className="line-clamp-1 w-full text-center text-[9px] text-white/50">{species.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </section>
  )
}
