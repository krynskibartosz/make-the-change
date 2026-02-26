
import { Button } from '@make-the-change/core/ui'
import { Card } from '@make-the-change/core/ui'
import { Camera, Leaf, MessageCircle, Heart, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function PartnerStudioPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome & Stats */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Bonjour, Pierre ! 👋</h1>
            <p className="text-sm text-muted-foreground">Domaine de l'Oliveraie</p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border bg-muted">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Olive" alt="Avatar" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="flex flex-col items-center justify-center gap-1 border-none bg-primary/5 p-4 text-center shadow-none dark:bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">1,240</span>
            <span className="text-xs font-medium text-muted-foreground">Investisseurs</span>
          </Card>
          <Card className="flex flex-col items-center justify-center gap-1 border-none bg-accent/5 p-4 text-center shadow-none dark:bg-accent/10">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="text-2xl font-bold text-foreground">15.4k€</span>
            <span className="text-xs font-medium text-muted-foreground">Collectés</span>
          </Card>
        </div>
      </section>

      {/* Main Action: Snap & Update */}
      <section>
        <Link href="/partner/studio/snap" className="block">
          <Button 
            className="group relative h-auto w-full flex-col gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 py-8 text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/25"
            size="lg"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
              <Camera className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <span className="block text-lg font-bold">Nouvelle Update</span>
              <span className="block text-xs font-medium opacity-90">Partagez une photo du terrain</span>
            </div>
          </Button>
        </Link>
      </section>

      {/* Recent Activity Feed (Interactions) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Activité Récente</h2>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">Tout voir</Button>
        </div>

        <div className="space-y-2">
          {/* Item 1 */}
          <div className="flex items-start gap-3 rounded-xl border bg-card p-3 shadow-sm">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <Heart className="h-4 w-4 fill-current" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Alice M.</span> et <span className="font-semibold">42 autres</span> ont aimé votre update "Récolte 2025".
              </p>
              <p className="text-xs text-muted-foreground">Il y a 2h</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3 rounded-xl border bg-card p-3 shadow-sm">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Guilde Eco-Warriors</span> a commenté : "Super travail, hâte de goûter !"
              </p>
              <div className="mt-2 rounded-lg bg-muted/50 p-2 text-xs italic text-muted-foreground">
                "Bravo pour cette récolte exceptionnelle..."
              </div>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">Répondre</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs">J'aime</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Il y a 5h</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-3 rounded-xl border bg-card p-3 shadow-sm">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm text-foreground">
                Nouveau palier atteint ! <span className="font-semibold">100 arbres</span> parrainés ce mois-ci.
              </p>
              <p className="text-xs text-muted-foreground">Hier</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
