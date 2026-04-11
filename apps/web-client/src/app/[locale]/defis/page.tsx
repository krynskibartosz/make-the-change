import { redirect } from 'next/navigation'

// Alias FR pour la navigation principale mobile.
// Le Hub Aventure reste la source de vérité pour l'expérience Défis.
export default function DefisPage() {
  redirect('/aventure?tab=defis')
}

