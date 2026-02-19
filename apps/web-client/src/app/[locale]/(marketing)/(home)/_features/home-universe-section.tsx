import { Badge } from '@make-the-change/core/ui'
import { ArrowRight, Facebook, Instagram, Linkedin, Music, Users, type LucideIcon } from 'lucide-react'
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

type SocialLink = {
  label: string
  href: string
  icon: LucideIcon
}

const socialLinks: SocialLink[] = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'TikTok', href: 'https://tiktok.com', icon: Music },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
]

export const HomeUniverseSection = ({
  title,
  description,
  projects,
  products,
  community,
  variant = 'default',
}: HomeUniverseSectionProps) => (
  <MarketingSection
    title={title}
    description={description}
    size="lg"
    className="pb-20"
    variant={variant}
  >
    <div className="grid h-auto grid-cols-1 gap-6 lg:h-150 lg:grid-cols-12">
      <article className="group relative overflow-hidden rounded-[2.5rem] border shadow-2xl lg:col-span-7">
        <Link href="/projects" className="block h-full w-full cursor-pointer">
          <img
            src={projects.image ?? placeholderImages.projects[0]}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={projects.title}
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-marketing-overlay-dark/80 via-marketing-overlay-dark/20 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 space-y-4 p-8 lg:p-12">
            <Badge className="bg-primary text-marketing-overlay-light border-none px-4 py-1 font-black uppercase tracking-widest text-[10px]">
              {projects.badge}
            </Badge>
            <h3 className="text-3xl font-black tracking-tight text-marketing-overlay-light lg:text-5xl">
              {projects.title}
            </h3>
            <p className="max-w-md text-lg font-medium text-marketing-overlay-light/70">
              {projects.description}
            </p>
            <span className="inline-flex items-center gap-2 font-bold text-primary">
              {projects.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </article>

      <div className="grid grid-rows-2 gap-6 lg:col-span-5">
        <article className="group relative h-75 overflow-hidden rounded-[2.5rem] border shadow-xl lg:h-full">
          <Link href="/products" className="block w-full h-full">
            <img
              src={products.image ?? placeholderImages.products[0]}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt={products.title}
            />
            <div
              className="absolute inset-0 bg-linear-to-t from-marketing-overlay-dark/80 via-marketing-overlay-dark/20 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-0 left-0 space-y-2 p-8">
              <h3 className="text-2xl font-black text-marketing-overlay-light">{products.title}</h3>
              <p className="text-sm font-medium text-marketing-overlay-light/70">{products.description}</p>
            </div>
          </Link>
        </article>

        <article className="group relative h-75 overflow-hidden rounded-[2.5rem] border bg-card shadow-xl lg:h-full">
          <div
            className="absolute inset-0 bg-primary/5 transition-colors group-hover:bg-primary/10"
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div
              className="flex h-16 w-16 rotate-12 items-center justify-center rounded-3xl bg-primary/20 transition-transform group-hover:rotate-0"
              aria-hidden="true"
            >
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-foreground">{community.title}</h3>
            <p className="text-sm font-medium text-muted-foreground">{community.description}</p>
            <span
              className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-1.5 text-sm font-medium text-foreground"
              aria-hidden="true"
            >
              {community.cta}
            </span>

            <nav aria-label="Réseaux sociaux" className="pt-2">
              <ul className="m-0 flex list-none items-center justify-center gap-3 p-0">
                {socialLinks.map((socialLink) => (
                  <li key={socialLink.label}>
                    <a
                      href={socialLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-full bg-muted p-2 transition-colors hover:bg-accent"
                      aria-label={socialLink.label}
                    >
                      <socialLink.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </article>
      </div>
    </div>
  </MarketingSection>
);
