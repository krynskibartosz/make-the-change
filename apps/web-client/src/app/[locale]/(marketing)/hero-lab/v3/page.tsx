import type { Metadata } from 'next'
import { HeroLabPage } from '../_features/hero-lab-page'

export const metadata: Metadata = {
  title: 'Hero Lab V3',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function HeroLabV3Page() {
  return <HeroLabPage variant="v3" />
}
