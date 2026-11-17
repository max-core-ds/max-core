# Accessibility test exceptions

Known accessibility issues that the automated tests are told to accept (Phase 6.3). Every
exception is **declared here and marked in the code** — nothing is switched off silently. The
guard script checks that the two match:

```bash
pnpm -F @max-core-ds/storybook a11y:exceptions
```

It runs in CI and fails when a marker has no row here, when a row has no marker in the code
(fixed → delete the row), or when a test uses `.only`.

## Exceptions

| ID | Where | Rule / test | Reason | Owner | Since |
|---|---|---|---|---|---|
| A11Y-000 | All stories (`.storybook/preview.tsx`) | axe `color-contrast` off | Colours are Figma-owned and tracked by the contrast report (`pnpm -F @max-core-ds/tokens contrast`); fixed in Figma, not here | Policy | 2026-11-17 |

**Owner:** `code` (we fix it), `Figma` (Max fixes it; also listed in `PLAN.md` "Notes for
Max"), `upstream` (a dependency's bug, linked issue), `accepted` (kept by decision), `policy`
(covered by another check).

## How to add one

Use the narrowest form that works, put `A11Y-EXCEPTION: <ID>` in a comment on the marker or
the line above it, and add the row here.

1. **One rule on one element** (the rest of the story is still checked):
   ```ts
   parameters: {
     a11y: {
       config: {
         // A11Y-EXCEPTION: A11Y-001
         rules: [{ id: 'aria-allowed-role', selector: '[data-slot="trigger"]', enabled: false }],
       },
     },
   },
   ```
2. **A whole story as "known, not fixed yet"**: violations show as warnings in the Storybook
   a11y panel, but the test passes:
   ```ts
   parameters: { a11y: { test: 'todo' } }, // A11Y-EXCEPTION: A11Y-002
   ```
3. **`test: 'off'`**: only for stories that aren't UI (e.g. token swatches), never for a
   component.
4. **Behaviour tests:** `it.fails(…)` for a known bug. It turns red once the bug is fixed, which
   is the cue to remove the marker and the row. `it.todo(…)` for a test not written yet is
   fine without a marker. `it.skip` needs a marker like the others; `.only` is never allowed.

When an exception is fixed, remove the marker and the row in the same commit.
