import type { Metadata } from 'next'
import { BaseUiLabClient } from './ui-lab-client'

export const metadata: Metadata = {
  title: 'Base UI Lab',
  robots: {
    index: false,
    follow: false,
  },
}

export default function BaseUiLabPage() {
  return <BaseUiLabClient />
}
