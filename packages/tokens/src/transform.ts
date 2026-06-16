/**
 * Pure transform: tokens.json → CSS variables string.
 *
 * Resolves the Primitives → Semantics → Colors cascade and emits color
 * variables under `:root` plus a `[data-theme="dark"]` override block.
 */

import type { EffectShadowLayer, TokensFile, Tree } from './types.js';

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
function emitEffects(comment: string, effects: Record<string, EffectShadowLayer[]>): string {
  const lines: string[] = [`  /* ${comment} */`];
  for (const [name, layers] of Object.entries(effects)) {
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

export type { TokensFile } from './types.js';
