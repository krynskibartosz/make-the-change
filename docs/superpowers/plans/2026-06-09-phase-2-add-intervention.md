# Phase 2 Add Intervention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete mobile-first "Ajouter intervention" wizard for Clarus V0, backed by mock-first data and visible in the existing app views.

**Architecture:** Keep one integration branch and one implementation owner because the wizard state, modal route, repository draft creation, and UI steps share the same files. Use subagents for focused analysis/review: UX flow review before coding, Data/Tests review before final integration, and Browser QA after implementation.

**Tech Stack:** Next.js App Router, React client components, TypeScript strict, Zod, Vitest, Biome, Tailwind CSS tokens, lucide-react, GitHub issues #2 to #8.

---

## Execution Strategy

Recommended command sequence before implementation:

```powershell
cd C:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\clarus-standalone
git status -sb
git switch -c codex/phase-2-add-intervention
pnpm lint
pnpm type-check
pnpm test
```

Expected starting point:

```txt
## main...origin/main
```

Use these agents:

- **Main Integration Agent:** owns all edits and commits.
- **UX Add Flow Subagent:** reads issues #2 to #8 and reviews step order, labels, friction, mobile ergonomics.
- **Data/Tests Subagent:** reviews draft types, validation rules, repository behavior, and tests.
- **QA Browser Subagent:** after implementation, verifies the flow on `http://localhost:3002/interventions/new` and intercepted modal from `http://localhost:3002/journal`.

Do not let multiple agents edit the same files simultaneously.

---

## File Structure

Create:

- `src/features/interventions/add-flow/types.ts`
  Wizard state, step ids, option types, and reducer action types.

- `src/features/interventions/add-flow/options.ts`
  Static intervention type options and quick time presets.

- `src/features/interventions/add-flow/validation.ts`
  Progressive validation. Blocks missing critical fields, marks incomplete non-critical fields as `to_check`.

- `src/features/interventions/add-flow/draft.ts`
  Converts wizard state plus repository reference data into `CreateInterventionDraftInput`.

- `src/features/interventions/add-flow/reducer.ts`
  Pure reducer for the client wizard.

- `src/features/interventions/add-flow/add-intervention-flow.tsx`
  Client container that reads synchronous mock reference data, manages wizard state, renders steps, and saves through the mock repository.

- `src/features/interventions/add-flow/step-what.tsx`
- `src/features/interventions/add-flow/step-where.tsx`
- `src/features/interventions/add-flow/step-who.tsx`
- `src/features/interventions/add-flow/step-when.tsx`
- `src/features/interventions/add-flow/step-status.tsx`
- `src/features/interventions/add-flow/step-summary.tsx`
- `src/features/interventions/add-flow/index.ts`

Test:

- `src/features/interventions/add-flow/validation.test.ts`
- `src/features/interventions/add-flow/draft.test.ts`
- `src/features/interventions/add-flow/reducer.test.ts`

Modify:

- `src/app/@modal/(.)interventions/new/page.tsx`
- `src/app/(screens)/interventions/new/page.tsx`
- `src/lib/repositories/mock-clarus-repository.ts`
- `src/lib/repositories/mock-clarus-repository.test.ts`
- `src/components/ui/index.ts`
- `src/components/ui/choice-card.tsx`

---

## Task 1: Branch And Baseline

**Files:**
- No file edits.

- [ ] **Step 1: Create the branch**

Run:

```powershell
git status -sb
git switch -c codex/phase-2-add-intervention
```

Expected:

```txt
Switched to a new branch 'codex/phase-2-add-intervention'
```

- [ ] **Step 2: Run baseline checks**

Run:

```powershell
pnpm lint
pnpm type-check
pnpm test
```

Expected:

```txt
lint passes
type-check passes
all current Vitest tests pass
```

- [ ] **Step 3: Read the active issues**

Run:

```powershell
gh issue view 2 --repo krynskibartosz/clarus
gh issue view 3 --repo krynskibartosz/clarus
gh issue view 4 --repo krynskibartosz/clarus
gh issue view 5 --repo krynskibartosz/clarus
gh issue view 6 --repo krynskibartosz/clarus
gh issue view 7 --repo krynskibartosz/clarus
gh issue view 8 --repo krynskibartosz/clarus
```

Expected: issues describe Quoi, Ou, Qui, Quand, Statut, Resume, and progressive `to_check` validation.

---

## Task 2: Add Flow Types, Options, And Reducer

**Files:**
- Create: `src/features/interventions/add-flow/types.ts`
- Create: `src/features/interventions/add-flow/options.ts`
- Create: `src/features/interventions/add-flow/reducer.ts`
- Create: `src/features/interventions/add-flow/reducer.test.ts`
- Create: `src/features/interventions/add-flow/index.ts`

- [ ] **Step 1: Write reducer tests**

Create `src/features/interventions/add-flow/reducer.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { createInitialAddInterventionState, reduceAddInterventionState } from './reducer'

describe('add intervention reducer', () => {
  it('derives a title from the selected intervention type when title is empty', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const next = reduceAddInterventionState(state, {
      type: 'selectType',
      interventionType: 'demolition',
      defaultTitle: 'Demolition',
    })

    expect(next.what.type).toBe('demolition')
    expect(next.what.title).toBe('Demolition')
  })

  it('keeps a custom title when changing type', () => {
    const state = reduceAddInterventionState(
      createInitialAddInterventionState({ today: '2026-06-09' }),
      { type: 'setTitle', title: 'Retirer les cloisons garage' },
    )

    const next = reduceAddInterventionState(state, {
      type: 'selectType',
      interventionType: 'evacuation',
      defaultTitle: 'Evacuation',
    })

    expect(next.what.type).toBe('evacuation')
    expect(next.what.title).toBe('Retirer les cloisons garage')
  })

  it('toggles people without duplicates', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const selected = reduceAddInterventionState(state, {
      type: 'togglePerson',
      personId: 'person-hubert',
    })
    const unselected = reduceAddInterventionState(selected, {
      type: 'togglePerson',
      personId: 'person-hubert',
    })

    expect(selected.who.personIds).toEqual(['person-hubert'])
    expect(unselected.who.personIds).toEqual([])
  })

  it('stores default date and time values', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    expect(state.when.date).toBe('2026-06-09')
    expect(state.when.startTime).toBe('08:00')
    expect(state.when.endTime).toBe('18:30')
    expect(state.when.breakMinutes).toBe(30)
    expect(state.when.days).toBe(1)
  })
})
```

