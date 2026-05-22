import { TreeDeciduous, Truck, Waves } from 'lucide-react'

export const IMPACT_KIND_COLOR: Record<string, string> = {
  beehive: 'text-amber-300',
  orchard: 'text-emerald-300',
  reef: 'text-sky-300',
  equipment: 'text-amber-300',
}

export function HiveSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C8.5 2 5.5 5 5.5 9.5H18.5C18.5 5 15.5 2 12 2ZM5 11H19V13.5H5ZM6.5 14.5H17.5V17H6.5ZM8 18H16V20.5H8Z" />
    </svg>
  )
}

export function ImpactKindIcon({ kind, className }: { kind: string; className?: string }) {
  if (kind === 'orchard') return <TreeDeciduous className={className} />
  if (kind === 'reef') return <Waves className={className} />
  if (kind === 'equipment') return <Truck className={className} />
  return <HiveSilhouette className={className} />
}
