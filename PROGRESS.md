# Max Core React — Progress & Handoff

> Living status doc for the `@max-core/react` buildout. Update it whenever a
> component is added or a `figma-node-links/*.json` file is cross-checked.
> Last updated: **2026-08-23** · Branch: **`feat/phase3-buildout`**
>
> **To pick up the work**, paste one of the guides in `prompts/` into a new conversation:
> [`figma-cross-check.md`](prompts/figma-cross-check.md) (continue the cross-check) or
> [`implement-component.md`](prompts/implement-component.md) (build a new component + story).

---

## Where we are

- **Phase 3 buildout: complete** — 45 components shipped across Batches 0–7 (Batch 8 = Stacked List still pending, see below). All are drift-green (`pnpm -F @max-core/tokens drift`), typed, built (tsup), and have a Storybook story in a flat tiered folder (`<Tier>/<Component>`).
- **Phase 3.5 visual cross-check: all exported files done** — every `figma-node-links/*.json` the designer has provided is cross-checked and moved to `figma-node-links/checked/`. Each was drift-green yet had appearance/axis gaps the raw tokens didn't capture (states, colors, missing axes/slots), now fixed. Further cross-checks resume when the designer drops new files into `figma-node-links/`. See the process in `PLAN.md → Phase 3.5`.

---

## Cross-check status (`figma-node-links/`)

| File | Component(s) | Status | Fix applied |
|------|-------------|--------|-------------|
| badges.json | Badge | ✅ checked | Added missing **Variant** axis (Default/Outline/Ghost); Default tone recolored to the subtle pattern (accent border + text) |
| buttons.json | Button, IconOnlyButton, LinkButton, SplitButton, Fab | ✅ checked | **LinkButton**: Light label + Pressed state + per-tone hover. Others verified faithful. |
| tags.json | Tag | ✅ checked | Filter-chip **Selected** model, `filled`→`primary`, Light label, transparent Ghost |
| selection-controls.json | Checkbox, Radio, Switch | ✅ checked | Added **Validation** axis (Default/Error/Warning/Success) + **helper text**; indeterminate dash; new `utils/validation.ts` |
| segmented-control.json | SegmentedControl | ✅ checked | Active item recolored to **accent/default fill + text/on-accent** (was a bg/surface pill with shadow) |
| list-item.json | ListItem | ✅ checked | Accent state fills (Hover/Pressed/Active → subtle/active/default) + new **Active** + **Collapsed** axes |
| search-bar.json | SearchBar | ✅ checked | Added **Button=On** action slot (trailing Standard Button); pill fill bg/surface → **bg/default** |
| dialog.json | Dialog | ✅ checked | Added **Tone** (danger/success/warning) icon + **Type** (horizontal/vertical) layouts + Show Icon; confirmation centering |
| top-bar.json | TopBar | ✅ checked | Added **Elevated** axis (shadow/down/md) + mobile **Type** (Standard/Mobile floating w/ frosted-glass buttons) |
| bottom-bar.json | BottomNavigation | ✅ checked | 5-state _Nav Item fills (Hover/Pressed/Active → subtle/accent-subtle/accent-surface) + Dot + disabled; dropped focus ring |
| sidebar.json | SideBar | ✅ checked | Added **Top Bar** + **Sub Header** slots (now a full 5-slot wrapper) |

> **PayButton was removed from the library** (intentional product decision) — its
> `payment-buttons.json` cross-check no longer applies.

> Only components with an exported node-link file get cross-checked. The
> designer adds more files over time; components not listed above are **not yet
> visually verified** (built from tokens only).

---

## Component inventory (49 shipped + stories)

Legend — Cross-check: ✅ done · 🔄 in progress · ⬜ file pending · — no node file yet.

### Atoms

| Component | Storybook title | Cross-check |
|-----------|-----------------|-------------|
| Button | Atoms/Standard | ✅ |
| IconOnlyButton | Atoms/Icon Only | ✅ |
| LinkButton | Atoms/Link | ✅ |
| SplitButton | Atoms/Split | ✅ |
| Fab | Atoms/FAB | ✅ |
| Avatar | Atoms/Avatar | ✅ |
| Badge | Atoms/Badge | ✅ |
| Tag | Atoms/Tag | ✅ |
| Divider | Atoms/Divider | ✅ |
| ProgressBar | Atoms/Progress Bar | ✅ |
| Tooltip | Atoms/Tooltip | ✅ |
| Knob | Atoms/Knob | — |
| Spinner | Atoms/Spinner | — |
| Thumbnail | Atoms/Thumbnail | — |
| ScrollBar | Atoms/ScrollBar | ✅ |
| TimePicker | Atoms/TimePicker | ✅ |
| StatusDot | Atoms/StatusDot | ✅ |
| ContentBlocks | Atoms/Content Blocks | — |
| Checkbox | Atoms/Checkbox | ✅ |
| Radio | Atoms/Radio | ✅ |
| Switch | Atoms/Switch | ✅ |
| SegmentedControl | Atoms/Segmented Control | ✅ |
| ListItem | Atoms/List Item | ✅ |

