import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { Flame, Gift, Leaf, MapPin, Sparkles, Target, Trophy, Wind } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getFactionTheme } from '@/lib/faction-theme'
import { getCollectiveGoal, getFactionContribution } from '@/lib/mock/mock-factions'
import type { Profile } from '@/lib/mock/types'

type MockPublicProfilePageProps = {
  profile: Profile
  isOwnProfile: boolean
}

export function MockPublicProfilePage({ profile, isOwnProfile }: MockPublicProfilePageProps) {
  const accentTheme = getFactionTheme(profile.faction)
  const collectiveGoal = getCollectiveGoal()
  const factionContribution = getFactionContribution(profile.faction)

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <section
          className={`overflow-hidden rounded-[2rem] border bg-card/80 p-6 shadow-xl backdrop-blur sm:p-8 ${accentTheme.accentBorder} ${accentTheme.accentShadow}`}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="h-28 w-28 overflow-hidden rounded-full border border-border/60 bg-muted/30">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center text-3xl font-black ${accentTheme.accentText}`}
                >
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight">{profile.displayName}</h1>
                {profile.faction ? (
                  <Badge variant="secondary" className={`${accentTheme.badgeClassName} ${accentTheme.accentText}`}>
                    {profile.faction}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">@{profile.username}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {profile.city}, {profile.country}
                </span>
                <span>Membre depuis {profile.memberSince.slice(0, 4)}</span>
              </div>
            </div>

            {isOwnProfile ? (
              <Link
                href="/dashboard/profile"
                className={`inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-black ${accentTheme.accentBg}`}
              >
                Voir mon espace
              </Link>
            ) : null}
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-card/80">
            <CardContent className="p-5">
              <Leaf className="h-5 w-5 text-amber-400" />
              <p className="mt-3 text-2xl font-black">{profile.beesSaved.toLocaleString('fr-FR')}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Abeilles sauvees</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardContent className="p-5">
              <Sparkles className={`h-5 w-5 ${accentTheme.accentText}`} />
              <p className={`mt-3 text-2xl font-black ${accentTheme.accentText}`}>
                {profile.points.toLocaleString('fr-FR')}
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Points d'impact</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardContent className="p-5">
              <Wind className="h-5 w-5 text-sky-400" />
              <p className="mt-3 text-2xl font-black">
                {profile.co2CapturedKg.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                kg
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">CO2 capture</p>
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardContent className="p-5">
              <Flame className="h-5 w-5 text-orange-400" />
              <p className="mt-3 text-2xl font-black">{profile.streakDays}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Jours de serie</p>
            </CardContent>
          </Card>
        </section>

        {factionContribution ? (
          <section
            className={`mt-6 overflow-hidden rounded-[2rem] border bg-card/80 p-6 shadow-xl ${accentTheme.accentBorder} ${accentTheme.accentShadow}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${accentTheme.accentTextSoft}`}>
                  Faction en action
                </p>
                <h2 className="mt-2 text-xl font-black tracking-tight">{collectiveGoal.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{collectiveGoal.summary}</p>
              </div>
              <Badge variant="outline" className={`${accentTheme.badgeClassName} ${accentTheme.accentText}`}>
                {factionContribution.contributionShare}% de l effort
              </Badge>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className={`rounded-2xl border p-4 ${accentTheme.accentBorder} ${accentTheme.accentBgSoft}`}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Trophy className={`h-4 w-4 ${accentTheme.accentText}`} />
                  Contribution
                </div>
                <p className="mt-3 text-2xl font-black">{factionContribution.contributionSeeds.toLocaleString('fr-FR')}</p>
                <p className="mt-1 text-sm text-muted-foreground">{factionContribution.members} membres mobilises</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Target className={`h-4 w-4 ${accentTheme.accentText}`} />
                  Objectif global
                </div>
                <p className="mt-3 text-base font-black">{collectiveGoal.projectName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {collectiveGoal.currentSeeds.toLocaleString('fr-FR')} / {collectiveGoal.targetSeeds.toLocaleString('fr-FR')} graines
                </p>
                <div className="mt-3 h-2 rounded-full bg-border/60">
                  <div className="h-full rounded-full bg-white" style={{ width: `${collectiveGoal.progress}%` }} />
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <Gift className={`h-4 w-4 ${accentTheme.accentText}`} />
                  Prestige
                </div>
                <p className="mt-3 text-base font-black">{factionContribution.prestigeTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{factionContribution.prestigeSummary}</p>
                <p className={`mt-3 text-sm font-semibold ${accentTheme.accentText}`}>
                  Reward commune: {collectiveGoal.commonRewardTitle}
                </p>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
