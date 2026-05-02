import { FactionCarousel } from '@/app/[locale]/(auth)/_features/faction-carousel'

export default async function Step2Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const preselected = Array.isArray(resolvedSearchParams.preselected) 
    ? resolvedSearchParams.preselected[0] 
    : resolvedSearchParams.preselected

  return <FactionCarousel onboardingMode preselectedFactionId={preselected} />
}
