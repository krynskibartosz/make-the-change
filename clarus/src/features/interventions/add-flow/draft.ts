import type { CreateInterventionDraftInput, Person, Project } from '@/lib/domain'
import type { AddInterventionState } from './types'
import { validateAddInterventionState } from './validation'

type CreateDraftInputFromStateInput = {
  people: Person[]
  project: Project
  state: AddInterventionState
}

export const createDraftInputFromState = ({
  people,
  project,
  state,
}: CreateDraftInputFromStateInput): CreateInterventionDraftInput => {
  const validation = validateAddInterventionState(state)

  if (!validation.canSave || state.form.type === null) {
    throw new Error(validation.blockingMessages.join(' '))
  }

  const note = state.form.note.trim()

  let isExtra: boolean | 'to_check' = false
  if (state.status.simplified === 'extra') {
    isExtra = true
  } else if (state.status.simplified === 'to_check') {
    isExtra = 'to_check'
  }

  return {
    projectId: project.id,
    title: state.form.title.trim(),
    description: note === '' ? undefined : note,
    type: state.form.type,
    date: state.form.date.trim(),
    phaseId: state.form.locationToDefine ? null : state.form.phaseId,
    zoneId: state.form.locationToDefine ? null : state.form.zoneId,
    personIds: state.form.personIds,
    startTime: state.form.startTime,
    endTime: state.form.endTime,
    breakMinutes: state.form.breakMinutes,
    days: state.form.days,
    hourlyRate: getDefaultHourlyRate(people),
    isExtra: isExtra,
    notes: note === '' ? undefined : note,
  }
}

const getDefaultHourlyRate = (people: Person[]): number =>
  people.find((person) => person.active)?.defaultHourlyRate ?? 45
