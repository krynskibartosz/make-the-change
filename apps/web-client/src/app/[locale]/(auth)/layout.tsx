import { CheckCircle2, Shield, Sparkles, TrendingUp } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { PropsWithChildren } from 'react'
import { Logo } from '@/components/ui/logo'
import { Link } from '@/i18n/navigation'
import { placeholderImages } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'

export default async function AuthLayout({ children }: PropsWithChildren) {
  const t = await getTranslations('auth')
  const features = [
    { icon: Shield, text: t('layout.features.secure'), color: 'text-client-emerald-400' },
    { icon: TrendingUp, text: t('layout.features.tracking'), color: 'text-client-blue-400' },
    { icon: Sparkles, text: t('layout.features.rewards'), color: 'text-client-amber-400' },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel - Branding & Social Proof */}
      <div className="relative hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between overflow-hidden p-16 h-full">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <img
            src={placeholderImages.projects[2]}
            alt={t('layout.background_alt')}
            className="h-full w-full object-cover transition-transform duration-[10s] scale-110 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-primary/15 dark:from-client-slate-950 dark:via-client-slate-950 dark:to-client-slate-900/95" />
        </div>

        {/* Animated Accents */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-client-emerald-500/5 dark:bg-client-emerald-500/10 blur-[100px]" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 group">
          <Logo
            variant="icon"
            className="h-12 w-12 transition-transform group-hover:scale-105 duration-500"
            width={48}
            height={48}
          />
          <span className="text-2xl font-black text-foreground transition-transform group-hover:scale-105 duration-500">
            Make the Change
          </span>
        </Link>

        {/* Main Content */}
        <div className="relative z-10 space-y-8 max-w-xl">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:border-primary/30 px-4 py-1 rounded-full font-black uppercase tracking-widest text-[10px] backdrop-blur-md">
              {t('layout.badge')}
            </Badge>
            <h1 className="text-5xl xl:text-7xl font-black leading-[1.05] text-foreground tracking-tighter">
              {t('layout.title_prefix')}{' '}
              <span className="text-primary">{t('layout.title_highlight')}</span>{' '}
              {t('layout.title_suffix')}
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              {t('layout.description')}
            </p>
          </div>

          {/* Features List */}
          <div className="grid gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50 transition-colors group-hover:bg-background">
                  <feature.icon className={cn('h-6 w-6', feature.color)} />
                </div>
                <span className="text-lg font-bold text-foreground/90">{feature.text}</span>
              </div>
            ))}
          </div>

        
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-8 lg:px-12 lg:py-6 xl:px-24 xl:py-4 bg-gradient-to-br from-card via-background to-muted/30 dark:via-muted/5 dark:to-client-emerald-950/10 h-full overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/3 dark:bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-client-emerald-500/3 dark:bg-client-emerald-500/5 blur-[100px] pointer-events-none" />

        {/* Mobile Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center lg:hidden gap-3">
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
              <div
                key={i}
                className="h-10 w-10 rounded-full border-2 border-background bg-muted shadow-lg"
              />
            ))}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground text-[10px] font-black shadow-lg">
              +10K
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
            <CheckCircle2 className="h-4 w-4 text-client-emerald-500" />
            {t('layout.community_proof')}
          </div>
        </div>
      </div>
    </div>
  )
}

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      className,
    )}
  >
    {children}
  </span>
)
