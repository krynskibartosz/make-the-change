'use client'

import {
  Button,
} from '@make-the-change/core/ui'
import {
  Coins,
  FileText,
  HelpCircle,
  Info,
  LayoutDashboard,
  Mail,
  PiggyBank,
  ShieldCheck,
  ShoppingBag,
  Users,
  Package,
  Trophy,
  Leaf,
  FileQuestion,
  Lock,
  UserPlus,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MenuPage() {
  const [user, setUser] = useState<{ id: string; email: string; avatarUrl?: string | null } | null>(null)
  const t = useTranslations('navigation') // Assuming translations exist or fallback
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000'

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single()
            setUser({
                id: user.id,
                email: user.email || '',
                avatarUrl: profile?.avatar_url
            })
        }
    }
    getUser()
  }, [])

  const initial = (user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="container px-4 py-6 space-y-8">
        
        <h1 className="text-2xl font-bold tracking-tight">Menu</h1>

        {/* User Profile Section */}
        {user ? (
          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary ring-2 ring-background">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{initial}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-semibold text-lg">{user.email}</p>
              <Link 
                href="/dashboard/profile" 
                className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 mt-1"
              >
                Voir mon profil
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/login">
                  <Lock className="h-4 w-4 mr-2" />
                  Se connecter
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full">
                <Link href="/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  S'inscrire
                </Link>
              </Button>
            </div>
            <div className="space-y-1 rounded-xl border bg-card p-1 shadow-sm">
              <Link href="/forgot-password" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  Mot de passe oublié
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Links (if user) */}
        {user && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
              Mon Espace
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard" className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Tableau de bord</span>
              </Link>
              
              <Link href="/dashboard/investments" className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <PiggyBank className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Investissements</span>
              </Link>

              <Link href="/dashboard/orders" className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Commandes</span>
              </Link>

              <Link href="/dashboard/points" className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Coins className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">Points</span>
              </Link>
            </div>
          </div>
        )}

        {/* General Links */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
            Explorer
          </h3>
          <div className="space-y-1 rounded-xl border bg-card p-1 shadow-sm">
            <Link href="/blog" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Blog
            </Link>
            <div className="mx-4 border-t" />
            <Link href="/about" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <Info className="h-5 w-5 text-muted-foreground" />
                À propos
            </Link>
            <div className="mx-4 border-t" />
            <Link href="/how-it-works" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                Comment ça marche
            </Link>
            <div className="mx-4 border-t" />
            <Link href="/contact" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <Mail className="h-5 w-5 text-muted-foreground" />
                Contact
            </Link>
            <div className="mx-4 border-t" />
            <Link href="/faq" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <FileQuestion className="h-5 w-5 text-muted-foreground" />
                FAQ
            </Link>
            <div className="mx-4 border-t" />
            <Link href="/products" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <Package className="h-5 w-5 text-muted-foreground" />
                Produits
            </Link>
            <div className="mx-4 border-t" />
            <Link href="/producers" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <Users className="h-5 w-5 text-muted-foreground" />
                Producteurs
            </Link>
            <div className="mx-4 border-t" />
            <Link href="/projects" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <Leaf className="h-5 w-5 text-muted-foreground" />
                Projets
            </Link>
            <div className="mx-4 border-t" />
            <Link href="/biodex" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                <Trophy className="h-5 w-5 text-muted-foreground" />
                Biodex
            </Link>
          </div>
        </div>

        {/* Shopping & Activities */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
            Shopping & Activités
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/cart" className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Panier</span>
            </Link>
            
            <Link href="/challenges" className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Trophy className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Défis</span>
            </Link>
          </div>
        </div>

        {/* Partners & Legal */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
            Partenaires
          </h3>
          <a 
            href={ADMIN_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-dashed bg-card/50 px-4 py-4 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              Espace Partenaire
          </a>
        </div>

        {/* Settings & Theme */}
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm mt-8">
            <span className="font-medium">Thème de l'application</span>
            <ThemeToggle />
        </div>

        <div className="text-center text-xs text-muted-foreground pt-8 pb-4">
            <p>Make the CHANGE v1.0.0</p>
            <div className="flex justify-center gap-4 mt-2">
                <Link href="/terms" className="hover:underline">Conditions</Link>
                <Link href="/privacy" className="hover:underline">Confidentialité</Link>
            </div>
        </div>

      </div>
    </div>
  )
}
