# Audit — Form Groups page (Phase 4.5)

- **Figma page:** Form Groups `2001:486`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Form Group `4011:1119` (set, Size S/M/L; Show Headline / Show Description, Title / Description, `Items` + `Items2` SLOTs); Premades Form Group `2325:12035` (Size × Type = Log in / Sign up / Reset password / Address / Payment)
- **React:** `FormGroup` (`premade` = the premade surface)
- **Audited:** 2026-10-24, via read-only `use_figma` bound-variable reads of both sets, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

## FormGroup

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Size S/M/L → `size`; Show Headline + Title → `headline`; Show Description + Description → `description`; Items slot → `children`; Action slot → `action`. ✅ `premade` = the Premades surface. The 5 premade Types (Log in, Sign up…) are compositions, not built (YAGNI). |
| 2 | States | n/a (layout primitive). |
| 3 | Colours | ✅ Title `text/primary`. ❌ Description was `text/secondary` → **[code]** `text/muted` (Body/SM/300). ✅ Premade `bg/surface`, border weight none (stroke `border/default` @ 0), no shadow. |
| 4 | Dimensions | ❌ **Size also sizes the content** (missed in the first pass, caught by the user): Size S/M/L uses Base Input S/M/L and Action Bar Buttons S/M/L. React's `size` only set the gaps → **[code]** FormGroup provides its size through `utils/form-group-size.ts`, and Input, BottomLineInput, Stepper, Textarea, SelectInput, Multiselect, Button and SplitButton use it when they have no `size` of their own. ✅ Gap 20/24/28, Headline Gap 12, Items Gap 12/16/20, Action Buttons Gap 8; premade radius md, padding S 16 / M 24. ❌ **Premade Size L padding is 40** (`Premade/*/Size L/Padding` → `- Spacing -/40`), but neither token nor `--spacing-40` is in the export → **Decision:** L keeps 24 until the re-export → [designer]/export. ✅ Width: masters are fixed (274/243/328); React fills its parent. |
| 5 | Typography | ❌ Title was `text-2xl` at every size → **[code]** Heading/H5 (24/120%/−0.5%) for S + M, **H4** (30) for L. ✅ Description Body/SM/300. |
| 6 | Anatomy | ✅ Headline → Items → Action. ❌ The Action is an **Action Bar** that fills the width; React's action row hugged its content (buttons stopped short) → **[code]** the slot's children fill (`flex-1`), the story uses `ActionBar`. |
| 7 | Focus | n/a (fields own theirs). |
| 8 | A11y | ✅ `Fieldset` + `Legend` for the headline. |
| 9 | Doc page | Says the Action Bar sits in the `Items2` slot, but `Items2` is bound to no node: each variant holds a fixed Action Bar instance → [designer]. |
| 10 | Story | ✅ Default (size control) + Premade; action uses `ActionBar`. |

**Contrast:** FormGroup entered the audit (`contrast-audit.ts` declares title + description on the premade `bg/surface`): passes light + dark. **17 / 29 components**, findings unchanged.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast. Playwright light + dark (S, L, Premade M): gaps 20/28/24, premade padding 24 + `bg/surface`, title 24/700/28.8 (S, M) and 30/700/36 (L) with −0.5% tracking, description 14/300 `text/muted`, action buttons fill the content width. Size propagation: inputs 40/44/56, buttons 32/40/48 for S/M/L.

## For the designer (→ PROGRESS.md)
- `Premade/*/Size L/Padding` (40) and `- Spacing -/40` are missing from the token export: re-export.
- `Items2` SLOT is bound to no node; the Action Bar is a fixed instance (the doc page says it's in `Items2`). Rename it to Action and bind it, or drop it.
- Size M's Action Bar is `Direction=Vertical` while S/L are Horizontal; Size S's Action Bar is FIXED 332 wide inside a 274 group (it overflows).
- The doc page doesn't say that Size also sizes the inputs and buttons inside (S/M/L → S/M/L).
