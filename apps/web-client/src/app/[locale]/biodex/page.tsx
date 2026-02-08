import { createClient } from '@/lib/supabase/server'
import { SpeciesCard } from '@/features/biodex/species-card'
import { Species } from '@/features/biodex/types'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'biodex' })
  
  return {
    title: 'Biodex - Catalogue des espèces',
    description: 'Découvrez la biodiversité protégée par nos projets.',
  }
}

export default async function BiodexPage() {
  const supabase = await createClient()
  
  const { data: species, error } = await supabase
    .schema('investment')
    .from('species')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching species:', error)
    return <div>Une erreur est survenue lors du chargement du Biodex.</div>
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Biodex
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Explorez la diversité du vivant. Découvrez les espèces protégées, leur habitat et leur rôle crucial dans nos écosystèmes.
          </p>
        </div>

        {species && species.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {species.map((item) => (
              <SpeciesCard key={item.id} species={item as unknown as Species} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-dashed bg-muted/30 p-12 text-center">
            <div>
              <p className="text-lg font-medium text-muted-foreground">
                Le Biodex est encore vide.
              </p>
              <p className="text-sm text-muted-foreground">
                Les espèces seront répertoriées ici prochainement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
