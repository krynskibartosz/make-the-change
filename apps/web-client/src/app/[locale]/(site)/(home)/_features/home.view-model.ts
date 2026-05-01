import type { User } from '@supabase/supabase-js'
import { Leaf, type LucideIcon, Sparkles, Users, Zap } from 'lucide-react'
import { cn, formatPoints } from '@/lib/utils'
import type { DataState } from './home.types'

export type HomeSectionVariant = 'default' | 'muted'

export type HomeHeroStat = {
  key: 'projects' | 'members'
  href: string
  icon: LucideIcon
  value: number
  label: string
}

export type HomeStatsItem = {
  value: string | number
  label: string
  icon: LucideIcon
  color: string
  bg: string
  border: string
}

export type HomeViewModelLabels = {
  heroInvestCta: string
  heroRegisterCta: string
  heroProjectsStat: string
  heroMembersStat: string
  statsActiveProjects: string
  statsEngagedMembers: string
  statsEthicalProducts: string
  statsPointsGenerated: string
  primaryCtaAuthed: string
  primaryCtaGuest: string
}

type BuildHomeViewModelInput = {
  user: User | null
  activeProjectsState: DataState<number>
  activeProductsState: DataState<number>
  membersCountState: DataState<number>
  pointsGeneratedState: DataState<number>
  featuredProjectsState: DataState<unknown[]>
  featuredProductsState: DataState<unknown[]>
  activeProducersState: DataState<unknown[]>
  blogPostsState: DataState<unknown[]>
  labels: HomeViewModelLabels
}

const toAlternatingVariant = (visibleSectionsCount: number): HomeSectionVariant =>
  visibleSectionsCount % 2 === 0 ? 'muted' : 'default'

export const buildHomeViewModel = ({
  user,
  activeProjectsState,
  activeProductsState,
  membersCountState,
  pointsGeneratedState,
  featuredProjectsState,
  featuredProductsState,
  activeProducersState,
  blogPostsState,
  labels,
}: BuildHomeViewModelInput) => {
  const heroContextualCta = user
    ? { href: '/projects', label: labels.heroInvestCta }
    : { href: '/register', label: labels.heroRegisterCta }

  const heroStats: HomeHeroStat[] = []
  if (activeProjectsState.status === 'ready') {
    heroStats.push({
      key: 'projects',
      href: '/projects',
      icon: Zap,
      value: activeProjectsState.value,
      label: labels.heroProjectsStat,
    })
  }

  if (membersCountState.status === 'ready') {
    heroStats.push({
      key: 'members',
      href: '/leaderboard',
      icon: Users,
      value: membersCountState.value,
      label: labels.heroMembersStat,
    })
  }

  const statsItems: HomeStatsItem[] = []
  if (activeProjectsState.status === 'ready') {
    statsItems.push({
      value: activeProjectsState.value,
      label: labels.statsActiveProjects,
      icon: Leaf,
      color: 'text-marketing-positive-400',
      bg: 'bg-marketing-positive-400/10',
      border: 'border-marketing-positive-400/20',
    })
  }

  if (membersCountState.status === 'ready') {
    statsItems.push({
      value: membersCountState.value,
      label: labels.statsEngagedMembers,
      icon: Users,
      color: 'text-marketing-info-400',
      bg: 'bg-marketing-info-400/10',
      border: 'border-marketing-info-400/20',
    })
  }

  if (activeProductsState.status === 'ready') {
    statsItems.push({
      value: activeProductsState.value,
      label: labels.statsEthicalProducts,
      icon: Sparkles,
      color: 'text-marketing-warning-400',
      bg: 'bg-marketing-warning-400/10',
      border: 'border-marketing-warning-400/20',
    })
  }

  if (pointsGeneratedState.status === 'ready') {
    statsItems.push({
      value: formatPoints(pointsGeneratedState.value),
      label: labels.statsPointsGenerated,
      icon: Zap,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    })
  }

  const featuredProjectsVisible = featuredProjectsState.status !== 'unknown'
  const featuredProductsVisible = featuredProductsState.status !== 'unknown'
  const partnersVisible = activeProducersState.status !== 'unknown'
  const blogVisible = blogPostsState.status !== 'unknown'

  const featuredSectionsVisibleCount =
    Number(featuredProjectsVisible) + Number(featuredProductsVisible)
  const partnersVariant = toAlternatingVariant(featuredSectionsVisibleCount)
  const blogVariant = toAlternatingVariant(featuredSectionsVisibleCount + Number(partnersVisible))

  const ctaSectionClassName = cn(
    'py-24',
    (featuredSectionsVisibleCount + Number(partnersVisible) + Number(blogVisible)) % 2 === 0
      ? 'bg-muted/30'
      : 'bg-background',
  )

  const primaryCta = user
    ? { href: '/projects', label: labels.primaryCtaAuthed }
    : { href: '/register', label: labels.primaryCtaGuest }

  return {
    heroContextualCta,
    heroStats,
    statsItems,
    featuredProjectsVisible,
    partnersVariant,
    blogVariant,
    ctaSectionClassName,
    primaryCta,
  }
}
