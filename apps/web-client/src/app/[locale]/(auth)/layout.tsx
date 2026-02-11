import { Leaf, Shield, TrendingUp, Users, Sparkles, CheckCircle2 } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { Link } from '@/i18n/navigation'
import { placeholderImages } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

const features = [
  { icon: Shield, text: 'Investissements sécurisés & transparents', color: 'text-emerald-400' },
  { icon: TrendingUp, text: 'Suivi d\'impact & biodiversité en temps réel', color: 'text-blue-400' },
  { icon: Sparkles, text: 'Récompenses exclusives & BioDex collectionnable', color: 'text-amber-400' },
]

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Branding & Social Proof */}
      <div className="relative hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between overflow-hidden p-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <img 
            src={placeholderImages.projects[2]} 
            alt="Nature Background" 
            className="h-full w-full object-cover transition-transform duration-[10s] scale-110 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-primary/40" />
        </div>

        {/* Animated Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[100px]" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 group">
          <Logo variant="icon" colorMode="dark" className="h-12 w-12 transition-transform group-hover:scale-105 duration-500" width={48} height={48} />
          <span className="text-2xl font-black text-white transition-transform group-hover:scale-105 duration-500">Make the Change</span>
        </Link>

        {/* Main Content */}
        <div className="relative z-10 space-y-12 max-w-xl">
          <div className="space-y-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1 rounded-full font-black uppercase tracking-widest text-[10px] backdrop-blur-md">
              Plateforme certifiée
            </Badge>
            <h1 className="text-5xl xl:text-7xl font-black leading-[1.05] text-white tracking-tighter">
              Le futur de la <span className="text-primary">biodiversité</span> est entre vos mains.
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              Transformez votre épargne en impact concret et rejoignez la plus grande communauté d'investisseurs engagés.
            </p>
          </div>

          {/* Features List */}
          <div className="grid gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-colors group-hover:bg-white/10">
                  <feature.icon className={cn("h-6 w-6", feature.color)} />
                </div>
                <span className="text-lg font-bold text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Quote */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 max-w-md">
            <div className="h-12 w-12 shrink-0 rounded-full border-2 border-primary/40 bg-muted overflow-hidden">
               <img src={placeholderImages.projects[0]} alt="User" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-white italic">"Une plateforme qui donne enfin du sens à chaque euro investi."</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-primary">Marie D. • Protectrice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12 xl:px-24 bg-gradient-to-br from-background via-muted/20 to-emerald-50/20 dark:via-muted/5 dark:to-emerald-950/10">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
        
        {/* Mobile Logo */}
        <Link href="/" className="mb-12 flex items-center justify-center lg:hidden gap-3">
          <Logo variant="icon" className="h-16 w-16" width={64} height={64} />
          <span className="text-2xl font-black text-foreground">Make the Change</span>
        </Link>

        <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>

        {/* Mobile Social Proof */}
        <div className="mt-12 flex flex-col items-center gap-4 lg:hidden">
          <div className="flex -space-x-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted shadow-lg" />
            ))}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-white text-[10px] font-black shadow-lg">
              +10K
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Impact vérifié par la communauté
          </div>
        </div>
      </div>
    </div>
  )
}

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", className)}>
    {children}
  </span>
)
