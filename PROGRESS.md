# Max Core React — Progress & Handoff

> Living status doc for the `@max-core/react` buildout. Update it whenever a
> component is added or a `figma-node-links/*.json` file is cross-checked.
> Last updated: **2026-10-25** · Branch: **`main`** — all work lives here (feature branches merged + deleted); run `git status -sb` for unpushed commits
>
> **To pick up the work**, paste one of the guides in `prompts/` into a new conversation:
> [`component-audit.md`](prompts/component-audit.md) (continue the **Phase 4.5 audit**, current work),
> [`figma-cross-check.md`](prompts/figma-cross-check.md) (continue the cross-check) or
> [`implement-component.md`](prompts/implement-component.md) (build a new component + story).

---

## Where we are

- **Phase 4.5 component audit — in progress (2026-10-24, on `main`, unpushed)** — every shipped component is checked against its Figma doc page + master bindings, page by page (recipe: `docs/audit/README.md`; status table below). **Done (33 pages — Atoms tier complete; Molecules started):** Buttons `8fdfd7c`, Selection Controls `56d3b22` (+`2f0e3b8`), Segmented controls `771e83d`, Tag `d5f09c1` (+`f006888`), Badge `f18cc19`, List item (story-only fix; the component already matched after `679a87a`), Knob (Pressed stroke 1px; **Range thumb had no visible keyboard focus**, fixed with the new shared `focusRingWithin`), ScrollBar (driven rail now keeps the master's 4px end padding), Time picker (wheel rebuilt to the master: accent/subtle selector + accent/default centre, Body/MD/700 · SM/300 · Caption/300 rows with Items Gap, hug columns; trigger `focusBorder`; + row hover `text/accent` by request), Tooltips (shadow removed, arrow rebuilt to the master's size with Arrow Radius bound), Divider (thickness bound to the Border Weight token; Controls-driven story), Spinner (SVG rewrite to the master's proportional ring by decision; Inverse colours un-swapped; **breaking:** `tone` → `brand`/`neutral`/`inverse`; new XL `value` %), Progress Bar (`min` was silently dropped; range labels `aria-hidden`; labels stay opt-in by decision), Status Dot (Offline stroke `border/hover`, DND minus bar added, stroke bound to Border Weight), Avatar (new `status` + `statusLabel` = Figma ShowStatus, dot sized per Avatar tokens; root no longer clips), User (no React; EntityItem + Avatar M covers it, no code change), Thumbnail (matches; designer-only findings), Content blocks (ImagePlaceholder: square corners, 8px gap, 48px icon), **Inputs** (all six fields on the shared `utils/field.ts`: `focusBorder` everywhere, hover = `border/hover`, full Error colours, Body/MD/700 `text/secondary` titles → `text/accent` on focus, Caption/300 helpers, 8px gap, inside-stroke heights 40/44/56, whole-field disabled; new `variant`, `leadingIcon`/`trailingIcon`, Multiselect `size`/`disabled` + Badge chips + chevron, Stepper label association; **breaking:** `className` → field wrapper; `focusRingInset` removed), Search bar (shared field model: `focusBorder`, hover, inside-stroke heights 32/40/48; icons `text/secondary`; `leadingIcon`; clear ✕ `focusRing`; **breaking:** `className` → pill, `wrapperClassName` removed; per-size icons 16/20/24 by decision), Item List (ItemList re-confirmed; Select popup → Item List with Radio rows, no shadow; new Multiselect `mode="list"` = the Figma version with search + Select all + Checkbox rows, typeahead stays default; Select showed raw values, fixed via `items`; by request: 4px row gap + even 4px options padding inside the scroll (header keeps the 12 top) + fade while more rows remain (`ScrollArea` `data-overflow-*`); open trigger kept `border/accent` under hover), Dropdown (popup = Item List + List Item rows, no shadow, at least the trigger's width; new `open`/`defaultOpen`/`onOpenChange` = Figma Active; SplitButton's menu now shares it), Form Groups (Size now also sizes the inputs + buttons inside via a context, as the master; title H5 / H4 at L, description `text/muted`, action slot fills like the Action Bar; premade L padding stays 24 until the re-export), Date picker (edge-to-edge grid with flush 44px rows, continuous range band, Caption/700 days, Today `accent/default` circle + `text/accent`, ghost Button/Icon Only S header with month + year kept, outside days blank, S footer; hover = List Item wash by decision; DateInput on the shared field model with `size`, 12px gap, no shadow + `border/default`), Tabs (new Tabs `fill` underline/full; per-tab underline, outer-corner radius, bar hugs its tabs; active label stays `text/secondary` by decision; hover/pressed = List Item states by decision; disabled tabs never dimmed (Base UI `data-disabled`), fixed; Switcher hover = label `text/primary`; both on the shared `focusRing`), Pagination (hover `bg/subtle` + `text/accent` by decision, Figma pressed added, 32 × 32 icon buttons (inside stroke), **range bug**: page 2 / `count−1` pushed twice → duplicate keys + a stale button; now a constant-length window), Range (disabled now dims + freezes the knob look; labels 8 below the track like the master; fill no longer lags the thumb; no text selection while dragging; tooltip stays opt-in by decision), Entity Item (subtitle Caption/300; new `type` user/workspace = Figma Type, workspace title Body/LG/700; stories on Avatar S / Thumbnail S), User card (EntityCard: new `chevron` = Right Icon + rail-aware `collapsed` = Collapse; title Body/SM/700 in the card; pressed text colour never reached the title, fixed; subtitle + chevron follow the state colour), Avatar group (default size XS as the master; separator is the master's inside 1px stroke, was an outside ring; counter reads "N more"), Pin (new `type` icon/avatar = Figma Type; icon circle lost its invented border + shadow, 32px icon; avatar gets the master's inside 2px `border/accent` ring; tail `accent/default`, round end), Action bar (horizontal = equal grid columns, a bordered button was 2px wider under `flex: 1`; story title `Molecules/Action Bar`), Toast (Default + Loading tones (Spinner XL with %) and the master's tone-coloured Link Button action added; body in the tone colour, Body/SM/300; row centred; lucide icons; ✕ kept as a deviation). Decisions: no hover wash, value/placeholder keep 12/14/16 regular, Success skipped. Main outcomes: typography drift on almost every page (labels one step too big / wrong weight); SplitButton focus ring clipped; Switch Off state rebuilt; SegmentedControl could be deselected; Fab speed-dial items had no accessible names; Tag became a clickable filter chip (`<button aria-pressed>` when `onClick`/`selected`); outline borders now use `status/*/border` (shared `statusBorderOutline`). **User decisions so far:** secondary buttons transparent; IconOnly keeps elevation; SplitButton keeps ghost+tone; selection-control hover/pressed = Figma's solid fills; controls top-aligned with labels; Figma colours kept even when they fail contrast (Segmented, Tag outline) → designer list. Contrast baseline moved 13/12 → **24 findings / 15 components** (now 25 findings / 16 of 27 after the Inputs pairings; 27 / 17 of 28 after Item List, where ListItem's dark selected/pressed rows entered the audit; 27 / 17 of 29 after Form Groups and Date picker; 29 / 19 of 30 after Tabs (Switcher resting label 3.86 and Tabs Full active 4.26 declared, both kept as Figma); 30 / 19 of 30 after Pagination; **30 / 19 of 31** after Range — the extractor now strips comments (an apostrophe in a comment had hidden Pagination, Tabs pressed and Radio)) (coverage gains, not regressions). **Next page: Dialogs.**
- **List Item + Item List re-cross-checked via Figma MCP (2026-10-23, on `main`, unpushed)** — a fresh read of the masters showed both had drifted despite being ✅. **ListItem** (set `7198:27`): label was inheriting 16px (48px rows) → **Caption/700 `text-xs`** (44px rows, matches); new **`supportText`** (Caption/300, Label Helper Gap 4px) and **`level`** (Level 1/2 indent, spacing 12/24). Deliberate deviations from the master, all contrast-driven: hover support text `text/primary` (Figma's `on-accent-muted` = 1.1:1), pressed label stays `text/on-accent` (Figma's `text/primary` = 2.3:1) — flag to the designer. Knock-on: SideBar nav rows are now 12px text, 4px shorter. Commit `679a87a`. **ItemList** (master `2344:4399`): rebuilt to the master's structure — `search` (size-S SearchBar), `selectAll` (checkbox row, a `<label>` to avoid nesting in a button), `showDivider`, `showScrollBar` (ScrollArea rail, flush right) + the slot; rows stack flush (the 8px gap was wrong); **breaking:** invented `label`/`helper` removed. Colors confirmed `bg/surface` + `border/default` — the Figma doc page's `bg/elevated`/`border/muted` text is stale. Drift exempts `--spacing-04` (Label Helper Gap is bound in ListItem). Commit `4941d6f`.
- **State-ownership convention + self-managing SideBar (2026-09-18, on `main`, unpushed)** — codified how toggle-able components handle state (new **`packages/react/README.md`**), and gave **SideBar** a real collapse toggle. Three-way rule: **hybrid** (`value`/`defaultValue`/`onValueChange`, or a domain-named trio) for state a component *owns*; **pure controlled** (no fallback) for state that mirrors external/derived truth — **BottomNavigation & Pagination stay as-is** (route/query-driven); **stateless** for atoms (`Tag`). Extracted the controlled/uncontrolled reconciliation that was hand-rolled **4×** into one shared hook **`utils/useControllableState<T>(controlled, defaultValue, onChange, fallback)`** and refactored **DatePicker** (×3), **TimePicker**, **Switcher**, **DataTable** (sort + selection) onto it (side effect: DataTable now also fires `onSortChange` in uncontrolled mode — the correct hybrid behavior). **SideBar** gained `collapsed` + `defaultCollapsed` + `onCollapsedChange` and self-manages when uncontrolled; the rail context (`utils/rail-context.ts`) now carries `{ collapsed, toggle }`, a new **`SideBarTrigger`** (dropped into the `topBar` slot) flips it, and `useRail`/`useRailCollapsed`/`useControllableState` are exported for composing collapse-aware top bars. Also fixed the earlier overflow report: nav is `min-h-0 overflow-y-auto` (styled-scrollbar) so a tall rail scrolls; collapsed goes icon-only via the context (ListItem already, **EntityItem** gained a collapsed mode). Commit `39d5d81`. See memory `reference-controllable-state-convention`.
- **Form-field error messages — unified across all inputs (2026-09-18, on `main`, unpushed)** — every input-like component now takes an **`errorMessage`** prop as the canonical invalid signal: when truthy it flags the field invalid, red-borders the control, and renders the message below it (danger color), taking precedence over helper text — the same model as `Input`. Added to **SelectInput, Multiselect, Stepper, TimePicker (popover), DateInput, Checkbox, Switch, Radio, RadioGroup** (`feat` commit `db4e210`; `WithError` story on each). Also **fixed a latent bug** in `Input`/`Textarea`/`BottomLineInput`: `Field.Error` needs **`match={true}`** to render off an external `invalid` prop — without it Base UI reads `validityData.state.valid` (native constraint validation only), so the red border showed but the message never did (`fix` commit `49fbf0b`). Field-primitive controls (Select/Combobox/pickers) wrap in `Field.Root`; the invalid border is applied **explicitly** where the surface doesn't inherit `data-invalid` (Combobox chips, Popover triggers, Stepper's hand-rolled group). Checkbox/Switch/Radio drive the error color through their existing `validation` CVA. Inline calendar/wheel panes (`DatePicker`, `DualDatePicker`, `TimePicker mode="inline"`) are **out of scope** — no input to attach an error to. See memory `project-form-error-messages`.
- **Phase 3 buildout: complete** — 45 components shipped across Batches 0–7. All are drift-green (`pnpm -F @max-core/tokens drift`), typed, built (tsup), and have a Storybook story in a flat tiered folder (`<Tier>/<Component>`).
- **Phase 4 Batch 8/9 — lean v1 landed + cross-checked** — **Stacked List** (`StackedList` + variant-driven `StackedListRow`: default/social/media/product — 4 of the 9 master row types) and **Data Table** (`DataTable` column-config + exported `Table`/`HeaderCell`/`TableRow`/`TableCell` primitives + `RatingStars`, with sort, hover/selected rows, **optional `header` slot**, pagination `footer`, and **`selectable` row selection + select-all**). Both drift-green and contrast-green (light+dark) and visually cross-checked against the Figma masters (Stacked List set `2080:23144`, Table Builder `2768:2`) — core layouts faithful; the sort chevrons + selection column match. Deferred: remaining stacked row types (ride/delivery/booking/item-grid/transport), and the table's mobile scroll variant + expandable rows + the stats/tabs Table Header (a caller now composes that into the `header` slot).
- **Phase 3.5 visual cross-check: all exported files done** — every `figma-node-links/*.json` the designer has provided is cross-checked and moved to `figma-node-links/checked/`. Each was drift-green yet had appearance/axis gaps the raw tokens didn't capture (states, colors, missing axes/slots), now fixed. Further cross-checks resume when the designer drops new files into `figma-node-links/`. See the process in `PLAN.md → Phase 3.5`.
- **Phase 4 Batch 12 — Date Picker landed on `main` (2026-09-17)** — `DatePicker` (inline; `granularity` day/month/year), `DualDatePicker` (two-month range), and `DateInput` (popover field), built on **`react-day-picker@9`** restyled onto Max Core tokens via its `classNames`/`components` props (no CSS import; kept `external` in tsup so dist stays lean; first external UI dep after the dependency-free run). Public value model stays **ISO strings** (`"YYYY-MM-DD"`) / `{start,end}` ranges via a `date.ts` `Date↔ISO` boundary adapter (parsed at local noon to avoid TZ off-by-one). Custom `MonthCaption` override (rdp's default `Nav` renders as a sibling of the months and can't anchor to the caption → `hideNavigation` + our own header); the header month/year labels **drill down** to month/year pickers and back via a shared `displayMonth`. Drift-green (`SPECS` entry). Day picker visually cross-checked against the Figma master (`2486:6242`); **month/year render as grids — the Figma scroll-wheels are deferred** by decision. Commit `d17a0b7`. See memory `project-datepicker-react-build`.
- **Polish + scrollbar work landed on `main` (2026-09-13)** — small fixes: **Pagination** (all buttons uniform 32×32 = 24px content + 4px padding; active-page border kept `border/default` so it's visible in dark) `cc3bd4b`; **Textarea** focus ring (`block` on the textarea removes the inline-block descender gap that pushed the inset ring low at the bottom) `ef39b85`; **Switcher** no longer deselects the active item (drives the Base UI ToggleGroup as controlled, ignores empty selections) `89d2d2b`. New **scrollbar** capability `3c6e351`: `.styled-scrollbar` + `.scrollbar-none` utilities shipped from `@max-core/tokens/scrollbar.css`, the **ScrollBar** atom gained a driven mode (`thumbSize`/`thumbOffset`/`orientation`), and a new **ScrollArea** wrapper hides the native bar and renders ScrollBar as an *external* rail (vertical=right, horizontal=below) driven by scroll metrics with click/drag. See memory `reference-scrollbar-utilities`.

### For the designer (Figma-side fixes)
- **Retracted:** the "text box stuck at 9–12px" items below (Segmented, Badge, Time picker, Tooltips, Progress Bar, Date picker weekday, Inputs placeholders) are **not** Figma bugs. Every text style uses leading trim (cap height), so those frame heights are correct and React is the one that's taller → the cap-trim sweep under Carry-overs.
- **Item List doc page** text says `bg/elevated` + `border/muted`; the master binds `bg/surface` + `border/default`.
- **List Item master colors** (React deviates deliberately): hover support text `text/on-accent-muted` (1.1:1 on `accent/subtle`); Pressed label `text/primary` (2.3:1 on `accent/active`); Active+Collapsed icon `text/primary` (expanded Active uses `text/on-accent`); Disabled support text `text/on-accent-muted`.
- **Dark accent ramp** too light for white `text/on-accent` (see Remaining work → contrast).
- **Buttons page** (full list in `docs/audit/buttons.md`): unify focus on `.Focus-ring` + a Focused BOOLEAN (Button/Split use ad-hoc `Focus` rects in `border/accent` 1px INSIDE; Button/FAB/Link use State=Focused); bind the `.Focus-ring` master stroke to `/thick` (it's 1px unbound, the description says 2px); Icon Only disabled = opacity only (drop the `bg/subtle` swap and the second icon dim); Icon Only Secondary stroke → `border/accent`; FAB: add Hover, Pressed/Disabled → state layer and opacity, item label `Palette/neutral/500` → `text/secondary`; Link disabled keeps the tone colour; Split L Icon button height is bound to the stale `Atoms/Buttons/IconOnly/LG/Height`; Split doc focus text is stale.
- **Selection Controls page** (full list in `docs/audit/selection-controls.md`): solid unchecked Hover/Pressed fills (shipped as-is by decision; Pressed and Error Hover are darker than checked); Checkbox focus: wrapper ring is malformed (14×4 sliver below the box) and the inner set duplicates `Focused` + ring (keep one, around the box, at 2px); Radio and Switch have no Disabled; Checkbox Disabled swaps its stroke; Checkbox Success unchecked stroke `/default` → `/border`; Checkbox M icon bound to an orphan `---` token; label type SM (Checkbox/Radio) vs MD (Switch); React top-aligns the control.
- **Segmented controls page** (`docs/audit/segmented-controls.md`): inactive label `text/secondary` on `bg/subtle` fails AA (3.86 light / 4.04 dark), shipped as-is by decision; items need a Focused BOOLEAN + `.Focus-ring`; item label text box is stuck at 10px high (item renders 26px instead of about 34px).
- **Tag page** (`docs/audit/tag.md`): wrapper Focused → BOOLEAN; overlay opacities bound to `opacity/disabled`/`opacity/dim` instead of hover/pressed; `overlay/hover` is indigo for every tone (status chips turn purple-ish on hover); Outline Default `text/secondary` on `bg/subtle` fails AA (3.86 light), shipped as-is.
- **Badge page** (`docs/audit/badge.md`): label text box is stuck at 9px high (frames render 21/25/29 instead of about 28/32/36). Same stale-text-box artifact as the Segmented item.
- **List item page** (`docs/audit/list-item.md`): Label Helper Gap bound to `-- Molecule/Item List/Label Helper Gap` (needs its own `-- Atoms/List Item/` token); Disabled variants have no Level spacers; `.Focus-ring` instances at −2/−2.5 with radius 0 instead of −3 STRETCH (all bind `/thick` 2px, unlike the 1px rings elsewhere).
- **Knob page** (`docs/audit/knob.md`): Disabled `off`/`on` → `Off`/`On`; Pressed handle stroke is an unbound 1px (bind `/thin`); container `itemSpacing` bound to `Spacing/10` with one child; doc page says Switch uses the Knob (it has its own).
- **ScrollBar page** (`docs/audit/scrollbar.md`): page name typo "ScollBar"; thumb `accent/subtle` on `bg/default` is about 1.2:1 in light (barely visible); doc page shows no value for Thumb Width.
- **Time picker page** (`docs/audit/time-picker.md`): centre `accent/default` on `accent/subtle` = 3.33 dark (fails AA, shipped as-is by decision); unselected period bound to `accent/subtle` (~1.2:1; React uses `text/secondary` @ dim); row text boxes stuck at 9–12px (frame 135×146 vs ~150×192); `Period Bottom Padding` documented but unbound; React added a row hover (`text/accent` + full opacity, user request), so a Hover spec is needed.
- **Tooltips page** (`docs/audit/tooltips.md`): Position values name the arrow edge (Position=Bottom = tooltip above the trigger), so rename them or document it; text box stuck at 9px (frames 41 instead of about 48); `minWidth` bound to Size/24 can never apply, and no max width is specified.
- **Divider page** (`docs/audit/divider.md`): nothing blocking. Optional: add a vertical variant (React ships one), or drop the single-value Style axis.
- **Spinner page** (`docs/audit/spinner.md`): ring thickness comes from the arcs' innerRadius, and the bound Track/Indicator Stroke tokens sit on unpainted strokes (drive the ring from them or remove them); Inverse arc hard to see in dark; % label `text/primary` even for Inverse; "100%" overflows the XL hole.
- **Progress Bar page** (`docs/audit/progress-bar.md`): track stroke weight bound to orphan variables `Atoms/Progress Bar/Size s|m|Lg/Border Weight` (rebind to `-- Atoms/Progress Bar/Global/Border Weight`); Value=100 Size=S fill radius bound to Size L/Radius; child layer names differ per Value variant; label text boxes 9px tall.
- **Status Dot page** (`docs/audit/status-dot.md`): doc text misses the Offline `border/hover` stroke and the DND minus bar; set named `.Status-avatar` instead of Status Dot.
- **Avatar page** (`docs/audit/avatar.md`): nested `.Status-avatar` height bound to `-- Atoms/Status Dot/Size` (8) though it renders 16/16/20 on M/L/XL (bind it like the width, to `Size */Status Dot Size`); property `ShowStatus` → `Show Status`.
- **User page** (`docs/audit/user.md`): User duplicates Entity Item with parallel tokens (`-- Atoms/User/Global/*` = `-- Molecule/Entity Item/*` values); make it a preset or alias the tokens.
- **Thumbnail page** (`docs/audit/thumbnail.md`): Circle BG radius bound to `-- Atoms/Avatar/Global/Radius` (cross-component; use Thumbnail Radius Circle); hidden `.Status-avatar` in every variant with no property to show it; inconsistent size bindings (XS on the component, S–XL width on the BG).
- **Content blocks page** (`docs/audit/content-blocks.md`): no documentation frame and no master descriptions; Image Placeholder icon strokes hardcoded `#94A3B8` (bind `text/muted`); inner frames named `Frame 1`/`Frame 2`.
- **Inputs page** (`docs/audit/inputs.md`): remove the hidden `.Focus-ring` in every Input frame; align the hover/pressed state layers (40%/70% `opacity/disabled`/`overlay` wash on Base/Bottom Line vs 20%/35% Textarea vs non-mode-aware black on Select); Active vs Focused overlap; bold Caption/700 placeholders (confirm); Bottom Line Items Gap bound to an old `---` token, `Padding` vs `Padding X` naming; Textarea S/M lack Items Gap; Stepper title scales per size + `0` in `text/muted`; `opacity/disabled` vs `- opacity -/disabled`; Select/Multiselect Disabled as a State value; Multiselect single-option `Expanded`, mixed Outline/Default chips; Secondary only on 3 of 6.
- **Search bar page** (`docs/audit/search-bar.md`): all variants bind `Size S/Icon Size` (rebind M/L to 20/24); placeholder Caption/300 at every size; no hover/focus/disabled states on the master; the button's radius is overridden to full but its State Layer keeps radius 12; the button is hand-sized to 72/74px (16px label inset) instead of a padding token; doc page colours stale (`bg/elevated`/`border/muted` vs `bg/default`/`border/default`).
- **Item List page** (`docs/audit/item-list.md`): React deviates by request (4px row gap, 4px side inset, bottom padding scrolls + fade); consider it for the master. "Sellect all" typo; `-- Molecule/Item List/Gap` bound nowhere, `Divider Stroke` not bound on the Divider; Select/Multiselect Active lists have no shadow (decide if floating lists lift); Multiselect's list sits ≈4px below the field (absolute) vs Select's 8 (Items Gap).
- **Dropdown page** (`docs/audit/dropdown.md`): `Item List Padding` is bound on the list's left only (4px narrower than the trigger, flush right; React aligns the list with the trigger); `zIndex/dropdown` from the doc page isn't exported.
- **Form Groups page** (`docs/audit/form-groups.md`): `Premade/*/Size L/Padding` (40) + `- Spacing -/40` missing from the export (React keeps 24 for L until re-export); `Items2` SLOT bound to nothing (Action Bar is a fixed instance); Size M Action Bar Vertical vs S/L Horizontal; Size S Action Bar FIXED 332 in a 274 group.
- **Date picker page** (`docs/audit/date-picker.md`): day Hover `accent/hover` + white = 1.91 light (React: List Item wash), Pressed 1.91 dark; Middle Pressed bound to `overlay/*`; blank cells are an empty `_Day Item` variant; Footer Padding X/Y unbound; weekday text box stuck at 9px; Input Date Picker pane has no edge (React adds `border/default`); header shows month only (React: month + year buttons).
- **Tabs page** (`docs/audit/tabs.md`): Tab Item Hover `overlay/hover` + white = 1.91 light, Pressed `accent/default` + white = 2.85 dark (React: List Item states); active label stays `text/secondary` (Underline selection = a 1px line only; Full active 4.26 / 4.46 on `accent/surface`); Full Disabled has no opacity; Tabs Group `Show Divider` bound to nothing (5 hidden unbound Divider vectors); Switcher Hover/Pressed fill `bg/subtle` = container colour (invisible), resting label 3.86 / 4.04; Switcher Active shadow raw, not the effect style; doc says Switcher is a slot pattern (no SLOT prop); neither has focus.
- **Pagination page** (`docs/audit/pagination.md`): Hover `overlay/hover` + `text/accent` fails AA (3.15 / 3.96; React `bg/subtle` + `text/accent`); Pressed `overlay/pressed` + white 1.91 dark; ad-hoc `Focus` rect (1px, radius bound to a Standard Button token) → `.Focus-ring`; `.Pagination Content` masters stroke `border/accent`, overridden in every instance; no ellipsis item.
- **Range page** (`docs/audit/range.md`): `Show Tooltip` defaults to true (React opt-in by decision); the Knob frame's 16 gap is unbound (doc says Tooltip Knob Gap); no Disabled state.
- **Entity Item page** (`docs/audit/entity-item.md`): User's subtitle is Body/SM/300, Entity Item's Caption/300 for the same pattern.
- **User card page** (`docs/audit/user-card.md`): Hover / Pressed title `text/on-accent` fails (light hover ~1.9, dark pressed) and the chevron stays `accent/default` on the washes (React: text/primary · on-accent-muted, chevron + subtitle follow); `General Gap` unbound; Collapse=On 64 wide with the avatar left-aligned (make it a centred 56 square); `.Focus-ring` 1px.
- **Avatar group page** (`docs/audit/avatar-group.md`): `Counter Size` token bound nowhere (the counter uses Avatar XS Size).
- **Pin page** (`docs/audit/pin.md`): `Avatar Stroke Weight` unbound (Avatar's 2px stroke hard-coded); doc page lists `bg/surface`, the master uses `accent/default` / `border/accent` / `text/on-accent`.
- **Action bar page** (`docs/audit/action-bar.md`): `Button Min Width` (160) bound nowhere though the doc calls it token-controlled.
- **Toast page** (`docs/audit/toast.md`): tone icons 48 + unbound while `Icon Size` (32) is bound nowhere; content gap 10 unbound / off-scale; strokes bound at weight 0; no dismiss control (React keeps ✕).

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
| StatusDot | Atoms/Status Dot | ✅ |
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

0. **Phase 4.5 — Component audit (NEXT, before Batch 10)** — every shipped component vs its Figma doc page, page by page from `figma-node-links/catalog.json`. Process + checklist + order: **`PLAN.md → Phase 4.5`**. Findings in `docs/audit/<slug>.md`; status in the table below.
1. **Phase 3.5 cross-check** — ✅ all exported files done (segmented-control, list-item, search-bar, dialog, top-bar, bottom-bar, sidebar). Resume when the designer drops new files into `figma-node-links/`.
2. **Phase 4 — mega-systems + test infra** — planned in **`PLAN.md → Phase 4`**. Batches: **8 Stacked List** ✅ lean v1 (default/social/media/product; remaining row types on demand) → **9 Data Table** ✅ lean v1 (column-config + primitives; mobile/expandable/Table-Header deferred) → **10 Card** → **11 Bottom Sheet** (+18 premades) → **12 Date Picker** ✅ (day/range/input; month/year grid — Figma wheels deferred) → **13 test infra** (vitest + RTL + axe). Batches 10 & 11 remain.
3. **Colour-contrast guardrail — shipped** (`pnpm -F @max-core/tokens contrast`): resolves every component's text/background pairing to hex in light + dark and flags any below WCAG AA (4.5 normal / 3 large). Reads source, never touches tokens.json; turbo `contrast` task reports non-blocking. Fixed the light-mode white-on-pale defects it caught (ListItem hover, EntityCard hover/selected). **Open: 30 findings across 19 of 31 components (as of 2026-10-24, end of the Range page).** Almost all are dark-mode only: the dark accent ramp is too light for white `text/on-accent` (`accent/default` 2.85, `accent/active` 1.91 — Button family, Fab, ListItem, Pin, SegmentedControl, DatePicker selected/pressed, Avatar), plus mid-tone text on subtle/surface fills at 3.3–4.0 (ShareItem, BottomNavigation, ContentBlocks, Thumbnail); TimePicker centre 3.33, Segmented / Tag Outline / Switcher `text/secondary` on `bg/subtle` and Tabs Full active `text/secondary` on `accent/surface` (4.26) are kept as Figma by decision. Root-cause fix is Figma-side (adjust `accent/*` dark values + re-export), folded into the dark-mode visual pass. ~~Pagination hover~~ fixed on the Pagination page (`bg/subtle` + `text/accent`). Extractor only sees within-className pairings; child-text-over-parent-surface needs `OVERRIDES[...].extra` in `contrast-audit.ts` if fuller coverage is wanted.

> Not yet visually cross-checked (built from tokens only): every component in
> the inventory below without a ✅ in the Cross-check column.

## Audit status (Phase 4.5)

| Page | Components | Status |
|------|-----------|--------|
| Buttons | Button, IconOnlyButton, SplitButton, Fab, LinkButton | ✅ 2026-10-24 — [audit](docs/audit/buttons.md) |
| Selection Controls | Checkbox, Radio, Switch | ✅ 2026-10-24 — [audit](docs/audit/selection-controls.md) |
| Segmented controls | SegmentedControl | ✅ 2026-10-24 — [audit](docs/audit/segmented-controls.md) |
| Tag | Tag | ✅ 2026-10-24 — [audit](docs/audit/tag.md) |
| Badge | Badge | ✅ 2026-10-24 — [audit](docs/audit/badge.md) |
| List item | ListItem | ✅ 2026-10-24 — [audit](docs/audit/list-item.md) |
| Knob | Knob | ✅ 2026-10-24 — [audit](docs/audit/knob.md) |
| ScrollBar | ScrollBar, ScrollArea | ✅ 2026-10-24 — [audit](docs/audit/scrollbar.md) |
| Time picker | TimePicker | ✅ 2026-10-24 — [audit](docs/audit/time-picker.md) |
| Tooltips | Tooltip | ✅ 2026-10-24 — [audit](docs/audit/tooltips.md) |
| Divider | Divider | ✅ 2026-10-24 — [audit](docs/audit/divider.md) |
| Spinner | Spinner | ✅ 2026-10-24 — [audit](docs/audit/spinner.md) |
| Progress Bar | ProgressBar | ✅ 2026-10-24 — [audit](docs/audit/progress-bar.md) |
| Status Dot | StatusDot | ✅ 2026-10-24 — [audit](docs/audit/status-dot.md) |
| Avatar | Avatar | ✅ 2026-10-24 — [audit](docs/audit/avatar.md) |
| User | — (covered by EntityItem) | ✅ 2026-10-24 — [audit](docs/audit/user.md) |
| Thumbnail | Thumbnail | ✅ 2026-10-24 — [audit](docs/audit/thumbnail.md) |
| Content blocks | HeadingBlock, TextBlock, ImagePlaceholder | ✅ 2026-10-24 — [audit](docs/audit/content-blocks.md) |
| Inputs | Input, BottomLineInput, Stepper, Textarea, SelectInput, Multiselect | ✅ 2026-10-24 — [audit](docs/audit/inputs.md) |
| Search bar | SearchBar | ✅ 2026-10-24 — [audit](docs/audit/search-bar.md) |
| Item List | ItemList (+ Select / Multiselect popups) | ✅ 2026-10-24 — [audit](docs/audit/item-list.md) |
| Dropdown | Dropdown (+ SplitButton menu) | ✅ 2026-10-24 — [audit](docs/audit/dropdown.md) |
| Form Groups | FormGroup | ✅ 2026-10-24 — [audit](docs/audit/form-groups.md) |
| Date picker | DatePicker, DualDatePicker, DateInput | ✅ 2026-10-24 — [audit](docs/audit/date-picker.md) |
| Tabs | Switcher, Tabs | ✅ 2026-10-24 — [audit](docs/audit/tabs.md) |
| Pagination | Pagination | ✅ 2026-10-24 — [audit](docs/audit/pagination.md) |
| Range | Range | ✅ 2026-10-24 — [audit](docs/audit/range.md) |
| Entity Item | EntityItem | ✅ 2026-10-24 — [audit](docs/audit/entity-item.md) |
| User card | EntityCard | ✅ 2026-10-25 — [audit](docs/audit/user-card.md) |
| Avatar group | AvatarGroup | ✅ 2026-10-25 — [audit](docs/audit/avatar-group.md) |
| Pin | Pin | ✅ 2026-10-25 — [audit](docs/audit/pin.md) |
| Action bar | ActionBar | ✅ 2026-10-25 — [audit](docs/audit/action-bar.md) |
| Toast | Toast | ✅ 2026-10-25 — [audit](docs/audit/toast.md) |
| Dialogs | Dialog | ⏳ next |

_Rows are added as each page is audited (order in `PLAN.md → Phase 4.5`)._

**Carry-overs to later pages:**
- **Cap-trim sweep (cross-cutting, decided 2026-10-24: one focused pass).** Figma text styles all use leading trim (cap height); React renders full line boxes (and Tailwind `text-sm` is a 20px line vs 18.2), so every padding-hugged part is ~7–8px taller than its master: Tabs 45 vs 34, Badge ~28/32/36 vs 21/25/29, Segmented item ~34 vs 26, Switcher, Tag, Time picker rows, Progress Bar / Range labels, Date picker weekday row, Input placeholders, Entity Item labels (48 vs 32 with a subtitle) (fixed-height parts are fine). Toast's title/body have no gap because the untrimmed line boxes supply the master's 10px; trimming them needs a 10px gap back. Tooltip + Range bubble done (`[text-box:trim-both_cap_alphabetic]`, 40.8 vs 41). Pick the mechanism for the sweep (CSS trim — exact in Chrome/Edge 133+, Safari 18.2+, falls back to today elsewhere — or padding compensation), then re-measure each against its master.
- ~~**Item List page → Multiselect "list" version.**~~ Done on the Item List page (`mode="list"`), with the Select popup rows.
- ~~**Entity Item page:** subtitle weight~~ done on the Entity Item page (master: Caption/300).
- **TimePicker popover trigger** still uses the legacy field (fixed 240 wide, `text-sm` label, shadow md, 8px offset). DateInput moved to the shared field model on the Date picker page; align TimePicker the same way (small follow-up, any time).

---

## Verify a change (run before every commit)

```bash
pnpm -F @max-core/react typecheck        # tsc --noEmit
pnpm -F @max-core/react build            # tsup (rebuild dist so Storybook + drift see it)
cd apps/storybook && npx tsc --noEmit -p tsconfig.json   # Storybook consumes built dist
pnpm -F @max-core/tokens drift           # spacing/size/radius conformance
pnpm -F @max-core/tokens contrast        # WCAG AA text/bg contrast, light + dark (reports; 25 known findings in 16 components — compare the count before/after)
npx biome check --write <changed files>
```

One commit per file/component; commit message notes the Figma finding.
