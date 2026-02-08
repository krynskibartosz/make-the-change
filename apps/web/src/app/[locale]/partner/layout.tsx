import { requireProducerOrAdminPage } from '@/lib/auth-guards'

export default async function PartnerLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireProducerOrAdminPage(locale)

  return children
}
