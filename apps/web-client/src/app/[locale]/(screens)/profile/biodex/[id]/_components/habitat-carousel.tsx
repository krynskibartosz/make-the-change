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
      <div className="flex flex-wrap gap-2">
        {habitats.map((habitat, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-2 backdrop-blur-sm"
          >
            {getHabitatIcon(habitat)}
            <span className="text-xs text-white/90 text-wrap text-center max-w-[200px]">{habitat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
