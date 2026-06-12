import { describe, expect, it } from 'vitest'

import {
  initialWorkerCockpitState,
  workerCockpitReducer,
  workerStatusLabels,
} from './worker-cockpit-state'

describe('workerCockpitReducer', () => {
  it('moves from dictation to a locally sent note', () => {
    const recording = workerCockpitReducer(initialWorkerCockpitState, { type: 'record_started' })
    const analyzing = workerCockpitReducer(recording, { type: 'record_stopped' })
    const readyToSend = workerCockpitReducer(analyzing, {
      type: 'analysis_succeeded',
      result: {
        summary: 'Pose des protections',
        workType: 'Protection',
        zone: 'Escalier',
        workers: ['Hubert'],
        time: '2 h',
        materials: [],
        alerts: [],
      },
    })
    const sent = workerCockpitReducer(readyToSend, { type: 'sent_locally' })

    expect([recording.status, analyzing.status, readyToSend.status, sent.status]).toEqual([
      'recording',
      'analyzing',
      'ready_to_send',
      'sent',
    ])
    expect(sent.result?.summary).toBe('Pose des protections')
  })

  it('exposes every worker-facing state in French', () => {
    expect(workerStatusLabels).toEqual({
      ready: 'Prêt à dicter',
      recording: 'Enregistrement',
      analyzing: 'Analyse',
      ready_to_send: 'Prêt à envoyer',
      sent: 'Envoyé',
      error: 'Erreur',
    })
  })

  it('returns to a clean ready state after an error', () => {
    const failed = workerCockpitReducer(initialWorkerCockpitState, {
      type: 'failed',
      message: 'Le micro est bloqué',
    })

    expect(failed).toMatchObject({ status: 'error', errorMessage: 'Le micro est bloqué' })
    expect(workerCockpitReducer(failed, { type: 'reset' })).toEqual(initialWorkerCockpitState)
  })
})
