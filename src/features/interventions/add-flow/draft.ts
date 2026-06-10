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

  if (!validation.canSave || state.what.type === null) {
    throw new Error(validation.blockingMessages.join(' '))
  }

  const note = state.what.note.trim()

  return {
    projectId: project.id,
    title: state.what.title.trim(),
    description: note === '' ? undefined : note,
    type: state.what.type,
    date: state.when.date.trim(),
    phaseId: state.where.locationToDefine ? null : state.where.phaseId,
    zoneId: state.where.locationToDefine ? null : state.where.zoneId,
    personIds: state.who.personIds,
    startTime: state.when.startTime,
    endTime: state.when.endTime,
    breakMinutes: state.when.breakMinutes,
    days: state.when.days,
    hourlyRate: getDefaultHourlyRate(people),
    isExtra: state.status.isExtra,
    
    notes: note === '' ? undefined : note,
  }
}

const getDefaultHourlyRate = (people: Person[]): number =>
  people.find((person) => person.active)?.defaultHourlyRate ?? 45
