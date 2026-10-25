# Audit — Top Bar page (Phase 4.5)

- **Figma page:** Top Bar `2014:916`, working file `sX5tikviuBEhNbu2iPVya5`
- **Masters:** Top Bar Desktop `2015:1175` (COMPONENT_SET: `Elevated` off / on; SLOTs `Leading slot`, `Center Slot`, `Trailing slot`) · Top Bar Mobile `2106:4460` (COMPONENT_SET: `Type` Mobile / Standard × `Elevated` off / on; `Left icon` / `Right icon` INSTANCE_SWAP, `Page title` TEXT, `Show right` BOOLEAN)
- **React:** `TopBar` (`variant` desktop / mobile, `type` standard / mobile, `elevated`, `leading` / `center` / `trailing`)
- **Audited:** 2026-10-25, via read-only `use_figma` reads of both sets (props, anatomy, bindings, gradient strokes, nested button variants, doc-page text) and `tokens.json`

Legend: ✅ match · ❌ finding · n/a. Class: **[code]** · **[designer]** · **[deviation]**.

| # | Area | Finding → fix |
|---|---|---|
| 1 | API | ✅ Desktop's 3 slots → `leading` / `center` / `trailing`; Elevated → `elevated`; Type → `type`. **[deviation]** Mobile's Left / Right icon swaps + Page title text map onto the same three slots (Show right = omit `trailing`), so one API covers both sets; the component now owns the title typography, so `center` takes a plain string. |
| 2 | States | n/a (static surface; slot content owns its states). Elevated ✅. |
| 3 | Colours | ❌ Desktop was opaque `bg/surface` + `border/default` border; master = frosted **`bg/brand` @ 20%** + `effect/blur/md` (24) → **[code]**. ❌ Mobile Standard: master `bg/surface` @ 20% (Background opacity token) + blur 24 → **[code]** (was already surface/20, kept). ❌ Floating circles were `bg/surface` @ 20% → master **`bg/brand` @ 20%** → **[code]**. ❌ All four surfaces have a 1px **bottom** stroke: linear gradient `border/accent` → `border/focus` at 40%. Its transform puts the whole bottom edge at 94–98% of the ramp, so it renders as `border/focus`. React had none on the circles and a solid `border/default` on the bars → **[code]** inset bottom shadow, `border/focus` 40%, Border Weight thin (stays inside like Figma's INSIDE stroke). ❌ Mobile icons were the Ghost button's `accent/default`; master overrides them to `text/primary` (both Types) → **[code]**. |
| 4 | Dimensions | ✅ Padding 24 / 12, Item Gap 24 (slots), Desktop radius `xl` 16, Icon Size 24, circles radius full. ❌ Mobile Standard was a `radius-full` pill with a 4-side border; master is **square** with the bottom stroke only → **[code]**. ❌ Floating row → title gap 16 → **Item Gap 24** → **[code]**. ❌ Floating Icon Only Button kept its own radius (rounded-square state layer / focus ring inside the circle); master binds it to `Mobile/Radius` (full) → **[code]**. **[deviation]** Desktop root gap stays the 24 Item Gap (master root itemSpacing 10, unbound, only a minimum next to the FILL spacers). **[deviation]** Mobile Standard's buttons are plain 44 frames (no states) in Figma; the story uses Icon Only Button **L** (48, touch target ≥ 44), so the bar is 72 vs 68. |
| 5 | Typography | ❌ Standard title was whatever the consumer passed; master Heading/H5 centred → **[code]** H5 (24 / 120% / −0.5%), centred, owned by the bar. ❌ Floating title `text-3xl font-bold` without H4's 120% line-height / −0.5% tracking → **[code]**. Floating height 132 vs 118 is the open cap-trim sweep (title box 36 vs 22). |
| 6 | Anatomy | ✅ Desktop: leading · centre (between FILL spacers ≈ `flex-1` centred) · trailing. ✅ Mobile floating: frosted circles around Icon Only Button Ghost Default **L** + title row. ✅ Elevated shadow `effect/shadow/down/md` on the surface (Desktop / Standard root, floating circles). |
| 7 | Focus | ✅ Bar not focusable; slot buttons keep `focusRing`. ❌ Floating ring was square-ish → circular now (row 4). No overflow clipping. |
| 8 | A11y | ✅ `<header>` (banner landmark); icon buttons need `aria-label` (stories set them). Title is a styled `div`; the app passes an `<h1>` if the title is the page heading. Contrast unchanged (no new text/bg pairing). |
| 9 | Doc page | Both doc frames say "MAX CORE · MOLECULES"; catalog + Storybook tier is Organisms. Mobile doc says "Mobile type shows icon buttons with centered page title. Standard type shows page title with optional right icon" — the master has it the other way (Mobile = title left, below; Standard = centred title between two icons). Desktop doc says "uses background opacity token for glass effect", but only Standard / Elevated=off binds it (Desktop, Standard on and the circles hard-code 0.20; one circle binds `opacity/20`). |
| 10 | Story | ❌ Desktop story used text + ghost icon buttons + an avatar → **[code]** the master's default content: logo, Search bar M with a Button S, Button L "New project" + plus, Entity Card. ❌ Mobile stories used IconOnly size M and passed a styled title → **[code]** Icon Only L, plain `'Page title'`. DesktopElevated dropped (Controls toggle `elevated`). |

## Code fixes applied
1. Desktop surface: `bg/brand` 20% + blur 24, `border/focus` 40% bottom stroke (inset, inside), radius xl.
2. Mobile Standard: square, `bg/surface` 20% + blur, bottom stroke only; centred H5 title owned by the bar.
3. Floating: circles `bg/brand` 20% + bottom stroke; nested button radius full; row → title gap 24; H4 line-height + tracking.
4. Mobile slot icons `text/primary` (Figma override of the Ghost accent).
5. Elevated = bottom stroke + `effect/shadow/down/md` in one shadow list.
6. Stories on the master's default content.

**Verified:** typecheck, build, Storybook tsc, showcase tsc, drift ✓, biome, contrast unchanged (30 / 19 of 31). Playwright (light + dark, Elevated off / on): Desktop 88 tall (= master), radius 16, blur 24, inset 1px `border/focus` 40%, shadow down/md only when Elevated; Standard 393 × 72, square, H5 24 / 28.8 centred; floating circles 48, `bg/brand` 20%, title 30 / 36 −0.15px; icons `text/primary`; Tab → circular focus ring on the menu button.

## For the designer (→ PROGRESS.md)
- Desktop and Mobile surfaces use different backgrounds (`bg/brand` vs `bg/surface`, both at 20%); confirm intended.
- Background opacity token bound only on Mobile Standard / Elevated=off; the others hard-code 0.20 (one circle binds `opacity/20`).
- Bottom gradient stroke (`border/accent` → `border/focus`) reads as plain `border/focus` on every surface because of its transform; flatten it or rotate it if a visible ramp was intended.
- Mobile Standard: Content frame is FIXED 361 inside a 345 content box (overflows 16px); buttons are plain 44 frames with no states (not Icon Only Buttons); background blur is a raw effect, not `effect/blur/md`.
- Mobile floating Elevated: the Menu button's shadow is the `down/md` style on its Background shadow frame, the Search button has raw drop shadows on the button frame (spread 0 vs −2) and renders a stray square behind it.
- Doc pages: tier label "MOLECULES" (Organisms); Mobile doc swaps the Type descriptions.
