import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Coins,
  CreditCard,
  FileText,
  Globe,
  LayoutDashboard,
  Leaf,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3001'

type NavigationItem = {
  href: string
  icon: LucideIcon
  label: string
  description?: string
}

export type NavigationSection = {
  key: string
  label: string
  icon: LucideIcon
  isStandalone?: boolean
  href?: string
  description?: string
  items?: NavigationItem[]
}

export const useNavigationSections = (): NavigationSection[] => {
  const tSidebar = useTranslations('admin.sidebar')
  const tProducts = useTranslations('admin.products')
  const tProjects = useTranslations('admin.projects')
  const tOrders = useTranslations('admin.orders')
  const tPartners = useTranslations('admin.partners')
  const tUsers = useTranslations('navigation')
  const tSubscriptions = useTranslations('admin.subscriptions')

  return [
    {
      key: 'dashboard',
      label: tSidebar('dashboard.label'),
      icon: LayoutDashboard,
      isStandalone: true,
      href: '/admin/dashboard',
      description: tSidebar('dashboard.description'),
    },
    {
      key: 'management',
      label: tSidebar('management.label'),
      icon: Package,
      items: [
        {
          href: '/admin/products',
          icon: Package,
          label: tProducts('title'),
          description: tProducts('title'),
        },
        {
          href: '/admin/projects',
          icon: Target,
          label: tProjects('title'),
          description: tProjects('title'),
        },
        {
          href: '/admin/orders',
          icon: ShoppingCart,
          label: tOrders('title'),
          description: tOrders('description'),
        },
        {
          href: '/admin/partners',
          icon: Building2,
          label: tPartners('title'),
          description: tPartners('description'),
        },
        {
          href: '/admin/users',
          icon: Users,
          label: tUsers('users'),
          description: tUsers('users'),
        },
        {
          href: '/admin/subscriptions',
          icon: CreditCard,
          label: tSubscriptions('title'),
          description: tSubscriptions('title'),
        },
        {
          href: '/admin/investments',
          icon: TrendingUp,
          label: 'Investissements',
          description: 'Suivi des investissements',
        },
        {
          href: '/admin/points-transactions',
          icon: Coins,
          label: 'Transactions Points',
          description: 'Historique des points',
        },
      ],
    },
    {
      key: 'content',
      label: 'Contenu & CMS',
      icon: FileText,
      items: [
        {
          href: '/admin/biodex',
          icon: Leaf,
          label: 'Biodex',
          description: 'Espèces et biodiversité',
        },
        {
          href: '/admin/blog',
          icon: FileText,
          label: 'Blog',
          description: 'Articles et actualités',
        },
        {
          href: '/admin/categories',
          icon: Tags,
          label: 'Catégories',
          description: 'Taxonomie produits',
        },
      ],
    },
    {
      key: 'settings',
      label: 'Configuration',
      icon: Settings,
      isStandalone: true,
      href: '/admin/settings',
      description: 'Gérer les préférences',
    },
    {
      key: 'client-site',
      label: 'Site Client',
      icon: Globe,
      isStandalone: true,
      href: CLIENT_URL,
      description: 'Voir le site public',
    },
  ]
}
