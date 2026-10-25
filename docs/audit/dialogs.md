# Audit — Dialogs page (Phase 4.5)

- **Figma page:** Dialogs `2106:621`, working file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Dialogs `2106:793` (COMPONENT_SET: `Type` Horizontal / Vertical × `Tone` Danger / Success / Warning; `Show Icon` BOOLEAN; `Icon Danger` / `Icon Success` / `Icon Warning` INSTANCE_SWAP)
- **React:** `Dialog` (Base UI Dialog; `tone`, `showIcon`, `icon`, `actionsLayout` = Type, `actions`)
- **Audited:** 2026-10-25, via a read-only `use_figma` read of the set, its icon / Action Bar instances, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Tone → `tone`, Show Icon → `showIcon`, icon swaps → `icon`, Type → `actionsLayout` (kept: "Type" alone doesn't say it's the button layout). Toneless `Dialog` (no icon, left-aligned) is a React extension, not a Figma variant. |
| 2 | States | n/a (static surface; buttons own their states). |
| 3 | Colours | ✅ `bg/surface`; icon tone default; title `status/danger/default` on Danger, `text/primary` otherwise; body `text/secondary`. ❌ React added `effect/shadow/down/xl`; the master has no effect or stroke → **[code]** removed (as Tooltip / Select popup). Backdrop `bg-black/50` is not in Figma (no scrim token) → [designer]. |
| 4 | Dimensions | ✅ Padding 20, Radius `l` 12. ❌ Icon 40 → master 56 → **[code]** `size-56`. ❌ Title ↔ body gap 8 → **Text Gap 20** → **[code]**. **[deviation]** The master is a fixed 347 × 327 card with SPACE_BETWEEN (gaps 53–74 px); React hugs with a 20px gap and keeps `max-w-md` (448): at 347 the two Action Bar buttons (min 160 each + 8) can't fit the 307 content width — the master's are 150, under its own Button Min Width. Root itemSpacing 10 is unbound (unused under SPACE_BETWEEN). |
| 5 | Typography | ✅ Title Heading/H4 on toned dialogs. ❌ Missing 120% line-height + −0.5% tracking; the toneless dialog used `text-lg` → **[code]** H4 everywhere. ❌ Body regular → Body/SM/300 `font-light` → **[code]**. |
| 6 | Anatomy | ❌ Actions were a hand-rolled flex row (centred, buttons hugging); master uses an **Action Bar** instance (FILL buttons) → **[code]** `<ActionBar direction>`: equal 200 / 200 horizontal, 408 full-width vertical. ❌ Icons → lucide `trash`, `check`, `map-pin-plus-inside` as the master (warning was a custom pin) → **[code]**. |
| 7 | Focus | ✅ Base UI traps focus and focuses the first action (Cancel — the safe one on Danger); buttons `focusRing`. |
| 8 | A11y | ✅ `role=dialog`, Title / Description wired by Base UI; icon `aria-hidden`. |
| 9 | Doc page | ✅ 3 tokens + chains. Doc lists the warning icon as "li:location"; the master uses `li:map-pin-plus-inside`. |
| 10 | Story | ❌ Buttons were size M and Ghost in the tone colour; Warning's primary was Warning → master: Button **S**, Ghost **Default**, Warning's primary **Default** → **[code]** stories follow the master. |

## Code fixes applied
1. Shadow removed; icon 56; Text Gap 20; H4 line-height + tracking (also on the toneless dialog); Body/SM/300.
2. Actions laid out by `ActionBar` (equal / full-width buttons).
3. Lucide icons as in the master.
4. Stories: Button S, Ghost Default, Warning primary Default.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31). Playwright: no shadow; icon 56; title 30 / 36 centred (start on the toneless dialog); buttons 200 × 32 (horizontal), 408 × 32 (vertical); initial focus on the first action.

## For the designer (→ PROGRESS.md)
- Danger (both Types) and Vertical Warning titles are text-aligned LEFT, the rest CENTER (hug frames hide it on one line).
- Fixed 347 × 327 card: the Action Bar's 150px buttons sit under its 160 Button Min Width; React hugs at up to 448.
- No scrim / backdrop token; React uses black 50%.
- Doc names the warning icon `li:location`; the master swaps in `li:map-pin-plus-inside`.
- Warning copy "Allow Acces" typo in the master.
