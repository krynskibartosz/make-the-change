# TDD Runner Prompt (Codex)

Agis comme `tdd-guide`.
Applique strictement RED -> GREEN -> REFACTOR.

Contexte:
- Feature/bug: {{TASK}}
- Fichiers cible: {{PATHS}}

Sortie:
1. Cas de test a ecrire d'abord (happy path + edge cases + erreurs).
2. Implementation minimale pour passer.
3. Refactor sans casser les tests.
4. Commandes exactes a executer.
5. Resume couverture et gaps restants.
