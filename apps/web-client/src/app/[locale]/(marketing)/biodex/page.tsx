import { createClient } from '@/lib/supabase/server'
import { SpeciesCard } from '@/features/biodex/species-card'
import { Species } from '@/features/biodex/types'
import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { Search, Sparkles, Filter, Leaf } from 'lucide-react'
import { Input } from '@make-the-change/core/ui'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
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
    <>
      <PageHero
        badge={
          <span className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            Encyclopédie du Vivant
          </span>
        }
        title="BioDex"
        description="Explorez la diversité du vivant. Découvrez les espèces protégées, leur habitat et leur rôle crucial dans nos écosystèmes."
        size="lg"
        variant="gradient"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/20 blur-[100px]" />
        </div>
      </PageHero>

      <SectionContainer size="lg" className="-mt-12 relative z-20">
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-3xl bg-background/80 backdrop-blur-xl border shadow-2xl mb-12">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une espèce, une famille..." 
              className="pl-12 h-14 rounded-2xl border-none bg-muted/50 focus-visible:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 h-14 px-6 rounded-2xl bg-muted/50 font-bold text-sm hover:bg-muted transition-colors w-full md:w-auto">
              <Filter className="h-4 w-4" />
              Filtres
            </button>
            <button className="flex items-center justify-center gap-2 h-14 px-6 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-transform w-full md:w-auto">
              Toutes les familles
            </button>
          </div>
        </div>

        {species && species.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {species.map((item) => (
              <SpeciesCard key={item.id} species={item as unknown as Species} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] items-center justify-center rounded-[3rem] border-2 border-dashed bg-muted/20 p-12 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="space-y-4">
              <div className="mx-auto h-20 w-20 rounded-3xl bg-muted flex items-center justify-center">
                <Leaf className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black tracking-tight">Le Biodex est encore vide</p>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                  Les espèces seront répertoriées ici dès que nos premiers projets seront documentés.
                </p>
              </div>
            </div>
          </div>
        )}
      </SectionContainer>
    </>
  )
}
