import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { AlertTriangle, ArrowLeft, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { notFound } from 'next/navigation'
import { toSpecies } from '@/app/[locale]/(marketing)/biodex/_features/species-parsers'
import {
  getLocalizedContent,
  getStatusConfig,
} from '@/app/[locale]/(marketing)/biodex/_features/utils'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'

type ContentLevel = {
  title?: string
  description?: string
  unlocked_at_level?: number
}

const isContentLevel = (value: unknown): value is ContentLevel =>
  typeof value === 'object' && value !== null

const toLocalizedRecord = (value: unknown): Record<string, string> | null => {
  if (!isRecord(value)) {
    return null
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const supabase = await createClient()

  const { data: species } = await supabase
    .schema('investment')
    .from('species')
    .select('name_i18n, scientific_name')
    .eq('id', id)
    .single()

  if (!species) return { title: 'Espèce non trouvée' }

  const speciesNameI18n = toLocalizedRecord(species.name_i18n)
  const scientificName = asString(species.scientific_name)
  const name = getLocalizedContent(speciesNameI18n, locale, 'Espèce')

  return {
    title: `${name} - Biodex`,
    description: `Fiche descriptive de ${name} (${scientificName})`,
  }
}

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  const supabase = await createClient()

  // 1. Fetch Species
  const { data: speciesData, error } = await supabase
    .schema('investment')
    .from('species')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !speciesData) {
    notFound()
  }

  const species = toSpecies(speciesData)
  if (!species) {
    notFound()
  }

  const name = getLocalizedContent(species.name_i18n, locale, 'Espèce inconnue')
  const description = getLocalizedContent(species.description_i18n, locale, '')
  const statusConfig = getStatusConfig(species.conservation_status)
  const contentLevels = isRecord(species.content_levels) ? species.content_levels : null
  const familyLabel = typeof contentLevels?.family === 'string' ? contentLevels.family : null

  // 2. Fetch Related Projects
  const { data: projects } = await supabase
    .schema('investment')
    .from('projects')
    .select('id, slug, name_default, hero_image_url')
    .eq('species_id', id)
    .limit(3)

  const projectsList = Array.isArray(projects)
    ? projects
        .map((project) => {
          if (!isRecord(project)) {
            return null
          }

          const projectId = asString(project.id)
          const projectSlug = asString(project.slug)
          const projectName = asString(project.name_default)

          if (!projectId || !projectSlug) {
            return null
          }

          return {
            id: projectId,
            slug: projectSlug,
            name_default: projectName || 'Projet',
            hero_image_url: asString(project.hero_image_url) || null,
          }
        })
        .filter(
          (
            project,
          ): project is {
            id: string
            slug: string
            name_default: string
            hero_image_url: string | null
          } => project !== null,
        )
    : []

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[50vh] w-full overflow-hidden bg-muted lg:h-[60vh]">
        {species.image_url ? (
          <img src={species.image_url} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Leaf className="h-24 w-24 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Navigation & Title */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
          <div>
            <Button asChild variant="glass" size="icon" className="rounded-full">
              <Link href="/biodex">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge
                className={`border-none ${statusConfig.bg} ${statusConfig.color} hover:${statusConfig.bg}`}
              >
                {statusConfig.label}
              </Badge>
              {familyLabel && (
                <Badge variant="outline" className="bg-background/50 backdrop-blur">
                  {familyLabel}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {name}
            </h1>
            {species.scientific_name && (
              <p className="mt-2 font-serif text-xl italic text-muted-foreground sm:text-2xl">
                {species.scientific_name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-12 px-6 sm:px-10">
        {/* Description & Bio */}
        <section className="space-y-6">
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-xl leading-relaxed text-foreground/80">
              {description || 'Aucune description disponible pour cette espèce.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {species.habitat && species.habitat.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2 text-primary">
                    <Leaf className="h-5 w-5" />
                    <h3 className="font-semibold">Habitat</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {species.habitat.map((h) => (
                      <Badge key={h} variant="secondary">
                        {h}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {species.threats && species.threats.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2 text-client-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    <h3 className="font-semibold">Menaces</h3>
                  </div>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    {species.threats.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Content Levels (Gamification/Education) */}
        {contentLevels && Object.keys(contentLevels).length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Niveaux de Connaissance</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(contentLevels)
                .filter(([key]) => key !== 'family' && key !== 'kingdom' && key !== 'metadata') // Filter out metadata fields
                .map(([level, content]) => {
                  if (!isContentLevel(content)) return null

                  return (
                    <Card
                      key={level}
                      className="overflow-hidden border-none bg-muted/30 shadow-none transition-colors hover:bg-muted/50"
                    >
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-semibold capitalize text-primary">
                            {content.title || level}
                          </h4>
                          {content.unlocked_at_level && (
                            <Badge variant="outline" className="text-xs">
                              Niveau {content.unlocked_at_level}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {content.description}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </section>
        )}

        {/* Related Projects */}
        {projectsList.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Projets associés</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projectsList.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
                  <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-lg">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={project.hero_image_url || '/placeholder.jpg'}
                        alt={project.name_default || 'Projet'}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary">
                        {project.name_default}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
