# Max Core Design System — Reguli pentru Claude Code

@docs/MAX-CORE-SUMMARY.md

<!-- docs/CLAUDE-ARCHIVE.md holds completed per-component QA logs. Not auto-imported (too large) — read it on demand when a task touches past component work. -->
<!-- React library work: PROGRESS.md tracks live component + Figma cross-check status; prompts/ holds copy-paste guides (figma-cross-check.md, implement-component.md) for continuing that work in a fresh conversation. -->
<!-- Two Figma files (see Context general): sX5tikviuBEhNbu2iPVya5 (pt-razvan-max-core) is the current working/cross-check file; ouyi08XxN4l4VCsao1nNQu is the production/original. -->



## Context general

Max Core este un design system B2B end-to-end cu 3 layere:
1. **Layer 1 — Figma DS** — tokeni pe 4 niveluri, componente modulare, light/dark mode
2. **Layer 2 — Plugin export JSON + audit WCAG** (in dezvoltare)
3. **Layer 3 — React + Tailwind codegen** (in dezvoltare)

**Fisier Figma (curent — working, cross-check + tree export):** `sX5tikviuBEhNbu2iPVya5` (`pt-razvan-max-core`)
**Fisier Figma (productie / original):** `ouyi08XxN4l4VCsao1nNQu`

**Faza curenta:** QA + Showcase + Token test per componenta (Faza 2+3). Detalii componente deja completate → `docs/CLAUDE-ARCHIVE.md`.

---

## Arhitectura tokenilor — 4 niveluri

```
Nivel 1 — Primitive:   #6366F1, 16px, 8px
Nivel 2 — Semantic:    accent/primary, neutral/surface, status/error
Nivel 3 — Component:   -- Molecule/Button/Global/PaddingX → aliaseaza - Spacing -/16
Nivel 4 — Variant:     -- Atoms/Buttons/Standard-Button/Size-M/Height
```

**Regula de aur:** Fiecare nivel aliaseaza nivelul de deasupra. Zero valori hardcodate in componente.

---

## Conventii de naming tokeni — CRITIC

### Prefixuri
- `--` prefix (2 dash-uri) = token de componenta (Molecule sau Atom sau Organism)
- `-` prefix (1 dash) = token global/semantic/primitiv
- `---` prefix (3 dash-uri) = **TOKEN VECHI / GRESIT** — trebuie inlocuit

### Structura numelui
```
-- Molecule/[NumeComponenta]/[SubComponenta]/[Proprietate]
-- Atoms/[NumeComponenta]/[Size]/[Proprietate]
--Organism/[NumeOrganisms]/[SubComponenta]/[Proprietate]
```

### Tokeni globali semantici (alias la primitive)
```
- Spacing -/04→4  /08→8  /12→12  /16→16  /20→20  /24→24  /32→32  /48→48  /64→64
- Size -/16→16  /20→20  /24→24  /32→32  /40→40  /48→48  /56→56  /64→64
- Radius -/none→0  /xs→2  /sm→4  /md→8  /L→12  /xl→16  /2xl→24  /3xl→32  /full→9999
- Border Weight -/none→0  /thin→1  /thick→2
```

### Naming patterns (fixuri standard la fiecare componenta)
```
Size=MD/LG              → Size=M/L
Disabled=off/on         → Disabled=Off/On
state=hover             → State=Hover (Title Case property + value)
li:triangle, li:x       → Left Icon, Right Icon
Frame 1, Rectangle 1    → Semantic name (Avatar BG, Pin Container etc.)
Variant=Filled          → Variant=Primary
Succes → Success, Apparence → Appearance, Wrokspace → Workspace
```

---

## Colectii de tokeni in Figma

```
Max Core - Primitives   → valori raw (numere, culori hex)
Max Core - Semantics    → alias-uri la Primitives
Max Core - Components   → alias-uri la Semantics (-- Molecule/..., -- Atoms/..., --Organism/...)
Max Core - Colors       → culori cu light/dark mode (bg/surface, text/primary, accent/default etc.)
```

Primitives, Semantics si Components au 2 moduri: **Max core** (productie) si **Test**.
Colors are **Light Mode** si **Dark Mode** (fara mod Test).

