import { FactionCarousel } from '@/app/[locale]/(auth)/_features/faction-carousel'

export default function Step2Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const preselected = searchParams.preselected as string | undefined
  return <FactionCarousel onboardingMode preselectedFactionId={preselected} />
}
