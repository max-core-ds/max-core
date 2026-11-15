/**
 * Plugin UI (iframe). Bundled by esbuild and inlined into dist/ui.html.
 * Download = the original export. Publish = preview the diff against GitHub,
 * then open a PR (src/github.ts).
 */
import { diffSize, diffSummary, formatDiffText } from '../../tokens/src/diff';
import { type Preview, preview, publish, validateSettings } from './github';
import { DEFAULT_SETTINGS, type PublishSettings } from './messages';

declare const __PLUGIN_VERSION__: string;

interface Counts {
  primitives: number;
  semantics: number;
  light: number;
  dark: number;
  components: number;
  typography: number;
  effects: number;
}

type FromPlugin =
  | {
      type: 'tokens';
      purpose: 'download' | 'publish';
      payload: unknown;
      counts: Counts;
      warnings: string[];
    }
  | { type: 'settings'; settings: PublishSettings | null }
  | { type: 'settings-saved' }
  | { type: 'status'; text: string }
  | { type: 'error'; message: string };

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const post = (msg: Record<string, unknown>): void =>
  parent.postMessage({ pluginMessage: msg }, '*');

const statusEl = $('status');
const noteRow = $('note-row');
const noteEl = $<HTMLTextAreaElement>('note');
const settingsEl = $('settings');
const mainEl = $('main');
const btn = {
  download: $<HTMLButtonElement>('download'),
  publish: $<HTMLButtonElement>('publish'),
  confirm: $<HTMLButtonElement>('confirm'),
  back: $<HTMLButtonElement>('back'),
  openPr: $<HTMLButtonElement>('open-pr'),
  settings: $<HTMLButtonElement>('open-settings'),
  save: $<HTMLButtonElement>('save-settings'),
  closeSettings: $<HTMLButtonElement>('close-settings'),
};
const field = {
  owner: $<HTMLInputElement>('s-owner'),
  repo: $<HTMLInputElement>('s-repo'),
  base: $<HTMLInputElement>('s-base'),
  path: $<HTMLInputElement>('s-path'),
  token: $<HTMLInputElement>('s-token'),
  changeset: $<HTMLInputElement>('s-changeset'),
};

$('version').textContent = `v${__PLUGIN_VERSION__}`;

let settings: PublishSettings = { ...DEFAULT_SETTINGS };
let pending: { tokens: unknown; preview: Preview } | null = null;
let prUrl = '';

function fit(): void {
  post({ type: 'resize', height: document.body.scrollHeight + 4 });
}

function setStatus(text: string, kind: 'info' | 'error' | 'ok' = 'info'): void {
  statusEl.textContent = text;
  statusEl.dataset.kind = kind;
  fit();
}

/** Which buttons show: idle → (publish) review → done. */
function mode(m: 'idle' | 'busy' | 'review' | 'done'): void {
  const show = (el: HTMLElement, on: boolean): void => {
    el.hidden = !on;
  };
  show(btn.download, m === 'idle' || m === 'busy' || m === 'done');
  show(btn.publish, m === 'idle' || m === 'busy' || m === 'done');
  show(btn.confirm, m === 'review');
  show(btn.back, m === 'review');
  show(btn.openPr, m === 'done' && !!prUrl);
  show(noteRow, m === 'review');
  for (const b of [btn.download, btn.publish, btn.confirm, btn.settings]) b.disabled = m === 'busy';
  fit();
}

function countsText(c: Counts): string {
  return `${c.primitives} primitives · ${c.semantics} semantics · ${c.light}/${c.dark} colours · ${c.components} components · ${c.typography} text styles · ${c.effects} effects`;
}

function warningsText(w: string[]): string {
  return w.length ? `\n\n⚠ ${w.length} export warning(s):\n  ${w.join('\n  ')}` : '';
}

function download(payload: unknown, counts: Counts, warnings: string[]): void {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tokens.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setStatus(`✓ Downloaded tokens.json\n${countsText(counts)}${warningsText(warnings)}`, 'ok');
  mode('idle');
}