---

## Tokeni de culoare comuni

```
bg/surface, bg/default, bg/subtle, bg/brand, bg/monochrome
text/primary, text/secondary, text/muted, text/on-accent
accent/default, accent/hover, accent/active, accent/Surface
border/default, border/muted, border/Accent, border/Focus, border/surface
status/danger/default, /hover, /active, /subtle, /border
status/success/default, /hover, /active, /subtle, /border
status/warning/default, /hover, /active, /subtle, /border
status/info/default, /subtle
shadow/color/1-4 (variabile cu light/dark mode)
overlay/default (black, pentru State Layers)
```

### Reguli atribuire culori — CRITIC
```
Text pe accent/brand bg    → text/on-accent (alb pe ambele moduri)
Text pe alt bg             → text/primary
Text secundar              → text/secondary
Text tertiar/hint          → text/muted
Background card/modal      → bg/surface
Background pagina          → bg/default
Input fill                 → bg/default sau bg/surface
Input stroke               → border/default
Error states               → status/danger/* consistent (default + subtle + border)
Success states             → status/success/* consistent
State Layer                → overlay/default black
Disabled                   → opacity layer pe varianta, NU culori separate
```

---

## Effect Styles (umbre)

```
effect/shadow/sm/down  → y2, blur6, shadow/color/4
effect/shadow/md/down  → y6+y2, blur16+6, shadow/color/3+4
effect/shadow/lg/down  → y16+y6+y2, blur32+16+6, shadow/color/2+3+4
effect/shadow/xl/down  → y82+y46+y20+y5, blur33+28+20+11, shadow/color/1+2+3+4
(variantele /up = identice dar Y negativ)
```

---

## QA Playbook — procesul per componenta

**Respecta ordinea.**

### Pas 1 — Inspect + Cleanup
- 3 tool-uri in paralel: `get_metadata` + `get_screenshot` + `get_variable_defs`
- `use_figma` pt `componentPropertyDefinitions`, variante, structura children
- Verifica sanatatea: duplicate ascunse, visible:false, naming stricat. **Intreaba userul** inainte sa stergi.

### Pas 2 — Naming
Layers + proprietati + variant values — totul Title Case, semantic, fara typo-uri. Aplica pattern-urile standard (vezi sectiunea de naming). **Focused = BOOLEAN property, niciodata State variant value.**

### Pas 3 — Token test
- Daca are tokeni **globali** → testeaza globalii (cascada: global → specific). Daca modifici globalul si specificu se schimba = tot lantul merge.
- **DOAR in modul Test**, niciodata in Max core.
- Forteaza cu valori exagerate (Radius 2xl, Padding 48, Stroke 6px). Verifica pe **instances** in Test section, nu pe master. Screenshot + verificare vizuala.
- Helper: `num(x) = typeof x === "number" ? x : 0` (pt figma.mixed Symbol).
- Flag: hardcoded values, orphan `---` tokens, broken alias chains.

### Pas 4 — Industry standard check
Componenta atinge minimul din industrie?
- Are state-urile necesare? (Default, Hover, Pressed, Disabled — minim)
- Are size-urile care trebuie?
- Lipseste ceva ce orice DS serios are?
- Color audit: sample variante, verifica fills/strokes pe tokeni corecti (nu hardcoded).

### Pas 5 — Focus (model hibrid, decis 24 Oct 2026)
Componenta interactiva? Trebuie sa aiba focus vizibil:
- **Field cu border** (Input, Select, Textarea, Stepper, Search Bar, trigger picker): focus = border-ul propriu devine `border/focus` @ `- Border Weight -/thick` (2px). **Fara ring separat.** React: `focusBorder`.
- **Pressable** (Button, Icon Only, FAB, Link, Checkbox/Radio/Switch, Tabs, Pagination, Knob, List Item, Card etc.): ring outset cu gap = instanta **`.Focus-ring`** (`24:797`, 2px, OUTSIDE, -3px STRETCH). Nu dreptunghiuri ad-hoc. React: `focusRing`.
- Focused = BOOLEAN (nu State variant value). Acopera DOAR zona focusabila (nu label/helper).
- Disabled nu are focus.

