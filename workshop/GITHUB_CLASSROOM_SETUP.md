# Instructor: GitHub setup before classroom day

## A. Create a private repository
1. Create an **empty private GitHub repository** named `campusbook-qa-workshop` (do not ask GitHub to generate a README or license).
2. Extract the **student** ZIP locally; **never upload the instructor ZIP**.
3. From the extracted student directory, run these commands in `cmd.exe` after completing Windows dependency setup:
```bat
git init -b main
git add .
git commit -m "chore: prepare CampusBook QA student starter"
git remote add origin https://github.com/YOUR-ORG/campusbook-qa-workshop.git
git push -u origin main
```
Replace `YOUR-ORG` with your actual organization/user name. Use GitHub login, the Git credential helper, or an approved credential method; **never store a personal access token in the repository**.
4. Confirm `package-lock.json` is present after `npm.cmd install` and included in this first commit. Check `git status`.

## B. Four branches, before protecting main
Run in the same repository:
```bat
git branch team-a-discovery main
git branch team-b-booking main
git branch team-c-cancellation main
git branch team-d-reservations main
git push origin team-a-discovery team-b-booking team-c-cancellation team-d-reservations
```
Each student must **clone from GitHub** and switch to the appropriate branch; local copies extracted independently from the ZIP are not Git clones.

## C. Student access
- Invite all 11 students. Check that they accept invitations before the session.
- Ensure each can clone, create Issues, push to the assigned shared branch, and review another team's PR.
- One PR **per team**, not per story. The PR starts after the first test commit and accumulates unit/API/UI changes.
- Team shared-branch pushes should be coordinated by a temporary integration lead to reduce Git conflicts.
- Do not grant write access to the instructor reference ZIP or copy it into the remote repository.

## D. Project board
- Create a GitHub Project named `CampusBook QA Sprint` and connect it to this repository.
- Create the statuses: `Backlog`, `Ready`, `In Progress`, `In Review`, `Verified`, `Blocked`.
- Optional fields: Team (A-D), Story ID (S01-S11), Priority, Student.
- Turn on or document how to add newly created Issues to the Project; creating an Issue does not always automatically place it on the board.
- Leave story Issues for students to create **during the first hour**; verify the Issue template in advance with a dummy Issue that you then close.

## E. CI and branch rules
- Before adding branch protections, open the Actions tab and verify the initial CI run on `main`.
- Confirm the single check named `quality` runs static checking, unit tests, API tests and Chromium smoke tests.
- Add a branch rule/ruleset targeting **only `main`** requiring one human approval and the `quality` check. Set the review and check rules according to repository plan/permissions.
- Keep team branches writable for normal coursework; do not require students to merge just to finish the workshop.
- On PR opening and new commits, workflow should run automatically. Student TODOs being skipped before class is **expected** and does not prove feature correctness.
- Initial draft PRs may be used to collect work; before the formal human review, mark them **Ready for review**. No PR is required to merge when actual regression tests discover product defects.
- Configure AI review as optional. If GitHub offers AI approvals as merge requirements, leave them disabled: human approval is required for this exercise.

## F. Rehearsal before students arrive
1. From Windows CMD run `CLASSROOM_CHECK_WINDOWS.cmd`.
2. Check GitHub workflow result after initial push.
3. Have a second account clone the repository, switch to one team branch, commit a harmless test-comment change and push, open a draft PR, and inspect CI.
4. Mark that sample draft PR ready for review; submit a human review comment from a **different** account.
5. Close the sample PR without merging and restore the original branch if necessary.
6. Print `workshop/STUDENT_HANDOUT.md`, `workshop/QA_PASSPORT.md`, and `workshop/STORY_ASSIGNMENTS.md` for the day.

GitHub Docs: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository ; https://docs.github.com/en/issues/planning-and-tracking-with-projects ; https://docs.github.com/en/pull-requests
