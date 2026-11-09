/**
 * Plugin transform: Figma variables → TokensFile.
 *
 * Walks the four relevant collections (Primitives, Semantics, Colors,
 * Components) in the `Max core` / `Light Mode` / `Dark Mode` modes, and produces
 * JSON matching the `tokens.json` shape. Since v0.4.0 (Phase 4.6) EVERYTHING the
 * file defines is exported — Figma is the single source of truth:
 *   - every Primitives / Semantics variable (generic name → path fallback, only
 *     `icon/size/*` skipped on the designer's instruction),
 *   - the flat-keyed `components` block, whose values keep their nearest alias
 *     (a level-4 token referencing a level-3 one stays `{components.<name>}`),
 *   - `typography` (the 15 text styles) and every effect style (shadow, blur,
 *     glass layers).
 */

import type { EffectLayer, EffectShadowLayer, TokensFile, Tree, TypographyStyle } from '@max-core/tokens/types';

const PRIM_COLLECTION = 'Max Core - Primitives';
const SEM_COLLECTION = 'Max Core - Semantics';
const COL_COLLECTION = 'Max Core - Colors';
const COMP_COLLECTION = 'Max Core - Components';

const PRIM_MODE = 'Max core';
const SEM_MODE = 'Max core';
const COMP_MODE = 'Max core';
const LIGHT_MODE = 'Light Mode';
const DARK_MODE = 'Dark Mode';

interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/** Primitives groups exported through the generic name → path fallback. */
const PRIMITIVE_ROOTS = new Set(['zIndex', 'motion', 'focus', 'grid', 'breakpoint', 'container', 'tapArea']);

/**
 * Ids of alias targets that resolve by id but are listed in no local collection
 * (deleted variables something still aliases). Reset on every export.
 */
const detachedIds = new Set<string>();

/** Human-readable problems found during the last export (shown in the plugin UI). */
export const exportWarnings: string[] = [];

const COMPONENT_PREFIX = /^--\s*(Atoms|Molecule|Organism)\//;

/** Round Figma's float noise (110.00000238 → 110, 1.39999997 → 1.4). */
function round(n: number, places = 3): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

/** `zIndex` → `z-index`, `tapArea` → `tap-area`, `Desktop` → `desktop`, `- Typeface family -` → `typeface-family`. */
function slug(segment: string): string {
  return segment
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripLeadingZeros(s: string): string {
  const stripped = s.replace(/^0+(?=\d)/, '');
  return stripped === '' ? '0' : stripped;
}

function rgbToHex(c: RGB): string {
  const to = (n: number) =>
    Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();
  let hex = `#${to(c.r)}${to(c.g)}${to(c.b)}`;
  if (c.a !== undefined && c.a < 1) hex += to(c.a);
  return hex;
}

function isAlias(v: unknown): v is VariableAlias {
  return (
    typeof v === 'object' &&
    v !== null &&
    (v as { type?: string }).type === 'VARIABLE_ALIAS'
  );
}

function setPath(tree: Tree, segments: string[], value: unknown): void {
  let node: Tree = tree;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i]!;
    if (!(seg in node) || typeof node[seg] !== 'object' || node[seg] === null) {
      node[seg] = {};
    }
    node = node[seg] as Tree;
  }
  node[segments[segments.length - 1]!] = value;
}

/**
 * Map a Figma variable name to a `tokens.json` path. Returns null if the
 * variable should be skipped (e.g. text-size, z-index, motion — not part of
 * the current TokensFile shape).
 *
 * `valueHint` provides the raw resolved value for variables (like
 * `radius/md`) where the key in our output is the value, not the name.
 */
