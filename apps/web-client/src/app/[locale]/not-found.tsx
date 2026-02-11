import { Button } from '@make-the-change/core/ui'
import { Home, Search } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('system_pages.not_found')

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl font-bold text-muted-foreground/20">404</div>
      <h1 className="mb-2 text-2xl font-bold">{t('title')}</h1>
      <p className="mb-6 max-w-md text-muted-foreground">{t('description')}</p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            {t('home')}
          </Button>
        </Link>
        <Link href="/projects">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            {t('explore')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
