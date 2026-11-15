# Changesets

Each file here describes one change to `@max-core-ds/tokens` and `@max-core-ds/react` and how
it bumps their version. The two packages are versioned in lockstep (`fixed`), so one version
number always means one Figma token state plus the React code built against it.

- Add one: `pnpm changeset` (pick the packages, the bump, write one line for the changelog).
- Bumps while we're below 1.0: token value changes and fixes → **patch**; new components or
  props, token renames/removals, any API break → **minor**.
- Name added, renamed or removed tokens in the summary, so template projects know what to add
  to their Figma copy before upgrading.
- Releasing (`pnpm release`) turns the pending files into versions + `CHANGELOG.md` entries.
