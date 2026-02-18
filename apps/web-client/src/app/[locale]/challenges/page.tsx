import { Badge, Button, Card, CardContent, Progress } from '@make-the-change/core/ui'
import { ArrowRight, Calendar, Flame, CheckCircle2, Sparkles, Trophy, Target, Zap } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'
import { PageHero } from '@/components/ui/page-hero'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

export default async function ChallengesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: challenges, error } = await supabase
    .schema('gamification')
    .from('challenges')
    .select('*, user_challenges(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching challenges:', error)
  }

  const items = (challenges || []).map((c: any) => {
    const progressEntry = Array.isArray(c.user_challenges) ? c.user_challenges[0] : null
    const progress = progressEntry?.progress ?? 0
    const target = progressEntry?.target ?? 100
    const percentage = Math.min((progress / target) * 100, 100)
    const isCompleted = !!progressEntry?.completed_at
    const isClaimed = !!progressEntry?.claimed_at

    return {
      ...c,
      userProgress: {
        progress,
        target,
        percentage,
        isCompleted,
        isClaimed
      }
    }
  })

  return (
    <>
      <PageHero
        badge={
          <span className="flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5 text-primary animate-pulse" />
            Saison 1 : Éveil de la Conscience
          </span>
        }
        title="Missions & Challenges"
        description="Accomplissez des actions concrètes pour la planète et gagnez des récompenses exclusives."
        size="lg"
        variant="gradient"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-client-amber-500/20 blur-[100px]" />
        </div>
      </PageHero>

      <SectionContainer size="lg" className="-mt-12 relative z-20 pb-24">
        {items.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center rounded-[3rem] border-2 border-dashed bg-muted/20 p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
                <Target className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="text-xl font-black tracking-tight">Aucune mission disponible</p>
              <p className="text-muted-foreground font-medium">Revenez bientôt pour de nouveaux défis !</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <Link key={c.id} href={`/challenges/${c.slug}`} className="group block h-full">
                <Card className="h-full border bg-background/60 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-[2.5rem] overflow-hidden">
                  <CardContent className="space-y-6 p-8">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        c.type === 'daily' ? "bg-info/10 text-info border-info/20" :
                          c.type === 'monthly' ? "bg-accent/10 text-accent border-accent/20" :
                            "bg-primary/10 text-primary border-primary/20"
                      )}>
                        {c.type === 'daily' ? 'Quotidien' : c.type === 'monthly' ? 'Mensuel' : 'Saisonnier'}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-client-amber-500/10 text-client-amber-600 border border-client-amber-500/20 text-[10px] font-black uppercase tracking-tight">
                        <Sparkles className="h-3 w-3" />
                        {c.reward_points > 0 ? `+${c.reward_points} pts` : 'Badge'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
                        {c.title}
                        {c.userProgress.isCompleted && (
                          <div className="bg-success text-client-white rounded-full p-0.5">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">{c.description}</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-muted-foreground">
                          Progression
                        </span>
                        <span className="text-foreground">{c.userProgress.progress} / {c.userProgress.target}</span>
                      </div>
                      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="absolute inset-0 bg-primary transition-all duration-1000 ease-out"
                          style={{ width: `${c.userProgress.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Expire bientôt
                      </div>

                      {c.userProgress.isCompleted && !c.userProgress.isClaimed ? (
                        <div className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest animate-pulse">
                          <Zap className="h-3.5 w-3.5" />
                          Réclamer !
                        </div>
                      ) : c.userProgress.isClaimed ? (
                        <div className="text-success font-black text-[10px] uppercase tracking-widest">Récupéré</div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                          <Flame className="h-3.5 w-3.5 text-warning" />
                          En cours
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Gamification Tip Card */}
        <div className="mt-16 relative group overflow-hidden rounded-[3rem] border bg-client-slate-950 p-8 md:p-12 text-client-white shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-40" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-3xl bg-client-white/5 backdrop-blur-xl border border-client-white/10 flex items-center justify-center shrink-0 rotate-12 group-hover:rotate-0 transition-transform">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-black tracking-tight">Boostez votre Impact Score</p>
                <p className="text-client-slate-400 font-medium max-w-md">
                  Chaque challenge accompli vous propulse dans le classement global et débloque des avantages exclusifs en boutique.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full md:w-auto h-14 px-8 rounded-2xl border-client-white/10 text-client-white hover:bg-client-white/5 font-black uppercase tracking-widest text-xs">
              <Link href="/leaderboard">
                Voir le classement <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
