import { OnboardingLayout } from '../_features/onboarding-layout'
import { Step4Loading } from '../_features/step-4-loading'

export default function Step4Page() {
  return (
    <OnboardingLayout currentStep={4} totalSteps={5} prevStep={3}>
      <Step4Loading />
    </OnboardingLayout>
  )
}
