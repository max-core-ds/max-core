# Audit — Toast/snackbar page (Phase 4.5)

- **Figma page:** Toast/snackbar `2074:11177`, Max Core file `sX5tikviuBEhNbu2iPVya5`
- **Master:** Toast `2074:11195` (COMPONENT_SET: `Tone` Success / Danger / Warning / Default / Loading; `Show Title`, `Show Body` BOOLEAN)
- **React:** `ToastProvider` + `useToast()` (Base UI Toast manager; `type` = Tone)
- **Audited:** 2026-10-25, via a read-only `use_figma` read of the set, its nested instances, the doc-page text and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Tone → toast `type`; Show Title / Show Body → `title` / `description` (omitted = hidden). ❌ No **Default** or **Loading** tone: untyped toasts had no icon, `loading` fell back to nothing → **[code]** any `type` other than success/danger/warning/loading renders as Default (info icon, `bg/surface`); `type: 'loading'` shows the Spinner XL (Brand), `data.progress` drives its %. ❌ The master's **Button Link** action was missing → **[code]** `actionProps` render a `LinkButton` in the toast's tone (Loading's Cancel = Danger, as the master). |
| 2 | States | n/a (static surface; the action is a LinkButton with its own states). |
| 3 | Colours | ✅ Fills `status/*/subtle` / `bg/surface`; icon + title = tone default (`text/primary` for Default/Loading). ❌ Body was always `text/secondary`; the master colours it with the tone default on Success/Danger/Warning → **[code]**. Contrast: body on subtle 5.66 / 5.63 / 5.35 light, 5.05 / 4.51 / 5.28 dark; `text/secondary` on `bg/surface` 4.76 / 5.71 — all AA. |
| 4 | Dimensions | ✅ Padding 12/16, Gap 16, Radius `l` 12, Border Weight none (strokes are bound but 0 wide). ❌ Row was top-aligned; master is counter-axis CENTER → **[code]** `items-center`. Icons render **48** in the master and are unbound; `Icon Size` (32) is bound nowhere → React keeps the token (drift-mandated) → [designer]. Content gap 10 is unbound; the untrimmed CSS line boxes already give ≈10 cap-to-cap, so React uses no gap (was 4). Width 469 is fixed and untokenised; the viewport goes from `max-w-sm` (toast 352) to `max-w-lg` (toast 480), so the action fits. |
| 5 | Typography | ✅ Title Heading/H5 (24 Bold). ❌ Missing 120% line-height + −0.5% tracking → **[code]** (same as Form Group titles). ❌ Body was regular 400; master is Body/SM/300 → **[code]** `font-light`. |
| 6 | Anatomy | ❌ Icons were circled check / x; master uses lucide `check`, `x`, `triangle-alert`, `info` → **[code]**. Order icon · content · action ✅. |
| 7 | Focus | ✅ Action = LinkButton `focusRing`. |
| 8 | A11y | ✅ Base UI announces via its live region; icons `aria-hidden`; Spinner label emptied (the title says what's loading). **[deviation]** The close ✕ is kept although the master has none: without it a toast with no action can only time out or be swiped, and keyboard users need a dismiss control. |
| 9 | Doc page | ✅ 6 tokens + chains. ❌ "Icon Size → 32" but the icons are 48 and unbound (see 4). Doc shows Radius `l` chaining to `spacing/scale/12` (cosmetic). |
| 10 | Story | ❌ Only Success / Error / Info → one Default story with the five Figma tones, the master's copy and the Undo / Cancel actions. |

## Code fixes applied
1. Default + Loading tones (Spinner XL with progress %), Button Link action in the tone colour.
2. Body text in the tone colour; Body/SM/300; H5 line-height + tracking.
3. Row centred; content gap removed; lucide icons; wider viewport.
4. Story shows all five tones.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31). Playwright (light + dark): all five toasts 480 wide, 73 tall (93 with a wrapped body), icons 32, spinner 48, title / body / action colours as listed in 3.

## For the designer (→ PROGRESS.md)
- Tone icons are 48 and unbound; `-- Molecule/Toast Snackbar/Icon Size` (32) is bound nowhere (React follows the token).
- Content gap 10 is unbound and off the spacing scale.
- Strokes are bound to `border/default` / `status/*` with weight 0; drop them or decide on a border.
- No dismiss control in the master; React keeps a ✕ for keyboard users.
