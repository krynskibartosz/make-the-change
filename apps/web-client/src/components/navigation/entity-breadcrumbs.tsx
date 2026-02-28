import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface EntityBreadcrumbsProps {
  type: 'project' | 'product' | 'species' | 'producer'
  entity: {
    id: string
    name: string
    slug?: string
  }
  relatedEntities?: Array<{
    type: string
    name: string
    link: string
  }>
}

export function EntityBreadcrumbs({ type, entity, relatedEntities }: EntityBreadcrumbsProps) {
  const getTypeLink = (type: string) => {
    switch (type) {
      case 'project': return '/projects'
      case 'product': return '/products'
      case 'species': return '/biodex'
      case 'producer': return '/producers'
      default: return '/'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Projets'
      case 'product': return 'Produits'
      case 'species': return 'BioDex'
      case 'producer': return 'Producteurs'
      default: return ''
    }
  }

  const getEntityLink = (type: string, entity: { id: string, slug?: string }) => {
    switch (type) {
      case 'project': return `/projects/${entity.slug || entity.id}`
      case 'product': return `/products/${entity.id}`
      case 'species': return `/biodex/${entity.id}`
      case 'producer': return `/producers/${entity.slug || entity.id}`
      default: return '/'
    }
  }

  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: getTypeLabel(type), href: getTypeLink(type) },
    { label: entity.name, href: getEntityLink(type, entity) }
  ]

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <Link href={crumb.href} className="hover:text-foreground transition-colors">
            {crumb.label}
          </Link>
        </div>
      ))}
      
      {relatedEntities && relatedEntities.length > 0 && (
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-xs font-medium">Lié à:</span>
          {relatedEntities.map((related, index) => (
            <Link key={index} href={related.link} className="text-xs text-primary hover:underline">
              {related.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
