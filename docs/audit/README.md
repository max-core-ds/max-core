# Phase 4.5 audit — how to run a page

Process, checklist and page order: **`PLAN.md → Phase 4.5`**. Status: **`PROGRESS.md → Audit status`**.
One page = one `docs/audit/<slug>.md` + one commit. This file holds the practical recipe that
worked on the first five pages (Buttons, Selection Controls, Segmented controls, Tag, Badge).

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
- **Text-box artifact:** several Figma masters have label text boxes stuck at 9–10px tall
  (Segmented item, Badge), so frame heights read too small. Compute height from padding + the
  text style line height; flag it to the designer, don't copy the frame height.
- **Wrapper vs options sets:** most atoms are a wrapper (State/Disabled/Focused) around an
  options set (Variant/Tone/Size). Read both; focus/hover/disabled live on the wrapper.
- **Focus in Figma is inconsistent:** ad-hoc `Focus` rects, `.Focus-ring` at 1px, State=Focused
  values, duplicate Focused booleans (Checkbox). React follows the hybrid model regardless
  (memory `project-focus-ring-deferred`); list the Figma side for the designer.
- **Contrast coverage:** the audit only pairs text/bg inside one class literal. Moving colours
  between files, or removing a bg class, can silently drop or add a component. Watch the
  denominator, and declare real cross-element pairings in `contrast-audit.ts` `OVERRIDES`.
- **Base UI data attributes:** Checkbox/Radio/Switch expose `data-checked` / `data-unchecked` /
  `data-indeterminate`. Use `data-[unchecked]:hover:` for unchecked-only states.
- **ToggleGroup single-select** emits `[]` when the active item is clicked. Keep the group
  controlled (`useControllableState`) and ignore empty emissions (Switcher, SegmentedControl).
- **Comments:** never write `status/*/…` inside a `/** */` block — `*/` closes it.
- **Storybook ids** are kebab-case per word: `atoms-segmented-control--default`
  (`curl -s localhost:6006/index.json`). Many stories render controls *checked*; uncheck first
  before hover shots.
- Playwright: `~/.npm/_npx/*/node_modules/playwright`, `deviceScaleFactor: 2`,
  `&globals=theme:light|dark`. Screenshots go in the session scratchpad, not the repo.
