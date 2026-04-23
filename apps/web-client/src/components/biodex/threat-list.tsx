import { AlertTriangle } from 'lucide-react'

interface ThreatListProps {
  threats: string[]
}

export function ThreatList({ threats }: ThreatListProps) {
  return (
    <div className="mx-5 rounded-3xl border border-white/5 bg-[#1C1C22] p-5">
      <h3 className="mb-3 font-bold text-white">Menaces principales</h3>
      <ul className="space-y-2">
        {threats.map((threat, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-white/70">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-500" />
            {threat}
          </li>
        ))}
      </ul>
    </div>
  )
}
