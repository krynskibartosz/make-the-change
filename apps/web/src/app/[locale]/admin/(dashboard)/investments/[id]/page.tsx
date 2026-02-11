import { db } from '@make-the-change/core/db'
import { investments } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/auth-guards'
import { InvestmentDetailController } from './components/investment-detail-controller'

export async function generateMetadata(props: {
  params: Promise<{ id: string; locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.investments' })
  
  return {
    title: `${t('title')} - ${params.id} | Admin`,
  }
}

export default async function AdminInvestmentDetailPage(props: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await props.params
  await requireAdminPage(locale)

  const investment = await db.query.investments.findFirst({
    where: eq(investments.id, id),
    with: {
      user: true,
      project: true,
    },
  })

  if (!investment) {
    notFound()
  }

  // Transform dates to strings/dates as needed by the component
  // Drizzle returns Date objects for timestamp fields usually.
  const investmentData = {
    ...investment,
    amount_points: Number(investment.amount_points),
    amount_eur_equivalent: investment.amount_eur_equivalent ? Number(investment.amount_eur_equivalent) : null,
    created_at: investment.created_at,
    // Ensure relations are correctly typed or fallback
    project: investment.project ? {
        name_default: investment.project.name_default,
        slug: investment.project.slug
    } : null,
    user: investment.user ? {
        email: investment.user.email,
        first_name: (investment.user as any).first_name, // Type assertion might be needed if schema is loose
        last_name: (investment.user as any).last_name,
    } : null
  }

  return <InvestmentDetailController investment={investmentData} />
}
