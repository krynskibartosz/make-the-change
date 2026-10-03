#!/usr/bin/env bash
# Applique la protection de main decrite dans
# docs/infrastructure-multi-agent.md §4 : reglages de fusion du depot
# (PATCH, disponible sans GitHub Pro) puis ruleset `main-protegee`
# (POST/PUT, exige Pro sur un depot prive).
#
# Idempotent : relisable sans effet de bord — la recherche du ruleset par
# nom decide entre creation et mise a jour.
#
# Usage : proteger-main.sh <owner/repo> [--dry-run]
#
# CHECKS_REQUIS (defaut "Verdict") : noms des required status checks,
# separes par des virgules — Make-the-Change utilise
# `Secret Scan,lint-terms` puisque son gate n'a pas de job `Verdict`.
set -euo pipefail

DEPOT="${1:?usage : proteger-main.sh <owner/repo> [--dry-run]}"
DRY_RUN="${2:-}"
CHECKS_REQUIS="${CHECKS_REQUIS:-Verdict}"
# GitHub Actions, emetteur des checks du Gate.
INTEGRATION_ID=15368

command -v gh >/dev/null 2>&1 || { echo "gh est requis." >&2; exit 1; }

# Les checks requis sont construits en JSON plutot que concatene a la main :
# un nom avec une virgule ou une quote ne doit pas casser le document.
checks_json="$(CHECKS_REQUIS="$CHECKS_REQUIS" INTEGRATION_ID="$INTEGRATION_ID" node -e '
const noms = process.env.CHECKS_REQUIS.split(",").map((s) => s.trim()).filter(Boolean);
process.stdout.write(JSON.stringify(
  noms.map((context) => ({ context, integration_id: Number(process.env.INTEGRATION_ID) }))
));')"

REGLAGES='{"allow_auto_merge":true,"delete_branch_on_merge":true,"allow_squash_merge":true,"squash_merge_commit_title":"PR_TITLE","squash_merge_commit_message":"PR_BODY","allow_merge_commit":false,"allow_rebase_merge":false,"allow_update_branch":true}'

RULESET="$(CHECKS_JSON="$checks_json" node -e '
const checks = JSON.parse(process.env.CHECKS_JSON);
process.stdout.write(JSON.stringify({
  name: "main-protegee",
  target: "branch",
  enforcement: "active",
  conditions: { ref_name: { include: ["~DEFAULT_BRANCH"], exclude: [] } },
  bypass_actors: [],
  rules: [
    { type: "deletion" },
    { type: "non_fast_forward" },
    { type: "pull_request", parameters: {
      required_approving_review_count: 0,
      dismiss_stale_reviews_on_push: false,
      require_code_owner_review: false,
      require_last_push_approval: false,
      required_review_thread_resolution: false,
      allowed_merge_methods: ["squash"],
    } },
    { type: "required_status_checks", parameters: {
      strict_required_status_checks_policy: false,
      do_not_enforce_on_create: false,
      required_status_checks: checks,
    } },
  ],
}));')"

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "PATCH repos/$DEPOT :"
  echo "$REGLAGES" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.stringify(JSON.parse(s),null,2)))'
  echo "Ruleset main-protegee (POST ou PUT selon existence) :"
  echo "$RULESET" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.stringify(JSON.parse(s),null,2)))'
  exit 0
fi

# (a) Reglages du depot : disponibles sans Pro, poses en premier.
gh api -X PATCH "repos/$DEPOT" --input - <<<"$REGLAGES" >/dev/null
echo "Reglages de fusion appliques sur $DEPOT (squash only, auto-merge, suppression de branche)."

# (b) Les rulesets exigent GitHub Pro sur un depot prive : un 403 qui le
# dit n'est pas un echec, c'est l'etat documente WAITING_FOR_GITHUB_PRO.
reponse="$(gh api "repos/$DEPOT/rulesets" 2>&1)" || {
  if printf '%s' "$reponse" | grep -qi 'GitHub Pro'; then
    echo "WAITING_FOR_GITHUB_PRO : les rulesets repondent 403 (depot prive, plan gratuit)."
    echo "Les reglages de fusion sont deja appliques ; relancer ce script apres activation de Pro."
    exit 0
  fi
  printf '%s\n' "$reponse" >&2
  exit 1
}

# (c) Creation ou mise a jour du ruleset par son nom.
id="$(printf '%s' "$reponse" | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
  const liste=JSON.parse(s);
  const r=liste.find((x)=>x.name==="main-protegee");
  if(r) process.stdout.write(String(r.id));
});')"

if [ -n "$id" ]; then
  gh api -X PUT "repos/$DEPOT/rulesets/$id" --input - <<<"$RULESET" >/dev/null
  echo "Ruleset main-protegee mis a jour (id $id)."
else
  gh api -X POST "repos/$DEPOT/rulesets" --input - <<<"$RULESET" >/dev/null
  echo "Ruleset main-protegee cree."
fi
