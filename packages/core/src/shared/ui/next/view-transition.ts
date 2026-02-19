const sanitizeTransitionToken = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const getEntityViewTransitionName = (
  entity: 'product' | 'project',
  id: string,
  part: 'media' | 'title',
) => `${entity}-${part}-${sanitizeTransitionToken(id)}`
