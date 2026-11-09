/**
 * Pure colour-contrast conformance: assert that the text/background colour
 * *pairings* a component renders meet WCAG AA in BOTH light and dark mode.
 *
 * The `Max Core - Colors` collection carries only per-token light/dark *values*,
 * never the rule of which text token belongs on which background. That pairing
 * rule lives in component code (Tailwind `text-[var(--…)]` / `bg-[var(--…)]`),
 * so a bad pairing — e.g. white `text/on-accent` on the pale light-mode
 * `accent/subtle` fill — is invisible to the dimensional drift check. This
 * module resolves each pairing to hex per mode and flags the ones that fail.
 *
 * Companion to `conformance.ts` (dimensional drift); consumed by the
 * `contrast-audit.ts` runner the same way `drift.ts` consumes `conformance.ts`.
 */

/** WCAG AA contrast thresholds. */
export const AA_NORMAL = 4.5;
export const AA_LARGE = 3.0;

/** RGB channels 0–255 plus straight alpha 0–1 (1 when the hex has no alpha). */
export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Parse `#RGB`, `#RRGGBB`, or `#RRGGBBAA` to channels + alpha. */
export function hexToRgba(hex: string): Rgba {
  const h = hex.trim().replace(/^#/, '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  if (full.length !== 6 && full.length !== 8) {
    throw new Error(`Not a hex colour: ${hex}`);
  }
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  const a = full.length === 8 ? Number.parseInt(full.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

/** WCAG relative luminance of an opaque colour. */
export function relativeLuminance({ r, g, b }: Rgba): number {
  const lin = (c: number) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio (1–21) between two opaque hex colours. */
export function contrastRatio(fgHex: string, bgHex: string): number {
  const l1 = relativeLuminance(hexToRgba(fgHex));
  const l2 = relativeLuminance(hexToRgba(bgHex));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** A text-on-background colour pairing, addressed by CSS var name. */
export interface Pairing {
  /** State the pairing is rendered in (`base`, `hover`, `active`, …). */
  state: string;
  /** Text colour CSS var, e.g. `--text-on-accent`. */
  fgVar: string;
  /** Background colour CSS var, e.g. `--accent-subtle`. */
  bgVar: string;
  /** Large text (≥24px, or ≥18.66px bold) → the 3:1 threshold applies. */
  largeText?: boolean;
}

/**
 * Extract candidate text/background pairings from a component's source.
 *
 * Works one string literal at a time — a single `cva`/variant class string is
 * the granularity at which a text and a background colour genuinely land on the
 * same element (e.g. `'bg-[var(--accent-default)] text-[var(--text-on-accent)]'`).
 * Pairing across the whole file would cross a ghost variant's background with a
 * primary variant's text, which never co-render. Within each literal, utilities
 * are bucketed by state variant (the last `foo:` prefix, or `base` when
 * unprefixed) and each state's backgrounds are paired with its effective text —
 * the state's own text, or the literal's base text when the state only swaps
 * the background (the ListItem hover shape).
 *
 * Still a heuristic: a text on a background set in a *different* literal (child
 * text over a parent surface) is invisible here — the audit's per-component
 * spec adds those and exempts false positives.
 */
export function extractPairings(source: string): Pairing[] {
  const seen = new Set<string>();
  const pairings: Pairing[] = [];
  // Each quoted / backtick-quasi chunk is treated as one element's class list.
  // Strip comments first: an apostrophe in a comment ("doesn't") would open a
  // fake literal and shift every class list after it out of alignment. Line
  // comments go first, so a token path like `Molecule/Pin/*` in one isn't read
  // as the start of a block comment.
  const code = source.replace(/(^|[^:])\/\/.*$/gm, '$1').replace(/\/\*[\s\S]*?\*\//g, '');
  const literals = code.match(/(['"`])(?:\\.|(?!\1)[\s\S])*?\1/g) ?? [];
  for (const literal of literals) {
    if (!literal.includes('-[var(--') && !literal.includes('-(--')) continue;
    pairFromLiteral(literal, seen, pairings);
  }
  return pairings;
}

function pairFromLiteral(literal: string, seen: Set<string>, out: Pairing[]): void {
  // Both the arbitrary-value form `bg-[var(--x)]` and the v4 shorthand `bg-(--x)`.
  const re =
    /(?:([a-z][a-z0-9-]*(?:\[[^\]]*\])?):)?(text|bg)-(?:\[var\((--[a-z0-9-]+)\)\]|\((--[a-z0-9-]+)\))/gi;
  const buckets = new Map<string, { fg: Set<string>; bg: Set<string> }>();
  for (const m of literal.matchAll(re)) {
    const state = m[1] ?? 'base';
    const kind = m[2] as 'text' | 'bg';
    const varName = (m[3] ?? m[4]) as string;
    let bucket = buckets.get(state);
    if (!bucket) {
      bucket = { fg: new Set(), bg: new Set() };
      buckets.set(state, bucket);
    }
    (kind === 'text' ? bucket.fg : bucket.bg).add(varName);
  }

  const baseFg = buckets.get('base')?.fg ?? new Set<string>();
  for (const [state, { fg, bg }] of buckets) {
    if (bg.size === 0) continue; // no background introduced in this state
    const effectiveFg = fg.size > 0 ? fg : baseFg;
    for (const bgVar of bg) {
      for (const fgVar of effectiveFg) {
        const id = `${state}|${fgVar}|${bgVar}`;
        if (seen.has(id)) continue;
        seen.add(id);
        out.push({ state, fgVar, bgVar });
      }
    }
  }
}

/** One failing pairing, with the ratio in each mode that broke the threshold. */
export interface ContrastViolation {
  state: string;
  fgVar: string;
  bgVar: string;
  threshold: number;
  lightRatio: number | null;
  darkRatio: number | null;
  /** Modes whose ratio is below `threshold`. */
  failsIn: ('light' | 'dark')[];
}

export interface CheckOptions {
  /** Var names to skip as a colour role that is never solid text-on-fill. */
  ignoreVars?: Set<string>;
}

function ratioFor(fgVar: string, bgVar: string, map: Map<string, string>): number | null {
  const fg = map.get(fgVar);
  const bg = map.get(bgVar);
  if (fg === undefined || bg === undefined) return null;
  // Skip semi-transparent fills/text (overlays, state layers) — not a solid
  // text-on-fill pairing; compositing would need the underlying surface.
  if (hexToRgba(fg).a < 1 || hexToRgba(bg).a < 1) return null;
  return contrastRatio(fg, bg);
}

/**
 * Check pairings against both modes. A pairing fails if either mode resolves to
 * two solid colours whose ratio is below its threshold (3:1 large, else 4.5:1).
 */
export function checkContrast(
  pairings: Pairing[],
  lightMap: Map<string, string>,
  darkMap: Map<string, string>,
  opts: CheckOptions = {},
): ContrastViolation[] {
  const ignore = opts.ignoreVars ?? new Set<string>();
  const violations: ContrastViolation[] = [];
  for (const p of pairings) {
    if (ignore.has(p.fgVar) || ignore.has(p.bgVar)) continue;
    const threshold = p.largeText ? AA_LARGE : AA_NORMAL;
    const lightRatio = ratioFor(p.fgVar, p.bgVar, lightMap);
    const darkRatio = ratioFor(p.fgVar, p.bgVar, darkMap);
    const failsIn: ('light' | 'dark')[] = [];
    if (lightRatio !== null && lightRatio < threshold) failsIn.push('light');
    if (darkRatio !== null && darkRatio < threshold) failsIn.push('dark');
    if (failsIn.length > 0) {
      violations.push({ ...p, threshold, lightRatio, darkRatio, failsIn });
    }
  }
  return violations;
}
