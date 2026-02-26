
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio Producteur - Make the Change',
  description: 'Gérez vos updates et interagissez avec votre communauté.',
}

export default function PartnerStudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="mx-auto max-w-md overflow-hidden bg-background shadow-2xl sm:min-h-screen sm:border-x">
        <header className="sticky top-0 z-50 flex h-14 items-center border-b bg-background/80 px-4 backdrop-blur-md">
          <div className="font-bold text-primary">MTC Studio</div>
        </header>
        <main className="pb-20">
          {children}
        </main>
        
        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background px-6 pb-6 pt-3 sm:hidden">
          <div className="flex justify-between">
            <div className="flex flex-col items-center gap-1 text-primary">
              <span className="text-xs font-medium">Accueil</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <span className="text-xs font-medium">Projets</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <span className="text-xs font-medium">Messages</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <span className="text-xs font-medium">Compte</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