- [ ] **Step 2: Run reducer test and confirm failure**

Run:

```powershell
pnpm test -- src/features/interventions/add-flow/reducer.test.ts
```

Expected: fail because `./reducer` does not exist.

- [ ] **Step 3: Create flow types**

Create `src/features/interventions/add-flow/types.ts`:

```ts
import type { BillingStatus, InterventionType, PaymentStatus } from '@/lib/domain'

export type AddInterventionStepId = 'what' | 'where' | 'who' | 'when' | 'status' | 'summary'

export type AddInterventionWhatState = {
  type: InterventionType | null
  title: string
  note: string
}

export type AddInterventionWhereState = {
  phaseId: string | null
  zoneId: string | null
  locationToDefine: boolean
}

export type AddInterventionWhoState = {
  personIds: string[]
}

export type AddInterventionWhenState = {
  date: string
  startTime: string
  endTime: string
  breakMinutes: number
  days: number
}

export type AddInterventionStatusState = {
  isExtra: boolean | 'to_check'
  billingStatus: BillingStatus
  paymentStatus: PaymentStatus
}

export type AddInterventionState = {
  currentStep: AddInterventionStepId
  what: AddInterventionWhatState
  where: AddInterventionWhereState
  who: AddInterventionWhoState
  when: AddInterventionWhenState
  status: AddInterventionStatusState
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  saveError: string | null
}

export type StepDefinition = {
  id: AddInterventionStepId
  label: string
}

export type InterventionTypeOption = {
  label: string
  shortLabel: string
  value: InterventionType
  defaultTitle: string
}

export type TimePreset = {
  label: string
  startTime: string
  endTime: string
  breakMinutes: number
}
```

- [ ] **Step 4: Create options**

Create `src/features/interventions/add-flow/options.ts`:

```ts
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
```

- [ ] **Step 5: Create reducer**

Create `src/features/interventions/add-flow/reducer.ts`:

```ts
import type {
  AddInterventionState,
  AddInterventionStepId,
  AddInterventionStatusState,
} from './types'

type CreateInitialStateInput = {
  today: string
}

export type AddInterventionAction =
  | { type: 'goToStep'; step: AddInterventionStepId }
  | { type: 'selectType'; interventionType: NonNullable<AddInterventionState['what']['type']>; defaultTitle: string }
  | { type: 'setTitle'; title: string }
  | { type: 'setNote'; note: string }
  | { type: 'setPhase'; phaseId: string | null }
  | { type: 'setZone'; zoneId: string | null }
  | { type: 'setLocationToDefine'; value: boolean }
  | { type: 'togglePerson'; personId: string }
  | { type: 'setDate'; date: string }
  | { type: 'setStartTime'; startTime: string }
  | { type: 'setEndTime'; endTime: string }
  | { type: 'setBreakMinutes'; breakMinutes: number }
  | { type: 'setDays'; days: number }
  | { type: 'setStatus'; status: AddInterventionStatusState }
  | { type: 'setSaveState'; saveState: AddInterventionState['saveState']; saveError?: string | null }

export const createInitialAddInterventionState = ({
  today,
}: CreateInitialStateInput): AddInterventionState => ({
  currentStep: 'what',
  what: {
    type: null,
    title: '',
    note: '',
  },
  where: {
    phaseId: null,
    zoneId: null,
    locationToDefine: false,
  },
  who: {
    personIds: [],
  },
  when: {
    date: today,
    startTime: '08:00',
    endTime: '18:30',
    breakMinutes: 30,
    days: 1,
  },
  status: {
    isExtra: false,
    billingStatus: 'not_billable',
    paymentStatus: 'not_applicable',
  },
  saveState: 'idle',
  saveError: null,
})

export const reduceAddInterventionState = (
  state: AddInterventionState,
  action: AddInterventionAction,
): AddInterventionState => {
  switch (action.type) {
    case 'goToStep':
      return { ...state, currentStep: action.step }
    case 'selectType':
      return {
        ...state,
        what: {
          ...state.what,
          type: action.interventionType,
          title: state.what.title.trim() === '' ? action.defaultTitle : state.what.title,
        },
      }
    case 'setTitle':
      return { ...state, what: { ...state.what, title: action.title } }
    case 'setNote':
      return { ...state, what: { ...state.what, note: action.note } }
    case 'setPhase':
      return { ...state, where: { ...state.where, phaseId: action.phaseId } }
    case 'setZone':
      return { ...state, where: { ...state.where, zoneId: action.zoneId } }
    case 'setLocationToDefine':
      return {
        ...state,
        where: {
          ...state.where,
          locationToDefine: action.value,
          phaseId: action.value ? null : state.where.phaseId,
          zoneId: action.value ? null : state.where.zoneId,
        },
      }
    case 'togglePerson':
      return {
        ...state,
        who: {
          personIds: state.who.personIds.includes(action.personId)
            ? state.who.personIds.filter((personId) => personId !== action.personId)
            : [...state.who.personIds, action.personId],
        },
      }
    case 'setDate':
      return { ...state, when: { ...state.when, date: action.date } }
    case 'setStartTime':
      return { ...state, when: { ...state.when, startTime: action.startTime } }
    case 'setEndTime':
      return { ...state, when: { ...state.when, endTime: action.endTime } }
    case 'setBreakMinutes':
      return { ...state, when: { ...state.when, breakMinutes: action.breakMinutes } }
    case 'setDays':
      return { ...state, when: { ...state.when, days: action.days } }
    case 'setStatus':
      return { ...state, status: action.status }
    case 'setSaveState':
      return {
        ...state,
        saveState: action.saveState,
        saveError: action.saveError ?? null,
      }
  }
}
```

