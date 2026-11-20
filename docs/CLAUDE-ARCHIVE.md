# Max Core Design System — Reguli pentru Claude Code

## Context general

Max Core este un design system B2B end-to-end cu 3 layere:
1. **Layer 1 — Figma DS** — tokeni pe 4 niveluri, componente modulare, light/dark mode
2. **Layer 2 — Plugin export JSON + audit WCAG** (în dezvoltare)
3. **Layer 3 — React + Tailwind codegen** (în dezvoltare)

**Fișier Figma:** `sX5tikviuBEhNbu2iPVya5` (`Max Core`)

**Scopul principal:** eliminarea rupturii Figma ↔ Cod. Designer schimbă în Figma → export JSON → UI actualizat automat.

---

## Arhitectura tokenilor — 4 niveluri

```
Nivel 1 — Primitive:   #6366F1, 16px, 8px
Nivel 2 — Semantic:    accent/primary, neutral/surface, status/error
Nivel 3 — Component:   -- Molecule/Button/Global/PaddingX → aliasează - Spacing -/16
Nivel 4 — Variant:     -- Atoms/Buttons/Standard-Button/Size-M/Height
```

**Regula de aur:** Fiecare nivel aliasează nivelul de deasupra. Zero valori hardcodate în componente.

---

## Convenții de naming tokeni — CRITIC

### Prefixuri
- `--` prefix (2 dash-uri) = token de componentă (Molecule sau Atom sau Organism)
- `-` prefix (1 dash) = token global/semantic/primitiv
- `---` prefix (3 dash-uri) = **TOKEN VECHI / GREȘIT** — trebuie înlocuit

### Structura numelui
```
-- Molecule/[NumeComponentă]/[SubComponentă]/[Proprietate]
-- Atoms/[NumeComponentă]/[Size]/[Proprietate]
--Organism/[NumeOrganisms]/[SubComponentă]/[Proprietate]

Exemple corecte:
-- Molecule/Button/Global/PaddingX
-- Atoms/Avatar/Size-M/Size
--Organism/Stats Card/Global/Padding
```

### Tokeni globali semantici (alias la primitive)
```
- Spacing -/04    → 4px
- Spacing -/08    → 8px
- Spacing -/12    → 12px
- Spacing -/16    → 16px
- Spacing -/20    → 20px
- Spacing -/24    → 24px
- Spacing -/32    → 32px
- Spacing -/48    → 48px
- Spacing -/64    → 64px

- Size -/16       → 16px
- Size -/20       → 20px
- Size -/24       → 24px
- Size -/32       → 32px
- Size -/40       → 40px
- Size -/48       → 48px
- Size -/56       → 56px
- Size -/64       → 64px

- Radius -/none   → 0px
- Radius -/xs     → 2px
- Radius -/sm     → 4px
- Radius -/md     → 8px
- Radius -/L      → 12px
- Radius -/xl     → 16px
- Radius -/2xl    → 24px
- Radius -/3xl    → 32px
- Radius -/full   → 9999px

- Border Weight -/none  → 0px
- Border Weight -/thin  → 1px
- Border Weight -/thick → 2px
```

---

## Colecții de tokeni în Figma

```
Max Core - Primitives   → valori raw (numere, culori hex)
Max Core - Semantics    → alias-uri la Primitives (- Spacing -/16, - Radius -/sm etc.)
Max Core - Components   → alias-uri la Semantics (-- Molecule/..., -- Atoms/..., --Organism/...)
Max Core - Colors       → culori cu light/dark mode (bg/surface, text/primary, accent/default etc.)
```

---

## Tokeni de culoare comuni

```
bg/surface          → fundal card, modal, sidebar (#ffffff / dark)
bg/default          → fundal pagină (#f8fafc / dark)
bg/subtle           → fundal subtil
text/primary        → text principal (#0f172a / dark)
text/secondary      → text secundar (#64748b / dark)
text/muted          → text terțiar (#94a3b8 / dark)
text/on-accent      → text pe fundal accent (#f8fafc / same) — alb pe ambele moduri, corect cât timp accent rămâne închis pe ambele moduri (500 light / 600 dark)
accent/default      → culoarea brand (Light: primary/500, Dark: primary/600)
accent/hover        → hover pe accent
accent/active       → pressed pe accent
accent/Surface      → fundal subtil accent
border/default      → borduri vizibile (#cbd5e1 / dark)
border/muted        → borduri subtile (#f1f5f9 / dark)
border/Accent       → borduri accent (#6366f1)
border/Focus        → focus ring (#6366f1 / dark)
status/danger/default, /hover, /active, /subtle, /border
status/succes/default, /hover, /active, /subtle, /border
status/warning/default, /hover, /active, /subtle, /border
status/info/default, /subtle
bg/brand            → accent/default (primary/500) / primary/800 — fundal branded
bg/monochrome       → White (#ffffff) / Black (#000000) — fundal pur alb/negru
shadow/color/1      → rgba(49, 46, 129, 0.01) / rgba(0,0,0, 0.10)
shadow/color/2      → rgba(49, 46, 129, 0.05) / rgba(0,0,0, 0.20)
shadow/color/3      → rgba(67, 56, 202, 0.09) / rgba(0,0,0, 0.30)
shadow/color/4      → rgba(99, 102, 241, 0.10) / rgba(0,0,0, 0.40)
```

---

## Effect Styles (umbre)

```
effect/shadow/sm/down  → y2, blur6, shadow/color/4
effect/shadow/md/down  → y6+y2, blur16+6, shadow/color/3+4
effect/shadow/lg/down  → y16+y6+y2, blur32+16+6, shadow/color/2+3+4
effect/shadow/xl/down  → y82+y46+y20+y5, blur33+28+20+11, shadow/color/1+2+3+4

effect/shadow/sm/up    → identic cu /down dar Y negativ
effect/shadow/md/up    → identic cu /down dar Y negativ
effect/shadow/lg/up    → identic cu /down dar Y negativ
effect/shadow/xl/up    → identic cu /down dar Y negativ
```

---

## Componente completate și tokenii lor

### Atoms

**Button (Standard, IconOnly, Split, FAB, Link, Pay)**

Arhitectura Standard Button:
```
Button (component set) — wrapper cu 5 state-uri
├── State=Default, Disabled=off    (layoutMode: HORIZONTAL, HUG)
├── State=Hover, Disabled=off      (layoutMode: HORIZONTAL, HUG)
├── State=Pressed, Disabled=off    (layoutMode: HORIZONTAL, paddingTop: 2 = press effect)
├── State=Focused, Disabled=off    (layoutMode: HORIZONTAL, HUG)
└── State=Default, Disabled=on     (layoutMode: HORIZONTAL, HUG)

Fiecare variantă conține o instanță .Button-options:
.Button-options (component set) — 48 variante (3 Variant × 4 Tone × 4 Size)
├── Variant: Primary | Secondary | Ghost
├── Tone: Default | Danger | Success | Warning
├── Size: S | M | L | XL
├── Proprietăți expuse: Label, Show Label, Show Left Icon, Show Right Icon, Left icon, Right icon
└── Structură internă: State Layer (rectangle) + Left Icon + Text + Right Icon
```

Tokeni globali (shared între Standard, IconOnly, Split):
```
-- Atoms/Buttons/Global/Radius → - Radius -/sm
-- Atoms/Buttons/Global/Standard Min Width → 0
-- Atoms/Buttons/Global/Primary Border Width → - Border Weight -/none
-- Atoms/Buttons/Global/Secondary Border Width → - Border Weight -/thin
```

Tokeni per size (toți au bindings complete: padding, gap, minHeight, iconSize, radius):
```
Size S: Padding→06, Gap→08, Min Height→32, Icon Size→20
Size M: Padding→10, Gap→08, Min Height→40, Icon Size→20
Size L: Padding→12, Gap→08, Min Height→48, Icon Size→24
Size XL: Padding→14, Gap→16, Min Height→56, Icon Size→28
```

Componente Figma ID-uri:
```
Button (wrapper):     119:5296  (key: 1a42a8396900704f1e1303c424930b987cd1fad5)
.Button-options:      11:146
```

**Avatar**
```
-- Atoms/Avatar/Global/Radius → - Radius -/full (9999px)
-- Atoms/Avatar/Global/BorderWeight → - Border Weight -/none
-- Atoms/Avatar/Size-Xs/Size → - Size -/24
-- Atoms/Avatar/Size-S/Size → - Size -/32
-- Atoms/Avatar/Size-M/Size → - Size -/40
-- Atoms/Avatar/Size-L/Size → - Size -/48
-- Atoms/Avatar/Size-xl/Size → - Size -/64
```

**Thumbnail (Atom)**
```
-- Atoms/ThumbNail/Global/Size Xs → 24px
-- Atoms/ThumbNail/Global/Size S → 32px
-- Atoms/ThumbNail/Global/Size M → 40px
-- Atoms/ThumbNail/Global/Size L → 48px
-- Atoms/ThumbNail/Global/Size XL → 64px
-- Atoms/ThumbNail/Global/Radius Rounded → 8px
-- Atoms/ThumbNail/Global/Radius Square → 0px
-- Atoms/ThumbNail/Global/Radius Circle → - Radius -/full
-- Atoms/ThumbNail/Global/BorderWeight → 0
```

**List Item**
```
-- Atoms/List-Item/PaddingX → - Spacing -/12
-- Atoms/List-Item/PaddingY → - Spacing -/10
-- Atoms/List-Item/Gap → - Spacing -/08
-- Atoms/List-Item/Icon SIze → - Size -/20
```

### Molecules

**Entity Item (fostul User Item)**
```
-- Molecule/Entity Item/Gap → - Spacing -/08
-- Molecule/Entity Item/LabelGap → - Spacing -/08
-- Molecule/Entity Item/AvatarRadius → - Radius -/full
-- Molecule/Entity Item/AvatarBorder → - Border Weight -/none
```
Variante: Type=User (Avatar), Type=Workspace (Thumbnail)

**Entity Card (fostul User Card)** — QA completat 23 Apr 2026
```
-- Molecule/Entity Card/Padding X → - Spacing -/12
-- Molecule/Entity Card/Padding Y → - Spacing -/12
-- Molecule/Entity Card/Radius    → - Radius -/none
```
Component Set ID: `2011:1645`. Showcase: `4303:176` (in Section `4283:6530`). Test section: `4283:6529`.

Variante (8): State (Default/Hover/Pressed/Active) × Collapse (Off/On). Plus BOOLEAN-uri: `Focused` (default false), `Right Icon` (default true).

**Naming fixes aplicate:**
- Property `States` → `State` (singular, consistency cu restul)
- Variant values Title Case: `pressed` → `Pressed`, `active` → `Active`, `on` → `On`
- Boolean property `Right icon` → `Right Icon`

