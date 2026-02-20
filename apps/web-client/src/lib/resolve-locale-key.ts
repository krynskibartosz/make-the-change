const hasOwnMapKey = <TMap extends Record<string, unknown>>(
  map: TMap,
  key: string,
): key is Extract<keyof TMap, string> => Object.hasOwn(map, key)

export const resolveLocaleKey = <TMap extends Record<string, unknown>>(
  map: TMap,
  locale: string,
  fallback: Extract<keyof TMap, string>,
): Extract<keyof TMap, string> => {
  if (hasOwnMapKey(map, locale)) {
    return locale
  }

  return fallback
}
