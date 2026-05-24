'use client'

import { useState } from 'react'
import { Leaf } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'
import { ActivityFilter } from './activity-filter'
import {
  adaptNormalizedSupportToProducerSupport,
  adaptNormalizedContributionToViewModel,
  type ProducerSupportViewModel,
} from '@/lib/mappers/producer-support-adapters'

type SupportProject = {
  name_default: string | null
  slug: string | null
  status: string | null
  cover_image_url?: string | null
}

type NormalizedSupport = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  project: SupportProject | null
  type: 'support'
}

type NormalizedContribution = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  project: SupportProject | null
  type: 'contribution'
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

type UnifiedActivity = NormalizedSupport | NormalizedContribution | NormalizedOrder

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

type FilterType = 'all' | 'support' | 'contribution' | 'order'

type ActivityListProps = {
  userSupports: NormalizedSupport[]
  userDonations: NormalizedContribution[]
  userOrders: NormalizedOrder[]
  totalSupported: number
  totalPoints: number
}

export function ActivityList({ userSupports, userDonations, userOrders, totalSupported, totalPoints }: ActivityListProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const router = useRouter()

  const allActivities: UnifiedActivity[] = [...userSupports, ...userDonations, ...userOrders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const filteredActivities = allActivities.filter((activity) => {
    if (filter === 'all') return true
    if (filter === 'support') return activity.type === 'support'
    if (filter === 'contribution') return activity.type === 'contribution'
    if (filter === 'order') return activity.type === 'order'
    return true
  })

  // Calculate filtered totals for bento display
  const filteredSupports = filter === 'all' || filter === 'support' ? userSupports : []
  const filteredContributions = filter === 'all' || filter === 'contribution' ? userDonations : []
  const filteredOrders = filter === 'all' || filter === 'order' ? userOrders : []
  const displayContributed = [...filteredSupports, ...filteredContributions].reduce((sum, item) => sum + item.amount_eur, 0)
  const displayPoints = [...filteredSupports, ...filteredContributions, ...filteredOrders].reduce((sum, item) => sum + item.amount_points, 0)
  const displayOrderEuros = filteredOrders.reduce((sum, order) => sum + order.amount_eur, 0)

  // Determine bento labels based on filter
  const leftLabel = filter === 'order' ? 'Total Achat' : 'Total Soutiens'
  const leftValue = filter === 'order' ? (displayOrderEuros > 0 ? displayOrderEuros : displayPoints) : displayContributed
  const leftUnit = filter === 'order' ? (displayOrderEuros > 0 ? '€' : 'Crédits Impact') : '€'
  const rightLabel = filter === 'support' ? 'Crédits reçus' : 'Crédits échangés'
  const rightValue = filter === 'support' ? userSupports.reduce((sum, s) => sum + s.amount_points, 0) : displayPoints
  const rightUnit = ''

  return (
    <>
      {/* 1. HERO - Titre de la page */}
      <div className="relative z-10 px-4 pt-24 pb-6">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-white hyphens-none text-balance leading-[1.1]">
          Historique
        </h1>
        <p className="text-sm text-gray-400 text-pretty leading-[1.6]">
          Vos soutiens, contributions et échanges de crédits.
        </p>
      </div>

      {/* 2. DASHBOARD GLOBAL - Carte Hero Unifiée */}
      <div className="relative z-10 mx-4 mb-6 overflow-x-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1A1F26] to-[#0B0F15] p-6 shadow-lg flex justify-between items-center flex-shrink-0 w-full">
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
        <div className="relative z-10 flex flex-col gap-3 px-4">
          {filteredActivities.map((activity) => {
            if (activity.type === 'support') {
              const supportItem = activity
              const support = adaptNormalizedSupportToProducerSupport(supportItem)
              const statusLabel = support.statusLabel

              const content = (
                <div
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#1A1F26] p-4 transition-colors hover:bg-white/[0.03]"
                  onClick={() => router.push(`/transactions/${support.id}?type=support`)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {support.project.coverImageUrl ? (
                      <img
                        src={support.project.coverImageUrl}
                        alt={support.project.name}
                        className="h-12 w-12 shrink-0 rounded-xl border border-white/5 bg-[#0B0F15] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/10">
                        <Leaf className="h-5 w-5 text-lime-400" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-lime-400/80 mb-0.5">
                        {support.contributionTypeLabel}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate leading-snug mb-0.5">
                        {support.project.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(support.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 ml-2">
                    <span className="text-sm font-black tracking-tight text-white">
                      {formatEuros(support.amountEuros)} €
                    </span>
                    <span className={getStatusBadgeClass(support.status)}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              )

              return <div key={supportItem.id}>{content}</div>
            } else if (activity.type === 'contribution') {
              const donation = activity
              // [R6] Adapter vers view-model donation pour affichage moderne
              const donationVM = adaptNormalizedContributionToViewModel(donation)
              const statusLabel = donationVM.statusLabel

              const content = (
                <div
                  className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#1A1F26] p-4 transition-colors hover:bg-white/[0.03]"
                  onClick={() => router.push(`/transactions/${donationVM.id}?type=donation`)}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    {donationVM.project.coverImageUrl ? (
                      <img
                        src={donationVM.project.coverImageUrl}
                        alt={donationVM.project.name}
                        className="h-12 w-12 shrink-0 rounded-xl border border-white/5 bg-[#0B0F15] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-lime-400/20 bg-lime-400/10">
                        <Leaf className="h-5 w-5 text-lime-400" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-lime-400/80 mb-0.5">
                        {donationVM.contributionTypeLabel}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate leading-snug mb-0.5">
                        {donationVM.project.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(donationVM.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 ml-2">
                    <span className="text-sm font-black tracking-tight text-white">
                      {formatEuros(donationVM.amountEuros)} €
                    </span>
                    <span className={getStatusBadgeClass(donationVM.status)}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              )

              return <div key={donation.id}>{content}</div>
            } else {
              const order = activity as NormalizedOrder
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
                        Échange de crédits
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
                      {paidInEuros ? `${formatEuros(order.amount_eur)} €` : `${formatEuros(order.amount_points)} crédits`}
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
            Soutenez un projet ou échangez vos crédits contre un produit pour retrouver votre historique ici.
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
