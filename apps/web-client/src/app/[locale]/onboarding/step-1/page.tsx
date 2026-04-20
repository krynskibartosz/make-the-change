import { OnboardingLayout } from '../_features/onboarding-layout'
import { Step1Quiz } from '../_features/step-1-quiz'

export default function Step1Page() {
  return (
    <OnboardingLayout currentStep={1} totalSteps={5} prevStep={0}>
      <Step1Quiz />
    </OnboardingLayout>
  )
}
