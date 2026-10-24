# Phase 4.5 audit — how to run a page

Process, checklist and page order: **`PLAN.md → Phase 4.5`**. Status: **`PROGRESS.md → Audit status`**.
One page = one `docs/audit/<slug>.md` + one commit. This file holds the practical recipe that
worked on the first twenty-eight pages (the Atoms tier + Inputs, Search bar, Item List, Dropdown, Form Groups, Date picker, Tabs, Pagination, Range, Entity Item; see the Audit status table).

## Loop per page
1. `figma-node-links/catalog.json` → page `nodeId` + `masters[]`. Read the React source, utils and story.
2. Figma MCP: `create_session` on `sX5tikviuBEhNbu2iPVya5` (load the `figma:figma-use` skill first). **Read-only.**
3. Run 2–4 read scripts (below): props + anatomy → per-variant bindings → wrapper states → doc text.
4. Check token values in `packages/tokens/src/tokens.json` (`components` block).
5. Write `docs/audit/<slug>.md` (10-row checklist per component; each finding classed
   **[code] / [designer] / [deviation]**).
6. **Ask the user only the genuine Figma-vs-code decisions** (API shape, a Figma binding that
   looks wrong, contrast failures). Everything else that Figma clearly says → just fix it.
7. Fix → verify gate (below) → Playwright screenshots (light + dark, + hover/pressed/focus for
   interactive parts) → update `PROGRESS.md` (status row, "For the designer", contrast count) →
   commit (the user pushes).

## Read script (use_figma, read-only)
Per-node signature: bound colour tokens for fills/strokes, dimension bindings, text style, effect
style, main component, property refs, visibility. Narrow the output: dimensions only for Tone=Default,
colours only for Size=M, or the return blows the **48 KB limit**.

```js
const cache={};const vn=async id=>{if(cache[id])return cache[id];const v=await figma.variables.getVariableByIdAsync(id);return cache[id]=v?v.name:"?"};
async function paints(ps){if(!Array.isArray(ps))return "mixed";const r=[];for(const p of ps){if(!p.visible)continue;const b=p.boundVariables&&p.boundVariables.color;r.push((b?await vn(b.id):(p.type==="SOLID"?"HARD#"+[p.color.r,p.color.g,p.color.b].map(x=>Math.round(x*255).toString(16).padStart(2,"0")).join(""):p.type))+(p.opacity!==1?"@"+p.opacity.toFixed(2):""))}return r.join("+")}
async function sig(n,dims){const o=[];const bv=n.boundVariables||{};
 const f=await paints(n.fills);if(f)o.push("fill="+f);
 if(n.strokes&&n.strokes.length)o.push("stroke="+await paints(n.strokes)+(dims?" sw="+(bv.strokeWeight?await vn(bv.strokeWeight.id):(bv.strokeTopWeight?await vn(bv.strokeTopWeight.id):String(n.strokeWeight))):""));
 if(n.opacity!==1||bv.opacity)o.push("op="+n.opacity.toFixed(2)+(bv.opacity?"("+await vn(bv.opacity.id)+")":""));
 if(dims){for(const k of ["paddingLeft","paddingTop","itemSpacing","topLeftRadius","width","height","minHeight"]){if(bv[k])o.push(k+"="+await vn(bv[k].id))}}
 if(n.type==="TEXT"){const st=typeof n.textStyleId==="string"&&n.textStyleId?await figma.getStyleByIdAsync(n.textStyleId):null;o.push("ts="+(st?st.name:"NONE "+JSON.stringify(n.fontName)+n.fontSize))}
 if(n.effectStyleId){const es=await figma.getStyleByIdAsync(n.effectStyleId);o.push("fx="+(es?es.name:"?"))}
 if(n.type==="INSTANCE"){const mc=await n.getMainComponentAsync();if(mc)o.push("mc="+mc.name)}
 const r=n.componentPropertyReferences;if(r&&Object.keys(r).length)o.push("ref="+Object.keys(r).join(","));
 if(!n.visible)o.push("HIDDEN");return o.join(" ")}
async function walk(n,acc,d,max,dims){const s=await sig(n,dims);if(s)acc.push("  ".repeat(d)+n.name+": "+s);if(d<max&&"children"in n&&!/^li:/.test(n.name))for(const c of n.children)await walk(c,acc,d+1,max,dims)}
// props: read componentPropertyDefinitions on the COMPONENT_SET (or a standalone COMPONENT) only;
// stringify defaults with String(JSON.stringify(v.defaultValue)) — SLOT defaults are undefined.
// doc text: setCurrentPageAsync(page) once, then frame.findAllWithCriteria({types:["TEXT"]}).
```

## Verify gate
```bash
pnpm -F @max-core/react typecheck && pnpm -F @max-core/react build   # apps consume dist
(cd apps/storybook && npx tsc --noEmit -p tsconfig.json)
(cd apps/showcase && npx tsc --noEmit -p tsconfig.json)               # green since the Badge audit
pnpm -F @max-core/tokens drift
pnpm -F @max-core/tokens contrast     # compare with the baseline in PROGRESS.md
npx biome check --write <changed files>
```
Run them as separate commands (or echo each exit code): a chained `&& … | tail` hides which step failed.

## Gotchas found so far
- **Click through, don't only screenshot.** Static stories hid two Date picker bugs (a collapsing
  range grid, a range that kept stretching) that showed up after paging months + clicking. For
  stateful widgets, script the real flow in Playwright and assert the resulting state.
