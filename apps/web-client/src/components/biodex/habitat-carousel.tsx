import { Trees, Mountain, Droplets, Leaf } from 'lucide-react'

interface HabitatCarouselProps {
  habitats: string[]
}

const habitatIcons: Record<string, React.ReactNode> = {
  forêt: <Trees className="h-6 w-6 text-emerald-400" />,
  forest: <Trees className="h-6 w-6 text-emerald-400" />,
  montagne: <Mountain className="h-6 w-6 text-emerald-400" />,
  mountain: <Mountain className="h-6 w-6 text-emerald-400" />,
  eau: <Droplets className="h-6 w-6 text-emerald-400" />,
  water: <Droplets className="h-6 w-6 text-emerald-400" />,
  lisière: <Leaf className="h-6 w-6 text-emerald-400" />,
  default: <Trees className="h-6 w-6 text-emerald-400" />,
}

function getHabitatIcon(habitat: string): React.ReactNode {
  const lowerHabitat = habitat.toLowerCase()
  for (const [key, icon] of Object.entries(habitatIcons)) {
    if (key !== 'default' && lowerHabitat.includes(key)) {
      return icon
    }
  }
  return habitatIcons.default
}

export function HabitatCarousel({ habitats }: HabitatCarouselProps) {
  return (
    <div className="mx-5">
      <h3 className="mb-3 font-bold text-white">Habitats</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {habitats.map((habitat, index) => (
          <div
            key={index}
            className="flex shrink-0 snap-center items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 backdrop-blur-sm"
          >
            {getHabitatIcon(habitat)}
            <span className="text-sm text-white/90">{habitat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
