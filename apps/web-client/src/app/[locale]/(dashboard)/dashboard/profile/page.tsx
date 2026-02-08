import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Progress } from '@make-the-change/core/ui'
import { DashboardPageContainer } from '@/components/layout/dashboard-page-container'
import { ProfileHeader } from '@/components/profile/profile-header'
import { Link } from '@/i18n/navigation'
import { calculateImpactScore, getLevelProgress, getMilestoneBadges } from '@/lib/gamification'
import { createClient } from '@/lib/supabase/server'
import { ProfileController } from './profile.controller'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch profile using RLS
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Fetch investment stats using RLS
  const { data: userInvestments } = await supabase
    .from('investments')
    .select('amount_eur_equivalent')
    .eq('user_id', user.id)

  // Calculate stats client-side
  const projectsSupported = userInvestments?.length || 0
  const totalInvested = (userInvestments || []).reduce(
    (sum, inv) => sum + Number(inv.amount_eur_equivalent || 0),
    0,
  )

  const metadata = (profile?.metadata || {}) as Record<string, unknown>
  const avatarUrl = metadata.avatar_url as string | undefined
  const coverUrl = metadata.cover_url as string | undefined
  const pointsBalance = (metadata.points_balance as number | undefined) ?? 0
  const impactScore = calculateImpactScore({
    points: pointsBalance,
    projects: projectsSupported,
    invested: totalInvested,
  })
  const levelProgress = getLevelProgress(impactScore)
  const computedBadges = getMilestoneBadges({
    points: pointsBalance,
    projects: projectsSupported,
    invested: totalInvested,
  })
  const badges = computedBadges.length
    ? computedBadges
    : (metadata.badges as string[] | undefined) || []

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user.email || 'Utilisateur'

  return (
    <div className="min-h-screen">
      <ProfileHeader
        userId={user.id}
        name={displayName}
        email={user.email || null}
        level={levelProgress.currentLevel}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        impactScore={impactScore}
      />

      <DashboardPageContainer>
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="order-2 space-y-8 lg:order-1">
            <ProfileController profile={profile || null} userEmail={user?.email} />
          </div>

          <div className="order-1 flex gap-4 overflow-x-auto pb-4 lg:order-2 lg:flex-col lg:overflow-visible lg:pb-0 lg:sticky lg:top-24 lg:h-fit">
            <Card className="min-w-[260px] border bg-background/70 shadow-sm backdrop-blur lg:min-w-0">
            <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Classement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-3 text-sm text-muted-foreground sm:p-8 sm:pt-4">
              <div className="flex items-center justify-between">
                <span>Rang global</span>
                <span className="font-semibold text-foreground">#42</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rang mensuel</span>
                <span className="font-semibold text-foreground">#8</span>
              </div>
              <p className="hidden text-xs sm:block">
                Continuez a investir pour grimper dans le classement.
              </p>
              <Link href="/leaderboard">
                <Button variant="outline" size="sm" className="w-full">
                  Voir le leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="min-w-[260px] border bg-background/70 shadow-sm backdrop-blur lg:min-w-0">
            <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Progression niveau</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-3 text-sm text-muted-foreground sm:p-8 sm:pt-4">
              <div className="flex items-center justify-between">
                <span>Vers {levelProgress.nextLevel ?? 'Max'}</span>
                <span className="font-semibold text-foreground">
                  {Math.round(levelProgress.progress)}%
                </span>
              </div>
              <Progress value={levelProgress.progress} />
              <p className="hidden text-xs sm:block">
                Augmentez votre impact score pour atteindre le niveau suivant.
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-[260px] border bg-background/70 shadow-sm backdrop-blur lg:min-w-0">
            <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Badges</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 overflow-x-auto p-5 pt-3 pb-4 sm:overflow-visible sm:p-8 sm:pt-4">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Aucun badge pour le moment.</span>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
      </DashboardPageContainer>
    </div>
  )
}
