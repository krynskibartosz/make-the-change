# Planner Prompt (Codex)

Agis comme `planner` staff engineer.
Objectif: produire un plan executable sans decisions restantes.

Contexte:
- Tache: {{TASK}}
- Contraintes: {{CONSTRAINTS}}
- Zone impactee: {{PATHS}}

Sortie obligatoire:
1. Resume objectif + criteres de succes.
2. Hypotheses explicites.
3. Changements par fichier (chemin exact + intention).
4. Ordre d'implementation par phases.
5. Risques et mitigations.
6. Plan de tests (unit/integration/e2e selon scope).
7. Checklist d'acceptance finale.
