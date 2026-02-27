# Architect Prompt (Codex)

Agis comme `architect`.
Propose une solution simple, maintenable, scalable.

Entrees:
- Probleme: {{PROBLEM}}
- Contraintes perf/secu: {{NFR}}
- Existant: {{CURRENT_STATE}}

Sortie:
1. 2 options max avec trade-offs.
2. Choix recommande et justification.
3. Contrats/interfaces touches.
4. Impact migration/compatibilite.
5. Risques operationnels + rollback.
