import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ZoneChantierClient } from './zone-chantier-client'

export default function PlansPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center gap-3 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <Link
          href="/chantier"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-elevated active:scale-95 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold leading-tight truncate">Chantier</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Zones &amp; références techniques</p>
        </div>
      </header>

      <div className="pb-6">
        <ZoneChantierClient />
      </div>
    </main>
  )
}
