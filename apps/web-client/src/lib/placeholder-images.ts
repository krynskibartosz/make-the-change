export const placeholderImages = {
  projects: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  ],
  products: [
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=900&q=80',
  ],
  categories: {
    default:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    bien_etre:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    maison:
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    alimentation:
      'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=900&q=80',
    eco: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  },
  profileCovers: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=80',
  ],
}

export const getCategoryImage = (name?: string | null) => {
  if (!name) return placeholderImages.categories.default
  const key = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '_')
  return (
    (placeholderImages.categories as Record<string, string>)[key] ||
    placeholderImages.categories.default
  )
}

export const getRandomProductImage = (seed?: number) => {
  const list = placeholderImages.products
  if (!list.length) return placeholderImages.categories.default
  if (seed === undefined) return list[0]
  return list[seed % list.length]
}

export const getRandomProjectImage = (seed?: number) => {
  const list = placeholderImages.projects
  if (!list.length) return placeholderImages.categories.default
  if (seed === undefined) return list[0]
  return list[seed % list.length]
}

export const getRandomProducerImage = (seed?: number) => {
  // Reuse project images for producers for now, or add specific ones
  const list = placeholderImages.projects
  if (!list.length) return placeholderImages.categories.default
  if (seed === undefined) return list[0]
  return list[seed % list.length]
}

export const getRandomCoverImage = (seed?: number) => {
  const list = placeholderImages.profileCovers
  if (!list.length) return placeholderImages.categories.default
  if (seed === undefined) return list[0]
  return list[seed % list.length]
}
