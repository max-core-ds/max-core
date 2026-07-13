/**
 * Drift-check conformance: assert that a React component actually binds the
 * dimensional semantic tokens the Figma `components` block mandates for it.
 *
 * D1 decided components read *semantic* CSS vars directly (no Component-level
 * vars are emitted), so the 414-token `components` block earns its keep as the
 * spec source for this check: designer changes a token in Figma → the export
 * updates → this check fails if the code didn't follow.
 *
 * Scope: spacing / size / radius only. Border-weight is intentionally excluded
 * (code expresses it via Tailwind's `border` / `border-2` utilities, not a
 * `var(--border-weight-*)` binding), and raw numbers + `{primitives.*}` refs
 * have no semantic var to bind. Each component may additionally exempt vars for
 * features it does not implement (e.g. an avatar status dot), with a reason.
 */

import type { TokensFile } from './types.js';

/** Semantic groups we hold code accountable for binding. */
const CHECKED_GROUPS = ['spacing', 'size', 'radius'] as const;

/** Resolve a `components` value to its semantic CSS var, or null if not a checked ref. */
export function refToVar(value: unknown): string | null {
  if (typeof value !== 'string') return null; // raw number
  const m = value.match(/^\{semantics\.([a-z-]+)\.([^}]+)\}$/);
  if (!m) return null; // {primitives.*} or non-ref
  const [, group, key] = m;
  if (!group || !key) return null;
  return (CHECKED_GROUPS as readonly string[]).includes(group) ? `--${group}-${key}` : null;
}

export interface ComponentSpec {
  /** Component display name (used in the family→component report). */
  name: string;
  /**
   * Path(s) to the source that binds this component's tokens, relative to the
   * react package `src/`. Use an array when the bindings live partly in a shared
   * util (e.g. Progress Bar's track heights in utils/progress.ts).
   */
  source: string | string[];
  /** `components` key prefixes this component owns (leading `-- ` stripped). */
  prefixes: string[];
  /** Vars intentionally not bound — pair each with a reason in the caller. */
  exempt?: string[];
}

export interface DriftResult {
  name: string;
  /** Mandated dim vars the component fails to bind (excluding exempt). */
  missing: string[];
  /** Dim vars bound in code that the spec does not mandate for this component. */
  extra: string[];
  spec: string[];
  ok: boolean;
}

/** Collect the mandated dimensional vars for one component from the tokens file. */
export function specVarsFor(tokens: TokensFile, spec: ComponentSpec): Set<string> {
  const comps = tokens.components ?? {};
  const out = new Set<string>();
  for (const [rawKey, value] of Object.entries(comps)) {
    const key = rawKey.replace(/^--\s*/, '');
    if (!spec.prefixes.some((p) => key.startsWith(p))) continue;
    const v = refToVar(value);
    if (v) out.add(v);
  }
  return out;
}

/** Extract every `var(--…)` dimensional binding from component source text. */
export function boundVarsIn(source: string): Set<string> {
  const out = new Set<string>();
  for (const m of source.matchAll(/var\((--(?:spacing|size|radius)-[a-zA-Z0-9-]+)\)/g)) {
    if (m[1]) out.add(m[1]);
  }
  return out;
}

export function checkComponent(
  tokens: TokensFile,
  spec: ComponentSpec,
  source: string,
): DriftResult {
  const specVars = specVarsFor(tokens, spec);
  const bound = boundVarsIn(source);
  const exempt = new Set(spec.exempt ?? []);
  const missing = [...specVars].filter((v) => !bound.has(v) && !exempt.has(v)).sort();
  const extra = [...bound].filter((v) => !specVars.has(v)).sort();
  return { name: spec.name, missing, extra, spec: [...specVars].sort(), ok: missing.length === 0 };
}
