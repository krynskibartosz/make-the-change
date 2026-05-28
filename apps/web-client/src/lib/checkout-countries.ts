export type CountryOption = {
  code: string
  label: string
}

export const CHECKOUT_COUNTRIES: CountryOption[] = [
  { code: 'BE', label: 'Belgique' },
  { code: 'FR', label: 'France' },
  { code: 'NL', label: 'Pays-Bas' },
  { code: 'LU', label: 'Luxembourg' },
  { code: 'DE', label: 'Allemagne' },
  { code: 'CH', label: 'Suisse' },
  { code: 'AT', label: 'Autriche' },
  { code: 'ES', label: 'Espagne' },
  { code: 'IT', label: 'Italie' },
  { code: 'PT', label: 'Portugal' },
  { code: 'GB', label: 'Royaume-Uni' },
]

export function getCountryLabel(code: string): string {
  return CHECKOUT_COUNTRIES.find((c) => c.code === code)?.label ?? code
}
