import { redirect } from 'next/navigation'

// Cette page est désactivée. Le contenu est désormais dans le Hub Aventure.
// La redirection next.config.js gère /biodex → /aventure?tab=biodex
// Ce composant sert de filet de sécurité côté serveur.
export default function BiodexPage() {
  redirect('/aventure?tab=biodex')
}
