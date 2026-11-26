# CampusBook release governance

## Why this exists
CampusBook is a teaching app, not a production-ready authentication or persistence service. A green CI run is necessary but insufficient for release; tests with `test.skip` / `test.todo` are not passing evidence.

## Branch controls (configure in GitHub Settings → Rules → Rulesets)
Rulesets are **not configured by committing this file**. The repository owner must activate the rules and verify them with a test PR.

**Team integration ruleset** — branch target `team-*` (matches actual `team-a-discovery`, `team-b-booking`, `team-c-cancellation`, `team-d-reservations`): require pull request; 1 human approval; required checks `quality`, `dependency-audit`, `unit-coverage`, `codeql` once each has run; resolve conversations; dismiss stale reviews; no force-push/delete; do not allow bypass. Team PR checks must first be visible before marking mandatory.

**Develop ruleset** — target `develop`: require pull request; 1 human approval, resolve conversations, dismiss stale approvals, required CI checks as above, no direct push or force-push, no bypass. In a personal repo, CODEOWNERS on `develop` reviews sensitive governance files; ordinary story PRs can use cross-team student reviewers.

**Main ruleset** — target `main`: require pull request and instructor approval (GitHub must enforce with a CODEOWNERS entry on **main**, for instance `* @marah222`); required CI and release evidence gate; no direct push or force-push; prevent deletion and avoid bypass. The existing workflow rejects a PR to main unless the source branch is develop. A separate main CODEOWNERS bootstrap PR is needed for the instructor to be a mandatory code-owner reviewer across all release changes.

Choose `Require status checks to pass` and select the published GitHub Actions check names, including `quality`, `dependency-audit`, `unit-coverage`, `codeql`. For a personal public repo, confirm available options; GitHub app used for this commit cannot create or edit rulesets.

**Reviewers:** a student cannot satisfy their own required approval. In a small 11-student workshop, human-first review is expected; AI review is only a second opinion, never a substitute for a human GitHub approval.

## Policy by stage

- Student → team: requirement and test link, focused unit and API assertions as appropriate, 1 peer approval, passing checks.
- Team → develop: 1 different human reviewer, passing integrated unit/CI/security/coverage checks, no unreviewed business rule changes.
- Develop → main: instructor-approved, all 11 API story cases and 4 feature browser cases executable (no skipped placeholders), coverage and security checks green, documented known risks and signed release evidence. Release should **not** go ahead merely because the basic CI is green.

## Coverage policy
Initial automated gate: domain unit coverage ≥85% lines, ≥80% statements and functions, ≥75% branches. These are **initial guardrails**, not evidence of exhaustive testing and not a grading measure. Review the coverage report; raise thresholds once the team adds meaningful scenarios. Fail if the coverage provider cannot run. The CI installs the matching Vitest coverage provider; for a durable lockfile, add a pinned matching provider to the repo's dev dependencies in a follow-up reviewed dependency update.

## Security and code ownership
- `npm audit --audit-level=high` blocks known high/critical package vulnerabilities. Moderate findings are recorded and reviewed rather than force-updated blindly.
- CodeQL JavaScript/TypeScript scans source for supported static security issues. This is not a security certification.
- Owner review on critical workflow/governance files is requested through CODEOWNERS.
- Demo `x-demo-user` identity and in-memory store are **not production authentication**. A release approval is for the workshop's educational demonstration, not deployment with real student accounts.

## Release procedure
1. Open PR `develop → main`.
2. Implement/verify 11 API story tests and 4 browser feature tests. S08 must be exercised at API level even though the UI prevents a second click.
3. Complete the release board and add `workshop/release-evidence.json` to the release PR with the real instructor and actual CI run link; never fabricate evidence.
4. Confirm required checks, human approval, code-owner approval, security findings, and unresolved comments.
5. Conduct a Go / No-Go discussion, then merge only after evidence and approvals satisfy the main ruleset.

## AI engineering accountability
AI can help generate tests, refactor, debug and review. PRs must disclose AI use, what was accepted/rejected, what was verified independently, and known limitations. The author remains responsible for assertions and requirements. AI approval does not count as required human approval.
