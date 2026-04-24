import type { Metadata } from 'next'
import { EcosystemPathV1 } from './_components/ecosystem-path-v1'

export const metadata: Metadata = {
  title: 'Toile Vivante | Make the Change',
}

export default function EcosystemPage() {
  return <EcosystemPathV1 />
}
