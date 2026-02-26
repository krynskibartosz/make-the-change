import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@make-the-change/core/ui'
import { Leaf, ShoppingBag, TrendingUp, Trophy, Wallet } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { DashboardPageContainer } from '@/components/layout/dashboard-page-container'
import { Link } from '@/i18n/navigation'
import { calculateImpactScore, getLevelProgress, getMilestoneBadges } from '@/lib/gamification'
import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, isRecord } from '@/lib/type-guards'
import { formatCurrency, formatPoints } from '@/lib/utils'
import { Feed } from '@/components/social/feed'
import { ActivityTimeline } from '../_features/activity-timeline'
import { BadgesSection } from '../_features/badges-section'
import { DashboardWelcome } from '../_features/dashboard-welcome'
import { StatCard } from '../_features/stat-card'
import { UserInventory } from '../_features/user-inventory'
import { UserQuests } from '../_features/user-quests'
import { getUserInventory } from '@/lib/gamification/inventory.actions'
import { getActiveQuests } from '@/lib/gamification/quest.actions'

type ClaimedChallenge = {
  claimed_at: string | null
  challenges:
  | {
    title: string | null
    reward_badge: string | null
  }
  | Array<{
    title: string | null
    reward_badge: string | null
  }>
  | null
}
type ClaimedChallengeData = {
  title: string | null
  reward_badge: string | null
}

type RecentInvestment = {
  id: string
  created_at: string | null
  amount_eur_equivalent: number | string | null
  project: {
    name_default: string | null
  } | null
}

const toClaimedChallenge = (value: unknown): ClaimedChallenge | null => {
  if (!isRecord(value)) {
    return null
  }

  const toChallenge = (challenge: unknown): ClaimedChallengeData | null => {
    if (!isRecord(challenge)) {
      return null
    }

    return {
      title: asString(challenge.title) || null,
      reward_badge: asString(challenge.reward_badge) || null,
    }
  }

  const challengesRaw = value.challenges
  const challenges = Array.isArray(challengesRaw)
    ? challengesRaw
      .map((challenge) => toChallenge(challenge))
      .filter((challenge): challenge is ClaimedChallengeData => challenge !== null)
    : toChallenge(challengesRaw)

  return {
    claimed_at: asString(value.claimed_at) || null,
    challenges: challenges,
  }
}