function figmaNameToTokenPath(name: string, valueHint?: number): string[] | null {
  // Primitives: spacing scale
  if (name.startsWith('spacing/scale/')) {
    return ['primitives', 'spacing', stripLeadingZeros(name.split('/')[2]!)];
  }
  // Primitives: radius (non-focus). Key = raw value to match current tokens.json.
  if (name.startsWith('radius/') && !name.startsWith('radius/focus/')) {
    if (valueHint === undefined) return null;
    return ['primitives', 'radius', String(valueHint)];
  }
  // Primitives: border width (only hairline=1 and strong=2 in Figma)
  if (name === 'border/width/hairline') return ['primitives', 'border-width', '1'];
  if (name === 'border/width/strong') return ['primitives', 'border-width', '2'];
  // Primitives: opacity (Figma stores 0–100; we store 0–1)
  if (name.startsWith('opacity/')) {
    return ['primitives', 'opacity', stripLeadingZeros(name.split('/')[1]!)];
  }
  // Primitives: color palettes
  if (name.startsWith('Palette/')) {
    const parts = name.split('/').slice(1);
    return ['primitives', 'color', ...parts];
  }
  // Semantics: - Spacing -/NN
  if (name.startsWith('- Spacing -/')) {
    return ['semantics', 'spacing', name.split('/')[1]!];
  }
  // Semantics: - Size -/NN
  if (name.startsWith('- Size -/')) {
    return ['semantics', 'size', name.split('/')[1]!];
  }
  // Semantics: - Radius -/name
  if (name.startsWith('- Radius -/')) {
    return ['semantics', 'radius', name.split('/')[1]!];
  }
  // Semantics: - Border Weight -/name
  if (name.startsWith('- Border Weight -/')) {
    return ['semantics', 'border-weight', name.split('/')[1]!];
  }
  // Semantics: - opacity -/name
  if (name.startsWith('- opacity -/')) {
    return ['semantics', 'opacity', name.split('/')[1]!];
  }
  // Any other semantic group (`- Typeface family -/base`, …) → semantics.<slug>.<key>
  const sem = name.match(/^- (.+?) -\/(.+)$/);
  if (sem) return ['semantics', slug(sem[1]!), sem[2]!];
  // Component tokens are flat-keyed by their full Figma name. A `.` would break
  // the `{a.b.c}` reference syntax, so such names fall back (firstMappableRef).
  if (COMPONENT_PREFIX.test(name)) return name.includes('.') ? null : ['components', name];
  // Icon sizes: unused by any component token — skipped on the designer's call.
  if (name.startsWith('icon/size/')) return null;
  // Remaining primitives, generic: `text-size/size/xs` → text-size.xs,
  // `zIndex/dropdown` → z-index.dropdown, `motion/easing/in` → motion.easing.in,
  // `radius/focus/md` → radius-focus.md, `grid/margin/Desktop` → grid.margin.desktop.
  if (name.startsWith('text-size/size/')) return ['primitives', 'text-size', slug(name.split('/')[2]!)];
  if (name.startsWith('radius/focus/')) return ['primitives', 'radius-focus', slug(name.split('/')[2]!)];
  // Whitelisted by root so Colors names (`bg/surface`, `border/default`) never land here.
  if (PRIMITIVE_ROOTS.has(name.split('/')[0]!)) return ['primitives', ...name.split('/').map(slug)];
  return null;
}

/**
 * Turn a Figma alias target into an alias string for our TokensFile.
 *
 * For palette aliases → `{primitives.color.primary.600}`.
 * For cross-color semantic aliases (e.g. status/danger/text → text/on-accent)
 * we return null so the caller can fall back to resolving to a literal hex.
 */
function aliasReference(targetVar: Variable, targetValue?: number): string | null {
  // A variable that's no longer in any collection has no token to point at;
  // the caller falls back to its resolved value (and the export warns).
  if (detachedIds.has(targetVar.id)) return null;
  const path = figmaNameToTokenPath(targetVar.name, targetValue);
  if (!path) return null;
  return `{${path.join('.')}}`;
}

