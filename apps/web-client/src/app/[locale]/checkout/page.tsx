import { getLocale } from 'next-intl/server'
import { SectionContainer } from '@/components/ui/section-container'
import { CheckoutClient } from '@/features/commerce/checkout/checkout-client'
import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const locale = await getLocale()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: `/login?returnTo=${encodeURIComponent('/checkout')}`, locale })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'first_name, last_name, address_street, address_city, address_postal_code, address_country_code, metadata',
    )
    .eq('id', user.id)
    .single()

  const metadata = (profile?.metadata || {}) as Record<string, unknown>
  const pointsBalance = Number((metadata.points_balance as number | undefined) ?? 0)

  const defaultAddress = {
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    street: profile?.address_street || '',
    city: profile?.address_city || '',
    postalCode: profile?.address_postal_code || '',
    country: profile?.address_country_code || '',
  }

  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-4 sm:py-6"
    >
      <CheckoutClient pointsBalance={pointsBalance} defaultAddress={defaultAddress} />
    </SectionContainer>
  )
}
