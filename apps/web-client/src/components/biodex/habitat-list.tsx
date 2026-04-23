import { Leaf } from 'lucide-react'

interface HabitatListProps {
  habitats: string[]
}

export function HabitatList({ habitats }: HabitatListProps) {
  return (
    <div className="mx-5 rounded-3xl border border-white/5 bg-[#1C1C22] p-5">
      <h3 className="mb-3 font-bold text-white">Habitats naturels</h3>
      <ul className="space-y-2">
        {habitats.map((habitat, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-white/70">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
            {habitat}
          </li>
        ))}
      </ul>
    </div>
  )
}
