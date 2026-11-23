# Git workflow — four teams, eleven individual contributions

Instructor provides a private repository, four existing branches and a GitHub Project. **Students do not work on `main`.**

| Team | Branch | Students | Reviews |
|---|---|---|---|
| A | `team-a-discovery` | S01, S02, S03 | Team B |
| B | `team-b-booking` | S04, S05, S06 | Team C |
| C | `team-c-cancellation` | S07, S08, S09 | Team D |
| D | `team-d-reservations` | S10, S11 | Team A |

## First time after cloning
Open terminal in project folder and run:
```bat
git fetch origin
git switch team-b-booking
git pull --ff-only origin team-b-booking
```
Substitute your assigned branch name. **Do not copy these commands literally if you are not Team B.**

## Individual contribution
- Work in the file for your own story, such as `tests/unit/team-b/s05.test.ts` or `tests/api/team-b/s05.spec.ts`.
- If multiple teammates use the same branch, agree who pushes first. Changes to distinct files are easier to integrate.
- Commit your real change, using a message such as `test(api): add S05 conflict assertion`.
- Before pushing, fetch changes from teammates and coordinate any non-fast-forward update with the integration lead. Never force-push over another student.
- One team member opens a **draft PR** to `main` after the first real commit. Further pushes update the same PR.
- Link the team's story Issues. A CI failure caused by a genuine product defect is useful evidence; keep the test and record the issue.
- **Before formal cross-team review**, mark the PR ready for review so reviewers can submit their recommendations. It can remain unmergeable if required checks fail.

## Review rotation and policy
A reviews B → B reviews C → C reviews D → D reviews A. Every student contributes at least one meaningful comment or justified review finding. An AI review is not a substitute for the required human approval. No team is forced to merge a PR with failing required checks.

## Critical terminology
A **correct failing test** can be good QA work. A **PR ready to merge** still needs required CI checks and human approval. A **product ready to release** needs a separate risk-based decision.
