export function isSupportType(value: unknown): value is 'beehive' | 'olive_tree' | 'vineyard' {
  return value === 'beehive' || value === 'olive_tree' || value === 'vineyard'
}

export function isDonationType(value: unknown): value is 'reef' | 'coral' {
  return value === 'reef' || value === 'coral'
}

export function toOptionalString(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}
