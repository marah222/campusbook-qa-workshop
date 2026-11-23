# CampusBook — Software Testing & Automation Workshop

**A runnable, intentionally imperfect study-room booking application for an advanced undergraduate QA workshop.**

One shared product · four feature teams · eleven individually owned stories · six hours · one release recommendation.

> This project is deliberately **NOT production-ready**. It includes known business-rule defects, a fixed teaching clock, demo identity headers instead of real authentication, and an in-memory database. Never deploy this as a real university booking system.

> **Windows V3 clean setup:** Read [README_FIRST_WINDOWS.md](README_FIRST_WINDOWS.md). This full ZIP replaces earlier broken repair packages. Do not merge its tests into an old folder.

## Run the app

You need **Node.js 24 LTS** (Node 22.12+ also works for the app) and npm. From this directory:

```bash
npm install
npm run build
npm start
```

Open **http://127.0.0.1:3000**. The repository archive also includes precompiled `build/` files, so **`node server/server.mjs` works without installing testing dependencies** if you already have a compatible Node.js runtime.

The frontend is TypeScript compiled to browser JavaScript, the business logic is TypeScript, and the HTTP backend uses Node's built-in HTTP module. There are **no runtime npm dependencies**. Vitest and Playwright are development/test tools.

### Quick verification

```bash
npm run test:smoke        # built-in Node test; app starts automatically
npm run check             # TypeScript static checking
npm run test:unit         # Vitest tests
npm run test:api          # Playwright HTTP tests
npm run test:ui           # Playwright Chromium browser tests
```

Before the browser tests: `npx playwright install chromium` (or follow your lab-machine setup). `playwright.config.ts` automatically starts the app if it is not running. First install generates a `package-lock.json`; **commit that lockfile in the class repository** for reproducible CI before teaching. All direct dev dependencies are pinned in `package.json`; verify current compatible versions before the workshop.

The initial student unit/API/UI files intentionally contain **TODOs**. Students are meant to complete them based on their own test designs, not receive the answers. The verified project inventory contains 21 Playwright test files (2 runnable smoke tests, 19 intentionally skipped student exercises); run `npm run classroom:verify` and `npm run classroom:playwright-list` to check them.


## Classroom environment (Windows / GitHub)

Before class, open **[workshop/CLASSROOM_SETUP_WINDOWS.md](workshop/CLASSROOM_SETUP_WINDOWS.md)** and use `CLASSROOM_SETUP_WINDOWS.cmd` to install dependencies, compile, install the Chromium browser, and run the baseline checks. `CLASSROOM_CHECK_WINDOWS.cmd` reruns the checks. Use `npm.cmd` rather than `npm` if PowerShell blocks unsigned `npm.ps1` scripts. The instructor must generate and commit `package-lock.json` after the first successful npm installation, then invite students to clone the GitHub repository.

The classroom workflow, PR reviews, quality gates, and manual GitHub setup are documented in [workshop/TEAM_GIT_WORKFLOW.md](workshop/TEAM_GIT_WORKFLOW.md), [workshop/CI_GATES.md](workshop/CI_GATES.md), and [workshop/GITHUB_CLASSROOM_SETUP.md](workshop/GITHUB_CLASSROOM_SETUP.md).

## What you can do in CampusBook

- **Find rooms** — list active rooms, filter by group size and availability.
- **Book a room** — choose a room and times, submit a reservation.
- **Cancel a reservation** — change a confirmed booking to cancelled.
- **My reservations** — view bookings belonging to the selected demo student and filter by status.

Select **Alice Morgan** or **Bob Chen** using the top-right demo-account selector. This is a simplified teaching identity switch, **not a secure sign-in system**.

## Fixed teaching rules

| Rule | Expected behavior |
|---|---|
| Room listing | Only active rooms appear |
| Capacity | A room with capacity 4 accommodates 4 people |
| Search availability | Existing confirmed bookings block overlapping intervals |
| Operating hours | 09:00–18:00 campus-local |
| Duration | 30–120 minutes, inclusive |
| Reservation dates | Future, same-day, end after start |
| Adjacent slots | 10:00–11:00 and 11:00–12:00 do not overlap |
| Reservation creation | Confirmed booking persisted for current demo user |
| Cancellation | Owner can cancel confirmed booking; cancelled bookings remain in history |
| Released slots | Cancelled bookings no longer block availability |
| Reservation history | Users see only their own records; status filter matches requested status |

The workshop uses a **fixed application clock: March 18, 2027 at 08:00 campus-local time**. The API stores local minute values such as `2027-03-18T11:00` and treats them as fixture wall-clock time. This is intentional for reproducible exercises; a real app would need timezone-aware storage and authentication.

## Seeded fixture data

