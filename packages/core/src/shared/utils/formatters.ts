/**
 * Utilitaires de formatage pour Make the CHANGE
 */

// Formatage des prix selon votre documentation (EUR)
export const formatPrice = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Formatage des points selon votre système de récompenses
export const formatPoints = (points: number): string => {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M pts`
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k pts`
  }
  return `${points} pts`
}

// Formatage des pourcentages (pour les retours d'investissement)
export const formatPercentage = (value: number | null | undefined, decimals = 1): string => {
  if (value == null) return '0%'
  return `${value.toFixed(decimals)}%`
}

// Formatage des dates en français
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return 'Date non définie'
  const resolved = typeof date === 'string' ? new Date(date) : date
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  return new Intl.DateTimeFormat('fr-FR', { ...defaultOptions, ...options }).format(resolved)
}

// Formatage des dates relatives (il y a X jours)
export const formatRelativeDate = (date: Date): string => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Aujourd'hui"
  if (diffInDays === 1) return 'Hier'
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`
  if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`

  return `Il y a ${Math.floor(diffInDays / 365)} ans`
}

// Formatage des noms complets
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim()
}

// Formatage des emails
export const formatEmail = (email: string) => {
  if (!email) return 'Aucun email'
  return email.toLowerCase()
}

// Formatage simple des montants (EUR)
export const formatCurrency = (amount: number | null | undefined) => {
  if (!amount) return '0 €'
  return `${amount.toFixed(2)} €`
}

// Formatage des noms (tolère les valeurs manquantes)
export const formatName = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return 'Nom non défini'
  return `${firstName || ''} ${lastName || ''}`.trim()
}

// Génération d'initiales
export const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return '?'
  const first = firstName?.charAt(0).toUpperCase() || ''
  const last = lastName?.charAt(0).toUpperCase() || ''
  return `${first}${last}` || '?'
}

// Tronquer un texte
export const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, Math.max(0, maxLength))}...`
}

// Formatage des adresses
export const formatAddress = (address: {
  street: string
  city: string
  postalCode: string
  country: string
}): string => {
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`
}
