# What CI means in this workshop

The GitHub Actions workflow runs on updates to the PR and on pushes to `main`.

**`quality` check**: install dependencies, TypeScript compile/check, application smoke test, unit tests, Playwright API tests and Chromium UI tests. Test artifacts are uploaded when possible. The performance script is **manual/staging-only**, not a per-PR job.

**Before students write tests**, smoke checks should pass and student TODO tests are skipped. Treat that as **incomplete coverage**, not proof of correctness.

**During the workshop**, a well-written student regression test may fail because CampusBook intentionally violates a requirement. Investigate and record the finding; do not delete or weaken the assertion.

**Review versus merge versus release**:
- Reviewers comment on assertion quality and requirement alignment.
- `main` requires an eligible human review and successful required check before merge.
- A blocked PR can still demonstrate successful learning and contain valuable evidence.
- Product release is separately evaluated against risk and test-completion criteria.

If a CI runner is unavailable, record its status as pending/blocked and use local evidence. Never label a pending check as passed.
