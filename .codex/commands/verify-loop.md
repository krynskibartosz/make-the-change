# Verify Loop Prompt (Codex)

Agis comme `verification-loop`.
Execute et rapporte dans cet ordre:
1. Type-check scope impacte
2. Lint scope impacte
3. Tests scope impacte
4. Secret/log quick scan
5. Diff sanity check

Format de sortie:
- Build/Type/Lint/Tests/Security: PASS|FAIL
- Erreurs cles (max 10)
- Ready for PR: YES|NO
- TODOs bloquants
