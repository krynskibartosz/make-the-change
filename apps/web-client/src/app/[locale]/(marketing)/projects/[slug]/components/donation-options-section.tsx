import { Link } from '@/i18n/navigation'
import type { DonationOption } from '@/types/context'

type DonationOptionsSectionProps = {
  options: DonationOption[]
  projectId: string
  projectSlug: string
}

export function DonationOptionsSection({
  options,
  projectId,
  projectSlug,
}: DonationOptionsSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground">Options de donation</h3>
      <div className="grid gap-3">
        {options.map((option) => (
          <Link
            key={option.id}
            href={`/projects/${projectSlug}/donate?option=${option.id}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
          >
            <div>
              <p className="font-bold text-foreground">{option.name}</p>
              <p className="text-sm text-muted-foreground">
                {option.quantity} {option.unitLabel} • +{option.rewards.points} pts
              </p>
            </div>
            <span className="text-lg font-bold text-lime-400">{option.price}€</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
