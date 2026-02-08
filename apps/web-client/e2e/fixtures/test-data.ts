export type ShippingAddress = {
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  country: string
}

export const defaultAddress: ShippingAddress = {
  firstName: 'Camille',
  lastName: 'Durand',
  street: "12 rue de l'Impact",
  city: 'Bruxelles',
  postalCode: '1000',
  country: 'Belgique',
}

export const makeSeedSubject = () => `Question sur les produits (${Date.now()})`
export const makeSeedMessage = () =>
  'Bonjour, je souhaite en savoir plus sur vos produits et votre impact local.'