- [ ] **Step 6: Export add-flow modules**

Create `src/features/interventions/add-flow/index.ts`:

```ts
export { AddInterventionFlow } from './add-intervention-flow'
```

- [ ] **Step 7: Run reducer tests**

Run:

```powershell
pnpm test -- src/features/interventions/add-flow/reducer.test.ts
```

Expected: all reducer tests pass.

- [ ] **Step 8: Commit**

Run:

```powershell
git add src/features/interventions/add-flow
git commit -m "feat: add intervention flow state"
```

---

## Task 3: Progressive Validation And Draft Mapping

**Files:**
- Create: `src/features/interventions/add-flow/validation.ts`
- Create: `src/features/interventions/add-flow/validation.test.ts`
- Create: `src/features/interventions/add-flow/draft.ts`
- Create: `src/features/interventions/add-flow/draft.test.ts`

- [ ] **Step 1: Write validation tests**

Create `src/features/interventions/add-flow/validation.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { createInitialAddInterventionState } from './reducer'
import { validateAddInterventionState } from './validation'

describe('validateAddInterventionState', () => {
  it('blocks when type and title are missing', () => {
    const result = validateAddInterventionState(
      createInitialAddInterventionState({ today: '2026-06-09' }),
    )

    expect(result.canSave).toBe(false)
    expect(result.blockingMessages).toContain('Choisis un type d intervention.')
  })

  it('allows incomplete location and marks the draft to_check', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })
    const result = validateAddInterventionState({
      ...state,
      what: { ...state.what, type: 'demolition', title: 'Demolition garage' },
      where: { phaseId: null, zoneId: null, locationToDefine: true },
    })

    expect(result.canSave).toBe(true)
    expect(result.shouldMarkToCheck).toBe(true)
    expect(result.warningMessages).toContain('Zone ou phase a verifier.')
  })
})
```

- [ ] **Step 2: Write draft mapping tests**

Create `src/features/interventions/add-flow/draft.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { mockPeople, mockProject } from '@/lib/mock'
import { createInitialAddInterventionState } from './reducer'
import { createDraftInputFromState } from './draft'

describe('createDraftInputFromState', () => {
  it('maps a complete wizard state to repository input', () => {
    const base = createInitialAddInterventionState({ today: '2026-06-09' })

    const input = createDraftInputFromState({
      project: mockProject,
      people: mockPeople,
      state: {
        ...base,
        what: { type: 'demolition', title: 'Demolition garage', note: 'Mur retire.' },
        where: {
          phaseId: 'phase-demolition',
          zoneId: 'zone-garage',
          locationToDefine: false,
        },
        who: { personIds: ['person-hubert', 'person-chris'] },
      },
    })

    expect(input).toMatchObject({
      projectId: 'project-sparrenlaan',
      title: 'Demolition garage',
      type: 'demolition',
      phaseId: 'phase-demolition',
      zoneId: 'zone-garage',
      personIds: ['person-hubert', 'person-chris'],
      startTime: '08:00',
      endTime: '18:30',
      breakMinutes: 30,
      days: 1,
      hourlyRate: 45,
      isExtra: false,
      notes: 'Mur retire.',
    })
  })
})
```

- [ ] **Step 3: Run tests and confirm failure**

Run:

```powershell
pnpm test -- src/features/interventions/add-flow/validation.test.ts src/features/interventions/add-flow/draft.test.ts
```

Expected: fail because `validation.ts` and `draft.ts` do not exist.

- [ ] **Step 4: Create validation**

Create `src/features/interventions/add-flow/validation.ts`:

```ts
import type { AddInterventionState } from './types'

export type AddInterventionValidation = {
  canSave: boolean
  blockingMessages: string[]
  warningMessages: string[]
  shouldMarkToCheck: boolean
}

export const validateAddInterventionState = (
  state: AddInterventionState,
): AddInterventionValidation => {
  const blockingMessages: string[] = []
  const warningMessages: string[] = []

  if (state.what.type === null) {
    blockingMessages.push('Choisis un type d intervention.')
  }

  if (state.what.title.trim() === '') {
    blockingMessages.push('Ajoute un titre court.')
  }

  if (state.when.date.trim() === '') {
    blockingMessages.push('Choisis une date.')
  }

  if (state.where.locationToDefine || state.where.phaseId === null || state.where.zoneId === null) {
    warningMessages.push('Zone ou phase a verifier.')
  }

  if (state.who.personIds.length === 0) {
    warningMessages.push('Personnes a verifier.')
  }

  if (state.status.isExtra === 'to_check') {
    warningMessages.push('Statut supplement a verifier.')
  }

  return {
    canSave: blockingMessages.length === 0,
    blockingMessages,
    warningMessages,
    shouldMarkToCheck: warningMessages.length > 0,
  }
}
```

- [ ] **Step 5: Create draft mapping**

Create `src/features/interventions/add-flow/draft.ts`:

