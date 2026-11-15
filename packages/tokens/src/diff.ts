/**
 * Token diff: what changed between two tokens.json files.
 *
 * Pure (no Node APIs). It's used by `sync` (console), the `diff` CLI (the CI PR
 * comment) and bundled into the Figma plugin (the Publish preview + PR body).
 */

export interface TokenChange {
  /** Dotted path, e.g. `semantics.spacing.16` or `components.-- Atoms/Avatar/Size XS/Size`. */
  path: string;
  before?: unknown;
  after?: unknown;
}

export interface TokenDiff {
  added: TokenChange[];
  removed: TokenChange[];
  changed: TokenChange[];
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Leaves by path. `$`-keys are metadata (version, export date) and skipped. Arrays are leaves. */
function leaves(node: unknown, prefix: string, out: Map<string, unknown>): Map<string, unknown> {
  if (!isObject(node)) {
    if (prefix) out.set(prefix, node);
    return out;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    leaves(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

export function diffTokens(before: unknown, after: unknown): TokenDiff {
  const a = leaves(before, '', new Map());
  const b = leaves(after, '', new Map());
  const diff: TokenDiff = { added: [], removed: [], changed: [] };
  for (const [path, value] of b) {
    if (!a.has(path)) diff.added.push({ path, after: value });
    else if (JSON.stringify(a.get(path)) !== JSON.stringify(value))
      diff.changed.push({ path, before: a.get(path), after: value });
  }
  for (const [path, value] of a) if (!b.has(path)) diff.removed.push({ path, before: value });
  return diff;
}

export function diffSize(d: TokenDiff): number {
  return d.added.length + d.removed.length + d.changed.length;
}

/** One-line summary: `+3 added · −1 removed · ~12 changed`. */
export function diffSummary(d: TokenDiff): string {
  return `+${d.added.length} added · −${d.removed.length} removed · ~${d.changed.length} changed`;
}

/**
 * Suggested Changesets bump. Removing a token can break a template project
 * (or react, which drift catches), so it is a minor below 1.0; values only = patch.
 */
export function suggestedBump(d: TokenDiff): 'minor' | 'patch' | null {
  if (!diffSize(d)) return null;
  return d.removed.length ? 'minor' : 'patch';
}

function show(v: unknown): string {
  return typeof v === 'string' ? v : JSON.stringify(v);
}

function section(path: string): string {
  const [top, sub] = path.split('.');
  return top === 'colors' && sub ? `colors.${sub}` : (top ?? path);
}

/** Console report (sync). */
export function formatDiffText(d: TokenDiff, limit = 10): string {
  const lines = [diffSummary(d)];
  const block = (title: string, items: TokenChange[], line: (c: TokenChange) => string): void => {
    if (!items.length) return;
    lines.push('', `${title} (showing first ${Math.min(limit, items.length)}):`);
    for (const c of items.slice(0, limit)) lines.push(`  ${line(c)}`);
    if (items.length > limit) lines.push(`  … and ${items.length - limit} more`);
  };
  block('Added', d.added, (c) => `+ ${c.path}`);
  block('Removed', d.removed, (c) => `- ${c.path}`);
  block('Changed', d.changed, (c) => `~ ${c.path}: ${show(c.before)} → ${show(c.after)}`);
  return lines.join('\n');
}

/** Markdown report (PR comment / PR body). */
export function formatDiffMarkdown(
  d: TokenDiff,
  opts: { title?: string; limit?: number } = {},
): string {
  const { title = 'Token diff', limit = 100 } = opts;
  const lines = [`### ${title}`, ''];
  if (!diffSize(d)) {
    lines.push('No token changes.');
    return lines.join('\n');
  }
  lines.push(`**${diffSummary(d)}**`, '');

  const counts = new Map<string, [number, number, number]>();
  const bump = (list: TokenChange[], i: 0 | 1 | 2): void => {
    for (const c of list) {
      const row = counts.get(section(c.path)) ?? [0, 0, 0];
      row[i] += 1;
      counts.set(section(c.path), row);
    }
  };
  bump(d.added, 0);
  bump(d.removed, 1);
  bump(d.changed, 2);
  lines.push('| Section | Added | Removed | Changed |', '|---|---:|---:|---:|');
  for (const [name, [a, r, c]] of [...counts].sort())
    lines.push(`| \`${name}\` | ${a || ''} | ${r || ''} | ${c || ''} |`);

  const esc = (s: string): string => s.replace(/\|/g, '\\|').replace(/`/g, "'");
  const details = (
    label: string,
    items: TokenChange[],
    cols: string,
    row: (c: TokenChange) => string,
  ): void => {
    if (!items.length) return;
    lines.push(
      '',
      `<details${items.length <= 20 ? ' open' : ''}><summary>${label} (${items.length})</summary>`,
      '',
    );
    lines.push(cols, cols.replace(/[^|]+/g, '---'));
    for (const c of items.slice(0, limit)) lines.push(row(c));
    if (items.length > limit) lines.push('', `… and ${items.length - limit} more.`);
    lines.push('', '</details>');
  };
  details(
    'Removed',
    d.removed,
    '| Token | Was |',
    (c) => `| \`${esc(c.path)}\` | \`${esc(show(c.before))}\` |`,
  );
  details(
    'Changed',
    d.changed,
    '| Token | Before | After |',
    (c) => `| \`${esc(c.path)}\` | \`${esc(show(c.before))}\` | \`${esc(show(c.after))}\` |`,
  );
  details(
    'Added',
    d.added,
    '| Token | Value |',
    (c) => `| \`${esc(c.path)}\` | \`${esc(show(c.after))}\` |`,
  );

  const b = suggestedBump(d);
  if (d.removed.length)
    lines.push(
      '',
      `> ⚠️ ${d.removed.length} token(s) removed or renamed. Drift fails if react still uses them; template projects must update their Figma copy. Suggested bump: **${b}**.`,
    );
  else lines.push('', `Suggested bump: **${b}**.`);
  return lines.join('\n');
}
