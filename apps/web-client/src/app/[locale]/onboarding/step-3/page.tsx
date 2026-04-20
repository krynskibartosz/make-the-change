import { OnboardingLayout } from '../_features/onboarding-layout'
import { Step3Contract } from '../_features/step-3-contract'

export default function Step3Page() {
  return (
    <OnboardingLayout currentStep={3} totalSteps={5} prevStep={2}>
      <Step3Contract />
    </OnboardingLayout>
  )
}