interface BuildContext {
  varsById: Map<string, Variable>;
  /**
   * Production ("Max core") mode id per collection. Figma mode ids are
   * collection-scoped, and alias chains cross collections (a component token →
   * a semantic → a primitive), so resolveLeaf must read each variable in ITS
   * OWN collection's mode, not the caller's. Colors is intentionally omitted —
   * its callers pass the light/dark mode explicitly.
   */
  modeByCollection: Map<string, string>;
  resolvedHex: Map<string, string>; // for cross-color alias fallback
}

/**
 * Resolve a variable's value to a final hex (for color cross-aliases) or
 * number/string. Walks alias chains.
 */
function resolveLeaf(
  v: Variable,
  modeId: string,
  ctx: BuildContext,
  trail: Set<string> = new Set(),
): unknown {
  if (trail.has(v.id)) throw new Error(`Circular alias chain at ${v.name}`);
  trail.add(v.id);
  // Read this variable in its own collection's production mode. When the chain
  // stays within one collection (or the collection isn't mapped, e.g. Colors)
  // this is just `modeId`; when it has crossed a boundary, this picks the right
  // mode so `valuesByMode` doesn't miss and silently return undefined.
  const useMode = ctx.modeByCollection.get(v.variableCollectionId) ?? modeId;
  const raw = v.valuesByMode[useMode];
  if (isAlias(raw)) {
    const target = ctx.varsById.get(raw.id);
    if (!target) return null;
    return resolveLeaf(target, modeId, ctx, trail);
  }
  return raw;
}

/**
 * Walk an alias chain and return the reference for the first target that maps to
 * a semantic/primitive (`{semantics.spacing.12}`). Used when a component token
 * aliases ANOTHER component token (level 4 → level 3, e.g. Stepper/Padding X →
 * Input/Global/General/Padding X → `- Spacing -/12`): rather than flattening to
 * a raw number, we skip the intermediate component tokens and reference the
 * semantic the chain lands on — preserving the cascade and keeping the token
 * visible to the drift/conformance check, which only recognises `{semantics.*}`
 * references (a raw number is silently ignored). Returns null if the chain never
 * reaches a name-mappable token.
 */
function firstMappableRef(
  v: Variable,
  modeId: string,
  ctx: BuildContext,
  trail: Set<string> = new Set(),
): string | null {
  if (trail.has(v.id)) return null;
  trail.add(v.id);
  const useMode = ctx.modeByCollection.get(v.variableCollectionId) ?? modeId;
  const raw = v.valuesByMode[useMode];
  if (!isAlias(raw)) return null;
  const target = ctx.varsById.get(raw.id);
  if (!target) return null;
  const targetMode = ctx.modeByCollection.get(target.variableCollectionId) ?? modeId;
  const targetRaw = target.valuesByMode[targetMode];
  const hint = typeof targetRaw === 'number' ? targetRaw : undefined;
  return aliasReference(target, hint) ?? firstMappableRef(target, modeId, ctx, trail);
}

