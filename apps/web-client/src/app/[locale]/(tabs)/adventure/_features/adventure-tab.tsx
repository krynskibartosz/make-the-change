import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  Droplets,
  Lock,
  Package,
  PawPrint,
  Sparkles,
  Sprout,
  Trophy,
  UsersRound,
} from 'lucide-react'
import { CurrencyAmount, CurrencyIcon, getCurrencyDesign } from '@/components/currency'
import { getMockProducts } from '@/app/[locale]/(tabs)/products/_features/mock-products'
import { Link } from '@/i18n/navigation'
import { getFactionTheme, resolveFactionThemeKey } from '@/lib/faction-theme'
import { getCollectiveGoal, getFactionContribution } from '@/lib/mock/mock-factions'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'

export type AdventureQuestCard = {
  id: string
  title: string
  description: string
  href: string
  reward: number
  progress: number
  max: number
  type: 'education' | 'social' | 'daily_harvest'
  cta: string
}

export type AdventureProjectCard = {
  name: string
  description: string
  href: string
  location: string
  imageUrl: string | null
  fundingProgress: number
  typeLabel: string
  speciesName: string | null
}

export type AdventureSpeciesCard = {
  name: string
  scientificName: string | null
  imageUrl: string | null
  conservationStatus: string | null
  isUnlocked: boolean
  href: string
}

export type AdventureTabProps = {
  displayName: string | null
  faction: Faction | null
  dayLabel: string
  monthlyObjective: string
  monthlyProgress: number
  monthlyMax: number
  primaryQuest: AdventureQuestCard | null
  quests: AdventureQuestCard[]
  recommendedProject: AdventureProjectCard | null
  featuredSpecies: AdventureSpeciesCard | null
  collectiveProgress: number
  impactPoints: number
}

type FactionPresentation = {
  label: string
  mascotImage: string
  headline: string
  message: string
}

const FACTION_PRESENTATION: Record<
  ReturnType<typeof resolveFactionThemeKey>,
  FactionPresentation
> = {
  neutral: {
    label: 'Melli',
    mascotImage: '/abeille-transparente.png',
    headline: 'Choisis ton prochain pas pour le vivant.',
    message: 'Apprends, soutiens un projet concret et fais grandir ton impact.',
  },
  pollinisateurs: {
    label: 'Melli',
    mascotImage: '/abeille-transparente.png',
    headline: "Melli a repéré une action utile pour aujourd'hui.",
    message: 'Fais avancer les pollinisateurs sans perdre le fil de ton impact.',
  },
  forets: {
    label: 'Sylva',
    mascotImage: '/sylva.png',
    headline: "Sylva t'ouvre un chemin court et concret.",
    message: 'Un apprentissage, un projet, une espèce: garde le vivant visible.',
  },
  mers: {
    label: 'Ondine',
    mascotImage: '/ondine.png',
    headline: 'Ondine garde le cap sur ton impact du jour.',
    message: 'Explore, comprends et soutiens les écosystèmes qui en ont besoin.',
  },
}

const QUEST_ICONS: Record<AdventureQuestCard['type'], LucideIcon> = {
  education: BookOpen,
  social: UsersRound,
  daily_harvest: Sparkles,
}

const ACADEMY_CARD_IMAGE = '/coral-karimunjawa.jpg'
const BIODEX_LOCKED_IMAGE = '/images/diaromas/Cam%C3%A9l%C3%A9on%20de%20Parson.png'
const HERO_SPECIES_FALLBACK_IMAGE = '/images/diaromas/Indri.png'
const GUIDE_MASCOT_IMAGE = '/aura.png'

function getProgressPercent(progress: number, max: number) {
  if (max <= 0) return 0
  return Math.min(Math.max((progress / max) * 100, 0), 100)
}

function ProgressBar({
  value,
  className,
  indicatorClassName,
}: {
  value: number
  className?: string
  indicatorClassName?: string
}) {
  return (
    <div
      className={cn(
        'h-2 overflow-hidden rounded-full bg-white/[0.07] ring-1 ring-white/[0.03]',
        className,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full',
          indicatorClassName || getCurrencyDesign('seeds').progressClassName,
        )}
        style={{ width: `${Math.round(value)}%` }}
      />
    </div>
  )
}