async function startPreview(tokens: unknown, counts: Counts, warnings: string[]): Promise<void> {
  try {
    setStatus(`Comparing with ${settings.owner}/${settings.repo}@${settings.base}…`);
    const p = await preview(settings, tokens);
    if (!diffSize(p.diff)) {
      setStatus(
        `✓ Already up to date — Figma matches ${settings.path} on ${settings.base}.${warningsText(warnings)}`,
        'ok',
      );
      mode('idle');
      return;
    }
    pending = { tokens, preview: p };
    setStatus(
      `${diffSummary(p.diff)} vs ${settings.base}\n\n${formatDiffText(p.diff, 8)}\n\n${countsText(counts)}${warningsText(warnings)}`,
    );
    mode('review');
    noteEl.focus();
  } catch (err) {
    setStatus(`✗ ${(err as Error).message}`, 'error');
    mode('idle');
  }
}

async function confirmPublish(): Promise<void> {
  if (!pending) return;
  const { tokens, preview: p } = pending;
  mode('busy');
  try {
    const pr = await publish(settings, tokens, p, noteEl.value, (line) => setStatus(line));
    prUrl = pr.url;
    pending = null;
    noteEl.value = '';
    setStatus(
      `✓ Pull request #${pr.number} opened\n${pr.url}\n\nBranch ${pr.branch}. CI is checking it; it gets merged when the ci check is green.`,
      'ok',
    );
    post({ type: 'notify', text: `Pull request #${pr.number} opened` });
    mode('done');
  } catch (err) {
    setStatus(`✗ ${(err as Error).message}`, 'error');
    mode('review');
  }
}

// ---- settings ----
function fillSettings(s: PublishSettings): void {
  field.owner.value = s.owner;
  field.repo.value = s.repo;
  field.base.value = s.base;
  field.path.value = s.path;
  field.token.value = s.token;
  field.changeset.checked = s.changeset;
}

function readSettings(): PublishSettings {
  return {
    owner: field.owner.value.trim(),
    repo: field.repo.value.trim(),
    base: field.base.value.trim(),
    path: field.path.value.trim().replace(/^\/+/, ''),
    token: field.token.value.trim(),
    changeset: field.changeset.checked,
  };
}

function showSettings(on: boolean): void {
  settingsEl.hidden = !on;
  mainEl.hidden = on;
  if (on) fillSettings(settings);
  fit();
}

// ---- events ----
btn.download.onclick = () => {
  mode('busy');
  setStatus('Exporting…');
  post({ type: 'export', purpose: 'download' });
};

btn.publish.onclick = () => {
  const problem = validateSettings(settings);
  if (problem) {
    setStatus(`${problem}\nOpen Settings to add the GitHub repo and token.`, 'error');
    return;
  }
  prUrl = '';
  mode('busy');
  setStatus('Exporting…');
  post({ type: 'export', purpose: 'publish' });
};

btn.confirm.onclick = () => void confirmPublish();
btn.back.onclick = () => {
  pending = null;
  setStatus('Cancelled. Nothing was published.');
  mode('idle');
};
btn.openPr.onclick = () => post({ type: 'open-url', url: prUrl });
btn.settings.onclick = () => showSettings(true);
btn.closeSettings.onclick = () => showSettings(false);
btn.save.onclick = () => {
  settings = readSettings();
  post({ type: 'save-settings', settings });
};
$('cancel').onclick = () => post({ type: 'cancel' });

window.onmessage = (event: MessageEvent) => {
  const msg = (event.data as { pluginMessage?: FromPlugin } | null)?.pluginMessage;
  if (!msg) return;
  switch (msg.type) {
    case 'tokens':
      if (msg.purpose === 'download') download(msg.payload, msg.counts, msg.warnings);
      else void startPreview(msg.payload, msg.counts, msg.warnings);
      return;
    case 'settings':
      settings = { ...DEFAULT_SETTINGS, ...(msg.settings ?? {}) };
      if (!settings.token)
        setStatus('Download works now. To publish, open Settings and add a GitHub token.');
      return;
    case 'settings-saved':
      showSettings(false);
      setStatus('✓ Settings saved on this computer.', 'ok');
      return;
    case 'status':
      setStatus(msg.text);
      return;
    case 'error':
      setStatus(`✗ ${msg.message}`, 'error');
      mode('idle');
      return;
  }
};

mode('idle');
post({ type: 'load-settings' });