```ts
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

  return {
    projectId: project.id,
    title: state.what.title.trim(),
    description: state.what.note.trim() === '' ? undefined : state.what.note.trim(),
    type: state.what.type,
    date: state.when.date,
    phaseId: state.where.locationToDefine ? null : state.where.phaseId,
    zoneId: state.where.locationToDefine ? null : state.where.zoneId,
    personIds: state.who.personIds,
    startTime: state.when.startTime,
    endTime: state.when.endTime,
    breakMinutes: state.when.breakMinutes,
    days: state.when.days,
    hourlyRate: getDefaultHourlyRate(people),
    isExtra: validation.shouldMarkToCheck ? 'to_check' : state.status.isExtra,
    notes: state.what.note.trim() === '' ? undefined : state.what.note.trim(),
  }
}

const getDefaultHourlyRate = (people: Person[]): number =>
  people.find((person) => person.active)?.defaultHourlyRate ?? 45
```

- [ ] **Step 6: Run validation and draft tests**

Run:

```powershell
pnpm test -- src/features/interventions/add-flow/validation.test.ts src/features/interventions/add-flow/draft.test.ts
```

Expected: tests pass.

- [ ] **Step 7: Commit**

Run:

```powershell
git add src/features/interventions/add-flow
git commit -m "feat: validate intervention drafts"
```

---

## Task 4: Mock Repository Save Visibility

**Files:**
- Modify: `src/lib/repositories/mock-clarus-repository.ts`
- Modify: `src/lib/repositories/mock-clarus-repository.test.ts`

- [ ] **Step 1: Add repository persistence test**

Append this test to `src/lib/repositories/mock-clarus-repository.test.ts`:

```ts
it('returns created draft intervention in subsequent intervention reads', async () => {
  const repository = createMockClarusRepository()

  const draft = await repository.createInterventionDraft({
    projectId: 'project-sparrenlaan',
    title: 'Demolition garage',
    type: 'demolition',
    date: '2026-06-09',
    phaseId: 'phase-demolition',
    zoneId: 'zone-garage',
    personIds: ['person-hubert'],
    startTime: '08:00',
    endTime: '18:30',
    breakMinutes: 30,
    days: 1,
    hourlyRate: 45,
    isExtra: false,
  })

  const interventions = await repository.getInterventions()
  const workEntries = await repository.getWorkEntries()

  expect(interventions.some((intervention) => intervention.id === draft.intervention.id)).toBe(true)
  expect(workEntries.some((entry) => entry.interventionId === draft.intervention.id)).toBe(true)
})
```

- [ ] **Step 2: Run test and confirm failure**

Run:

```powershell
pnpm test -- src/lib/repositories/mock-clarus-repository.test.ts
```

Expected: fail because created drafts are not included in subsequent reads.

- [ ] **Step 3: Make repository instances stateful**

Modify `src/lib/repositories/mock-clarus-repository.ts` so `createMockClarusRepository` closes over arrays:

```ts
export const createMockClarusRepository = (): ClarusRepository => {
  const interventions = [...mockInterventions]
  const workEntries = [...mockWorkEntries]

  return {
    getProject: async () => mockProject,
    getPeople: async () => [...mockPeople],
    getPhases: async () => [...mockPhases],
    getZones: async () => [...mockZones],
    getInterventions: async () => [...interventions],
    getInterventionById: async (id: string) =>
      interventions.find((intervention) => intervention.id === id) ?? null,
    getWorkEntries: async () => [...workEntries],
    getTodaySummary: async (date: string) =>
      selectTodaySummary({
        date,
        interventions,
        workEntries,
        people: mockPeople,
        zones: mockZones,
        phases: mockPhases,
      }),
    createInterventionDraft: async (input: CreateInterventionDraftInput) => {
      const draft = createInterventionDraft(input)
      interventions.unshift(draft.intervention)
      workEntries.unshift(...draft.workEntries)
      return draft
    },
  }
}
```

Keep the existing `createInterventionDraft`, `createDraftWorkEntry`, and `slugify` helpers below the factory.

- [ ] **Step 4: Run repository tests**

Run:

```powershell
pnpm test -- src/lib/repositories/mock-clarus-repository.test.ts
```

Expected: repository tests pass.

- [ ] **Step 5: Commit**

Run:

```powershell
git add src/lib/repositories/mock-clarus-repository.ts src/lib/repositories/mock-clarus-repository.test.ts
git commit -m "feat: persist mock intervention drafts"
```

---

## Task 5: UI Choice Primitive

**Files:**
- Create: `src/components/ui/choice-card.tsx`
- Modify: `src/components/ui/index.ts`
- Modify: `src/components/ui/primitives.test.tsx`

- [ ] **Step 1: Add primitive export test**

Add this assertion to the existing primitive export/import test in `src/components/ui/primitives.test.tsx`:

```ts
expect(ChoiceCard).toBeDefined()
```

Import `ChoiceCard` from `./index`.

- [ ] **Step 2: Run primitive test and confirm failure**

Run:

```powershell
pnpm test -- src/components/ui/primitives.test.tsx
```

Expected: fail because `ChoiceCard` is not exported.

- [ ] **Step 3: Create ChoiceCard**

Create `src/components/ui/choice-card.tsx`:

```tsx
'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type ChoiceCardProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  Readonly<{
    children: ReactNode
    description?: string
    selected?: boolean
  }>

export function ChoiceCard({
  children,
  className,
  description,
  selected = false,
  type = 'button',
  ...props
}: ChoiceCardProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        'min-h-[var(--size-choice)] rounded-[var(--radius-card)] border p-4 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/12 text-foreground'
          : 'border-border bg-surface text-foreground',
        className,
      )}
      type={type}
      {...props}
    >
      <span className="block text-base font-semibold leading-tight">{children}</span>
      {description ? (
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">{description}</span>
      ) : null}
    </button>
  )
}
```

