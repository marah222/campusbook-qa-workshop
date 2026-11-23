# GitHub classroom setup (instructor)

The ZIP is a Git repository template, not a hosted GitHub repository. A GitHub Project board must be created in your GitHub organization; it cannot be provisioned by copying files alone.

1. Create a private GitHub repository (e.g. `campusbook-qa-workshop`) and push the STUDENT version. Never push the instructor package to it.
2. Add 11 students as collaborators with permission to create Issues, push to assigned team branches and review PRs. Verify permissions with a test account beforehand.
3. Create a GitHub Project named `CampusBook QA Sprint`; add fields `Status`, `Team`, `Student`, `Priority` if useful.
4. Configure statuses: `Backlog`, `Ready`, `In Progress`, `In Review`, `Verified`, `Blocked`.
5. Create four shared branches from `main`: `team-a-discovery`, `team-b-booking`, `team-c-cancellation`, `team-d-reservations`.
6. Check that `.github/ISSUE_TEMPLATE` works and each Issue is actually added to Project.
7. Check PR checks run on the initial and subsequent pushes, including draft PRs. Require human approval and passed required checks before merge.
8. Keep student work on one draft PR per team. Reference user-story Issues rather than closing issues for unfinished stories.
9. Pre-warm dependencies / browsers and test each machine or prepared environment.

**Important:** GitHub Projects, branch protection and account access are remote configuration; they are not automatically created by this repository.
