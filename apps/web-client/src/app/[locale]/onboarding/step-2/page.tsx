import { FactionCarousel } from '@/app/[locale]/(auth)/_features/faction-carousel'

export default function Step2Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const preselected = Array.isArray(searchParams.preselected) 
    ? searchParams.preselected[0] 
    : searchParams.preselected
  return <FactionCarousel onboardingMode preselectedFactionId={preselected} />
}