- **A container's Size can size its children.** Read the nested instances' variant names per size
  (walk `children` recursively; `findAllWithCriteria` doesn't reach into slot content). Form Group
  S/M/L sets its Base Inputs + Buttons to S/M/L; missed in the first pass, fixed with a size context.
- **Figma strokes are INSIDE; CSS borders add.** A bordered field built from token padding came out
  2px too tall. Give the border back in the padding (`py-[calc(var(--spacing-12)-var(--border-weight-thin))]`)
  and measure the rendered height against the master.
- **Shared util classes hide pairings from the contrast audit** (Inputs: SelectInput dropped out).
  Declare the real pairings in `contrast-audit.ts` `OVERRIDES` and diff the component list before/after.
- **Leading trim, not a text-box artifact.** Every Figma text style has `leadingTrim: CAP_HEIGHT`, so a
  label's box is its cap height (9px for Caption, ~10 for Body/SM) and padding runs from cap top to
  baseline (Tooltip 16 + 9 + 16 = 41). React's full line box makes padding-hugged parts ~7–8px
  taller. Measure against the master's real frame height. The CSS equivalent is
  `[text-box:trim-both_cap_alphabetic]` (used by the tooltip surface); the other components are the
  open **cap-trim sweep** in PROGRESS. Earlier audits called this a "stuck text box" — that was wrong.
- **Wrapper vs options sets:** most atoms are a wrapper (State/Disabled/Focused) around an
  options set (Variant/Tone/Size). Read both; focus/hover/disabled live on the wrapper.
- **Focus in Figma is inconsistent:** ad-hoc `Focus` rects, `.Focus-ring` at 1px, State=Focused
  values, duplicate Focused booleans (Checkbox). React follows the hybrid model regardless
  (memory `project-focus-ring-deferred`); list the Figma side for the designer.
- **Contrast coverage:** the audit only pairs text/bg inside one class literal. Moving colours
  between files, or removing a bg class, can silently drop or add a component. Watch the
  denominator, and declare real cross-element pairings in `contrast-audit.ts` `OVERRIDES`.
- **Base UI disabled isn't always the attribute:** a disabled Tab gets `data-disabled` + `aria-disabled`, not `disabled`, so `disabled:` never matches (Tabs never dimmed). Use `data-[disabled]:` and check the computed opacity.
- **Tailwind variant order:** a compound `not-…:hover:` rule can outrank `active:` (Pagination pressed never showed). Exclude it with `not-active:` and check the pressed computed style.
- **Contrast denominator check every page:** list the audited components before/after (`grep -E '^\s+[✓✗]'`). An apostrophe in a comment used to misalign the extractor and silently drop a component (Pagination); `contrast.ts` now strips comments, but still diff the list.
- **Overflow clips the focus ring:** an `overflow-x-auto` bar cut the outset `focusRing`; Tab-screenshot every ring.
- **Base UI data attributes:** Checkbox/Radio/Switch expose `data-checked` / `data-unchecked` /
  `data-indeterminate`. Use `data-[unchecked]:hover:` for unchecked-only states.
- **ToggleGroup single-select** emits `[]` when the active item is clicked. Keep the group
  controlled (`useControllableState`) and ignore empty emissions (Switcher, SegmentedControl).
- **Base UI focus lives on inner inputs** for Slider (and other hidden-input widgets): `focus-visible:` on the
  wrapper never matches. Use `focusRingWithin` (`has-[:focus-visible]:`) and verify the ring with a Tab screenshot.
- **Storybook's Tailwind doesn't rescan `packages/react/src` on a dist rebuild.** A *new* class (one not
  used anywhere before) is in the DOM but has no CSS rule. `touch apps/storybook/src/global.css` forces
  the rescan. Check the computed style before you trust a hover/focus screenshot.
- **Comments:** never write `status/*/…` inside a `/** */` block — `*/` closes it.
- **Storybook ids** are kebab-case per word: `atoms-segmented-control--default`
  (`curl -s localhost:6006/index.json`). Many stories render controls *checked*; uncheck first
  before hover shots.
- Playwright: `~/.npm/_npx/*/node_modules/playwright`, `deviceScaleFactor: 2`,
  `&globals=theme:light|dark`. Screenshots go in the session scratchpad, not the repo.
- **Base UI Select needs `items` on `Select.Root`**, or `Select.Value` shows the raw value (`ro`)
  instead of the label once chosen.
- **Hover vs open:** a field's `hover:` border beats `data-[popup-open]` unless the hover rule
  excludes it (`fieldHover` has `not-data-[popup-open]`). Check the open state with the pointer
  still over the trigger.
- **Option rows can't nest controls:** a Select/Combobox item is `role=option`, so a real Checkbox
  or Radio inside it is invalid. Use the visual-only `CheckboxMark` / `RadioMark` (they follow the
  row's `data-selected` through `group/option`) with `listItemOption`.
- **Search inside a Combobox popup:** pass `render: <Combobox.Input />` to the SearchBar (its
  Base UI Input forwards `render`); the field itself becomes a `Combobox.Trigger`.
- **Popups:** Base UI Select defaults to `alignItemWithTrigger` (list over the trigger); turn it
  off. Size lists with `--anchor-width` / `--available-height`, and anchor Combobox positioners to
  the field frame, not the inner input. In Playwright give the viewport enough height, or
  `--available-height` clips the list and clicks hit the header instead of the rows.
- **Figma "rendered" sizes can be hand resizes:** check `layoutSizingHorizontal` before copying a
  width (the Search bar button was FIXED 72/74, not a token).
