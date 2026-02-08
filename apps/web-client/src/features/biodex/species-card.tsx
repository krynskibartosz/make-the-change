'use client'

import { Link } from '@/i18n/navigation'
import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, Leaf } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Species } from './types'
import { getLocalizedContent, getStatusConfig } from './utils'

interface SpeciesCardProps {
  species: Species
}

export function SpeciesCard({ species }: SpeciesCardProps) {
  const locale = useLocale()
  const name = getLocalizedContent(species.name_i18n, locale, 'Espèce inconnue')
  const statusConfig = getStatusConfig(species.conservation_status)

  return (
    <Link href={`/biodex/${species.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-none bg-muted/20 transition-all duration-300 hover:bg-muted/40 hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {species.image_url ? (
            <img
              src={species.image_url}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Leaf className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge 
              className={`border-none font-medium ${statusConfig.bg} ${statusConfig.color} hover:${statusConfig.bg}`}
            >
              {statusConfig.label}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {species.content_levels?.family || 'Espèce'}
          </div>
          <h3 className="mb-1 text-xl font-bold tracking-tight text-foreground group-hover:text-primary">
            {name}
          </h3>
          {species.scientific_name && (
            <p className="font-serif text-sm italic text-muted-foreground">
              {species.scientific_name}
            </p>
          )}
          
          <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
