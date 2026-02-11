import { Badge, Button } from '@make-the-change/core/ui'
import { ArrowRight, Users } from 'lucide-react'
import { MarketingSection } from '@/components/marketing/marketing-section'
import { Link } from '@/i18n/navigation'
import { placeholderImages } from '@/lib/placeholder-images'

type UniverseCardContent = {
  image?: string
  badge?: string
  title: string
  description: string
  cta: string
}

type HomeUniverseSectionProps = {
  title: string
  description: string
  projects: UniverseCardContent
  products: UniverseCardContent
  community: UniverseCardContent
}

export function HomeUniverseSection({
  title,
  description,
  projects,
  products,
  community,
}: HomeUniverseSectionProps) {
  return (
    <MarketingSection title={title} description={description} size="lg" className="pb-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
        <Link
          href="/projects"
          className="md:col-span-7 relative group overflow-hidden rounded-[2.5rem] border shadow-2xl cursor-pointer block"
        >
          <img
            src={projects.image || placeholderImages.projects[0]}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={projects.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/80 via-marketing-overlay-dark/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-4">
            <Badge className="bg-primary text-marketing-overlay-light border-none px-4 py-1 font-black uppercase tracking-widest text-[10px]">
              {projects.badge}
            </Badge>
            <h3 className="text-3xl md:text-5xl font-black text-marketing-overlay-light tracking-tight">
              {projects.title}
            </h3>
            <p className="text-marketing-overlay-light/70 text-lg font-medium max-w-md">
              {projects.description}
            </p>
            <div className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              {projects.cta} <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        <div className="md:col-span-5 grid grid-rows-2 gap-6">
          <div className="h-[300px] md:h-full relative group rounded-[2.5rem] border shadow-xl overflow-hidden">
            <Link href="/products" className="block w-full h-full">
              <img
                src={products.image || placeholderImages.products[0]}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt={products.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/80 via-marketing-overlay-dark/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 space-y-2">
                <Badge className="bg-marketing-positive-500 text-marketing-overlay-light border-none px-3 py-0.5 font-black uppercase tracking-widest text-[10px]">
                  {products.badge}
                </Badge>
                <h3 className="text-2xl font-black text-marketing-overlay-light">
                  {products.title}
                </h3>
                <p className="text-marketing-overlay-light/70 text-sm font-medium">
                  {products.description}
                </p>
              </div>
            </Link>
          </div>

          <div className="h-[300px] md:h-full relative group rounded-[2.5rem] border shadow-xl bg-marketing-neutral-900 overflow-hidden">
            <Link href="/about" className="block w-full h-full">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-3xl bg-primary/20 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-marketing-overlay-light">
                  {community.title}
                </h3>
                <p className="text-marketing-neutral-400 text-sm font-medium">
                  {community.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-marketing-overlay-light/10 text-marketing-overlay-light hover:bg-marketing-overlay-light/5 pointer-events-none"
                >
                  {community.cta}
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MarketingSection>
  )
}