- [ ] **Step 4: Export ChoiceCard**

Modify `src/components/ui/index.ts`:

```ts
export { Badge } from './badge'
export { Button, IconButton } from './button'
export { Card } from './card'
export { Chip } from './chip'
export { ChoiceCard } from './choice-card'
export { InfoRow } from './info-row'
export { Input } from './input'
export { MetricCard } from './metric-card'
export { NumberStepper } from './number-stepper'
export { SegmentedControl } from './segmented-control'
export { StickyActionBar } from './sticky-action-bar'
export { Textarea } from './textarea'
```

- [ ] **Step 5: Run primitive test**

Run:

```powershell
pnpm test -- src/components/ui/primitives.test.tsx
```

Expected: pass.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src/components/ui
git commit -m "feat: add mobile choice card primitive"
```

---

## Task 6: Step Components

**Files:**
- Create: all `step-*.tsx` files in `src/features/interventions/add-flow/`

- [ ] **Step 1: Create Step What**

Create `src/features/interventions/add-flow/step-what.tsx`:

```tsx
'use client'

import { ChoiceCard, Input, Textarea } from '@/components/ui'
import type { AddInterventionAction } from './reducer'
import { INTERVENTION_TYPE_OPTIONS } from './options'
import type { AddInterventionState } from './types'

type StepWhatProps = {
  dispatch: (action: AddInterventionAction) => void
  state: AddInterventionState
}

export function StepWhat({ dispatch, state }: StepWhatProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {INTERVENTION_TYPE_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            onClick={() =>
              dispatch({
                type: 'selectType',
                interventionType: option.value,
                defaultTitle: option.defaultTitle,
              })
            }
            selected={state.what.type === option.value}
          >
            {option.label}
          </ChoiceCard>
        ))}
      </div>
      <Input
        label="Titre"
        onChange={(event) => dispatch({ type: 'setTitle', title: event.target.value })}
        placeholder="Ex: Demolition garage"
        value={state.what.title}
      />
      <Textarea
        label="Note"
        onChange={(event) => dispatch({ type: 'setNote', note: event.target.value })}
        placeholder="Detail utile, optionnel"
        value={state.what.note}
      />
    </section>
  )
}
```

- [ ] **Step 2: Create Step Where**

Create `src/features/interventions/add-flow/step-where.tsx`:

```tsx
'use client'

import type { Phase, Zone } from '@/lib/domain'
import { ChoiceCard } from '@/components/ui'
import type { AddInterventionAction } from './reducer'
import type { AddInterventionState } from './types'

type StepWhereProps = {
  dispatch: (action: AddInterventionAction) => void
  phases: Phase[]
  state: AddInterventionState
  zones: Zone[]
}