function buildPrimitives(
  primCol: VariableCollection,
  primMode: string,
  colCol: VariableCollection,
  colMode: string,
  ctx: BuildContext,
): Tree {
  const out: Tree = {
    spacing: {},
    radius: {},
    'border-width': { '0': 0 }, // Figma doesn't have border-width/0; synthesize it
    opacity: {},
    color: {},
  };

  // Pass 1: everything in the Primitives collection. Numbers and strings are
  // written as-is (opacity converted 0–100 → 0–1); aliases inside the collection
  // (e.g. `grid/gutter` → `spacing/scale/24`) keep their reference.
  for (const vid of primCol.variableIds) {
    const v = ctx.varsById.get(vid);
    if (!v) continue;
    const raw = v.valuesByMode[primMode];

    if (isAlias(raw)) {
      const path = figmaNameToTokenPath(v.name);
      if (!path || path[0] !== 'primitives') continue;
      const target = ctx.varsById.get(raw.id);
      const targetRaw = target?.valuesByMode[primMode];
      const ref = target
        ? aliasReference(target, typeof targetRaw === 'number' ? targetRaw : undefined)
        : null;
      const value = ref ?? resolveLeaf(v, primMode, ctx);
      if (typeof value === 'number' || typeof value === 'string') setPath(out, path.slice(1), value);
      continue;
    }

    if (typeof raw === 'string') {
      const path = figmaNameToTokenPath(v.name);
      if (path && path[0] === 'primitives') setPath(out, path.slice(1), raw);
      continue;
    }
    if (typeof raw !== 'number') continue;

    const path = figmaNameToTokenPath(v.name, raw);
    if (!path || path[0] !== 'primitives') continue;
    setPath(out, path.slice(1), path[1] === 'opacity' ? round(raw / 100) : round(raw));
  }

  // Pass 2: color palette entries live in the Colors collection (Palette/*).
  // Values are identical across Light/Dark — read from whichever mode.
  for (const vid of colCol.variableIds) {
    const v = ctx.varsById.get(vid);
    if (!v) continue;
    if (!v.name.startsWith('Palette/')) continue;
    const raw = v.valuesByMode[colMode];
    if (isAlias(raw)) continue;
    if (typeof raw !== 'object' || raw === null || !('r' in raw)) continue;
    const path = figmaNameToTokenPath(v.name);
    if (!path || path[1] !== 'color') continue;
    setPath(out, path.slice(1), rgbToHex(raw as RGB));
  }

  return out;
}

function buildSemantics(
  col: VariableCollection,
  modeId: string,
  ctx: BuildContext,
): TokensFile['semantics'] {
  const out: TokensFile['semantics'] = {
    spacing: {},
    size: {},
    radius: {},
    'border-weight': {},
    opacity: {},
  };

  for (const vid of col.variableIds) {
    const v = ctx.varsById.get(vid);
    if (!v) continue;
    const path = figmaNameToTokenPath(v.name);
    if (!path || path[0] !== 'semantics') continue;
    const subgroup = path[1] as keyof typeof out;
    const key = path[2]!;
    // Groups beyond the five dimensional ones (e.g. typeface-family) are created on demand.
    out[subgroup] ??= {};
    const raw = v.valuesByMode[modeId];

    if (isAlias(raw)) {
      const target = ctx.varsById.get(raw.id);
      if (!target) continue;
      const targetMode = ctx.modeByCollection.get(target.variableCollectionId) ?? modeId;
      const targetRaw = target.valuesByMode[targetMode];
      const targetValue = typeof targetRaw === 'number' ? targetRaw : undefined;
      const alias = aliasReference(target, targetValue);
      if (alias) {
        out[subgroup][key] = alias;
      } else {
        // Fall back to resolved value
        out[subgroup][key] = resolveLeaf(v, modeId, ctx);
      }
    } else if (typeof raw === 'number' || typeof raw === 'string') {
      // Direct value (rare in semantics — e.g. - Radius -/full = 9999)
      out[subgroup][key] = raw;
    }
  }

  return out;
}

/**
 * Colors collection: produces an object keyed by the variable's slash-name
 * (e.g. `bg/surface`, `status/danger/default`). Values are either alias paths
 * to primitives or literal hex strings.
 */
