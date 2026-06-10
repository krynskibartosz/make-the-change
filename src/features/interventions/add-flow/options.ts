import type { InterventionTypeOption, StepDefinition, TimePreset } from './types'

export const ADD_INTERVENTION_STEPS: StepDefinition[] = [
  { id: 'quick_form', label: 'Travail' },
  { id: 'summary', label: 'Résumé' },
]

export const INTERVENTION_TYPE_OPTIONS: InterventionTypeOption[] = [
  {
    label: 'Démolition',
    shortLabel: 'Démo',
    value: 'demolition',
    defaultTitle: 'Démolition',
  },
  {
    label: 'Évacuation',
    shortLabel: 'Évac',
    value: 'evacuation',
    defaultTitle: 'Évacuation déchets',
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
    defaultTitle: 'Achat matériel',
  },
  {
    label: 'Tâche',
    shortLabel: 'Tâche',
    value: 'task',
    defaultTitle: 'Tâche chantier',
  },
  {
    label: 'Autre',
    shortLabel: 'Autre',
    value: 'other',
    defaultTitle: 'Travail réalisé',
  },
]

export const TIME_PRESETS: TimePreset[] = [
  { label: 'Journée', startTime: '08:00', endTime: '18:30', breakMinutes: 30 },
  { label: 'Matin', startTime: '08:00', endTime: '12:00', breakMinutes: 0 },
  { label: 'Après-midi', startTime: '13:00', endTime: '18:30', breakMinutes: 0 },
]
