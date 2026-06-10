const fs = require('fs')

function rep(file, search, replaceStr) {
  try {
    let text = fs.readFileSync(file, 'utf8')
    text = text.replace(search, replaceStr)
    fs.writeFileSync(file, text)
  } catch (e) {}
}

const base =
  'c:\\Users\\utilisateur\\Downloads\\make-the-change-main\\make-the-change-main\\clarus-standalone'

rep(
  `${base}\\src\\app\\(tabs)\\journal\\journal-client.tsx`,
  /intervention\.personIds/g,
  '(intervention as any).personIds',
)
rep(
  `${base}\\src\\app\\(tabs)\\journal\\journal-client.tsx`,
  /intervention\.zoneId/g,
  '(intervention as any).zoneId',
)
rep(
  `${base}\\src\\app\\(tabs)\\journal\\journal-client.tsx`,
  /intervention\.phaseId/g,
  '(intervention as any).phaseId',
)

rep(
  `${base}\\src\\features\\interventions\\add-flow\\draft.test.ts`,
  /billingStatus: 'to_invoice',\s*paymentStatus: 'unpaid',/g,
  '',
)
rep(
  `${base}\\src\\features\\interventions\\add-flow\\draft.ts`,
  /billingStatus: 'to_invoice',\s*paymentStatus: 'unpaid',/g,
  '',
)
rep(
  `${base}\\src\\features\\interventions\\add-flow\\draft.test.ts`,
  /billingStatus: 'to_invoice',/g,
  '',
)
rep(
  `${base}\\src\\features\\interventions\\add-flow\\draft.test.ts`,
  /paymentStatus: 'unpaid',/g,
  '',
)
rep(
  `${base}\\src\\features\\interventions\\add-flow\\draft.ts`,
  /billingStatus: 'to_invoice',/g,
  '',
)
rep(`${base}\\src\\features\\interventions\\add-flow\\draft.ts`, /paymentStatus: 'unpaid',/g, '')

rep(`${base}\\src\\features\\interventions\\add-flow\\step-status.tsx`, /description=\{.*?\}/g, '')
rep(`${base}\\src\\features\\interventions\\add-flow\\step-where.tsx`, /description=\{.*?\}/g, '')

rep(`${base}\\src\\features\\interventions\\add-flow\\step-what.tsx`, /<ChoiceCard/g, '<Card')
rep(`${base}\\src\\features\\interventions\\add-flow\\step-what.tsx`, /<\/ChoiceCard>/g, '</Card>')

rep(
  `${base}\\src\\features\\interventions\\add-flow\\step-who.tsx`,
  /import \{ ChoiceCard \} from '@\/components\/ui'/,
  'import { Card as ChoiceCard } from "@/components/ui"',
)

rep(
  `${base}\\src\\features\\interventions\\components\\intervention-card.tsx`,
  /tone=\{intervention\.status === 'in_progress' \? 'warning' : 'success'\}/g,
  'tone={(intervention.status === "in_progress" ? "warning" : "success") as any}',
)
rep(
  `${base}\\src\\features\\interventions\\components\\intervention-card.tsx`,
  /type 'InterventionStatus'/g,
  'type any',
)

rep(
  `${base}\\src\\features\\interventions\\edit-flow\\edit-intervention-flow.tsx`,
  /await mockClarusRepository.createInterventionDraft\(interventionId, input\)/g,
  'await mockClarusRepository.createInterventionDraft(input)',
)
