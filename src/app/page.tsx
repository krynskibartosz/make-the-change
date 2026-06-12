'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useRole } from '@/lib/role-context'
import { getTabsForRole } from './(tabs)/_components/tabs'

export default function HomePage() {
  const { role, isReady } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (isReady && role) {
      const tabs = getTabsForRole(role)
      if (tabs.length > 0) {
        router.replace(tabs[0].href)
      } else {
        router.replace('/chantier')
      }
    }
  }, [isReady, role, router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="size-8 animate-spin rounded-full border-4 border-border border-b-primary" />
    </div>
  )
}
