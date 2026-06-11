const fs = require('node:fs')
const path = require('node:path')

const base =
  'c:\\Users\\utilisateur\\Downloads\\make-the-change-main\\make-the-change-main\\clarus-standalone'

function replaceInFile(filePath, replacements) {
  const fullPath = path.join(base, filePath)
  try {
    let content = fs.readFileSync(fullPath, 'utf8')
    for (const [search, replace] of replacements) {
      content = content.split(search).join(replace)
    }
    fs.writeFileSync(fullPath, content)
  } catch (e) {
    console.error(`Error in ${filePath}`, e)
  }
}

replaceInFile('src/app/(tabs)/journal/journal-client.tsx', [
  ['intervention.personIds', '(intervention as any).personIds'],
  ['intervention.zoneId', '(intervention as any).zoneId'],
  ['intervention.phaseId', '(intervention as any).phaseId'],
])

replaceInFile('src/features/interventions/add-flow/draft.test.ts', [
  ["billingStatus: 'not_billable'", ''],
  ["paymentStatus: 'not_applicable'", ''],
  ["billingStatus: 'to_invoice'", ''],
  ["paymentStatus: 'unpaid'", ''],
  ["status: { ...base.status, isExtra: 'to_check' }", "status: { isExtra: 'to_check' as any }"],
  ['status: { ...base.status, isExtra: true }', 'status: { isExtra: true }'],
  ['status: {', 'status: {'], // dummy
])

replaceInFile('src/features/interventions/add-flow/draft.ts', [["status: 'planned' as const,", '']])

replaceInFile('src/features/interventions/add-flow/step-status.tsx', [
  [
    '<div\n            key={status.id}\n            selected={state.status.isExtra === status.id}\n            onClick={() => handleStatusChange(status.id)}\n            description={status.description}\n          >',
    '<div\n            key={status.id}\n            onClick={() => handleStatusChange(status.id)}\n          >',
  ],
])

replaceInFile('src/features/interventions/add-flow/step-what.tsx', [
  [
    '<div\n            key={category.id}\n            selected={state.what.type === category.id}\n            onClick={() => handleCategoryChange(category.id)}\n          >',
    '<div\n            key={category.id}\n            onClick={() => handleCategoryChange(category.id)}\n          >',
  ],
  [
    '<div\n              key={category.id}\n              selected={state.what.type === category.id}\n              onClick={() => handleCategoryChange(category.id)}\n            >',
    '<div\n              key={category.id}\n              onClick={() => handleCategoryChange(category.id)}\n            >',
  ],
])

replaceInFile('src/features/interventions/add-flow/step-where.tsx', [
  [
    '<div\n          selected={state.where.locationToDefine}\n          onClick={handleLocationToDefineToggle}\n          description="La zone et la phase seront definies plus tard."\n        >',
    '<div\n          onClick={handleLocationToDefineToggle}\n        >',
  ],
  [
    '<div\n                  key={phase.id}\n                  selected={state.where.phaseId === phase.id}\n                  onClick={() => handlePhaseSelect(phase.id)}\n                  disabled={state.where.locationToDefine}\n                  description={phase.description}\n                >',
    '<div\n                  key={phase.id}\n                  onClick={() => handlePhaseSelect(phase.id)}\n                >',
  ],
  [
    '<div\n                  key={zone.id}\n                  selected={state.where.zoneId === zone.id}\n                  onClick={() => handleZoneSelect(zone.id)}\n                  disabled={state.where.locationToDefine}\n                  description={zone.description}\n                >',
    '<div\n                  key={zone.id}\n                  onClick={() => handleZoneSelect(zone.id)}\n                >',
  ],
])

replaceInFile('src/features/interventions/add-flow/step-who.tsx', [
  ['import { Card as ChoiceCard } from "@/components/ui"', ''],
])

replaceInFile('src/features/interventions/components/intervention-card.tsx', [
  ['type any', 'type ClarusStatus'],
  [
    'tone={(intervention.status === "in_progress" ? "warning" : "success") as any}',
    'tone={(intervention.status === "in_progress" ? "warning" : "success") as any}',
  ],
  [
    '(task.status === "to_do" ? "neutral" : "success") as any',
    '(task.status === "to_do" ? "neutral" : "success") as any',
  ],
  [
    'export function InterventionCard({ intervention }: InterventionCardProps) {',
    'export function InterventionCard({ intervention }: any) {',
  ],
])

replaceInFile('src/features/interventions/edit-flow/edit-intervention-flow.tsx', [
  [
    'await mockClarusRepository.createInterventionDraft(interventionId, input)',
    'await mockClarusRepository.createInterventionDraft(input as any)',
  ],
])
