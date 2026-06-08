import type {
  CreateInterventionDraftInput,
  Intervention,
  InterventionDraft,
  Person,
  Phase,
  Project,
  TodaySummary,
  WorkEntry,
  Zone,
} from '@/lib/domain'

export type ClarusRepository = {
  getProject: () => Promise<Project>
  getPeople: () => Promise<Person[]>
  getPhases: () => Promise<Phase[]>
  getZones: () => Promise<Zone[]>
  getInterventions: () => Promise<Intervention[]>
  getInterventionById: (id: string) => Promise<Intervention | null>
  getWorkEntries: () => Promise<WorkEntry[]>
  getTodaySummary: (date: string) => Promise<TodaySummary>
  createInterventionDraft: (input: CreateInterventionDraftInput) => Promise<InterventionDraft>
}
