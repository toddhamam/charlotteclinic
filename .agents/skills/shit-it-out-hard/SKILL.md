---
name: shit-it-out-hard
description: Finish the current repository work end to end by reviewing every change, updating relevant Markdown documentation, committing all changes, pushing the branch, and opening a GitHub pull request. Use when the user says "shit it out hard", invokes `$shit-it-out-hard`, or asks Codex to wrap up, document, commit, push, and create a PR in one autonomous workflow.
---

# Shit It Out Hard

Complete the repository's current work as a single autonomous handoff. Treat explicit invocation as authorization to update documentation, stage all current changes, commit, push, and create the pull request. Request approval only when required by the execution environment or when credentials, conflicts, or an ambiguous destructive operation genuinely block progress.

## Workflow

1. Confirm the working directory is inside a Git repository. Inspect `git status`, the current branch, remotes, and the complete diff, including staged and untracked files. Preserve every user change.
2. Check whether the current branch already has a merged pull request. Prefer `gh pr list --state merged --head <branch>`. Use relevant Vercel CLI context only when it materially helps establish branch or deployment state.
3. If the current branch already has a merged pull request, create and switch to a fresh, descriptive branch before making the documentation update. Do not stack new work on a branch whose PR is merged.
4. Understand and summarize all current changes. Never discard, reset, or rewrite unrelated user work.
5. Update the Markdown documentation relevant to the changes:
   - Prefer `CHANGELOG.md` when it exists and is actively maintained.
   - Otherwise update the most relevant existing Markdown document, usually `README.md`.
   - Keep the entry concise, accurate, and consistent with the document's existing structure and tone.
   - Describe what changed, what was added, and what was fixed. Do not invent behavior or claims.
6. Run a proportionate verification command when the repository exposes a clear, reasonably scoped test, lint, typecheck, or build command. Report any pre-existing or unresolved failure; do not silently omit it.
7. Reinspect `git status` and the final diff. Stage all changes with `git add -A`, including the documentation update and pre-existing user changes.
8. Create one descriptive commit based on the actual diff. Do not amend or rewrite existing commits unless the user explicitly asks.
9. Push the current branch to its configured remote, setting upstream when needed.
10. Create a pull request with `gh pr create`. Write a clear title and a body that contains:
    - a concise summary of the full change set;
    - the verification performed and its result.
11. Return the branch name, commit hash and subject, pull-request URL, documentation updated, and verification result.

## Guardrails

- Include all current changes because this workflow explicitly means "commit all changes." If secrets, credential files, generated bulk artifacts, merge conflicts, or another clearly dangerous inclusion is detected, stop before staging and explain the blocker.
- Do not create an empty commit or an empty pull request.
- Do not force-push.
- Do not merge the pull request unless the user explicitly asks.
- If authentication or remote access fails, preserve the local commit and report the exact remaining command or action.
