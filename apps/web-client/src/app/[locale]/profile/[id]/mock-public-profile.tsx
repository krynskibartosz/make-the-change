import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { Flame, Leaf, MapPin, Sparkles, Wind } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getFactionTheme } from '@/lib/faction-theme'
import { getMockCollectiveGuildsByIds } from '@/lib/mock/mock-collective'
import type { Profile } from '@/lib/mock/types'

type MockPublicProfilePageProps = {
  profile: Profile
  isOwnProfile: boolean
}

export function MockPublicProfilePage({ profile, isOwnProfile }: MockPublicProfilePageProps) {
  const accentTheme = getFactionTheme(profile.faction)
  const guilds = getMockCollectiveGuildsByIds(profile.tribeIds)

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <section className={`overflow-hidden rounded-[2rem] border bg-card/80 p-6 shadow-xl backdrop-blur sm:p-8 ${accentTheme.accentBorder} ${accentTheme.accentShadow}`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="h-28 w-28 overflow-hidden rounded-full border border-border/60 bg-muted/30">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center text-3xl font-black ${accentTheme.accentText}`}>
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
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Abeilles sauvees
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardContent className="p-5">
              <Sparkles className={`h-5 w-5 ${accentTheme.accentText}`} />
              <p className={`mt-3 text-2xl font-black ${accentTheme.accentText}`}>{profile.points.toLocaleString('fr-FR')}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Points d'impact
              </p>
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
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                CO2 capture
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/80">
            <CardContent className="p-5">
              <Flame className="h-5 w-5 text-orange-400" />
              <p className="mt-3 text-2xl font-black">{profile.streakDays}</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Jours de serie
              </p>
            </CardContent>
          </Card>
        </section>

        <section className={`mt-6 rounded-[2rem] border bg-card/80 p-6 shadow-xl ${accentTheme.accentBorder} ${accentTheme.accentShadow}`}>
          <h2 className="text-xl font-black tracking-tight">Tribus actives</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {guilds.length > 0 ? (
              guilds.map((guild) => (
                <Badge key={guild.id} variant="outline" className="rounded-full px-3 py-1">
                  {guild.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucune tribu publique pour le moment.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
