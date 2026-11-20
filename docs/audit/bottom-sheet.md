# Build — Bottom sheet page (Phase 4 Batch 11)

- **Figma page:** Bottom sheet `2075:11331`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Bottom Sheet Builder `2867:1937` (Show Handle / Show Header / Show Footer, Title, Body Content + Footer Content slots) · Premade Bottom sheets `2881:9262` (`Type`, 18 values, each a Builder instance with slot content)
- **React:** new `BottomSheet` on Base UI `Drawer` (`@base-ui/react@1.5`, already a dependency) + `Premade` story recipes. Shared `utils/close-button.tsx` (✕ styles + icon, now used by `Card` too).
- **Built:** 2026-10-25, from read-only `use_figma` reads of the builder (props, anatomy, bindings), every premade's slot content, nested button variants, and `tokens.json` (`--Organism/Bottom Sheet/*`)

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → build |
|---|---|---|
| 1 | API | Show Handle → `handle` (default true); Show Header + Title → `title` (header renders when set) + `showClose` / `closeLabel`; Body Content → `children`; Show Footer + Footer Content → `footer`. Behaviour (React): `trigger`, `open` / `defaultOpen` / `onOpenChange`; modal with focus trap, Esc, outside press and **swipe down to dismiss** (Base UI Drawer). Premades are content recipes in one `Premade` story (Type as a control), not library components. |
| 2 | States | n/a (container). ✕ hover `text/primary` + `focusRing` (React extension; the master's Close is bare vectors). |
| 3 | Colours | ✅ shell `bg/surface`, grabber `bg/subtle`, title `text/primary`, ✕ `text/muted`, `effect/shadow/up/md`. Backdrop `black/50` as `Dialog`. |
| 4 | Dimensions | ✅ width 375 in a 375 viewport (`max-w-lg` beyond it, **[deviation]**: the master is a phone frame); top Radius 2xl 24; Content Gap 16; Footer Padding Bottom 32 (or `env(safe-area-inset-bottom)`); handle 40 × 4 full radius, Handle Padding 8; header / footer Padding X 16; footer items 16 apart in equal columns (Button FILL → 164 each, matches). App Actions premade 334 = Figma 334. Header 26 vs 24 (H6 line box: the open cap-trim sweep). |
| 5 | Typography | ✅ title Heading/H6. |
| 6 | Anatomy | ✅ handle → header → body → footer. ❌ The builder's `Divider` instance above the footer renders nothing (0 height, no stroke) → **[code]** omitted. Height capped at the viewport − 48 with the body scrolling (header / footer stay) **[deviation]**. Without the handle the master starts flush at the top edge → **[deviation]** Padding Y 16 on top. |
| 7 | Focus | ✅ Focus moves into the sheet (✕ first) and is trapped; returns to the trigger on close. |
| 8 | A11y | ✅ `role="dialog"` + `aria-modal`, title labels the dialog (Drawer.Title); grabber `aria-hidden`; `motion-reduce` drops the slide. Contrast: BottomSheet ✓ — 31 findings / 19 of **34** components (coverage, no new findings). |
| 9 | Doc page | Builder `Close` frame has a hard-coded white fill (`#FFFFFF`, shows as a white square in dark mode in edits) and loose vectors; `Divider` instance is dead; `General Gap` (24) and `Padding Y` (16) bound nowhere; premade titles copied wrongly (Transport / Ride = "Share with", Sort = "Settings", Media / Auth hidden header "Add Payment Method"); General / Sort is a copy of Settings (no sort options); Info / Terms body text has no side padding (375 wide). |
| 10 | Story | `Default` (builder, Controls) + `Premade` (13 of 18 recipes): Share App Actions / Quick Contacts / Social List, General Feedback / Settings, Payment Method List / Add Card, Media Playlist, Auth Login, Commerce Cart / Filter, Info Terms, Booking Date Picker. **Deferred:** Transport / Map, Ride / Driver Details, Ride / Delivery Track, Booking / Place List (their Stacked List rows are deferred), General / Sort (duplicate in the master). |

## Code
1. `BottomSheet` (`components/BottomSheet/`), exported from the package; drift spec `Bottom Sheet` (General Gap exempt, unbound in Figma).
2. `utils/close-button.tsx`: `closeButtonStyles` + `CloseIcon`, shared by `Card` and `BottomSheet`.
3. Storybook `Organisms/Bottom Sheet`: `Default`, `Premade` (URL-safe ids mapped to the Type names: Storybook drops arg values containing "/").

**Verified:** typecheck, build, Storybook + showcase tsc, drift ✓, biome, contrast 31 / 19 of 34 (BottomSheet passes). Playwright at 375 × 812 against a static Storybook build (the running dev server's Vite pre-bundle predates the Drawer import → "504 Outdated Optimize Dep"; restart it): light + dark shell 375 wide, radius 24 0, `up/md` shadow, handle 40 × 4 `bg/subtle` at 8, header at 36, gaps 16, padding-bottom 32, footer buttons 164; all 13 premades render; Tab → ✕, Esc closes, trigger reopens, drag down on the sheet dismisses.

## For the designer (→ PROGRESS.md)
- Builder `Close` frame: hard-coded white fill + loose vectors (same as `_Card`); the `Divider` instance above the footer is dead.
- `General Gap` (24) and `Padding Y` (16) bound nowhere.
- Premade titles copied between variants (Transport / Ride "Share with", Sort "Settings"); General / Sort duplicates Settings; Info / Terms text has no side padding.
