import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Clarus - Villa Sparrenlaan',
    short_name: 'Clarus',
    description: 'Prototype mobile de suivi du chantier Villa Sparrenlaan.',
    start_url: '/chantier',
    display: 'standalone',
    background_color: '#080B0F',
    theme_color: '#080B0F',
    lang: 'fr',
    orientation: 'portrait',
  }
}
