import { ArrowLeft, Leaf, Lock, Sparkles, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { SpeciesCardEnhanced } from '@/app/[locale]/(marketing)/biodex/components/species-card-enhanced'
import type { SpeciesContext } from '@/types/context'
import { Link } from '@/i18n/navigation'
import { FactionCarousel } from '@/app/[locale]/(auth)/_features/faction-carousel'
import { useRouter } from '@/i18n/navigation'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { getFactionTheme, resolveFactionThemeKey, type FactionTheme } from '@/lib/faction-theme'
import { getClientMockViewerSession } from '@/lib/mock/mock-session'
import type { Faction } from '@/lib/mock/types'
import { cn } from '@/lib/utils'
import { BiodexClient } from './biodex-client'

const FALLBACK_SPECIES_PROJECTS = [
  {
    id: 'mock-project-ruchers-antsirabe',
    slug: 'ruchers-apiculteurs-independants-antsirabe',
    name: "Ruchers d'apiculteurs indépendants à Antsirabe",
    impact: 'Pollinisation locale, protection de la biodiversité et soutien aux apiculteurs.',
  },
]

const getProjectDetailHref = (project: {
  id?: string | null
  slug?: string | null
  name?: string | null
}) => {
  const slug = project.slug?.trim()
  if (slug) return `/projects/${slug}`

  const id = project.id?.trim()
  if (id) return `/projects/${id}`

  const name = project.name?.trim()
  if (name) return `/projects?search=${encodeURIComponent(name)}&status=active`

  return '/projects?status=active'
}

export default async function BiodexPage({ params }: { params: { locale: string } }) {
  const speciesList = await getSpeciesContextList()

  return <BiodexClient species={speciesList} />
}
