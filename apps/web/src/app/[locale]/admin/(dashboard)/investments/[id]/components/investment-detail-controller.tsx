'use client'

import { AdminDetailHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header'
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout'
import type { FC } from 'react'
import { useInvestmentBreadcrumbs } from './investment-breadcrumbs'
import { InvestmentDetails } from './investment-details'

type InvestmentData = {
  id: string
  amount_points: number
  amount_eur_equivalent?: string | number | null
  status?: string | null
  created_at: Date | string | null
  project?: {
    name_default: string
    slug: string
  } | null
  user?: {
    email: string
    first_name?: string | null
    last_name?: string | null
  } | null
}

type InvestmentDetailControllerProps = {
  investment: InvestmentData
}

export const InvestmentDetailController: FC<InvestmentDetailControllerProps> = ({ investment }) => {
  const breadcrumbs = useInvestmentBreadcrumbs(investment.id)

  return (
    <AdminDetailLayout
      headerContent={
        <AdminDetailHeader
          breadcrumbs={breadcrumbs}
          title={`Investissement ${investment.id.substring(0, 8)}...`}
          subtitle={`Effectué le ${investment.created_at ? new Date(investment.created_at).toLocaleDateString() : 'N/A'}`}
          statusIndicator={
             <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {investment.status}
             </span>
          }
        />
      }
    >
      <InvestmentDetails investment={investment} />
    </AdminDetailLayout>
  )
}
