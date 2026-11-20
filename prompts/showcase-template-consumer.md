# Turn the showcase into a template consumer

Copy-paste prompt for a fresh session. Written 2026-11-20.

---

We're turning `apps/showcase` from a **standard consumer** into a **template consumer** of Max
Core, following `docs/template-usage.md` to the letter. Its `tokens.json` comes from our own
(first-party) Figma file.

## Where we are

- Phase 7 is done (`PLAN.md → Phase 7`, `apps/showcase/README.md`). The showcase is its own
  pnpm root inside the repo: it's excluded from the root workspace and has its own `.npmrc`,
  lockfile and `pnpm-workspace.yaml`. It installs the **published** `@max-core-ds/react` +
  `@max-core-ds/tokens` (^0.1.1) from GitHub Packages.
- Today it imports the ready-made `@max-core-ds/tokens/tokens.css` + `theme.css` (the
  `docs/consuming.md` path). Inter comes from `@fontsource/inter`.
- A trial run on 2026-11-20 worked: `pnpm exec max-core-tokens build --input
  ../../packages/tokens/src/tokens.json --out <dir>` from `apps/showcase` generated
  `tokens.css` (1113 vars) and `theme.css` (18 utilities), byte-identical to the published
  0.1.1 files. The contract check passed (649 vars, react 0.1.1). The published CLI has no
  `--help`: with no `--input` it looks for its own `src/tokens.json` and fails. Note that as a
  small CLI finding; don't fix it in this task unless I say so.

## Constraints

- **Branch first:** `feat/showcase-template-consumer` from an up-to-date `main`. Commit only
  when I ask; I push, open the PR and merge.
- **No CI changes.** Don't touch `.github/workflows/ci.yml` and add no new showcase CI steps.
  The existing `showcase` job runs `pnpm build`, which will now run `pnpm tokens &&` first.
  Tell me about that side effect and confirm it's OK before committing.
- Don't change `packages/*`. If the template path breaks, that's a package or doc finding:
  report it, and fix it in the package (with a changeset) only after I agree. Never work
  around it in the showcase.
- I'm new to this workflow, so explain what each step does and why, in plain words.

## Steps

1. **Tokens source:** add `apps/showcase/tokens/tokens.json`, a committed copy of our tokens
   at the **released** version the showcase installs:
   `git show v0.1.1:packages/tokens/src/tokens.json > apps/showcase/tokens/tokens.json`.
   Use the release tag, not `main`: `main` can hold unreleased token changes that don't match
   the released components. This file stands in for what a template team's plugin would
   publish from their own Figma copy.
2. **Scripts** in `apps/showcase/package.json`, as in `template-usage.md` §3:
   `"tokens": "max-core-tokens build --input tokens/tokens.json --out src/styles/brand"`,
   with `dev` and `build` prefixed by `pnpm tokens && `. `typecheck` doesn't need it.
3. **Gitignore** `apps/showcase/src/styles/brand/`. It's generated: either an
   `apps/showcase/.gitignore`, or a root entry; the doc says the project's own `.gitignore`.
4. **CSS** in `apps/showcase/src/styles.css`: replace the two published token imports with
   `./styles/brand/tokens.css` and `./styles/brand/theme.css`. The path is relative to
   `src/styles.css`, so check it. Keep `@max-core-ds/react/styles.css` and the Inter imports.
   `scrollbar.css` stays optional from the package.
5. **Docs:**
   - `apps/showcase/README.md`: it's now a template consumer, explain where `tokens.json`
     comes from, and update the after-release bump to also refresh `tokens/tokens.json` from
     the new tag.
   - Root `README.md → Release workflow → D`: same bump step.
   - `docs/template-usage.md`: one line pointing to the showcase as the working reference,
     plus fixes for anything the doc got wrong.
   - `docs/consuming.md`: its showcase pointer now says template consumer; the standard path
     is no longer exercised by an app.
   - `PLAN.md`: a new **Phase 8** entry. `PROGRESS.md`: a new START HERE entry.

## Verification

1. `pnpm -C apps/showcase tokens`: the contract check passes, and `src/styles/brand/` holds
   both files.
2. `pnpm -C apps/showcase typecheck && pnpm -C apps/showcase build`.
3. Build output → `vite preview`, then Playwright screenshots, light + dark. They should look
   the same as before (the values are the same). The Phase 7 recipe: run the Playwright script
   from `apps/storybook`, where `playwright` is installed.
4. **Proof the brand really comes from `tokens.json`:** on a scratch copy only (never
   committed), change one primitive (e.g. the primary 600 hex) and run the build with
   `--input` on the copy. Screenshot it: the accent should change. Then restore.
5. **Proof the contract check guards it:** on a scratch copy, delete one variable the
   components use and confirm `max-core-tokens check --input <copy>` fails, listing it.
6. Root `pnpm lint` is clean, and `git status` shows no generated `brand/` files.

## Afterwards

Update memory: `reference-release-pipeline.md` (showcase = template consumer, the bump step
now refreshes `tokens.json` from the release tag) and the START HERE resume note.