### Molecules

| Component | Storybook title | Cross-check |
|-----------|-----------------|-------------|
| Input | Molecules/Input | — |
| BottomLineInput | Molecules/Bottom Line Input | — |
| SelectInput | Molecules/Select Input | — |
| Multiselect | Molecules/Multiselect | — |
| Stepper | Molecules/Stepper | — |
| Textarea | Molecules/Textarea | — |
| SearchBar | Molecules/Search Bar | ✅ |
| AvatarGroup | Molecules/Avatar Group | — |
| EntityItem | Molecules/Entity Item | — |
| EntityCard | Molecules/Entity Card | — |
| Pin | Molecules/Pin | — |
| FormGroup | Molecules/Form Group | — |
| Range | Molecules/Range | — |
| Pagination | Molecules/Pagination | — |
| Switcher | Molecules/Switcher | — |
| Tabs | Molecules/Tabs | — |
| Dialog | Molecules/Dialog | ✅ |
| Dropdown | Molecules/Dropdown | — |
| ItemList | Molecules/Item List | — |
| Toast | Molecules/Toast | — |
| ActionBar | Molecules/ActionBar | ✅ |

### Organisms

| Component | Storybook title | Cross-check |
|-----------|-----------------|-------------|
| ShareItem | Organisms/Share Item | — |
| StatsCard | Organisms/Stats Card | — |
| BottomNavigation | Organisms/Bottom Navigation | ✅ |
| SideBar | Organisms/Side Bar | ✅ |
| TopBar | Organisms/Top Bar | ✅ |

### Foundations
- `Foundations/Tokens` — token reference story (not a component).

---

## Shared utilities (`packages/react/src/utils/`)

Reuse these before writing inline classes — they keep Tailwind literals in one place (Tailwind's static extraction can't see interpolated `bg-[var(${x})]`).

- `cn.ts` — clsx + tailwind-merge.
- `focus-ring.ts` — `focusRing` (outset), `focusRingInset` (STRETCH −3px for Input frames), `ring`.
- `tone.ts` — `Tone`/`StatusTone` types + literal tables: `accentFill`, `statusFill`, `statusBg`, `statusSubtle`, `statusOutline`, `statusText`, and `statusToneCompounds(variant, table)`.
- `state-layer.ts` — `stateLayer` (`::before` overlay), `elevatePress`.
- `validation.ts` — `Validation` type + `checkboxValidation` / `radioValidation` / `switchValidation` tables (selection-control error/warning/success recolor).
- `progress.ts` — `progressTrack(size)`, `progressFill` (shared by ProgressBar + Range).
- `tooltip-surface.ts` — `tooltipBubble`, `tooltipArrow` (shared by Tooltip + Range value bubble).
- `field.ts` — `fieldSurface` (input surfaces).

---

## Remaining work

1. **Phase 3.5 cross-check** — ✅ all exported files done (segmented-control, list-item, search-bar, dialog, top-bar, bottom-bar, sidebar). Resume when the designer drops new files into `figma-node-links/`.
2. **Phase 4 — mega-systems + test infra** — the next build phase, now planned out in **`PLAN.md → Phase 4`**. Batches: **8 Stacked List** (9 row types, ~22 tokens — compose from ListItem + EntityItem + selection controls) → **9 Data Table** → **10 Card** → **11 Bottom Sheet** (+18 premades) → **12 Date Picker** → **13 test infra** (vitest + RTL + axe).

> Not yet visually cross-checked (built from tokens only): every component in
> the inventory below without a ✅ in the Cross-check column.

---

## Verify a change (run before every commit)

```bash
pnpm -F @max-core/react typecheck        # tsc --noEmit
pnpm -F @max-core/react build            # tsup (rebuild dist so Storybook + drift see it)
cd apps/storybook && npx tsc --noEmit -p tsconfig.json   # Storybook consumes built dist
pnpm -F @max-core/tokens drift           # spacing/size/radius conformance
npx biome check --write <changed files>
```

One commit per file/component; commit message notes the Figma finding.
