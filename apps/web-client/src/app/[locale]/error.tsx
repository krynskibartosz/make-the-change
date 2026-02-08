'use client'

import { Button } from '@make-the-change/core/ui'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams<{ locale?: string }>()
  const locale = typeof params?.locale === 'string' ? params.locale : undefined
  const homeHref = locale ? `/${locale}` : '/'

  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">Une erreur est survenue</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Nous nous excusons pour ce désagrément. Veuillez réessayer ou retourner à l'accueil.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
        <Link href={homeHref}>
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 text-xs text-muted-foreground">Code erreur: {error.digest}</p>
      )}
    </div>
  )
}
