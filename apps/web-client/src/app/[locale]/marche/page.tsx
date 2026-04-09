import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'

export default async function MarchePage() {
  const locale = await getLocale()
  redirect({ href: '/products', locale })
}