### Pas 6 — Slots
Componenta de tip container (Item List, Card, Bottom Sheet etc.) si nu are slots pt continut dinamic → trebuie adaugate.

### Pas 7 — Showcase
Componenta mama (MASTER-ul) mutata in pagina showcase. Vezi sectiunea dedicata mai jos.

### Pas 8 — Update docs/CLAUDE-ARCHIVE.md
Per componenta completata, adauga block cu naming fixes, token audit, industry check, focus ring, propagation test results, showcase IDs.

---

## Showcase — cum se construieste

**Reference template:** Base Input showcase (node 3821:2).

### Structura root
```
ROOT FRAME (~2100-2228px wide, layoutMode NONE, clipsContent: true, bg/surface, Dark Mode)
├── ELLIPSE decorativ top-right (~1800px, fill rgb(67,56,202), opacity 0.2, LAYER_BLUR 999)
├── ELLIPSE decorativ bottom-left (~1100px, fill rgb(67,56,202), opacity 0.2, LAYER_BLUR 999)
├── HERO frame at (80, 64, ~1040 wide, VERTICAL, itemSpacing 16)
│   ├── Title: 60px Inter Black, text/primary — numele componentei
│   ├── "See documentation →": 18px Inter Light, accent/default
│   ├── Description: 18px Inter Light, text/muted
│   └── Divider: full-width × 1px, text/primary @ opacity 0.15
├── PREVIEW INSTANCE top-right (~x:1250, y:260) — instanta mare pentru referinta vizuala
├── INFO BLOCK WRAPPER (above wrapper, ~x:170, y:710)
│   ├── Title: "[Component] Component" 24px Inter Bold, text/primary
│   ├── Subtitle: "N variants · breakdown" 12px Inter Light, text/secondary
│   └── "Use this component in your design!" — status/success/default color
├── INFO BLOCK OPTIONS (above options, ~x:650, y:710)
│   ├── Title: "[Options] Component" 24px Inter Bold, text/primary
│   ├── Subtitle: "N variants · breakdown" 12px Inter Light, text/secondary
│   └── "Don't use this component in your design!" — status/danger/default color
├── MASTER WRAPPER — mutat inside root la ~x:170, y:850 (200px left pt labels)
├── MASTER OPTIONS — mutat inside root la ~x:650+, y:850+ (side-by-side, NU vertical!)
└── AXIS LABELS (positioned absolutely):
    ├── State labels (col stanga wrapper): 10px Bold caps + "Disabled · Off" sub-label
    ├── Validation chips (stanga options): pill-shaped, accent/Surface sau status/*/subtle bg
    ├── Variant row labels: 9px caps tracked, text/muted
    ├── Size column labels: 14px Bold + "240px" Light below
    ├── Axis micro-labels: "SIZE →", "VALIDATION ↓" (9px caps tracked, text/muted)
    └── Group separators: 1px line, border/muted @ 0.4 opacity
```

### Reguli cheie showcase
1. **~2100-2228px wide** — spatiu generos, nu 1336
2. **Side-by-side layout**: Wrapper LEFT, Options RIGHT — niciodata stacked vertical
3. **Preview instance** top-right — instanta mare scalata
4. **Use / Don't use** labels deasupra wrapper/options (success/danger colors)
5. **Size labels** includ px widths (ex: "S 128px", "M 320px")
6. **Doua ellipse decorative**: top-right (mare) + bottom-left
7. **Muta MASTER-ul** in showcase (nu instances) — asta arata varianta autoritativa
8. **Dark Mode** activ pe root frame
9. Daca componenta foloseste atoms identificabile → adauga "Atoms & Molecules used" section cu cards

### Gotchas showcase
- Root fill = **bg/monochrome** (nu bg/surface!) — bg/monochrome = white light / black dark
- Root cu layoutMode NONE (nu seta layoutPositioning pe children — NONE = totul absolut by default)
- Daca root.clipsContent=true si labels la x:negativ → taiate. Muta masters cu 200px right
- Daca stergi root showcase care contine masters → masters stersi cu el. Muta-i inapoi mai intai!
- Dupa `resize(w, h)` pe auto-layout, re-aplica `primaryAxisSizingMode = "AUTO"`

