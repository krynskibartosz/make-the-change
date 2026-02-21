import type { Metadata } from 'next'
import { HeroLabPage } from '../_features/hero-lab-page'

export const metadata: Metadata = {
  title: 'Hero Lab V1',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function HeroLabV1Page() {
  return <HeroLabPage variant="v1" />
}
