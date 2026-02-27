# Security Actions Required

Repository tokens were removed from tracked configuration files.

## Manual Actions (Owner Required)
1. Rotate/revoke all previously exposed Supabase tokens.
2. Update local environment variables:
   - `SUPABASE_ACCESS_TOKEN`
3. Re-authenticate local MCP/CLI tools with the new token.

## Verification
- Run `.github/workflows/security-audit.yml` in CI.
- Confirm no token-like values appear in tracked files.