function ProgressRing({
  value,
  label,
  className,
}: {
  value: number
  label: string
  className?: string
}) {
  const roundedValue = Math.round(Math.min(Math.max(value, 0), 100))

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        <circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${roundedValue * 2.01} 201`}
          strokeLinecap="round"
          strokeWidth="8"
          className={className}
        />
      </svg>
      <span className="text-lg font-black tabular-nums text-white">{roundedValue}%</span>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function AdventureTab({
  displayName,
  faction,
  dayLabel,
  monthlyObjective,
  monthlyProgress,
  monthlyMax,
  primaryQuest,
  quests,
  recommendedProject,
  featuredSpecies,
  collectiveProgress,
  impactPoints,
}: AdventureTabProps) {
  const themeKey = resolveFactionThemeKey(faction)
  const presentation = FACTION_PRESENTATION[themeKey]
  const theme = getFactionTheme(faction)
  const collectiveGoal = getCollectiveGoal()
  const activeContribution = getFactionContribution(faction)
  const firstName = displayName?.trim().split(/\s+/)[0] || 'Explorateur'
  const primaryIcon = primaryQuest ? QUEST_ICONS[primaryQuest.type] : Compass
  const PrimaryIcon = primaryIcon
  const academyProgress = getProgressPercent(monthlyProgress, monthlyMax)
  const questProgress = primaryQuest
    ? getProgressPercent(primaryQuest.progress, primaryQuest.max)
    : 0
  const completedQuests = quests.filter((quest) => quest.progress >= quest.max).length
  const speciesName = featuredSpecies?.name || 'emblématique'
  const projectName = recommendedProject?.name || 'Projet de restauration'
  const isPrimaryQuestComplete = primaryQuest ? primaryQuest.progress >= primaryQuest.max : false
  const heroSpeciesImage = featuredSpecies?.imageUrl || HERO_SPECIES_FALLBACK_IMAGE
  const biodexPreviewImage =
    featuredSpecies?.isUnlocked && featuredSpecies.imageUrl
      ? featuredSpecies.imageUrl
      : BIODEX_LOCKED_IMAGE
  const rewardProgress = collectiveGoal.progress || collectiveProgress
  const remainingSeeds = Math.max(collectiveGoal.targetSeeds - collectiveGoal.currentSeeds, 0)
  const rewardProduct = getRewardProduct(impactPoints)
  const rewardProductHref = rewardProduct?.slug ? `/products/${rewardProduct.slug}` : '/products'
  const rewardProductProgress = rewardProduct
    ? getProgressPercent(impactPoints, rewardProduct.price_points)
    : 0
  const rewardProductMissing = rewardProduct
    ? Math.max(rewardProduct.price_points - impactPoints, 0)
    : 0
  const canClaimRewardProduct = !!rewardProduct && rewardProductMissing === 0

  return (
    <section className="relative isolate w-full overflow-x-hidden pb-32 md:pb-10 mt-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[-2] h-[24rem] bg-gradient-to-b from-white/[0.03] to-[#0B0F15]" />
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-[-10%] z-[-1] h-[500px] w-[120%] -translate-x-1/2 rounded-full blur-[100px] opacity-15',
          theme.accentGlow,
        )}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col pt-2">
        <div className="px-5 pb-8">
          <h1 className="text-[26px] font-black tracking-tight text-white">Salut {firstName} !</h1>
          <p className="mt-1 text-sm font-medium leading-relaxed text-white/60">
            L'espèce <strong className="text-white">{speciesName}</strong> a besoin de la faction{' '}
            <strong className={cn(theme.accentText)}>{presentation.label}</strong> aujourd'hui.
          </p>
        </div>

        <div className="px-4 pb-16">
          <div className="relative h-40 overflow-hidden rounded-[30px] bg-[#080b0f] shadow-[0_18px_60px_rgba(0,0,0,0.34)] sm:h-48">
            <div className="absolute inset-0 grid grid-cols-2">
              <div className="relative bg-[#080b0f]">
                <img
                  src={heroSpeciesImage}
                  alt=""
                  className={cn(
                    'h-full w-full object-cover',
                    !featuredSpecies?.isUnlocked && 'grayscale opacity-55',
                  )}
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
                {!featuredSpecies?.isUnlocked && (
                  <div className="absolute left-3 top-3 rounded-full bg-black/55 p-1.5 backdrop-blur-sm">
                    <Lock className="h-3.5 w-3.5 text-white/75" />
                  </div>
                )}
              </div>

              <div className="relative bg-[#10151c]">
                {recommendedProject?.imageUrl ? (
                  <img
                    src={recommendedProject.imageUrl}
                    alt=""
                    className="h-full w-full object-cover opacity-95"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-white/[0.03]">
                    <Sprout className="h-12 w-12 text-white/15" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-1/2 -ml-8 w-16 bg-gradient-to-r from-[#080b0f] via-[#080b0f]/50 to-transparent" />
          </div>

          <div className="px-1 pt-5">
            <h2 className="text-[22px] font-black leading-tight tracking-tight text-white">
              {projectName}
            </h2>

            <Link
              href={recommendedProject?.href || '/projects'}
              className={cn(
                'mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[18px] text-[16px] font-black text-[#0B0F15] transition-transform active:scale-[0.98]',
                theme.accentBg,
                theme.accentShadow,
              )}
            >
              Soutenir & Débloquer
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="px-4 pb-16">
          <div className="flex items-end justify-between gap-4 px-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/34">
                Ma quête active
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-white">
                Choisis ton prochain pas
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-black tabular-nums text-white/62">
              {quests.length ? `${completedQuests}/${quests.length}` : '0/0'}
            </span>
          </div>

          <div className="-mx-4 mt-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex snap-x gap-4 pb-2">
              <Link
                href="/academy"
                className="group relative flex min-h-[19rem] w-[82vw] max-w-[23rem] shrink-0 snap-start overflow-hidden rounded-[34px] border border-white/10 bg-[#07110f] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)] transition-transform active:scale-[0.985] sm:w-[23rem]"
              >
                <img
                  src={ACADEMY_CARD_IMAGE}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-92 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/28 to-[#06110e]/94" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06110e] to-transparent" />

                <div className="relative flex h-full min-h-[17rem] w-full flex-col justify-between">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-black/28 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white backdrop-blur-md">
                      <BookOpen className="h-3.5 w-3.5" />
                      Académie
                    </span>
                    <span className="rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold text-white/84 backdrop-blur-md">
                      {dayLabel}
                    </span>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-bold text-white/58">Chapitre en cours</p>
                    <h3 className="text-[24px] font-black leading-[1.02] tracking-tight text-white">
                      {monthlyObjective}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-relaxed text-white/68">
                      Reprends le cours illustré et transforme ton apprentissage en action utile.
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <ProgressBar value={academyProgress} className="flex-1 bg-white/14" />
                      <span className="text-sm font-black tabular-nums text-lime-300">
                        {Math.round(academyProgress)}%
                      </span>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#07110f] shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
                      Continuer
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href={primaryQuest?.href || '/challenges'}
                className="relative flex min-h-[19rem] w-[82vw] max-w-[23rem] shrink-0 snap-start overflow-hidden rounded-[34px] border border-white/10 bg-[#14171d] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition-transform active:scale-[0.985] sm:w-[23rem]"
              >
                <div
                  className={cn(
                    'absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[52px]',
                    theme.accentGlow,
                  )}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />

                <div className="relative flex h-full min-h-[17rem] w-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={cn(
                        'flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border',
                        isPrimaryQuestComplete
                          ? 'border-lime-300/30 bg-lime-300/12 text-lime-300'
                          : 'border-white/10 bg-white/[0.07]',
                        theme.accentText,
                      )}
                    >
                      {isPrimaryQuestComplete ? (
                        <CheckCircle2 className="h-7 w-7 text-lime-300" />
                      ) : (
                        <PrimaryIcon className="h-7 w-7" />
                      )}
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-black tabular-nums',
                        isPrimaryQuestComplete
                          ? 'border-lime-400/30 bg-lime-400/10 text-lime-300'
                          : 'border-white/10 bg-black/20 text-white/70',
                      )}
                    >
                      {primaryQuest ? `${primaryQuest.progress}/${primaryQuest.max}` : '0/1'}
                    </span>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-white/36">
                      Défi du jour
                    </p>
                    <h3 className="text-[24px] font-black leading-[1.04] tracking-tight text-white">
                      {primaryQuest?.title || "Aucune quête pour aujourd'hui"}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm font-semibold leading-relaxed text-white/58">
                      {primaryQuest?.description ||
                        'Reviens demain pour une nouvelle contribution gratuite.'}
                    </p>

                    {primaryQuest && (
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-white/42">
                            Récompense immédiate
                          </span>
                          <CurrencyAmount
                            kind="seeds"
                            value={primaryQuest.reward}
                            className="text-xs font-black"
                          />
                        </div>
                        <ProgressBar value={questProgress} />
                      </div>
                    )}

                    <div
                      className={cn(
                        'mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-[#0B0F15]',
                        theme.accentBg,
                      )}
                    >
                      {primaryQuest?.cta || 'Voir le défi'}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>


        <div className="space-y-8 px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/34">
                Progression
              </p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-white">
                Tes objectifs vivants
              </h2>
            </div>
            <Trophy className={cn('h-5 w-5', theme.accentText)} />
          </div>

          <Link
            href={featuredSpecies?.href || '/profile/biodex'}
            className="group relative block min-h-[15rem] overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform active:scale-[0.985]"
          >
            <div
              className={cn(
                'absolute -right-10 -top-10 h-48 w-48 rounded-full blur-[56px]',
                theme.accentGlow,
              )}
            />
            <img
              src={biodexPreviewImage}
              alt=""
              className={cn(
                'pointer-events-none absolute -right-14 bottom-0 h-56 w-72 object-contain object-bottom opacity-75 transition-transform duration-700 group-hover:scale-105',
                !featuredSpecies?.isUnlocked && 'grayscale saturate-0 opacity-50',
              )}
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0F15] to-transparent" />

            <div className="relative flex min-h-[13rem] max-w-[64%] flex-col justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em]',
                      theme.badgeClassName,
                      theme.accentText,
                    )}
                  >
                    {featuredSpecies?.isUnlocked ? (
                      <PawPrint className="h-3.5 w-3.5" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                    BioDex
                  </span>
                </div>
                <h3 className="text-[25px] font-black leading-[1.02] tracking-tight text-white">
                  {featuredSpecies?.isUnlocked
                    ? 'Fais évoluer la fiche'
                    : 'Fiche BioDex en attente'}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-white/62">
                  {featuredSpecies?.isUnlocked
                    ? `Révèle plus de contenu sur ${speciesName}: habitat, menaces et anecdotes.`
                    : `${speciesName} se débloque via le soutien du projet en haut. Sa fiche évolutive t'attend ensuite.`}
                </p>
              </div>

              <span
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-black',
                  theme.accentText,
                )}
              >
                {featuredSpecies?.isUnlocked ? 'Faire évoluer' : 'Voir la fiche'}
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/impact/reward"
              className="relative block min-h-64 overflow-hidden rounded-[30px] border border-white/10 bg-[#15151A]/92 p-4 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform active:scale-[0.985]"
            >
              <div
                className={cn(
                  'absolute -right-8 -top-12 h-40 w-40 rounded-full blur-3xl',
                  theme.accentGlow,
                )}
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-lime-400/[0.06] to-transparent" />

              <div className="relative flex h-full flex-col justify-between gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'text-[11px] font-black uppercase tracking-[0.14em]',
                        theme.accentText,
                      )}
                    >
                      AVANTAGE DU MOIS
                    </p>
                    <h3 className="mt-1 text-[18px] font-black leading-tight text-white">
                      Le Défi Ilanga Nature
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-white/50">
                      Atteignons ensemble les 100 % en récoltant des Graines ! En remerciement de cet effort commun, notre partenaire Ilanga Nature débloquera des avantages exclusifs pour toute la communauté.
                    </p>
                  </div>
                  <ProgressRing
                    value={rewardProgress}
                    label={`Progression collective ${Math.round(rewardProgress)}%`}
                    className={theme.accentText}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-white/42">
                      Plus que {formatSeedCount(remainingSeeds)} graines
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-emerald-300">
                      <CurrencyIcon kind="seeds" className="h-3.5 w-3.5" />
                      à récolter
                    </span>
                  </div>
                  <ProgressBar value={rewardProgress} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-[18px] border border-white/8 bg-white/[0.045] p-3">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
                      <Droplets className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-black leading-tight text-white">-15 % d'avantage</p>
                    <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-white/44">
                      Sur la récolte de miel de notre partenaire.
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-white/8 bg-white/[0.045] p-3">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="line-clamp-1 text-sm font-black leading-tight text-white">
                      Halo de victoire
                    </p>
                    <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-white/44">
                      La faction ayant récolté le plus de Graines obtiendra un éclat cosmétique exclusif.
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              href={rewardProductHref}
              className="relative block min-h-64 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] p-4 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform active:scale-[0.985]"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/36">
                      AVANTAGE DISPONIBLE
                    </p>
                    <h3 className="mt-1 text-[17px] font-black leading-tight text-white">
                      {canClaimRewardProduct ? 'Débloqué grâce à votre impact' : 'Encore un effort'}
                    </h3>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-amber-300/12 text-amber-300">
                    <Package className="h-5 w-5" />
                  </span>
                </div>

                {rewardProduct ? (
                  <>
                    <div className="grid grid-cols-[5.25rem_1fr] gap-3">
                      <div className="aspect-square overflow-hidden rounded-[22px] border border-white/10 bg-black/20">
                        <img
                          src={rewardProduct.image_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 py-1">
                        {rewardProduct.producer?.name_default && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                            {rewardProduct.producer.name_default}
                          </span>
                        )}
                        <p className="line-clamp-2 text-[15px] font-black leading-tight text-white">
                          {rewardProduct.name_default}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-white/46">
                          {rewardProduct.short_description_default}
                        </p>
                      </div>
                    </div>

                    <div>
                      {canClaimRewardProduct ? (
                        <div className="flex items-center justify-between gap-3">
                          <CurrencyAmount
                            kind="impactCredits"
                            value={rewardProduct.price_points}
                            notation="compact"
                            className="text-xs font-black"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-white/42">
                              Encore {formatImpactPoints(rewardProductMissing)} pour cet avantage
                            </span>
                            <CurrencyAmount
                              kind="impactCredits"
                              value={rewardProduct.price_points}
                              notation="compact"
                              className="text-xs font-black"
                            />
                          </div>
                          <ProgressBar
                            value={rewardProductProgress}
                            indicatorClassName={getCurrencyDesign('impactCredits').progressClassName}
                          />
                        </>
                      )}
                    </div>

                    <p className="flex items-center gap-2 text-sm font-black text-amber-300">
                      {canClaimRewardProduct ? 'Utiliser mes crédits' : 'Voir le produit'}
                      <ChevronRight className="h-4 w-4" />
                    </p>
                  </>
                ) : (
                  <div>
                    <p className="text-sm font-semibold leading-snug text-white/64">
                      Convertis tes crédits en récompenses utiles, sans casser l'immersion.
                    </p>
                    <p className="mt-3 flex items-center gap-2 text-sm font-black text-amber-300">
                      <CurrencyAmount
                        kind="impactCredits"
                        value={impactPoints}
                        notation="compact"
                        showLabel
                        className="text-sm font-black"
                      />
                      <ChevronRight className="h-4 w-4" />
                    </p>
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function formatImpactPoints(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatSeedCount(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value).replace(/\u202f/g, ' ')
}

function getRewardProduct(impactPoints: number) {
  const products = getMockProducts()
    .filter((product) => product.stock_quantity > 0)
    .sort((first, second) => first.price_points - second.price_points)

  const claimableProducts = products.filter((product) => product.price_points <= impactPoints)
  if (claimableProducts.length > 0) {
    return claimableProducts[claimableProducts.length - 1]
  }

  return products.find((product) => product.price_points > impactPoints) || products[0] || null
}
