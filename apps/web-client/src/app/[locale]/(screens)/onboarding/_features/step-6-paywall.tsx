'use client'

import { PaywallCard } from './paywall-card'
import { useRouter } from '@/i18n/navigation'

export function Step6Paywall() {
  const router = useRouter()
  
  const handleSubscribe = () => {
    // Après abonnement, rediriger vers le dashboard
    router.push('/accueil')
  }
  
  const handleDismiss = () => {
    // Si l'utilisateur refuse, quand même le laisser accéder à l'app
    router.push('/accueil')
  }
  
  return (
    <PaywallCard 
      mode="onboarding" 
      onDismiss={handleDismiss}
      onSubscribe={handleSubscribe}
    />
  )
}
