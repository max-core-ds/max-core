# Max Core React — Progress & Handoff

> Living status doc for the `@max-core/react` buildout. Update it whenever a
> component is added or a `figma-node-links/*.json` file is cross-checked.
> Last updated: **2026-09-18** · Branch: **`main`** — **9 commits ahead of `origin/main` (unpushed)**
>
> **To pick up the work**, paste one of the guides in `prompts/` into a new conversation:
> [`figma-cross-check.md`](prompts/figma-cross-check.md) (continue the cross-check) or
> [`implement-component.md`](prompts/implement-component.md) (build a new component + story).

---

## Where we are

- **Form-field error messages — unified across all inputs (2026-09-18, on `main`, unpushed)** — every input-like component now takes an **`errorMessage`** prop as the canonical invalid signal: when truthy it flags the field invalid, red-borders the control, and renders the message below it (danger color), taking precedence over helper text — the same model as `Input`. Added to **SelectInput, Multiselect, Stepper, TimePicker (popover), DateInput, Checkbox, Switch, Radio, RadioGroup** (`feat` commit `db4e210`; `WithError` story on each). Also **fixed a latent bug** in `Input`/`Textarea`/`BottomLineInput`: `Field.Error` needs **`match={true}`** to render off an external `invalid` prop — without it Base UI reads `validityData.state.valid` (native constraint validation only), so the red border showed but the message never did (`fix` commit `49fbf0b`). Field-primitive controls (Select/Combobox/pickers) wrap in `Field.Root`; the invalid border is applied **explicitly** where the surface doesn't inherit `data-invalid` (Combobox chips, Popover triggers, Stepper's hand-rolled group). Checkbox/Switch/Radio drive the error color through their existing `validation` CVA. Inline calendar/wheel panes (`DatePicker`, `DualDatePicker`, `TimePicker mode="inline"`) are **out of scope** — no input to attach an error to. See memory `project-form-error-messages`.
- **Phase 3 buildout: complete** — 45 components shipped across Batches 0–7. All are drift-green (`pnpm -F @max-core/tokens drift`), typed, built (tsup), and have a Storybook story in a flat tiered folder (`<Tier>/<Component>`).
- **Phase 4 Batch 8/9 — lean v1 landed + cross-checked** — **Stacked List** (`StackedList` + variant-driven `StackedListRow`: default/social/media/product — 4 of the 9 master row types) and **Data Table** (`DataTable` column-config + exported `Table`/`HeaderCell`/`TableRow`/`TableCell` primitives + `RatingStars`, with sort, hover/selected rows, **optional `header` slot**, pagination `footer`, and **`selectable` row selection + select-all**). Both drift-green and contrast-green (light+dark) and visually cross-checked against the Figma masters (Stacked List set `2080:23144`, Table Builder `2768:2`) — core layouts faithful; the sort chevrons + selection column match. Deferred: remaining stacked row types (ride/delivery/booking/item-grid/transport), and the table's mobile scroll variant + expandable rows + the stats/tabs Table Header (a caller now composes that into the `header` slot).
- **Phase 3.5 visual cross-check: all exported files done** — every `figma-node-links/*.json` the designer has provided is cross-checked and moved to `figma-node-links/checked/`. Each was drift-green yet had appearance/axis gaps the raw tokens didn't capture (states, colors, missing axes/slots), now fixed. Further cross-checks resume when the designer drops new files into `figma-node-links/`. See the process in `PLAN.md → Phase 3.5`.
- **Phase 4 Batch 12 — Date Picker landed on `main` (2026-09-17)** — `DatePicker` (inline; `granularity` day/month/year), `DualDatePicker` (two-month range), and `DateInput` (popover field), built on **`react-day-picker@9`** restyled onto Max Core tokens via its `classNames`/`components` props (no CSS import; kept `external` in tsup so dist stays lean; first external UI dep after the dependency-free run). Public value model stays **ISO strings** (`"YYYY-MM-DD"`) / `{start,end}` ranges via a `date.ts` `Date↔ISO` boundary adapter (parsed at local noon to avoid TZ off-by-one). Custom `MonthCaption` override (rdp's default `Nav` renders as a sibling of the months and can't anchor to the caption → `hideNavigation` + our own header); the header month/year labels **drill down** to month/year pickers and back via a shared `displayMonth`. Drift-green (`SPECS` entry). Day picker visually cross-checked against the Figma master (`2486:6242`); **month/year render as grids — the Figma scroll-wheels are deferred** by decision. Commit `d17a0b7`. See memory `project-datepicker-react-build`.
- **Polish + scrollbar work landed on `main` (2026-09-13)** — small fixes: **Pagination** (all buttons uniform 32×32 = 24px content + 4px padding; active-page border kept `border/default` so it's visible in dark) `cc3bd4b`; **Textarea** focus ring (`block` on the textarea removes the inline-block descender gap that pushed the inset ring low at the bottom) `ef39b85`; **Switcher** no longer deselects the active item (drives the Base UI ToggleGroup as controlled, ignores empty selections) `89d2d2b`. New **scrollbar** capability `3c6e351`: `.styled-scrollbar` + `.scrollbar-none` utilities shipped from `@max-core/tokens/scrollbar.css`, the **ScrollBar** atom gained a driven mode (`thumbSize`/`thumbOffset`/`orientation`), and a new **ScrollArea** wrapper hides the native bar and renders ScrollBar as an *external* rail (vertical=right, horizontal=below) driven by scroll metrics with click/drag. See memory `reference-scrollbar-utilities`.

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

## Component inventory (52 shipped + stories)

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
| Knob | Atoms/Knob | ✅ |
| Spinner | Atoms/Spinner | ✅ |
| Thumbnail | Atoms/Thumbnail | ✅ |
| ScrollBar | Atoms/ScrollBar | ✅ | <!-- + driven mode: thumbSize/thumbOffset/orientation -->
| ScrollArea | Atoms/ScrollBar (ExternalRail stories) | — | <!-- wraps ScrollBar as an external rail -->

| TimePicker | Atoms/TimePicker | ✅ |
| StatusDot | Atoms/StatusDot | ✅ |
| ContentBlocks | Atoms/Content Blocks | ✅ |
| Checkbox | Atoms/Checkbox | ✅ |
| Radio | Atoms/Radio | ✅ |
| Switch | Atoms/Switch | ✅ |
| SegmentedControl | Atoms/Segmented Control | ✅ |
| ListItem | Atoms/List Item | ✅ |

### Molecules

| Component | Storybook title | Cross-check |
|-----------|-----------------|-------------|
| Input | Molecules/Input | ✅ |
| BottomLineInput | Molecules/Bottom Line Input | ✅ |
| SelectInput | Molecules/Select Input | ✅ |
| Multiselect | Molecules/Multiselect | ✅ |
| Stepper | Molecules/Stepper | ✅ |
| Textarea | Molecules/Textarea | ✅ |
| SearchBar | Molecules/Search Bar | ✅ |
| AvatarGroup | Molecules/Avatar Group | ✅ |
| EntityItem | Molecules/Entity Item | ✅ |
| EntityCard | Molecules/Entity Card | ✅ |
| Pin | Molecules/Pin | ✅ |
| FormGroup | Molecules/Form Group | ✅ |
| Range | Molecules/Range | ✅ |
| Pagination | Molecules/Pagination | ✅ |
| Switcher | Molecules/Switcher | ✅ |
| Tabs | Molecules/Tabs | ✅ |
| Dialog | Molecules/Dialog | ✅ |
| Dropdown | Molecules/Dropdown | ✅ |
| ItemList | Molecules/Item List | ✅ |
| Toast | Molecules/Toast | ✅ |
| ActionBar | Molecules/ActionBar | ✅ |
| DatePicker · DualDatePicker · DateInput | Molecules/Date Picker | ✅ day (master `2486:6242`); month/year = grid, wheels deferred |

### Organisms

| Component | Storybook title | Cross-check |
|-----------|-----------------|-------------|
| ShareItem | Organisms/Share Item | ✅ |
| StackedList | Organisms/Stacked List | ✅ lean v1 (4/9 row types) |
| DataTable | Organisms/Data Table | ✅ lean v1 (+header/selection) |
| StatsCard | Organisms/Stats Card | 🔄 deferred |
| BottomNavigation | Organisms/Bottom Navigation | ✅ |
| SideBar | Organisms/Side Bar | ✅ |
| TopBar | Organisms/Top Bar | ✅ |

> **StatsCard cross-check deferred.** The Figma masters (Stats card big/small/compact,
> 2440 nodes) are a full organism — header icon + overflow menu, info icon, series
> legend, line chart, and an Action Bar footer — across three size families. Our
> component is a simplified abstraction and is flagged in CLAUDE.md as paused pending a
> refactor. A faithful cross-check belongs with that refactor (Phase 4 scale), not this
> pass; everything else in the inventory is ✅.

### Foundations
- `Foundations/Tokens` — token reference story (not a component).
- `Foundations/Focus Ring` — documents utils/focus-ring.ts.
- `Foundations/Effects` — previews the shipped effect tokens.

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
- `field.ts` — `fieldSurface` (input surfaces; its `data-[invalid]:border-*` fires when a control inherits `data-invalid` from a Base UI `Field.Root invalid`). **Error-message convention:** every input takes `errorMessage?: ReactNode` — truthy = invalid; render it below the control (danger) with precedence over helper text, and remember `Field.Error match={true}` (see `project-form-error-messages`).

---

## Remaining work

1. **Phase 3.5 cross-check** — ✅ all exported files done (segmented-control, list-item, search-bar, dialog, top-bar, bottom-bar, sidebar). Resume when the designer drops new files into `figma-node-links/`.
2. **Phase 4 — mega-systems + test infra** — planned in **`PLAN.md → Phase 4`**. Batches: **8 Stacked List** ✅ lean v1 (default/social/media/product; remaining row types on demand) → **9 Data Table** ✅ lean v1 (column-config + primitives; mobile/expandable/Table-Header deferred) → **10 Card** → **11 Bottom Sheet** (+18 premades) → **12 Date Picker** ✅ (day/range/input; month/year grid — Figma wheels deferred) → **13 test infra** (vitest + RTL + axe). Batches 10 & 11 remain.
3. **Colour-contrast guardrail — shipped** (`pnpm -F @max-core/tokens contrast`): resolves every component's text/background pairing to hex in light + dark and flags any below WCAG AA (4.5 normal / 3 large). Reads source, never touches tokens.json; turbo `contrast` task reports non-blocking. Fixed the light-mode white-on-pale defects it caught (ListItem hover, EntityCard hover/selected). **11 dark-mode findings deferred** — the dark accent ramp is too light for white on-accent text, plus mid-tone text on subtle fills at 3.3–4.0; root-cause fix is Figma-side (adjust `accent/*` dark values + re-export), folded into the dark-mode visual pass. Extractor only sees within-className pairings; child-text-over-parent-surface needs `OVERRIDES[...].extra` in `contrast-audit.ts` if fuller coverage is wanted.

> Not yet visually cross-checked (built from tokens only): every component in
> the inventory below without a ✅ in the Cross-check column.

---

## Verify a change (run before every commit)

```bash
pnpm -F @max-core/react typecheck        # tsc --noEmit
pnpm -F @max-core/react build            # tsup (rebuild dist so Storybook + drift see it)
cd apps/storybook && npx tsc --noEmit -p tsconfig.json   # Storybook consumes built dist
pnpm -F @max-core/tokens drift           # spacing/size/radius conformance
pnpm -F @max-core/tokens contrast        # WCAG AA text/bg contrast, light + dark (reports; 11 dark-mode findings known/deferred)
npx biome check --write <changed files>
```

One commit per file/component; commit message notes the Figma finding.
