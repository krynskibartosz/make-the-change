'use client'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { LocalizedLink as Link } from '@/components/localized-link'
import { useAuth } from '@/hooks/use-auth'

const PartnerDashboardClient = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Session expirée. Veuillez vous reconnecter.</p>
          <Button asChild>
            <Link href="/admin/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto px-4 md:px-6 py-4 md:py-6 safe-bottom">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
        Bienvenue sur votre espace Partenaire
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Mes Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              0
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Mes Projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold bg-gradient-accent bg-clip-text text-transparent">
              0
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold text-foreground">0</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Revenus (€)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold text-success">€0</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 md:mt-8">
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Button asChild className="h-12 md:h-10 text-responsive" variant="default">
                <Link href="/partner/products">Gérer Produits</Link>
              </Button>
              <Button asChild className="h-12 md:h-10 text-responsive" variant="accent">
                <Link href="/partner/projects">Voir Projets</Link>
              </Button>
              <Button asChild className="h-12 md:h-10 text-responsive" variant="info">
                <Link href="/partner/orders">Commandes</Link>
              </Button>
              <Button asChild className="h-12 md:h-10 text-responsive" variant="outline">
                <Link href="/partner/profile">Mon Profil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PartnerDashboardClient
