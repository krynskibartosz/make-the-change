import { Badge, Button, Card, CardContent, Progress, Separator } from '@make-the-change/core/ui'
import { ArrowLeft, Calendar, MapPin, Target, TrendingUp, Share2, Info, CheckCircle2, Leaf, Globe } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { cn, formatCurrency } from '@/lib/utils'

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug, locale } = await params
  const t = await getTranslations('projects')
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('public_projects')
    .select(`
      *,
      producer:public_producers!producer_id(*)
    `)
    .eq('slug', slug)
    .single()

  if (!project) {
    notFound()
  }

  const fundingProgress = Math.min(
    ((project.current_funding || 0) / (project.target_budget || 1)) * 100,
    100
  )

  // Determine cover image (hero) and producer image (pp)
  const coverImage = project.hero_image_url || (project.images && project.images.length > 0 ? project.images[0] : undefined)
  // Producer images is an array, take the first one as PP if available
  const producerImage = project.producer?.images && project.producer.images.length > 0 ? project.producer.images[0] : undefined
  
  const daysRemaining = project.maturity_date 
    ? Math.max(0, Math.ceil((new Date(project.maturity_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Immersive Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={project.name_default}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
            <Leaf className="h-24 w-24 text-muted-foreground/20" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/30" />

        <div className="absolute inset-0 flex flex-col justify-end pb-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Badge 
                  className={cn(
                    "px-3 py-1 text-sm font-medium uppercase tracking-wide backdrop-blur-md border-0",
                    project.status === 'active' 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {project.status === 'active' ? 'En cours de financement' : project.status}
                </Badge>
                {project.type && (
                  <Badge variant="outline" className="bg-background/10 backdrop-blur-sm border-white/20 text-white">
                    {project.type.replace('_', ' ')}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                {project.name_default}
              </h1>
              
              <p className="max-w-2xl text-lg text-white/90 md:text-xl font-medium leading-relaxed drop-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                {project.description_default}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-white/80 pt-2 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {project.address_city}, {project.address_country_code}
                  </span>
                </div>
                {project.launch_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      Lancé le {new Date(project.launch_date).toLocaleDateString(locale)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Story Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-1 bg-primary rounded-full" />
                <h2 className="text-3xl font-bold tracking-tight">L'histoire du projet</h2>
              </div>
              <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
                <CardContent className="p-8">
                  <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                    <p className="whitespace-pre-wrap">
                      {project.long_description_default || project.description_default}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Gallery Section */}
            {project.images && project.images.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-1 bg-primary rounded-full" />
                  <h2 className="text-3xl font-bold tracking-tight">Galerie photo</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.images.map((img: string, i: number) => (
                    <div 
                      key={i} 
                      className={cn(
                        "group relative overflow-hidden rounded-2xl bg-muted shadow-md transition-all hover:shadow-xl",
                        i === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
                      )}
                    >
                      <img
                        src={img}
                        alt={`${project.name_default} - Image ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Impact Section - Placeholder for now as data is limited */}
            <section className="space-y-6">
               <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-1 bg-primary rounded-full" />
                <h2 className="text-3xl font-bold tracking-tight">Impact attendu</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Écologique</h3>
                    <p className="text-sm text-muted-foreground">Transition vers une agriculture biologique durable</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Local</h3>
                    <p className="text-sm text-muted-foreground">Soutien à l'économie locale et circuits courts</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Durable</h3>
                    <p className="text-sm text-muted-foreground">Viabilité économique à long terme pour le producteur</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Investment Card */}
            <div className="sticky top-24 space-y-6">
              <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                <CardContent className="p-6 md:p-8 space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="text-5xl font-black tracking-tighter text-foreground">
                          {Math.round(fundingProgress)}%
                        </span>
                        <span className="text-muted-foreground font-medium ml-2">financé</span>
                      </div>
                      <Badge variant="outline" className="mb-2">
                        {project.status === 'active' ? 'En cours' : 'Clôturé'}
                      </Badge>
                    </div>
                    
                    <Progress value={fundingProgress} className="h-4 rounded-full bg-muted" indicatorClassName="bg-gradient-to-r from-primary to-primary/80" />
                    
                    <div className="flex justify-between text-sm mt-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground font-medium">Collecté</span>
                        <span className="text-xl font-bold text-foreground">
                          {formatCurrency(project.current_funding || 0)}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-muted-foreground font-medium">Objectif</span>
                        <span className="text-xl font-bold text-foreground">
                          {formatCurrency(project.target_budget || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link href={`/projects/${project.slug}/invest`} className="block w-full">
                      <Button 
                        size="lg" 
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02]"
                      >
                        Investir maintenant
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground px-4">
                      Investissement à risque. <span className="underline cursor-pointer">En savoir plus</span>
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-foreground">-</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Investisseurs</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-foreground">{daysRemaining !== null ? daysRemaining : '-'}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Jours restants</div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full h-12 border-2 hover:bg-muted/50">
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager le projet
                  </Button>
                </CardContent>
              </Card>

              {/* Producer Card */}
              {project.producer && (
                <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      <Target className="h-4 w-4" />
                      Porteur de projet
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        {producerImage ? (
                          <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                            <img 
                              src={producerImage} 
                              alt={project.producer.name_default} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl ring-4 ring-background shadow-lg">
                            {project.producer.name_default?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-green-500 h-6 w-6 rounded-full border-4 border-background" title="Vérifié" />
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-xl">{project.producer.name_default}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                          {project.producer.description_default}
                        </p>
                      </div>
                      
                      <div className="w-full pt-4 border-t">
                        {project.producer.contact_website && (
                          <a 
                            href={project.producer.contact_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
                          >
                            <Globe className="h-4 w-4" />
                            Visiter le site web
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-16 mb-8">
          <Link href="/projects">
            <Button variant="ghost" size="lg" className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retourner à la liste des projets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
