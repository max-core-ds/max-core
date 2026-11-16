# Max Core as a template (your own brand)

Use this when a project wants **the same components with its own look**: its own colours, type,
radii, spacing — set in its own copy of the Max Core Figma file. The components are unchanged
and come from `@max-core-ds/react`; only the token values are yours.

You don't need this repo's pipeline (CI, Changesets, releases). You need:

| What | Why |
|---|---|
| Your own copy of the Max Core Figma file | where your designers set the values |
| The Max Core Tokens Figma plugin | exports your `tokens.json` (Publish to your repo, or Download) |
| `@max-core-ds/react` + `@max-core-ds/tokens` installed | the components, and the `max-core-tokens` CLI that turns your `tokens.json` into CSS |

If you need different components or component structure, this isn't the right setup — fork
the repo instead.

## 1. Figma: your copy

1. Duplicate the Max Core Figma file (ask the Max Core team for access).
2. Change **values only**. Keep the collection names (`Max Core - Primitives`, `- Semantics`,
   `- Colors`, `- Components`), the variable names and the **`Max core`** mode name: the
   exporter and the components look tokens up by name.
3. Renaming or deleting a variable the components use breaks the contract check (step 4).
   Adding variables is harmless; the components ignore them.

## 2. The plugin

Until the plugin is distributed separately, build it from this repo:

```bash
git clone git@github.com:max-core-ds/max-core.git && cd max-core
pnpm install && pnpm -F @max-core-ds/figma-plugin build
```

In Figma desktop: **Plugins → Development → Import plugin from manifest…** →
`packages/figma-plugin/manifest.json`. Then in the plugin's **Settings**:

- **Owner / Repository / Base branch:** your project's repo.
- **Path of tokens.json:** where it lives in your repo, e.g. `tokens/tokens.json`.
- **Add a changeset:** off, unless your repo uses Changesets.
- **GitHub token:** a fine-grained token for *your* repo with Contents + Pull requests: Read
  and write.

**Publish to GitHub** then opens PRs in your repo, with the token diff in the description.

## 3. Your project

First install as in [`consuming.md`](consuming.md) (`.npmrc`, read token, both packages). Then:

**package.json** — generate the CSS from your `tokens.json` before every dev run and build:

```json
{
  "scripts": {
    "tokens": "max-core-tokens build --input tokens/tokens.json --out src/styles/brand",
    "dev": "pnpm tokens && vite",
    "build": "pnpm tokens && vite build"
  }
}
```

(Chained explicitly rather than `predev`/`prebuild`: whether pre-scripts run depends on the
package manager and its settings.)

The generator comes from your installed `@max-core-ds/tokens`, so it always matches your
`@max-core-ds/react` version. Add `src/styles/brand/` to `.gitignore` (it's generated).

**CSS** — the consumer block, with your generated files in place of the Max Core ones:

```css
@import 'tailwindcss';
@import '@max-core-ds/react/styles.css';
@import './brand/tokens.css';
@import './brand/theme.css';
@import '@max-core-ds/tokens/scrollbar.css'; /* optional */
```

## 4. The contract check

`max-core-tokens build --input …` also checks your tokens against the list of CSS variables the
installed `@max-core-ds/react` reads (`contract.json`, shipped with `@max-core-ds/tokens`). If
any are missing, it lists them and exits with an error, so `dev` and `build` stop instead of
rendering components with missing values:

```
✗ 2 token var(s) used by @max-core-ds/react 0.2.0 are missing from tokens/tokens.json:
    --buttons-global-primary-border-width
    --spacing-16

  Add the matching variables to your Figma copy and re-export.
```

`max-core-tokens check --input tokens/tokens.json` runs only the check (useful in CI).

## Day to day

- **Designer:** edits values in your Figma copy → plugin **Publish to GitHub** → PR.
- **Developer:** reviews and merges the PR; the next `dev`/`build` regenerates the CSS.
- **Upgrading Max Core:** bump `@max-core-ds/react` and `@max-core-ds/tokens` together. Read the
  CHANGELOG — changesets name added and renamed tokens. If the check lists missing variables,
  add them to your Figma copy (same names), publish, merge.
