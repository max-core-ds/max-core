# Max Core React — Progress & Handoff

> Living status doc for the `@max-core/react` buildout. Update it whenever a
> component is added or a `figma-node-links/*.json` file is cross-checked.
> Last updated: **2026-07-13** · Branch: **`feat/phase3-buildout`**
>
> **To pick up the work**, paste one of the guides in `prompts/` into a new conversation:
> [`figma-cross-check.md`](prompts/figma-cross-check.md) (continue the cross-check) or
> [`implement-component.md`](prompts/implement-component.md) (build a new component + story).

---

## Where we are

- **Phase 3 buildout: complete** — 46 components shipped across Batches 0–7 (Batch 8 = Stacked List still pending, see below). All are drift-green (`pnpm -F @max-core/tokens drift`), typed, built (tsup), and have a Storybook story in a tiered folder (`<Tier>/<Theme>/<Component>`).
- **Phase 3.5 visual cross-check: in progress** — going component-by-component against the Figma showcase node trees the designer exported into `figma-node-links/*.json`, fixing anything the raw tokens didn't capture (states, colors, missing axes). See the process in `PLAN.md → Phase 3.5`. Files move to `figma-node-links/checked/` once done.

---

## Cross-check status (`figma-node-links/`)

| File | Component(s) | Status | Fix applied |
|------|-------------|--------|-------------|
| badges.json | Badge | ✅ checked | Added missing **Variant** axis (Default/Outline/Ghost) |
| buttons.json | Button, IconOnlyButton, LinkButton, SplitButton, Fab | ✅ checked | **LinkButton**: Light label + Pressed state + per-tone hover. Others verified faithful. |
| payment-buttons.json | PayButton | ✅ checked | Added independent **Color (Light/Dark)** axis (theme-aware tokens) |
| tags.json | Tag | ✅ checked | Filter-chip **Selected** model, `filled`→`primary`, Light label, transparent Ghost |
| selection-controls.json | Checkbox, Radio, Switch | ✅ checked | Added **Validation** axis (Default/Error/Warning/Success) + **helper text**; indeterminate dash; new `utils/validation.ts` |
| segmented-control.json | SegmentedControl | 🔄 in progress | — |
| list-item.json | ListItem | ⬜ pending | — |
| search-bar.json | SearchBar | ⬜ pending | — |
| top-bar.json | TopBar | ⬜ pending | — |
| bottom-bar.json | BottomNavigation | ⬜ pending | — |
| sidebar.json | SideBar | ⬜ pending | — |

> Only components with an exported node-link file get cross-checked. The
> designer adds more files over time; components not listed above are **not yet
> visually verified** (built from tokens only).

---

## Component inventory (46 shipped + stories)

Legend — Cross-check: ✅ done · 🔄 in progress · ⬜ file pending · — no node file yet.

### Atoms

| Component | Storybook title | Cross-check |
|-----------|-----------------|-------------|
| Button | Atoms/Buttons/Standard | ✅ |
| IconOnlyButton | Atoms/Buttons/Icon Only | ✅ |
| LinkButton | Atoms/Buttons/Link | ✅ |
| PayButton | Atoms/Buttons/Pay | ✅ |
| SplitButton | Atoms/Buttons/Split | ✅ |
| Fab | Atoms/Buttons/FAB | ✅ |
| Avatar | Atoms/Data Display/Avatar | — |
| Badge | Atoms/Data Display/Badge | ✅ |
| Tag | Atoms/Data Display/Tag | ✅ |
| Divider | Atoms/Display/Divider | — |
| ProgressBar | Atoms/Display/Progress Bar | — |
| Tooltip | Atoms/Display/Tooltip | — |
| Knob | Atoms/Display/Knob | — |
| Spinner | Atoms/Display/Spinner | — |
| Thumbnail | Atoms/Display/Thumbnail | — |
| ContentBlocks | Atoms/Display/Content Blocks | — |
| Input | Atoms/Forms/Input | — |
| BottomLineInput | Atoms/Forms/Bottom Line Input | — |
| SelectInput | Atoms/Forms/Select Input | — |
| Multiselect | Atoms/Forms/Multiselect | — |
| Stepper | Atoms/Forms/Stepper | — |
| Textarea | Atoms/Forms/Textarea | — |
| SearchBar | Atoms/Forms/Search Bar | ⬜ |
| Checkbox | Atoms/Selection/Checkbox | ✅ |
| Radio | Atoms/Selection/Radio | ✅ |
| Switch | Atoms/Selection/Switch | ✅ |
| SegmentedControl | Atoms/Selection/Segmented Control | 🔄 |
| ListItem | Atoms/Selection/List Item | ⬜ |

### Molecules

| Component | Storybook title | Cross-check |
|-----------|-----------------|-------------|
| AvatarGroup | Molecules/Data Display/Avatar Group | — |
| EntityItem | Molecules/Data Display/Entity Item | — |
| EntityCard | Molecules/Data Display/Entity Card | — |
| Pin | Molecules/Data Display/Pin | — |
| FormGroup | Molecules/Inputs/Form Group | — |
| Range | Molecules/Inputs/Range | — |
| Pagination | Molecules/Navigation/Pagination | — |
| Switcher | Molecules/Navigation/Switcher | — |
| Tabs | Molecules/Navigation/Tabs | — |
| Dialog | Molecules/Overlays/Dialog | — |
| Dropdown | Molecules/Overlays/Dropdown | — |
| ItemList | Molecules/Overlays/Item List | — |
| Toast | Molecules/Overlays/Toast | — |

### Organisms

| Component | Storybook title | Cross-check |
|-----------|-----------------|-------------|
| ShareItem | Organisms/Data Display/Share Item | — |
| StatsCard | Organisms/Data Display/Stats Card | — |
| BottomNavigation | Organisms/Navigation/Bottom Navigation | ⬜ |
| SideBar | Organisms/Navigation/Side Bar | ⬜ |
| TopBar | Organisms/Navigation/Top Bar | ⬜ |

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

1. **Finish Phase 3.5 cross-check** — the 6 pending files (segmented-control → list-item → search-bar → top-bar → bottom-bar → sidebar), then any new files the designer drops into `figma-node-links/`.
2. **Batch 8 — Stacked List** — 9 row types (Default, Social, Ride Row, Delivery Row, Media Row, Product, Booking, Items Grid, Transport), ~22 tokens. Compose from ListItem + EntityItem + Selection controls.
3. **Phase 4 (out of scope here)** — Data Table system, Date Picker, Bottom Sheet + 18 premades; automated test infra (vitest/axe).

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