---

## Lectii importante (greseli de evitat)

1. **NU adauga State=Focused variant.** Focused e BOOLEAN.
2. **NU duplica functionality.** Intreaba userul daca vezi duplicate.
3. **NU folosi instances in showcase.** Muta MASTER-ul propriu-zis.
4. **NU sample-test tokeni.** Forteaza FIECARE token.
5. **NU testa pe master.** Section modes afecteaza doar copiii. Foloseste instances inside section.
6. **NU pune Focus ring peste tot variantul.** Doar peste zona focusabila.
7. **NU ignora figma.mixed.** Crash pe `>` cu Symbol. Foloseste `num(x)`.
8. **NU presupune sizing mode ramane AUTO.** Re-aplica dupa resize.
9. **State Layer pattern:** node opacity=0, fill opacity 1 cu bound color. Fill opacity override nu propaga la instances.
10. **NU rebuild showcase fara sa muti masters inapoi.**
11. **Field-urile NU au focus ring — focusul e border-ul propriu.** (Inlocuieste vechea regula "ring in Input frame -3px".) Focused = BOOLEAN pe options component set si schimba stroke-ul Input frame-ului la `border/focus` 2px. Ringurile `.Focus-ring` existente din inputuri se scot in faza de audit per componenta.
12. **Base Input cross-refs.** Select Input si Multiselect aveau tokeni bound la Base Input in loc de proprii. Verifica mereu ca o componenta nu refera tokenii altei componente.

---

## Componente ramase de testat & documentat

### Completate recent (16 Apr 2026)

**Input QA — 3 componente:**
- [x] Input/Textarea ✓ — propagation test 13 tokeni, showcase, orphan Inner Gap S/M stersi
- [x] Input/Select ✓ — 179 bindings rebind Base Input → Select Input, 18 variante renamed, showcase
- [x] Input/Multiselect ✓ — 114 bindings rebind Base Input → Multiselect, 8 tokeni Size LG→L, showcase

**Token naming cleanup global (982 tokeni auditati):**
- [x] 334 tokeni redenumiti across Components + Primitives
  - Hyphens → spaces: Standard-Button, Pay-Button, Link-Button, Item-List, Date-Picker, Toast-Snackbar, Size-S/M/L/XL/Xs
  - CamelCase → proper: BottomLine, IconOnly, ThumbNail, RadioButton, ScrollBar, RideRow, DropDown
  - Lowercase → Title Case: Select input, Search bar, Text area, Stats Card big, Delivery row, Media row, Item grid, main, size S/L, radial
  - Typo: Extendend → Extended
  - Primitives: Text-size → text-size (consistent lowercase)
  - Semantics: Radius/L → l, opacity/Dim → dim
- [x] 8 effect styles redenumite: Shadow down/up → down/up, XL → xl (consistent lowercase)

**Focus ring arhitectura refacuta pe TOATE 6 inputurile (81 variante):**
- [x] Ring mutat din WRAPPER → in INPUT frame din OPTIONS (absolut, STRETCH, -3px pe toate laturile)
- [x] Focused BOOLEAN mutat de pe wrapper pe options component set
- [x] 81 ring-uri noi create in Input frames, 28 ring-uri vechi sterse din wrappere
- [x] Componente afectate: Base Input, Bottom Line, Textarea, Stepper, Select Input, Multiselect
- [x] Fix rezolva: ring se deformeaza cand Show Title/Helper sunt dezactivate

**Property standardizare pe inputuri:**
- [x] Show Title adaugat pe Bottom Line si Textarea (lipsea complet)
- [x] Stepper: Show label → Show Title
- [x] Textarea: Text Field Title → Title, Placeholder text → Placeholder, Helper text → Helper Text
- [x] Stepper: Left icon → Left Icon, Helper text → Helper Text
- [x] Multiselect: Title default "Select Input" → "Multiselect"
- [ ] TODO manual: reordoneaza Size variant options (S,M,L) pe Textarea, Select, Multiselect din Figma UI

