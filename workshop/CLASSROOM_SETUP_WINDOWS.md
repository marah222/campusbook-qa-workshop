# Student pre-class setup — Windows

**Complete this before workshop day.** CampusBook is a local teaching application, not a public web service.

## Requirements
- Node.js **24 LTS** recommended (minimum **22.12.0**, including minor). Run `node -v`.
- Git installed. Run `git --version`.
- Internet for the **first** npm install and Playwright browser download.
- An editor such as VS Code, a Chrome/Edge browser, and a GitHub account invited to the class repository.
- Do not copy the instructor reference ZIP into your project.

## First-time setup
1. Clone the student repository from the instructor's GitHub URL. The invitation must be accepted first.
2. Open the project folder in VS Code.
3. Run `CLASSROOM_SETUP_WINDOWS.cmd` by double-clicking it, **or** execute it from Windows Command Prompt (`cmd.exe`).
4. Wait for `PASS - CampusBook classroom machine is prepared`. A first installation may be slow because Chromium is downloaded.
5. Open `CLASSROOM_START_WINDOWS.cmd` in a separate window, then browse to `http://127.0.0.1:3000`.
6. Verify the room page loads and switching between Alice and Bob works. Stop the server using Ctrl+C.

**PowerShell signing error?** If `npm -v` says `npm.ps1 cannot be loaded` or `not digitally signed`, use `npm.cmd -v`, `npm.cmd install`, and `npx.cmd playwright install chromium`. The `.cmd` setup scripts already do this. **Do not change system execution policy just for this workshop.**

## Before you arrive
In the repository, run `CLASSROOM_CHECK_WINDOWS.cmd`. Send the instructor only the result (PASS or the exact failing command and error), **not passwords or personal access tokens**.

## During the workshop
- Your GitHub branch will be assigned: `team-a-discovery`, `team-b-booking`, `team-c-cancellation`, or `team-d-reservations`.
- Each team uses one PR throughout the workshop. You will create your own user-story Issue and test contributions.
- Your app normally runs at `http://127.0.0.1:3000`; test runners can start it automatically, so close duplicate app instances when investigating confusing behavior.
- The UI URL `http://127.0.0.1:3000/?scope=team-a` selects an **independent fixture scope**. Substitute your assigned team scope.
- To reset **your own** local scope while the server runs, use `node scripts/reset-scope.mjs team-a`.
- Initial student test files contain `test.todo` / `test.fixme` placeholders; those are intentionally incomplete and should not be mistaken for tested behavior.

## Test commands (when the workshop reaches each step)
```bat
npm.cmd run test:unit
npm.cmd run test:api
npm.cmd run test:ui
```
You must not change accepted expected results merely to make a test green.

## Troubleshooting
| Symptom | Action |
|---|---|
| Node `EBADENGINE` | Install Node 24 LTS; reopen terminal and check `node -v` |
| `npm.ps1 cannot be loaded` | Use `npm.cmd` / `npx.cmd`, or launch the provided `.cmd` files |
| `EADDRINUSE: 3000` | Stop the previous CampusBook process (Ctrl+C) before restarting |
| Browser executable missing | Run `npx.cmd playwright install chromium` |
| API/room data differs from teammate | Verify the `scope` and fixture reset; do not share the same mutable scope |
| `npm ci` complains about lockfile | Inform instructor: the repository must include the generated `package-lock.json` |
| Tests are skipped before the workshop | Expected: some tests are student TODOs, not completed tests |
| `git push` rejected (non-fast-forward) | Ask your team integration lead; they can integrate changes safely rather than force-push |

Sources to verify before teaching: https://nodejs.org/en/download/ ; https://playwright.dev/docs/intro ; https://vitest.dev/guide/ ; https://docs.github.com/en/actions
