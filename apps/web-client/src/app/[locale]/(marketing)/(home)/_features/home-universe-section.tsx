import { Badge } from '@make-the-change/core/ui'
import { ArrowRight, Users, Instagram, Facebook, Linkedin, Music } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
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
  variant?: 'default' | 'muted'
}

export function HomeUniverseSection({
  title,
  description,
  projects,
  products,
  community,
  variant = 'default',
}: HomeUniverseSectionProps) {
  return (
    <MarketingSection title={title} description={description} size="lg" className="pb-20" variant={variant}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
        <article className="lg:col-span-7 relative group overflow-hidden rounded-[2.5rem] border shadow-2xl">
          <Link
            href="/projects"
            className="block w-full h-full cursor-pointer"
          >
            <img
              src={projects.image || placeholderImages.projects[0]}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt={projects.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/80 via-marketing-overlay-dark/20 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 p-8 lg:p-12 space-y-4">
              <Badge className="bg-primary text-marketing-overlay-light border-none px-4 py-1 font-black uppercase tracking-widest text-[10px]">
                {projects.badge}
              </Badge>
              <h3 className="text-3xl lg:text-5xl font-black text-marketing-overlay-light tracking-tight">
                {projects.title}
              </h3>
              <p className="text-marketing-overlay-light/70 text-lg font-medium max-w-md">
                {projects.description}
              </p>
              <span className="inline-flex items-center gap-2 text-primary font-bold">
                {projects.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </article>

        <div className="lg:col-span-5 grid grid-rows-2 gap-6">
          <article className="h-[300px] lg:h-full relative group rounded-[2.5rem] border shadow-xl overflow-hidden">
            <Link href="/products" className="block w-full h-full">
              <img
                src={products.image || placeholderImages.products[0]}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt={products.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/80 via-marketing-overlay-dark/20 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 p-8 space-y-2">

                <h3 className="text-2xl font-black text-marketing-overlay-light">
                  {products.title}
                </h3>
                <p className="text-marketing-overlay-light/70 text-sm font-medium">
                  {products.description}
                </p>
              </div>
            </Link>
          </article>

          <article className="h-[300px] lg:h-full relative group rounded-[2.5rem] border shadow-xl bg-card overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" aria-hidden="true" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-primary/20 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform" aria-hidden="true">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-foreground">
                {community.title}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                {community.description}
              </p>
              <span
                className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-1.5 text-sm font-medium text-foreground"
                aria-hidden="true"
              >
                {community.cta}
              </span>

              {/* Social Media Links */}
              <nav aria-label="Réseaux sociaux" className="pt-2">
                <ul className="flex items-center justify-center gap-3 m-0 p-0 list-none">
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors group block"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors group block"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors group block"
                      aria-label="TikTok"
                    >
                      <Music className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-accent transition-colors group block"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </article>
        </div>
      </div>
    </MarketingSection>
  )
}