| Object | Initial state |
|---|---|
| R101 · Maple Nook | Active, capacity 2 |
| R102 · Cedar Commons | Active, capacity 4 |
| R103 · Willow Studio | Active, capacity 6 |
| R104 · Birch Annex | Inactive, capacity 4 |
| BK-101 | Alice, R102, 10:00–11:00, CONFIRMED |
| BK-102 | Bob, R103, 12:00–13:00, CONFIRMED |
| BK-103 | Alice, R101, 15:00–16:00, CANCELLED |

The in-memory store resets when the server restarts. For repeatable testing, include a unique `x-test-scope` header or use `/?scope=team-a` in the web app URL; scope datasets are independent. The local-only `POST /api/testing/reset` endpoint resets the named scope and is disabled when `NODE_ENV=production`.

## API contract (classroom version)

All protected routes require `x-demo-user: alice` or `x-demo-user: bob` and optionally `x-test-scope: your-scenario`.

| Method | Endpoint | Expected behavior |
|---|---|---|
| GET | `/api/health` | 200, status ok |
| GET | `/api/rooms?minCapacity=4` | 200, active matching rooms |
| GET | `/api/rooms?start=2027-03-18T10:00&end=2027-03-18T11:00` | 200, available rooms |
| POST | `/api/reservations` | 201, confirmed reservation; 409 conflict; 422 invalid input |
| POST | `/api/reservations/BK-101/cancel` | 200 cancelled; 404 wrong owner; 409 already cancelled |
| GET | `/api/reservations` | 200, current student's bookings |
| GET | `/api/reservations?status=CANCELLED` | 200, requested status only |
| POST | `/api/testing/reset` | 200, local fixture reset only |

Reservation request body:

```json
{
  "roomId": "R101",
  "start": "2027-03-18T11:00",
  "end": "2027-03-18T12:00",
  "people": 1
}
```

Typical business errors are JSON objects with `code` and `message`. The status codes/error codes are course contracts, not universal API standards.

## Four teams and eleven stories

| Team | Owner IDs | Feature |
|---|---|---|
| A | S01, S02, S03 | Room Discovery |
| B | S04, S05, S06 | Room Booking |
| C | S07, S08, S09 | Cancellation |
| D | S10, S11 | My Reservations |

See [workshop/STORY_ASSIGNMENTS.md](workshop/STORY_ASSIGNMENTS.md) for the prompts. Students independently write the actual user story and acceptance criteria on paper, then enter them as GitHub Issues. Do not reveal instructor answers.

## Repository map

```text
src/domain/              TypeScript functions, intentionally imperfect
src/web/app.ts            Browser frontend TypeScript
server/server.mjs         Native Node HTTP API and static file server
public/                  HTML, CSS and favicon
build/                   Precompiled JS (generated, included in ZIP)
tests/unit/               11 Vitest student starters + smoke tests
tests/api/                11 Playwright API starters + health check
tests/ui/                 4 Playwright browser starters + UI smoke test
tests/support/            Isolated test-data helpers
tests/performance/        k6 read-only load scenario
workshop/                 Assignments, QA passport, evidence, grading
.github/                  Issue templates, PR template, CI workflow
```

## GitHub classroom workflow

One repository and one Project board, 11 user-story Issues, four shared feature branches and **one draft PR per team**. Start CI on the first PR and let it rerun as unit, API and UI contributions arrive. Require human review before merging. Automated failing regression tests may be **valuable evidence** and should never be deleted to produce an artificial green check.

The GitHub Project board, branch protections, collaborator permissions and remote branches must be created separately — see [workshop/PROJECT_SETUP.md](workshop/PROJECT_SETUP.md). Copying this ZIP does not configure GitHub remotely.

## Performance exercise

Use a dedicated **local** test environment only:

```bash
k6 run -e VUS=1 tests/performance/rooms.js
k6 run -e VUS=5 tests/performance/rooms.js
```

This is a small, read-only discovery workload, not a capacity certification for the entire product. Do not run it against third-party or production services.

## Important boundaries

- **Do not deploy for real users**. Demo auth headers are insecure by design.
- There is no production authentication, database, external email, payment service, concurrency control, or durable persistence.
- The four product defects are part of the learning experience. The instructor-only reference ZIP documents their expected behavior and solutions; **do not distribute that ZIP to students**.
- The software is original workshop teaching code, not copied from third-party sample repositories.

## References to verify before class

- Playwright: https://playwright.dev/docs/intro
- Playwright API testing: https://playwright.dev/docs/api-testing
- Vitest: https://vitest.dev/guide/
- GitHub Actions: https://docs.github.com/en/actions
- k6: https://grafana.com/docs/k6/latest/
- ISTQB Foundation: https://www.istqb.org/certifications/certified-tester-foundation-level