export function StepWhere({ dispatch, phases, state, zones }: StepWhereProps) {
  return (
    <section className="flex flex-col gap-5">
      <ChoiceCard
        description="Je completerai la zone ou la phase plus tard."
        onClick={() =>
          dispatch({ type: 'setLocationToDefine', value: !state.where.locationToDefine })
        }
        selected={state.where.locationToDefine}
      >
        A definir
      </ChoiceCard>
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Zone</h2>
        <div className="grid grid-cols-1 gap-2">
          {zones.map((zone) => (
            <ChoiceCard
              key={zone.id}
              onClick={() => {
                dispatch({ type: 'setLocationToDefine', value: false })
                dispatch({ type: 'setZone', zoneId: zone.id })
              }}
              selected={state.where.zoneId === zone.id && !state.where.locationToDefine}
            >
              {zone.name}
            </ChoiceCard>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Phase</h2>
        <div className="grid grid-cols-1 gap-2">
          {phases.map((phase) => (
            <ChoiceCard
              key={phase.id}
              onClick={() => {
                dispatch({ type: 'setLocationToDefine', value: false })
                dispatch({ type: 'setPhase', phaseId: phase.id })
              }}
              selected={state.where.phaseId === phase.id && !state.where.locationToDefine}
            >
              {phase.name}
            </ChoiceCard>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create Step Who**

Create `src/features/interventions/add-flow/step-who.tsx`:

```tsx
'use client'

import { ChoiceCard } from '@/components/ui'
import type { Person } from '@/lib/domain'
import type { AddInterventionAction } from './reducer'
import type { AddInterventionState } from './types'

type StepWhoProps = {
  dispatch: (action: AddInterventionAction) => void
  people: Person[]
  state: AddInterventionState
}

export function StepWho({ dispatch, people, state }: StepWhoProps) {
  return (
    <section className="flex flex-col gap-3">
      {people
        .filter((person) => person.active)
        .map((person) => (
          <ChoiceCard
            description={`${person.role ?? 'Equipe'} - ${person.defaultHourlyRate} EUR/h`}
            key={person.id}
            onClick={() => dispatch({ type: 'togglePerson', personId: person.id })}
            selected={state.who.personIds.includes(person.id)}
          >
            {person.name}
          </ChoiceCard>
        ))}
    </section>
  )
}
```

- [ ] **Step 4: Create Step When**

Create `src/features/interventions/add-flow/step-when.tsx`:

```tsx
'use client'

import { Button, Input, NumberStepper } from '@/components/ui'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type { Person } from '@/lib/domain'
import type { AddInterventionAction } from './reducer'
import { TIME_PRESETS } from './options'
import type { AddInterventionState } from './types'

type StepWhenProps = {
  dispatch: (action: AddInterventionAction) => void
  people: Person[]
  state: AddInterventionState
}

export function StepWhen({ dispatch, people, state }: StepWhenProps) {
  const durationMinutes = calculateWorkEntryDuration({
    startTime: state.when.startTime,
    endTime: state.when.endTime,
    breakMinutes: state.when.breakMinutes,
    days: state.when.days,
  })
  const selectedPeople = state.who.personIds.length
  const hourlyRate = people.find((person) => person.active)?.defaultHourlyRate ?? 45
  const amount = calculateWorkEntryAmount({ durationMinutes, hourlyRate }) * selectedPeople

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {TIME_PRESETS.map((preset) => (
          <Button
            key={preset.label}
            onClick={() => {
              dispatch({ type: 'setStartTime', startTime: preset.startTime })
              dispatch({ type: 'setEndTime', endTime: preset.endTime })
              dispatch({ type: 'setBreakMinutes', breakMinutes: preset.breakMinutes })
            }}
            size="compact"
            variant="secondary"
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <Input
        label="Date"
        onChange={(event) => dispatch({ type: 'setDate', date: event.target.value })}
        type="date"
        value={state.when.date}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Debut"
          onChange={(event) => dispatch({ type: 'setStartTime', startTime: event.target.value })}
          type="time"
          value={state.when.startTime}
        />
        <Input
          label="Fin"
          onChange={(event) => dispatch({ type: 'setEndTime', endTime: event.target.value })}
          type="time"
          value={state.when.endTime}
        />
      </div>
      <label className="grid gap-2 text-sm font-semibold text-foreground">
        <span>Pause minutes</span>
        <NumberStepper
          ariaLabel="Pause minutes"
          min={0}
          onChange={(breakMinutes) => dispatch({ type: 'setBreakMinutes', breakMinutes })}
          step={15}
          value={state.when.breakMinutes}
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-foreground">
        <span>Jours</span>
        <NumberStepper
          ariaLabel="Jours"
          min={1}
          onChange={(days) => dispatch({ type: 'setDays', days })}
          step={1}
          value={state.when.days}
        />
      </label>
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <p className="text-sm text-muted-foreground">Preview</p>
        <p className="mt-1 text-xl font-semibold">
          {(durationMinutes / 60).toFixed(1)}h - {amount.toFixed(2)} EUR
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create Step Status**

Create `src/features/interventions/add-flow/step-status.tsx`:

```tsx
'use client'

import { ChoiceCard } from '@/components/ui'
import type { AddInterventionAction } from './reducer'
import type { AddInterventionState, AddInterventionStatusState } from './types'

type StepStatusProps = {
  dispatch: (action: AddInterventionAction) => void
  state: AddInterventionState
}

const STATUS_OPTIONS: Array<{ label: string; description: string; value: AddInterventionStatusState }> = [
  {
    label: 'Inclus chantier',
    description: 'Travail compris dans le chantier de base.',
    value: { isExtra: false, billingStatus: 'not_billable', paymentStatus: 'not_applicable' },
  },
  {
    label: 'Supplement',
    description: 'A verifier ou facturer plus tard.',
    value: { isExtra: true, billingStatus: 'to_check', paymentStatus: 'not_applicable' },
  },
  {
    label: 'A verifier',
    description: 'Saisie terrain incomplete ou decision a confirmer.',
    value: { isExtra: 'to_check', billingStatus: 'to_check', paymentStatus: 'to_check' },
  },
  {
    label: 'A facturer',
    description: 'Element a reprendre dans le suivi financier.',
    value: { isExtra: true, billingStatus: 'to_invoice', paymentStatus: 'not_applicable' },
  },
  {
    label: 'Paye',
    description: 'Depense ou supplement deja paye.',
    value: { isExtra: true, billingStatus: 'paid', paymentStatus: 'paid' },
  },
]

export function StepStatus({ dispatch, state }: StepStatusProps) {
  return (
    <section className="flex flex-col gap-3">
      {STATUS_OPTIONS.map((option) => (
        <ChoiceCard
          description={option.description}
          key={option.label}
          onClick={() => dispatch({ type: 'setStatus', status: option.value })}
          selected={
            state.status.isExtra === option.value.isExtra &&
            state.status.billingStatus === option.value.billingStatus &&
            state.status.paymentStatus === option.value.paymentStatus
          }
        >
          {option.label}
        </ChoiceCard>
      ))}
    </section>
  )
}
```

- [ ] **Step 6: Create Step Summary**

Create `src/features/interventions/add-flow/step-summary.tsx`:

```tsx
'use client'

import { Badge, InfoRow } from '@/components/ui'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type { Person, Phase, Zone } from '@/lib/domain'
import type { AddInterventionState } from './types'
import { validateAddInterventionState } from './validation'

type StepSummaryProps = {
  people: Person[]
  phases: Phase[]
  state: AddInterventionState
  zones: Zone[]
}

export function StepSummary({ people, phases, state, zones }: StepSummaryProps) {
  const validation = validateAddInterventionState(state)
  const phase = phases.find((item) => item.id === state.where.phaseId)
  const zone = zones.find((item) => item.id === state.where.zoneId)
  const selectedPeople = people.filter((person) => state.who.personIds.includes(person.id))
  const durationMinutes = calculateWorkEntryDuration({
    startTime: state.when.startTime,
    endTime: state.when.endTime,
    breakMinutes: state.when.breakMinutes,
    days: state.when.days,
  })
  const hourlyRate = people.find((person) => person.active)?.defaultHourlyRate ?? 45
  const amount = calculateWorkEntryAmount({ durationMinutes, hourlyRate }) * selectedPeople.length

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Resume</p>
            <h2 className="mt-1 text-xl font-semibold">{state.what.title || 'Sans titre'}</h2>
          </div>
          {validation.shouldMarkToCheck ? <Badge tone="warning">A verifier</Badge> : null}
        </div>
      </div>
      <InfoRow label="Type" value={state.what.type ?? 'A definir'} />
      <InfoRow label="Zone" value={zone?.name ?? 'A verifier'} />
      <InfoRow label="Phase" value={phase?.name ?? 'A verifier'} />
      <InfoRow
        label="Equipe"
        value={selectedPeople.length > 0 ? selectedPeople.map((person) => person.name).join(', ') : 'A verifier'}
      />
      <InfoRow label="Date" value={state.when.date} />
      <InfoRow
        label="Heures"
        value={`${state.when.startTime} - ${state.when.endTime}, ${(durationMinutes / 60).toFixed(1)}h`}
      />
      <InfoRow label="Montant" value={`${amount.toFixed(2)} EUR`} />
      {validation.warningMessages.length > 0 ? (
        <div className="rounded-[var(--radius-card)] border border-warning bg-warning/10 p-4 text-sm">
          {validation.warningMessages.join(' ')}
        </div>
      ) : null}
    </section>
  )
}
```

- [ ] **Step 7: Run type-check**

Run:

```powershell
pnpm type-check
```

Expected: pass or expose exact prop mismatches in existing UI components. Fix mismatches by adapting props to current component APIs, not by weakening types.

- [ ] **Step 8: Commit**

Run:

```powershell
git add src/features/interventions/add-flow
git commit -m "feat: add intervention wizard steps"
```

---

## Task 7: Wizard Container And Routes

**Files:**
- Create: `src/features/interventions/add-flow/add-intervention-flow.tsx`
- Modify: `src/app/@modal/(.)interventions/new/page.tsx`
- Modify: `src/app/(screens)/interventions/new/page.tsx`

- [ ] **Step 1: Create wizard container**

Create `src/features/interventions/add-flow/add-intervention-flow.tsx`:

```tsx
'use client'

import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Dispatch } from 'react'
import { useReducer } from 'react'

import { Button, StickyActionBar } from '@/components/ui'
import { mockPeople, mockPhases, mockProject, mockZones } from '@/lib/mock'
import { mockClarusRepository } from '@/lib/repositories'
import { createDraftInputFromState } from './draft'
import { ADD_INTERVENTION_STEPS } from './options'
import {
  type AddInterventionAction,
  createInitialAddInterventionState,
  reduceAddInterventionState,
} from './reducer'
import { StepStatus } from './step-status'
import { StepSummary } from './step-summary'
import { StepWhat } from './step-what'
import { StepWhen } from './step-when'
import { StepWhere } from './step-where'
import { StepWho } from './step-who'
import type { AddInterventionState } from './types'
import { validateAddInterventionState } from './validation'

type AddInterventionFlowProps = {
  today: string
}

export function AddInterventionFlow({ today }: AddInterventionFlowProps) {
  const [state, dispatch] = useReducer(
    reduceAddInterventionState,
    { today },
    createInitialAddInterventionState,
  )
  const stepIndex = ADD_INTERVENTION_STEPS.findIndex((step) => step.id === state.currentStep)
  const validation = validateAddInterventionState(state)

  async function saveDraft() {
    dispatch({ type: 'setSaveState', saveState: 'saving' })

    try {
      await mockClarusRepository.createInterventionDraft(
        createDraftInputFromState({
          project: mockProject,
          people: mockPeople,
          state,
        }),
      )
      dispatch({ type: 'setSaveState', saveState: 'saved' })
    } catch (error) {
      dispatch({
        type: 'setSaveState',
        saveState: 'error',
        saveError: error instanceof Error ? error.message : 'Sauvegarde impossible.',
      })
    }
  }

  const goPrevious = () => {
    const previous = ADD_INTERVENTION_STEPS[Math.max(stepIndex - 1, 0)]
    if (previous) dispatch({ type: 'goToStep', step: previous.id })
  }

  const goNext = () => {
    const next = ADD_INTERVENTION_STEPS[Math.min(stepIndex + 1, ADD_INTERVENTION_STEPS.length - 1)]
    if (next) dispatch({ type: 'goToStep', step: next.id })
  }

  return (
    <div className="flex flex-1 flex-col gap-5 pb-24">
      <StepProgress currentIndex={stepIndex} />
      {renderStep({ dispatch, state })}
      {state.saveState === 'saved' ? (
        <p className="rounded-[var(--radius-card)] border border-success bg-success/10 p-4 text-sm">
          Intervention ajoutee au mock courant.
        </p>
      ) : null}
      {state.saveError ? (
        <p className="rounded-[var(--radius-card)] border border-danger bg-danger/10 p-4 text-sm">
          {state.saveError}
        </p>
      ) : null}
      <StickyActionBar
        secondaryAction={
          stepIndex > 0 ? (
            <Button leftIcon={<ChevronLeft className="size-4" />} onClick={goPrevious} variant="secondary">
              Retour
            </Button>
          ) : null
        }
        primaryAction={
          state.currentStep === 'summary' ? (
            <Button
              disabled={!validation.canSave || state.saveState === 'saving'}
              leftIcon={<Check className="size-4" />}
              onClick={saveDraft}
              fullWidth
            >
              Enregistrer
            </Button>
          ) : (
            <Button rightIcon={<ChevronRight className="size-4" />} onClick={goNext} fullWidth>
              Continuer
            </Button>
          )
        }
      />
    </div>
  )
}

function renderStep({
  dispatch,
  state,
}: {
  dispatch: Dispatch<AddInterventionAction>
  state: AddInterventionState
}) {
  switch (state.currentStep) {
    case 'what':
      return <StepWhat dispatch={dispatch} state={state} />
    case 'where':
      return <StepWhere dispatch={dispatch} phases={mockPhases} state={state} zones={mockZones} />
    case 'who':
      return <StepWho dispatch={dispatch} people={mockPeople} state={state} />
    case 'when':
      return <StepWhen dispatch={dispatch} people={mockPeople} state={state} />
    case 'status':
      return <StepStatus dispatch={dispatch} state={state} />
    case 'summary':
      return <StepSummary people={mockPeople} phases={mockPhases} state={state} zones={mockZones} />
  }
}

function StepProgress({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex gap-1" aria-label="Progression ajout intervention">
      {ADD_INTERVENTION_STEPS.map((step, index) => (
        <div
          className={index <= currentIndex ? 'h-1 flex-1 rounded-full bg-primary' : 'h-1 flex-1 rounded-full bg-border'}
          key={step.id}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Mount flow in modal route**

Modify `src/app/@modal/(.)interventions/new/page.tsx`:

```tsx
import { AddInterventionFlow } from '@/features/interventions/add-flow'
import { FullScreenSlideModal } from '../../_components/full-screen-slide-modal'
import { InterceptedRouteDialog } from '../../_components/intercepted-route-dialog'

export default function NewInterventionModalPage() {
  return (
    <InterceptedRouteDialog>
      <FullScreenSlideModal title="Ajouter intervention">
        <AddInterventionFlow today="2026-06-09" />
      </FullScreenSlideModal>
    </InterceptedRouteDialog>
  )
}
```

- [ ] **Step 3: Mount flow in fallback page**

Modify `src/app/(screens)/interventions/new/page.tsx`:

```tsx
import { AddInterventionFlow } from '@/features/interventions/add-flow'
import { FullScreenSlideModal } from '../../../@modal/_components/full-screen-slide-modal'

export default function NewInterventionPage() {
  return (
    <FullScreenSlideModal asPage headerMode="back" title="Ajouter intervention">
      <AddInterventionFlow today="2026-06-09" />
    </FullScreenSlideModal>
  )
}
```

- [ ] **Step 4: Run checks**

Run:

```powershell
pnpm lint
pnpm type-check
pnpm test
```

Expected: pass. If `today` should be dynamic, use `new Date().toISOString().slice(0, 10)` inside the server page, but keep tests deterministic in pure functions.

- [ ] **Step 5: Commit**

Run:

```powershell
git add src/app src/features/interventions/add-flow
git commit -m "feat: mount add intervention wizard"
```

---

## Task 8: Manual UX Pass And Fixes

**Files:**
- Modify only files touched by previous tasks.

- [ ] **Step 1: Start dev server**

Run:

```powershell
pnpm dev
```

Expected:

```txt
Local: http://localhost:3002
```

- [ ] **Step 2: Browser check intercepted modal**

Open:

```txt
http://localhost:3002/journal
```

Click `Ajouter` or navigate to:

```txt
http://localhost:3002/interventions/new
```

Verify:

- modal/page opens on mobile width;
- progress bar visible;
- `Quoi` choices fit without horizontal text overflow;
- `Continuer` is reachable above safe-area;
- `Retour` works after first step;
- `Enregistrer` is disabled or error-protected when critical data is missing;
- incomplete zone/person data saves as `A verifier`.

- [ ] **Step 3: Fix visual issues**

Common allowed fixes:

```tsx
className="grid grid-cols-1 gap-2 sm:grid-cols-2"
```

for long labels, and:

```tsx
className="pb-28"
```

on scroll containers where the sticky action bar covers content.

- [ ] **Step 4: Run final local checks**

Run:

```powershell
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

Expected: all pass.

- [ ] **Step 5: Commit**

Run:

```powershell
git add src
git commit -m "fix: polish add intervention mobile flow"
```

---

## Task 9: GitHub Issue Updates

**Files:**
- No local file edits.

- [ ] **Step 1: Close implemented issues**

Close only after browser verification and passing checks:

```powershell
gh issue close 2 --repo krynskibartosz/clarus --comment "Implemente dans le flow Ajouter intervention."
gh issue close 3 --repo krynskibartosz/clarus --comment "Implemente dans le flow Ajouter intervention."
gh issue close 4 --repo krynskibartosz/clarus --comment "Implemente dans le flow Ajouter intervention."
gh issue close 5 --repo krynskibartosz/clarus --comment "Implemente dans le flow Ajouter intervention."
gh issue close 6 --repo krynskibartosz/clarus --comment "Implemente dans le flow Ajouter intervention."
gh issue close 7 --repo krynskibartosz/clarus --comment "Implemente dans le flow Ajouter intervention."
gh issue close 8 --repo krynskibartosz/clarus --comment "Implemente dans le flow Ajouter intervention."
```

- [ ] **Step 2: Keep verification issues open**

Leave these open until a separate QA pass:

```txt
#1  Etats empty loading demo
#9  Verification mobile screenshots
#10 Accessibility pass V0
#11 Review finale documentation vs implementation
```

- [ ] **Step 3: Push branch**

Run:

```powershell
git status -sb
git push -u origin codex/phase-2-add-intervention
```

Expected: branch pushed.

---

## Self-Review

Spec coverage:

- Issue #2 Step Quoi: Task 6 Step 1.
- Issue #3 Step Ou: Task 6 Step 2.
- Issue #4 Step Qui: Task 6 Step 3.
- Issue #5 Step Quand: Task 6 Step 4.
- Issue #6 Step Statut: Task 6 Step 5.
- Issue #7 Resume et sauvegarde: Tasks 3, 4, 6 Step 6, and 7.
- Issue #8 Validation progressive `to_check`: Task 3 and Task 9.

Ambiguity resolved:

- V0 uses synchronous mock reference data in the client wizard and keeps repository usage for save behavior.
- Mock persistence is per repository instance. Cross-page persistence is not required for Phase 2 unless the app introduces a shared client store later.
- Supabase, auth, offline, invoices, TVA, and multi-chantier remain out of scope.

Final verification:

```powershell
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

Expected: all pass before closing GitHub issues #2 to #8.
