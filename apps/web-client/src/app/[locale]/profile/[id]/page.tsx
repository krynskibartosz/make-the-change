import { Badge, Card, CardContent, Progress } from '@make-the-change/core/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@make-the-change/core/ui'
import { Crown, Leaf, MapPin, Sparkles, Trophy, Wallet, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ProfileHeader } from '@/components/profile/profile-header'
import { SectionContainer } from '@/components/ui/section-container'
import { FeedClient } from '@/components/social/feed-client'
import { Link } from '@/i18n/navigation'
import { getLevelProgress, getMilestoneBadges } from '@/lib/gamification'
import { createClient } from '@/lib/supabase/server'
import { getUserFeed } from '@/lib/social/feed.reads'
import { asNumber, asString, isRecord } from '@/lib/type-guards'
import { cn, formatCurrency, formatDate, formatPoints } from '@/lib/utils'

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch public profile data from the secure view
  const { data: profile } = await supabase
    .from('public_user_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch recent public investments
  const { data: rawInvestments } = await supabase
    .from('investments')
    .select(`
      id,
      amount_eur_equivalent,
      amount_points,
      created_at,
      project:public_projects!project_id(
        name_default,
        slug,
        location_city,
        location_country
      )
    `)
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  type PublicProjectRef = {
    name_default: string
    slug: string
    location_city: string | null
    location_country: string | null
  }
  type InvestmentRow = {
    id: string
    amount_points: number | null
    created_at: string
    project: PublicProjectRef | PublicProjectRef[] | null
  }

  const toProjectRef = (value: unknown): PublicProjectRef | null => {
    if (!isRecord(value)) {
      return null
    }

    const nameDefault = asString(value.name_default)
    const slugValue = asString(value.slug)
    if (!nameDefault || !slugValue) {
      return null
    }

    return {
      name_default: nameDefault,
      slug: slugValue,
      location_city: asString(value.location_city) || null,
      location_country: asString(value.location_country) || null,
    }
  }

  const toInvestmentRow = (value: unknown): InvestmentRow | null => {
    if (!isRecord(value)) {
      return null
    }

    const idValue = asString(value.id)
    const createdAt = asString(value.created_at)
    if (!idValue || !createdAt) {
      return null
    }

    const projectRaw = value.project
    const project = Array.isArray(projectRaw)
      ? toProjectRef(projectRaw[0])
      : toProjectRef(projectRaw)

    return {
      id: idValue,
      amount_points: asNumber(value.amount_points, 0),
      created_at: createdAt,
      project,
    }
  }

  const investments = Array.isArray(rawInvestments)
    ? rawInvestments
      .map((entry) => toInvestmentRow(entry))
      .filter((entry): entry is InvestmentRow => entry !== null)
    : []

  // Calculate legitimate stats
  const points = profile.points_balance || 0
  const projects = profile.projects_count || 0
  const invested = profile.total_invested_eur || 0

  // Calculate impact score using formula (same as database view)
  const impactScore = profile.biodiversity_impact || 0

  const levelProgress = getLevelProgress(impactScore)
  const badgeLabels = getMilestoneBadges({
    points,
    projects,
    invested,
    leaderboardRank: 0, // We don't have rank in this view yet, can improved later
  })

  // Fetch social feed posts
  const userPosts = await getUserFeed(id, 1, 10)

  // Map badge strings to UI objects
  const milestoneBadges = badgeLabels.map((label) => {
    let icon = Trophy
    let color = 'text-primary'

    if (label.includes('projet')) {
      icon = Leaf
      color = 'text-primary'
    } else if (label.includes('Investisseur')) {
      icon = Wallet
      color = 'text-primary'
    } else if (label.includes('Top')) {
      icon = Crown
      color = 'text-primary'
    }

    return {
      id: label,
      label,
      icon,
      color,
    }
  })

  return (
    <SectionContainer size="md" className="space-y-8 py-8 md:py-12">
      {/* 1. Header Section */}
      <ProfileHeader
        name={profile.display_name || ''}
        avatarUrl={profile.avatar_url || undefined}
        coverUrl={profile.cover_url || undefined}
        level={levelProgress.currentLevel}
        impactScore={impactScore}
        readonly={true}
      />

      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="activite">Activité</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="impact">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              {/* 2. Impact Stats */}
              <section className="grid gap-4 sm:grid-cols-2">
                <Card className="overflow-hidden border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Leaf className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-primary">Impact Biodiversité</h3>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          {impactScore.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-sm font-medium text-primary/80">points</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-xs font-medium text-primary/80">
                          <span>Niveau {levelProgress.currentLevel}</span>
                          <span>{Math.round(levelProgress.progress)}%</span>
                        </div>
                        <Progress value={levelProgress.progress} className="h-2 bg-primary/10" />
                        <p className="text-xs text-primary/60">
                          {formatPoints(levelProgress.nextMin - impactScore)} points pour le prochain
                          niveau
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex flex-col justify-between">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold">Investissements</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Projets soutenus</p>
                        <p className="text-2xl font-bold">{profile.projects_count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total investi (est.)</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(profile.total_invested_eur || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* 3. Badges */}
              <section>
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Trophy className="h-5 w-5 text-primary" />
                  Badges & Succès
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {milestoneBadges.map((badge) => {
                    const Icon = badge.icon
                    return (
                      <Card key={badge.id} className="border-border/50 bg-muted/30">
                        <CardContent className="flex flex-col items-center p-4 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                            <Icon className={cn('h-6 w-6', badge.color)} />
                          </div>
                          <span className="text-sm font-medium">{badge.label}</span>
                        </CardContent>
                      </Card>
                    )
                  })}
                  {/* Placeholder for unimplemented badges */}
                  <Card className="border-dashed border-border/50 bg-transparent">
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center opacity-50">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">À venir</span>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* 4. Recent Activity */}
              <section>
                <h3 className="mb-4 font-semibold">Activité Récente</h3>
                <div className="space-y-4">
                  {investments.length > 0 ? (
                    investments.map((investment) => {
                      const project = Array.isArray(investment.project)
                        ? investment.project[0]
                        : investment.project
                      if (!project) return null

                      return (
                        <Card key={investment.id}>
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Leaf className="h-5 w-5" />
                              </div>
                              <div>
                                <Link
                                  href={`/projects/${project.slug}`}
                                  className="font-medium hover:underline"
                                >
                                  {project.name_default}
                                </Link>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>Investissement</span>
                                  <span>•</span>
                                  <span>{formatDate(investment.created_at)}</span>
                                  {project.location_city && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-0.5">
                                        <MapPin className="h-3 w-3" />
                                        {project.location_city}, {project.location_country}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary">
                              +{formatPoints(investment.amount_points || 0)} pts
                            </Badge>
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                      Aucune activité récente visible.
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">Informations</h3>
                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Membre depuis</dt>
                      <dd className="font-medium">{formatDate(profile.created_at || new Date())}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Ville</dt>
                      <dd className="font-medium">{profile.city || 'Non renseigné'}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Pays</dt>
                      <dd className="font-medium">{profile.country || 'Non renseigné'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activite">
          <Suspense fallback={<div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <FeedClient initialPosts={userPosts} hideCreatePost />
          </Suspense>
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {milestoneBadges.map((badge) => {
              const Icon = badge.icon
              return (
                <Card key={badge.id} className="border-border/50 bg-muted/30">
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                      <Icon className={cn('h-6 w-6', badge.color)} />
                    </div>
                    <span className="text-sm font-medium">{badge.label}</span>
                  </CardContent>
                </Card>
              )
            })}
            <Card className="border-dashed border-border/50 bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center opacity-50">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">À venir</span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  )
}