### De facut
- [x] Switcher ✓ — .Switcher Item (4 states) + Navigation/Switcher, 5 tokens, zero orphans, showcase cu Internals + Main
- [x] Tabs ✓ — _Internals/Tab Item (30 variants: State×Fill×Disabled×Start×End) + Navigation/Tabs Group (slot-based), 4 tokens clean, showcase
- [x] Pagination ✓ — Paggination→Pagination, Pagination button→.Pagination Button, .Pagination button→.Pagination Content (Icon=off/on → Type=Number/Icon), off/on→Off/On, Page #→Page, Instance→Icon, 5 tokens tested, showcase cu Internals section
- [x] Entity Card ✓ — property States→State, 4 states Title Case, Focused ca BOOLEAN (ring -3 STRETCH pe wrapper), Right Icon renamed, showcase cu master + Focused demo side-by-side
- [x] Dropdown ✓ — Trigger INSTANCE_SWAP + Active boolean, Item List slot, minimal token footprint, showcase
- [x] Stacked List ✓ — main set 9 Type variants + 14 internals, naming cleanup massive (40 renames + 8 internal renames + standalone Media row orphan deleted), token audit cu alias chain check (67 tokens, 7 binds noi pe orphans, Item Grid → Items Grid rename, Type=Succes → Success), Item Grid Item Size 56→48 + Icon Size 24→28 bound on Share Item master, propagation test cu valori frumoase, showcase cu hero + use cases per Type + Internals section cu 14 cards (master moved nu instances)
- [ ] Stats Card (Small partially — Footer cu Action Bar swap done, plus 280/400 sizes; Big paused pentru refactor research)
- [x] Top Bar Desktop ✓ — naming (Destkop→Desktop, slash removed, Frame N→Logo/Spacer/Icon Buttons), 3 SLOTs (Leading + Center + Trailing) + 2 FILL spacers (manual user UI), preferredValues per slot configured, slot descriptions, BG blur fix (wrapper-with-shadow pattern), 18 tokens audit + Desktop/Height orphan deleted, propagation test, showcase cu slot architecture + use cases
- [x] Top Bar Mobile ✓ — naming (mobile→Mobile, slash removed, Frame 4/5/7→Menu Button/Search Button), Type=Mobile/Standard × Elevated=off/on, BG blur on button frames + wrapper Background colors, **Icon Only Button swap on Mobile variants** (Variant=Ghost, Size=L, perfect circle radius 9999, icon vector → text/primary mode-aware), token cleanup (deleted Mobile/Icon Button after Icon Only Button swap), propagation test, showcase cu variant guide + use cases
- [ ] Side Bar
- [ ] Bottom Navigation
- [ ] Data Table (Header, Cell, Row, Expandable, Builder)
- [ ] Card (Base)
- [ ] Media Card
- [ ] Bottom Sheet (Builder + Premade)
- [x] Date Picker ✓ — 3 main components (Date/Dual/Input) + 4 internals, showcase cu sectiune dedicata Internals
- [x] Toast ✓ — 5 tones Title Case (Succes→Success, Tone5→Loading), `show body/title` → Title Case, Frame 2/6 → Content/Wrapper, Button Link Tone matches Toast tone, 5 tokeni propagation tested, master in showcase
- [x] Dialogs ✓ — succes→Success, Show icon→Show Icon, Icon2/Icon warning → Icon Success/Warning, Frame 1/2 → Content/Actions, 3 tokeni propagation tested, master in showcase
- [x] Form Group ✓ — Option A transparent, Headline/Items/Action slots, Size S/M/L, booleans + instance swap, showcase
- [ ] Content Blocks
- [x] Range ✓ — fix responsive (Knob constraint CENTER→SCALE + Knob frame HUG width, tooltip nu se mai stricã la resize), single component cu 1 boolean Show Tooltip, showcase demonstrand 4 widths (150/300/500/800)

