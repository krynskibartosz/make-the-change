type Step = 'infos' | 'paiement' | 'confirmation'

const STEPS: Array<{ key: Step; label: string }> = [
  { key: 'infos', label: 'Informations' },
  { key: 'paiement', label: 'Paiement' },
  { key: 'confirmation', label: 'Confirmation' },
]

export function CheckoutSteps({ currentStep }: { currentStep: Step }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <div className="mb-5 flex items-center gap-2 text-xs font-semibold">
      {STEPS.map((step, index) => (
        <span key={step.key} className="flex items-center gap-2">
          {index > 0 && <span className="text-white/20">›</span>}
          <span
            className={
              index === currentIndex
                ? 'text-white'
                : index < currentIndex
                  ? 'text-lime-300'
                  : 'text-white/25'
            }
          >
            {step.label}
          </span>
        </span>
      ))}
    </div>
  )
}
