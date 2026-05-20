import type { AtlasTerritoryConfig, HexCell } from '@/lib/learning/schema'
import { HEX_RADIUS } from '../_utils/atlas-config'
import { getHexCenter, getHexPath, getTerritoryPoint } from '../_utils/atlas-geometry'

export function HexTerritorySvg({
  territory,
  selected,
  dimmed,
  hasProgress,
}: {
  territory: AtlasTerritoryConfig
  selected: boolean
  dimmed: boolean
  hasProgress: boolean
}) {
  const center = getTerritoryPoint(territory)

  return (
    <g opacity={dimmed ? 0.45 : 1}>
      <g>
        {territory.cells.map((cell: HexCell) => {
          const { x: cellX, y: cellY } = getHexCenter(cell, HEX_RADIUS)
          return (
            <path
              key={`${territory.domain.id}-${cell.q}-${cell.r}`}
              d={getHexPath(center.x + cellX, center.y + cellY, HEX_RADIUS)}
              fill={territory.darkColor}
              stroke="rgba(0,0,0,0.32)"
              strokeWidth="2.4"
            />
          )
        })}
      </g>
      <g opacity={selected ? 0.9 : hasProgress ? 0.82 : 0.62}>
        {territory.textureCells.map((cell: HexCell) => {
          const { x: cellX, y: cellY } = getHexCenter(cell, HEX_RADIUS)
          return (
            <path
              key={`${territory.domain.id}-texture-${cell.q}-${cell.r}`}
              d={getHexPath(center.x + cellX, center.y + cellY, HEX_RADIUS * 0.36)}
              fill={hasProgress ? territory.color : "rgba(0,0,0,0.34)"}
              opacity={hasProgress ? 0.5 : 1}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
            />
          )
        })}
      </g>
    </g>
  )
}
