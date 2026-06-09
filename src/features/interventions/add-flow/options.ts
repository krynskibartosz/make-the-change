import type { InterventionTypeOption, StepDefinition, TimePreset } from './types'

export const ADD_INTERVENTION_STEPS: StepDefinition[] = [
  { id: 'what', label: 'Quoi' },
  { id: 'where', label: 'Ou' },
  { id: 'who', label: 'Qui' },
  { id: 'when', label: 'Quand' },
  { id: 'status', label: 'Statut' },
  { id: 'summary', label: 'Resume' },
]

export const INTERVENTION_TYPE_OPTIONS: InterventionTypeOption[] = [
  {
    label: 'Demolition',
    shortLabel: 'Demo',
    value: 'demolition',
    defaultTitle: 'Demolition',
  },
  {
    label: 'Evacuation',
    shortLabel: 'Evac',
    value: 'evacuation',
    defaultTitle: 'Evacuation dechets',
  },
  {
    label: 'Protection',
    shortLabel: 'Protection',
    value: 'protection',
    defaultTitle: 'Protection chantier',
  },
  {
    label: 'Structure',
    shortLabel: 'Structure',
    value: 'structure',
    defaultTitle: 'Travaux structure',
  },
  {
    label: 'Achat',
    shortLabel: 'Achat',
    value: 'expense',
    defaultTitle: 'Achat materiel',
  },
  {
    label: 'Tache',
    shortLabel: 'Tache',
    value: 'task',
    defaultTitle: 'Tache chantier',
  },
  {
    label: 'Autre',
    shortLabel: 'Autre',
    value: 'other',
    defaultTitle: 'Intervention chantier',
  },
]

export const TIME_PRESETS: TimePreset[] = [
  { label: 'Journee', startTime: '08:00', endTime: '18:30', breakMinutes: 30 },
  { label: 'Matin', startTime: '08:00', endTime: '12:00', breakMinutes: 0 },
  { label: 'Apres-midi', startTime: '13:00', endTime: '18:30', breakMinutes: 0 },
]
