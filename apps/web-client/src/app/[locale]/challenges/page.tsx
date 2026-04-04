import { redirect } from 'next/navigation'

// Cette page est désactivée. Le contenu est désormais dans le Hub Aventure.
// La redirection next.config.js gère /challenges → /aventure?tab=defis
// Ce composant sert de filet de sécurité côté serveur.
export default function ChallengesPage() {
  redirect('/aventure?tab=defis')
}
