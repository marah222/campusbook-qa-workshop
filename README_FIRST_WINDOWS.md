# START HERE — CampusBook V3 (Windows)

This is a **complete fresh package**, not a patch. Do **not merge** it into the older `CampusBook_Student_Classroom_Ready` folder: earlier repair ZIPs omitted required imports.

## Quickest reliable setup

1. Extract the whole ZIP into a **new folder**. Keep `campusbook-student/tests/support/` — it is required by the UI tests.
2. Open `campusbook-student` and double-click `CLASSROOM_SETUP_WINDOWS.cmd`.
3. On success, it prints **PASS: CampusBook V3 is ready for classroom use**. It checks real Playwright discovery and smoke execution.
4. Expected complete Playwright baseline: **21 tests: 2 passed, 19 skipped**. The 19 student exercises are intentionally skipped; they are not defects or successful regressions.
5. Launch the application separately with `CLASSROOM_START_WINDOWS.cmd`, then open http://127.0.0.1:3000 .

## If you want to avoid re-downloading dependencies

In the OLD project, copy only `package-lock.json` into this fresh folder if it exists. The setup then uses `npm.cmd ci` to install the correct dependencies cleanly. Do **not** copy the old `tests/`, `playwright.config.ts`, or `node_modules/` into the fresh folder. Already installed Chromium normally remains cached automatically under `%LOCALAPPDATA%\ms-playwright`.

If the old package has no lockfile, the setup uses `npm.cmd install` and creates one. Commit `package-lock.json` to GitHub after setup.

## If setup fails

Read the last error. To diagnose separately, from CMD or PowerShell inside this folder run:

```
node scripts/verify-workshop.mjs
npx.cmd playwright test --list --project=chromium
npx.cmd playwright test tests/api/health.spec.ts tests/ui/smoke.spec.ts --project=chromium
```

The first command should pass without installing anything. The second should report **21 tests in 21 files**. The third should report **2 passed**, provided the local browser can launch.

Node deprecation warnings from Node 26 are generally not fatal. Prefer Node 24 LTS for classroom consistency if convenient, but do not change working Node just to silence that warning.

**Do not upload the instructor solution.** This student app includes intentional business-rule defects and a local demo identity switch; it is not production software.