**Focus ring refactor (per lectia #1 din CLAUDE.md):**
- 2 variante `States=Focused` sterse (Off + On)
- Adaugat BOOLEAN `Focused` la nivel de set (`Focused#4293:0`)
- 8 ring-uri noi instantiate (`.Focus-ring` din `24:797`) ca ABSOLUTE children pe fiecare variant, STRETCH constraints, x=-3, y=-3, w/h+6, visible bound la `Focused`

**Token propagation test:** Padding X/Y forțat 48, Radius forțat 32 in Test mode (Components collection). Propagat corect pe instances. Reverted la aliasuri originale (Spacing 12, Radius none).

**Industry standard:** 4 states + Focused boolean = complet. Single size (workspace switcher trigger context). Right Icon optional. Show Subtitle pe Entity Item interior.

**Showcase structure:** Master mutat in showcase la (370, 760). Hero stanga-sus, preview scaled 2.5x sus-dreapta, info block + master grid (4×2 + state row labels + collapse col headers cu px) stanga, Focused=true demo (4×2) dreapta cu propriu info block. Dark Mode forced pe root, bg/monochrome.

**Range** — QA completat 23 Apr 2026
Single `COMPONENT` (nu set). ID: `2508:11276`. Showcase: `4317:176` (in Section `4307:6954`). Test section: `4307:6953`.

Composite — zero tokeni proprii. Compune: Progress Bar atom (Size S, 4h, full radius) + Knob atom (24×24) + Tooltip atom. Tot styling-ul cascadeaza din atoms.

Proprieti (1): `Show Tooltip#2508:19` BOOLEAN default true.

**Bug rezolvat — responsive resize:**
Simptom: cand userul tragea de marginea Range sa-l faca mai ingust, knob-ul iesea in afara barii (in fata). Cauza: Knob frame avea constraint `horizontal: CENTER` — cand parentul se micsoreaza, knob-ul isi pastreaza offset-ul fata de centrul noului parent, deci "se misca" necontrolabil.

Fix aplicat:
- Knob frame constraint `horizontal: CENTER` → `SCALE` (pozitia x scaleaza proportional cu parentul)
- Knob frame `layoutSizingHorizontal: FIXED` → `HUG` (width vine din content — tooltip + knob)
- Tooltip (nested instance) `layoutAlign: STRETCH` → `INHERIT`, `layoutSizingHorizontal: FILL` → `HUG`

Rezultat: la 150/300/500/800 px widths, knob ramane pe bara, tooltip nu se mai strange sub text-ul "50%".

**Naming audit:** Range clean (singular layers, Title Case). Tooltip-ul nested e numit `Tooltips` (plural) — vine din atom-ul Tooltip, nu tine de Range.

**Industry gaps notate (nu adaugate fara consens):** Range nu are State wrapper variants (Hover/Pressed/Disabled), nu are Size variants, valoarea e statica 25% (Progress Bar Value=25 intern). Focus ring exista pe Knob atom — nu duplicate la Range.

**Token propagation test:** Knob Size 24→48 + Progress Bar Size S/Height 4→16 forcate in Test mode. Propagat corect pe instance. Reverted.

**Default value aliniat la 50%:** knob center la x=150 (50% din 300), Progress bar Value variant `25 → 50`, tooltip "50%". Initial erau 3 valori inconsistente (fill 25, tooltip 50, knob ~22) — acum una singura.

**Showcase structure:** Root 1200×950 in Section 4307:6954. Hero stanga-sus + **MASTER mutat la (880, 190)** sus-dreapta (nu instance) cu label "MASTER · 300 PX · 50%". "Responsive resize" info block cu 4 instances stacked la 150/300/500/800 px (demonstrare fix). "Show Tooltip = false" demo pe coloana dreapta. Dark Mode forced.

**Instances existente:** 6 total (5 in showcase + 1 in Bottom sheet). Toate intacte dupa fix (constraint/sizing e pe master, instances mostenesc automat).

**Toast** — QA completat 23 Apr 2026
Component Set ID: `2074:11195`. Showcase: `4338:176` (in Section `4307:7212`). Test section: `4307:7211`.

Variante (5): Tone = Success | Danger | Warning | Default | Loading. Plus BOOLEAN-uri: `Show Title` (default true), `Show Body` (default true).

Compozitie: icon (li:check / li:x / li:triangle-alert / li:info / Spinner XL) + Content (VERTICAL Title + Body texts) + Button Link (action).

**Naming fixes aplicate:**
- `Tone=Succes` → `Tone=Success` (typo, +default value updated)
- `Tone=Tone5` → `Tone=Loading` (placeholder name → semantic)
- Boolean `show body` → `Show Body`
- Boolean `Show title` → `Show Title`
- Layer `Frame 2` → `Content` (5 variante, VERTICAL stack title+body)
- Layer `Frame 6` → `Wrapper` (Loading variant)

**Button Link Tone match:** Toate Button Link instances erau cu Tone=Success pe toate variantele Toast. Acum fiecare variant are btn link cu Tone corespunzator: Success→Success, Danger→Danger, Warning→Warning, Default→Default, Loading→Danger (Cancel button de obicei rosu).

**Tokeni proprii (5):**
```
-- Molecule/Toast Snackbar/Padding X     → - Spacing -/16
-- Molecule/Toast Snackbar/Padding Y     → - Spacing -/12
-- Molecule/Toast Snackbar/Gap           → - Spacing -/16
-- Molecule/Toast Snackbar/Radius        → - Radius -/L (12)
-- Molecule/Toast Snackbar/Border Weight → - Border Weight -/none (0)
```
Propagation test: Padding X 40 + Padding Y 36 + Gap 40 + Radius 32 + Border 4 fortate in Test mode. Toate 5 cascadate corect (heights 72→120, 79→127). Reverted. Test instances PASTRATE in section per feedback user.

**Industry coverage:** 5 tones + Show Title/Body toggles + action button color-matched. Nu are buton close (X) dedicat — dismiss-ul se face external (toast manager). Nu are size variants — single width 469.

**Showcase structure:** Root 1200×1050 in Section 4307:7212. Hero stanga-sus, preview Success (scaled 0.7) sus-dreapta. Info block + MASTER (stack de 5 tones) in mijloc-stanga cu axis labels (SUCCESS/DANGER/WARNING/DEFAULT/LOADING) pe stanga. Coloana dreapta: Title & Body toggle demos (Show Body=false, Show Title=false, both false). Dark Mode forced.

**Dialogs** — QA completat 23 Apr 2026
Component Set ID: `2106:793`. Showcase: `4346:176` (in Section `4307:7420`). Test section: `4307:7419`.

6 variante: Type (Horizontal | Vertical) × Tone (Danger | Success | Warning). Proprietati: `Show Icon` BOOLEAN + 3 INSTANCE_SWAP-uri per-tone (`Icon Danger` / `Icon Success` / `Icon Warning`) fiecare cu default diferit (trash / check / map-pin).

**Naming fixes aplicate:**
- `Tone=succes` → `Tone=Success` (typo, 2 variante: Horizontal + Vertical)
- Boolean `Show icon` → `Show Icon`
- `Icon#...` → `Icon Danger` (clarity — la ce tone merge)
- `Icon2#...` → `Icon Success`
- `Icon warning#...` → `Icon Warning`
- Layer `Frame 1` → `Content` (title + body text stack)
- Layer `Frame 2` → `Actions` (button row / column)

**Tokeni proprii (3):**
```
-- Molecule/Dialogs/Padding  → - Spacing -/20
-- Molecule/Dialogs/Radius   → - Radius -/L (12)
-- Molecule/Dialogs/Text Gap → - Spacing -/20
```
Propagation test: Padding 48 + Radius 32 + Text Gap 40 fortate. Toate cascadate corect. Reverted. Test instances PASTRATE in section.

**Arhitectura per-tone icon:** 3 INSTANCE_SWAP-uri separate (nu o singura prop) pentru ca fiecare tone vrea default diferit (trash/check/pin). Figma nu suporta default diferit per variant pe o singura prop. Trade-off: user care swap-uieste iconul vede 3 props in panel — dar doar unul e relevant per variant. Alternativa (1 prop cu default fix) ar pierde personalizarea per-tone.

**Action Bar integration:** Actions frame (raw 2 buttons) inlocuit cu Action Bar instance in toate 6 variantele — `Direction=Horizontal` pe row 1 (Type=Horizontal), `Direction=Vertical` pe row 2 (Type=Vertical). Fiecare Action Bar are layoutAlign=STRETCH.

**⚠️ Button tones/labels = manual setup:** Plugin API nu poate seta props pe butoanele nested din slot-ul Action Bar (`.Button-options` e 3 niveluri adanc, nu e exposed prop pe Action Bar master). Dupa swap, butoanele afiseaza default "Button" indigo. Userul trebuie manual in Figma UI: double-click pe fiecare varianta → select butoanele din Action Bar → set Variant/Tone/Label per variantei (ex: Danger = Ghost/Default "Cancel" + Primary/Danger "Confirm"). TODO de finalizat manual.

**Pagination** — QA completat 23 Apr 2026
Main: `2550:6528` "Pagination" (COMPONENT, 248×32). Internals:
- `.Pagination Button` (`2550:6444`, COMPONENT_SET, 5 variante: State=Default/Hover/Pressed/Active + State=Default+Disabled=On, plus BOOLEAN `Focused`)
- `.Pagination Content` (`2550:6429`, COMPONENT_SET, 2 variante: Type=Number/Icon, plus TEXT `Page` + INSTANCE_SWAP `Icon`)

Showcase: `4364:176` (in Section `4307:9039`) cu zona Internals dedicata sub main. Test section: `4307:9038`.

**Naming fixes aplicate (massive cleanup):**
- Main: `Paggination` → `Pagination` (typo)
- State wrapper set: `Pagination button` → `.Pagination Button` (`.` prefix pt internal, Title Case)
- Content set: `.Pagination button` → `.Pagination Content` (distinct nume de State wrapper)
- Content variants: `Icon=off/on` → `Type=Number/Icon` (semantic, toggle-ul arata number vs chevron)
- State variants: `Disabled=off/on` → `Disabled=Off/On` (Title Case, 5 variante affected)
- Content prop: `Page #` (trailing space) → `Page`
- Content prop (INSTANCE_SWAP): `Instance` → `Icon` (numele componentei suportate)
- Content prop (VARIANT): `Icon` → `Type` (evita conflict cu INSTANCE_SWAP Icon de mai sus)
- Layer: `Pagginatin-Button-Content` (typo + hyphens) → `Content`

**Tokeni proprii (6):**
```
-- Molecule/Pagination/Icon Size      → - Size -/24 (default)
-- Molecule/Pagination/Button Padding → - Spacing -/04
-- Molecule/Pagination/Radius         → - Radius -/sm (4)
-- Molecule/Pagination/Min Width      → - Size -/24
-- Molecule/Pagination/Buttons Gap    → - Spacing -/04
-- Molecule/Pagination/Border Weight  → - Border Weight -/thin (ADAUGAT 23 Apr — strokeWeight era hardcodat 1 pe .Pagination Content, acum bound token)
```
Propagation test: Icon Size 40, Button Padding 16, Radius 16, Min Width 48, Gap 16, Border Weight 4 fortate — toate cascadate (first button 32×32→72×72, gap 4→16, borders 4px vizibili). Reverted. Test instance PASTRATA in section.

**Focus ring:** Layer "Focus" (RECTANGLE, 37×37 → +2.5 outset) pe fiecare varianta State, bound la `Focused` boolean. NU e `.Focus-ring` atom standard — ramane raw rectangle (refactor la standardul STRETCH -3 e scope creep).

**Showcase structure:** Root 1800×1600 in Section 4307:9039. Hero stanga-sus, preview main (scaled 1.5x) sus-dreapta. Info block + MAIN master la (80, 430). Divider + "Internals" section cu warning rosu. 2 internal sets side-by-side: `.Pagination Button` (5 states stacked) la (80, 780) si `.Pagination Content` (Type=Number/Icon stacked) la (400, 780), fiecare cu label + descriere. Dark Mode forced.

**Showcase structure:** Root 2200×1400 in Section 4307:7420. Hero stanga-sus, preview Horizontal Danger (scaled 1.3x) sus-dreapta. MASTER mutat la (160, 660) — 6 variante aranjate 2 rows (Horizontal/Vertical) × 3 cols (Danger/Success/Warning). Axis labels: row TYPE ↓ (HORIZONTAL / VERTICAL) pe stanga, col TONE → (DANGER / SUCCESS / WARNING) sus. "Show Icon = false" demo pe dreapta. Dark Mode forced.

**Search Bar**
```
-- Molecule/Search bar/Global/Radius → - Radius -/full
-- Molecule/Search bar/Global/Border Weight → - Border Weight -/thin
-- Molecule/Search bar/Global/MinWidth → - Size -/180
-- Molecule/Search bar/Size S/PaddingX → - Spacing -/10
-- Molecule/Search bar/Size S/PaddingY → - Spacing -/08
-- Molecule/Search bar/Size M/PaddingX → - Spacing -/12
-- Molecule/Search bar/Size L/PaddingX → - Spacing -/14
```

**Input (Base Input, BottomLine, Select, Multiselect, Stepper, Textarea)**
```
-- Molecule/Input/Global/General/Radius → - Radius -/sm
-- Molecule/Input/Global/General/Stroke Weight → - Border Weight -/thin
-- Molecule/Input/Global/General/PaddingX → - Spacing -/12
-- Molecule/Input/Global/General/MinWidth → 160px (hardcodat)
```

**Item List**
```
-- Molecule/Item-List/Gap → - Spacing -/08
-- Molecule/Item-List/Radius → - Radius -/sm
-- Molecule/Item-List/Border Weight → - Border Weight -/thin
-- Molecule/Item-List/MinWidth → - Size -/120
-- Molecule/Item-List/Container Padding Y → - Spacing -/12
```

**Pagination**
```
-- Molecule/Pagination/Min-Width → - Size -/32
-- Molecule/Pagination/Icon Size → - Size -/32
-- Molecule/Pagination/Button Padding → - Spacing -/04
-- Molecule/Pagination/Buttons Gap → - Spacing -/08
-- Molecule/Pagination/Radius → - Radius -/sm
```

**Tabs**
```
-- Molecule/Tabs/Padding X → - Spacing -/16
-- Molecule/Tabs/Padding Y → - Spacing -/12
-- Molecule/Tabs/Radius → - Radius -/sm
-- Molecule/Tabs/Underline Border Weight → - Border Weight -/thin
```

**Form Group** (18 Apr 2026 — refactor Option A: transparent + slots)
```
-- Molecule/Form Group/Size S/Gap    → - Spacing -/20
-- Molecule/Form Group/Size M/Gap    → - Spacing -/24 (default)
-- Molecule/Form Group/Size L/Gap    → - Spacing -/28
-- Molecule/Form Group/Global/Headline Gap       → - Spacing -/12
-- Molecule/Form Group/Global/Items Gap          → - Spacing -/12 (S default; si folosit de Field Row pe gap-ul intre 2 inputs)
-- Molecule/Form Group/Size M/Items Gap          → - Spacing -/16 (FG M vertical gap intre rows)
-- Molecule/Form Group/Size L/Items Gap          → - Spacing -/20 (FG L vertical gap intre rows)
-- Molecule/Form Group/Global/Action Buttons Gap → - Spacing -/04
```
Structura: Headline (Title + Description) → Items (slot cu 3 Field Row default) → Action (Button slot).
**⚠️ Width behavior:** Form Group e sizuit initial pentru **1 form pe rand**. Daca se activeaza Field Row (2 forms/row) in Items slot, userul trebuie sa **traga manual latura din dreapta** ca sa lateasca Form Group-ul la dimensiunea necesara. Component NU auto-grows — width-ul e explicit. Aceasta nota e si in descrierea componentei in Figma + trebuie in documentatia site-ului.
Variante: Size=S/M/L. Props: Show Headline, Show Description, Show Action (BOOL), Title, Description (TEXT), Field 1-5, Action Button (INSTANCE_SWAP).
**Transparent** — fara bg/border/radius/padding. Premade form groups (Log in, Welcome aboard etc.) raman separat ca Card wrapping Form Group.
Tokeni sterși: `--- molecules ---/---Formgroup/Form-group-gap`, `Form-group-padding`, `-- Molecule/Form Group/Global/Radius`, `Border Weight`, `Size S/M/L/Padding` (incompatibili cu Option A).
Component Set ID: `4011:1119`. Showcase: `4017:1500` (in Section `3996:1825`). Test section: `3996:1824`.

**Tabs** (1 main + 1 internal)

- `_Internals / Tab Item` (set `2050:50042`, 30 variants: State×Fill×Disabled×Start×End)
- `Navigation / Tabs Group` (single `2050:50076`, slot-based + Show Divider boolean)

Tokens (4): `-- Molecule/Tabs/Padding X, Padding Y, Radius, Underline Border Weight`. Zero orphans, zero legacy.

**Naming fixes:**
- `Show Devider` → `Show Divider` (typo)
- Variant props: `state=` → `State=`, `fill=` → `Fill=`
- Scos `States=Default` redundant (single-value prop) din toate 30 variante → set acum 5 props (State, Fill, Disabled, Start, End)

Propagation test: toate 4 tokens forced → propagare corecta.

Showcase la `4277:206` (in Section `4260:1423`, sub Switcher showcase).

**TODO viitor:** evaluare conversie `Start`/`End` variants → BOOLEAN props (ar reduce variante 30→~12, simplifica arhitectura). Breaking change pe instance existente.

---

**Switcher** (1 main + 1 internal)

- `.Switcher Item` (set `3074:36`, 4 state variants: Default/Hover/Pressed/Active) — atom pill intern
- `Navigation / Switcher` (single component `3076:24`) — row of 3 Switcher Items

Tokens (5): `-- Molecule/Switcher/Item/Icon Size, Gap, Padding X, Padding Y, Radius`. Zero orphans, zero legacy. Propagation test: Padding X 48 + Gap 20 forced → propagat corect.

**Naming fixes (5):**
- `.Switcher-Item` → `.Switcher Item` (hyphen → space)
- 4 variant props: `state=Default|Hover|Pressed|Active` → `State=...`

Showcase la `4265:204` (in Section `4260:1423`). Test section `4260:1422`.

---

**Date Picker** (3 main + 4 internals)

Main components:
- `Date Picker` (set `2486:6242`, 3 variants: Date/Month/Year Picker)
- `Dual Date Picker` (set `2499:12472`, 3 variants pt date range)
- `Input Date Picker` (single `2499:14039` — Base Input + Date Picker integrat)

Internals (zona _Internals section `2070:9817`, not for direct use):
- `_Weekday Header` (`2070:11504`)
- `_Day Item` (`2070:11287`, 19 variants: Range×State×Disabled, coverage industry-complete)
- `_Date Picker Footer` (`2070:11651`)
- `Calendar Pane` (`2472:2567`, 2 variants: Type=Month | Month Year)

Tokens: 17 tokeni sub `-- Molecule/Date Picker/[Day Item|Footer|General|Header]/...` — toti curati, zero legacy.

**Naming fixes aplicate (9):**
- `_Day-item` → `_Day Item`
- `Date picker footer` → `_Date Picker Footer`
- `Date picker` → `Date Picker`
- `Dual Date picker` → `Dual Date Picker`
- `Input date picker` → `Input Date Picker`
- Calendar Pane variants: `type=Month/Month-Year` → `Type=Month/Month Year`
- Date Picker set variants: `Type=Year picker` → `Type=Year Picker`
- Dual Date Picker set variants: `Type=Month picker` → `Type=Month Picker`

Token propagation test: Day Item Padding 16px forced in Test mode → propagare corecta, reverted.

**System tie-in:** `_Date Picker Footer` refactor — 2 butoane standalone (Clear + Apply) inlocuite cu 1 Action Bar instance (Direction=Horizontal). Labels + Variant override-uite pe nested .Button-options. Propagare automata pe toate 3 componente Date Picker + Dual + Input.

**Cleanup componente vechi:** 8 instance-uri in Dual Date Picker foloseau Day Item deprecated (`_Day-item/Start/Default/on`, `_Day-item/Middle/Default/on` — vechi convention cu slashes). Swap la noile variants din `_Day Item` set + componentele vechi sterse.

Showcase la `4233:956` (in Section `4205:17254`) cu structura speciala: **Internals section** (warning "do not use directly" + 4 internals cu label + desc + preview) apoi **Main components section** (3 componente principale cu info per each). Pattern generalizabil pentru alte componente cu internals.

---

**Dropdown** (`2380:9128`, single component — trigger + expandable list)
Compozitie: Trigger (Entity Card default, INSTANCE_SWAP) + Item list Container → Item List (Search + List items + native Slot + ScrollBar). Boolean `Active` toggle list visibility.
States inherit din Trigger (Entity Card are Default/Hover/Pressed/etc.) + List Item molecule — zero state variants proprii, architectural minimal.
Tokeni:
- `-- Molecule/Dropdown/Gap` → - Spacing -/04 (gap trigger ↔ list)
- `-- Molecule/Dropdown/Item List Padding` → - Spacing -/04 (renamed de la "Item List Padding X" — doar X folosit)
Single size (contextual din trigger). Token propagation test: Gap 32px / Padding 24px forced in Test mode, ambele propagat corect.
Showcase la `4216:165` (in Section `4205:15931`). Test section: `4205:15930`.

**Action Bar** (`4112:93`, component set cu `Direction=Horizontal|Vertical`)
Container pentru butoane de action cu 2 variante explicite:
- **Direction=Horizontal** (default) — butoane pe rand, FILL impart egal
- **Direction=Vertical** — butoane stack sus-jos, FILL full width

Design rationale: initial aveam single component cu `layoutWrap=WRAP` (fluid), dar era redundant — designer-ul care voia vertical fortat trebuia oricum sa aleaga, iar wrap-ul surprindea la width-uri ciudate. Pattern industry (Material, Ant, Chakra) = variante explicite, zero magic.

Figma nu permite schimbarea `layoutMode` pe instance → variant e singurul mod curat de switch horizontal/vertical.

Inner `Button Group` (SLOT) pe ambele variante — accepta orice numar/tip de butoane via drag.

Tokeni:
- `-- Molecule/Action Bar/Global/Gap` → - Spacing -/08 (scope GAP, bound pe itemSpacing)
- `-- Molecule/Action Bar/Global/Button Min Width` → - Size -/160 (scope WIDTH_HEIGHT, bound pe buttons minWidth — pastreaza dimensiune rezonabila cand impartit FILL)
Toggle Slot pe container manual in Figma UI pt numar flexibil de butoane.

**Field Row** (`4037:1641`, 2-input horizontal atom)
Composable building block pentru Items slot in Form Group. HORIZONTAL auto-layout, gap bound la `-- Molecule/Form Group/Global/Items Gap` (12px).
Use case: 2 inputs side-by-side (Postal + City, Expiry + CVV, First + Last name etc.). Cele 2 slots din interior rezolva limitarea Figma de "no slot-in-slot" — Field Row e propriu component context.
Top-level props: `Show Right Input` (boolean). Inputurile interne sunt **NON-exposed** intentionat — evitam "carnatu" de props (16+) la nivel principal.

**⚠️ IMPORTANT pentru documentatia site-ului (Storybook/MDX/etc.):**
Cand scriem docs pentru Field Row (si in general pentru orice compozit cu nested instances non-exposed), MENTIONAM explicit pattern-ul de editare:
> "Pentru a edita proprietatile unui input individual (Title, Placeholder, Size, State, icons etc.), **double-click** pe Field Row instance ca sa intri in nested Base Input, apoi editeaza in panoul drepta. Aceasta abordare pastreaza panoul principal curat (doar 2 boolean-uri) dar userul trebuie sa stie sa "sape" in layere."
Aceasta nota trebuie replicata in documentatia fiecarei componente care foloseste non-exposed nested instances (pattern recurent in sistemul nostru).
Descrierea asta e setata deja si pe componenta Field Row in Figma (vezi Inspect panel).

In showcase la Section / Internals (`4038:1410`) intre Form Group master si Premades.

**Premade Tokens (`-- Molecule/Form Group/Premade/...`)**
Namespace dedicat pentru premade cards. Separate de Form Group master (care e transparent).

Global:
```
-- Molecule/Form Group/Premade/Global/Size S/Padding  → - Spacing -/16
-- Molecule/Form Group/Premade/Global/Size M/Padding  → - Spacing -/24
-- Molecule/Form Group/Premade/Global/Size L/Padding  → - Spacing -/40 (primitive nou)
-- Molecule/Form Group/Premade/Global/Radius         → - Radius -/md
-- Molecule/Form Group/Premade/Global/Border Weight  → - Border Weight -/none
```

Per-type (alias la Global, pentru customization izolat):
- Log in, Reset password, Sign up, Address, Payment
- Fiecare cu Size S/M/L Padding, Radius, Border Weight (= 5 tokeni × 5 tipuri = 25 per-type tokens)

Toate 15 variante premade sunt bound la tokenii per-type corespunzatori.

**Avantaj:** schimbi doar Global → propagare pe toate tipurile. Sau override per-type pt customization specifica (ex: Payment are Radius diferit fara sa afecteze Log in).

**Layer naming cleanup:** 4 "Frame 6" (wrapperul 2-up Postal+City, Expiry+CVV in Address/Payment M/L) redenumite → "Field Row".

**Premade Form Groups** (`2325:12035`, 15 variante: 5 types × 3 sizes)
- Types: Log in, Sign up, Reset password, Address, Payment
- Sizes: S (363px), M (379px), L (395px)
- Bound la: `Size S/M/L Padding`, `Global Radius`, `Global Border Weight`, `Size S/M/L Gap` (recreati dupa ce fusesera sterși gresit)
- Naming fixes: `Size=LG` → `Size=L` (7 variante), `Type=Adress` → `Type=Address` (3 variante)
- Premade-urile sunt self-contained (propriu bg, padding, radius) — NU sunt instances de Form Group master; folosesc aceleasi tokeni `-- Molecule/Form Group/...` pentru consistenta.
- Adaugate in acelasi showcase (`4017:1500`) ca Section / Premades (`4031:1690`) — **MASTER component set mutat in showcase** (nu instances), cu title + 3-col explanation (Why premades exist / When to use them / How they differ from Form Group) + warning note.
Propagation test: 6 tokeni forțați cu valori exagerate (48/60/80/40/40/36) — cascada merge corect. Reverted la aliasurile originale dupa test.

### Organisms

**Stats Card Small (S/L)**
```
--Organism/Stats Card/Global/Padding → - Spacing -/16
--Organism/Stats Card/Global/Items-Gap → - Spacing -/16
--Organism/Stats Card/Global/Radius → - Radius -/L
--Organism/Stats Card/Global/Border Weight → - Border Weight -/thin
--Organism/Stats Card/Stats Card Small/size S/Min Width → 240px
--Organism/Stats Card/Stats Card Small/size L/Min Width → 328px
```

**Stats Card Big (L/XL/Mobile)**
```
--Organism/Stats Card/Stats Card big/L/Min Width → 680px
--Organism/Stats Card/Stats Card big/XL/Min Width → 768px
--Organism/Stats Card/Stats Card big/Mobile/Min Width → 320px
```

**Stacked List**
```
--Organism/stacked list/Global/Padding X → - Spacing -/16
--Organism/stacked list/Global/Padding Y → - Spacing -/12
--Organism/stacked list/Global/Gap → - Spacing -/16
--Organism/stacked list/Global/Inner Gap → - Spacing -/06
--Organism/stacked list/Global/Items Size → - Size -/32
--Organism/stacked list/Global/Border weight → - Border Weight -/none
--Organism/stacked list/Global/Icons size → - Size -/24
```
Variante: Default, Social, RideRow, Delivery row (fără Item Size — intenționat), Media row, Product, Booking, Item grid

**Top Bar Desktop**
```
--Organism/Top Bar/Desktop/Padding X → - Spacing -/16
--Organism/Top Bar/Desktop/Padding Y → - Spacing -/08
--Organism/Top Bar/Desktop/Item Gap → - Spacing -/24
--Organism/Top Bar/Desktop/Border Weight → - Border Weight -/thin
```
Variante: Elevated=off (border bottom), Elevated=on (shadow/md)

**Top Bar Mobile**
```
--Organism/Top Bar/Mobile/Padding X → - Spacing -/16
--Organism/Top Bar/Mobile/Padding Y → - Spacing -/08
--Organism/Top Bar/Mobile/Item Gap → - Spacing -/24
--Organism/Top Bar/Mobile/Icon size → - Size -/24
--Organism/Top Bar/Mobile/Icon button → - Size -/48
--Organism/Top Bar/Mobile/Border Weight → - Border Weight -/thin
```
Variante: Type=Mobile (large header), Type=Standard (compact)

**Side Bar**
```
--Organism/Side Bar/Width Expanded → - Size -/280
--Organism/Side Bar/Width Colapsed → - Size -/64  ← typo de corectat la JSON cleanup
--Organism/Side Bar/Gap → - Spacing -/32
--Organism/Side Bar/Border Weight → 2 (strong border)
```
Variante: Collapsed=off (280px), Collapsed=on (64px). Conține slots.

**Bottom Navigation Bar**
```
--Organism/Bottom Navigation bar/Padding X → - Spacing -/08
--Organism/Bottom Navigation bar/Padding Y → - Spacing -/04
--Organism/Bottom Navigation bar/Icon size → - Size -/24
--Organism/Bottom Navigation bar/Radius → 0
--Organism/Bottom Navigation bar/Border Weight → - Border Weight -/thin
```
5 items default: Home, Explore, Inbox, Projects, More. Shadow: effect/shadow/md/up

**Data Table**
```
--Organism/Data Table/Cell/PaddingX → - Spacing -/16
--Organism/Data Table/Cell/Height Compact → - Size -/40
--Organism/Data Table/Cell/Height Default → - Size -/48
--Organism/Data Table/Cell/Height Comfortable → - Size -/56
--Organism/Data Table/Cell/Border Weight → - Border Weight -/thin
```
Width celulă: fix per coloană (controlat de designer), nu tokenizat. Height: fix per densitate.

### Visualizations

**Chart (variant set, 56 variants)**

Set unic pentru toate tipurile de chart, replace pentru vechiul Bar/Spark line/Heatmap/Donut/Radial din pagina veche.

```
Chart (component set) — id: 4733:1424
├── Type: 14 valori — Line, Bar, Area, Area dublu, Pie, Doughnut, Polar Area, Radar, Scatter, Bubble, Heatmap, Spark line, Spark line double, Radial
├── Size: 4 valori — XS (130×80), S (240×140), M (360×200), L (480×280)
├── Show Grid (BOOLEAN) — toggle grid lines
├── Show Text (BOOLEAN) — toggle Y/X axis labels (auto-collapses via auto-layout când e off)
└── Total: 56 variante (14 × 4)
```

Arhitectura cartesian (Line/Bar/Area/Scatter/Bubble/Heatmap/Spark line/Spark line double/Area dublu) la S/M/L:
```
Wrapper (VERTICAL auto-layout, FIXED w/h)
└── Chart Area (VERTICAL auto-layout, FILL/FILL, itemSpacing = Axis Gap)
    ├── Plot Row (HORIZONTAL, FILL/FILL, itemSpacing = Axis Gap)
    │   ├── Y Axis Labels (VERTICAL auto-layout, 28 wide, FILL height = plot height, SPACE_BETWEEN)
    │   └── Plot (FILL/FILL grow=1) — Grid + line/bars/cells/etc.
    └── X Axis Row (HORIZONTAL, FILL/HUG)
        ├── Y Spacer (28 wide blank, alignment cu Y axis)
        └── X Axis Labels (HORIZONTAL auto-layout, FILL/HUG, SPACE_BETWEEN)
```

Heatmap: padding top/bottom pe Y axis = halfCellH ca labels să cadă pe centrele rândurilor (nu pe grid lines). Bar: padding stânga/dreapta pe X axis = halfCellW ca labels să cadă sub centrul barelor.

XS variants: niciun Y/X axis frame (chart pur, no labels). Plot ocupă toată Chart Area.

Arhitectura radial (Pie/Doughnut/Polar Area/Radar/Radial):
```
Chart Area (FRAME layoutMode NONE)
└── Ring (FRAME, FIXED square pe minDim, constraints CENTER+CENTER, constrainProportions=true)
    └── Slices/Spokes/Vertex Dots (VECTOR/ELLIPSE cu SCALE+SCALE constraints)
```

Ring rămâne pătrat-rotund când userul redimensionează wrapper-ul (nu se ovalizează). Per size: ring diameter = 100 / 124 / 200 / 280 (XS/S/M/L) constrained la min(plot.w, plot.h)-padding.

Tokeni:
```
--Organism/Stats card nou/Chart/Axis Gap → - Spacing -/20  (gap între axe și plot, bound pe itemSpacing)
--Organism/Stats card nou/Chart/Line Stroke → - Border Weight -/thick (=2)
--Organism/Stats card nou/Chart/Grid Stroke → - Border Weight -/thin (=1)
```

Text styles:
```
L variants  → Caption/300 (Inter Light 12px)
S+M variants → Caption/XS  (Inter Light 10px)
XS variants → no labels
```

Y axis label width FIX la 28px (textAutoResize=NONE) ca labels gen "100" sau "W1" să nu wrapeze pe 2 linii. X labels HUG width.

Convenții vizuale per chart type:
- **Line / Spark line / Spark line double / Area lines** — stroke 2px round caps, color = accent (sau success pe Line B în dublu/double)
- **Bar** — fill solid accent, top corners radius 3
- **Heatmap** — 10-step `Palette/primary/50..900` ramp (value 0-100 → bucket 0-9). Solid colors, fără opacity. Grid layer eliminat.
- **Polar slices** — paint 100% color (per palette accent/success/warning/danger/info) + node `opacity=0.25` + stroke solid 100% pe slice. NU paint opacity (se strică la detach).
- **Area + Area dublu fill polygons** — paint 100% + node opacity 0.25 + stroke pe polygon (matches fill, weight 2). Linia separată pe top la 100% (pattern "stroke duplicat fără opacity").
- **Bubble + Scatter** — fiecare shape duplicat: fill-only ellipse (paint 100% + node opacity 0.25) + stroke-only clone pe top (100%).
- **Radar** — 5 vertex dots la colțurile pentagonului exterior (FULL radius), fiecare cu altă culoare din paletă (accent/success/warning/danger/info). Data polygon: paint accent + node opacity 0.25 + stroke 2px solid.
- **Radial** — 3 inele activity (75% / 55% / 85%), fiecare cu Track muted (border/muted) + Progress (accent/success/warning), capete rotunde, stroke weight scalat per Ring size.

Lectii hard-won (vezi și `~/.claude/projects/.../memory/feedback_figma_chart_constraints.md`):
- `figma.createSlot` și `frame.markAsSlot` NU există → marcarea ca SLOT trebuie făcută manual în UI
- Paint opacity NU se poate bind la o variabilă (`setBoundVariableForPaint` doar pentru `color`). Workaround: hardcoded value matching token, sau node-level opacity (dimează și stroke).
- `vectorPaths` nu suportă comanda SVG `A` (arc) — convert la cubic Bezier (4/3·tan(θ/4))
- Paint cu `boundVariables.color` păstrează `opacity` field în date, DAR Figma rendering pe canvas dark face transparent să pară solid; pe canvas light apare corect
- `figma.createComponentFromNode(wrapper)` invalidează referința originală → citește `.name` ÎNAINTE de apel
- După apply text style, `textAutoResize='WIDTH_AND_HEIGHT'` se revertă la `'HEIGHT'` → workaround: width fix pe text + frame
- `SCALE` constraint scalează fiecare axă independent — circles devin ovale pe parent non-square

---

### Organisms

**Stats card small (modular cu instance swap slots)** — id `4789:1127`

Replace pentru vechiul `Stats card small` (2026:1231 — Size=S/L cu props rigide). Noul build e modular cu **4 INSTANCE_SWAP slots** + **4 visibility booleans**.

```
Stats card small (component, 280×200 default)
├── Top (HORIZONTAL auto-layout, FILL/HUG, gap 12, align CENTER, SPACE_BETWEEN)
│   ├── Leading slot   → INSTANCE_SWAP, default li:briefcase (90:25022)
│   ├── Main slot      → INSTANCE_SWAP, default _Metric Standard (2027:1421), FILL width
│   └── Trailing slot  → INSTANCE_SWAP, default li:ellipsis (90:24630)
└── Bottom slot         → INSTANCE_SWAP, default Chart Type=Spark line Size=M (4731:2144), FILL/FILL grow=1
```

Properties:
- `Leading` (INSTANCE_SWAP, default 90:25022)
- `Main` (INSTANCE_SWAP, default 2027:1421)
- `Trailing` (INSTANCE_SWAP, default 90:24630)
- `Bottom` (INSTANCE_SWAP, default 4731:2144)
- `Show Leading` / `Show Main` / `Show Trailing` / `Show Bottom` (BOOLEAN, default true)

Wrapper tokens (toate bound):
```
fill            → bg/surface
stroke          → border/muted, weight 1
radius          → - Radius -/md
padding (4×)    → - Spacing -/16
gap             → - Spacing -/12
```

Scop: userul construiește orice tip de stats card (avatar+nume+chart, icon+metric+trend+sparkline, etc.) prin swap pe slot-uri. Zero internals noi — folosim ce există (Metric Standard, icons, Chart set).

Note: vechiul Stats card small (2026:1231) cu Size=S/L încă există în file, nedeleted. Decizie pending: replace sau leave legacy alongside.

---

## Moduri de testare tokeni

Colecțiile Primitives, Semantics și Components au câte 2 moduri: **Max core** (producție) și **Test**.

Cum se testează propagarea tokenilor:
1. Creează o **Section** în Figma
2. Setează secțiunea pe modul **Test** pentru toate 3 colecțiile (Primitives, Semantics, Components)
3. Pune instanțe ale componentei în secțiune
4. Modifică valorile tokenilor în modul Test (ex: radius sm → full, padding 06 → 12)
5. Verifică vizual că instanțele reflectă modificările
6. **NU modifica modul Max core** — acesta e producția

Colecția Colors are **Light Mode** și **Dark Mode** (nu are mod Test).

Secțiunea de test existentă: Section 1 (id: `3001:10912`) pe pagina "Buttons" — conține butoane pe toate size-urile cu Test mode activ.

---

## QA Playbook complet (învățat din Base Input + BottomLine)

Procesul de mai jos e standardul pentru fiecare componentă nouă. **Respectă ordinea — fiecare pas depinde de cel anterior.**

### Pas 0 — Pre-QA cleanup (2 min)

Înainte să atingi orice, verifică sănătatea componentei:

```js
// Check for hidden/abandoned duplicates in the section
const section = await figma.getNodeByIdAsync("<sectionId>");
// Look for: visible:false components, "_" or lowercase in names, weird variant values like "state6"
```

**Întreabă userul** dacă găsești duplicate ascunse înainte să ștergi. Frequent issue: utilizatorul a refăcut un wrapper și a ascuns vechiul cu naming stricat.

### Pas 1 — Inspect (5 min)

Foloseste 3 tool-uri în paralel:
- `get_metadata` — overview structură (component sets, variants, dimensions)
- `get_screenshot` — context vizual
- `get_variable_defs` — toți tokenii folosiți

Apoi `use_figma` cu cod care extrage:
- `componentPropertyDefinitions` (poate da error dacă sunt duplicate variants — fix mai întâi)
- Variantele componentei (id, name, position)
- Sample variant cu structură completă (children, fills, strokes, boundVariables)
- Special: focus ring instances (id, position, visibility, propRef)

⚠️ **Gotcha:** dacă un component set are duplicate variant names, `componentPropertyDefinitions` aruncă "Component set has existing errors". Fix duplicates first.

### Pas 2 — Naming fixes

Pattern aplicate la fiecare componentă:

```
.X-options-something-something  →  .ComponentName-Options
Component_With_Underscore        →  Component With Space (Title Case)
Size=MD, Size=LG                →  Size=M, Size=L
Disabled=off, Disabled=on       →  Disabled=Off, Disabled=On (Title Case bool values)
state=hover                     →  State=Hover (Title Case property + value)
li:triangle, li:x               →  Left Icon, Right Icon (semantic names)
Frame 1, Rectangle 1            →  Semantic name (e.g., "Avatar BG", "Pin Container")
Variant=Filled                  →  Variant=Primary (match Standard Button convention)
Succes                          →  Success (typo)
Apparence                       →  Appearance (typo)
Wrokspace                       →  Workspace (typo)
```

**ATENȚIE Focused:** niciodată ca State variant value. Focused = BOOLEAN property ce controlează `.Focus-ring` instance visibility. Vezi Pas 5.

### Pas 3 — Token audit

```js
// Walk every node in every variant, flag hardcoded values
const num = (x) => typeof x === "number" ? x : 0;
const checkNode = (n, prefix) => {
  const bv = n.boundVariables || {};
  if ("layoutMode" in n && n.layoutMode !== "NONE") {
    if (num(n.paddingTop) > 0 && !bv.paddingTop) issues.push(`${prefix} > ${n.name}: paddingTop HARDCODED`);
    // ... padding bottom/left/right, itemSpacing
  }
  if ("cornerRadius" in n && typeof n.cornerRadius === "number" && n.cornerRadius !== 0) {
    if (!bv.topLeftRadius && !bv.cornerRadius) issues.push(`...radius HARDCODED`);
  }
  if ("strokes" in n && n.strokes?.length > 0) {
    if (num(n.strokeWeight) > 0 && !bv.strokeWeight && !bv.strokeTopWeight) issues.push(`...strokeWeight HARDCODED`);
    n.strokes.forEach((s, i) => { if (s.type === "SOLID" && (!bv.strokes || !bv.strokes[i])) issues.push(`...stroke color HARDCODED`); });
  }
  if (Array.isArray(n.fills)) {
    n.fills.forEach((f, i) => { if (f.type === "SOLID" && f.visible !== false && (!bv.fills || !bv.fills[i])) issues.push(`...fill HARDCODED`); });
  }
  if ("children" in n) for (const c of n.children) checkNode(c, prefix);
};
```

⚠️ **Gotcha:** `figma.mixed` is a Symbol — can crash `>` comparisons. Use `num(x)` helper.

Also check for orphan `---` tokens:
```js
const orphans = allVars.filter(v => v.name.includes("---") && v.name.toLowerCase().includes("componentkeyword"));
```

Și verifică alias chain — toți tokenii component trebuie să aliaseze semantici, nu valori raw (excepție: globals ca Min Width 160 unde nu există semantic primitive corespunzător).

### Pas 4 — Color audit

```js
const collectColors = async (n, label, results) => {
  const bv = n.boundVariables || {};
  if (bv.fills) for (const fb of bv.fills) results.push(`${label} > ${n.name}: fill = ${(await figma.variables.getVariableByIdAsync(fb.id))?.name}`);
  if (bv.strokes) for (const sb of bv.strokes) results.push(`${label} > ${n.name}: stroke = ${(await figma.variables.getVariableByIdAsync(sb.id))?.name}`);
  if ("children" in n) for (const c of n.children) await collectColors(c, label, results);
};
```

Sample 6 variants (Default + Error + Success × Primary + Secondary). Verifică:
- Label text → text/secondary (sau text/primary dacă form labels deliberate)
- Placeholder + helper → text/muted
- Icons → text/muted (Default), status/*/default (Error/Success)
- Input fill (Primary) → bg/default sau bg/surface
- Input stroke → border/default
- Error/Success → status/danger/* sau status/success/* consistent (default + subtle + border)
- State Layer → overlay/default black
- Disabled → opacity layer pe variantă, NU culori separate

⚠️ **Colors collection nu are Test mode** (per CLAUDE.md). Nu poți forța color tokens prin section overrides. Verificare pe culori = static binding audit (citește toți boundVariables.fills/strokes).

### Pas 5 — Focus ring handling

**REGULA:** Focus = BOOLEAN property pe wrapper, nu State variant value.

```js
// Wrapper trebuie să aibă:
{
  "Focused#XXX": { type: "BOOLEAN", defaultValue: false },  // toggle
  "State": { type: "VARIANT", variantOptions: ["Default","Hover","Pressed","Active"] },  // FĂRĂ "Focused"
  "Disabled": { type: "VARIANT", variantOptions: ["Off","On"] }
}
```

Fiecare State variant (excepție Disabled=On) trebuie să aibă o instanță de `.Focus-ring` cu:
- `visible: false` default
- `componentPropertyReferences: { visible: "Focused#XXX" }` — bound la boolean

**Position:** focus ring acoperă DOAR Input frame (zona focusabilă), NU label/helper text. Calculează:
- `inputY = 20` (după Title 12px + Items Gap 8px)
- `inputH = 44` (Size S; verifică)
- `inputW = 240` (Size S)
- Outset 4.5px: `ring.x = -4.5, ring.y = inputY - 4.5, w = inputW + 9, h = inputH + 9`

Standardizează ringurile dacă găsești inconsistențe între variants:
```js
const OFFSET = 4.5;
for (const v of wrapper.children) {
  const ring = v.children.find(c => c.name === ".Focus-ring");
  if (!ring) continue; // Disabled n-are ring (corect)
  ring.x = -OFFSET;
  ring.y = inputY - OFFSET;
  ring.resize(inputW + OFFSET * 2, inputH + OFFSET * 2);
}
```

**NU adăuga State=Focused variant** — duplicate funcționalitate cu boolean.

### Pas 6 — Test section + propagation test

```js
// Set Test mode on section for all 3 collections
const collections = await figma.variables.getLocalVariableCollectionsAsync();
for (const coll of collections.filter(c => ["Max Core - Primitives","Max Core - Semantics","Max Core - Components"].includes(c.name))) {
  const tm = coll.modes.find(m => m.name === "Test");
  if (tm) section.setExplicitVariableModeForCollection(coll, tm.modeId);
}
```

Build instances (NU duplicate masters!) într-un frame inside section. Grid cu 3 Validations × 3 Sizes × N Variants + wrapper states row.

**FORȚEAZĂ FIECARE TOKEN al componentei.** Nu sample. Lista pentru un input típic per size:
- Radius
- Padding X
- Padding Y
- Stroke Weight
- Icon Size
- Inner Gap
- Items Gap
- Min Width

Dacă size are 8 tokeni × 3 sizes = 24 tokeni de testat. Plus globale (Padding X global, Min Width global). **Total = 24-30+ pe input típic.**

```js
const overrides = [
  ["-- Molecule/X/Size S/Radius", findVar("- Radius -/2xl"), "Radius S → 2xl"],
  // ... 24+ entries
];
for (const [name, target, desc] of overrides) {
  const v = findVar(name);
  if (!v || !target) { log.push(`SKIP ${name}`); continue; }
  v.setValueForMode(compTM, { type: "VARIABLE_ALIAS", id: target.id });
}
```

Folosește valori EXAGERATE (Radius 2xl/3xl, Padding 32/48, Stroke 6px raw, Min Width 320) — propagarea trebuie să fie evidentă vizual. Apoi screenshot test root, verifică fiecare token (rotunjire, padding, grosime stroke, lățime).

⚠️ **Verifică pe instances, nu pe master.** Section explicit modes nu afectează masters din afara section-ului. Confirmă cu:
```js
const inst = root.findOne(n => n.type === "INSTANCE");
inst.width // ar trebui să arate efectul tokenilor (e.g. Min Width forțat → 320 nu 240)
```

### Pas 7 — Showcase (template Entity Item)

**Reference template:** `Entity Item` (id 3792:2) — copiază structura exactă.

```
ROOT FRAME (1336 × auto, layoutMode NONE, clipsContent: true, bg/surface, Dark Mode)
├── ELLIPSE (decorativ): -480, -246, 1087×1100, fill rgb(67,56,202), opacity 0.2, LAYER_BLUR 999
├── HERO frame at (80, 64, 1040 wide, layoutMode VERTICAL, itemSpacing 16, clips)
│   ├── Title: 60px Inter Black, text/primary
│   ├── "See documentation →": 18px Inter Light, accent/default
│   ├── Description: 18px Inter Light, text/muted (resize width 1040)
│   └── Divider: 1040×1 rectangle, text/primary @ opacity 0.15
├── INFO frame at (80, 300, 1040 wide, VERTICAL, itemSpacing 24, clips)
│   ├── Title: 24px Inter Bold, text/primary
│   └── Body: 16px Inter Light, text/secondary (NOT muted!) — multi-line description
├── MASTER components MOVED INSIDE root (NU instances!):
│   - Wrapper at x:280, y:632 (give 200px left padding for state labels)
│   - Options master below wrapper
└── AXIS LABELS positioned absolutely:
    ├── Caption headers: "WRAPPER", "OPTIONS" (10-11px Bold uppercase, letter-spacing 8%, text/muted)
    ├── Subtitle Light: state count + variant breakdown
    ├── State labels (col stânga wrapper): 10px Bold caps + "Disabled · Off" sub-label
    ├── Validation chips (stânga options): pill-shaped, accent/Surface/danger.subtle/success.subtle bg, 9px Bold caps tracked, status color text
    ├── Variant row labels (Primary/Secondary): 9px caps tracked, text/muted
    ├── Size column labels (S/M/L): 14px Bold + "240px" Light below
    ├── Axis micro-labels: "SIZE →", "VALIDATION ↓" (9px caps tracked, text/muted)
    └── Group separators: 1px line, border/muted @ 0.4 opacity, between validation groups
```

**FĂRĂ "Atoms used" section** dacă componenta nu folosește atoms identificabile (input nu are; entity item are).

⚠️ **Gotcha:** dacă root e auto-layout VERTICAL și apelezi `resize(w, h)` după `primaryAxisSizingMode = "AUTO"`, height-ul rămâne fixat la h. Workaround: re-aplică `primaryAxisSizingMode = "AUTO"` după ce ai adăugat children.

⚠️ **Ellipse positioning:** dacă root e auto-layout, ellipse ajunge în flow. Set `ellipse.layoutPositioning = "ABSOLUTE"` sau folosește root cu layoutMode NONE.

⚠️ **Clipped labels:** dacă pui labels la x:negativ și root.clipsContent=true, labels-ul e tăiat. Mut masters cu 200px right (x:280 nu x:80) ca să faci loc labels-urilor stânga.

### Pas 8 — Update CLAUDE.md

Per componentă, adaugă block:
```markdown
- **<Component> ✓ (QA complet + showcase + test — <DD Mon YYYY>)**
  - **Cleanup pre-QA:** (dacă a fost cazul)
  - **Naming fixes:** (lista detaliată cu before → after)
  - **Token audit:** N tokeni, X% aliasează semantici, zero hardcode, zero `---`
  - **Color audit:** lista per state cu tokenii folosiți
  - **Focus ring fix:** poziție/dimensiune
  - **Token propagation test COMPREHENSIVE PASSED:** TOATE tokenii listate cu valoarea forțată
  - **Showcase:** Section ID, root ID, scurt descripție template
```

Bifează în "Componente rămase de testat" cu ✓.

---

## Onboarding page (TODO — de construit in Figma si site docs)

Pagina dedicata pentru educarea designerilor noi care vin pe DS. Toate lectiile invatate strans in un loc.

### Sectiuni propuse

1. **Figma Navigation Pro Tips**
   - Layers panel (mereu deschis, expanded, 1-click access)
   - Shortcuts: `Enter` (intra 1 nivel), `Shift+Enter` (iesi), `Esc` (iesi complet), `⌘+P` (quick actions), `⌘+/` (menu search)
   - Deep select (`⌘+Click`) = prea mult uneori → prefera double-click progresiv sau Layers panel
   - Right-click → "Select layer" submenu pt list layers sub cursor

2. **FILL vs HUG (auto-layout fundamentals)**
   - FILL = ia tot spatiul parent-ului pe axa respectiva
   - HUG = creste pe baza content-ului
   - FIXED = valoare explicita
   - **Trap:** FILL intr-un HUG parent → parent nu are width de FILL-uit → child colapseaza la minWidth
   - Chain exemplu valid: Form Group FIXED 480 → Items FILL 480 → Field Row FILL 480 → Base Input FILL 234
   - Chain exemplu invalid: Form Group HUG → Items FILL → colaps

3. **Slots (native Figma)**
   - Ce sunt: frame auto-layout marcat ca Slot, accepta orice component drag-drop
   - Slot-in-slot NU merge (limitare Figma) → folosim composite workarounds (ex: Field Row ca atom separat cu sloturi proprii)
   - Plugin API: **APPEND only** pe instances — nu poti remove/modify slot children. Implicatii pt automatizare premade-uri.

4. **Override inheritance lock (size variant bug)**
   - Problema: modifici text pe nested instance → schimbi variant parent → nested nu propaga Size
   - Cauza: Figma marcheaza customized child ca "locked" sa nu pierzi overrides
   - Workarounds: Pick size first, selective Reset on child, or Duplicate & redo
   - **Rule pentru designer:** Never change size variant after customization

5. **State shell + Options pattern (architecture reasoning)**
   - Base Input (State variants) wraps .Base-Input-Options (Size/Variant/Validation)
   - Math: fara shell = 5×3×3×2 = 90 variants per input. Cu shell = 5 (shell) + 27 (options) = 32. Saving 3x+.
   - Industry pattern: Material, Ant, Chakra toate folosesc aceasta

6. **Slot vs INSTANCE_SWAP vs Exposed nested (cand alegi ce)**
   - **Slot (native):** max flexibility, drag-drop, dar plugin API read-only
   - **INSTANCE_SWAP:** fixed count dar programmable, dropdown swap
   - **Expose nested:** props bubble la parent dar "carnat" de props
   - **Rule of thumb:** Slot for N children dynamic, Instance Swap for fixed slots needing API control, Expose selective doar pt 2-3 most-edited props

7. **Token architecture (4 niveluri)**
   - Primitive (raw value: 16, #6366F1) → Semantic (accent/default) → Component (`-- Molecule/.../`) → Variant (`Size S/Padding`)
   - Prefixe: `-` semantic/primitive, `--` component, `---` OLD/WRONG (de inlocuit)
   - Global token justificat doar daca 2+ sub-componente il folosesc
   - Descriere pe fiecare token (cand, unde, default value)

8. **Responsive pattern choices (Action Bar case study)**
   - Evaluated: `layoutWrap=WRAP` (fluid, auto-stack when narrow) vs explicit `Direction=Horizontal/Vertical` variants
   - Decision: Variante explicite — predictabil, fara magic, aliniat cu industry (Material, Ant)
   - Lectie generala: **predictability > magic** in DS components

### Rationale pt onboarding page
- Reduce support overhead ("cum ajung la .Base-Input-Options?")
- Alinieaza designerii pe pattern-uri inainte sa genereze bugs
- Document-eaza **DE CE** (rationale) nu doar **CUM** — fara de ce, reguli par arbitrare

---

## Figma platform quirks (de mentionat in docs site)

**⚠️ Override inheritance lock (NESTED INSTANCES)**
Cand user override-uieste ceva (text, vizibilitate, prop) pe o nested instance (ex: Base Input in Field Row in Form Group instance), Figma marcheaza acel child ca "customized" si BLOCHEAZA propagarea schimbarilor de parent variant.

**Reproducere:**
1. Iei Form Group Size=S instance
2. Modifici Placeholder pe un input (ex: "Username")
3. Incerci sa schimbi variant la Size=M
4. Input-ul **ramane Size=S** (nu se mareste la M)

**Cauza:** By-design in Figma — sa nu iti piara override-urile. Customized child nu mai accepta restructure din parent.

**Workarounds pentru designeri:**
- **Alege Size de la inceput** — decide S/M/L INAINTE sa override-uiesti textele
- **Reset selective** — right-click pe child → Reset → alege doar Size (pastreaza text)
- **Duplicate & redo** — daca ai gresit size, duplica instance + schimba size + re-introduci textele

**Impact pe arhitectura:** NU mai oferi "schimbare size prin variant switch" ca workflow in docs. Spune explicit: "Pick size at creation time. Changing size on a customized instance requires resetting overrides on nested inputs."

Aceasta nota TREBUIE in documentatia site-ului pentru Form Group (si orice componenta cu variante size + nested instances).

---

## Lecții importante (greșeli de evitat)

1. **NU adăuga State=Focused variant.** Focused e BOOLEAN. Verifică `componentPropertyDefinitions` ÎNAINTE să presupui structura.

2. **NU duplica functionality.** Dacă vezi un duplicate variant cu același nume, cel mai probabil e o clonă greșită — verifică ce face și șterge dacă nu adaugă ceva. Întreabă userul dacă pare intenționat.

3. **NU folosi instances în showcase pentru a reprezenta master.** Mută MASTER-ul propriu-zis în showcase frame. Asta arată direct varianta autoritativă.

4. **NU sample-test tokeni.** Forțează FIECARE token al componentei. User-ul te va întreba "ai testat toți?" și răspunsul trebuie să fie da, nu "majoritatea".

5. **NU testa pe master.** Section-level explicit modes afectează doar copiii section-ului. Master-ul componentei e altundeva (afară din section). Foloseste instances inside section.

6. **NU pune Focus ring peste tot variantul.** Doar peste Input frame (zona focusabilă). WCAG.

7. **NU ignora figma.mixed.** Crash-uri pe `>` cu Symbol. Folosește helper `num(x) = typeof x === "number" ? x : 0`.

8. **NU presupune sizing mode rămâne AUTO.** Dacă apelezi `resize(w, h)` după setare sizing AUTO, dimensiunea fixă suprascrie. Re-aplică AUTO după adăugare children.

9. **NU adăuga axis labels în zonă clipped.** Dacă root.clipsContent=true și labels la x:negativ → tăiate. Mută masters cu 200px right.

10. **NU rebuild showcase fără să muți masters înapoi.** Dacă ștergi root showcase care conține masters, masters sunt șterși cu el. Mută-i mai întâi în secțiunea originală.

---

## Proces QA per componentă

### Teste obligatorii:
1. **States × Sizes** — toate state-urile la fiecare size, verifică:
   - Width consistent între state-uri la același size
   - Height consistent (± 2px acceptabil pentru press effect)
   - No layout shifts la tranziția între state-uri
2. **Variants × Tones** — toate combinațiile la un size de referință (M), verifică:
   - Culori corecte per tone
   - Border-uri prezente pe Secondary, absente pe Ghost
   - Dimensiuni identice între variante
3. **Edge Cases** — verifică:
   - Text lung (se stretch-uie orizontal)
   - Text scurt / single char (nu se rupe)
   - Cu/fără icoane stânga/dreapta (height stabil datorită minHeight)
   - Fără label (doar icoane)
   - Un singur icon (aspect quasi-pătrat)
4. **Token propagare** — în secțiunea Test mode:
   - Modifică un token global (ex: Radius) → verifică că toate instanțele se actualizează
   - Modifică un token per-size → verifică doar size-ul afectat

### Tipuri de buguri de căutat:
- `layoutMode: "NONE"` pe variante care ar trebui să fie auto-layout (cauzează non-propagare Size)
- Text overflow din containere (width text > width card)
- minHeight insuficient (padding × 2 + content > minHeight)
- Tokeni nebindați (valori hardcodate în loc de variabile)
- Tokeni vechi cu prefix `---`

---

## Reguli de tokenizare — ce să faci când tokenizezi o componentă

### Workflow standard
1. **Citește `get_variable_defs`** pe componentă — identifică ce tokeni lipsesc sau sunt greșiți
2. **Identifică tokenii vechi** (prefix `---` cu 3 dash-uri) → înlocuiește-i
3. **Creează tokenii noi** în colecția `Max Core - Components`
4. **Aliasează la tokenii semantici corecți** (`- Spacing -/16`, `- Radius -/sm` etc.) — NICIODATĂ valori hardcodate
5. **Verifică cu `get_variable_defs`** după modificări

### Tokeni globali vs per-componentă
- **Global token** = justificat DOAR dacă minim 2 sub-componente diferite aliasează același token
- **Per-componentă** = dacă e folosit o singură dată, aliasează direct globalul
- **Nu duplica** tokenii de sub-componente (ex: Input PaddingY vine din Input, nu din Table Header)

### Ce NU se tokenizează
- Height/Width pe autolayout (se calculează automat)
- Gap setat pe "auto" sau "between"
- Padding redundant când height-ul e fix

---

## Tokeni vechi de înlocuit (audit pending)

La orice componentă, dacă găsești acești tokeni, înlocuiește-i:

| Token vechi (greșit) | Token corect |
|---|---|
| `--- Atoms ---/--- Avatar/Size-s/Avatar size` | `-- Atoms/Avatar/Size-S/Size` |
| `--- Atoms ---/--- Avatar/Size-lg/Avatar size` | `-- Atoms/Avatar/Size-L/Size` |
| `--- Atoms ---/--- Avatar/Size-xl/Avatar size` | `-- Atoms/Avatar/Size-xl/Size` |
| `--- Radius ---/avatar` | `-- Atoms/Avatar/Global/Radius` |
| `--- Radius ---/Dropdown` | `- Radius -/md` |
| `--- Typeface family ---/base` (3 dash-uri) | `- Typeface family -/base` (1 dash) |
| `--- Organsim ---/--- Top Bar/...` | `--Organism/Top Bar/...` |
| `-- Molecule/User Card/...` | `-- Molecule/Entity Card/...` |
| `-- Molecule/User-Item/...` | `-- Molecule/Entity Item/...` |

**Atenție la font-uri:** `--- Typeface family ---/base` referențiază Red Hat Display (greșit). `- Typeface family -/base` referențiază Inter (corect). Verifică textele din componente.

---

## Typo-uri de corectat la JSON cleanup final

- `Width Colapsed` → `Width Collapsed` (Sidebar)
- `Tabel Header` → `Table Header` (Data Table)
- `succes` → `success` (status tokens)
- `TOP Bar` → `Top Bar`

---

## Decizii arhitecturale importante

- **Shadows** sunt Effect Styles hardcodate (nu variabile) EXCEPT `shadow/color/1-4` care sunt variabile cu light/dark mode pentru theming
- **Delivery Row** din Stacked List nu are `Item Size` — intenționat (compoziție vizuală unică)
- **Standard Button MinWidth = 0** — intenționat (safeguard eliminat)
- **Pressed effect** — în Figma: overlay-only (black 0.2 opacity), fără position shift. În cod (React): `transform: translateY(2px)` pe `:active` — translateY nu afectează layout-ul. Decizie: Figma nu poate face press-down fără să rupă tokeni sau layout, deci efectul vizual de apăsare se adaugă doar la implementarea în cod.
- **Entity Card/Item** în loc de User Card/User Item — naming mai generic
- **Bottom Nav** are background pe container, nu pe fiecare item
- **Table Cell** are height FIX (nu autolayout) per densitate; width fix per coloană
- **Data Table Row** nu are tokeni — dimensiunile vin din celule
- **Search Bar cu buton** — button e în interior, valid doar Desktop; Mobile folosește Enter

---

## Workflow tipic cu MCP în Claude Code

### La tokenizare
```
1. get_screenshot(nodeId) — vezi vizual componenta
2. get_metadata(nodeId) — înțelege structura (variante, sub-noduri)
3. get_variable_defs(nodeId) — verifică tokenii existenți
4. get_variable_defs(variantNodeId) — verifică fiecare variantă separat
5. Identifică: tokeni lipsă, tokeni vechi, valori hardcodate
6. Creează/modifică în Figma manual sau prin use_figma (dacă write access disponibil)
7. Verifică din nou cu get_variable_defs
```

### La fix layout
```
1. get_design_context(nodeId) — cod React generat, structură completă
2. get_screenshot(nodeId) — screenshot vizual
3. Analizează problema din cod și screenshot
4. Fix manual în Figma sau prin use_figma
```

### La generare cod React
```
1. get_design_context(nodeId, clientFrameworks: "react", clientLanguages: "typescript")
2. Adaptează codul la Max Core conventions:
   - CSS custom properties din tokens
   - var(--token-name) pentru tokeni
   - Niciodată valori hardcodate
3. Verifică fidelitate cu get_screenshot
```

---

## Componente construite

- [x] Data Table (complet — Header, Cells, Rows, Expandable, Footer, Pagination)
- [x] Table Builder (Desktop + Mobile cu scroll, 5 prebuildere: Invoice, Users, Tickets, Products, Transactions)
- [x] Card (Base — 3 elevații, body slot, header/footer booleans)
- [x] Media Card (3 elevații, media slot + content slot, tag/date booleans)
- [x] Bottom Sheet Builder (handle, header, body slot, footer slot, booleans)
- [x] Bottom Sheet Premade (18 variante: Share, Transport, Ride, Payment, Commerce, Auth, Media, Booking, Info)
- [x] Content Blocks (Heading Block, Text Block, Image Placeholder)
- [x] Stacked List / Transport variant + Share Item tonalități (Default, Success, Warning, Danger)

## Completat în sesiunile anterioare

### Faza 1 — Token Deep Cleanup (DONE)
- [x] 958 tokeni documentați cu descrieri, "Used in", "Aliased by"
- [x] 395 tokeni redenumiti (naming consistent: spații între cuvinte, Title Case, zero typo-uri)
- [x] Zero tokeni vechi `---` în Components collection
- [x] Tokeni orfani `---` din Button/Avatar șterși (din alte colecții)
- [x] Color token naming: all lowercase pe semantic (accent/subtle, border/accent, text/accent)
- [x] `succes` → `success` fixat pe Palette + semantic colors
- [x] Mode names: `Reference Light` → `Light Mode`, `Dark mode` → `Dark Mode`

### Faza 4 — Colors & Text Styles (DONE)
- [x] Color audit: logica aliasurilor e corectă, dark mode swap-uri OK
- [x] Inner shadow effect styles create (sm, md, lg) cu shadow/inner/color 1-3
- [x] Text styles update: 15 styles total
  - 400 → 300 (Light weight), 600 → 700 (Bold weight)
  - Letter spacing adăugat: headings -1.5%/-0.5%, caption +0.5%
  - Body/LG (18px) adăugat
  - Caption/XS (10px) redenumit din "!! Very Small !!"
  - Line height + letter spacing NU se tokenizează (Figma forțează pixeli, nu procente)
- [x] Test Art Deco (teal + gold + Playfair Display) — funcționează, reverted la indigo

### Faza 2+3 — Testare & Documentație (IN PROGRESS)
- [x] Standard Button showcase creat (toate 48 variante + 5 states pe grid)
- [x] Button variant naming fixat: Succes→Success, LG→L, Xl→XL, state→State
- [x] Documentația Standard Button completată (Definition, How to use it, How is created, Tokens)
- [x] **Standard Button QA complet (31 Mar 2026):**
  - Creat test section (Section 1, id: 3001:10912) cu 3 grupe de teste:
    - TEST 1: States × Sizes — verificare layout shift pe toate 5 state × 4 sizes
    - TEST 2: Variants × Tones — verificare 12 combinații (3 variant × 4 tone) la Size M
    - TEST 3: Edge Cases — long text, short text, single char, no icons, no label, only icon
  - **BUG GĂSIT ȘI FIXAT:** Pressed state avea `layoutMode: "NONE"` (restul aveau HORIZONTAL)
    - Cauza: Pressed folosea poziționare manuală (y: 2) pt efectul de apăsare
    - Efect: Size property nu propaga — Pressed rămânea la 120×32 indiferent de Size
    - **Fix aplicat:** `layoutMode: "HORIZONTAL"` + `paddingTop: 2` (păstrează efectul de 2px press)
    - Rezultat: Width identic pe toate state-urile, +2px height pe Pressed (acceptabil)
  - Token propagare verificată: modificat tokeni Test mode → butoanele reflectă corect
  - **Verdict: Standard Button GATA DE PRODUCȚIE**
- [ ] **NEXT: Continua cu restul componentelor — pentru fiecare:**
  1. Rearanjează variantele în component set pe grid frumos
  2. Fixează naming pe proprietăți
  3. Reproduce toate posibilitățile într-o secțiune showcase
  4. Testează tokeni prin schimbarea lor (secțiune test separată)
  5. Scrie documentația (Definition, How to use it, How is created, Tokens)

## Pagina de documentație — template matriță

Pagina Standard Button (node `2990:10905`, pagina "Text Styles") servește ca **template pentru toate componentele**. Structura:

1. Hero section — butoane scattered + titlu + descriere
2. Sidebar stânga — Docs nav cu search, sitemap, components list, Switcher Design/Dev
3. "On this page" sidebar dreapta — navigare pe secțiuni
4. Secțiuni conținut: Definition → Variants → Sizes → Interaction States → Dark Mode Preview (light vs dark side-by-side) → Color Reference (swatches cu token names) → Token Architecture (tabele cu Data Table components) → Exposed Properties → Usage Guidelines (Do/Don't cards cu live instances) → How to Modify

**Sidebar-ul din stânga** trebuie replicat identic pe pagina Side Bar component când ajungem acolo — e un bun exemplu de side nav funcțional.

**Reguli pentru content:**
- Toate textele folosesc text styles din sistem (Heading/H3, H4, H5, Body/LG/300, Caption/700, Caption/300)
- Toate culorile pe text sunt bind-uite la Max Core Colors (text/primary, text/muted, status/*)
- Toate instanțele de componente sunt live (nu screenshot-uri)
- Do/Don't cards folosesc status/success/subtle + border și status/danger/subtle + border
- Dark Mode Preview folosește setExplicitVariableModeForCollection pe panouri

---

## Status culori actualizat (31 Mar 2026)

Paletele de status au fost actualizate de la Tailwind default la culori semi-muted, tech:
```
Danger  500: rgb(212, 68, 88)   — red desaturat, prezent dar nu agresiv
Success 500: rgb(32, 168, 152)  — teal semi-muted, pozitiv dar calm
Warning 500: rgb(212, 148, 18)  — amber cald, atenție fără alarmă
```

Dark mode fix aplicat:
- status/*/subtle: light → /50, dark → /900 (nu mai e deschis pe dark)
- status/*/border: light → /500, dark → /400 (mai luminos pe dark bg)

---

## Componente rămase de testat & documentat

- [x] Standard Button ✓ (QA complet, overlay-only pressed, gata de producție — 31 Mar 2026)
- [x] Split Button ✓ (QA complet, text styles L/XL fixate, focus ring radius fixat, layer names curățate — 31 Mar 2026)
  - Pagina docs web: textele adaptate, instanțe swapped, Do/Don't cu context Split Button
  - **Pagina Figma overview completă (1 Apr 2026):**
    - Frame "Split Button" creat în Section 2 (3231:18800) cu hero, divider, secțiuni, warning cards
    - `.Split-Button-Option` component set aranjat pe grid (2 Types × 4 Sizes), aliniere centrală
    - `Split Button` wrapper aranjat orizontal (6 states)
    - Labels: S/M/L/XL columns top+bottom, Primary/Secondary row labels
    - Dark Mode setat pe frame, elipsă decorativă
    - **Audit zero hardcode**: bg/surface, text/primary, accent/hover, status/warning/subtle — toate pe variabile
    - **Property fixes**: `Fcused` → `Focused`, `icon instance` → `Dropdown icon`
- [x] Icon Only Button ✓ (QA parțial — naming fix + token test done, 1-2 Apr 2026)
  - **Naming fixes aplicate (7 probleme):**
    - Component set: `.Button-Icon-only proprieties` → `.Icon-Only-Options`
    - Variant property: `Variants` → `Variant` (singular)
    - Variant property: `size` → `Size` (Title Case)
    - Variant value: `Filled` → `Primary` (match Standard Button)
    - Tone value: `Succes` → `Success` (typo fix)
    - Layer name: `StateLayer` → `State Layer` (×48, match Standard Button)
    - Wrapper name: `Button-Icon-only` → `Icon Only Button`
  - **Token bindings verified**: zero hardcoded — padding, radius, minHeight, border weight, fills, strokes all bound
  - **Token propagation test PASSED**: Radius→full + PaddingX→24 propagat corect pe 53 instanțe
  - **Test instances**: 48 .Icon-Only-Options (3 Variant × 4 Tone × 4 Size) + 5 wrapper states în Section (3240:19027)
  - **Focused state**: tentativă de adăugare revert-ată (Figma propagă visibility pe shared instances). User va gestiona manual.
  - **Pagina docs web adaptată**: 55 instanțe Split→Icon Only swapped, 33 texte editoriale actualizate (Definition, Variants "Primary/Secondary/Ghost", 4 states, Usage Guidelines, Token Architecture, Exposed Properties, How to Modify)
  - **TODO**: User finalizează manual focused state pe wrapper + verificare vizuală finală pagină docs
- [x] Link Button ✓
- [x] FAB Button ✓
- [x] Pay Button ✓
- [x] Progress Bar ✓
- [x] Selection Controls (Checkbox, Radio, Switch) ✓
- [x] Segmented Control ✓
- [x] Knob ✓
- [x] ScrollBar ✓
- [x] Spinner ✓
- [x] Tooltip ✓
- [x] Divider ✓
- [x] Time Picker ✓
- [x] Badge ✓ (QA complet + showcase — 14 Apr 2026)
  - **Naming fix**: `s`→`S`, `md`→`M`, `lg`→`L` pe toate 36 variante
  - **Token audit**: 14 tokeni (2 Global + 4×3 per-size), 100% bound, zero hardcode, zero `---`
  - **Token propagation test PASSED**: Component level (Padding X/Y, Radius, Border Weight), Semantic cascade (sm→24px), Primitive cascade (spacing/scale/10→48px)
  - **Dark mode verified**: culori corect swapped pe toate 12 combinații
  - **Font verified**: Inter Light 12px, Caption/300 pe toate 36 variante
  - **Edge cases**: text lung, scurt, single char — toate OK
  - **Showcase page**: Section 2 pe pagina Badge, frame cu hero+info+labels, componenta mamă rearanjată pe grid (3 Variant groups × 4 Tones × 3 Sizes)
  - **Test section**: Section 1 pe pagina Badge, Test mode activ pe Primitives/Semantics/Components
- [x] Status Dot ✓ (QA complet + showcase — 14 Apr 2026)
  - **Naming fix**: `Type=offline` → `Type=Offline`
  - **Bug fix**: Default fill hardcoded `rgb(18,183,106)` → bound to `status/success/default`
  - **Bug fix**: DND rectangle fill hardcoded `rgb(217,217,217)` → bound to `bg/surface`
  - **Bug fix**: Height not bound on any variant → bound to `-- Atoms/Status Dot/Size`
  - **Bug fix**: Border Weight scope `ALL_SCOPES` → `STROKE_FLOAT`
  - **Token audit**: 2 tokeni (Size, Border Weight), 100% bound, zero hardcode
  - **Token propagation test PASSED**: Size 8→24, Border Weight thin→thick
  - **Showcase page**: Section 2 pe pagina Text Styles, component set orizontal + labels
- [x] Avatar ✓ (QA complet + showcase — 14 Apr 2026)
  - **Naming fix**: `Xs`→`XS`, `Md`→`M`, `Lg`→`L`, `Xl`→`XL` pe toate 10 variante
  - **5 old `---` tokens replaced**: `--- Atoms ---/--- Avatar/Size-s/lg/xl/Avatar size` → correct `-- Atoms/Avatar/Size-*/Size`
  - **10 layer names fixed**: `Rectangle 1` → `Avatar BG`
  - **Bug fix**: XL variants missing radius binding → bound to `Global/Radius`
  - **Bug fix**: Height unbound on all 10 variants → bound to Size token
  - **Bug fix**: 9 variants width unbound → bound to Size token
  - **Standardized**: Avatar BG sizing FILL/FILL + STRETCH on all 10 variants
  - **Token propagation test PASSED**: All 5 sizes bumped (XS→40, S→48, M→56, L→64, XL→80) + Border Weight thick
  - **Showcase page**: Section 2 pe pagina Text Styles, grid 5 Sizes × 2 Types + labels
- [x] Tag ✓ (QA complet + showcase — 14 Apr 2026)
  - **Naming fix wrapper**: `state`→`State`, `disabled`→`Disabled`, `hover`→`Hover`, `pressed`→`Pressed`, `focused`→`Focused`
  - **Naming fix options**: `s`→`S`, `md`→`M`, `Selected=on`→`Selected=On` (32 variante)
  - **Bug fix**: Focus ring bind-uit la `--- Radius ---/badge` (token vechi/orfan) → rebind la `-- Atoms/Tag/Global/Radius`
  - **Bug fix**: M variants minHeight bind-uit la S/Min Height (28px) → creat `-- Atoms/Tag/M/Min Height` (32px) și rebind
  - **Token audit**: 17 tokeni (3 Global + 7×S + 7×M), 100% bound, zero hardcode, zero `---`
  - **Token propagation test PASSED**: 11 tokeni forțați (Radius, Border Weight, Icon Size, Padding X/Y, Gap, Min Height per size)
  - **Showcase page**: Section 2 pe pagina Text Styles, wrapper orizontal + options pe grid, labels
  - **Test section**: Section 1 pe pagina Text Styles, Test mode activ
- [x] Thumbnail ✓ (QA complet + showcase — 14 Apr 2026)
  - **Naming fix**: `Xs`→`XS`, `Md`→`M`, `Lg`→`L`, `Xl`→`XL` pe toate 15 variante
  - **9 old `---` tokens replaced**: orfane `--- Atoms ---/--- Avatar/Size-*/Avatar size` → `-- Atoms/ThumbNail/Global/Size *`
  - **15 layer names fixed**: `Rectangle 1` → `Thumbnail BG`, standardized FILL/FILL + STRETCH
  - **Bug fix**: Height unbound pe toate 15 → bound to Size token
  - **Bug fix**: Width unbound pe 12 variante → bound to Size token
  - **Bug fix**: Radius unbound pe toate 15 → bound to correct Radius token per Type (Circle/Rounded/Square)
  - **Token audit**: 9 tokeni, 100% aliasează semantici, zero hardcode
  - **Token propagation test PASSED**: All sizes bumped + Radius Rounded xl + Border Weight thick
  - **Showcase**: Section 3636:17778, grid Sizes × Types + labels
- [x] List Item ✓ (QA complet + showcase — 14 Apr 2026)
  - **Naming fix**: `States`→`State`, `disabled`→`Disabled`, `Collapsed=off/on`→`Off/On` pe 10 variante
  - **16 old `---` tokens replaced**: `--- molecules ---/--- List item/Level 1/2` → `- Spacing -/12` și `- Spacing -/24`
  - **Bug fix**: Disabled fill hardcoded `rgb(255,255,255)` → bound to `bg/surface`
  - **Token audit**: 4 tokeni (Padding X/Y, Gap, Icon Size), toți alias la semantici
  - **Token propagation test PASSED**: Padding X→24, Padding Y→16, Gap→16, Icon Size→32
  - **Showcase**: Section 3692:18261, grid States × Collapsed + labels
- [ ] Input (Base ✓, Select, Multiselect, Stepper ✓, Textarea (in progress), BottomLine ✓)
  - **BottomLine ✓ (QA complet + showcase + test — 15 Apr 2026)**
    - **Cleanup pre-QA:** user a șters wrapper-ul ascuns vechi `Bottom-line-input` (119:14751) cu naming stricat (`state=state6`, lowercase). Rămas doar wrapper-ul curat `Bottom_line input` (2278:3919)
    - **Naming fixes:**
      - Options set: `.Text-input-bottomline-options` → `.Bottom-Line-Input-Options`
      - Wrapper: `Bottom_line input` → `Bottom Line Input` (Title Case + space)
      - 6 variants: `Size=MD/LG` → `Size=M/L`
      - 18 layer renames: `li:triangle` → `Left Icon`, `li:x` → `Right Icon`
    - **Token audit:** zero hardcode pe toate 9 options + 5 wrapper variants, zero `---` orfani, toți tokenii aliasează semantici
    - **Color audit:** Default (text/secondary label, text/muted placeholder/icon/helper, border/default stroke, overlay/default black state layer), Error (status/danger/* consistent), Success (status/success/* consistent)
    - **Focus ring fix:** rings inconsistente între variants (Default 249×89, Hover 469×89, Pressed/Active 389×29) → standardizate la (-4.5, 15.5) 249×53 pe toate 4 (Default/Hover/Pressed/Active), Disabled n-are ring. Bound la `Focused#2278:11` BOOLEAN
    - **Token propagation test COMPREHENSIVE PASSED** (Section 3800:19303, root 3847:2): toate 24 tokeni BottomLine forțați și verificați vizual:
      - Radius S/M/L (2xl/xl/2xl) ✓
      - Padding X/Y S/M/L (04/32/48 X, 24/32/04 Y) ✓
      - Icon Size S/M/L (32/40/48) ✓
      - Inner Gap S/M/L (toate → 24) ✓
      - Items Gap S/M/L (toate → 24) ✓
      - Stroke Weight S/M/L (toate → 6px raw, vizibil mult mai groase) ✓
      - Min Width S/M/L (toate → 320, Size S inputs widened) ✓
    - **Showcase** (Section 3800:19303, root 3848:2): template Entity Item — bg/surface, ellipse decorativ blur 999, hero (Title 60px Black, See documentation →, descriere, divider), info block, master wrapper + .Bottom-Line-Input-Options mutate înăuntru cu axis labels (state column stânga, Validation chips colorate semantic, S/M/L Bold above, separatori). Dark Mode activ.
  - **Base Input ✓ (QA complet + showcase + test — 15 Apr 2026)**
    - **Naming fixes:**
      - Options set: `.Text-input-base-option` → `.Base-Input-Options`
      - Wrapper: `Input/Base` → `Base Input`
      - 12 variants: `Size=MD/LG` → `Size=M/L` (match cu tokenii)
      - Wrapper variants: `Disabled=off/on` → `Disabled=Off/On` (Title Case)
      - 36 layer renames: `li:triangle` → `Left Icon`, `li:x` → `Right Icon`
    - **Bug fix:** variant duplicat `State=Active, Disabled=off` (id 2316:1383) — șters (era clonă identică, fără funcție). **Focused NU e State, e BOOLEAN property** (`Focused#2278:5`) deja definită pe wrapper — controlează visibility pe `.Focus-ring` instance prezentă în Default/Hover/Pressed/Active variants (Disabled nu are ring — corect, disabled nu poate fi focused). **Ring repoziționat să acopere doar Input frame** (4.5px outset: x:-4.5, y:15.5, w:249, h:49) — nu label/helper, conform WCAG. Wrapper final: 5 variants × 2 properties (State, Disabled) + 1 boolean (Focused).
    - **Token audit:** 24 tokeni (8 per size × 3 sizes) + 9 globali, 100% aliasează semantici, zero hardcode, zero `---` orfani
    - **Color audit:** 6 sample variants verificate
      - Default: text/secondary (label), bg/default (Primary fill), border/default, text/muted (placeholder/icon/helper)
      - Error: status/danger/* (default + subtle + border) consistent
      - Success: status/success/* consistent
      - State Layer: overlay/default black
      - **Notă:** label folosește `text/secondary` — defensibil (input value devine primary), de revizit pentru WCAG dacă apar issues
    - **Token propagation test COMPREHENSIVE PASSED** (Section 3800:671): toate 22 tokeni Base Input forțați și verificați vizual:
      - Per-size Radius (S/M/L → 2xl/3xl/xl) — toate sizes au rotunjire diferită ✓
      - Per-size Padding X (04/32/48) — text de la marginea inputului la mijloc ✓
      - Per-size Padding Y (24/32/04) — înălțimi diferite per size ✓
      - Per-size Stroke Weight (toate → thick) — borduri vizibil mai groase ✓
      - Per-size Icon Size (32/40/48) — icoane mai mari ✓
      - Per-size Inner Gap (toate → 24) — spațiu lat icon↔text ✓
      - Per-size Items Gap (toate → 24) — spațiu lat input↔helper ✓
      - Global Min Width (160 → 280) — Size S inputs widened ✓
      - **Color tokens:** Colors collection nu are Test mode → verificare statică completă (48 color bindings × 6 variants, toate aliasează corect)
      - **Focused boolean:** verificat că `.Focus-ring` instance există în Default/Hover/Pressed/Active variants, visibility bound la `Focused#2278:5` boolean. Disabled variant n-are ring (corect)
    - **Showcase** (Section 3800:672, root 3821:2): template Entity Item exact — `bg/surface` root cu layoutMode NONE + clip, ellipse decorativ rgb(67,56,202) cu blur 999 opacity 0.2, hero (Title 60px Inter Black text/primary, "See documentation →" 18px Light accent/default, descriere 18px Light text/muted, divider 1px text/primary @0.15), info block (titlu 24px Bold text/primary, body 16px Light text/secondary), apoi master wrapper Base Input + .Base-Input-Options MUTAȚI înăuntru. **Labels pro:** caption headers ("WRAPPER", "OPTIONS") + subtitle Light. Wrapper — coloană stânga cu state name (10px Bold caps) + "Disabled · Off/On" subtitle (10px Light text/muted). Options — chips colorate (DEFAULT in accent/Surface, ERROR in status/danger/subtle, SUCCESS in status/success/subtle), Primary/Secondary uppercase 9px tracked aliniate cu rândurile, S/M/L cu literă Bold + px value, separatori 1px border/muted @0.4 între validation groups, axis micro-labels SIZE→ / VALIDATION↓. Fără Atoms used (input nu are atoms identificabile). Dark Mode activ.
  - **Stepper ✓ (QA complet + showcase + test — 16 Apr 2026)**
    - **Naming fixes:**
      - Options set: `.Stepper-option` → `.Stepper-Options`
      - 3 variants: `Size=LG` → `Size=L`
      - 18 layer renames: `li:minus` → `Left Icon`, `li:plus` → `Right Icon`
      - Wrapper properties: `state` → `State`, `disabled` → `Disabled`
      - Wrapper values: `hover`→`Hover`, `pressed`→`Pressed`, `off`→`Off`, `on`→`On`
    - **Bug fix:** Size M Input paddingLeft/paddingRight bound la `Padding Y` în loc de `Padding X` → rebind corect
    - **Bug fix:** Success stroke pe toate 3 size-urile folosea `status/success/hover` → rebind la `status/success/border`
    - **Token audit:** 27 tokeni (9 per size × 3 sizes), 100% aliasează Input Global tokens → semantic, zero hardcode, zero `---` orfani
    - **Color audit:** Default (text/secondary label, bg/surface fill, border/default stroke, text/secondary icons, text/muted number/helper, overlay/default black state layer), Error (status/danger/* consistent), Success (status/success/* consistent — fixed border)
    - **Focus ring issue flagged:** `State=Focus` e variant value, nu BOOLEAN — TODO user: convertește la Focused BOOLEAN (ca la Base Input/BottomLine). Ring actual: x:-3 y:77 w:134 h:80 (sub input, nu în jurul lui)
    - **Token propagation test COMPREHENSIVE PASSED** (Section 3800:19303, root 3861:2): toți 27 tokeni forțați și verificați vizual:
      - Radius S/M/L (2xl/3xl/xl) — rotunjiri diferite per size ✓
      - Padding X S/M/L (32/48/48) ✓
      - Padding Y S/M/L (24/32/48) ✓
      - Inner Gap S/M/L (24/32/48) ✓
      - Items Gap S/M/L (24/32/48) ✓
      - Stroke Weight S/M/L (toate → 4px raw) ✓
      - Icon Size S/M/L (48/64/64) ✓
      - Number Min Width S/M/L (64/64/64) ✓
      - Hit Area Padding X S/M/L (24/32/48) ✓
    - **Showcase** (Section 3800:19304, root 3864:2): template Entity Item — bg/surface, ellipse decorativ, hero (Title 60px Black, See documentation →, descriere, divider), info block, master wrapper Stepper + .Stepper-Options mutate înăuntru cu axis labels (state column stânga cu Disabled sub-label, Validation chips colorate semantic, S/M/L Bold above, axis micro-labels SIZE→ / VALIDATION↓). Dark Mode activ.
  - **Textarea (QA in progress — 16 Apr 2026)**
    - **Naming fixes done:**
      - Options set: `.Text-area-options` → `.Textarea-Options`
      - 9 variants: `Size=s/md/lg` → `Size=S/M/L`
      - Wrapper: `Text-area` → `Textarea`
      - Wrapper props: `state`→`State`, `disabled`→`Disabled`, values Title Case
    - **Bugs fixed:**
      - Size M Input.minWidth was bound to Size S token → rebound to Size M ✓
      - State Layer missing entirely → added to all 9 options variants (ABSOLUTE, STRETCH, overlay/state layer, node opacity=0) ✓
      - bg/default → bg/surface on Default validation variants ✓
      - Focus ring: `State=Focused` variant deleted, Focused BOOLEAN (`Focused#3884:0`) created, `.Focus-ring` added to Default/Hover/Pressed with visibility bound to boolean ✓
    - **Token fixes:**
      - `Molecule/Input/Text area/Size S/ItemsGap` (no prefix, no space) → renamed `-- Molecule/Input/Text area/Size S/Items Gap` ✓
      - Same for Size M ✓
      - Both already aliased `-- Molecule/Input/Global/General/Items Gap` — correct
      - Inner Gap tokens for S/M confirmed orphaned (not bound to anything on textarea)
      - Created 3 new Min Height tokens per size: S=96, M=120, L=160 — bound to Input.minHeight on all 9 variants
      - Old `--- Atoms ---/--- Input/TextArea-min-height/Text-Area-min-Height` was bound → replaced by per-size tokens
    - **Global token fix (affects ALL inputs):**
      - `-- Molecule/Input/Global/Size M/Min Width` changed from alias→General/160 to raw 320px
      - `-- Molecule/Input/Global/Size L/Min Width` changed from alias→General/160 to raw 480px
      - Size S stays aliasing General (160px) — mobile-friendly
      - Textarea tokens alias these globals (layer 4 chain intact)
    - **State Layer note:** fill opacity override didn't propagate to wrapper instances. Fix: use node opacity=0 (not fill opacity=0) + set fill opacity 1 with bound color. This is the pattern for State Layers inside instances.
    - **TODO remaining:**
      - Token propagation test
      - Showcase (test section: 3800:19303, showcase section: use same page)
      - Color audit formal (preliminary OK: Default=text/secondary+bg/surface+border/default, Error=status/danger/*, Success=status/success/*)
      - Delete orphan Inner Gap tokens for S/M (not bound)
      - Update CLAUDE.md with final status
- [x] Search Bar ✓ (QA complet + showcase — 14 Apr 2026) **FIRST MOLECULE**
  - **Naming fix**: `Button=on` → `Button=On` pe 3 variante
  - **Token audit**: 10 tokeni proprii (3 Global + 7 per-size), 100% aliasează semantici, zero hardcode
  - **Zero ugly names, zero old `---` tokens, zero hardcoded fills**
  - **Bug found & fixed**: `- Radius -/sm` Semantics Test mode avea valoare reziduală (24px) de la Badge cascade test → resetat la `spacing/scale/04`
  - **Token propagation test PASSED**: Radius→sm, Border Weight→thick, Padding X/Y per size
  - **Internals**: Button=On conține Standard Button (Atom) — prima moleculă cu atom intern
  - **Showcase**: Section 3696:18343, cu Internals section documentând atomii interni
- [ ] Tabs
- [ ] Pagination
- [x] Entity Item ✓ (QA complet + showcase — 14 Apr 2026)
  - **Typo fix**: `Type=Wrokspace` → `Type=Workspace`
  - **Layer names fix**: `Frame 2` → `Labels` (x2)
  - **Token audit**: 4 tokeni proprii (Gap, Label Gap, Avatar Radius, Avatar Border), toți aliasează semantici
  - **Zero ugly names, zero old tokens, zero hardcoded fills**
  - **Token propagation test PASSED**: Gap→16, Label Gap→16, Avatar Radius→sm, Avatar Border→thick
  - **Internals**: Avatar (Atom) pe Type=User, Thumbnail (Atom) pe Type=Workspace, Status Dot (Atom) nested
  - **Showcase**: Section 3696:20702
- [ ] Entity Card
- [x] Item List ✓ (QA complet + showcase — 14 Apr 2026)
  - **Zero issues**: no ugly names, no old tokens, no hardcoded fills
  - **Token audit**: 8 tokeni proprii, toți alias la semantici, zero hardcode
  - **Token propagation test PASSED**: Container Padding Y→24, Radius→xl, Border Weight→thick, Min Width→180, Gap→16
  - **Boolean properties verified**: Show Search, Show Select All, Show Divider, Show ScrollBar
  - **Internals**: Search Bar (Molecule), List Item (Atom) ×n, Checkbox (Atom), Divider (Atom), ScrollBar (Atom)
  - **Showcase**: Section 3696:18400, cu "Atoms & Molecules used" section (5 cards cu instanțe live)
- [ ] Dropdown
- [x] Pin ✓ (QA complet + showcase — 14 Apr 2026)
  - **Naming fix**: `Apparence` → `Appearance` (typo), `Icon istance` → `Icon instance`
  - **Layer names fix**: `Frame 1` → `Pin Container`, `Vector 1` → `Pin Vector`/`Pin Tail`
  - **Component swap**: Avatar instance swapped from old Avatar (56:1068 — legacy with `---` tokens) to new Avatar (2169:5640, Size=M, Type=Image)
  - **Architecture simplification**: Eliminated `Appearance=Light/Dark` variants (4 → 2 variants). Dark mode handled automatically via color system
  - **Direct semantic colors**: Icon Container fill + Icon Vector stroke + Pin Tail stroke → `accent/default` direct (no Pin wrapper)
  - **New token `-- Molecule/Pin/Avatar Stroke Color`** → `accent/default` — specific pentru Avatar border când e folosit în Pin (override). Paralel cu `Avatar Stroke Weight`. Avatar border match tail color.
  - **Token audit**: 6 tokeni proprii (Size, Radius, Padding, Stroke Weight, Avatar Stroke Weight, Avatar Stroke Color), toți aliasează semantici
  - **Token propagation test PASSED**: Size, Padding, Stroke Weight, Radius
  - **Internals**: Avatar (Atom) pe Type=Avatar, Icon instance swap pe Type=Icon
  - **Showcase**: Section 3696:20547
  - **Major WCAG update**: Color system fixed globally — accent/default, border/default, border/hover, status/default aliases updated per mode for full WCAG 2.1 AA compliance. Palette unchanged.
- [x] Avatar Group ✓ (QA complet + showcase — 14 Apr 2026)
  - **Zero issues**: no ugly names, no old tokens, no hardcoded fills
  - **Fixed inconsistency**: "+4" counter avatar had Avatar atom tokens, rebind la Avatar Group tokens (radius + border weight)
  - **New token `border/surface`** in Colors collection (category border/) → aliases `bg/surface` on both modes. Creates classic "cut-out" effect on Avatar Group borders
  - **All 5 avatar borders** bound to `border/surface` for unified cut-out look
  - **Token audit**: 3 tokeni proprii (Gap -12, Border Weight 1, Avatars Radius full), toți aliasează semantici
  - **Token propagation test PASSED**: Gap, Border Weight, Radius
  - **Bug noted**: `Show Counter` boolean nu ascunde counter avatar — de fix user manual
  - **Internals**: Avatar (Atom) × 5 — 4 Image + 1 Text (for counter)
  - **Showcase**: Section 3696:20615
- [ ] Stacked List (toate variantele)
- [ ] Stats Card
- [ ] Top Bar
- [ ] Side Bar
- [ ] Bottom Navigation
- [ ] Data Table (Header, Cell, Row, Expandable, Builder)
- [ ] Card (Base)
- [ ] Media Card
- [ ] Bottom Sheet (Builder + Premade)
- [ ] Date Picker
- [ ] Toast / Snackbar
- [ ] Dialogs
- [ ] Form Group
- [ ] Content Blocks

## Audit pending (la testare per componentă)

- [ ] **Color audit per componentă** — verifică atribuirea corectă a culorilor:
  - Text pe accent/brand bg → trebuie să fie `text/on-accent` (alb, nu text/primary)
  - Text pe orice alt bg (default, surface, subtle, monochrome) → `text/primary`
  - Borders pe componente interactive → `border/Accent` sau `status/*/border` (nu hardcodat)
  - Fill-uri pe Primary buttons → `accent/default`, `/hover`, `/active` (nu hex)
  - Fill-uri pe Danger/Success/Warning → `status/*/default`, `/hover`, `/active`
  - Ghost variant → transparent fill, text/icon color din `accent/default` sau `status/*`
  - Disabled state → verifică opacity layer, nu culori separate
- [ ] Select Input: refactor State Layer overlay (`Default-Black` + opacity) → hover/pressed direct din bg
- [ ] Focus states pe toate componentele interactive
- [ ] Chevron vs Icon Button pe toate componentele interactive
- [ ] Font audit: verifică Inter pe toate componentele
- [ ] Dark mode visual verification — testează fiecare componentă pe ambele moduri
- [ ] Accessibility contrast checks
- [ ] "Used in" pe token descriptions: actualizează cu naming-uri finale componente

---

**Stacked List** — QA completat 29 Apr - 3 May 2026
Component Set ID: `2080:23144` (9 Type variants: Default, Social, Ride row, Delivery row, Media row, Product, Booking, Items grid, Transport). Internals section: `2080:11637` (14 internals). Test section: `4496:289`. Showcase: `4520:176` (in Section `4496:290`).

**Naming fixes (massive — 40+ renames):**
- Set typos fixed (Tone=Succes → Success, Type=Succes → Success on Share Item)
- Standalone `Media row` orphan set deleted (was duplicate of `Type=Media row` variant)
- 8 internals renamed: `Icon istance` → `_Icon Instance`, `Social avatar grup` → `_Social Avatar Group`, `_Placeholder / Icon Square` (slash) → `_Placeholder Icon Square`, `Image placeholder` → `_Image Placeholder`, `Ride avatar` → `_Ride Avatar`, `Share item` → `_Share Item`, `Transport image` → `_Transport Image`, `Icon istance/_Media Action/Meta` (slashes!) → `_Track Duration` (was misnamed Meta Logo, actually contained "3:45" track duration text)
- Payment logos kept WITHOUT `_` prefix (reusable globally): `Master card` → `Mastercard`, `Paypall` → `PayPal`, `G_Pay_Lockup_1_` → `Google Pay`, `Pay` → `Apple Pay`. `Meta Logo` was misnamed (was actually `_Track Duration`).
- 23 Frame N → semantic (Title, Title Row, Trailing, Driver Info/Meta, Rating, Steps, Step 1-3, Step Header, Steps Row, Courier Info/Meta, Content, Meta Row)
- 5 Items grid items + Share Item references fixed (`item 01` → `Item 1`, `Share-grid/Share-item` slash → `Container`)

**Token cleanup (with proper alias chain check after first attempt broke 80 aliases):**
- 3 true orphans deleted (Ride Row/Item Size, Ride Row/Border Weight, Delivery Row/Border Weight)
- 7 binds added on previous orphans: Default/Item Size + Icon Size, Social/Item Size, Ride Icon Size, Item Grid/Inner Gap, Product/Booking Item Radius
- Item Grid/Item Size token: 56 → alias `- Size -/48`, bound on `Container` frame inside 4 Share Item variants
- Item Grid/Icon Size token: 24 → alias `- Size -/28`, bound on `li:facebook` icon in Share Item variants
- `Item Grid/` namespace renamed to `Items Grid/` (5 active tokens) to match `Type=Items grid` variant naming
- Product + Booking Item Radius bound on `_Placeholder` master inner rectangle (AR=Square + AR=Landscape variants — radius stays at 4 default in Max core mode, propagates correctly)

**Showcase structure:** Root 2200×3200 in Section 4496:290. Hero stanga-sus (60px Black title + see docs link + description). Preview Type=Ride row scaled 1.4x sus-dreapta. Info block + main master mutat la (80, 800). 9 use case labels per Type variant la dreapta master (Default → Social → Ride row → Delivery row → Media row → Product → Booking → Items grid → Transport, fiecare cu use cases concrete). Internals section sub master cu warning rosu + 14 cards (cards conțin **MASTER COMPONENTS mutați direct**, nu instances) — Card descriptions per internal explică ce face fiecare. Dark Mode forced.

---

**Top Bar Desktop** — QA completat 3-4 May 2026
Component Set ID: `2015:1175` "Top Bar Desktop" (renamed from `Top bar/Destkop`). Test/Showcase section: `4498:19163`.

**2 variants:** Elevated=off, Elevated=on (88px height). Auto-layout HORIZONTAL with primaryAxisAlignItems=SPACE_BETWEEN.

**Naming fixes (11 renames):**
- Component set: `Top bar/Destkop` (typo + slash) → `Top Bar Desktop`
- Inside variants: `Frame 6` → `Logo`, `Group 1` → `Logo Mark`, `Rectangle 1` → `Logo Shape`, `Frame 2` (5px tall spacer) → `Spacer`, `icon buttons` (lowercase) → `Icon Buttons`

**Slot architecture (3 slots + 2 spacers):**
- Slot Leading (default Logo) + Spacer FILL + Slot Center (default empty Spacer) + Spacer FILL + Slot Trailing (default Icon Buttons + Entity Card)
- 2 FILL spacers between slots ensure CENTER stays visually centered regardless of Leading/Trailing widths
- Created MANUALLY in Figma UI by user (Plugin API does NOT expose SLOT creation — verified)
- preferredValues per slot configured with curated DS components (Entity Card, Search Bar, Link Button, Split Button, Icon Only Button, Standard Button, Tabs, Switcher, etc.)
- Slot descriptions added (rich HTML "Use for brand identity / nav context / actions" with use cases per slot)

**Token audit (18 tokens):**
- Global: Padding X (24), Padding Y (12), Item Gap (24), Border Weight (1), Radius (16), Background opacity (20)
- Desktop: Padding X (24), Padding Y (12), Item Gap (24), Border Weight (1), ~~Height~~ (deleted as orphan — variant heights are hardcoded 88px)
- Mobile (shared with Top Bar Mobile): Padding X, Padding Y, Item Gap, Border Weight, Icon Button, Icon Size, Radius
- itemSpacing=10 hardcoded on variants is FALSE POSITIVE (SPACE_BETWEEN ignores it visually)
- Background color rectangle: BG blur problem solved by user via wrapper-with-shadow pattern (wrapper opaque 100% gets shadow, inner Background color stays opacity 20% as tint)

**Token propagation test:** 11 tokens forced with nice differentiated values (Padding X 24→32, Padding Y 12→20, Gap 24→32, Border Weight 1→2, Radius 16→24, Background opacity 20→40, Desktop Height 80→96). Reverted after verification.

**Showcase structure:** Root 2400×1800 in Section 4498:19163. Hero (60px title + description + see docs). Preview Elevated=off scaled 0.55x sus-dreapta. Info block + master mutat la (80, 480). Slot Architecture block dreapta (3 slots × ~6 use cases each, descrieri "How to use this slot"). Dark Mode forced.

---

**Top Bar Mobile** — QA completat 4 May 2026
Component Set ID: `2106:4460` "Top Bar Mobile" (renamed from `Top bar/mobile`). Test/Showcase section: `4498:19163` (shared with Desktop).

**4 variants:** Type=Mobile/Standard × Elevated=off/on. Mobile variants are 393×118 (taller — menu+search+title row layout); Standard variants are 393×72 (compact — leading icon + center title + trailing icon).

**Naming fixes (13 renames):**
- Component set: `Top bar/mobile` (typo + slash) → `Top Bar Mobile`
- 4× `Top Bar/Mobile` (slash) FRAME wrapper → `Content`
- 4× `Frame 4` → `Menu Button` (in all 4 variants)
- 2× `Frame 7` (Type=Mobile) + 2× `Frame 5` (Type=Standard) → `Search Button`

**BG blur architecture:**
- Type=Standard variants: BG blur applied on **variant frame itself** (NOT on Background color rectangle — same pattern Desktop uses). Background color rectangle stays node opacity 20%, fill 100%, color bound to `bg/brand`. INNER_SHADOW effects (misplaced) removed.
- Type=Mobile variants: BG blur (radius 24) applied on **button frames** (Menu Button + Search Button frames) — each button gets individual frosted glass effect (iOS-style)
- Misplaced BG blur effects on inner Background color rectangles (radius 100, 40) cleaned up
- Color binding `bg/brand` restored on Mobile Background colors (had been lost during user testing)

**Icon Only Button refactor (Type=Mobile only):**
- Old direct `li:menu` and `li:search` icons replaced with **Icon Only Button** instances
- Set Variant=Ghost, Size=L, Tone=Default, Icon=appropriate (li:menu key + li:search key)
- Corner radius override 9999 → perfect circle 48×48 buttons
- Icon vector fill rebound from `accent/default` (indigo) → **`text/primary`** (mode-aware)
  - Light mode: dark icon (slate-900) on light/blurred bg → AAA contrast
  - Dark mode: light icon (slate-50) on dark/blurred bg → AAA contrast
  - Adaptive — automatically switches per theme
- Type=Standard variants kept direct icons (Mobile/Icon Size token still active for those)

**Token cleanup:**
- User deleted `Mobile/Icon Button` (was for outer wrapper width — no longer needed since Icon Only Button has its own size from `-- Atoms/Buttons/Icon Only/L/...`)
- `Mobile/Radius` set to 9999 (perfect circle for icon buttons)
- 6 Mobile tokens active: Padding X (24), Padding Y (12), Item Gap (24), Border Weight (1), Icon Size (24), Radius (9999)

**Token propagation test:** 12 tokens forced (Mobile + Global combined) with nice values. Reverted.

**Showcase structure:** Root 2200×1800 in Section 4498:19163. Hero (60px title + description + see docs). Preview Type=Mobile, Elevated=on scaled 1.4x sus-dreapta. Info block + master mutat la (80, 480) — 4 variants stacked. Variant Guide block dreapta (4 variants cu descrieri detaliate per variantă). Use Cases section cu 6 mobile scenarios (📱 Native apps, 🌐 PWAs, 💼 Admin dashboards, 🛒 E-commerce, 📰 Content apps, 💬 Chat). Dark Mode forced.

---

**Bonus tokens & effect styles created during Top Bar work:**
- 15 primitive opacity tokens (`opacity/00` → `opacity/100` step 5/10) in Primitives collection, scope OPACITY
- 6 semantic opacity tokens rebound to alias new primitives (`- opacity -/none/hover/pressed/disabled/dim/overlay` → `opacity/00/20/35/40/60/70`)
- 3 BG blur effect styles added: `effect/blur/lg` (40), `effect/blur/xl` (60), `effect/blur/2xl` (100)

**Key learnings (saved to memory):**
- BG blur: NODE OPACITY must be 100% + FILL OPACITY semi-transparent. Inverse breaks blur (multiplies effect by node opacity).
- Wrapper-with-shadow pattern: outer opaque wrapper gets shadow + blur; inner semi-transparent rectangle is color tint.
- Plugin API does NOT expose SLOT creation. Slots = manual Figma UI work.
- `text/primary` is mode-aware — perfect for adaptive icon contrast on translucent surfaces.
- Icon Only Button props (Variant/Tone/Size/Icon) are NOT exposed on wrapper — set them on inner `.Icon-Only-Options` instance.
- Token "orphan" check requires BOTH node bindings AND alias-from-other-tokens scan (deleting Globals that are alias sources breaks all dependent tokens).

---

## Reguli atribuire culori pe componente — CRITIC

```
Text pe accent/brand bg    → text/on-accent (alb pe ambele moduri)
Text pe orice alt bg       → text/primary (se adaptează light/dark automat)
Text secundar              → text/secondary
Text terțiar/hint          → text/muted

Background card/modal      → bg/surface
Background pagină          → bg/default
Background subtil          → bg/subtle
Background branded         → bg/brand (primary/500 light, primary/800 dark)
Background alb/negru pur   → bg/monochrome (white light, black dark)
```

Palette noi adăugate (31 Mar 2026):
```
Palette/primary/950        → rgb(15, 13, 46) — near-black cu indigo tint
Palette/neutral/950        → rgb(5, 8, 22) — near-black neutru
```

---

## Note importante pentru agent

1. **Nu hardcoda niciodată** valori de culoare, spacing sau radius — folosește întotdeauna tokenii semantici
2. **Verifică întotdeauna** cu `get_variable_defs` înainte și după orice modificare
3. **Tokenii cu prefix `---` (3 dash-uri) sunt GREȘIȚI** — înlocuiește-i automat
4. **Fontul corect este Inter** — Light (300) pt body, Bold (700) pt emphasis, Black pt H1-H2
5. **Global tokens** se justifică doar dacă sunt folosiți în 2+ sub-componente
6. **YAGNI** — nu construi variante pentru use case-uri ipotetice
7. **Naming tokeni** — spații între cuvinte (Padding X, Icon Size), Title Case pe paths, lowercase pe color semantics
8. **Verifică după fiecare modificare** — screenshot + măsurători reale, nu presupune
9. **Documentație per componentă** — Definition, How to use it, How is created, Tokens
10. **Showcase** — rearanjează variantele din componenta mamă pe grid, nu crea instanțe separate
11. **Referință documentație** — vezi MAX-CORE-SUMMARY.md pentru detalii complete