function buildColors(
  col: VariableCollection,
  modeId: string,
  ctx: BuildContext,
): Tree {
  const out: Tree = {};

  for (const vid of col.variableIds) {
    const v = ctx.varsById.get(vid);
    if (!v) continue;
    // Skip palette + non-semantic-color entries (they go to primitives via the
    // primitives collection, not via colors).
    if (v.name.startsWith('Palette/') || v.name.startsWith('Grayscale/')) continue;
    // `shadow/color *` and `shadow/inner/color *` are mode-aware color
    // variables referenced by the shadow effect styles (see buildEffects), so
    // they ARE included here — emitted as `--shadow-color-*` / `--shadow-inner-color-*`.

    const raw = v.valuesByMode[modeId];

    if (isAlias(raw)) {
      const target = ctx.varsById.get(raw.id);
      if (!target) continue;
      // Try to alias to a primitive (Palette path)
      const alias = aliasReference(target);
      if (alias) {
        out[v.name] = alias;
      } else {
        // Cross-color alias — resolve to literal hex
        const resolved = resolveLeaf(v, modeId, ctx);
        if (typeof resolved === 'object' && resolved !== null && 'r' in resolved) {
          out[v.name] = rgbToHex(resolved as RGB);
        } else if (typeof resolved === 'string') {
          out[v.name] = resolved;
        }
      }
    } else if (typeof raw === 'object' && raw !== null && 'r' in raw) {
      out[v.name] = rgbToHex(raw as RGB);
    }
  }

  return out;
}

/**
 * Components collection (`-- Atoms/...`, `-- Molecule/...`, `--Organism/...`):
 * level 3/4 tokens read in the `Max core` (production) mode. Flat-keyed by the
 * full Figma variable name, mirroring `buildColors`.
 *
 * Most component tokens alias a semantic (e.g. `-- Atoms/Buttons/Global/Radius`
 * → `- Radius -/sm`); those emit a `{semantics.radius.sm}` reference so the
 * cascade is preserved. Where the alias target is itself a component token
 * (level 4 → level 3) we follow the chain to the semantic it lands on and emit
 * that reference (firstMappableRef); only chains that never reach a mappable
 * token fall back to the resolved leaf value (concrete number/hex).
 */
function buildComponents(
  col: VariableCollection,
  modeId: string,
  ctx: BuildContext,
): Tree {
  const out: Tree = {};

  for (const vid of col.variableIds) {
    const v = ctx.varsById.get(vid);
    if (!v) continue;
    const raw = v.valuesByMode[modeId];

    if (isAlias(raw)) {
      const target = ctx.varsById.get(raw.id);
      if (!target) continue; // reported in buildTokensFile
      const targetMode = ctx.modeByCollection.get(target.variableCollectionId) ?? modeId;
      const targetRaw = target.valuesByMode[targetMode];
      const targetValue = typeof targetRaw === 'number' ? targetRaw : undefined;
      // Nearest alias wins: a level-4 token referencing a level-3 one stays
      // `{components.<level-3 name>}` so the CSS cascade mirrors Figma's.
      const alias = aliasReference(target, targetValue);
      if (alias) {
        out[v.name] = alias;
      } else {
        // Target can't be referenced by name (e.g. a `.` in a component name).
        // Use the semantic the chain lands on; only flatten to a concrete value
        // if no such reference exists.
        const ref = firstMappableRef(v, modeId, ctx);
        if (ref) {
          out[v.name] = ref;
        } else {
          const resolved = resolveLeaf(v, modeId, ctx);
          if (typeof resolved === 'number' || typeof resolved === 'string') {
            out[v.name] = resolved;
          } else if (typeof resolved === 'object' && resolved !== null && 'r' in resolved) {
            out[v.name] = rgbToHex(resolved as RGB);
          } else {
            exportWarnings.push(`${v.name} → alias chain did not resolve; token skipped`);
          }
        }
      }
    } else if (typeof raw === 'number' || typeof raw === 'string') {
      out[v.name] = raw;
    } else if (typeof raw === 'object' && raw !== null && 'r' in raw) {
      out[v.name] = rgbToHex(raw as RGB);
    }
  }

  return out;
}

/**
 * Effect styles → ordered layer lists. Shadow layers record their bound
 * `shadow/color *` variable so the CSS can reference it (and inherit light/dark);
 * background/layer blurs keep their Figma radius (the CSS transform halves it,
 * like Figma's own CSS export); Figma's Glass effect keeps its raw parameters
 * for the CSS approximation (backdrop blur + saturation + edge).
 */
