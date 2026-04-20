import { OnboardingLayout } from '../_features/onboarding-layout'
import { Step5Paywall } from '../_features/step-5-paywall'

export default function Step5Page() {
  return (
    <OnboardingLayout currentStep={5} totalSteps={5} prevStep={4}>
      <Step5Paywall />
    </OnboardingLayout>
  )
}