const toRecentInvestment = (value: unknown): RecentInvestment | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  if (!id) {
    return null
  }

  const toProject = (projectValue: unknown): { name_default: string | null } | null => {
    if (!isRecord(projectValue)) {
      return null
    }

    return {
      name_default: asString(projectValue.name_default) || null,
    }
  }

  const projectRaw = value.project
  const project = Array.isArray(projectRaw) ? toProject(projectRaw[0]) : toProject(projectRaw)

  return {
    id,
    created_at: asString(value.created_at) || null,
    amount_eur_equivalent: asNumber(value.amount_eur_equivalent, 0),
    project,
  }
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Should be handled by middleware, but safe fallback
    return null
  }

  // Fetch user profile from Supabase to get all fields correctly (points_balance, kyc_status, user_level)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Fetch claimed badges from gamification schema
  const { data: claimedChallenges } = await supabase
    .schema('gamification')
    .from('user_challenges')
    .select('*, challenges(title, reward_badge)')
    .not('claimed_at', 'is', null)

  // Fetch Inventory & Quests
  const [userInventory, activeQuests] = await Promise.all([
    getUserInventory(),
    getActiveQuests()
  ])

  // Fetch investments stats and recent activity using Supabase Client (Zero-Bundle architecture)
  const { data: allInvestments, error: investmentsError } = await supabase
    .schema('investment')
    .from('investments')
    .select('id, amount_eur_equivalent, created_at, project:projects(name_default)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (investmentsError) {
    console.error('Error fetching investments:', investmentsError)
  }

  const investmentsList = allInvestments || []

  // Calculate stats in JS (PostgREST limitation for simple queries, acceptable for per-user data)
  const totalInvested = investmentsList.reduce(
    (sum, inv) => sum + (Number(inv.amount_eur_equivalent) || 0),
    0,
  )
  const projectsSupported = investmentsList.length

  // Get recent 3 for timeline
  const recentInvestments = investmentsList.slice(0, 3)

  const firstName = profile?.first_name || 'Utilisateur'
  const pointsBalance = profile?.points_balance ?? 0

  const impactScore = calculateImpactScore({
    points: pointsBalance,
    projects: projectsSupported,
    invested: totalInvested,
  })

  const levelProgress = getLevelProgress(impactScore)

  // Use DB level as source of truth, or fallback to calculated level
  const userLevel = profile?.user_level || levelProgress.currentLevel
  const kycStatus = profile?.kyc_status || 'pending'

  // Calculate Badges
  const milestoneBadges = getMilestoneBadges({
    points: pointsBalance,
    projects: projectsSupported,
    invested: totalInvested,
  }).map((name) => ({ name, iconType: 'medal' as const }))

  const challengeRows = Array.isArray(claimedChallenges)
    ? claimedChallenges
      .map((entry) => toClaimedChallenge(entry))
      .filter((entry): entry is ClaimedChallenge => entry !== null)
    : []

  const challengeBadges = challengeRows.map((uc) => {
    const challenge = Array.isArray(uc.challenges) ? uc.challenges[0] : uc.challenges

    return {
      name: challenge?.reward_badge || challenge?.title || 'Challenge Réussi',
      date: uc.claimed_at ? new Date(uc.claimed_at).toLocaleDateString('fr-FR') : undefined,
      iconType: 'trophy' as const,
    }
  })

  const allBadges = [...milestoneBadges, ...challengeBadges]

  const quickStats = [
    { label: 'Impact score', value: impactScore.toString() },
    { label: t('overview.points_balance'), value: `${formatPoints(pointsBalance)} pts` },
    { label: t('overview.projects_supported'), value: projectsSupported.toString() },
  ]

  const activityRows = recentInvestments
    .map((investment) => toRecentInvestment(investment))
    .filter((investment): investment is RecentInvestment => investment !== null)

  const activityItems = activityRows.map((investment) => ({
    id: investment.id,
    icon: <Leaf className="h-4 w-4 text-client-emerald-600 dark:text-client-emerald-400" />,
    title: investment.project?.name_default || 'Projet',
    subtitle: new Date(investment.created_at ?? new Date()).toLocaleDateString('fr-FR'),
    value: (
      <Badge variant="success">+{formatCurrency(Number(investment.amount_eur_equivalent))}</Badge>
    ),
  }))

  const nextLevel = levelProgress.nextLevel
  const monthlyGoal = 5
  const goalProgress = Math.min((projectsSupported / monthlyGoal) * 100, 100)

  return (
    <DashboardPageContainer className="space-y-6 sm:space-y-8">
      <div className="grid gap-6 lg:grid-cols-12">
        <DashboardWelcome
          className="lg:col-span-8"
          firstName={firstName}
          userLevel={userLevel}
          kycStatus={kycStatus}
          kycLabel={t(`overview.kyc.${kycStatus}`)}
          eyebrow={t('title')}
          title={`${t('welcome')}, ${firstName} !`}
          summary={quickStats}
        />

        <Card className="lg:col-span-4 border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">{t('quick_actions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-3 sm:p-8 sm:pt-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              <Link href="/projects">
                <Button className="w-full justify-start">
                  <Leaf className="mr-2 h-4 w-4" />
                  {t('quick_actions.browse_projects')}
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {t('quick_actions.browse_products')}
                </Button>
              </Link>
            </div>
            <Link href="/dashboard/investments" className="hidden sm:block">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <TrendingUp className="mr-2 h-4 w-4" />
                {t('quick_actions.view_investments')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <BadgesSection
          className="lg:col-span-12 border bg-background/70 shadow-sm backdrop-blur"
          badges={allBadges}
        />

        <div className="lg:col-span-12 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible xl:grid-cols-4">
          <StatCard
            title="Impact score"
            value={impactScore}
            icon={<Trophy className="h-5 w-5" />}
            variant="warning"
            className="min-w-[220px] sm:min-w-0"
          />
          <StatCard
            title={t('overview.total_invested')}
            value={formatCurrency(totalInvested)}
            icon={<TrendingUp className="h-5 w-5" />}
            variant="primary"
            className="min-w-[220px] sm:min-w-0"
          />
          <StatCard
            title={t('overview.points_balance')}
            value={`${formatPoints(pointsBalance)} pts`}
            icon={<Wallet className="h-5 w-5" />}
            variant="success"
            className="min-w-[220px] sm:min-w-0"
          />
          <StatCard
            title={t('overview.projects_supported')}
            value={projectsSupported}
            icon={<Leaf className="h-5 w-5" />}
            variant="default"
            className="min-w-[220px] sm:min-w-0"
          />
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Fil d'actualité</h2>
            </div>
            <Feed />
          </div>

          <ActivityTimeline
            items={activityItems}
            viewAllHref="/dashboard/investments"
            title={t('recent_activity')}
            emptyMessage="Aucune activité récente"
            emptyAction={{ label: 'Découvrir les projets', href: '/projects' }}
          />
        </div>

        <Card className="lg:col-span-5 border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Trophy className="h-5 w-5 text-client-amber-500" />
              Progression niveau
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5 pt-3 sm:p-8 sm:pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Vers {nextLevel ?? 'Max'}</span>
                <span className="font-medium">{Math.round(levelProgress.progress)}%</span>
              </div>
              <Progress value={levelProgress.progress} />
            </div>

            <div className="rounded-2xl border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Prochain niveau</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-semibold">
                  {nextLevel ? nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1) : 'Max'}
                </span>
                <Badge variant="secondary">
                  {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}
                </Badge>
              </div>
              <p className="mt-2 hidden text-xs text-muted-foreground sm:block">
                Continuez à soutenir des projets pour débloquer de nouveaux avantages.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Objectif du mois</span>
                <span className="font-medium">
                  {projectsSupported}/{monthlyGoal} projets
                </span>
              </div>
              <Progress value={goalProgress} />
            </div>

            <Link href="/projects">
              <Button variant="outline" className="w-full">
                Explorer les projets
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="lg:col-span-7">
          <UserQuests quests={activeQuests} />
        </div>

        <div className="lg:col-span-5">
          <UserInventory inventory={userInventory} />
        </div>
      </div>
    </DashboardPageContainer>
  )
}
