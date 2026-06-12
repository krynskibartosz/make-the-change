import { describe, expect, it } from 'vitest'
import { getZoneStatus } from './zone-status'

describe('getZoneStatus', () => {
  it('signale une zone sensible comme nécessitant une attention', () => {
    expect(
      getZoneStatus({
        tasksCount: 1,
        interventionsCount: 0,
        isSensible: true,
      }).label,
    ).toBe('Attention requise')
  })

  it('rend explicite une zone avec activité', () => {
    expect(
      getZoneStatus({
        tasksCount: 1,
        interventionsCount: 2,
        isSensible: false,
      }).label,
    ).toBe('En activité')
  })

  it('rend explicite une zone sans activité', () => {
    expect(
      getZoneStatus({
        tasksCount: 0,
        interventionsCount: 0,
        isSensible: false,
      }).label,
    ).toBe('À jour')
  })
})
