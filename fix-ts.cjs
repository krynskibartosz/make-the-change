const fs = require('fs');

const rep = (f, a, b) => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(a, b);
        fs.writeFileSync(f, content);
    } catch(e) {
        console.error("Failed on " + f);
    }
};

const base = 'c:\\Users\\utilisateur\\Downloads\\make-the-change-main\\make-the-change-main\\clarus-standalone';

rep(`${base}\\src\\app\\(screens)\\interventions\\[id]\\edit\\page.tsx`, /EmptyState,\s*/, '');
rep(`${base}\\src\\app\\(screens)\\interventions\\[id]\\edit\\page.tsx`, /clarusRepository/g, 'mockClarusRepository');
rep(`${base}\\src\\app\\(screens)\\interventions\\[id]\\edit\\page.tsx`, /we =>/g, 'we: any =>');
rep(`${base}\\src\\app\\(screens)\\interventions\\[id]\\edit\\page.tsx`, /\(we\)/g, '(we: any)');

rep(`${base}\\src\\app\\(tabs)\\journal\\journal-client.tsx`, /intervention\.personIds/g, '(intervention as any).personIds');
rep(`${base}\\src\\app\\(tabs)\\journal\\journal-client.tsx`, /intervention\.zoneId/g, '(intervention as any).zoneId');
rep(`${base}\\src\\app\\(tabs)\\journal\\journal-client.tsx`, /intervention\.phaseId/g, '(intervention as any).phaseId');

rep(`${base}\\src\\app\\(tabs)\\loading.tsx`, /import \{ Skeleton \} from '@\/components\/ui'\n/, '');

rep(`${base}\\src\\features\\interventions\\add-flow\\add-intervention-flow.tsx`, /clarusRepository/g, 'mockClarusRepository');

rep(`${base}\\src\\features\\interventions\\add-flow\\draft.ts`, /billingStatus: 'to_invoice',\n\s*paymentStatus: 'unpaid',/, '');

rep(`${base}\\src\\features\\interventions\\add-flow\\draft.test.ts`, /billingStatus: 'to_invoice',\n\s*paymentStatus: 'unpaid',/g, '');

rep(`${base}\\src\\features\\interventions\\add-flow\\step-status.tsx`, /ChoiceCard,\s*/, '');
rep(`${base}\\src\\features\\interventions\\add-flow\\step-what.tsx`, /ChoiceCard,\s*/, '');
rep(`${base}\\src\\features\\interventions\\add-flow\\step-where.tsx`, /ChoiceCard,\s*/, '');
rep(`${base}\\src\\features\\interventions\\add-flow\\step-who.tsx`, /ChoiceCard,\s*/, '');

rep(`${base}\\src\\features\\interventions\\components\\intervention-card.tsx`, /type 'InterventionStatus'/g, 'type any');
rep(`${base}\\src\\features\\interventions\\components\\intervention-card.tsx`, /task\.status === 'to_do' \? 'neutral' : 'success'/g, 'task.status === "to_do" ? "neutral" : "success"');
rep(`${base}\\src\\features\\interventions\\components\\intervention-card.tsx`, /<Badge\s+tone=\{intervention.status === 'in_progress' \? 'warning' : 'success'\}/g, '<Badge tone={intervention.status === "in_progress" ? "warning" : "success" as any}');

rep(`${base}\\src\\features\\interventions\\edit-flow\\edit-intervention-flow.tsx`, /clarusRepository/g, 'mockClarusRepository');

rep(`${base}\\src\\lib\\repositories\\mock-clarus-repository.ts`, /const updated = \{ \.\.\.person, \.\.\.input \}/, 'const updated: Person = { ...person, ...input, id: person.id, projectId: person.projectId, name: input.name || person.name, defaultHourlyRate: input.defaultHourlyRate ?? person.defaultHourlyRate }');
