/**
 * Token contract — the CSS custom properties `@max-core-ds/react` reads from the
 * token stylesheets. Shipped as `dist/contract.json`; versions are lockstep, so a
 * given tokens release carries the contract of the matching react release.
 *
 * A template project (own Figma copy, own tokens.json) must define every var in
 * it, or the components silently lose values. `max-core-tokens build --input`
 * fails with the missing names.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { LIBRARY_VAR_PREFIXES, definedVarsIn, localVarsIn, usedVarsIn } from './conformance.js';

export interface TokenContract {
  /** The package version this contract was built for. */
  version: string;
  /** Sorted var names, e.g. `--spacing-16`. */
  vars: string[];
}

/** Component sources under react/src (stories and tests excluded). */
export function reactSourceFiles(reactSrc: string): string[] {
  const files: string[] = [];
  const walk = (dir: string): void => {
    for (const f of readdirSync(dir)) {
      const p = resolve(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|css)$/.test(f) && !/\.(stories|test)\.tsx?$/.test(f)) files.push(p);
    }
  };
  walk(reactSrc);
  return files;
}

/** Vars the react sources read that the token stylesheets define. */
export function buildContract(reactSrc: string, tokenCss: string, version: string): TokenContract {
  const defined = definedVarsIn(tokenCss);
  const sources = reactSourceFiles(reactSrc).map((f) => readFileSync(f, 'utf8'));
  const local = new Set(sources.flatMap((s) => [...localVarsIn(s)]));
  const vars = new Set<string>();
  for (const src of sources) {
    for (const v of usedVarsIn(src)) {
      if (local.has(v) || LIBRARY_VAR_PREFIXES.some((p) => v.startsWith(p))) continue;
      if (defined.has(v)) vars.add(v);
    }
  }
  return { version, vars: [...vars].sort() };
}

/** Contract vars the given stylesheet(s) don't define. */
export function missingFromContract(contract: TokenContract, tokenCss: string): string[] {
  const defined = definedVarsIn(tokenCss);
  return contract.vars.filter((v) => !defined.has(v));
}
