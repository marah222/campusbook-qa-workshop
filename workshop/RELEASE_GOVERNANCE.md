# CampusBook release governance

## Why this exists
CampusBook is a teaching app, not a production-ready authentication or persistence service. A green CI run is necessary but insufficient for release; tests with `test.skip` / `test.todo` are not passing evidence.

## Branch controls (configure in GitHub Settings → Rules → Rulesets)
Rulesets are **not activated by committing this file**. The repository owner must configure them and test enforcement.

### Owner exception: no human review required on owner PRs
The owner (`@marah222`) is allowed to merge **their own PRs without another person's approval**. Student PRs still require one independent human approval. Do not ask an owner to approve their own PR; GitHub does not count self-approval.

Use **two distinct overlapping rulesets** so the exception is restricted to review requirements rather than all governance:

1. **Review ruleset (Admin bypass, pull requests only)** — targets `team-*`, `develop`, and `main`. Require a pull request, one approving review, dismissal of stale approvals, and Code Owner review for owned paths. Under **Bypass list**, add the **Repository admin** role and choose **For pull requests only**, not **Always allow**. The owner can open a PR and bypass this review ruleset to merge it without a reviewer. Students without admin privileges remain subject to reviews.
2. **CI and branch integrity ruleset (no bypass)** — targets the same branches. Require a pull request, passing checks (`quality`, `unit-coverage`, `dependency-audit`, `codeql`) and resolved review conversations, and block force pushes and branch deletions. **Do not add administrators to this ruleset's bypass list**. This second layer is meant to keep CI requirements in force for the owner as well as students.

GitHub supports multiple rulesets targeting the same branch and each ruleset has its own bypass list. **Test this exact split with an owner-authored PR before relying on it**; other legacy branch-protection rules or inherited organization rules could still block a merge. Do not configure a blanket Admin bypass in a single combined security + review ruleset, or the owner may be able to override CI as well.

**Scope by branch**:
- `team-*`: story → team integration, student peer review and four required checks.
- `develop`: team → integration, another human review for student authors and all required checks.
- `main`: `develop → main` only (the workflow enforces source), all required checks plus executable API/UI story scenarios and explicit release evidence. The instructor/owner's own release PR is exempt from needing another human review, but **not** from CI or documented Go/No-Go evidence.

**CODEOWNERS**: Ownership of critical workflow/governance files remains `@marah222`. In the review ruleset, Code Owner approval is required for student changes to owned files. The owner can use the Admin PR-only review bypass for their own changes. A wildcard `* @marah222` on `main` is optional if every **student-authored** release PR needs instructor review; the source restriction already allows only `develop → main`.

**Important privilege boundary**: `Repository admin` role bypass applies to **every repository administrator**, not exclusively `@marah222`. Keep admin access limited. If you grant someone else Admin privileges, they may also skip review. If the UI provides a narrower supported bypass actor in your account, prefer it.

Select mandatory status checks only after they have appeared on PRs. The connected GitHub integration cannot activate rulesets, and this repository's rulesets are not yet configured.

**Reviewers**: students cannot approve their own PRs. AI review is a second opinion and does not count as the required independent human review.

## Policy by stage

- Student → team: requirement and test link, focused unit and API assertions as appropriate, 1 peer approval, passing checks.
- Team → develop: 1 different human reviewer for student-authored PRs (owner-authored PRs use the PR-only review exception), passing integrated unit/CI/security/coverage checks, no unreviewed business rule changes.
- Develop → main: owner-authorized release (no second reviewer required for the owner’s own PR), all 11 API story cases and 4 feature browser cases executable (no skipped placeholders), coverage and security checks green, documented known risks and signed release evidence. Release should **not** go ahead merely because the basic CI is green.

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
4. Confirm required checks, security findings and unresolved comments. For student PRs, confirm human/Code Owner approval; for owner-authored PRs, use the documented PR-only review exception.
5. Conduct a Go / No-Go discussion, then merge only after evidence and approvals satisfy the main ruleset.

## AI engineering accountability
AI can help generate tests, refactor, debug and review. PRs must disclose AI use, what was accepted/rejected, what was verified independently, and known limitations. The author remains responsible for assertions and requirements. AI approval does not count as required human approval.
