'use client'

import { Link } from '@/i18n/navigation'
import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, Leaf, ShieldAlert } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Species } from './types'
import { getLocalizedContent, getStatusConfig } from './utils'
import { cn } from '@/lib/utils'

interface SpeciesCardProps {
  species: Species
}

export function SpeciesCard({ species }: SpeciesCardProps) {
  const locale = useLocale()
  const name = getLocalizedContent(species.name_i18n, locale, 'Espèce inconnue')
  const statusConfig = getStatusConfig(species.conservation_status)

  return (
    <Link href={`/biodex/${species.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden border bg-background/50 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] hover:-translate-y-2 rounded-[2.5rem]">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {species.image_url ? (
            <img
              src={species.image_url}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/50">
              <Leaf className="h-16 w-16 text-muted-foreground/20" />
            </div>
          )}
          
          {/* Status Overlay */}
          <div className="absolute top-4 left-4">
            <Badge 
              className={cn(
                "border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md",
                statusConfig.bg,
                statusConfig.color
              )}
            >
              {statusConfig.label}
            </Badge>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
          
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-tight text-white/90">
              <ShieldAlert className="h-3 w-3" />
              {species.content_levels?.family || 'Espèce Protégée'}
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {species.scientific_name && (
              <p className="font-serif text-xs italic text-muted-foreground truncate max-w-[70%]">
                {species.scientific_name}
              </p>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
