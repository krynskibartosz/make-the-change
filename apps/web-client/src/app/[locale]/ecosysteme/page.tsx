import type { Metadata } from 'next'
import { EcosystemList } from './_components/ecosystem-list'

export const metadata: Metadata = {
  title: 'Toile Vivante | Make the Change',
}

export default async function EcosystemPage() {
  return <EcosystemList />
}