async function buildEffects(ctx: BuildContext): Promise<Record<string, EffectLayer[]>> {
  const out: Record<string, EffectLayer[]> = {};
  const styles = await figma.getLocalEffectStylesAsync();

  for (const s of styles) {
    const layers: EffectLayer[] = [];
    for (const e of s.effects as readonly (Effect | { type: 'GLASS'; [k: string]: unknown })[]) {
      if (e.visible === false) continue;
      if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
        const layer: EffectShadowLayer = {
          inset: e.type === 'INNER_SHADOW',
          x: round(e.offset.x),
          y: round(e.offset.y),
          blur: round(e.radius),
          spread: round(e.spread ?? 0),
        };
        const bound = e.boundVariables?.color;
        const target = bound?.id ? ctx.varsById.get(bound.id) : undefined;
        if (target) {
          layer.colorVar = target.name;
        } else if (e.color) {
          layer.color = rgbToHex(e.color as RGB);
        }
        layers.push(layer);
      } else if (e.type === 'BACKGROUND_BLUR' || e.type === 'LAYER_BLUR') {
        layers.push({
          type: 'blur',
          backdrop: e.type === 'BACKGROUND_BLUR',
          radius: round(e.radius),
        });
      } else if (e.type === 'GLASS') {
        const g = e as unknown as Record<string, number>;
        layers.push({
          type: 'glass',
          radius: round(g.radius ?? 0),
          refraction: round(g.refraction ?? 0),
          depth: round(g.depth ?? 0),
          lightAngle: round(g.lightAngle ?? 0),
          lightIntensity: round(g.lightIntensity ?? 0),
          dispersion: round(g.dispersion ?? 0),
          splay: round(g.splay ?? 0),
        });
      }
    }
    if (layers.length > 0) out[s.name] = layers;
  }

  return out;
}

const WEIGHT_BY_STYLE: Record<string, number> = {
  Thin: 100,
  'Extra Light': 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  'Semi Bold': 600,
  Bold: 700,
  'Extra Bold': 800,
  Black: 900,
};

/**
 * Text styles → composite typography tokens. Family and size come from the
 * bound variables (references, so a family swap in Figma reaches the code);
 * weight, line height (%) and letter spacing (%) live on the style itself.
 */
async function buildTypography(ctx: BuildContext): Promise<Record<string, TypographyStyle>> {
  const out: Record<string, TypographyStyle> = {};
  const styles = await figma.getLocalTextStylesAsync();

  const refFor = (alias: VariableAlias | undefined, fallback: string | number): string | number => {
    const target = alias?.id ? ctx.varsById.get(alias.id) : undefined;
    if (!target) return fallback;
    return aliasReference(target) ?? fallback;
  };

  for (const s of styles) {
    const bound = (s.boundVariables ?? {}) as Partial<Record<string, VariableAlias>>;
    const wght = (s.fontName as FontName & { variationSettings?: { wght?: number } })
      .variationSettings?.wght;
    const lh = s.lineHeight;
    const ls = s.letterSpacing;
    out[s.name] = {
      fontFamily: String(refFor(bound.fontFamily, s.fontName.family)),
      fontSize: refFor(bound.fontSize, round(s.fontSize)),
      fontWeight: wght ?? WEIGHT_BY_STYLE[s.fontName.style] ?? 400,
      lineHeight:
        lh.unit === 'AUTO'
          ? 'normal'
          : lh.unit === 'PERCENT'
            ? `${round(lh.value, 2)}%`
            : round(lh.value, 2),
      letterSpacing: ls.unit === 'PERCENT' ? `${round(ls.value, 2)}%` : round(ls.value, 2),
      leadingTrim: s.leadingTrim === 'CAP_HEIGHT' ? 'cap-height' : 'none',
    };
  }

  return out;
}

