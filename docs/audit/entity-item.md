# Audit — Entity Item page (Phase 4.5)

- **Figma page:** Entity Item `2177:19`, Max Core file `sX5tikviuBEhNbu2iPVya5` (doc frame `7224:12680`)
- **Master:** Entity Item `2597:2582` (COMPONENT_SET: `Type` User / Workspace; `Username`, `Subtitle`, `Workspace Title`, `Workspace Helper` TEXT; `Show Subtitle` BOOLEAN, default false)
- **React:** `EntityItem` (leading slot + title / subtitle + trailing slot; collapses in a rail)
- **Audited:** 2026-10-24, via a read-only `use_figma` read of the set, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ❌ **Type** had no prop → **[code]** `type: 'user' \| 'workspace'` (default user); Workspace = the larger title. ✅ Username / Workspace Title → `title`; Subtitle / Workspace Helper + Show Subtitle → `subtitle` (omit to hide). The leading visual is a slot (`leading`): Type=User puts an **Avatar S**, Type=Workspace a **circular Thumbnail S** in it. `trailing` and `collapsed` (rail mode) are React-only [deviation, kept: SideBar / Data Table use them]. |
| 2 | States | n/a (not interactive; EntityCard owns the states). |
| 3 | Colours | ✅ Title `text/primary`, subtitle `text/secondary`. |
| 4 | Dimensions | ✅ Gap 8, Label Gap 8; Avatar Radius / Border come with the composed Avatar (drift exempts `--radius-full`). ❌ Row height: React 48 vs the master's 32 with a subtitle (title + 8 + subtitle, measured cap-to-baseline because of leading trim) → the **cap-trim sweep** (PROGRESS, decided as one pass). |
| 5 | Typography | ❌ **Subtitle** was `text-sm` regular (14/400); the master is **Caption/300** (12 light) in both types → **[code]** `text-xs font-light`. Resolves the carry-over from the User page (whose own master says Body/SM/300 — a User-vs-Entity-Item difference, on the designer list). ❌ Workspace title is **Body/LG/700** → `type="workspace"` → `text-lg`. ✅ User title Body/MD/700. |
| 6 | Anatomy | ✅ Leading → Labels (vertical, Label Gap) — React adds a trailing slot. Labels FILL in User, HUG in Workspace; React's `flex-1` keeps a trailing item at the end in both. |
| 7 | Focus | n/a (not focusable). |
| 8 | A11y | ✅ Plain text; the leading Avatar / Thumbnail carry their own alt. Contrast: `text/secondary` on the page passes (no own background, so not in the audit). |
| 9 | Doc page | ✅ 4 tokens, chains and the atoms list match. |
| 10 | Story | ❌ Stories used Avatar M; the master uses S → fixed. New **Workspace** story (`type` + circular Thumbnail S). The SideBar story's "Max core v0.9" header is a workspace → now `type="workspace"` + Thumbnail. |

## Code fixes applied
1. Subtitle Caption/300 (`text-xs font-light`).
2. New `type` prop: `workspace` → Body/LG/700 title.
3. Stories: Avatar S; Workspace story; SideBar header as a workspace.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31, component list identical). Playwright light + dark: title 16/700 (workspace 18/700) `text/primary`, subtitle 12/300 `text/secondary`.

## For the designer (→ PROGRESS.md)
- User's subtitle is Body/SM/300 but Entity Item's is Caption/300 for the same pattern (see the User page note about merging the two).
