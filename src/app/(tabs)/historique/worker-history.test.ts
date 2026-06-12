import { describe, expect, it } from 'vitest'

import type { InterventionListItem } from '@/lib/domain'
import { buildWorkerHistoryGroups, workerHistoryStatusLabels } from './worker-history'

const makeIntervention = (overrides: Partial<InterventionListItem> = {}): InterventionListItem => ({
  id: 'intervention-1',
  title: 'Protection de l’escalier',
  date: '2026-06-12',
  type: 'work',
  status: 'done',
  verificationStatus: 'to_check',
  isExtra: false,
  zoneName: 'Escalier',
  phaseName: 'Finitions',
  hours: 4,
  amount: 180,
  updatedAt: '2026-06-12T12:00:00.000Z',
  ...overrides,
})

describe('buildWorkerHistoryGroups', () => {
  it("separates today's submissions from the rest of the current week", () => {
    const groups = buildWorkerHistoryGroups(
      [
        makeIntervention({ id: 'today', date: '2026-06-12' }),
        makeIntervention({ id: 'week', date: '2026-06-09' }),
        makeIntervention({ id: 'older', date: '2026-06-07' }),
      ],
      '2026-06-12',
    )

    expect(groups.map((group) => [group.label, group.items.map((item) => item.id)])).toEqual([
      ["Aujourd'hui", ['today']],
      ['Cette semaine', ['week']],
    ])
  })

  it('maps chantier states to the four simple worker statuses', () => {
    const groups = buildWorkerHistoryGroups(
      [
        makeIntervention({ id: 'sent', status: 'done', verificationStatus: 'to_check' }),
        makeIntervention({ id: 'pending', status: 'in_progress' }),
        makeIntervention({ id: 'validated', verificationStatus: 'complete' }),
        makeIntervention({ id: 'correction', status: 'blocked' }),
      ],
      '2026-06-12',
    )

    expect(groups[0]?.items.map((item) => item.status)).toEqual([
      'sent',
      'pending',
      'validated',
      'correction',
    ])
    expect(workerHistoryStatusLabels).toEqual({
      sent: 'Envoyé',
      pending: 'En attente',
      validated: 'Validé',
      correction: 'À corriger',
    })
  })

  it('keeps only fields useful to Hubert', () => {
    const groups = buildWorkerHistoryGroups([makeIntervention()], '2026-06-12')

    expect(groups[0]?.items[0]).toEqual({
      id: 'intervention-1',
      title: 'Protection de l’escalier',
      date: '2026-06-12',
      zoneName: 'Escalier',
      status: 'sent',
    })
  })
})
