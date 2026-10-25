# Prompt — Implement a new component + its story

> **How to use:** paste the block below to start a conversation that builds a **new**
> `@max-core/react` component and its Storybook story, following the established convention.
> After building, verify Figma parity with the audit recipe in [`component-audit.md`](./component-audit.md)
> (read scripts + verify gate in `docs/audit/README.md`) — the same flow, applied to a fresh component.

---

```
I'm adding a new component to the Max Core React library (packages/react), following the
existing convention exactly — do not invent new patterns.

READ FIRST:
- PLAN.md → "Convention (from the existing 5 — do not deviate)" — the authoritative rules.
- CLAUDE.md + docs/MAX-CORE-SUMMARY.md — design-system + token rules.
- PROGRESS.md — the component inventory, Storybook tier/theme map, and shared-utils list.
- A close existing component as a template:
    · pure-visual (span/div)  → packages/react/src/components/Badge/Badge.tsx
    · Base UI-wired           → packages/react/src/components/Checkbox/Checkbox.tsx

CONVENTION:
- Folder: packages/react/src/components/<Name>/{<Name>.tsx, index.ts}.
    · <Name>/index.ts   → export { <Name>, type <Name>Props } from './<Name>.js';
    · Add ONE line to packages/react/src/index.ts:
        export { <Name>, type <Name>Props } from './components/<Name>/index.js';
- Styles: module-scope cva([...base...], { variants, compoundVariants?, defaultVariants }).
    · Axes: variant / tone / size / booleans.
    · Tone-varies-by-variant → empty tone strings + compoundVariants (use statusToneCompounds
      from utils/tone.js). Self-contained axis → a literal table on the variant (e.g. validation).
- Tokens: ONLY as arbitrary-value utilities — px-[var(--spacing-10)], size-[var(--size-24)].
  Every class is a FULL LITERAL; never interpolate (bg-[var(${x})]) — Tailwind's static
  extraction can't see it. Font micro-steps may be literal; larger sizes use the Tailwind scale.
- Props: interface <Name>Props extends
      Omit<ComponentPropsWithoutRef<typeof Base…>, '…'>, VariantProps<typeof <name>Styles>
      { …icon/children slots }.
    · className={cn(<name>Styles({…}), className)}; spread ...rest to the root element.
    · Icons are consumer-provided ReactNode slots (leftIcon/rightIcon/icon).
    · Base UI via per-primitive subpath (@base-ui/react/<primitive>).
    · 'use client' ONLY when wiring Base UI.
    · forwardRef when the component anchors a Base UI popup (Tooltip/Menu/Dialog trigger).
- REUSE shared utils (packages/react/src/utils/) before writing inline classes:
      cn · tone (accentFill/statusFill/statusBg/statusSubtle/statusOutline/statusText +
      statusToneCompounds) · validation · focus-ring (focusRing/focusRingInset/ring) ·
      state-layer (stateLayer/elevatePress) · field (fieldSurface) · progress · tooltip-surface.
  Add a new util only when 2+ components share the literals.

STORY (apps/storybook/src/stories/<Name>.stories.tsx):
- import { <Name> } from '@max-core/react';
- meta.title = '<Tier>/<Theme>/<Component>' (Tier ∈ Foundations/Atoms/Molecules/Organisms;
  pick the theme from PROGRESS.md's grouping, e.g. Atoms/Data Display, Molecules/Overlays).
- argTypes mirror the cva axes; provide a Default story + an AllVariants/matrix story.
- Light + dark render automatically via .storybook/preview.tsx (withThemeByDataAttribute).

VERIFY GATE (before commit):
  pnpm -F @max-core/react typecheck
  pnpm -F @max-core/react build            # rebuild dist BEFORE the two below
  cd apps/storybook && npx tsc --noEmit -p tsconfig.json
  pnpm -F @max-core/tokens drift           # green if the component's token spec is mapped
  npx biome check --write <changed files>

THEN:
- Add the component's row to PROGRESS.md.
- Verify Figma parity against the master — follow prompts/component-audit.md (read-only
  use_figma reads of the bound variables; map by token name, not hex) and add docs/audit/<slug>.md.
- One focused commit.

Branch: feat/phase3-buildout. Tell me which component to build; if it maps to a Figma node
I'll give you the node id / page. Use a scratch dir for screenshots (not /tmp).
```

---

## Notes

- **Drift check** only asserts that a component binds the spacing/size/radius semantic vars its
  Figma `components` tokens mandate — it guarantees *dimensions, never appearance*. Visual
  correctness comes from the Figma audit (see [`component-audit.md`](./component-audit.md)).
- **Mega-systems** (Data Table, Date Picker, Bottom Sheet + premades) are Phase 4 — out of scope for
  the single-component flow above. Batch 8 (Stacked List, 9 row types) is the one remaining large
  build and composes from ListItem + EntityItem + selection controls.
