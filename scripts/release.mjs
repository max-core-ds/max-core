#!/usr/bin/env node
/**
 * Local release: pending changesets → versions → gate → commit → publish to GitHub Packages.
 *
 *   GITHUB_PACKAGES_TOKEN=… pnpm release              # full release
 *   GITHUB_PACKAGES_TOKEN=… pnpm release --publish-only   # retry a failed publish (versions already committed)
 *
 * The token is a classic PAT with write:packages (+ read:packages). It is only written to a
 * temporary npmrc for the publish step and deleted afterwards — never into the repo.
 * Pushing stays manual: the script prints the push command at the end.
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REGISTRY = 'https://npm.pkg.github.com';
const SCOPE = '@max-core-ds';
const publishOnly = process.argv.includes('--publish-only');

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const out = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();
const step = (msg) => console.log(`\n▶ ${msg}`);
const fail = (msg) => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};
const version = () => JSON.parse(readFileSync('packages/react/package.json', 'utf8')).version;

// ---- preflight ----
step('Preflight');
const token = process.env.GITHUB_PACKAGES_TOKEN;
if (!token) fail('GITHUB_PACKAGES_TOKEN is not set (classic PAT with write:packages).');
if (out('git rev-parse --abbrev-ref HEAD') !== 'main') fail('Release from main only.');
if (out('git status --porcelain --untracked-files=no'))
  fail('Working tree has uncommitted changes to tracked files. Commit or stash them first.');
sh('git fetch -q origin main');
if (out('git rev-list --count HEAD..origin/main') !== '0')
  fail('origin/main has commits you do not have. Pull first.');

const pending = readdirSync('.changeset').filter((f) => f.endsWith('.md') && f !== 'README.md');
if (!publishOnly && !pending.length) fail('No pending changesets. Add one with `pnpm changeset`.');
console.log(publishOnly ? 'publish-only' : `${pending.length} pending changeset(s)`);

// ---- version ----
if (!publishOnly) {
  step('changeset version');
  sh('pnpm exec changeset version');
  sh('pnpm install --lockfile-only --silent');
  console.log(`→ ${version()}`);
}

// ---- gate (same as CI) ----
step('Gate: build · typecheck · lint · drift');
sh('pnpm build');
sh('pnpm typecheck');
sh('pnpm lint');
sh('pnpm -F @max-core-ds/tokens drift');

// ---- commit ----
const v = version();
if (!publishOnly) {
  step(`Commit v${v}`);
  sh('git add -A .changeset packages pnpm-lock.yaml');
  sh(`git commit -q -m "chore(release): v${v}"`);
}

// ---- publish ----
step(`Publish v${v} to ${REGISTRY}`);
const dir = mkdtempSync(join(tmpdir(), 'max-core-release-'));
const npmrc = join(dir, '.npmrc');
writeFileSync(npmrc, `${SCOPE}:registry=${REGISTRY}\n//npm.pkg.github.com/:_authToken=${token}\n`, {
  mode: 0o600,
});
try {
  // changeset publish skips versions already on the registry and tags what it publishes.
  sh('pnpm exec changeset publish', { env: { ...process.env, npm_config_userconfig: npmrc } });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
sh(`git tag -a v${v} -m "v${v}"`);

console.log(`\n✓ Released v${v}.`);
console.log('  Push the release commit and tags:  git push --follow-tags origin main');
console.log('  Packages: https://github.com/orgs/max-core-ds/packages');
