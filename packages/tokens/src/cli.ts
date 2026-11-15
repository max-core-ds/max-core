#!/usr/bin/env node
/**
 * max-core-tokens — generate the token stylesheets.
 *
 *   max-core-tokens build                         this repo: src/tokens.json → dist/ (+ contract.json)
 *   max-core-tokens build --input t.json --out d  template project: own tokens.json → d/tokens.css + d/theme.css,
 *                                                 then checks the token contract (exit 1 on missing vars)
 *   max-core-tokens check --input t.json          contract check only, writes nothing
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type TokenContract, buildContract, missingFromContract } from './contract.js';
import { generateThemeCss, generateTokensCss } from './transform.js';
import type { TokensFile } from './types.js';

// Runs from src/ (tsx) or dist/ (compiled bin); the package root is one up either way.
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8')) as {
  version: string;
};

const args = process.argv.slice(2);
const command = args[0]?.startsWith('--') || args[0] === undefined ? 'build' : args[0];
function flag(name: string): string | undefined {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
}
const input = flag('--input');
const out = flag('--out');

if (command !== 'build' && command !== 'check') {
  console.error(`Unknown command "${command}". Use: build | check`);
  process.exit(2);
}

function readTokens(path: string): TokensFile {
  if (!existsSync(path)) {
    console.error(`✗ ${path} not found`);
    process.exit(2);
  }
  return JSON.parse(readFileSync(path, 'utf8')) as TokensFile;
}

function writeCss(tokens: TokensFile, outDir: string): { css: string; themeCss: string } {
  const css = generateTokensCss(tokens);
  const themeCss = generateThemeCss(tokens);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'tokens.css'), css, 'utf8');
  writeFileSync(resolve(outDir, 'theme.css'), themeCss, 'utf8');
  const vars = (css.match(/^\s*--/gm) ?? []).length;
  const utilities = (themeCss.match(/^@utility /gm) ?? []).length;
  console.log(`✓ ${resolve(outDir, 'tokens.css')} (${vars} variables)`);
  console.log(`✓ ${resolve(outDir, 'theme.css')} (${utilities} utilities)`);
  return { css, themeCss };
}

// ---- this repo: src/tokens.json → dist/ ----
if (!input) {
  if (command === 'check') {
    console.error('check needs --input <tokens.json>');
    process.exit(2);
  }
  const srcDir = resolve(packageRoot, 'src');
  const outDir = resolve(packageRoot, 'dist');
  const tokens = readTokens(resolve(srcDir, 'tokens.json'));
  const { css, themeCss } = writeCss(tokens, outDir);
  copyFileSync(resolve(srcDir, 'tokens.json'), resolve(outDir, 'tokens.json'));
  // Hand-authored static utilities (e.g. .styled-scrollbar) ship alongside.
  copyFileSync(resolve(srcDir, 'scrollbar.css'), resolve(outDir, 'scrollbar.css'));

  const reactSrc = resolve(packageRoot, '../react/src');
  if (existsSync(reactSrc)) {
    const contract = buildContract(reactSrc, `${css}\n${themeCss}`, pkg.version);
    writeFileSync(resolve(outDir, 'contract.json'), `${JSON.stringify(contract, null, 2)}\n`);
    console.log(
      `✓ ${resolve(outDir, 'contract.json')} (${contract.vars.length} vars used by react)`,
    );
  }
  process.exit(0);
}

// ---- template project: own tokens.json ----
const tokens = readTokens(resolve(input));
const generated =
  command === 'build'
    ? writeCss(tokens, resolve(out ?? 'max-core-tokens'))
    : { css: generateTokensCss(tokens), themeCss: generateThemeCss(tokens) };

const contractPath = resolve(packageRoot, 'dist/contract.json');
if (!existsSync(contractPath)) {
  console.warn('! No contract.json in this @max-core-ds/tokens install — skipping the check.');
  process.exit(0);
}
const contract = JSON.parse(readFileSync(contractPath, 'utf8')) as TokenContract;
const missing = missingFromContract(contract, `${generated.css}\n${generated.themeCss}`);
if (missing.length) {
  console.error(
    `\n✗ ${missing.length} token var(s) used by @max-core-ds/react ${contract.version} are missing from ${input}:`,
  );
  for (const v of missing) console.error(`    ${v}`);
  console.error('\n  Add the matching variables to your Figma copy and re-export.');
  process.exit(1);
}
console.log(
  `✓ Token contract OK (${contract.vars.length} vars, @max-core-ds/react ${contract.version})`,
);