export async function buildTokensFile(): Promise<TokensFile> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  const varsById = new Map<string, Variable>();
  for (const col of collections) {
    for (const vid of col.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(vid);
      if (v) varsById.set(v.id, v);
    }
  }

  // Alias targets missing from every collection: load them so chains still
  // resolve, and record a warning per token that points at one.
  detachedIds.clear();
  exportWarnings.length = 0;
  for (const v of [...varsById.values()]) {
    for (const raw of Object.values(v.valuesByMode)) {
      if (!isAlias(raw) || varsById.has(raw.id)) continue;
      const target = await figma.variables.getVariableByIdAsync(raw.id);
      if (!target) {
        exportWarnings.push(`${v.name} → missing variable (${raw.id}); token skipped`);
        continue;
      }
      varsById.set(target.id, target);
      detachedIds.add(target.id);
      exportWarnings.push(
        `${v.name} → "${target.name}" is in no collection (deleted?); exported as its value`,
      );
    }
  }

  const primCol = collections.find((c) => c.name === PRIM_COLLECTION);
  const semCol = collections.find((c) => c.name === SEM_COLLECTION);
  const colCol = collections.find((c) => c.name === COL_COLLECTION);
  const compCol = collections.find((c) => c.name === COMP_COLLECTION);

  if (!primCol) throw new Error(`Missing collection: ${PRIM_COLLECTION}`);
  if (!semCol) throw new Error(`Missing collection: ${SEM_COLLECTION}`);
  if (!colCol) throw new Error(`Missing collection: ${COL_COLLECTION}`);
  if (!compCol) throw new Error(`Missing collection: ${COMP_COLLECTION}`);

  const findMode = (col: VariableCollection, name: string) => {
    const m = col.modes.find((mode) => mode.name === name);
    if (!m) throw new Error(`Missing mode "${name}" in collection ${col.name}`);
    return m.modeId;
  };

  const primMode = findMode(primCol, PRIM_MODE);
  const semMode = findMode(semCol, SEM_MODE);
  const compMode = findMode(compCol, COMP_MODE);
  const lightMode = findMode(colCol, LIGHT_MODE);
  const darkMode = findMode(colCol, DARK_MODE);

  // Map each single-production collection to its "Max core" mode so resolveLeaf
  // can follow alias chains across collection boundaries. Colors is omitted on
  // purpose — buildColors/buildSemantics pass the light/dark mode directly.
  const ctx: BuildContext = {
    varsById,
    modeByCollection: new Map([
      [primCol.id, primMode],
      [semCol.id, semMode],
      [compCol.id, compMode],
    ]),
    resolvedHex: new Map(),
  };

  return {
    $version: '0.4.0',
    $description: `Auto-generated by @max-core/figma-plugin on ${new Date().toISOString()}`,
    primitives: buildPrimitives(primCol, primMode, colCol, lightMode, ctx),
    semantics: buildSemantics(semCol, semMode, ctx),
    colors: {
      light: buildColors(colCol, lightMode, ctx),
      dark: buildColors(colCol, darkMode, ctx),
    },
    components: buildComponents(compCol, compMode, ctx),
    typography: await buildTypography(ctx),
    effects: await buildEffects(ctx),
  };
}

export interface ExportCounts {
  primitives: number;
  semantics: number;
  light: number;
  dark: number;
  components: number;
  typography: number;
  effects: number;
}

export function countTokens(tokens: TokensFile): ExportCounts {
  function leafCount(node: unknown): number {
    if (typeof node !== 'object' || node === null) return 1;
    return Object.values(node as Record<string, unknown>).reduce<number>(
      (sum, child) => sum + leafCount(child),
      0,
    );
  }
  return {
    primitives: leafCount(tokens.primitives),
    semantics: leafCount(tokens.semantics),
    light: Object.keys(tokens.colors.light).length,
    dark: Object.keys(tokens.colors.dark).length,
    components: tokens.components ? Object.keys(tokens.components).length : 0,
    typography: tokens.typography ? Object.keys(tokens.typography).length : 0,
    effects: tokens.effects ? Object.keys(tokens.effects).length : 0,
  };
}
