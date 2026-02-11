import { useTranslations } from 'next-intl'
import { type BreadcrumbItem } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header'
import { LayoutDashboard, TrendingUp } from 'lucide-react'

export const useInvestmentBreadcrumbs = (id?: string): BreadcrumbItem[] => {
  const t = useTranslations('admin.investments')

  return [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: t('title'),
      href: '/admin/investments',
      icon: TrendingUp,
    },
    {
      label: id || 'Détail',
    },
  ]
}
