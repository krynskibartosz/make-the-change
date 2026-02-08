import { Button } from '@make-the-change/core/ui'
import { Home, Search } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl font-bold text-muted-foreground/20">404</div>
      <h1 className="mb-2 text-2xl font-bold">Page introuvable</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </Link>
        <Link href="/projects">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Explorer
          </Button>
        </Link>
      </div>
    </div>
  )
}
