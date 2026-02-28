import { getLocale } from 'next-intl/server'
import { CheckoutClient } from '@/app/[locale]/(marketing-no-footer)/checkout/_features/checkout-client'
import { SectionContainer } from '@/components/ui/section-container'
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
      'first_name, last_name, address_street, address_city, address_postal_code, address_country_code, points_balance',
    )
    .eq('id', user.id)
    .single()

  const pointsBalance = Number(profile?.points_balance || 0)

  const defaultAddress = {
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    street: profile?.address_street || '',
    city: profile?.address_city || '',
    postalCode: profile?.address_postal_code || '',
    country: profile?.address_country_code || '',
  }

  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-muted/25">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-110 w-110 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-105 w-105 rounded-full bg-marketing-positive-500/10 blur-[100px]" />
      </div>

      <SectionContainer size="lg" className="relative py-6 sm:py-10">
        <CheckoutClient pointsBalance={pointsBalance} defaultAddress={defaultAddress} />
      </SectionContainer>
    </section>
  )
}
