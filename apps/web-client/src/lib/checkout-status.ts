type CheckoutUnavailableCopy = {
  title: string
  description: string
  cartNotice: string
  cartActionLabel: string
  cartActionHint: string
  backToCart: string
  continueShopping: string
  statusLabel: string
  statusValue: string
  balanceLabel: string
  shippingLabel: string
  addressMissing: string
}

type SupportedCheckoutLocale = 'fr' | 'en' | 'nl'

const checkoutUnavailableCopyByLocale: Record<SupportedCheckoutLocale, CheckoutUnavailableCopy> = {
  fr: {
    title: 'Checkout temporairement indisponible',
    description:
      "Le panier est prêt, mais la validation de commande n'est pas encore reliée au backend de paiement et de création de commande.",
    cartNotice: "Le checkout n'est pas encore disponible. Votre panier est conservé.",
    cartActionLabel: 'Checkout indisponible',
    cartActionHint: "Le backend de commande n'est pas encore connecté.",
    backToCart: 'Retour au panier',
    continueShopping: 'Continuer mes achats',
    statusLabel: 'Statut',
    statusValue: 'En attente du backend',
    balanceLabel: 'Solde disponible',
    shippingLabel: 'Adresse actuelle',
    addressMissing: 'Adresse non renseignée',
  },
  en: {
    title: 'Checkout temporarily unavailable',
    description:
      'Your cart is ready, but order confirmation is not wired to the payment and order backend yet.',
    cartNotice: 'Checkout is not available yet. Your cart is preserved.',
    cartActionLabel: 'Checkout unavailable',
    cartActionHint: 'The order backend is not connected yet.',
    backToCart: 'Back to cart',
    continueShopping: 'Continue shopping',
    statusLabel: 'Status',
    statusValue: 'Waiting for backend',
    balanceLabel: 'Available balance',
    shippingLabel: 'Current address',
    addressMissing: 'Address not provided',
  },
  nl: {
    title: 'Checkout tijdelijk niet beschikbaar',
    description:
      'Je winkelmand is klaar, maar orderbevestiging is nog niet gekoppeld aan de betaal- en orderbackend.',
    cartNotice: 'Checkout is nog niet beschikbaar. Je winkelmand blijft bewaard.',
    cartActionLabel: 'Checkout niet beschikbaar',
    cartActionHint: 'De orderbackend is nog niet gekoppeld.',
    backToCart: 'Terug naar winkelmand',
    continueShopping: 'Verder winkelen',
    statusLabel: 'Status',
    statusValue: 'Wacht op backend',
    balanceLabel: 'Beschikbaar saldo',
    shippingLabel: 'Huidig adres',
    addressMissing: 'Adres niet ingevuld',
  },
}

const normalizeLocale = (locale: string): SupportedCheckoutLocale => {
  if (locale.startsWith('fr')) return 'fr'
  if (locale.startsWith('nl')) return 'nl'
  return 'en'
}

export const CHECKOUT_AVAILABLE = false

export const getCheckoutUnavailableCopy = (locale: string): CheckoutUnavailableCopy => {
  const normalizedLocale = normalizeLocale(locale)
  return checkoutUnavailableCopyByLocale[normalizedLocale]
}
