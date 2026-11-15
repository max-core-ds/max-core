/**
 * "Publish to GitHub": tokens.json → branch → commit (+ changeset) → pull request.
 *
 * Runs in the plugin UI iframe (browser fetch; api.github.com allows CORS with a
 * token). Only fetch / btoa / atob / TextEncoder, so it also runs under Node for tests.
 */
import {
  type TokenDiff,
  diffSize,
  diffSummary,
  diffTokens,
  formatDiffMarkdown,
  suggestedBump,
} from '../../tokens/src/diff';
import type { PublishSettings } from './messages';

export const API = 'https://api.github.com';

/** Published packages a Max Core changeset bumps (lockstep, so both). */
const PACKAGES = ['@max-core-ds/tokens', '@max-core-ds/react'];

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export interface Preview {
  diff: TokenDiff;
  /** Blob sha of the current tokens.json on the base branch (needed to update it). */
  fileSha: string;
  /** Head commit of the base branch the diff was taken against. */
  baseSha: string;
}

export interface PublishResult {
  url: string;
  number: number;
  branch: string;
}

type Log = (line: string) => void;

// ---- encoding (UTF-8 safe base64) ----
export function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

export function fromBase64(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Same formatting as `pnpm -F @max-core-ds/tokens sync` writes, so diffs stay value-only. */
export function serializeTokens(tokens: unknown): string {
  return `${JSON.stringify(tokens, null, 2)}\n`;
}

// ---- HTTP ----
function explain(status: number, s: PublishSettings, body: string): string {
  const repo = `${s.owner}/${s.repo}`;
  if (status === 401)
    return 'GitHub rejected the token (invalid or expired). Create a new one and save it in Settings.';
  if (status === 403 && /rate limit/i.test(body))
    return 'GitHub rate limit reached. Try again in a few minutes.';
  if (status === 403)
    return `The token can't write to ${repo}. It needs Contents and Pull requests: Read and write, on ${repo}.`;
  if (status === 404)
    return `Not found: check owner/repo (${repo}), branch "${s.base}" and path "${s.path}" in Settings, and that the token has access to ${repo}.`;
  const msg = /"message"\s*:\s*"([^"]+)"/.exec(body)?.[1];
  return `GitHub error ${status}${msg ? `: ${msg}` : ''}`;
}

async function gh<T>(s: PublishSettings, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${s.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new GitHubError(explain(res.status, s, text), res.status);
  return (text ? JSON.parse(text) : {}) as T;
}

const repoPath = (s: PublishSettings): string =>
  `/repos/${encodeURIComponent(s.owner)}/${encodeURIComponent(s.repo)}`;
const filePath = (p: string): string => p.split('/').map(encodeURIComponent).join('/');

export function validateSettings(s: PublishSettings): string | null {
  for (const k of ['owner', 'repo', 'base', 'path', 'token'] as const) {
    if (!s[k].trim()) return `Settings: "${k}" is empty.`;
  }
  return null;
}

// ---- steps ----
/** Diff the exported tokens against tokens.json on the base branch. */
export async function preview(s: PublishSettings, incoming: unknown): Promise<Preview> {
  const ref = await gh<{ object: { sha: string } }>(
    s,
    'GET',
    `${repoPath(s)}/git/ref/heads/${filePath(s.base)}`,
  );
  const file = await gh<{ sha: string; content?: string; encoding?: string }>(
    s,
    'GET',
    `${repoPath(s)}/contents/${filePath(s.path)}?ref=${encodeURIComponent(ref.object.sha)}`,
  );
  let current: unknown;
  if (file.content && file.encoding === 'base64') {
    current = JSON.parse(fromBase64(file.content));
  } else {
    // Files over 1 MB come back without inline content: fetch the blob.
    const blob = await gh<{ content: string }>(s, 'GET', `${repoPath(s)}/git/blobs/${file.sha}`);
    current = JSON.parse(fromBase64(blob.content));
  }
  return { diff: diffTokens(current, incoming), fileSha: file.sha, baseSha: ref.object.sha };
}

function stamp(d: Date): string {
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

/** Changeset text: the bump, Max's note, and the token names template projects need. */
export function changesetFile(diff: TokenDiff, note: string): string {
  const bump = suggestedBump(diff) ?? 'patch';
  const names = (label: string, list: { path: string }[]): string[] =>
    list.length
      ? [
          `${label}: ${list
            .slice(0, 15)
            .map((c) => `\`${c.path}\``)
            .join(', ')}${list.length > 15 ? ` and ${list.length - 15} more` : ''}.`,
        ]
      : [];
  const lines = [
    note.trim() || `Tokens exported from Figma (${diffSummary(diff)}).`,
    ...names('Added tokens', diff.added),
    ...names('Removed or renamed tokens', diff.removed),
  ];
  return `---\n${PACKAGES.map((p) => `'${p}': ${bump}`).join('\n')}\n---\n\n${lines.join('\n\n')}\n`;
}

async function createBranch(s: PublishSettings, baseSha: string, now: Date): Promise<string> {
  const name = `figma/tokens-${stamp(now)}`;
  for (let i = 0; i < 5; i++) {
    const branch = i ? `${name}-${i + 1}` : name;
    try {
      await gh(s, 'POST', `${repoPath(s)}/git/refs`, { ref: `refs/heads/${branch}`, sha: baseSha });
      return branch;
    } catch (err) {
      // 422 = branch already exists (two publishes in the same minute): add a suffix.
      if (!(err instanceof GitHubError) || err.status !== 422) throw err;
    }
  }
  throw new Error(`Could not create a branch named ${name}-*`);
}

/** Branch → commit tokens.json (+ changeset) → open the PR. */
export async function publish(
  s: PublishSettings,
  incoming: unknown,
  p: Preview,
  note: string,
  log: Log = () => {},
  now = new Date(),
): Promise<PublishResult> {
  if (!diffSize(p.diff)) throw new Error('No token changes to publish.');
  const summary = diffSummary(p.diff);

  log('Creating branch…');
  const branch = await createBranch(s, p.baseSha, now);

  log(`Committing ${s.path}…`);
  await gh(s, 'PUT', `${repoPath(s)}/contents/${filePath(s.path)}`, {
    message: `chore(tokens): export from Figma (${summary})`,
    content: toBase64(serializeTokens(incoming)),
    sha: p.fileSha,
    branch,
  });

  if (s.changeset) {
    log('Adding changeset…');
    await gh(s, 'PUT', `${repoPath(s)}/contents/.changeset/figma-tokens-${stamp(now)}.md`, {
      message: 'chore(tokens): changeset for the Figma export',
      content: toBase64(changesetFile(p.diff, note)),
      branch,
    });
  }

  log('Opening pull request…');
  const title = note.trim().split('\n')[0]?.slice(0, 72) || `Tokens from Figma: ${summary}`;
  let body = [
    note.trim() ? `${note.trim()}\n` : '',
    formatDiffMarkdown(p.diff, { title: 'Token diff (from the Figma plugin)', limit: 60 }),
    '',
    '---',
    '<sub>Opened by the Max Core Figma plugin. CI runs build, typecheck, lint and drift; merge when `ci` is green.</sub>',
  ].join('\n');
  if (body.length > 60000)
    body = `${body.slice(0, 60000)}\n\n… (truncated — see the CI diff comment)`;
  const pr = await gh<{ html_url: string; number: number }>(s, 'POST', `${repoPath(s)}/pulls`, {
    title,
    head: branch,
    base: s.base,
    body,
  });
  return { url: pr.html_url, number: pr.number, branch };
}
