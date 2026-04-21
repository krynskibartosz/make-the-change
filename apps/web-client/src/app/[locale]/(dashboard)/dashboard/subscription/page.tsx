'use client'

import { useEffect } from 'react'
import { PaywallCard } from '@/app/[locale]/onboarding/_features/paywall-card'

export default function SubscriptionPage() {
  useEffect(() => {
    const bottomNav = document.getElementById('mobile-bottom-nav')
    if (bottomNav) {
      bottomNav.style.display = 'none'
    }

    return () => {
      if (bottomNav) {
        bottomNav.style.display = ''
      }
    }
  }, [])

  return <PaywallCard mode="dashboard" />
}
