import type { ConstructionData } from '@/lib/services/ai-voice-service'

export type WorkerCockpitStatus =
  | 'ready'
  | 'recording'
  | 'analyzing'
  | 'ready_to_send'
  | 'sent'
  | 'error'

export type WorkerCockpitState = Readonly<{
  status: WorkerCockpitStatus
  result: ConstructionData | null
  errorMessage: string | null
}>

export type WorkerCockpitAction =
  | { type: 'record_started' }
  | { type: 'record_stopped' }
  | { type: 'analysis_succeeded'; result: ConstructionData }
  | { type: 'failed'; message: string }
  | { type: 'sent_locally' }
  | { type: 'reset' }

export const workerStatusLabels: Record<WorkerCockpitStatus, string> = {
  ready: 'Prêt à dicter',
  recording: 'Enregistrement',
  analyzing: 'Analyse',
  ready_to_send: 'Prêt à envoyer',
  sent: 'Envoyé',
  error: 'Erreur',
}

export const initialWorkerCockpitState: WorkerCockpitState = {
  status: 'ready',
  result: null,
  errorMessage: null,
}

export function workerCockpitReducer(
  state: WorkerCockpitState,
  action: WorkerCockpitAction,
): WorkerCockpitState {
  switch (action.type) {
    case 'record_started':
      return { status: 'recording', result: null, errorMessage: null }
    case 'record_stopped':
      return state.status === 'recording' ? { ...state, status: 'analyzing' } : state
    case 'analysis_succeeded':
      return { status: 'ready_to_send', result: action.result, errorMessage: null }
    case 'failed':
      return { status: 'error', result: null, errorMessage: action.message }
    case 'sent_locally':
      return state.status === 'ready_to_send' ? { ...state, status: 'sent' } : state
    case 'reset':
      return initialWorkerCockpitState
  }
}
