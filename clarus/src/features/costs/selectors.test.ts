import { describe, expect, it } from 'vitest'
import { mockInterventions, mockPeople, mockPhases, mockWorkEntries, mockZones } from '@/lib/mock'
import { selectCostsSummary } from './selectors'

describe('selectCostsSummary', () => {
  it('maps Sparrenlaan mocks into the Couts view model', () => {
    const summary = selectCostsSummary({
      interventions: mockInterventions,
      workEntries: mockWorkEntries,
      people: mockPeople,
      zones: mockZones,
      phases: mockPhases,
    })

    expect(summary.totals.hours).toBeGreaterThan(0)
    expect(summary.totals.laborAmount).toBeGreaterThan(0)
    expect(summary.totals.toCheckAmount).toBeGreaterThan(0)
    expect(summary.totals.extraAmount).toBeGreaterThan(0)
    expect(summary.byPerson).toHaveLength(5)
    expect(summary.byZone.some((zone) => zone.name === 'Sol beton / dalle')).toBe(true)
    expect(summary.byPhase.some((phase) => phase.name === 'Demolition')).toBe(true)
    expect(summary.toCheckInterventions.length).toBeGreaterThanOrEqual(1)
  })
})
