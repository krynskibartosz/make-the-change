import { useTranslations } from 'next-intl'
import { type BreadcrumbItem } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header'
import { LayoutDashboard, Coins } from 'lucide-react'

export const useTransactionBreadcrumbs = (id?: string): BreadcrumbItem[] => {
  const t = useTranslations('admin.points')

  return [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: t('title') || 'Points',
      href: '/admin/points-transactions',
      icon: Coins,
    },
    {
      label: id || 'Détail',
    },
  ]
}
