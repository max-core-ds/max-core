# Using Max Core in a project

How a React app installs and uses `@max-core-ds/react` and `@max-core-ds/tokens` from GitHub
Packages. For a rebrand (your own Figma copy and token values), do this first, then follow
[`template-usage.md`](template-usage.md).

## Requirements

- React 18 or 19
- **Tailwind CSS v4.** The components ship Tailwind class names, not compiled CSS; your
  Tailwind build generates the CSS for them.
- Node 20+, any package manager (examples use pnpm)

## 1. Access and a read token

The packages live in GitHub Packages under the `max-core-ds` org. GitHub Packages needs a token
to install, even for public packages.

1. **Access.** While the packages are private, your GitHub account needs read access: be an
   org member, or ask an admin to add you under the package's **Package settings → Manage
   access**.
2. **Token.** Create a **classic** token at https://github.com/settings/tokens/new with only
   **`read:packages`** (fine-grained tokens don't work with the npm registry). Note it as e.g.
   "max-core packages — read".
3. **Make it available as `GITHUB_PACKAGES_TOKEN`:**
   - Locally: add `export GITHUB_PACKAGES_TOKEN=…` to your shell profile, or load it from a
     file only you can read.
   - In CI: a repository secret mapped to that env var. In GitHub Actions you can skip the
     personal token: in the package's **Manage Actions access**, add your repo, then use
     `GITHUB_PACKAGES_TOKEN: ${{ secrets.GITHUB_TOKEN }}` with `permissions: packages: read`.

## 2. `.npmrc` (commit it, it holds no secret)

```ini
@max-core-ds:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

## 3. Install

```bash
pnpm add @max-core-ds/react @max-core-ds/tokens
pnpm add lucide-react   # optional: the icon set the Figma file uses; any ReactNode icon works
```

`@max-core-ds/tokens` is a peer dependency of `@max-core-ds/react`, so install both, on the
same version (they're released in lockstep).

## 4. CSS

In your main stylesheet, in this order:

```css
@import 'tailwindcss';
@import '@max-core-ds/react/styles.css';      /* lets Tailwind see the components' classes */
@import '@max-core-ds/tokens/tokens.css';     /* the design tokens as CSS variables */
@import '@max-core-ds/tokens/theme.css';      /* Tailwind layer: type-*, glass-*, shadows, fonts */
@import '@max-core-ds/tokens/scrollbar.css';  /* optional: .styled-scrollbar */

body {
  background: var(--bg-default);
  color: var(--text-primary);
  font-family: var(--typeface-family-base);   /* Inter, with a system fallback */
}
```

Load the **Inter** font yourself. The tokens name it `Inter`, so use a source that registers
that exact name: `@fontsource/inter` (import the weights you need, e.g. `300.css`, `400.css`,
`700.css`, `900.css`) or Google Fonts. `@fontsource-variable/inter` registers `'Inter Variable'`
and silently falls back to the system font.

**Dark mode:** set `data-theme="dark"` on `<html>` (or any ancestor). Remove it for light.

## 5. Use the components

```tsx
import { Button, Input } from '@max-core-ds/react';
import { ArrowRight } from 'lucide-react';

export function SignUp() {
  return (
    <form>
      <Input placeholder="you@example.com" />
      <Button rightIcon={<ArrowRight />}>Continue</Button>
    </form>
  );
}
```

Storybook in this repo documents every component and its props.

`apps/showcase` in this repo is a standalone Vite app that installs the published packages as
described here (its own `.npmrc`, CSS setup in `src/styles.css`). It's a **template** consumer:
it generates its token CSS from its own `tokens.json` ([`template-usage.md`](template-usage.md))
instead of importing `tokens.css` + `theme.css`. Apart from those two imports, the setup on this
page is the same.

## 6. Staying up to date

Versions follow this rule while we're below 1.0:

| Bump | Meaning |
|---|---|
| patch (0.1.0 → 0.1.1) | token value changes from Figma, fixes — safe |
| minor (0.1.x → 0.2.0) | new components/props, renamed or removed tokens, API changes — read the CHANGELOG |

`"^0.1.0"` therefore picks up patches automatically but not minors.

**Dependabot** (`.github/dependabot.yml`), with the token stored as a **Dependabot** secret
(Settings → Secrets and variables → Dependabot) named `MAX_CORE_PACKAGES_TOKEN`:

```yaml
version: 2
registries:
  max-core:
    type: npm-registry
    url: https://npm.pkg.github.com
    token: ${{ secrets.MAX_CORE_PACKAGES_TOKEN }}
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    registries:
      - max-core
    groups:
      max-core:
        patterns:
          - '@max-core-ds/*'
```

The `groups` entry keeps `react` and `tokens` in one PR, so they stay on the same version.

## Troubleshooting

- **`401` / `403` from `npm.pkg.github.com`:** the token is missing, expired, not a classic
  token, or lacks `read:packages`. Check `echo $GITHUB_PACKAGES_TOKEN` in the same shell.
- **`404` for `@max-core-ds/react`:** your account (or CI repo) has no access to the private
  package, or the `.npmrc` scope line is missing.
- **Components render unstyled:** `@max-core-ds/react/styles.css` isn't imported, it's imported
  before `tailwindcss`, or the project isn't on Tailwind v4.
- **Colours/sizes missing on some components:** `tokens.css` isn't loaded, or (template
  projects) your tokens lack names the installed version needs — run
  `max-core-tokens check --input <your tokens.json>`.