### Audit global pending
- [x] Focus ring arhitectura — ring in Input frame cu STRETCH -3px (facut pe toate inputurile)
- [ ] Focus ring pe alte componente interactive (buttons, tags etc — daca aplica)
- [ ] Font audit: verifica Inter pe toate componentele
- [ ] Dark mode visual verification
- [ ] Accessibility contrast checks (partial) — guardrail cod livrat: `pnpm -F @max-core/tokens contrast` verifica fiecare pereche text/bg pe tokeni rezolvati in hex, light + dark, prag WCAG AA (4.5 normal / 3 large). Ruleaza pe sursa (nu modifica tokens.json), turbo task `contrast` (raporteaza, non-blocking). Fix light-mode: ListItem hover + EntityCard hover/selected (text alb pe fill accent/subtle pal → text/primary care flipuieste per mod). **Ramase 30 findings in 19 din 31 componente** (la 24 Oct 2026, dupa pagina Range — extractorul ignora acum comentariile; Pagination hover rezolvat in cod; Pagination + Tabs pressed dark 1.91 declarate; Switcher `text/secondary` pe `bg/subtle` + Tabs Full active pe `accent/surface`, pastrate ca in Figma) (Badge rezolvat in audit via `text/accent`; TimePicker adaugat — centrul `accent/default` pe `accent/subtle` 3.33 dark, pastrat ca in Figma) (auditul Phase 4.5 a adaugat perechile reale Button/IconOnly/Split + Tag Selected — dark accent ramp — si `text/secondary` pe `bg/subtle` la SegmentedControl + Tag Outline, light + dark; majoritatea doar dark-mode: rampa accent dark prea deschisa pt text alb on-accent + text mid-tone pe fill subtle la 3.3–4.0; Pagination hover rezolvat) → se rezolva Figma-side (ajusteaza accent/* dark + re-export), fold in "Dark mode visual verification"
- [ ] "Used in" pe token descriptions

---

## Tokeni vechi de inlocuit (la orice componenta)

| Token vechi (gresit) | Token corect |
|---|---|
| `--- Atoms ---/--- Avatar/Size-*` | `-- Atoms/Avatar/Size-*/Size` |
| `--- Radius ---/avatar` | `-- Atoms/Avatar/Global/Radius` |
| `--- Radius ---/Dropdown` | `- Radius -/md` |
| `--- Typeface family ---/base` | `- Typeface family -/base` (Inter, nu Red Hat Display) |
| `--- Organsim ---/--- Top Bar/...` | `--Organism/Top Bar/...` |
| `-- Molecule/User Card/...` | `-- Molecule/Entity Card/...` |
| `-- Molecule/User-Item/...` | `-- Molecule/Entity Item/...` |

---

## Decizii arhitecturale importante

- **Shadows** = Effect Styles hardcodate, EXCEPT shadow/color/1-4 (variabile light/dark)
- **Pressed effect** — Figma: overlay-only. Cod: `translateY(2px)` pe `:active`
- **Entity Card/Item** in loc de User Card/User Item
- **Table Cell** = height FIX per densitate; width fix per coloana
- **Data Table Row** nu are tokeni — dimensiunile vin din celule
- **Search Bar cu buton** = button in interior, valid doar Desktop
- **Delivery Row** din Stacked List nu are `Item Size` — intentionat
- **Standard Button MinWidth = 0** — intentionat
- **Bottom Nav** = background pe container, nu pe fiecare item

---

## Reguli de tokenizare

1. **Citeste `get_variable_defs`** inainte si dupa orice modificare
2. **Tokenii `---` sunt gresiti** — inlocuieste-i automat
3. **Aliaseaza la semantici** — NICIODATA valori hardcodate
4. **Global token** = justificat doar daca 2+ sub-componente il folosesc
5. **Nu tokeniza:** height/width pe autolayout, gap auto/between, padding redundant cand height e fix
6. **Fontul corect este Inter** — Light (300) body, Bold (700) emphasis, Black H1-H2

---

## Workflow MCP

```
Tokenizare: get_screenshot → get_metadata → get_variable_defs → fix cu use_figma → verify
Fix layout: get_design_context → get_screenshot → fix cu use_figma
Cod React:  get_design_context(react, typescript) → adaptare la CSS custom properties
```

---

## Note agent

1. Zero hardcode — foloseste tokeni semantici
2. Verifica cu screenshot + masuratori dupa fiecare modificare
3. YAGNI — nu construi variante ipotetice
4. Naming: spatii intre cuvinte, Title Case pe paths, lowercase pe color semantics
5. Detalii QA per componenta completata → `docs/CLAUDE-ARCHIVE.md`
