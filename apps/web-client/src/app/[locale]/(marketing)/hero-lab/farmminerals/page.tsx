'use client'

import { FarmMineralsMarkup } from './_components/FarmMineralsMarkup'
import { useFarmMineralsAnimations } from './_animations/useFarmMineralsAnimations'
import './_styles/farmminerals.css'

export default function FarmMineralsPage() {
  useFarmMineralsAnimations()

  return <FarmMineralsMarkup />
}
