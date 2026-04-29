import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'

export default async function CheckoutPage() {
  // Checkout functionality removed - redirecting to home
  const locale = await getLocale()
  return redirect({ href: '/', locale })
}
