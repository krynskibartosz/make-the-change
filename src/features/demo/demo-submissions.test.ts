import { describe, expect, it } from 'vitest'
import {
  appendDemoSubmission,
  createWorkerSubmission,
  readDemoSubmissions,
  updateDemoSubmissionStatus,
} from './demo-submissions'

function createMemoryStorage() {
  const values = new Map<string, string>()

  return {
    getItem(key: string) {
      return values.get(key) ?? null
    },
    setItem(key: string, value: string) {
      values.set(key, value)
    },
  }
}

describe('demo submissions', () => {
  it('creates a pending Hubert submission from the voice analysis', () => {
    const submission = createWorkerSubmission(
      {
        summary: 'Coulage de la dalle',
        workType: 'Maçonnerie',
        zone: 'Sol béton',
        workers: ['Hubert', 'Christophe'],
        time: '8 h - 12 h',
        materials: ['4 sacs de ciment'],
        alerts: ['Bâche manquante'],
      },
      '2026-06-12T08:30:00.000Z',
    )

    expect(submission).toMatchObject({
      author: 'Hubert',
      title: 'Maçonnerie',
      status: 'pending',
      zone: 'Sol béton',
      hours: '8 h - 12 h',
    })
  })

  it('persists submissions and updates their review status', () => {
    const storage = createMemoryStorage()
    const submission = createWorkerSubmission(
      {
        summary: 'Coulage de la dalle',
        workType: 'Maçonnerie',
        zone: 'Sol béton',
        workers: ['Hubert'],
        time: '8 h - 12 h',
        materials: [],
        alerts: [],
      },
      '2026-06-12T08:30:00.000Z',
    )

    appendDemoSubmission(storage, submission)
    updateDemoSubmissionStatus(storage, submission.id, 'validated')

    expect(readDemoSubmissions(storage)).toEqual([{ ...submission, status: 'validated' }])
  })
})
