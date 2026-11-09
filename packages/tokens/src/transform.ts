/**
 * Pure transforms: tokens.json → CSS.
 *
 * `generateTokensCss` → `tokens.css`: plain custom properties for any consumer.
 * Resolves the Primitives → Semantics → Colors cascade and emits variables under
 * `:root` plus a `[data-theme="dark"]` override block. Since v0.4.0 it also
 * emits the remaining primitives (z-index, motion, layout…), the font families,
 * the 15 text styles, blur / glass effects and every component token — the
 * component tokens as `var()` chains, so overriding a semantic (or a level-3
 * component token) cascades exactly as it does in Figma.
 *
 * `generateThemeCss` → `theme.css`: the Tailwind v4 layer (`@theme` names +
 * `type-*` / `glass-*` utilities) built on top of `tokens.css`.
 */

import type {
  EffectBlurLayer,
  EffectGlassLayer,
  EffectLayer,
  EffectShadowLayer,
  TokensFile,
  Tree,
  TypographyStyle,
} from './types.js';

function getPath(tree: Tree, path: string[]): unknown {
  let current: unknown = tree;
  for (const segment of path) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

function resolve(value: unknown, root: Tree, trail: string[] = []): string | number {
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const ref = value.slice(1, -1);
    if (trail.includes(ref)) {
      throw new Error(`Circular token reference: ${[...trail, ref].join(' → ')}`);
    }
    const next = getPath(root, ref.split('.'));
    if (next === undefined) {
      throw new Error(`Unknown token reference: {${ref}}`);
    }
    return resolve(next, root, [...trail, ref]);
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  throw new Error(`Cannot resolve token value: ${JSON.stringify(value)}`);
}

function cssVarName(key: string): string {
  // `bg/surface` → `--bg-surface`
  // `overlay/default black` → `--overlay-default-black` (spaces collapsed to dashes)
  // Any non-identifier character becomes a dash; consecutive dashes collapse.
  const normalized = key.replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-');
  return `--${normalized}`;
}

function px(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

function emitGroup(
  comment: string,
  entries: Tree,
  root: Tree,
  options: { prefix: string; unit: 'px' | 'raw' },
): string {
  const lines: string[] = [`  /* ${comment} */`];
  for (const [key, val] of Object.entries(entries)) {
    const resolved = resolve(val, root);
    const formatted = options.unit === 'px' ? px(resolved) : String(resolved);
    lines.push(`  --${options.prefix}-${key}: ${formatted};`);
  }
  return lines.join('\n');
}

function emitColors(comment: string, entries: Tree, root: Tree): string {
  const lines: string[] = [`  /* ${comment} */`];
  for (const [key, val] of Object.entries(entries)) {
    const resolved = resolve(val, root);
    lines.push(`  ${cssVarName(key)}: ${resolved};`);
  }
  return lines.join('\n');
}

/**
 * Emit shadow effect styles as composite `box-shadow` custom properties, e.g.
 * `--effect-shadow-down-lg: 0px 2px 6px 0px var(--shadow-color-4), …;`.
 *
 * Geometry is mode-independent so these live in `:root` only; each layer's
 * color is referenced via `var(--shadow-color-*)`, which carries the light/dark
 * value, so the shadow re-tints per theme without duplicating the rule.
 */
function emitEffects(comment: string, effects: Record<string, EffectLayer[]>): string {
  const lines: string[] = [`  /* ${comment} */`];
  for (const [name, all] of Object.entries(effects)) {
    // Blur / glass layers are emitted separately (backdrop-filter, not box-shadow).
    const layers = all.filter((l): l is EffectShadowLayer => l.type === undefined);
    if (layers.length === 0) continue;
    const shadow = layers
      .map((l) => {
        const color = l.colorVar ? `var(${cssVarName(l.colorVar)})` : (l.color ?? 'transparent');
        const inset = l.inset ? 'inset ' : '';
        return `${inset}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${color}`;
      })
      .join(', ');
    lines.push(`  ${cssVarName(name)}: ${shadow};`);
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// v0.4.0 sections
// ---------------------------------------------------------------------------

/** Groups emitted by the original v0.3 sections; everything else is "extra". */
const LEGACY_PRIMITIVE_GROUPS = new Set(['spacing', 'radius', 'border-width', 'opacity', 'color']);
const LEGACY_SEMANTIC_GROUPS = new Set(['spacing', 'size', 'radius', 'border-weight', 'opacity']);
const COMPONENT_TIER = /^--\s*(Atoms|Molecule|Organism)\//;

/** Lowercase kebab slug: `Size S/Padding X` → `size-s-padding-x`. */
function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** CSS custom-property name of a component token: tier prefix dropped. */
export function componentVarName(figmaName: string): string {
  return `--${slug(figmaName.replace(COMPONENT_TIER, ''))}`;
}

/** CSS name of a text style: `Heading/H1` → `h1`, `Body/SM/300` → `body-sm-300`. */
export function typeStyleSlug(styleName: string): string {
  return slug(styleName.replace(/^Heading\//, ''));
}

/**
 * Unit for an extra primitive, by its path. Durations are ms; counts, z-index
 * and strings are raw; every other number is a px length.
 */
function primitiveUnit(path: string[]): 'px' | 'ms' | 'raw' {
  if (path[0] === 'z-index') return 'raw';
  if (path[0] === 'motion' && path[1] === 'duration') return 'ms';
  if (path[0] === 'grid' && path[1] === 'columns') return 'raw';
  return 'px';
}

function formatValue(v: string | number, unit: 'px' | 'ms' | 'raw'): string {
  if (typeof v === 'string') return v;
  if (unit === 'raw' || v === 0) return String(v);
  return `${v}${unit}`;
}

function walkLeaves(node: Tree, path: string[], visit: (path: string[], value: unknown) => void): void {
  for (const [k, v] of Object.entries(node)) {
    if (v !== null && typeof v === 'object') walkLeaves(v as Tree, [...path, k], visit);
    else visit([...path, k], v);
  }
}

/** z-index, motion, focus, grid, breakpoint, container, tap-area, text-size, radius-focus. */
function emitExtraPrimitives(tokens: TokensFile, root: Tree, names: Set<string>): string {
  const lines: string[] = ['  /* Primitives — text size, layering, motion, layout, focus */'];
  for (const [group, node] of Object.entries(tokens.primitives)) {
    if (LEGACY_PRIMITIVE_GROUPS.has(group) || node === null || typeof node !== 'object') continue;
    walkLeaves(node as Tree, [group], (path, value) => {
      const name = `--${path.map(slug).join('-')}`;
      names.add(name);
      lines.push(`  ${name}: ${formatValue(resolve(value, root), primitiveUnit(path))};`);
    });
  }
  return lines.length > 1 ? lines.join('\n') : '';
}

const FAMILY_FALLBACK: Record<string, string> = {
  mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};
const DEFAULT_FAMILY_FALLBACK = 'ui-sans-serif, system-ui, sans-serif';

function quoteFamily(family: string): string {
  return /^[a-zA-Z-]+$/.test(family) ? family : `"${family.replace(/"/g, '')}"`;
}

/** Non-dimensional semantic groups — today only `typeface-family` (strings). */
function emitExtraSemantics(tokens: TokensFile, root: Tree, names: Set<string>): string {
  const lines: string[] = ['  /* Semantics — font families */'];
  for (const [group, node] of Object.entries(tokens.semantics)) {
    if (LEGACY_SEMANTIC_GROUPS.has(group) || node === null || typeof node !== 'object') continue;
    for (const [key, value] of Object.entries(node)) {
      const name = `--${slug(group)}-${slug(key)}`;
      names.add(name);
      const resolved = resolve(value, root);
      const css =
        group === 'typeface-family' && typeof resolved === 'string'
          ? `${quoteFamily(resolved)}, ${FAMILY_FALLBACK[key] ?? DEFAULT_FAMILY_FALLBACK}`
          : formatValue(resolved, 'px');
      lines.push(`  ${name}: ${css};`);
    }
  }
  return lines.length > 1 ? lines.join('\n') : '';
}

/**
 * Turn a token reference into the CSS it should emit inside a component var:
 * another component token or an emitted semantic → `var(--…)` (keeps the
 * cascade); a primitive (not emitted for dimensional groups) → its literal.
 */
function refToCss(value: unknown, root: Tree, unit: 'px' | 'raw'): string {
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const ref = value.slice(1, -1);
    const [layer, ...rest] = ref.split('.');
    if (layer === 'components') return `var(${componentVarName(rest.join('.'))})`;
    if (layer === 'semantics' && rest.length === 2) {
      const [group, key] = rest as [string, string];
      return LEGACY_SEMANTIC_GROUPS.has(group)
        ? `var(--${group}-${key})`
        : `var(--${slug(group)}-${slug(key)})`;
    }
    // Extra primitive groups (text-size, z-index, motion…) are emitted, so keep the reference.
    if (layer === 'primitives' && rest[0] && !LEGACY_PRIMITIVE_GROUPS.has(rest[0])) {
      return `var(--${rest.map(slug).join('-')})`;
    }
    const resolved = resolve(value, root);
    const isOpacity = ref.startsWith('primitives.opacity.');
    return formatValue(resolved, isOpacity ? 'raw' : unit);
  }
  if (typeof value === 'number' || typeof value === 'string') return formatValue(value, unit);
  throw new Error(`Cannot emit component token value: ${JSON.stringify(value)}`);
}

/** All component tokens, tier prefix dropped, as `var()` chains. Fails on name collisions. */
function emitComponents(tokens: TokensFile, root: Tree, names: Set<string>): string {
  const comps = tokens.components ?? {};
  const entries = Object.entries(comps);
  if (entries.length === 0) return '';
  const owner = new Map<string, string>();
  const lines: string[] = [`  /* Components — ${entries.length} tokens (level 3/4), tier prefix dropped */`];
  for (const [figmaName, value] of entries) {
    const name = componentVarName(figmaName);
    const clash = owner.get(name) ?? (names.has(name) ? '(another token group)' : undefined);
    if (clash) {
      throw new Error(`CSS name collision: "${figmaName}" and ${clash} both map to ${name}`);
    }
    owner.set(name, `"${figmaName}"`);
    lines.push(`  ${name}: ${refToCss(value, root, 'px')};`);
  }
  for (const n of owner.keys()) names.add(n);
  return lines.join('\n');
}

/** `110%` → `1.1` (unitless, scales with the size); px numbers stay px. */
function lineHeightCss(v: string | number): string {
  if (typeof v === 'number') return `${v}px`;
  if (v.endsWith('%')) return String(Math.round(Number.parseFloat(v) * 1000) / 100000);
  return v;
}

/** `-1.5%` (of the font size, Figma's unit) → `-0.015em`. */
function letterSpacingCss(v: string | number): string {
  if (typeof v === 'number') return v === 0 ? '0' : `${v}px`;
  if (v.endsWith('%')) {
    const em = Math.round(Number.parseFloat(v) * 1000) / 100000;
    return em === 0 ? '0' : `${em}em`;
  }
  return v;
}

/** Five custom properties per text style: `--type-h1-font-family` … `-letter-spacing`. */
function emitTypography(tokens: TokensFile, root: Tree, names: Set<string>): string {
  const styles = Object.entries(tokens.typography ?? {});
  if (styles.length === 0) return '';
  const lines: string[] = [`  /* Typography — ${styles.length} text styles */`];
  for (const [styleName, t] of styles) {
    const base = `--type-${typeStyleSlug(styleName)}`;
    const props: [string, string][] = [
      ['font-family', refToCss(t.fontFamily, root, 'raw')],
      ['font-size', refToCss(t.fontSize, root, 'px')],
      ['font-weight', String(t.fontWeight)],
      ['line-height', lineHeightCss(t.lineHeight)],
      ['letter-spacing', letterSpacingCss(t.letterSpacing)],
    ];
    for (const [prop, css] of props) {
      names.add(`${base}-${prop}`);
      lines.push(`  ${base}-${prop}: ${css};`);
    }
  }
  return lines.join('\n');
}

/**
 * Figma blur radius → the CSS blur length (CSS takes half, like Figma's own CSS
 * export). Emitted as a bare length so it works in `blur(var(--…))` and as a
 * Tailwind `--blur-*` theme value (Tailwind adds the `blur()` itself).
 */
function cssBlur(figmaRadius: number): string {
  const r = Math.round((figmaRadius / 2) * 100) / 100;
  return r === 0 ? '0' : `${r}px`;
}

/**
 * Glass approximation (Figma's Glass effect has no CSS equivalent):
 * backdrop = frost blur + half the refraction depth, slight saturation boost;
 * edge = a 1px inner highlight on the lit side (light angle −45° = top-left)
 * plus a faint full-perimeter rim, both scaled by the light intensity.
 * Tuned visually against the masters in Phase 4.7.
 */
function glassCss(g: EffectGlassLayer): { backdrop: string; edge: string } {
  const blur = Math.round((g.radius / 2 + g.depth / 2) * 100) / 100;
  const saturate = Math.round((1 + g.refraction / 2) * 100) / 100;
  const hi = Math.round(g.lightIntensity * 50) / 100;
  const rim = Math.round(g.lightIntensity * 20) / 100;
  return {
    backdrop: `blur(${blur}px) saturate(${saturate})`,
    edge: `inset 1px 1px 0 0 rgb(255 255 255 / ${hi}), inset 0 0 0 1px rgb(255 255 255 / ${rim})`,
  };
}

/**
 * Blur + glass styles. Blur = a length (`--effect-blur-md: 12px`); glass = a full
 * `backdrop-filter` list + an edge `box-shadow`. Shadow layers stay in emitEffects
 * (`--effect-glass-elevated` is the elevated glass's drop shadow).
 */
function emitBackdropEffects(tokens: TokensFile, names: Set<string>): string {
  const lines: string[] = ['  /* Effects — background blur + glass (backdrop-filter) */'];
  for (const [styleName, layers] of Object.entries(tokens.effects ?? {})) {
    const base = cssVarName(styleName);
    for (const layer of layers) {
      if (layer.type === 'blur') {
        const name = (layer as EffectBlurLayer).backdrop ? base : `${base}-layer`;
        names.add(name);
        lines.push(`  ${name}: ${cssBlur(layer.radius)};`);
      } else if (layer.type === 'glass') {
        const { backdrop, edge } = glassCss(layer);
        names.add(`${base}-backdrop`);
        names.add(`${base}-edge`);
        lines.push(`  ${base}-backdrop: ${backdrop};`);
        lines.push(`  ${base}-edge: ${edge};`);
      }
    }
  }
  return lines.length > 1 ? lines.join('\n') : '';
}

export function generateTokensCss(tokens: TokensFile): string {
  const root = tokens as unknown as Tree;
  const sections = [
    emitGroup('Spacing', tokens.semantics.spacing, root, { prefix: 'spacing', unit: 'px' }),
    emitGroup('Size', tokens.semantics.size, root, { prefix: 'size', unit: 'px' }),
    emitGroup('Radius', tokens.semantics.radius, root, { prefix: 'radius', unit: 'px' }),
    emitGroup('Border weight', tokens.semantics['border-weight'], root, {
      prefix: 'border-weight',
      unit: 'px',
    }),
    emitGroup('Opacity', tokens.semantics.opacity, root, { prefix: 'opacity', unit: 'raw' }),
    emitColors('Colors — light mode (default)', tokens.colors.light, root),
  ];

  if (tokens.effects && Object.keys(tokens.effects).length > 0) {
    sections.push(emitEffects('Effects — shadows', tokens.effects));
  }

  // v0.4.0 sections — appended after the v0.3 output so existing vars keep
  // their exact text and order. `names` guards component-name collisions.
  const names = new Set<string>();
  for (const section of [
    emitExtraPrimitives(tokens, root, names),
    emitExtraSemantics(tokens, root, names),
    emitTypography(tokens, root, names),
    emitBackdropEffects(tokens, names),
    emitComponents(tokens, root, names),
  ]) {
    if (section) sections.push(section);
  }

  return [
    '/**',
    ' * Max Core design tokens — auto-generated. Do not edit by hand.',
    ` * Source: packages/tokens/src/tokens.json  (v${tokens.$version})`,
    ' */',
    '',
    ':root {',
    sections.join('\n\n'),
    '}',
    '',
    '[data-theme="dark"] {',
    emitColors('Colors — dark mode overrides', tokens.colors.dark, root),
    '}',
    '',
  ].join('\n');
}

/**
 * `theme.css` — the Tailwind v4 layer. Import it after `tailwindcss` and
 * `tokens.css`. It only ADDS names; where a Tailwind default name is reused
 * (`ease-in`, `ease-out`, `font-sans`, breakpoints) the Figma value is the same
 * as Tailwind's or replaces the hard-coded Inter, so nothing shifts.
 *
 * - `@theme`: `font-sans` / `font-brand`, `ease-*`, `shadow-*` + `inset-shadow-*`
 *   per effect style, `backdrop-blur-effect-*`, breakpoints, `max-w-*` containers.
 * - `type-*` utilities: one per text style (`type-h1` … `type-caption-xs`) —
 *   family, size, weight, line height, tracking, and Figma's cap-height trim
 *   (`text-box: trim-both cap alphabetic`; browsers without it keep the full
 *   line box, the pre-trim rendering).
 * - `glass-*` utilities: the backdrop + edge approximation of Figma's Glass.
 */
export function generateThemeCss(tokens: TokensFile): string {
  const root = tokens as unknown as Tree;
  const theme: string[] = [];
  const utilities: string[] = [];

  // Fonts — the families are runtime vars, so map them `inline`.
  const families = tokens.semantics['typeface-family'] ?? {};
  const inline: string[] = [];
  if ('base' in families) inline.push('  --font-sans: var(--typeface-family-base);');
  if ('brand' in families) inline.push('  --font-brand: var(--typeface-family-brand);');

  // Easing curves (motion/easing/*) and named shadows.
  const motion = (tokens.primitives.motion ?? {}) as Tree;
  for (const key of Object.keys((motion.easing ?? {}) as Tree)) {
    inline.push(`  --ease-${slug(key)}: var(--motion-easing-${slug(key)});`);
  }
  for (const [styleName, layers] of Object.entries(tokens.effects ?? {})) {
    const m = styleName.match(/^effect\/shadow\/(.+)$/);
    const hasShadow = layers.some((l) => l.type === undefined);
    if (m && hasShadow) {
      const key = slug(m[1]!);
      const isInset = layers.every((l) => l.type !== undefined || (l as EffectShadowLayer).inset);
      const ns = isInset ? '--inset-shadow' : '--shadow';
      inline.push(`  ${ns}-${key}: var(${cssVarName(styleName)});`);
    }
    const b = styleName.match(/^effect\/blur\/(.+)$/);
    if (b && layers.some((l) => l.type === 'blur')) {
      inline.push(`  --blur-effect-${slug(b[1]!)}: var(${cssVarName(styleName)});`);
    }
  }

  // Breakpoints and containers must be literal (media queries can't read vars).
  const bp = (tokens.primitives.breakpoint ?? {}) as Tree;
  for (const [key, value] of Object.entries(bp)) {
    const twKey = key === 'l' ? 'lg' : slug(key);
    theme.push(`  --breakpoint-${twKey}: ${formatValue(resolve(value, root), 'px')};`);
  }
  const containers = ((tokens.primitives.container ?? {}) as Tree).max as Tree | undefined;
  for (const [key, value] of Object.entries(containers ?? {})) {
    theme.push(`  --container-${slug(key)}: ${formatValue(resolve(value, root), 'px')};`);
  }

  for (const [styleName, t] of Object.entries(tokens.typography ?? {}) as [string, TypographyStyle][]) {
    const s = typeStyleSlug(styleName);
    const v = `--type-${s}`;
    utilities.push(
      [
        `@utility type-${s} {`,
        `  font-family: var(${v}-font-family);`,
        `  font-size: var(${v}-font-size);`,
        `  font-weight: var(${v}-font-weight);`,
        `  line-height: var(${v}-line-height);`,
        `  letter-spacing: var(${v}-letter-spacing);`,
        ...(t.leadingTrim === 'cap-height' ? ['  text-box: trim-both cap alphabetic;'] : []),
        '}',
      ].join('\n'),
    );
  }

  for (const [styleName, layers] of Object.entries(tokens.effects ?? {})) {
    if (!layers.some((l) => l.type === 'glass')) continue;
    const base = cssVarName(styleName);
    const name = slug(styleName.replace(/^effect\/glass\//, ''));
    const shadow = layers.some((l) => l.type === undefined)
      ? `var(${base}-edge), var(${base})`
      : `var(${base}-edge)`;
    utilities.push(
      [
        `@utility glass-${name} {`,
        `  -webkit-backdrop-filter: var(${base}-backdrop);`,
        `  backdrop-filter: var(${base}-backdrop);`,
        `  box-shadow: ${shadow};`,
        '}',
      ].join('\n'),
    );
  }

  return [
    '/**',
    ' * Max Core Tailwind v4 theme — auto-generated. Do not edit by hand.',
    ` * Source: packages/tokens/src/tokens.json  (v${tokens.$version})`,
    " * Use after: @import 'tailwindcss'; @import '@max-core/tokens/tokens.css';",
    ' */',
    '',
    ...(theme.length ? ['@theme {', ...theme, '}', ''] : []),
    ...(inline.length ? ['@theme inline {', ...inline, '}', ''] : []),
    utilities.join('\n\n'),
    '',
  ].join('\n');
}

/**
 * Resolve every colour token for one mode to its literal hex, keyed by the CSS
 * custom-property name it is emitted as (e.g. `--accent-subtle` → `#E0E7FF`).
 *
 * Same resolution the CSS transform performs, exposed for the contrast audit so
 * it can read the exact value a component's `var(--…)` binding resolves to in
 * light vs. dark mode. Additive — `generateTokensCss` is unchanged.
 */
export function resolveColorVars(tokens: TokensFile, mode: 'light' | 'dark'): Map<string, string> {
  const root = tokens as unknown as Tree;
  const out = new Map<string, string>();
  for (const [key, val] of Object.entries(tokens.colors[mode])) {
    out.set(cssVarName(key), String(resolve(val, root)));
  }
  return out;
}

export type { TokensFile } from './types.js';
