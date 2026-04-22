'use client'

import { PaywallCard } from './paywall-card'
import { useRouter } from '@/i18n/navigation'

export function Step6Paywall() {
  const router = useRouter()
  
  const handleSubscribe = () => {
    // Après abonnement, rediriger vers le dashboard
    router.push('/aventure?tab=defis')
  }
  
  const handleDismiss = () => {
    // Si l'utilisateur refuse, quand même le laisser accéder à l'app
    router.push('/aventure?tab=defis')
  }
  
  return (
    <PaywallCard 
      mode="onboarding" 
      onDismiss={handleDismiss}
      onSubscribe={handleSubscribe}
    />
  )
}
