'use client'

import { Button } from '@make-the-change/core/ui'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Link } from '@/i18n/navigation'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('system_pages.error')

  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">{t('title')}</h1>
      <p className="mb-6 max-w-md text-muted-foreground">{t('description')}</p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('retry')}
        </Button>
        <Link href="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            {t('home')}
          </Button>
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 text-xs text-muted-foreground">
          {t('error_code', { code: error.digest })}
        </p>
      )}
    </div>
  )
}
