import { Leaf, Shield, TrendingUp, Users } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { Link } from '@/i18n/navigation'

const features = [
  { icon: Shield, text: 'Investissements sécurisés' },
  { icon: TrendingUp, text: 'Suivi en temps réel' },
  { icon: Users, text: '+10 000 investisseurs' },
]

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding & Social Proof */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-emerald-600 to-teal-500 p-12 text-primary-foreground">
        {/* Animated Background Blobs */}
        <div className="absolute -left-20 -top-20 h-80 w-80 animate-pulse rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-white/5 blur-2xl"
          style={{ animationDelay: '2s' }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Leaf className="h-7 w-7" />
          </div>
          <span className="text-2xl font-bold">Make the CHANGE</span>
        </Link>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              Investissez dans la biodiversité,
              <br />
              récoltez des récompenses
            </h1>
            <p className="text-lg opacity-90">
              Rejoignez une communauté engagée pour un avenir durable.
            </p>
          </div>

          {/* Features List */}
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Quote */}
        <div className="relative z-10">
          <blockquote className="border-l-2 border-white/40 pl-4 italic opacity-80">
            "Une plateforme qui donne du sens à chaque euro investi."
          </blockquote>
          <p className="mt-2 text-sm opacity-60">— Marie D., Investisseuse depuis 2024</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="relative flex flex-1 flex-col items-center justify-start px-4 pb-16 pt-10 lg:justify-center lg:px-8 lg:py-12 bg-gradient-to-br from-background via-muted/30 to-emerald-50/40 dark:from-background dark:via-muted/20 dark:to-emerald-950/20">
        <div className="absolute -top-24 right-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 left-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        {/* Mobile Logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Make the CHANGE</span>
        </Link>

        <div className="relative z-10 w-full max-w-md">{children}</div>

        {/* Mobile Social Proof */}
        <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground lg:hidden">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
            ))}
          </div>
          <span>+10 000 investisseurs nous font confiance</span>
        </div>
      </div>
    </div>
  )
}
