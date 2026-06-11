/**
 * Groups an array of items by a derived date string.
 *
 * @param items - The array to group.
 * @param getDate - A function that returns a string key (e.g. a date label) for each item.
 * @returns An object keyed by the date string, with arrays of items as values.
 *
 * @example
 * const groups = groupByDate(photos, (p) => formatDate(p.takenAt))
 */
export function groupByDate<T>(items: T[], getDate: (item: T) => string): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = getDate(item)
      const list = acc[key] ?? []
      list.push(item)
      acc[key] = list
      return acc
    },
    {} as Record<string, T[]>,
  )
}
