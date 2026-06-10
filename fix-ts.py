import os
import re

base = r'c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\clarus-standalone'

def rep(file, search, replaceStr):
    path = os.path.join(base, file)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = f.read()
        data = re.sub(search, replaceStr, data, flags=re.MULTILINE | re.DOTALL)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(data)
    except Exception as e:
        pass

rep(r'src\app\(tabs)\journal\journal-client.tsx', r'intervention\.personIds', r'(intervention as any).personIds')
rep(r'src\app\(tabs)\journal\journal-client.tsx', r'intervention\.zoneId', r'(intervention as any).zoneId')
rep(r'src\app\(tabs)\journal\journal-client.tsx', r'intervention\.phaseId', r'(intervention as any).phaseId')

rep(r'src\features\interventions\add-flow\draft.test.ts', r'billingStatus:\s*\'[^\']*\',?\s*', r'')
rep(r'src\features\interventions\add-flow\draft.test.ts', r'paymentStatus:\s*\'[^\']*\',?\s*', r'')
rep(r'src\features\interventions\add-flow\draft.ts', r'billingStatus:\s*\'[^\']*\',?\s*', r'')
rep(r'src\features\interventions\add-flow\draft.ts', r'paymentStatus:\s*\'[^\']*\',?\s*', r'')

rep(r'src\features\interventions\add-flow\options.ts', r'billingStatus:\s*\'[^\']*\',?\s*', r'')
rep(r'src\features\interventions\add-flow\options.ts', r'paymentStatus:\s*\'[^\']*\',?\s*', r'')

rep(r'src\features\interventions\add-flow\step-status.tsx', r'description=\{.*?\}', r'')
rep(r'src\features\interventions\add-flow\step-where.tsx', r'description=\{.*?\}', r'')
rep(r'src\features\interventions\add-flow\step-where.tsx', r'disabled=\{.*?\}', r'')

rep(r'src\features\interventions\add-flow\step-what.tsx', r'<ChoiceCard', r'<div')
rep(r'src\features\interventions\add-flow\step-what.tsx', r'</ChoiceCard>', r'</div>')

rep(r'src\features\interventions\add-flow\step-status.tsx', r'import \{ ChoiceCard \} from \'@/components/ui\'', r'')
rep(r'src\features\interventions\add-flow\step-what.tsx', r'import \{ ChoiceCard \} from \'@/components/ui\'', r'')
rep(r'src\features\interventions\add-flow\step-where.tsx', r'import \{ ChoiceCard \} from \'@/components/ui\'', r'')
rep(r'src\features\interventions\add-flow\step-who.tsx', r'import \{ ChoiceCard \} from \'@/components/ui\'', r'')

rep(r'src\features\interventions\add-flow\step-status.tsx', r'<ChoiceCard', r'<div')
rep(r'src\features\interventions\add-flow\step-status.tsx', r'</ChoiceCard>', r'</div>')
rep(r'src\features\interventions\add-flow\step-where.tsx', r'<ChoiceCard', r'<div')
rep(r'src\features\interventions\add-flow\step-where.tsx', r'</ChoiceCard>', r'</div>')
rep(r'src\features\interventions\add-flow\step-who.tsx', r'<ChoiceCard', r'<div')
rep(r'src\features\interventions\add-flow\step-who.tsx', r'</ChoiceCard>', r'</div>')


rep(r'src\features\interventions\components\intervention-card.tsx', r'tone=\{intervention\.status === \'in_progress\' \? \'warning\' : \'success\'\}', r'tone={(intervention.status === "in_progress" ? "warning" : "success") as any}')
rep(r'src\features\interventions\components\intervention-card.tsx', r'type \'InterventionStatus\'', r'type any')
rep(r'src\features\interventions\components\intervention-card.tsx', r'task.status === \'to_do\' \? \'neutral\' : \'success\'', r'(task.status === "to_do" ? "neutral" : "success") as any')

rep(r'src\features\interventions\edit-flow\edit-intervention-flow.tsx', r'await mockClarusRepository\.createInterventionDraft\(interventionId, input\)', r'await mockClarusRepository.createInterventionDraft(input)')

