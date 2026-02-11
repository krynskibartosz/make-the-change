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
        <div className="grid gap-8 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px]">
          <div className="order-2 space-y-8 lg:order-1">
            <ProfileController profile={profile || null} userEmail={user?.email} />
          </div>

          <div className="order-1 flex flex-col gap-6 lg:order-2 lg:sticky lg:top-24 lg:h-fit">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="border bg-background/70 shadow-sm backdrop-blur transition-all hover:shadow-md">
                <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg">Classement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5 pt-3 text-sm text-muted-foreground sm:p-8 sm:pt-4">
                  <div className="flex items-center justify-between">
                    <span>Rang global</span>
                    <span className="font-bold text-foreground text-lg">#42</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/50 pt-4">
                    <span>Rang mensuel</span>
                    <span className="font-bold text-foreground text-lg">#8</span>
                  </div>
                  <p className="text-xs italic opacity-70">
                    Continuez à investir pour grimper dans le classement.
                  </p>
                  <Link href="/leaderboard">
                    <Button variant="outline" size="sm" className="w-full mt-2 font-bold uppercase tracking-wider text-[10px]">
                      Voir le leaderboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border bg-background/70 shadow-sm backdrop-blur transition-all hover:shadow-md">
                <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg">Progression niveau</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5 pt-3 text-sm text-muted-foreground sm:p-8 sm:pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">Vers {levelProgress.nextLevel ?? 'Max'}</span>
                    <span className="font-black text-primary">
                      {Math.round(levelProgress.progress)}%
                    </span>
                  </div>
                  <Progress value={levelProgress.progress} className="h-2" />
                  <p className="text-xs italic opacity-70">
                    Plus que {new Intl.NumberFormat('fr-FR').format(levelProgress.pointsToNextLevel)} points avant le niveau suivant.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border bg-background/70 shadow-sm backdrop-blur transition-all hover:shadow-md">
              <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Badges</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-3 pb-6 sm:p-8 sm:pt-4">
                <div className="flex flex-wrap gap-2">
                  {badges.length > 0 ? (
                    badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight bg-primary/10 text-primary border-primary/20">
                        {badge}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm italic opacity-60">Aucun badge pour le moment.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardPageContainer>
    </div>
  )
}
