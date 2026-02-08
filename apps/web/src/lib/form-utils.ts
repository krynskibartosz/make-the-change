export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^\w-]+/g, '')
    .replaceAll(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
