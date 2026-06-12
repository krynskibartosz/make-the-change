import type { ConstructionData } from '@/lib/services/ai-voice-service'

const STORAGE_KEY = 'clarus_demo_submissions'

export type DemoSubmissionStatus = 'pending' | 'validated' | 'organized' | 'correction'

export type DemoSubmission = Readonly<{
  id: string
  author: 'Hubert'
  createdAt: string
  title: string
  summary: string
  zone: string
  hours: string
  materials: string[]
  alerts: string[]
  status: DemoSubmissionStatus
}>

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export function createWorkerSubmission(
  result: ConstructionData,
  createdAt = new Date().toISOString(),
): DemoSubmission {
  return {
    id: `demo-hubert-${createdAt.replace(/\D/g, '')}`,
    author: 'Hubert',
    createdAt,
    title: result.workType === 'Non précisé' ? 'Note de chantier' : result.workType,
    summary: result.summary,
    zone: result.zone,
    hours: result.time,
    materials: result.materials,
    alerts: result.alerts,
    status: 'pending',
  }
}

export function readDemoSubmissions(storage: StorageLike): DemoSubmission[] {
  const value = storage.getItem(STORAGE_KEY)
  if (!value) return []

  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isDemoSubmission)
  } catch {
    return []
  }
}

export function appendDemoSubmission(storage: StorageLike, submission: DemoSubmission) {
  const current = readDemoSubmissions(storage)
  storage.setItem(STORAGE_KEY, JSON.stringify([submission, ...current]))
}

export function updateDemoSubmissionStatus(
  storage: StorageLike,
  id: string,
  status: DemoSubmissionStatus,
) {
  const updated = readDemoSubmissions(storage).map((submission) =>
    submission.id === id ? { ...submission, status } : submission,
  )
  storage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

function isDemoSubmission(value: unknown): value is DemoSubmission {
  if (!value || typeof value !== 'object') return false
  const submission = value as Partial<DemoSubmission>

  return (
    typeof submission.id === 'string' &&
    submission.author === 'Hubert' &&
    typeof submission.createdAt === 'string' &&
    typeof submission.title === 'string' &&
    typeof submission.summary === 'string' &&
    typeof submission.zone === 'string' &&
    typeof submission.hours === 'string' &&
    Array.isArray(submission.materials) &&
    Array.isArray(submission.alerts) &&
    ['pending', 'validated', 'organized', 'correction'].includes(submission.status ?? '')
  )
}
