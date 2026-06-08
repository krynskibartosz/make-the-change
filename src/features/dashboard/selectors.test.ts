import { describe, expect, it } from 'vitest'
import { mockInterventions, mockPeople, mockPhases, mockWorkEntries, mockZones } from '@/lib/mock'
import { selectTodaySummary } from './selectors'

describe('selectTodaySummary', () => {
  it("maps Sparrenlaan mocks into the Aujourd'hui view model", () => {
    const summary = selectTodaySummary({
      date: '2026-06-08',
      interventions: mockInterventions,
      workEntries: mockWorkEntries,
      people: mockPeople,
      zones: mockZones,
      phases: mockPhases,
    })

    expect(summary.date).toBe('2026-06-08')
    expect(summary.metrics.interventionCount).toBeGreaterThanOrEqual(2)
    expect(summary.metrics.hours).toBeGreaterThan(0)
    expect(summary.metrics.estimatedAmount).toBeGreaterThan(0)
    expect(summary.metrics.toCheckCount).toBeGreaterThanOrEqual(1)
    expect(summary.latestInterventions.length).toBeLessThanOrEqual(5)
    expect(summary.latestInterventions[0]).toMatchObject({
      zoneName: expect.any(String),
      phaseName: expect.any(String),
      hours: expect.any(Number),
      amount: expect.any(Number),
    })
    expect(summary.alerts.some((alert) => alert.severity === 'warning')).toBe(true)
  })
})
