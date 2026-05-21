import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { AtlasPrototypeLoader } from './_components/atlas-prototype-loader'

export const metadata: Metadata = {
  title: 'Prototype Atlas du vivant | Make the Change',
}

const atlasSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--atlas-prototype-sans',
})

const atlasSerif = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--atlas-prototype-serif',
  weight: ['400', '500', '600'],
})

export default function AtlasPrototypePage() {
  return (
    <div className={`${atlasSans.variable} ${atlasSerif.variable}`}>
      <AtlasPrototypeLoader />
    </div>
  )
}
