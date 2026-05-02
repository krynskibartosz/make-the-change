export const formatInteger = (value: number): string =>
  new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(value)

export const formatDecimal = (value: number, minFraction = 0, maxFraction = 2): string =>
  new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction,
  }).format(value)

export const formatCompact = (value: number, isDecimal = false): string => {
  if (value < 10000) {
    return new Intl.NumberFormat('fr-FR', isDecimal ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { maximumFractionDigits: 0 }).format(value)
  }
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export const formatAmountNumber = (value: number): string => formatInteger(value)

export const formatAmountPlain = (value: number): string => `${formatInteger(value)} €`