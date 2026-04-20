'use client'

import { useState } from 'react'
import { Leaf } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'
import { ActivityFilter } from './activity-filter'

type InvestmentProject = {
  name_default: string | null
  slug: string | null
  status: string | null
  cover_image_url?: string | null
}

type NormalizedInvestment = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  project: InvestmentProject | null
  type: 'investment'
}

type NormalizedOrder = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  product: {
    name_default: string | null
    slug: string | null
    cover_image_url?: string | null
  } | null
  type: 'order'
}

type UnifiedActivity = NormalizedInvestment | NormalizedOrder

type FilterType = 'all' | 'investment' | 'order'

const STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  completed: 'Terminé',
  pending: 'En attente',
  delivered: 'Livré',
  processing: 'En cours',
  paid: 'Payé',
}

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'active':
    case 'paid':
    case 'delivered':
    case 'completed':
      return 'rounded-md border border-lime-400/20 bg-lime-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-lime-400'
    case 'processing':
    case 'pending':
      return 'rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400'
    default:
      return 'rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-400'
  }
}

const formatEuros = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

type ActivityListProps = {
  userInvestments: NormalizedInvestment[]
  userOrders: NormalizedOrder[]
  totalInvested: number
  totalPoints: number
}

export function ActivityList({ userInvestments, userOrders, totalInvested, totalPoints }: ActivityListProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const router = useRouter()

  const allActivities: UnifiedActivity[] = [...userInvestments, ...userOrders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const filteredActivities = allActivities.filter((activity) => {
    if (filter === 'all') return true
    if (filter === 'investment') return activity.type === 'investment'
    if (filter === 'order') return activity.type === 'order'
    return true
  })

  // Calculate filtered totals for bento display
  const filteredInvestments = filter === 'all' || filter === 'investment' ? userInvestments : []
  const filteredOrders = filter === 'all' || filter === 'order' ? userOrders : []
  const displayInvested = filteredInvestments.reduce((sum, inv) => sum + inv.amount_eur, 0)
  const displayPoints = [...filteredInvestments, ...filteredOrders].reduce((sum, item) => sum + item.amount_points, 0)
  const displayOrderEuros = filteredOrders.reduce((sum, order) => sum + order.amount_eur, 0)

  // Determine bento labels based on filter
  const leftLabel = filter === 'order' ? 'Total Achat' : 'Impact Total'
  const leftValue = filter === 'order' ? (displayOrderEuros > 0 ? displayOrderEuros : displayPoints) : displayInvested
  const leftUnit = filter === 'order' ? (displayOrderEuros > 0 ? '€' : 'pts') : '€'
  const rightLabel = filter === 'investment' ? 'Points Gagnés' : 'Points Dépensés'
  const rightValue = filter === 'investment' ? userInvestments.reduce((sum, inv) => sum + inv.amount_points, 0) : displayPoints
  const rightUnit = 'pts'

  return (
    <>
      {/* 1. HERO - Titre de la page */}
      <div className="relative z-10 px-6 pt-24 pb-6">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white hyphens-none text-balance leading-[1.1]">
          Mes Contributions
        </h1>
        <p className="text-sm text-gray-400 text-pretty leading-[1.6]">
          L&apos;historique de votre impact et de vos achats.
        </p>
      </div>

      {/* 2. DASHBOARD GLOBAL - Carte Hero Unifiée */}
      <div className="relative z-10 mx-6 mb-6 overflow-x-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1A1F26] to-[#0B0F15] p-6 shadow-lg flex justify-between items-center flex-shrink-0 w-full">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{leftLabel}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tighter leading-none">{formatEuros(leftValue)}</span>
            <span className="text-lg font-bold text-lime-400">{leftUnit}</span>
          </div>
        </div>
        <div className="w-px h-12 bg-white/10"></div>
        <div className="flex flex-col gap-1 text-right min-w-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{rightLabel}</span>
          <div className="flex items-baseline gap-1.5 justify-end">
            <span className="text-3xl font-black text-white tracking-tighter leading-none">{formatEuros(rightValue)}</span>
            <span className="text-lg font-bold text-lime-400">{rightUnit}</span>
          </div>
        </div>
      </div>

      {/* 3. SÉLECTEUR DE FILTRE */}
      <ActivityFilter currentFilter={filter} onFilterChange={setFilter} />

      {/* 4. LISTE DES ACTIVITÉS UNIFIÉES */}
      {filteredActivities.length > 0 ? (
        <div className="relative z-10 flex flex-col gap-3 px-6">
          {filteredActivities.map((activity) => {
            if (activity.type === 'investment') {
              const investment = activity
              const project = investment.project
              const href = project?.slug ? `/projects/${project.slug}` : null
              const isActive = investment.status === 'active'
              const statusLabel = STATUS_LABELS[investment.status] || investment.status

              const content = (
                <div
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#1A1F26] p-4 transition-colors hover:bg-white/[0.03]"
                  onClick={() => router.push(`/transactions/${investment.id}?type=investment`)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {project?.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt={project.name_default || 'Projet'}
                        className="h-12 w-12 shrink-0 rounded-xl border border-white/5 bg-[#0B0F15] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/10">
                        <Leaf className="h-5 w-5 text-lime-400" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-lime-400/80 mb-0.5">
                        Impact
                      </span>
                      <h3 className="text-sm font-bold text-white truncate leading-snug mb-0.5">
                        {project?.name_default || 'Projet'}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(investment.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 ml-2">
                    <span className="text-sm font-black tracking-tight text-white">
                      {formatEuros(investment.amount_eur)} €
                    </span>
                    <span className={getStatusBadgeClass(investment.status)}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              )

              return <div key={investment.id}>{content}</div>
            } else {
              const order = activity
              const product = order.product
              const statusLabel = STATUS_LABELS[order.status] || order.status
              const paidInEuros = order.amount_eur > 0

              const content = (
                <div
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#1A1F26] p-4 transition-colors hover:bg-white/[0.03]"
                  onClick={() => router.push(`/transactions/${order.id}?type=order`)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {product?.cover_image_url ? (
                      <img
                        src={product.cover_image_url}
                        alt={product.name_default || 'Produit'}
                        className="h-12 w-12 shrink-0 rounded-xl border border-white/5 bg-[#0B0F15] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#0B0F15]">
                        <Leaf className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
                        Achat Boutique
                      </span>
                      <h3 className="text-sm font-bold text-white truncate leading-snug mb-0.5">
                        {product?.name_default || 'Produit'}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 ml-2">
                    <span className="text-sm font-black tracking-tight text-white">
                      {paidInEuros ? `${formatEuros(order.amount_eur)} €` : `${formatEuros(order.amount_points)} pts`}
                    </span>
                    <span className={getStatusBadgeClass(order.status)}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              )

              return <div key={order.id}>{content}</div>
            }
          })}
        </div>
      ) : (
        <div className="relative z-10 mx-6 flex flex-col items-center rounded-3xl border border-white/5 bg-[#1A1F26] p-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10">
            <Leaf className="h-7 w-7 text-lime-400" />
          </div>
          <p className="mb-2 text-base font-bold text-white">Aucune contribution pour l&apos;instant</p>
          <p className="mb-6 text-sm text-gray-400 text-pretty">
            Soutenez un projet ou achetez un produit pour commencer à bâtir votre héritage d&apos;impact.
          </p>
          <button
            onClick={() => router.push('/projects')}
            className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 px-5 py-3 text-sm font-black text-[#0B0F15] shadow-[0_0_30px_rgba(132,204,22,0.15)] transition active:scale-[0.98]"
          >
            Découvrir les projets
          </button>
        </div>
      )}
    </>
  )
}
