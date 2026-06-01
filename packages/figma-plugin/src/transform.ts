/**
 * Plugin transform: Figma variables → TokensFile.
 *
 * Walks the three relevant collections (Primitives, Semantics, Colors) in the
 * `Max core` / `Light Mode` / `Dark Mode` modes, and produces JSON matching the
 * existing `tokens.json` shape so the downstream CSS pipeline doesn't change.
 *
 * Components collection is intentionally skipped (Phase 2 scope; see PLAN.md).
 */

import type { TokensFile, Tree } from '@max-core/tokens/types';

const PRIM_COLLECTION = 'Max Core - Primitives';
const SEM_COLLECTION = 'Max Core - Semantics';
const COL_COLLECTION = 'Max Core - Colors';

const PRIM_MODE = 'Max core';
const SEM_MODE = 'Max core';
const LIGHT_MODE = 'Light Mode';
const DARK_MODE = 'Dark Mode';

interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
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
  // Everything else (text-size, z-index, motion, icon size, breakpoints, etc.)
  // is intentionally skipped — not part of the current TokensFile shape.
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
  const path = figmaNameToTokenPath(targetVar.name, targetValue);
  if (!path) return null;
  return `{${path.join('.')}}`;
}

interface BuildContext {
  varsById: Map<string, Variable>;
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
  const raw = v.valuesByMode[modeId];
  if (isAlias(raw)) {
    const target = ctx.varsById.get(raw.id);
    if (!target) return null;
    return resolveLeaf(target, modeId, ctx, trail);
  }
  return raw;
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

  // Pass 1: numeric primitives live in the Primitives collection.
  for (const vid of primCol.variableIds) {
    const v = ctx.varsById.get(vid);
    if (!v) continue;
    const raw = v.valuesByMode[primMode];
    if (isAlias(raw)) continue;
    if (typeof raw !== 'number') continue;

    const path = figmaNameToTokenPath(v.name, raw);
    if (!path) continue;
    if (path[1] === 'opacity') {
      // Figma stores 0–100; convert to 0–1
      setPath(out, path.slice(1), raw / 100);
    } else if (path[1] === 'spacing' || path[1] === 'radius' || path[1] === 'border-width') {
      setPath(out, path.slice(1), raw);
    }
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
    const raw = v.valuesByMode[modeId];

    if (isAlias(raw)) {
      const target = ctx.varsById.get(raw.id);
      if (!target) continue;
      const targetRaw = target.valuesByMode[modeId];
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
    // Skip shadow/, info raw colors that don't fit the semantic mold cleanly.
    // We DO include status/info/* (semantic) but its values are raw hex in Figma.
    if (v.name.startsWith('shadow/')) continue;

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

export async function buildTokensFile(): Promise<TokensFile> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();

  const varsById = new Map<string, Variable>();
  for (const col of collections) {
    for (const vid of col.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(vid);
      if (v) varsById.set(v.id, v);
    }
  }

  const ctx: BuildContext = { varsById, resolvedHex: new Map() };

  const primCol = collections.find((c) => c.name === PRIM_COLLECTION);
  const semCol = collections.find((c) => c.name === SEM_COLLECTION);
  const colCol = collections.find((c) => c.name === COL_COLLECTION);

  if (!primCol) throw new Error(`Missing collection: ${PRIM_COLLECTION}`);
  if (!semCol) throw new Error(`Missing collection: ${SEM_COLLECTION}`);
  if (!colCol) throw new Error(`Missing collection: ${COL_COLLECTION}`);

  const findMode = (col: VariableCollection, name: string) => {
    const m = col.modes.find((mode) => mode.name === name);
    if (!m) throw new Error(`Missing mode "${name}" in collection ${col.name}`);
    return m.modeId;
  };

  const primMode = findMode(primCol, PRIM_MODE);
  const semMode = findMode(semCol, SEM_MODE);
  const lightMode = findMode(colCol, LIGHT_MODE);
  const darkMode = findMode(colCol, DARK_MODE);

  return {
    $version: '0.3.0',
    $description: `Auto-generated by @max-core/figma-plugin on ${new Date().toISOString()}`,
    primitives: buildPrimitives(primCol, primMode, colCol, lightMode, ctx),
    semantics: buildSemantics(semCol, semMode, ctx),
    colors: {
      light: buildColors(colCol, lightMode, ctx),
      dark: buildColors(colCol, darkMode, ctx),
    },
  };
}

export interface ExportCounts {
  primitives: number;
  semantics: number;
  light: number;
  dark: number;
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
  };
}
