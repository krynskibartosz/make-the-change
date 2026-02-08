/**
 * Builds a new URLSearchParams from a current querystring and a set of updates.
 *
 * Rules:
 * - `null`, `undefined`, empty string, or the string `"all"` remove the param.
 * - By default, resets the `page` param to `"1"` when filters change.
 */
export function buildUpdatedSearchParams(
  currentQueryString: string,
  updates: Record<string, string | null | undefined>,
  options?: { pageKey?: string },
): URLSearchParams {
  const params = new URLSearchParams(currentQueryString)
  const pageKey = options?.pageKey ?? 'page'

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === '' || value === 'all') {
      params.delete(key)
      continue
    }
    params.set(key, value)
  }

  if (!(pageKey in updates)) {
    params.set(pageKey, '1')
  }

  return params
}
