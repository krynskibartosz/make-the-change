import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { Leaf, Sprout, TreePine } from 'lucide-react'
import { connection } from 'next/server'
import { getLocale } from 'next-intl/server'
import { completeMockSetup } from '@/app/[locale]/(auth)/actions'
import { Link, redirect } from '@/i18n/navigation'
import { isMockDataSource } from '@/lib/mock/data-source'
import { sanitizeReturnTo } from '@/lib/mock/mock-session'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'

const setupChoices = [
  {
    value: 'Vie Sauvage',
    title: 'Vie Sauvage',
    description: 'Pour proteger la faune, les pollinisateurs et les especes emblemiques.',
    icon: Leaf,
    className: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
  },
  {
    value: 'Terres & Forêts',
    title: 'Terres & Forêts',
    description: 'Pour regenerer les sols, les forets et les paysages agricoles vivants.',
    icon: TreePine,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    value: 'Artisans Locaux',
    title: 'Artisans Locaux',
    description: 'Pour soutenir les producteurs, cooperatives et savoir-faire locaux.',
    icon: Sprout,
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
] as const

type SetupPageProps = {
  searchParams: Promise<{
    returnTo?: string
  }>
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  await connection()

  if (!isMockDataSource) {
    const locale = await getLocale()
    redirect({ href: '/dashboard/profile', locale })
  }

  const viewer = await getCurrentViewer()
  const locale = await getLocale()
  const resolvedSearchParams = await searchParams
  const returnTo = sanitizeReturnTo(resolvedSearchParams.returnTo || '', '/defis')

  if (!viewer) {
    redirect({ href: `/login?returnTo=${encodeURIComponent(returnTo)}`, locale })
  }

  const resolvedViewer = viewer as NonNullable<typeof viewer>

  if (resolvedViewer.faction) {
    redirect({ href: returnTo, locale })
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Setup</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Choisis ta faction
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Une derniere etape pour personnaliser ton aventure avant de reprendre ton parcours.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {setupChoices.map((choice) => {
            const Icon = choice.icon

            return (
              <Card
                key={choice.value}
                className="border-border/60 bg-card/80 shadow-xl shadow-primary/5 backdrop-blur"
              >
                <CardHeader>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${choice.className}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">{choice.title}</CardTitle>
                  <CardDescription>{choice.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={completeMockSetup}>
                    <input type="hidden" name="faction" value={choice.value} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <Button type="submit" className="w-full">
                      Choisir cette faction
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link href={returnTo} className="hover:text-foreground hover:underline">
            Revenir plus tard
          </Link>
        </div>
      </div>
    </div>
  )
}
